import React from 'react';

import {
  Link
} from 'react-router-dom';

export default function Navbar() {

  return (

    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-around max-w-sm mx-auto">

      <Link to="/home">
        Home
      </Link>

      <Link to="/cycle">
        Cycle
      </Link>

      <Link to="/checkin">
        Check-In
      </Link>

      <Link to="/sakhi">
        Sakhi
      </Link>

    </div>

  );
}