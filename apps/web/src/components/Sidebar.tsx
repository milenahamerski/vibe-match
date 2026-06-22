import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Compass, Heart, Settings, User, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null; // Don't show sidebar if not logged in

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon">✨</span>
        <h1 className="brand-text">VibeMatch</h1>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group">
          <p className="nav-group-title">Menu</p>
          <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link to="#" className="nav-item disabled">
            <Compass size={20} />
            <span>Explore</span>
          </Link>
          <Link to="/profile" className={`nav-item ${isActive('/profile') ? 'active' : ''}`}>
            <Heart size={20} />
            <span>Favorites</span>
          </Link>
        </div>

        <div className="nav-group mt-auto">
          <p className="nav-group-title">Settings</p>
          <Link to="#" className="nav-item disabled">
            <Settings size={20} />
            <span>Settings</span>
          </Link>
          <Link to="/profile" className={`nav-item ${isActive('/profile') ? 'active' : ''}`}>
            <User size={20} />
            <span>Profile</span>
          </Link>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-email">Premium User</span>
          </div>
        </div>
        <button onClick={handleLogout} className="btn-logout-sidebar" title="Sair">
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
