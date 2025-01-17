import { Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/Homepage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { StartupDetails } from './pages/StartupDetails';
import { CreateStartup } from './pages/CreateStartup';
import { PrivateRoute } from './components/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/startups/:id"
        element={
          <PrivateRoute>
            <StartupDetails />
          </PrivateRoute>
        }
      />

      <Route
        path="/create-startup"
        element={
          <PrivateRoute>
            <CreateStartup />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
