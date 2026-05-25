import React from 'react';

import Navbar from '../../components/Navbar';

export default function CycleTracker() {

  return (

    <div className="screen">

      <h1 className="page-title mb-6">
        Cycle Tracker
      </h1>

      <div className="card">

        <p>
          Upcoming cycle predictions
          will appear here.
        </p>

      </div>

      <Navbar />

    </div>
    

  );
}