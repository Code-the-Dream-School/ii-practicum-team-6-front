import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../components/UserContext';
import API_AUTH_URL from '../config';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({
    username: null,
    email: null,
    password: null,
    confirmPassword: null
  });

  const { setUser } = useUser();  // This must be inside the component body
  const navigate = useNavigate();

  // Real-time validation
  useEffect(() => {
    const newErrors = { ...errors };
    newErrors.username = !username.trim()
      ? ''
      : username.length < 3
        ? 'Username must be at least 3 characters'
        : null;


    newErrors.email = !email
      ? ''
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? 'Please enter a valid email'
        : null;


    newErrors.password = !password
      ? ''
      : password.length < 8
        ? 'Password must be at least 8 characters'
        : null;

    newErrors.confirmPassword = password && confirmPassword
      ? password !== confirmPassword ? 'Passwords do not match' : ''
      : '';
    setErrors(newErrors);
  }, [username, email, password, confirmPassword]);


  // Error timeout (same as sign-in)
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);


  // Update handleSubmit to use the errors state
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check if any errors exist
    if (Object.values(errors).some(error => error)) {
      setError('Oops! Please, check the fields marked in red');
      return;
    }

    try {
      const response = await fetch(`${API_AUTH_URL}register`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username,
          email,
          password,
          confirmPassword
        }),
      });

      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.message || "Registration filled");
      }

      // Handle user data exactly like sign-in does
      const user = body.data?.user || body.user;
      if (user) {
        setUser(user);
        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(user));
        }
        navigate('/');
      } else {
        throw new Error('User data not found in response');
      }

    } catch (err) {
      console.error('Registration Error:', err.message);
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b  px-4">
      <div className="w-full max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <h5 className="text-xl font-medium text-gray-900">Create an account</h5>

          {/* UserName */}
          <div>
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=""
              required
              className={`bg-gray-50 border ${errors.username ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            />
            {errors.username && (
              <p className={`mt-1 text-xs text-red-600 min-h-[20px] ${errors.username ? 'block' : 'hidden'}`}>
                {errors.username}
              </p>

            )}
          </div>

          {/* email */}
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
              Your Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
              required
              className={`bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            />
            {errors.email && (
              <p className={`mt-1 text-xs text-red-600 min-h-[20px] ${errors.email ? 'block' : 'hidden'}`}>
                {errors.email}
              </p>
            )}
          </div>

          {/* password */}
          <div className="relative min-h-[50px]  ">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="......."
              required
              className={`bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            />
            <div
              className="absolute top-1/2 right-0 pr-3 flex items-center cursor-pointer text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
            {errors.password && (
              <p className={`mt-1 text-xs text-red-600 min-h-[20px] ${errors.password ? 'block' : 'hidden'}`}>
                {errors.password}
              </p>
            )}
          </div>
          {/* confirmPassword */}
          <div className="relative min-h-[50px] ">
            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="......."
              required
              className={`bg-gray-50 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            />
            <div
              className="absolute top-1/2 right-0 pr-3 flex items-center cursor-pointer text-gray-500"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
            {errors.confirmPassword && (
              <p className={`mt-1 text-xs text-red-600 min-h-[20px] ${errors.confirmPassword ? 'block' : 'hidden'}`}>
                {errors.confirmPassword}
              </p>
            )}
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
              />
            </div>
            <label htmlFor="rememberMe" className="ml-2 text-sm font-medium text-gray-900">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Register
          </button>

          <div className="text-sm font-medium text-gray-500">
            Already have an account?{' '}
            <Link to="/signin" className="text-blue-700 hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
