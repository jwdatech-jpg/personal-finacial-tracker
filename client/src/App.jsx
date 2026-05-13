import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import './i18n/config';

// Pages (will create these next)
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Accounts from './pages/Accounts';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import Login from './pages/Login';
import Register from './pages/Register';
import Categories from './pages/Categories';
import Profile from './pages/Profile';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/transactions" element={
              <ProtectedRoute>
                <Layout><Transactions /></Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/accounts" element={
              <ProtectedRoute>
                <Layout><Accounts /></Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/budgets" element={
              <ProtectedRoute>
                <Layout><Budgets /></Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/goals" element={
              <ProtectedRoute>
                <Layout><Goals /></Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout><Profile /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/categories" element={
              <ProtectedRoute>
                <Layout><Categories /></Layout>
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
