import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const login = () => {
    // Perform login logic here, set isLoggedIn to true if successful
    setIsLoggedIn(true);
  };
  
  const logout = () => {
    // Perform logout logic here, set isLoggedIn to false
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
