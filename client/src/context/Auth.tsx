// Auth.tsx
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { toast } from "react-toastify";

interface User {
  id: number;
  username: string;
  email: string;
  medical_insurance: boolean;
  type: 'doctor' | 'patient';
  phone: string;
  city: string;
  region: string;
  age: number | undefined;
  
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  initializeAuth: () => void;
  logout: () => void;
  // setTkn: (token: string | null) => void;
  
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  // const [tkn, setTkn] = useState(null)

  const initializeAuth = () => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    // console.log(token , tkn)
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Auth initialization error:', error);
      }
    }
  };

  useEffect(() => {
    initializeAuth();
    window.addEventListener('storage', initializeAuth);
    return () => window.removeEventListener('storage', initializeAuth);
  }, []);

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
    toast.success("Logged out successfully!");
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, initializeAuth, logout  }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

