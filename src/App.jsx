import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Samples from './pages/Samples';
import Molecules from './pages/Molecules';
import ELN from './pages/ELN';
import Analytics from './pages/Analytics';
import Users from './pages/Users';
import Audit from './pages/Audit';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { Toaster } from 'react-hot-toast';

// Context for app-wide state
export const AppContext = createContext();

export const useApp = () => useContext(AppContext);

// Auth Provider
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 1,
    name: 'Dr. Antonio García',
    email: 'a.garcia@lab.com',
    role: 'senior_chemist',
    avatar: null,
    department: 'Química Orgánica',
    laboratory: 'Lab-A'
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const login = (credentials) => {
    // Simulated login
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AppContext.Provider value={{ user, setUser, isAuthenticated, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};

// Layout component
const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useApp();

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-auto p-6 gradient-mesh">
          {children}
        </main>
      </div>
    </div>
  );
};

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useApp();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#f9fafb',
              border: '1px solid #374151'
            }
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/samples" element={
            <ProtectedRoute>
              <Samples />
            </ProtectedRoute>
          } />
          <Route path="/molecules" element={
            <ProtectedRoute>
              <Molecules />
            </ProtectedRoute>
          } />
          <Route path="/eln" element={
            <ProtectedRoute>
              <ELN />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          } />
          <Route path="/audit" element={
            <ProtectedRoute>
              <Audit />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
