import React, { useState } from 'react';

import { auth, db } from '../../firebase/config';

import {
  doc,
  setDoc
} from 'firebase/firestore';

export default function SymptomProfile() {

  const [formData, setFormData] = useState({
    acne: false,
    hairFall: false,
    weightGain: false,
    irregularPeriods: false,
  });

  function handleChange(e) {

    setFormData({
      ...formData,
      [e.target.name]: e.target.checked,
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
'/onboarding/cycle';
    } catch (error) {

      alert(error.message);

    }

  }

  return (

    <div className="screen">

      <h1 className="page-title mb-6">
        Symptom Profile
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="acne"
            onChange={handleChange}
          />
          Acne
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="hairFall"
            onChange={handleChange}
          />
          Hair Fall
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="weightGain"
            onChange={handleChange}
          />
          Weight Gain
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="irregularPeriods"
            onChange={handleChange}
          />
          Irregular Periods
        </label>

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