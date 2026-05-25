import React, { useState } from 'react';

import { auth, db } from '../../firebase/config';

import {
  doc,
  setDoc
} from 'firebase/firestore';

export default function Goals() {

  const [goal, setGoal] = useState('');

  async function handleSubmit(e) {

    e.preventDefault();

    try {

      const user = auth.currentUser;

      await setDoc(
        doc(db, 'users', user.uid),
        {
          goal,
        },
        { merge: true }
      );

      alert('Goals saved!');

    } catch (error) {

      alert(error.message);

    }

  }

  return (

    <div className="screen">

      <h1 className="page-title mb-6">
        Your Goal
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <select
          className="input-field"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        >

          <option value="">
            Select your goal
          </option>

          <option value="track-cycle">
            Track my cycle
          </option>

          <option value="understand-symptoms">
            Understand symptoms
          </option>

          <option value="improve-health">
            Improve hormonal health
          </option>

        </select>

        <button
          type="submit"
          className="btn-primary"
        >
          Continue
        </button>

      </form>

    </div>

  );
}