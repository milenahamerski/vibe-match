import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Dashboard.css';
import './Profile.css';

interface Content {
  id: string;
  title: string;
  type: 'FILM' | 'SERIES' | 'BOOK';
  genre: string;
}

interface FavoriteItem {
  id: string;
  content: Content;
}

interface ReviewItem {
  id: string;
  rating: number;
  comment: string;
  content: Content;
}

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  // Edit Profile State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [savingProfile, setSavingProfile] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('/avatar.png');

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`vibe_user_avatar_${user.id}`);
      if (stored) {
        setTimeout(() => {
          setAvatarUrl(stored);
        }, 0);
      }
    }
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        localStorage.setItem(`vibe_user_avatar_${user.id}`, base64String);
        setAvatarUrl(base64String);
        setActionMessage('Profile photo updated!');
        setTimeout(() => setActionMessage(''), 3000);
        window.dispatchEvent(new Event('storage'));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const favRes = await api.get(`/favoritos/real/usuario/${user.id}`);
        setFavorites(favRes.data?.data || favRes.data);

        const revRes = await api.get(`/avaliacoes/usuario/${user.id}`);
        setReviews(revRes.data?.data || revRes.data);
      } catch (err) {
        console.error('Error fetching profile data', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      setTimeout(() => {
        setEditName(user.name);
      }, 0);
      fetchData();
    }
  }, [user]);

  const handleUnfavorite = async (contentId: string) => {
    if (!user) return;
    try {
      await api.delete(`/favoritos/usuario/${user.id}/conteudo/${contentId}`);
      setFavorites(prev => prev.filter(f => f.content.id !== contentId));
      setActionMessage('Removed from favorites!');
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      setActionMessage('Error removing favorite.');
      setTimeout(() => setActionMessage(''), 3000);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !editName.trim()) return;
    setSavingProfile(true);
    try {
      await api.patch(`/usuarios/${user.id}`, { name: editName });
      updateUser({ ...user, name: editName });
      setActionMessage('Profile updated successfully!');
      setShowEditModal(false);
    } catch (err) {
      setActionMessage('Error updating profile.');
    } finally {
      setSavingProfile(false);
      setTimeout(() => setActionMessage(''), 3000);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'FILM': return 'movie';
      case 'SERIES': return 'tv';
      case 'BOOK': return 'menu_book';
      default: return 'movie';
    }
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      {actionMessage && <div className="toast-message">{actionMessage}</div>}

      <div className="profile-header">
        <button 
          onClick={() => setShowEditModal(true)}
          className="btn-secondary"
          style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10, fontSize: '0.875rem', padding: '0.5rem 1rem' }}
        >
          Edit Profile
        </button>
        <div className="profile-avatar clickable" onClick={handleAvatarClick} title="Click to change photo">
          <img src={avatarUrl} alt="Avatar" className="profile-avatar-img" />
          <div className="profile-avatar-overlay">
            <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#fff' }}>photo_camera</span>
          </div>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleAvatarChange} 
          accept="image/*" 
          style={{ display: 'none' }} 
        />
        <h2 className="profile-name">{user.name}</h2>
        <p className="profile-email">{user.email}</p>
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-value">{favorites.length}</span>
            <span className="stat-label">Favorites</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{reviews.length}</span>
            <span className="stat-label">Reviews</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          Loading your profile...
        </div>
      ) : (
        <div className="profile-grid">
          {/* Favorites Section */}
          <div className="glass-panel" style={{ padding: '1.5rem', border: 'none' }}>
            <h3 className="section-title">
              <span className="material-symbols-outlined" style={{ color: 'var(--tertiary)' }}>favorite</span>
              My Favorites
            </h3>
            {favorites.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem 1rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '48px', opacity: 0.5 }}>favorite_border</span>
                <p className="empty-list-text" style={{ border: 'none', background: 'transparent' }}>You don't have any favorites yet.</p>
              </div>
            ) : (
              <div className="list-container mt-4">
                {favorites.map((fav) => (
                  <div key={fav.id} className="list-item">
                    <div className="item-info-wrapper">
                      <div className="item-icon">
                        <span className="material-symbols-outlined">{getTypeIcon(fav.content.type)}</span>
                      </div>
                      <div>
                        <h4 className="item-title">{fav.content.title}</h4>
                        <p className="item-genre">{fav.content.genre}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleUnfavorite(fav.content.id)}
                      className="btn-remove-fav"
                      title="Remove from favorites"
                    >
                      <span className="material-symbols-outlined fill-icon">heart_broken</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="glass-panel" style={{ padding: '1.5rem', border: 'none' }}>
            <h3 className="section-title">
              <span className="material-symbols-outlined" style={{ color: '#eab308' }}>star</span>
              My Reviews
            </h3>
            {reviews.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem 1rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '48px', opacity: 0.5 }}>star_rate</span>
                <p className="empty-list-text" style={{ border: 'none', background: 'transparent' }}>You haven't reviewed any content yet.</p>
              </div>
            ) : (
              <div className="list-container mt-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="review-item">
                    <div className="review-header">
                      <div className="item-info-wrapper">
                        <h4 className="item-title" style={{ margin: 0 }}>{rev.content.title}</h4>
                      </div>
                      <div className="review-rating">
                        <span className="material-symbols-outlined fill-icon" style={{ fontSize: '16px' }}>star</span>
                        <span>{rev.rating}/5</span>
                      </div>
                    </div>
                    {rev.comment && (
                      <p className="review-comment">"{rev.comment}"</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Profile</h3>
            </div>
            <div className="modal-body mb-4">
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--on-surface-variant)', marginBottom: '0.5rem', fontWeight: 600 }}>Name</label>
              <input 
                type="text" 
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="input-field"
                placeholder="Your name"
              />
            </div>
            <div className="modal-footer flex gap-2">
              <button className="btn-secondary flex-1" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="btn-primary flex-1" onClick={handleSaveProfile} disabled={savingProfile || !editName.trim()}>
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
