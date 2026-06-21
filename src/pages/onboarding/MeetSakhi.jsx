import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MeetSakhi() {
  const navigate = useNavigate();

  return (
    <div className="screen flex flex-col justify-between min-h-screen">

      {/* Progress */}
      <div>
        <div className="flex gap-1 mb-4">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div
              key={s}
              className="h-1 flex-1 rounded-full bg-mauve"
            />
          ))}
        </div>
        <p className="text-xs text-muted-rose mb-6">Step 6 of 6</p>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-blush flex items-center justify-center text-4xl mb-3">
            🌙
          </div>
          <h1 className="font-playfair text-3xl font-bold text-charcoal mb-1">
            Meet Sakhi
          </h1>
          <p className="text-muted-rose text-xs">Your personal companion</p>
        </div>

        {/* Description */}
        <div className="card mb-4">
          <p className="text-charcoal text-sm leading-relaxed">
            Sakhi is always here — not just around your cycle.
            Any day, any time, she will listen before she ever
            offers advice. She will never judge you. She will
            never reduce what you feel to just hormones.
          </p>
        </div>

        {/* Opening message */}
        <div className="flex gap-2 items-start">
          <div className="w-8 h-8 rounded-full bg-blush flex items-center justify-center text-sm flex-shrink-0">
            🌙
          </div>
          <div className="bg-blush rounded-2xl rounded-bl-sm px-4 py-3 flex-1">
            <p className="text-charcoal text-sm italic leading-relaxed">
              "Hey. I'm really glad you're here. I'm Sakhi —
              not a doctor, not a bot that throws advice at you.
              Just someone who genuinely listens.
              What's going on today?"
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-3 pb-4">
        <button
          onClick={() => navigate('/onboarding/all-set')}
          className="btn-primary"
        >
          I'd like to meet her 🌙
        </button>
        <button
          onClick={() => navigate('/home')}
          className="w-full text-center text-muted-rose text-sm"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}