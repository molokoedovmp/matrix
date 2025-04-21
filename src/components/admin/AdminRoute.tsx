import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Проверяем наличие информации о входе в localStorage
    const adminUser = localStorage.getItem('adminUser');
    if (adminUser) {
      try {
        const userData = JSON.parse(adminUser);
        setIsAuthenticated(userData.isLoggedIn === true);
      } catch (e) {
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-matrix-dark">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-matrix-green animate-spin" />
          <p className="mt-4 text-matrix-green">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AdminRoute; 