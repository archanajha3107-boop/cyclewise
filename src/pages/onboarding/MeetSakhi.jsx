import React from 'react';

import {
  Link
} from 'react-router-dom';

export default function MeetSakhi() {

  return (

    <div className="screen flex flex-col justify-center">

      <div className="mb-8">

        <p className="section-label mb-2">
          YOUR COMPANION
        </p>

        <h1 className="page-title">
          Meet Sakhi 🌸
        </h1>

      </div>

      <div className="card mb-6">

        <p className="text-sm leading-7 text-muted-rose">

          Sakhi is your wellness companion.

          She helps you understand:

          <br /><br />

          • hormonal patterns  
          • symptoms  
          • cycle health  
          • lifestyle triggers  
          • doctor preparation  

          <br /><br />

          Everything stays private
          and personalized for you.

        </p>

      </div>

      <Link
        to="/onboarding/all-set"
        className="btn-primary text-center"
      >
        Continue
      </Link>

    </div>

  );
}