import React, { createContext, useState, ReactNode, useContext } from 'react';

interface UserContextProps {
  userType: string | null;
  setUserType: (userType: string | null) => void;
  userName: string | null;
  setUserName: (userName: string | null) => void;
  userId: string | null;
  setUserId: (userId: string | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userType, setUserType] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ userType, setUserType, userName, setUserName, userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};
