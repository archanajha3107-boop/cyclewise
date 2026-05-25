import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import Navbar from '../components/Navbar';
import {
  auth,
  db
} from '../firebase/config';

import {
  doc,
  getDoc
} from 'firebase/firestore';

import calculateScore from '../utils/calculateScore';

export default function Home() {

  const [userData, setUserData] = useState(null);

  const [score, setScore] = useState(0);

  useEffect(() => {

    async function fetchUserData() {

      try {

        const user = auth.currentUser;

        if (!user) return;

        const docRef = doc(
          db,
          'users',
          user.uid
        );

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

          const data = docSnap.data();

          setUserData(data);

          const calculatedScore =
            calculateScore(data);

          setScore(calculatedScore);

        }

      } catch (error) {

        console.log(error);

      }

    }

    fetchUserData();

  }, []);
  async function handleLogout() {

  await signOut(auth);

}

  function getRiskLevel() {

    if (score >= 8) {
      return 'High Risk';
    }

    if (score >= 4) {
      return 'Moderate Risk';
    }

    return 'Low Risk';

  }

  return (

    <div className="screen">

      <h1 className="page-title mb-6">
        Welcome Back 🌸
      </h1>
      <button
  onClick={handleLogout}
  className="btn-secondary mb-6"
>
  Logout
</button>

      <div className="card mb-6">

        <p className="section-label mb-2">
          PMOS RISK SCORE
        </p>

        <h2 className="text-4xl font-bold">
          {score}
        </h2>

        <p className="mt-2 text-muted-rose">
          {getRiskLevel()}
        </p>

      </div>

      <div className="card">

        <p className="section-label mb-4">
          YOUR PROFILE
        </p>

        <div className="space-y-2">

          <p>
            Name:
            {' '}
            {userData?.name}
          </p>

          <p>
            Age:
            {' '}
            {userData?.age}
          </p>

          <p>
            Cycle Length:
            {' '}
            {userData?.cycleLength}
          </p>

        </div>

      </div>
      <Navbar />

    </div>

  );
}