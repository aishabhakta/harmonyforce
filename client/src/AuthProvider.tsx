import React, { createContext, useState, useContext } from "react";

interface User {
  user_id: number;
  email: string;
  displayName?: string;
  photoURL?: string;
  token?: string;
  role?: string;
  team_id?: number;
  university_id?: number;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- READ LOCALSTORAGE SYNCHRONOUSLY ---
const getUserFromLocalStorage = (): User | null => {
  const userIdString = localStorage.getItem("user_id");
  const token = localStorage.getItem("session_token");
  const email = localStorage.getItem("user_email");
  const displayName = localStorage.getItem("user_displayName");
  const photoURL = localStorage.getItem("user_photoURL");
  const role = localStorage.getItem("user_role");
  const teamIdString = localStorage.getItem("team_id");
  const universityIdString = localStorage.getItem("university_id");

  const user_id = userIdString ? parseInt(userIdString) : undefined;
  const team_id = teamIdString ? parseInt(teamIdString) : undefined;
  const university_id = universityIdString ? parseInt(universityIdString) : undefined;

  if (token && email && user_id !== undefined) {
    return {
      user_id,
      email,
      token,
      displayName: displayName || undefined,
      photoURL: photoURL || undefined,
      role: role || undefined,
      team_id,
      university_id
    };
  }

  return null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getUserFromLocalStorage()); // 🧠 instantly hydrate
  const [loading] = useState<boolean>(false); //  No async delay now

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};