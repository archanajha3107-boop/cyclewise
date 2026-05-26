import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const MOODS = [
  { emoji: '😔', label: 'Very low', value: 1 },
  { emoji: '😕', label: 'Low', value: 2 },
  { emoji: '😐', label: 'Okay', value: 3 },
  { emoji: '🙂', label: 'Good', value: 4 },
  { emoji: '😊', label: 'Great', value: 5 },
];

const SYMPTOMS = [
  'Tired', 'Anxious', 'Bloated',
  'Headache', 'Acne', 'Cramps',
  'Low mood', 'Brain fog',
  'Restless sleep', 'None of these',
];

const SLEEP = ['Poor', 'Okay', 'Well'];

export default function DailyCheckIn() {
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [sleep, setSleep] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    async function check() {
      const user = auth.currentUser;
      if (!user) return;
      const ref = doc(db, 'users', user.uid, 'dailyLogs', todayStr);
      const snap = await getDoc(ref);
      if (snap.exists()) setAlreadyDone(true);
    }
    check();
  }, [todayStr]);

  function toggleSymptom(s) {
    if (s === 'None of these') {
      setSymptoms(['None of these']);
      return;
    }
    setSymptoms((prev) => {
      const without = prev.filter((x) => x !== 'None of these');
      return without.includes(s)
        ? without.filter((x) => x !== s)
        : [...without, s];
    });
  }

  async function handleSave() {
    try {
      setSaving(true);
      const user = auth.currentUser;
      await setDoc(
        doc(db, 'users', user.uid, 'dailyLogs', todayStr),
        {
          date: todayStr,
          mood,
          symptoms,
          sleep,
          createdAt: new Date().toISOString(),
        }
      );
      setDone(true);
    } catch (error) {
      alert('Could not save. Please try again.');
    }
    setSaving(false);
  }

  // Already checked in today
  if (alreadyDone && !done) {
    return (
      <div className="screen flex flex-col items-center justify-center text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="page-title mb-2">
          Already checked in today
        </h1>
        <p className="text-muted-rose text-sm mb-6">
          Come back tomorrow. Every day counts.
        </p>
        <button
          onClick={() => navigate('/home')}
          className="btn-primary"
        >
          Go to home
        </button>
        <Navbar />
      </div>
    );
  }

  // Completion screen
  if (done) {
    const insight = mood <= 2
      ? "You've been feeling low. That is okay. Rest is productive too."
      : mood >= 4
      ? "You're feeling good today. Hold onto that energy."
      : "Every check-in builds a picture of your health. You're doing great.";

    return (
      <div className="screen flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-sage flex items-center justify-center text-3xl mb-4">
          ✓
        </div>
        <h1 className="page-title mb-2 text-sage">
          Thank you for checking in.
        </h1>
        <p className="text-muted-rose text-sm mb-4">
          Every log helps us understand your pattern better.
        </p>
        <div className="card w-full text-left mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-terra">💡</span>
            <span className="section-label text-terra">
              Pattern spotted
            </span>
          </div>
          <p className="text-charcoal text-sm leading-relaxed">
            {insight}
          </p>
        </div>
        <button
          onClick={() => navigate('/home')}
          className="btn-primary"
        >
          Go to home
        </button>
        <Navbar />
      </div>
    );
  }

  return (
    <div className="screen pb-24">

      {/* Progress Bar */}
      <div className="flex gap-1 mb-6">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors ${
              s <= step ? 'bg-mauve' : 'bg-blush'
            }`}
          />
        ))}
      </div>

      <p className="text-xs text-muted-rose mb-1">
        Step {step} of 3
      </p>

      {/* Step 1 — Mood */}
      {step === 1 && (
        <div>
          <h1 className="page-title mb-2">
            How are you feeling today?
          </h1>
          <p className="text-muted-rose text-sm mb-8">
            30 seconds. That's all.
          </p>
          <div className="flex justify-between mb-8">
            {MOODS.map((m) => (
              <button
                key={m.value}
                onClick={() => setMood(m.value)}
                className="flex flex-col items-center gap-1"
              >
                <span
                  className={`text-3xl transition-transform ${
                    mood === m.value ? 'scale-125' : 'scale-100'
                  }`}
                >
                  {m.emoji}
                </span>
                <span
                  className={`text-xs ${
                    mood === m.value
                      ? 'text-mauve font-medium'
                      : 'text-muted-rose'
                  }`}
                >
                  {m.label}
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!mood}
            className="btn-primary"
          >
            Next
          </button>
        </div>
      )}

      {/* Step 2 — Symptoms */}
      {step === 2 && (
        <div>
          <h1 className="page-title mb-2">
            Any symptoms today?
          </h1>
          <p className="text-muted-rose text-sm mb-6">
            Tap everything that applies. Or nothing at all.
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            {SYMPTOMS.map((s) => (
              <button
                key={s}
                onClick={() => toggleSymptom(s)}
                className={`px-3 py-1.5 rounded-pill text-sm border transition-colors ${
                  symptoms.includes(s)
                    ? 'bg-mauve text-white border-mauve'
                    : 'border-muted-rose text-muted-rose'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStep(1)}
              className="btn-secondary flex-1"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="btn-primary flex-1"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Sleep */}
      {step === 3 && (
        <div>
          <h1 className="page-title mb-2">
            How did you sleep?
          </h1>
          <p className="text-muted-rose text-sm mb-6">
            Sleep affects everything with PMOS.
          </p>
          <div className="flex gap-3 mb-8">
            {SLEEP.map((s) => (
              <button
                key={s}
                onClick={() => setSleep(s)}
                className={`flex-1 py-4 rounded-2xl text-sm font-medium border transition-colors ${
                  sleep === s
                    ? 'bg-mauve text-white border-mauve'
                    : 'bg-blush border-blush text-charcoal'
                }`}
              >
                {s === 'Poor' ? '😞' : s === 'Okay' ? '😌' : '😴'}
                <br />
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStep(2)}
              className="btn-secondary flex-1"
            >
              Back
            </button>
            <button
              onClick={handleSave}
              disabled={!sleep || saving}
              className="btn-primary flex-1"
            >
              {saving ? 'Saving...' : 'Save check-in'}
            </button>
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
}