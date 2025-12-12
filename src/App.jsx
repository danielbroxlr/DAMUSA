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
import Admin from './pages/Admin';
import { Toaster } from 'react-hot-toast';

// Context for app-wide state
export const AppContext = createContext();
export const useApp = () => useContext(AppContext);

// Permissions by role
const rolePermissions = {
  admin: {
    canManageUsers: true,
    canManageRoles: true,
    canExportUsers: true,
    canOpenNotebooks: true,
    canCloseNotebooks: true,
    canGrantAccess: true,
    canModifyPlatform: true,
    canViewAudit: true,
    canEditSamples: true,
    canDeleteSamples: true,
    canEditMolecules: true,
    canDeleteMolecules: true,
    canApproveExperiments: true,
    canExportData: true,
    canConfigureSystem: true,
  },
  pi: {
    canManageUsers: false,
    canManageRoles: false,
    canExportUsers: false,
    canOpenNotebooks: true,
    canCloseNotebooks: true,
    canGrantAccess: true,
    canModifyPlatform: false,
    canViewAudit: true,
    canEditSamples: true,
    canDeleteSamples: false,
    canEditMolecules: true,
    canDeleteMolecules: false,
    canApproveExperiments: true,
    canExportData: true,
    canConfigureSystem: false,
  },
  senior_chemist: {
    canManageUsers: false,
    canManageRoles: false,
    canExportUsers: false,
    canOpenNotebooks: false,
    canCloseNotebooks: false,
    canGrantAccess: false,
    canModifyPlatform: false,
    canViewAudit: false,
    canEditSamples: true,
    canDeleteSamples: false,
    canEditMolecules: true,
    canDeleteMolecules: false,
    canApproveExperiments: false,
    canExportData: true,
    canConfigureSystem: false,
  },
  junior_chemist: {
    canManageUsers: false,
    canManageRoles: false,
    canExportUsers: false,
    canOpenNotebooks: false,
    canCloseNotebooks: false,
    canGrantAccess: false,
    canModifyPlatform: false,
    canViewAudit: false,
    canEditSamples: false,
    canDeleteSamples: false,
    canEditMolecules: false,
    canDeleteMolecules: false,
    canApproveExperiments: false,
    canExportData: false,
    canConfigureSystem: false,
  },
  analyst: {
    canManageUsers: false,
    canManageRoles: false,
    canExportUsers: false,
    canOpenNotebooks: false,
    canCloseNotebooks: false,
    canGrantAccess: false,
    canModifyPlatform: false,
    canViewAudit: false,
    canEditSamples: true,
    canDeleteSamples: false,
    canEditMolecules: false,
    canDeleteMolecules: false,
    canApproveExperiments: false,
    canExportData: false,
    canConfigureSystem: false,
  },
  qa: {
    canManageUsers: false,
    canManageRoles: false,
    canExportUsers: false,
    canOpenNotebooks: false,
    canCloseNotebooks: false,
    canGrantAccess: false,
    canModifyPlatform: false,
    canViewAudit: true,
    canEditSamples: false,
    canDeleteSamples: false,
    canEditMolecules: false,
    canDeleteMolecules: false,
    canApproveExperiments: false,
    canExportData: true,
    canConfigureSystem: false,
  },
  viewer: {
    canManageUsers: false,
    canManageRoles: false,
    canExportUsers: false,
    canOpenNotebooks: false,
    canCloseNotebooks: false,
    canGrantAccess: false,
    canModifyPlatform: false,
    canViewAudit: false,
    canEditSamples: false,
    canDeleteSamples: false,
    canEditMolecules: false,
    canDeleteMolecules: false,
    canApproveExperiments: false,
    canExportData: false,
    canConfigureSystem: false,
  },
};

// Auth Provider
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 1,
    name: 'Dr. Antonio García',
    email: 'a.garcia@lab.com',
    role: 'admin', // Change to 'senior_chemist' to test user permissions
    avatar: null,
    department: 'Química Orgánica',
    laboratory: 'Lab-A'
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const permissions = rolePermissions[user?.role] || rolePermissions.viewer;

  const hasPermission = (permission) => {
    return permissions[permission] === true;
  };

  const isAdmin = () => user?.role === 'admin';

  const login = (credentials) => {
    setIsAuthenticated(true);
    // For demo, set admin role
    setUser(prev => ({ ...prev, ...credentials }));
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const switchRole = (newRole) => {
    setUser(prev => ({ ...prev, role: newRole }));
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      setUser, 
      isAuthenticated, 
      login, 
      logout, 
      permissions, 
      hasPermission, 
      isAdmin,
      switchRole,
      rolePermissions 
    }}>
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
      <Sidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
        userRole={user?.role}
      />
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
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useApp();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return <Layout>{children}</Layout>;
};

// Admin Only Route
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useApp();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    return <Navigate to="/" replace />;
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
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/samples" element={<ProtectedRoute><Samples /></ProtectedRoute>} />
          <Route path="/molecules" element={<ProtectedRoute><Molecules /></ProtectedRoute>} />
          <Route path="/eln" element={<ProtectedRoute><ELN /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
          <Route path="/users" element={<ProtectedRoute requiredRole="admin"><Users /></ProtectedRoute>} />
          <Route path="/audit" element={<ProtectedRoute><Audit /></ProtectedRoute>} />
          <Route path="/settings" element={<AdminRoute><Settings /></AdminRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
