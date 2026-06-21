import React, { useState, useRef, useEffect } from 'react';
import { auth, db } from '../../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { calculateWellnessTargets } from '../../utils/wellnessCalculator';

const SETUP_QUESTIONS = [
  {
    key: 'setupName',
    message: "Hey! I'm Sakhi. Before we set up your wellness plan, I'd love to get to know you better. What's your name?",
    inputType: 'text',
    placeholder: 'Your first name...',
    saveKey: 'name',
  },
  {
    key: 'setupAge',
    message: (data) => `Lovely to meet you, ${data.name || 'you'}! How old are you?`,
    inputType: 'number',
    placeholder: 'Your age...',
    saveKey: 'age',
  },
  {
    key: 'setupHeight',
    message: "What's your height in centimetres? For example, if you're 5'4\", that's about 163cm.",
    inputType: 'number',
    placeholder: 'Height in cm...',
    saveKey: 'height',
  },
  {
    key: 'setupWeight',
    message: "And your current weight in kilograms? This helps me calculate your daily nutrition targets.",
    inputType: 'number',
    placeholder: 'Weight in kg...',
    saveKey: 'weight',
  },
  {
    key: 'setupActivity',
    message: "How would you describe your daily activity level?",
    inputType: 'choice',
    choices: [
      { label: 'Mostly sitting — desk job or student', value: 'sedentary' },
      { label: 'Light movement — some walking daily', value: 'light' },
      { label: 'Moderately active — regular exercise', value: 'moderate' },
      { label: 'Very active — intense exercise most days', value: 'active' },
    ],
    saveKey: 'activityLevel',
  },
  {
    key: 'setupGoal',
    message: "What is your main health goal right now?",
    inputType: 'choice',
    choices: [
      { label: 'Manage my weight and feel lighter', value: 'lose' },
      { label: 'Maintain my current weight', value: 'maintain' },
      { label: 'Build strength and gain weight', value: 'gain' },
    ],
    saveKey: 'goal',
  },
  {
    key: 'setupDiet',
    message: "Are you vegetarian or non-vegetarian? This helps me suggest the right protein sources for you.",
    inputType: 'choice',
    choices: [
      { label: 'Vegetarian', value: 'vegetarian' },
      { label: 'Non-vegetarian', value: 'non-vegetarian' },
      { label: 'Vegan', value: 'vegan' },
    ],
    saveKey: 'dietType',
  },
  {
    key: 'setupSymptoms',
    message: "Which PMOS symptoms do you experience? Select all that apply.",
    inputType: 'multiChoice',
    choices: [
      { label: 'Acne', value: 'acne' },
      { label: 'Hair fall', value: 'hair_fall' },
      { label: 'Facial hair', value: 'facial_hair' },
      { label: 'Weight gain', value: 'weight_gain' },
      { label: 'Fatigue', value: 'fatigue' },
      { label: 'Mood swings', value: 'mood_swings' },
      { label: 'Bloating', value: 'bloating' },
      { label: 'Sugar cravings', value: 'cravings' },
    ],
    saveKey: 'symptoms',
  },
];

export default function WellnessSetup() {
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [collectedData, setCollectedData] = useState({});
  const [input, setInput] = useState('');
  const [selectedChoices, setSelectedChoices] = useState([]);
  const [done, setDone] = useState(false);
  const [targets, setTargets] = useState(null);
  const [saving, setSaving] = useState(false);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Start the conversation
    const firstQ = SETUP_QUESTIONS[0];
    setMessages([{ sender: 'sakhi', text: firstQ.message }]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function getCurrentQuestion() {
    return SETUP_QUESTIONS[currentStep];
  }

  async function handleAnswer(value, displayValue) {
    const question = getCurrentQuestion();
    const newData = { ...collectedData, [question.saveKey]: value };
    setCollectedData(newData);

    // Add user message
    const userDisplay = Array.isArray(value) ? value.join(', ') : (displayValue || value);
    setMessages(prev => [...prev, { sender: 'user', text: String(userDisplay) }]);
    setInput('');
    setSelectedChoices([]);

    // Small delay then next question
    await new Promise(r => setTimeout(r, 600));

    const nextStep = currentStep + 1;

    if (nextStep < SETUP_QUESTIONS.length) {
      const nextQ = SETUP_QUESTIONS[nextStep];
      const nextMessage = typeof nextQ.message === 'function'
        ? nextQ.message(newData)
        : nextQ.message;

      setMessages(prev => [...prev, { sender: 'sakhi', text: nextMessage }]);
      setCurrentStep(nextStep);
    } else {
      // All questions answered — calculate targets
      await finishSetup(newData);
    }
  }

  async function finishSetup(data) {
    const calculated = calculateWellnessTargets({
      weight: parseFloat(data.weight),
      height: parseFloat(data.height),
      age: parseInt(data.age),
      activityLevel: data.activityLevel || 'light',
      goal: data.goal || 'maintain',
      hasPMOS: true,
    });

    setTargets(calculated);

    const summaryMessage = `Perfect, ${data.name}! I've created your personalised wellness plan. 

Here's what your body needs every day:

🍎 ${calculated.calories} calories
🥩 ${calculated.protein}g protein  
🥦 ${calculated.fibre}g fibre
💧 ${calculated.water}L water
🌙 ${calculated.sleep} hours sleep
👟 ${calculated.steps.toLocaleString()} steps
🏃 ${calculated.exercise} minutes exercise

These targets are personalised for your weight, height, activity level, and PMOS. They will automatically update as your body changes. Ready to see your wellness dashboard?`;

    setMessages(prev => [...prev, { sender: 'sakhi', text: summaryMessage }]);

    // Save to Firebase
    try {
      setSaving(true);
      const user = auth.currentUser;
      await setDoc(doc(db, 'users', user.uid), {
        ...data,
        wellnessTargets: calculated,
        wellnessSetupComplete: true,
      }, { merge: true });
    } catch (error) {
      console.log('Save error:', error);
    }
    setSaving(false);
    setDone(true);
  }

  const currentQ = getCurrentQuestion();

  return (
    <div className="flex flex-col max-w-sm mx-auto h-screen bg-cream">

      {/* Header */}
      <div className="bg-white shadow-warm px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="text-mauve text-lg"
        >←</button>
        <div className="w-9 h-9 rounded-full bg-blush flex items-center justify-center">
          🌙
        </div>
        <div>
          <p className="font-playfair font-semibold text-charcoal text-base">Sakhi</p>
          <p className="text-muted-rose text-xs">Setting up your wellness plan</p>
        </div>
        {!done && (
          <div className="ml-auto text-xs text-muted-rose">
            {currentStep + 1}/{SETUP_QUESTIONS.length}
          </div>
        )}
      </div>

      {/* Progress bar */}
      {!done && (
        <div className="h-1 bg-blush">
          <div
            className="h-1 bg-mauve transition-all duration-500"
            style={{ width: `${((currentStep) / SETUP_QUESTIONS.length) * 100}%` }}
          />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-40">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'sakhi' && (
              <div className="w-6 h-6 rounded-full bg-blush flex items-center justify-center text-xs mr-2 mt-1 flex-shrink-0">
                🌙
              </div>
            )}
            <div
              className={`max-w-xs px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                msg.sender === 'user'
                  ? 'bg-mauve text-white rounded-br-sm'
                  : 'bg-blush text-charcoal rounded-bl-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      {!done && (
        <div className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto bg-white border-t border-blush px-4 py-3">

          {currentQ?.inputType === 'text' || currentQ?.inputType === 'number' ? (
            <div className="flex gap-2">
              <input
                type={currentQ.inputType}
                placeholder={currentQ.placeholder}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && input.trim()) {
                    handleAnswer(input.trim());
                  }
                }}
                className="flex-1 bg-blush rounded-pill px-4 py-2 text-sm text-charcoal placeholder-muted-rose focus:outline-none focus:ring-2 focus:ring-mauve"
              />
              <button
                onClick={() => input.trim() && handleAnswer(input.trim())}
                disabled={!input.trim()}
                className="w-9 h-9 bg-mauve rounded-full flex items-center justify-center disabled:opacity-40"
              >
                <span className="text-white text-sm">→</span>
              </button>
            </div>
          ) : currentQ?.inputType === 'choice' ? (
            <div className="space-y-2">
              {currentQ.choices.map(choice => (
                <button
                  key={choice.value}
                  onClick={() => handleAnswer(choice.value, choice.label)}
                  className="w-full text-left px-4 py-2.5 bg-blush rounded-xl text-charcoal text-sm hover:bg-mauve hover:text-white transition-colors"
                >
                  {choice.label}
                </button>
              ))}
            </div>
          ) : currentQ?.inputType === 'multiChoice' ? (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 mb-2">
                {currentQ.choices.map(choice => (
                  <button
                    key={choice.value}
                    onClick={() => {
                      setSelectedChoices(prev =>
                        prev.includes(choice.value)
                          ? prev.filter(v => v !== choice.value)
                          : [...prev, choice.value]
                      );
                    }}
                    className={`px-3 py-1 rounded-pill text-xs border transition-colors ${
                      selectedChoices.includes(choice.value)
                        ? 'bg-mauve text-white border-mauve'
                        : 'border-muted-rose text-muted-rose'
                    }`}
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handleAnswer(selectedChoices, selectedChoices.join(', '))}
                className="btn-primary py-2 text-sm"
              >
                Continue →
              </button>
            </div>
          ) : null}

        </div>
      )}

      {/* Done — navigate to dashboard */}
      {done && (
        <div className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto bg-white border-t border-blush px-4 py-4">
          <button
            onClick={() => navigate('/wellness')}
            className="btn-primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'See my wellness dashboard →'}
          </button>
        </div>
      )}

    </div>
  );
}