import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';
import './Explore.css';
import { getMockedImage } from '../utils/images';

interface Content {
  id: string;
  title: string;
  type: 'FILM' | 'SERIES' | 'BOOK';
  genre: string;
}

const Explore = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  // Favorites & Reviews state
  const [userFavs, setUserFavs] = useState<string[]>([]);
  const [userReviews, setUserReviews] = useState<string[]>([]);

  // Modals state
  const [showSynopsis, setShowSynopsis] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

  // Fetch initial user data (favorites/reviews)
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      try {
        const favsResponse = await api.get(`/favoritos/real/usuario/${user.id}`);
        setUserFavs((favsResponse.data?.data || favsResponse.data || []).map((f: any) => f.content.id));
        
        const revsResponse = await api.get(`/avaliacoes/usuario/${user.id}`);
        setUserReviews((revsResponse.data?.data || revsResponse.data || []).map((r: any) => r.contentId));
      } catch (err) {
        console.error("Error fetching user data", err);
      }
    };
    fetchUserData();
  }, [user]);

  // Fetch movie list based on search term
  useEffect(() => {
    const fetchContents = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/conteudos`, {
          params: { filter: searchTerm }
        });
        setContents(response.data?.data || response.data || []);
      } catch (err) {
        console.error(err);
        setError('Error loading catalog. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchContents();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleFavorite = async (contentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    
    if (userFavs.includes(contentId)) {
      try {
        await api.delete(`/favoritos/usuario/${user.id}/conteudo/${contentId}`);
        setUserFavs(prev => prev.filter(id => id !== contentId));
        setActionMessage('Removed from favorites.');
      } catch (err) {
        console.error(err);
        setActionMessage('Error removing favorite.');
      }
    } else {
      try {
        await api.post('/favoritos', { userId: user.id, contentId });
        setUserFavs(prev => [...prev, contentId]);
        setActionMessage('Added to favorites!');
      } catch (err: any) {
        if (err.response?.status === 409) {
          setActionMessage('This content is already in your favorites.');
        } else {
          setActionMessage('Error adding to favorites.');
        }
      }
    }
    setTimeout(() => setActionMessage(''), 3000);
  };

  const openRating = (content: Content, e: React.MouseEvent) => {
    e.stopPropagation();
    if (userReviews.includes(content.id)) {
      setActionMessage('You have already rated this content!');
      setTimeout(() => setActionMessage(''), 3000);
      return;
    }
    setSelectedContent(content);
    setRatingValue(0);
    setRatingComment('');
    setShowRating(true);
  };

  const submitRating = async () => {
    if (!user || !selectedContent) return;
    setSubmittingRating(true);
    try {
      await api.post('/avaliacoes', {
        userId: user.id,
        contentId: selectedContent.id,
        rating: ratingValue,
        comment: ratingComment
      });
      setUserReviews(prev => [...prev, selectedContent.id]);
      setActionMessage('Review submitted successfully!');
      setShowRating(false);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 409) {
         setActionMessage('You have already rated this content.');
      } else {
         setActionMessage('Error submitting review.');
      }
    } finally {
      setSubmittingRating(false);
      setTimeout(() => setActionMessage(''), 3000);
    }
  };

  const openSynopsis = (content: Content) => {
    setSelectedContent(content);
    setShowSynopsis(true);
  };

  const getSynopsis = (content: Content) => {
    const genre = content.genre.toLowerCase();
    if (genre === 'comedy') return `Get ready for lots of laughs with "${content.title}". A hilarious comedy about everyday situations completely out of control!`;
    if (genre === 'drama') return `In "${content.title}", follow an emotional and deep journey about life choices, loss, and hope. Get your tissues ready.`;
    if (genre === 'romance') return `A passionate love story in "${content.title}". Two people from different worlds discover that love can overcome any barrier.`;
    if (genre === 'horror' || genre === 'thriller') return `You won't be able to sleep after watching "${content.title}". Dark mysteries, constant tension, and a surprising ending.`;
    if (genre === 'sci-fi') return `In "${content.title}", the future of humanity is at stake. An incredible scientific adventure through time and space.`;
    if (genre === 'action') return `Lots of explosions, epic fights, and pure adrenaline define "${content.title}". The hero will have to race against time.`;
    return `Discover the fantastic work "${content.title}", a must-watch title in the ${content.genre} genre.`;
  };

  return (
    <div className="explore-container dashboard-container">
      {actionMessage && <div className="toast-message">{actionMessage}</div>}

      <div className="explore-header">
        <h2 className="brand-text text-3xl font-extrabold" style={{ marginBottom: '0.5rem' }}>Explore Catalog</h2>
        <p className="text-secondary" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>Browse our entire collection of movies, series, and books</p>

        {/* Search Bar */}
        <div className="search-bar-wrapper">
          <span className="material-symbols-outlined search-icon">search</span>
          <input 
            type="text" 
            placeholder="Search by title, genre..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-btn" onClick={() => setSearchTerm('')}>
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>
      </div>

      <div className="recommendations-section mt-6">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Searching the catalog...</p>
          </div>
        ) : error ? (
          <div className="empty-state">{error}</div>
        ) : contents.length > 0 ? (
          <div className="animate-fade-in">
            <div className="section-header mb-4">
              <h3 className="section-title">All Titles ({contents.length})</h3>
            </div>
            <div className="content-grid">
              {contents.map((content) => (
                <div 
                  key={content.id} 
                  className="content-card"
                  onClick={() => openSynopsis(content)}
                >
                  <div className="card-image-wrapper">
                    <img src={getMockedImage(content.title, content.genre)} alt={content.title} className="card-image" />
                    <div className="card-overlay"></div>
                    <div className="card-type-badge">
                      <span className="material-symbols-outlined" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span>4.9</span>
                    </div>
                  </div>
                  
                  <div className="card-content">
                    <button 
                      className="card-fab"
                      onClick={(e) => { e.stopPropagation(); openSynopsis(content); }}
                      title="Play / View"
                    >
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                    </button>

                    <div className="card-genre">{content.genre}</div>
                    <h4 className="card-title">{content.title}</h4>
                    
                    <div className="card-actions">
                      <button 
                        className={`action-btn ${userFavs.includes(content.id) ? 'favorited' : ''}`} 
                        onClick={(e) => handleFavorite(content.id, e)} 
                        title={userFavs.includes(content.id) ? "Remove Favorite" : "Favorite"}
                      >
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: userFavs.includes(content.id) ? "'FILL' 1" : "'FILL' 0" }}>
                          favorite
                        </span>
                        <span>{userFavs.includes(content.id) ? 'Saved' : 'Save'}</span>
                      </button>
                      <button 
                        className={`action-btn ${userReviews.includes(content.id) ? 'rated' : ''}`} 
                        onClick={(e) => openRating(content, e)} 
                        title="Rate"
                      >
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: userReviews.includes(content.id) ? "'FILL' 1" : "'FILL' 0" }}>
                          star
                        </span>
                        <span>{userReviews.includes(content.id) ? 'Rated' : 'Rate'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <span className="material-symbols-outlined" style={{ fontSize: '48px', opacity: 0.5 }}>search_off</span>
            <p className="mt-4">No titles match your search term.</p>
          </div>
        )}
      </div>

      {/* Modal Synopsis */}
      {showSynopsis && selectedContent && (
        <div className="modal-overlay" onClick={() => setShowSynopsis(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedContent.title}</h3>
              <span className="badge">{selectedContent.genre}</span>
            </div>
            <div className="modal-body">
              <p className="synopsis-text">{getSynopsis(selectedContent)}</p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary w-full" onClick={() => setShowSynopsis(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Rating */}
      {showRating && selectedContent && (
        <div className="modal-overlay" onClick={() => setShowRating(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Rate {selectedContent.title}</h3>
            </div>
            <div className="modal-body">
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map(star => (
                  <span 
                    key={star} 
                    className={`material-symbols-outlined star-icon ${ratingValue >= star ? 'filled' : ''}`}
                    onClick={() => setRatingValue(star)}
                    style={{ fontSize: '32px', fontVariationSettings: ratingValue >= star ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <textarea 
                placeholder="What did you think? (optional)"
                value={ratingComment}
                onChange={e => setRatingComment(e.target.value)}
                className="input-field mt-4"
                rows={3}
              />
            </div>
            <div className="modal-footer flex gap-2">
              <button className="btn-secondary flex-1" onClick={() => setShowRating(false)}>Cancel</button>
              <button className="btn-primary flex-1" onClick={submitRating} disabled={submittingRating || ratingValue === 0}>
                {submittingRating ? 'Submitting...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;
