import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Dashboard.css';
import './Profile.css';
import { Heart, Star, Film, Tv, Book, Search } from 'lucide-react';
import { getMockedImage } from '../utils/images';

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
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  // Edit Profile State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [savingProfile, setSavingProfile] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Usar a rota real que busca do banco usando o Prisma
      const favRes = await api.get(`/favoritos/real/usuario/${user?.id}`);
      setFavorites(favRes.data?.data || favRes.data);

      const revRes = await api.get(`/avaliacoes/usuario/${user?.id}`);
      setReviews(revRes.data?.data || revRes.data);
    } catch (err) {
      console.error('Erro ao buscar dados do perfil', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setEditName(user.name);
      fetchData();
    }
  }, [user]);

  const handleUnfavorite = async (contentId: string) => {
    if (!user) return;
    try {
      await api.delete(`/favoritos/usuario/${user.id}/conteudo/${contentId}`);
      setFavorites(prev => prev.filter(f => f.content.id !== contentId));
      setActionMessage('Removido dos favoritos!');
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      setActionMessage('Erro ao remover favorito.');
      setTimeout(() => setActionMessage(''), 3000);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !editName.trim()) return;
    setSavingProfile(true);
    try {
      await api.patch(`/usuarios/${user.id}`, { name: editName });
      user.name = editName; // Atualiza contexto local temporariamente (ideal era o AuthContext fazer reload)
      setActionMessage('Perfil atualizado com sucesso!');
      setShowEditModal(false);
    } catch (err) {
      setActionMessage('Erro ao atualizar perfil.');
    } finally {
      setSavingProfile(false);
      setTimeout(() => setActionMessage(''), 3000);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'FILM': return <Film size={18} />;
      case 'SERIES': return <Tv size={18} />;
      case 'BOOK': return <Book size={18} />;
      default: return null;
    }
  };

  if (!user) return null;

  return (
    <div className="dashboard profile-container">
      {actionMessage && <div className="toast-message">{actionMessage}</div>}

      <div className="glass-panel profile-header">
        <button 
          onClick={() => setShowEditModal(true)}
          className="profile-edit-btn btn-secondary"
        >
          Editar Perfil
        </button>
        <div className="profile-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <h2 className="profile-name">{user.name}</h2>
        <p className="profile-email">{user.email}</p>
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-value">{favorites.length}</span>
            <span className="stat-label">Favoritos</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{reviews.length}</span>
            <span className="stat-label">Avaliações</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Carregando o seu perfil...</div>
      ) : (
        <div className="profile-grid">
          {/* Seção Favoritos */}
          <div className="glass-panel">
            <h3 className="section-title">
              <Heart className="text-pink-500" style={{color: '#ec4899'}} /> Meus Favoritos
            </h3>
            {favorites.length === 0 ? (
              <div className="empty-state">
                <Search size={48} className="mb-4 text-muted mx-auto opacity-50" style={{color: 'var(--text-secondary)'}} />
                <p className="empty-list-text" style={{color: 'var(--text-secondary)'}}>Você ainda não possui favoritos.</p>
              </div>
            ) : (
              <div className="content-grid" style={{marginTop: '1.5rem'}}>
                {favorites.map((fav) => (
                  <div key={fav.id} className="content-card">
                    <div className="card-image-wrapper">
                      <img src={getMockedImage(fav.content.title, fav.content.genre)} alt={fav.content.title} className="card-image" />
                      <div className="card-overlay"></div>
                      <div className="card-type-badge">
                        {getTypeIcon(fav.content.type)}
                      </div>
                    </div>
                    
                    <div className="card-content">
                      <h4 className="card-title">{fav.content.title}</h4>
                      <p className="card-genre">{fav.content.genre}</p>
                      
                      <div className="card-actions" style={{justifyContent: 'center'}}>
                        <button 
                          onClick={() => handleUnfavorite(fav.content.id)}
                          className="action-btn favorited"
                          title="Remover dos favoritos"
                        >
                          <Heart size={18} className="fill-current" />
                          <span>Saved</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Seção Avaliações */}
          <div className="glass-panel">
            <h3 className="section-title">
              <Star style={{color: '#eab308'}} /> Minhas Avaliações
            </h3>
            {reviews.length === 0 ? (
              <div className="empty-state">
                <Search size={48} className="mb-4 text-muted mx-auto opacity-50" style={{color: 'var(--text-secondary)'}} />
                <p className="empty-list-text" style={{color: 'var(--text-secondary)'}}>Você ainda não avaliou nenhum conteúdo.</p>
              </div>
            ) : (
              <div className="content-grid" style={{marginTop: '1.5rem'}}>
                {reviews.map((rev) => (
                  <div key={rev.id} className="content-card">
                    <div className="card-image-wrapper">
                      <img src={getMockedImage(rev.content.title, rev.content.genre)} alt={rev.content.title} className="card-image" />
                      <div className="card-overlay"></div>
                      <div className="card-type-badge">
                        {getTypeIcon(rev.content.type)}
                      </div>
                    </div>
                    
                    <div className="card-content">
                      <h4 className="card-title">{rev.content.title}</h4>
                      <div className="review-rating" style={{display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#eab308', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600}}>
                        <Star size={14} className="fill-current" />
                        <span>{rev.rating}/5</span>
                      </div>
                      {rev.comment && (
                        <p className="review-comment" style={{color: 'var(--text-secondary)', fontSize: '0.875rem', fontStyle: 'italic'}}>"{rev.comment}"</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Editar Perfil */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Editar Perfil</h3>
            </div>
            <div className="modal-body" style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem'}}>Nome</label>
              <input 
                type="text" 
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="input-field"
                style={{width: '100%'}}
                placeholder="Seu nome"
              />
            </div>
            <div className="modal-footer" style={{display: 'flex', gap: '0.5rem'}}>
              <button className="btn-secondary" style={{flex: 1}} onClick={() => setShowEditModal(false)}>Cancelar</button>
              <button className="btn-primary" style={{flex: 1}} onClick={handleSaveProfile} disabled={savingProfile || !editName.trim()}>
                {savingProfile ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
