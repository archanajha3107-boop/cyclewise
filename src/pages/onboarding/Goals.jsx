import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

export default function Goals() {

  const navigate = useNavigate();

  const [selectedGoals, setSelectedGoals] =
    useState([]);

  const [saving, setSaving] =
    useState(false);

  const goals = [
    'Track periods',
    'Improve health',
    'Reduce symptoms',
    'Learn about PMOS',
  ];

  function toggleGoal(goal) {

    if (selectedGoals.includes(goal)) {

      setSelectedGoals(
        selectedGoals.filter(
          (g) => g !== goal
        )
      );

    } else {

      setSelectedGoals([
        ...selectedGoals,
        goal,
      ]);

    }

  }

  async function handleSubmit(e) {

    e.preventDefault();

    try {

      setSaving(true);

      navigate('/meet-sakhi');

    } catch (error) {

      alert(error.message);

    }

    setSaving(false);

  }

  return (

    <div className="screen">

      <h1 className="page-title mb-6">
        Your Goals
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        {goals.map((goal) => (

          <button
            type="button"
            key={goal}
            onClick={() =>
              toggleGoal(goal)
            }
            className={`w-full p-4 rounded-xl border ${
              selectedGoals.includes(goal)
                ? 'bg-pink-200'
                : 'bg-white'
            }`}
          >

            {goal}

          </button>

        ))}

        <button
          type="submit"
          className="btn-primary"
          disabled={saving}
        >

          {
            saving
              ? 'Saving...'
              : 'Continue'
          }

        </button>

      </form>

    </div>

  );

}