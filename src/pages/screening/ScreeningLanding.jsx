import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ScreeningLanding() {
  const navigate = useNavigate();

  return (
    <div className="screen flex flex-col justify-between min-h-screen">
      <div>
        <div className="flex items-center gap-2 mb-8">
          <span className="text-2xl">🌙</span>
          <span className="font-playfair font-bold text-mauve text-lg">
            CycleWise
          </span>
        </div>

        <div className="bg-mauve rounded-3xl p-6 mb-6 text-center">
          <div className="text-5xl mb-4">🌙</div>
          <h1 className="font-playfair text-white text-2xl font-bold mb-2 leading-tight">
            Could you have PMOS?
          </h1>
          <p className="text-white/80 text-sm leading-relaxed">
            Answer 15 simple questions.
            Get a private, personalised result.
            Takes less than 5 minutes.
          </p>
        </div>

        <div className="flex justify-around mb-6">
          {[
            { icon: '🔒', label: 'Private' },
            { icon: '⏱️', label: '5 minutes' },
            { icon: '💝', label: 'Free' },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1">
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs text-muted-rose">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <button
          onClick={() => navigate('/screening/questions')}
          className="btn-primary mb-3"
        >
          Start screening
        </button>
        <p className="text-xs text-muted-rose text-center leading-relaxed">
          This is not a diagnosis. Only a doctor can diagnose PMOS.
          This screening helps you understand your risk.
        </p>
      </div>
    </div>
  );
}