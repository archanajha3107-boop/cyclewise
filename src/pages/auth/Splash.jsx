import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const user = auth.currentUser;
      navigate(user ? '/home' : '/welcome');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center relative overflow-hidden">

      {/* Background soft circles */}
      <div className="absolute top-20 right-10 w-32 h-32 rounded-full bg-blush opacity-60" />
      <div className="absolute bottom-32 left-8 w-20 h-20 rounded-full bg-blush opacity-40" />
      <div className="absolute top-40 left-16 w-12 h-12 rounded-full bg-mauve opacity-10" />

      {/* Logo Mark */}
      <div className="flex flex-col items-center gap-5 z-10">

        {/* SVG Logo — crescent moon with lotus leaf */}
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer crescent moon */}
          <path
            d="M50 10 C28 10 10 28 10 50 C10 72 28 90 50 90 C38 80 30 66 30 50 C30 34 38 20 50 10Z"
            fill="#9B6B8A"
            opacity="0.9"
          />
          {/* Inner crescent lighter */}
          <path
            d="M50 18 C33 18 20 33 20 50 C20 67 33 82 50 82 C40 73 34 62 34 50 C34 38 40 27 50 18Z"
            fill="#C4A8BB"
            opacity="0.6"
          />
          {/* Lotus petal 1 — center */}
          <path
            d="M52 55 C52 45 56 38 60 35 C60 35 63 45 58 55Z"
            fill="#C4836A"
            opacity="0.95"
          />
          {/* Lotus petal 2 — left */}
          <path
            d="M52 55 C48 46 43 41 40 40 C40 40 42 50 50 56Z"
            fill="#C4836A"
            opacity="0.75"
          />
          {/* Lotus petal 3 — right */}
          <path
            d="M52 55 C56 46 62 43 65 43 C65 43 63 53 55 57Z"
            fill="#C4836A"
            opacity="0.75"
          />
          {/* Lotus stem */}
          <path
            d="M52 55 C52 60 51 65 50 70"
            stroke="#C4836A"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Small leaf on stem */}
          <path
            d="M51 63 C51 63 46 60 45 55 C47 57 51 63 51 63Z"
            fill="#7A9E87"
            opacity="0.8"
          />
        </svg>

        {/* Wordmark */}
        <div className="text-center">
          <h1 className="font-playfair text-4xl font-bold">
            <span className="text-mauve">Cycle</span>
            <span className="text-terra">Wise</span>
          </h1>
          <p className="text-muted-rose text-sm mt-1 tracking-wide">
            Know yourself. Heal yourself.
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2 mt-4">
          {[0, 200, 400].map((delay) => (
            <div
              key={delay}
              className="w-2 h-2 bg-mauve rounded-full animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}