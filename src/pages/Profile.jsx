import React, { useEffect } from "react";
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import codeCrewAPI from '../config';

const Profile = () => {
  const { user, updateUser } = useUser();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading user profile...</p>
      </div>
    );
  }

  const {
    username,
    email,
    country,
    bio,
    skills: userSkills = [],
    avatar,
  } = user;


  //Normalize skills data
  const skills = Array.isArray(userSkills)
    ? userSkills.map(skill => skill.name || String(skill).trim()).filter(Boolean)
    : typeof userSkills === 'string'
      ? userSkills.split(',').map(skill => skill.trim()).filter(Boolean)
      : [];
  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  return (
    <div className="bg-gradient-to-r from-indigo-800 to-blue-900 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full p-8 transition-all duration-300 animate-fade-in">
        <div className="flex flex-col md:flex-row w-full">

          <div className="md:w-1/3 text-center mb-8 md:mb-0">
            {/* Generic Avatar Icon */}
            <div className="mx-auto mb-4 flex items-center justify-center w-48 h-48 rounded-full bg-indigo-100 dark:bg-gray-700 border-4 border-indigo-800 dark:border-blue-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-32 w-32 text-indigo-800 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4">{username}</p>
            <button
              onClick={handleEditProfile}
              className="mt-4 bg-indigo-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-300"
            >
              Edit Profile
            </button>
          </div>

          <div className="md:w-2/3 md:pl-8">
            <h2 className="text-xl font-semibold text-indigo-800 dark:text-white mb-4">
              About Me
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-wrap">
              {bio}
            </p>

            <h2 className="text-xl font-semibold text-indigo-800 dark:text-white mb-4">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm hover:bg-blue-900 hover:text-white transition-all duration-300"
                >
                  {skill}
                </span>
              ))}
            </div>
            <h2 className="text-xl font-semibold text-indigo-800 dark:text-white mb-4">
              Contact Information
            </h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-center">
                <svg
                  className="h-5 w-5 mr-2 text-indigo-800 dark:text-blue-900"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                {email}
              </li>
              {/* <li className="flex items-center">
                <svg
                  className="h-5 w-5 mr-2 text-indigo-800 dark:text-blue-900"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >

                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                {country}
              </li> */}
            </ul>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default Profile;
