import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();

  const [toggles, setToggles] = useState({
    dailyCheckin: true,
    sakhiCheckin: true,
    weeklyTopic: true,
    cyclePredictions: true,
    doctorReminder: false,
    anonymousByDefault: false,
  });

  function toggle(key) {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const reminders = [
    { key: 'dailyCheckin', label: 'Daily check-in reminder', desc: 'A gentle nudge every morning' },
    { key: 'sakhiCheckin', label: 'Sakhi check-in', desc: "Sakhi will check in if you've been away 3+ days" },
    { key: 'weeklyTopic', label: 'Weekly community topic', desc: 'When a new discussion topic is posted' },
    { key: 'cyclePredictions', label: 'Cycle predictions', desc: 'Heads up when your period window is approaching' },
    { key: 'doctorReminder', label: 'Doctor prep reminder', desc: 'Monthly reminder to update your health report' },
  ];

  return (
    <div className="screen pb-10">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/profile')}
          className="text-mauve text-lg"
        >
          ←
        </button>
        <h1 className="page-title text-xl">Settings</h1>
      </div>

      {/* Reminders */}
      <p className="section-label mb-3">Reminders</p>
      <div className="card space-y-0 p-0 overflow-hidden mb-4">
        {reminders.map((item, index) => (
          <div
            key={item.key}
            className={`flex items-center justify-between px-4 py-3 ${
              index !== 0 ? 'border-t border-blush' : ''
            }`}
          >
            <div className="flex-1 pr-4">
              <p className="text-charcoal text-sm font-medium">
                {item.label}
              </p>
              <p className="text-muted-rose text-xs mt-0.5">
                {item.desc}
              </p>
            </div>
            <button
              onClick={() => toggle(item.key)}
              className={`w-10 h-6 rounded-full transition-colors flex-shrink-0 ${
                toggles[item.key] ? 'bg-sage' : 'bg-gray-200'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-1 ${
                  toggles[item.key] ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Privacy */}
      <p className="section-label mb-3">Privacy</p>
      <div className="card space-y-0 p-0 overflow-hidden mb-6">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex-1 pr-4">
            <p className="text-charcoal text-sm font-medium">
              Anonymous in community by default
            </p>
            <p className="text-muted-rose text-xs mt-0.5">
              Your name won't show on posts
            </p>
          </div>
          <button
            onClick={() => toggle('anonymousByDefault')}
            className={`w-10 h-6 rounded-full transition-colors flex-shrink-0 ${
              toggles.anonymousByDefault ? 'bg-sage' : 'bg-gray-200'
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-1 ${
                toggles.anonymousByDefault
                  ? 'translate-x-4'
                  : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      <button className="text-mauve text-sm font-medium w-full text-center mb-3">
        Download my data
      </button>
      <button className="text-danger text-sm font-medium w-full text-center">
        Delete my account
      </button>
    </div>
  );
}