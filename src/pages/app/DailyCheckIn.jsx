import React, { useState } from 'react';

import Navbar from '../../components/Navbar';

import {
  auth,
  db
} from '../../firebase/config';

import {
  addDoc,
  collection
} from 'firebase/firestore';

export default function DailyCheckIn() {

  const [mood, setMood] = useState('');

  const [energy, setEnergy] = useState('');

  async function handleSubmit(e) {

    e.preventDefault();

    try {

      const user = auth.currentUser;

      await addDoc(
        collection(
          db,
          'users',
          user.uid,
          'checkins'
        ),
        {
          mood,
          energy,
          createdAt: new Date(),
        }
      );

      alert('Check-in saved!');

    } catch (error) {

      alert(error.message);

    }

  }

  return (

    <div className="screen">

      <h1 className="page-title mb-6">
        Daily Check-In
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <select
          className="input-field"
          value={mood}
          onChange={(e) =>
            setMood(e.target.value)
          }
        >

          <option value="">
            Select Mood
          </option>

          <option value="happy">
            Happy
          </option>

          <option value="sad">
            Sad
          </option>

          <option value="anxious">
            Anxious
          </option>

        </select>

        <select
          className="input-field"
          value={energy}
          onChange={(e) =>
            setEnergy(e.target.value)
          }
        >

          <option value="">
            Energy Level
          </option>

          <option value="high">
            High
          </option>

          <option value="medium">
            Medium
          </option>

          <option value="low">
            Low
          </option>

        </select>

        <button
          type="submit"
          className="btn-primary"
        >
          Save Check-In
        </button>

      </form>

<Navbar />

    </div>

  );
}