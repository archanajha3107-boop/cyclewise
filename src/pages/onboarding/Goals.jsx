import React, { useState } from 'react';
import { auth, db } from '../../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const GOAL_OPTIONS = [
  { icon: '📅', label: 'Track my cycle accurately', desc: 'Understand my pattern', value: 'track_cycle' },
  { icon: '🔍', label: 'Understand my symptoms', desc: 'Connect symptoms to my cycle', value: 'understand_symptoms' },
  { icon: '💝', label: 'Find emotional support', desc: 'Talk to Sakhi anytime', value: 'emotional_support' },
  { icon: '👥', label: 'Connect with others', desc: 'Find people who understand', value: 'community' },
  { icon: '🩺', label: 'Prepare for doctor visits', desc: 'Build symptom reports', value: 'doctor_prep' },
  { icon: '📚', label: 'Learn about PMOS', desc: 'Evidence-based information', value: 'education' },
  { icon: '🏃', label: 'Get workout suggestions', desc: 'Cycle-phase based fitness', value: 'workouts' },
  { icon: '🍎', label: 'Improve my nutrition', desc: 'PMOS-friendly food guidance', value: 'nutrition' },
];

export default function Goals() {
  const [selected, setSelected] = useState([]);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  function toggle(value) {
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  }

  async function handleSave() {
    try {
      setSaving(true);
      const user = auth.currentUser;
      await setDoc(
        doc(db, 'users', user.uid),
        { goals: selected, onboardingComplete: true },
        { merge: true }
      );
      navigate('/onboarding/meet-sakhi');
    } catch (error) {
      alert('Could not save. Please try again.');
    }
    setSaving(false);
  }

  return (
    <div className="screen pb-10">

      {/* Progress */}
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5, 6].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full ${s <= 5 ? 'bg-mauve' : 'bg-blush'}`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-rose mb-2">Step 5 of 6</p>

      <h1 className="page-title mb-1">
        What do you want from CycleWise?
      </h1>
      <p className="text-muted-rose text-sm mb-5">
        Choose as many as feel right.
      </p>

      <div className="space-y-2 mb-6">
        {GOAL_OPTIONS.map((goal) => {
          const isSelected = selected.includes(goal.value);
          return (
            <button
              key={goal.value}
              onClick={() => toggle(goal.value)}
              className={`w-full text-left flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                isSelected
                  ? 'border-mauve bg-mauve/5'
                  : 'border-blush bg-blush'
              }`}
            >
              <span className="text-xl">{goal.icon}</span>
              <div className="flex-1">
                <p className={`text-sm font-medium ${isSelected ? 'text-mauve' : 'text-charcoal'}`}>
                  {goal.label}
                </p>
                <p className="text-xs text-muted-rose mt-0.5">{goal.desc}</p>
              </div>
              {isSelected && (
                <span className="text-mauve text-sm">✓</span>
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-primary"
      >
        {saving ? 'Saving...' : 'Continue →'}
      </button>

      <button
        onClick={() => navigate('/onboarding/meet-sakhi')}
        className="w-full text-center text-muted-rose text-sm mt-3"
      >
        Skip for now
      </button>
    </div>
  );
}