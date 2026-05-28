import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="screen flex flex-col justify-between min-h-screen">
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-6">🌙</div>
        <h1 className="font-playfair text-3xl font-bold text-charcoal mb-3 leading-tight">
          You are not alone.
        </h1>
        <p className="text-muted-rose text-sm leading-relaxed mb-2">
          CycleWise is a safe space built for every girl 
          living with PMOS — or wondering if they might be.
        </p>
        <p className="text-xs text-muted-rose/60">
          Previously known as PCOS
        </p>
      </div>

      <div className="space-y-3 pb-8">
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          Create my account
        </button>
        <button
          onClick={() => navigate('/login')}
          className="btn-secondary"
        >
          I already have an account
        </button>
        <p className="text-xs text-muted-rose text-center">
          Your data is always private. Never shared.
        </p>
      </div>
    </div>
  );
}