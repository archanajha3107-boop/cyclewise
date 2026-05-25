import React, { useState } from 'react';

import { auth, db } from '../../firebase/config';

import {
  doc,
  setDoc
} from 'firebase/firestore';

export default function HealthBackground() {

  const [formData, setFormData] = useState({
    pcosHistory: '',
    diabetes: '',
    thyroid: '',
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
'/onboarding/symptoms';
    } catch (error) {

      alert(error.message);

    }

  }

  return (

    <div className="screen">

      <h1 className="page-title mb-6">
        Health Background
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <select
          name="pcosHistory"
          className="input-field"
          value={formData.pcosHistory}
          onChange={handleChange}
        >
          <option value="">Family history of PCOS?</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>

        <select
          name="diabetes"
          className="input-field"
          value={formData.diabetes}
          onChange={handleChange}
        >
          <option value="">Diabetes?</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>

        <select
          name="thyroid"
          className="input-field"
          value={formData.thyroid}
          onChange={handleChange}
        >
          <option value="">Thyroid issues?</option>
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