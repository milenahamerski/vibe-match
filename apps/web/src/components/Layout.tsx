import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [avatarUrl, setAvatarUrl] = useState('/avatar.png');

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`vibe_user_avatar_${user.id}`);
      if (stored) {
        setTimeout(() => {
          setAvatarUrl(stored);
        }, 0);
      }
    }

    const handleStorageChange = () => {
      if (user) {
        const stored = localStorage.getItem(`vibe_user_avatar_${user.id}`);
        setAvatarUrl(stored || '/avatar.png');
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

  if (!user) return <>{children}</>;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="layout-container">
      {/* Top App Bar (Mobile / Tablet) */}
      <header className="top-app-bar">
        <div className="top-bar-left">
          <div className="user-avatar-small">
            <img src={avatarUrl} alt="Avatar" className="user-avatar-img" />
          </div>
          <h1 className="brand-text">VibeMatch</h1>
        </div>
        <button className="icon-button" title="Search">
          <span className="material-symbols-outlined text-primary">search</span>
        </button>
      </header>

      {/* Desktop Sidebar */}
      <aside className="desktop-sidebar">
        <div className="sidebar-brand">
          <h1 className="brand-text">VibeMatch</h1>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group">
            <p className="nav-group-title">Menu</p>
            <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
              <span className="material-symbols-outlined">home</span>
              <span>Home</span>
            </Link>
            <Link to="/explore" className={`nav-item ${isActive('/explore') ? 'active' : ''}`}>
              <span className="material-symbols-outlined">explore</span>
              <span>Explore</span>
            </Link>
            <Link to="/profile" className={`nav-item ${isActive('/profile') ? 'active' : ''}`}>
              <span className="material-symbols-outlined">favorite</span>
              <span>Favorites</span>
            </Link>
          </div>

          <div className="nav-group mt-auto">
            <p className="nav-group-title">Config</p>
            <Link to="/profile" className={`nav-item ${isActive('/profile') ? 'active' : ''}`}>
              <span className="material-symbols-outlined">person</span>
              <span>Profile</span>
            </Link>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              <img src={avatarUrl} alt="Avatar" className="user-avatar-img" />
            </div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-email">Premium User</span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-logout-sidebar" title="Logout">
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {children}
      </main>

      {/* Bottom Nav Bar (Mobile) */}
      <nav className="bottom-nav-bar">
        <Link to="/" className={`bottom-nav-item ${isActive('/') ? 'active' : ''}`}>
          <span className={`material-symbols-outlined mb-1 ${isActive('/') ? 'fill-icon' : ''}`}>home</span>
          <span className="bottom-nav-label">Home</span>
        </Link>
        <Link to="/explore" className={`bottom-nav-item ${isActive('/explore') ? 'active' : ''}`}>
          <span className={`material-symbols-outlined mb-1 ${isActive('/explore') ? 'fill-icon' : ''}`}>explore</span>
          <span className="bottom-nav-label">Explore</span>
        </Link>
        <Link to="/profile" className={`bottom-nav-item ${isActive('/profile') ? 'active' : ''}`}>
          <span className={`material-symbols-outlined mb-1 ${isActive('/profile') ? 'fill-icon' : ''}`}>favorite</span>
          <span className="bottom-nav-label">Favs</span>
        </Link>
        <Link to="/profile" className={`bottom-nav-item ${isActive('/profile') ? 'active' : ''}`}>
          <span className="material-symbols-outlined mb-1">person</span>
          <span className="bottom-nav-label">Profile</span>
        </Link>
      </nav>
    </div>
  );
};

export default Layout;
