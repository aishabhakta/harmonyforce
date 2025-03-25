import React, { createContext, useState, useContext, useEffect } from "react";

interface User {
  email: string;
  displayName?: string;
  photoURL?: string;
  token?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);  // Explicit Export

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("session_token");
    const email = localStorage.getItem("user_email");
    const displayName = localStorage.getItem("user_displayName");
    const photoURL = localStorage.getItem("user_photoURL");
    const role = localStorage.getItem("user_role");

    if (token && email) {
      setUser({
        token,
        email, 
        displayName: displayName || undefined,
        photoURL: photoURL || undefined,
        role: role || undefined,
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Fix: Export useAuth Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
