import React, {useState, useRef, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useUser} from '../components/UserContext';
import API_URL from '../config';

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const {setUser} = useUser();
  const navigate = useNavigate();


  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}logout`, {
        method: 'POST',
        credentials: 'include',

        headers: {
          'Content-Type': 'application/json',

        },
      });

      const data = await response.json();

      if (!response.ok) {
        const data = await response.json();
        console.warn('Logout warning:', data.message);
      }


      setUser(null);

      navigate('/');
      //window.location.href = '/';


    } catch (err) {
      console.error('Logout Error:', err.message);
      setUser(null);

      navigate('/');
      //window.location.href = '/';
    }
  };

  // close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <div>
          <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 hover:bg-gray-50"
          >

            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="h-6 w-6 text-gray-600"
            >
              <path
                  fillRule="evenodd"
                  d="M12 14a7 7 0 100-14 7 7 0 000 14zm0 2c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z"
                  clipRule="evenodd"
              />
            </svg>

          </button>
        </div>
        {isOpen && (
            <div
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
              <div className="py-1">
                <Link
                    to="/my-profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Profile
                </Link>

                <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout

                </button>
              </div>
            </div>
        )}
      </div>
  );
};

export default UserDropdown;
