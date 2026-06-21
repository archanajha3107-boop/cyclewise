import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';

export default function AllSet() {
  const navigate = useNavigate();

  return (
    <div className="screen flex flex-col items-center justify-center min-h-screen text-center">

      <div className="mb-6">
        <Logo size={60} />
      </div>

      <div className="w-14 h-14 rounded-full bg-sage flex items-center justify-center text-2xl mb-5">
        ✓
      </div>

      <h1 className="font-playfair text-3xl font-bold text-charcoal mb-3">
        You're all set.
      </h1>

      <p className="text-muted-rose text-sm leading-relaxed mb-8 max-w-xs">
        Your space is ready. Everything here is private,
        judgment-free, and built around you.
      </p>

      <div className="flex gap-3 justify-center mb-8">
        {['Screening', 'Understanding', 'Support'].map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-mauve" />
              <p className="text-xs text-muted-rose mt-1">{step}</p>
            </div>
            {i < 2 && <div className="w-6 h-px bg-blush mb-4" />}
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/home')}
        className="btn-primary max-w-xs w-full"
      >
        Take me in 🌙
      </button>
    </div>
  );
}