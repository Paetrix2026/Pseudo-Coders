import React, { useState } from 'react';
import { useAppContext } from '../context/AppProvider';
import { useAuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useAppContext();
  const { signup } = useAuthContext();
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (signup(email, password)) {
      setUser({ name: email.split('@')[0], email }); // Dummy username mapping
      navigate('/');
    } else {
      setError('Email already exists');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark transition-colors duration-300">
      <div className="w-full max-w-md p-8 bg-card-light dark:bg-card-dark rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-white text-3xl font-bold mb-6 shadow-md shadow-primary/20">
            C
          </div>
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">Join ClearMind today</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          {error && <div className="text-red-500 text-sm font-medium text-center">{error}</div>}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-transparent focus:ring-0 focus:border-primary outline-none transition-all text-lg placeholder-gray-400"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-transparent focus:ring-0 focus:border-primary outline-none transition-all text-lg placeholder-gray-400"
              placeholder="Create a password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 rounded-xl transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};
