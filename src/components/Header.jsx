import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../image/Code.png';
import { useUser } from '../context/UserContext';
import UserDropdown from './UserDropdown';




const Header = () => {
  // const user = JSON.parse(localStorage.getItem('user'));
  const { user, isLoading } = useUser();

  return (
    <header className="w-full px-6 py-4 flex justify-between items-center border-b border-gray-300 bg-white">

      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Link to="/">
          <img src={logo} alt="CodeCrew Logo" className="w-8 h-8" />
        </Link>
        <Link to="/" className="text-2xl font-bold">CodeCrew</Link>
      </div>

      {/* Nav */}
      <nav className="flex items-center gap-4">
        {!user ? (
          <>
            <Link to="/signin" className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100">
              Sign in
            </Link>
            <Link to="/register" className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
              Register
            </Link>
          </>
        ) : (
          <UserDropdown />
        )}
      </nav>
    </header>
  );
};

export default Header;
