import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from '../../firebase/config';
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  limit,
} from 'firebase/firestore';
import Navbar from '../../components/Navbar';

const RESPONSE_BANK = [
  {
    keywords: ['heavy', 'burden', 'weight', 'overwhelmed'],
    response:
      "I hear you. That kind of heavy is real — not dramatic, not weakness. Just heavy. Do you want to talk about what happened, or did you just need to say it out loud?",
  },
  {
    keywords: ['bad person', 'terrible', 'horrible', 'hate myself'],
    response:
      "I want to gently push back on that. From everything you've shared, I see someone who is trying really hard in a body that makes everything a little harder than it should be. That is not a bad person. That is someone who deserves more support than they are getting.",
  },
  {
    keywords: ['tired', 'exhausted', 'fatigue', 'no energy', 'drained'],
    response:
      "You've been feeling tired. Have you eaten something today? Sometimes when everything feels like too much, the basics get forgotten — and that makes everything heavier.",
  },
  {
    keywords: ['cry', 'crying', 'tears', 'sobbing', 'broke down'],
    response:
      "Crying is not weakness. Sometimes it is the only honest thing your body knows how to do. What happened?",
  },
  {
    keywords: ['angry', 'irritated', 'frustrated', 'rage', 'annoyed'],
    response:
      "That frustration is valid. PMOS can make emotions feel more intense than usual — not because you are overreacting, but because your nervous system is genuinely working harder. What set it off?",
  },
  {
    keywords: ['anxious', 'anxiety', 'panic', 'scared', 'fear', 'worried'],
    response:
      "Anxiety with PMOS is real and it is common. Your body is not betraying you — it is overwhelmed. Can you tell me more about what is making you feel this way right now?",
  },
  {
    keywords: ['alone', 'lonely', 'no one', 'nobody', 'isolated'],
    response:
      "Feeling alone with this is one of the hardest parts of PMOS. Most people around us have not lived it so they cannot fully understand. But you are not alone right now. I am here.",
  },
  {
    keywords: ['period', 'cycle', 'irregular', 'late', 'missed'],
    response:
      "Irregular cycles are one of the most exhausting parts of PMOS — the uncertainty is its own kind of stress. Are you tracking your cycle in the app? It can help find patterns even when things feel unpredictable.",
  },
  {
    keywords: ['pain', 'cramps', 'hurting', 'aching', 'uncomfortable'],
    response:
      "Physical pain on top of everything else is a lot. Have you been able to rest today? Warmth sometimes helps — a heating pad, a warm drink, anything gentle.",
  },
  {
    keywords: ['happy', 'good', 'great', 'better', 'okay', 'fine'],
    response:
      "I am really glad to hear that. Good days matter. What is making today feel lighter?",
  },
  {
    keywords: ['doctor', 'appointment', 'gynaecologist', 'gynecologist', 'hospital'],
    response:
      "Doctor visits can feel daunting. The Doctor Prep tool in the app can help you build a symptom summary to bring with you — so you do not have to remember everything in the moment.",
  },
  {
    keywords: ['food', 'eating', 'diet', 'hungry', 'meal'],
    response:
      "Food and PMOS have a real relationship. For now though — have you eaten today? That is the most important question before anything else.",
  },
  {
    keywords: ['sleep', 'insomnia', 'awake', 'cant sleep', 'restless'],
    response:
      "Poor sleep makes everything harder — mood, energy, symptoms. Your body is already working overtime. Is something keeping you awake or is it just not coming?",
  },
  {
    keywords: ['relationship', 'friend', 'family', 'partner', 'boyfriend', 'girlfriend'],
    response:
      "Relationships are complicated when you are managing something people around you cannot see. Do you want to talk about what is happening?",
  },
];

const OPENING_MESSAGE = {
  sender: 'sakhi',
  text: "Hey. I'm really glad you're here. I'm Sakhi — not a doctor, not a bot that throws advice at you. Just someone who genuinely listens. What's going on today?",
};

function getResponse(userText) {
  const lower = userText.toLowerCase();
  for (const item of RESPONSE_BANK) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      return item.response;
    }
  }
  return "Thank you for sharing that with me. Can you tell me a little more about what is going on? I want to make sure I understand.";
}

export default function Sakhi() {
  const [messages, setMessages] = useState([OPENING_MESSAGE]);
  const [input, setInput] = useState('');
  const [justListen, setJustListen] = useState(false);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  async function handleSend() {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setTyping(true);

    await new Promise((r) => setTimeout(r, 1200));

    setTyping(false);

    if (!justListen) {
      const response = getResponse(userMessage.text);
      setMessages((prev) => [
        ...prev,
        { sender: 'sakhi', text: response },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'sakhi',
          text: "I hear you.",
        },
      ]);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col max-w-sm mx-auto h-screen bg-cream">

      {/* Header */}
      <div className="bg-white shadow-warm px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <div className="w-9 h-9 rounded-full bg-blush flex items-center justify-center text-lg">
          🌙
        </div>
        <div>
          <p className="font-playfair font-semibold text-charcoal text-base">
            Sakhi
          </p>
          <p className="text-muted-rose text-xs">
            Always here. Never judging.
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-36">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-mauve text-white rounded-br-sm'
                  : 'bg-blush text-charcoal italic rounded-bl-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-blush px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1 items-center h-4">
                <div className="w-2 h-2 bg-muted-rose rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-muted-rose rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-muted-rose rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="fixed bottom-16 left-0 right-0 max-w-sm mx-auto bg-white border-t border-blush px-3 py-2 flex items-center gap-2">

        {/* Just Listen Toggle */}
        <button
          onClick={() => setJustListen(!justListen)}
          className={`flex-shrink-0 text-xs px-2 py-1 rounded-pill border transition-colors ${
            justListen
              ? 'bg-sage text-white border-sage'
              : 'border-muted-rose text-muted-rose'
          }`}
        >
          {justListen ? 'Listening' : 'Just listen'}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Say anything..."
          className="flex-1 bg-blush rounded-pill px-3 py-2 text-sm text-charcoal placeholder-muted-rose focus:outline-none focus:ring-2 focus:ring-mauve"
        />

        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="w-8 h-8 bg-mauve rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40"
        >
          <span className="text-white text-sm">→</span>
        </button>
      </div>

      <div className="h-16" />
      <Navbar />
    </div>
  );
}