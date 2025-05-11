import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import codeCrewAPI from '../config';

const UserContext = createContext();

export const UserProvider = ({ children }) => {

  // get user from local storage
  const [user, setUser] = useState(() => {
    try {
      const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));
      return userFromLocalStorage || null;
    } catch (err) {
      console.error('Failed to parse user from localStorage:', err);
      localStorage.removeItem('user');
      return null;
    }
  });

  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await codeCrewAPI.authMe();
        const user = response.data.data.user;

        console.log('Active session', user);
        setUser(user);

        localStorage.setItem('user', JSON.stringify(user));

      } catch (err) {
        console.log('No active session', err.message);
        setUser(null);
        localStorage.removeItem('user');
        navigate('/');
      }
    };
    checkSession();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }} >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
