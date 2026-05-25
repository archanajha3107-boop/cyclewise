import React, { useState } from 'react';

import {
  signInWithEmailAndPassword
} from 'firebase/auth';

import {
  auth
} from '../../firebase/config';

import {
  Link,
  useNavigate
} from 'react-router-dom';

export default function Login() {

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(e) {

    e.preventDefault();

    try {

      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      navigate('/home');

    } catch (error) {

      alert(error.message);

    }

    setLoading(false);

  }

  return (

    <div className="screen flex flex-col justify-center">

      <h1 className="page-title mb-6">
        Welcome Back
      </h1>

      <form
        onSubmit={handleLogin}
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
        />

        <input
          type="password"
          placeholder="Enter password"
          className="input-field"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >

          {
            loading
              ? 'Logging in...'
              : 'Login'
          }

        </button>

      </form>

      <Link
        to="/"
        className="text-sm text-center mt-4 text-mauve"
      >
        Create account
      </Link>

    </div>

  );
}