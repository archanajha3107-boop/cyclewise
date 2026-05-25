import React, { useState } from 'react';

import { auth, db } from '../../firebase/config';

import {
  doc,
  setDoc
} from 'firebase/firestore';

export default function PersonalDetails() {

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    cycleLength: '',
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

      if (!user) {
        alert('Please login first');
        return;
      }

      await setDoc(
        doc(db, 'users', user.uid),
        {
          uid: user.uid,
          email: user.email,
          name: formData.name,
          age: formData.age,
          cycleLength: formData.cycleLength,
        },
        { merge: true }
      );

      window.location.href =
'/onboarding/health';

    } catch (error) {

      alert(error.message);

    }

  }

  return (

    <div className="screen">

      <h1 className="page-title mb-6">
        Personal Details
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          className="input-field"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="age"
          placeholder="Enter your age"
          className="input-field"
          value={formData.age}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="cycleLength"
          placeholder="Cycle length in days"
          className="input-field"
          value={formData.cycleLength}
          onChange={handleChange}
          required
        />

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