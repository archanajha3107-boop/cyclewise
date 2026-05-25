import React, { useState } from 'react';

import {
  createUserWithEmailAndPassword
} from 'firebase/auth';

import {
  doc,
  setDoc
} from 'firebase/firestore';

import {
  auth,
  db
} from '../../firebase/config';

import {
  Link,
  useNavigate
} from 'react-router-dom';

export default function SignUp() {

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSignup(e) {

    e.preventDefault();

    try {

      setLoading(true);

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user =
        userCredential.user;

      await setDoc(
        doc(db, 'users', user.uid),
        {
          uid: user.uid,
          email: user.email,
          createdAt: new Date(),
        }
      );

      alert(
        'Account created successfully!'
      );

      navigate(
        '/onboarding/personal'
      );

    } catch (error) {

      alert(error.message);

    }

    setLoading(false);

  }

  return (

    <div className="screen flex flex-col justify-center">

      <h1 className="page-title mb-6">
        Create Account
      </h1>

      <form
        onSubmit={handleSignup}
        className="space-y-4"
      >

        <input
          type="email"
          placeholder="Enter email"
          className="input-field"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
        />

        <input
          type="password"
          placeholder="Enter password"
          className="input-field"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
        />

        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >

          {
            loading
              ? 'Creating...'
              : 'Create Account'
          }

        </button>

      </form>

      <Link
        to="/login"
        className="text-sm text-center mt-4 text-mauve"
      >
        Already have an account?
      </Link>

    </div>

  );
}