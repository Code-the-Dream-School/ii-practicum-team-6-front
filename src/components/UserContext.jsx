import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_AUTH_URL from "../config";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      // Check for null, undefined, or invalid JSON
      if (!storedUser || storedUser === 'undefined' || storedUser === 'null') {
        return null;
      }

      const parsedUser = JSON.parse(storedUser);
      // Basic validation of user object
      if (parsedUser && typeof parsedUser === 'object' && 'id' in parsedUser) {
        return parsedUser;
      }
      return null;
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
      // Clean up invalid data
      localStorage.removeItem('user');
      return null;
    }
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_AUTH_URL}me`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.id) {
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
          } else {
            console.warn('Invalid user data received from /me endpoint');
            localStorage.removeItem('user');
          }

        } else {
          // If unauthorized, clear any existing user data
          if (response.status === 401) {
            setUser(null);
            localStorage.removeItem('user');
          }
        }
      } catch (err) {
        console.error('Session check failed:', err.message);
      }
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }} >
      {children}
    </UserContext.Provider>
  );
};

//export const useUser = () => useContext(UserContext);
// Enhanced useUser hook with error checking
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
