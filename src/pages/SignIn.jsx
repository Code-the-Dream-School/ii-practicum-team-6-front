import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

// Make sure you're importing from the correct path
const API_AUTH_URL = 'http://localhost:3000/api/auth/';

const SignIn = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await fetch(`${API_AUTH_URL}login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const body = await response.json();

      if (!body.success) {
        throw new Error(body.message || 'Login Failed');
      }

      // Get user data from response
      const userData = body.data.user;

      if (userData) {
        // Update context state
        setUser(userData);

        // Store in localStorage (with proper error handling)
        try {
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (storageError) {
          console.error('Failed to store user data:', storageError);
          // Continue anyway since we have the user in state
        }

        // Redirect to home page
        navigate('/');
      } else {
        throw new Error('User data not found in response');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="w-full max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <h5 className="text-xl font-medium text-gray-900">Sign in</h5>

          {/* Display error message if present */}
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
              Your email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="name@company.com"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
              Your Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>

          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300"
              />
              <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-900">
                Remember me
              </label>
            </div>
            <Link to="/forgot-password" className="text-sm text-blue-700 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
          <div className="text-sm font-medium text-gray-500">
            Not Registered?{' '}
            <Link to="/register" className="text-blue-700 hover:underline">
              Create Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
