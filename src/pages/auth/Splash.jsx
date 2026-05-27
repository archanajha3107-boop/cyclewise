import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { auth } from '../../firebase/config';

export default function Splash() {

  const navigate = useNavigate();

  useEffect(() => {

    const timer = setTimeout(() => {

      const user = auth.currentUser;

      navigate(
        user ? '/home' : '/welcome'
      );

    }, 2500);

    return () => clearTimeout(timer);

  }, [navigate]);

  return (

    <div className="min-h-screen bg-[#FAF7F4] flex flex-col items-center justify-center">

      <div className="flex flex-col items-center gap-4 animate-pulse">

        <div className="text-6xl">
          🌙
        </div>

        <div className="text-center">

          <h1 className="text-4xl font-bold text-purple-700">

            Cycle
            <span className="text-pink-500">
              Wise
            </span>

          </h1>

          <p className="text-gray-500 mt-2">
            Know yourself. Heal yourself.
          </p>

        </div>

      </div>

    </div>

  );

}