import React from 'react';

import { Link } from 'react-router-dom';

export default function AllSet() {

  return (

    <div className="screen flex flex-col justify-center">

      <h1 className="page-title mb-6">
        You're All Set 🎉
      </h1>

      <p className="text-sm text-muted-rose mb-8">

        Your onboarding is complete.

      </p>

      <Link
        to="/home"
        className="btn-primary text-center"
      >
        Go To Dashboard
      </Link>

    </div>

  );
}