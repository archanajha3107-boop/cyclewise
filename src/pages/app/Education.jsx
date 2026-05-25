import React from 'react';

import Navbar from '../../components/Navbar';

export default function Education() {

  return (

    <div className="screen">

      <h1 className="page-title mb-6">
        Learn About PMOS
      </h1>

      <div className="space-y-4">

        <div className="card">

          <h2 className="font-bold mb-2">
            What is PMOS?
          </h2>

          <p className="text-sm text-muted-rose">

            PMOS is a hormonal condition
            affecting periods,
            metabolism,
            and ovulation.

          </p>

        </div>

        <div className="card">

          <h2 className="font-bold mb-2">
            Common Symptoms
          </h2>

          <p className="text-sm text-muted-rose">

            Acne,
            hair fall,
            weight gain,
            irregular cycles,
            fatigue.

          </p>

        </div>

      </div>
<Navbar />
    </div>

  );
}