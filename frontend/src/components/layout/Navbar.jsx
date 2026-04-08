import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const amadeusUrl = import.meta.env.VITE_AMADEUS_API_URL;

  function handleAmadeusAuth() {
    const base = amadeusUrl?.startsWith('http') ? amadeusUrl : `https://${amadeusUrl}`;
    window.location.href = `${base}/auth/google/callback`;
  }

  return (
    <nav className="bg-blue-700 text-white px-6 py-3 flex items-center justify-between shadow">
      <span className="text-xl font-bold tracking-tight">Onfly</span>
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm opacity-80">Hi, {user.username}</span>
          <button
            onClick={handleAmadeusAuth}
            className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-400 transition"
          >
            Conectar Google Agenda
          </button>
          <button
            onClick={handleLogout}
            className="text-sm bg-white text-blue-700 px-3 py-1 rounded hover:bg-blue-50 transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
