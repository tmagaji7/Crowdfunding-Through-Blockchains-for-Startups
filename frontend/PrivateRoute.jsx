import { Navigate, useLocation } from 'react-router-dom';
import { Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  if (!token && location.pathname !== '/login' && location.pathname !== '/register') {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  const handleCreateStartup = () => {
    navigate('/create-startup');
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <Button
          onClick={handleLogout}
          style={{
            backgroundColor: '#ff4d4f',
            borderColor: 'transparent',
            color: 'white',
          }}
        >
          Logout
        </Button>
        <Button
          onClick={handleCreateStartup}
          style={{
            backgroundColor: '#4CAF50',
            borderColor: 'transparent',
            color: 'white',
          }}
        >
          Create Startup
        </Button>
      </div>
      {children}
    </div>
  );
};
