// Protected Route Component
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, isLoading, userRole } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check role permissions if specified
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    const roleRoutes: Record<string, string> = {
      admin: '/admin/dashboard',
      lecturer: '/lecturer/dashboard',
      security: '/security/dashboard',
      student: '/student/dashboard',
    };

    const userDashboard = roleRoutes[userRole] || '/dashboard';
    return <Navigate to={userDashboard} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;