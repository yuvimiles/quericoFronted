import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Pages
import Login from '../pages/login';
import Register from '../pages/register';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import AiChat from '../pages/AiChat'
import Chat from '../components/Chat';
// Layout
import Layout from '../components/Layout';

// Private route component
interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

// AppRoutes now receives the toggle function and dark mode state
interface AppRoutesProps {
  handleToggle: () => void;
  isDarkMode: boolean;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ handleToggle, isDarkMode }) => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout handleToggle={handleToggle} isDarkMode={isDarkMode}>
              <Home />
              <Chat />
            </Layout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/AiChat"
        element={
          <PrivateRoute>
            <Layout handleToggle={handleToggle} isDarkMode={isDarkMode}>
              <AiChat />
              <Chat />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Layout handleToggle={handleToggle} isDarkMode={isDarkMode}>
              <Profile />
              <Chat />
            </Layout>
          </PrivateRoute>
        }
      />
      
      
      
      
      {/* Default redirect to home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
