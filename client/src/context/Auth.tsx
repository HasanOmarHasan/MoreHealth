// Auth.tsx
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { toast } from "react-toastify";

interface User {
  id: number;
  username: string;
  email: string;
  type: 'doctor' | 'patient';
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  initializeAuth: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const initializeAuth = () => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
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
    <AuthContext.Provider value={{ user, isLoggedIn, initializeAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};


// // Auth.tsx
// import { createContext, useContext, ReactNode, useState, useEffect } from "react";
// import { redirect } from "react-router-dom";
// import { toast } from "react-toastify";

// interface User {
//   id: number;
//   username: string;
//   email: string;
//   type: 'doctor' | 'patient';
// }

// interface AuthContextType {
//   user: User | null;
//   isLoggedIn: boolean;
//   loginAction: ({ request }: { request: Request }) => Promise<Response | { errors: any }>;
//   signupAction: ({ request }: { request: Request }) => Promise<Response | { errors: any }>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | null>(null);
// const URL_BASE = "http://127.0.0.1:8000";
// const URL_LOGIN = `${URL_BASE}/auth/login`;
// const URL_SIGNUP = `${URL_BASE}/auth/signup`;

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => initializeAuth(), []);

//   const initializeAuth = () => {
//     const token = localStorage.getItem('authToken');
//     const userData = localStorage.getItem('user');
    
//     if (token && userData) {
//       try {
//         setUser(JSON.parse(userData));
//         setIsLoggedIn(true);
//       } catch (error) {
//         console.error('Auth initialization error:', error);
//       }
//     }
//   };

//   const login = (userData: User, token: string) => {
//     localStorage.setItem('authToken', token);
//     localStorage.setItem('user', JSON.stringify(userData));
//     setUser(userData);
//     setIsLoggedIn(true);
//   };

//   const logout = () => {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('user');
//     setUser(null);
//     setIsLoggedIn(false);
//     // redirect('/');
//     // Note : here we can  naveget user to home or login page
//     // realtime update render when user logout
//   };

//   const handleAuthRequest = async (url: string, requestData: FormData) => {
//     try {
//       const response = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(Object.fromEntries(requestData)),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         return { ok: false, errors: errorData.errors || errorData.message };
//       }

//       return { ok: true, data: await response.json() };
//     } catch (error) {
//       console.error('Auth request failed:', error);
//       return { ok: false, errors: { general: "Request failed. Please try again." } };
//     }
//   };

//   const loginAction = async ({ request }: { request: Request }) => {
//     const formData = await request.formData();
//     const result = await handleAuthRequest(URL_LOGIN, formData);

//     if (!result.ok) {
//       toast.error(result.errors.general || "Login failed");
//       return { errors: result.errors };
//     }

//     login(result.data.user, result.data.token);
//     toast.success("Login successful!");
//     return redirect("/dashboard");
//   };

//   const signupAction = async ({ request }: { request: Request }) => {
//     const formData = await request.formData();
//     const result = await handleAuthRequest(URL_SIGNUP, formData);

//     if (!result.ok) {
//       toast.error(result.errors.general || "Signup failed");
//       return { errors: result.errors };
//     }

//     toast.success("Account created successfully! Please login.");
//     return redirect("/login");
//   };

//   return (
//     <AuthContext.Provider value={{ user, isLoggedIn, loginAction, signupAction, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error('useAuth must be used within an AuthProvider');
//   return context;
// };