import React, { useState } from 'react';

import { auth, db } from '../../firebase/config';

import {
  doc,
  setDoc
} from 'firebase/firestore';

export default function CycleHistory() {

  const [formData, setFormData] = useState({
    periodsPerYear: '',
    severePain: '',
  });

  function handleChange(e) {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  }

  async function handleSubmit(e) {

    e.preventDefault();

    try {

      const user = auth.currentUser;

      await setDoc(
        doc(db, 'users', user.uid),
        formData,
        { merge: true }
      );

      window.location.href =
'/onboarding/goals';

    } catch (error) {

      alert(error.message);

    }

  }

  return (

    <div className="screen">

      <h1 className="page-title mb-6">
        Cycle History
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <input
          type="number"
          name="periodsPerYear"
          placeholder="Periods per year"
          className="input-field"
          value={formData.periodsPerYear}
          onChange={handleChange}
        />

        <select
          name="severePain"
          className="input-field"
          value={formData.severePain}
          onChange={handleChange}
        >
          <option value="">Severe cramps?</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
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