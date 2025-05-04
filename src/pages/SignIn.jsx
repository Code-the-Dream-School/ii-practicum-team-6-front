import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../components/UserContext';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

const SignIn = () => {
  const {setUser} = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  // handle submit function is async so it can use await
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await fetch(`${API_URL}auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({email, password})

      });
      console.log('Response:', response);


      const body = await response.json();
      console.log('Body:', body);


      if (!body.success) {
        throw new Error(data.message || 'Login Failed');
      }
      ;


      const data = body.data;
      console.log('data:', data);
      const user = data.user;
      console.log('user:', user);

      setUser(user);
      if (body.data?.user) {
        setUser(body.data.user);
        navigate('/');
      } else {
        throw new Error(bosy.message || 'Login Failed');
      }


    } catch (err) {
      console.error('Login error:', err.message);
      setError(err.message);
    }
  };


  return (
      <div className="flex justify-center items-center min-h-screen  px-4">
        <div
            className="w-full max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <h5 className="text-xl font-medium text-gray-900">Sign in</h5>

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
                  placeholder="......"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>

            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <input
                    id="remember"
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
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Login
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
