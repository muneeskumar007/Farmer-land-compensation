import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Mock users for demo
const MOCK_USERS = [
  { id: 1, name: 'Rajesh Kumar', email: 'farmer@demo.com', password: 'demo123', role: 'farmer', phone: '+91 9876543210', location: 'Tamil Nadu', avatar: null, joinDate: '2024-01-15' },
  { id: 2, name: 'Admin Officer', email: 'admin@demo.com', password: 'admin123', role: 'admin', phone: '+91 9876500000', location: 'Chennai', avatar: null, joinDate: '2023-06-01' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('agri_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    await new Promise(r => setTimeout(r, 1000)); // simulate API
    const found = MOCK_USERS.find(u => u.email === email && u.password === password && u.role === role);
    if (!found) throw new Error('Invalid credentials. Try farmer@demo.com / demo123');
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem('agri_user', JSON.stringify(safeUser));
    return safeUser;
  };

  const signup = async (data) => {
    await new Promise(r => setTimeout(r, 1000));
    const newUser = { id: Date.now(), ...data, role: 'farmer', joinDate: new Date().toISOString().split('T')[0], avatar: null };
    setUser(newUser);
    localStorage.setItem('agri_user', JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('agri_user');
  };

  const updateProfile = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('agri_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
