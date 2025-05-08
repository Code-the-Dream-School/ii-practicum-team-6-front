import React, { createContext, useState, useContext, useEffect } from "react";

// API URL should be defined - missing in your current version
const API_AUTH_URL = 'http://localhost:3000/api/auth/';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Initialize from localStorage for persistent UI state
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (err) {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  // Check session on app load - simpler approach
  useEffect(() => {
    const checkSession = async () => {
      console.log('Checking session...');
      try {
        const res = await fetch(`${API_AUTH_URL}me`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data?.user) {
            // Update state with user data from server
            setUser(data.data.user);
            // Store in localStorage for persistence
            localStorage.setItem('user', JSON.stringify(data.data.user));
          } else {
            // Invalid response format
            setUser(null);
            localStorage.removeItem('user');
          }
        } else {
          // Not authenticated
          setUser(null);
          localStorage.removeItem('user');
        }
      } catch (err) {
        console.error('Session check error:', err);
        // On error, keep existing user data to avoid logout on network issues
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  return (
    <UserContext.Provider value={{
      user,
      setUser,  // Keep this simple - no wrapper function
      isLoading
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
