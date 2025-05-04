import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

export const UserProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}auth/me`, {
          credentials: 'include',
        });

        if (!res.ok) throw new Error('No active session');

        const data = await res.json();
        setUser(data);
      } catch (err) {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
      <UserContext.Provider value={{user, setUser}}>
        {children}
      </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
