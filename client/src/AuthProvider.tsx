import React, { createContext, useState, useContext, useEffect } from "react";

interface User {
  email: string;
  displayName?: string;
  photoURL?: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // On initial load, rehydrate user state from localStorage
  useEffect(() => {
    const token = localStorage.getItem("session_token");
    const email = localStorage.getItem("user_email");
    const displayName = localStorage.getItem("user_displayName");
    const photoURL = localStorage.getItem("user_photoURL");

    if (token && email) {
      setUser({
        token,
        email, 
        displayName: displayName || undefined,
        photoURL: photoURL || undefined,
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
