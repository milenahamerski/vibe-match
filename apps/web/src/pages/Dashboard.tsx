import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';
import { Heart, Star, Film, Tv, Book, Search } from 'lucide-react';
import { getMockedImage } from '../utils/images';

interface Content {
  id: string;
  title: string;
  type: 'FILM' | 'SERIES' | 'BOOK';
  genre: string;
}

const moods = [
  { id: 'feliz', label: 'Feliz 😊', color: '#f59e0b' },
  { id: 'triste', label: 'Triste 😢', color: '#3b82f6' },
  { id: 'relaxado', label: 'Relaxado 😌', color: '#10b981' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [activeMood, setActiveMood] = useState<string>('');

  // User History State
  const [userFavs, setUserFavs] = useState<string[]>([]);
  const [userReviews, setUserReviews] = useState<string[]>([]);

  // Modais state
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [showSynopsis, setShowSynopsis] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [ratingValue, setRatingValue] = useState<number>(0);
  const [ratingComment, setRatingComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

  const fetchRecommendations = async (mood: string) => {
    setActiveMood(mood);
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/conteudos/recomendacoes/humor/${mood}`);
      setRecommendations(response.data?.data || response.data);
      
      // Fetch user history to paint hearts red
      if (user) {
        const [favRes, revRes] = await Promise.all([
          api.get(`/favoritos/real/usuario/${user.id}`),
          api.get(`/avaliacoes/usuario/${user.id}`)
        ]);
        
        const favs = (favRes.data?.data || favRes.data || []).map((f: any) => f.contentId);
        const revs = (revRes.data?.data || revRes.data || []).map((r: any) => r.contentId);
        
        setUserFavs(favs);
        setUserReviews(revs);
      }
    } catch (err) {
      setError('Erro ao buscar recomendações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (contentId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita abrir o modal ao clicar no botão
    if (!user) return;
    
    // Se já é favorito, desfavoritar
    if (userFavs.includes(contentId)) {
      try {
        await api.delete(`/favoritos/usuario/${user.id}/conteudo/${contentId}`);
        setUserFavs(prev => prev.filter(id => id !== contentId));
        setActionMessage('Removido dos favoritos.');
      } catch (err) {
        setActionMessage('Erro ao remover favorito.');
      }
    } else {
      // Se não é, favoritar
      try {
        await api.post('/favoritos', { userId: user.id, contentId });
        setUserFavs(prev => [...prev, contentId]);
        setActionMessage('Adicionado aos favoritos!');
      } catch (err: any) {
        if (err.response?.status === 409) {
          setActionMessage('Este conteúdo já está nos seus favoritos.');
        } else {
          setActionMessage('Erro ao favoritar.');
        }
      }
    }
    setTimeout(() => setActionMessage(''), 3000);
  };

  const openSynopsis = (content: Content) => {
    setSelectedContent(content);
    setShowSynopsis(true);
  };

  const openRating = (content: Content, e: React.MouseEvent) => {
    e.stopPropagation();
    if (userReviews.includes(content.id)) {
      setActionMessage('Você já avaliou este filme!');
      setTimeout(() => setActionMessage(''), 3000);
      return;
    }
    setSelectedContent(content);
    setRatingValue(0);
    setRatingComment('');
    setShowRating(true);
  };

  const submitRating = async () => {
    if (!user || !selectedContent || ratingValue === 0) return;
    setSubmittingRating(true);
    try {
      await api.post('/avaliacoes', {
        userId: user.id,
        contentId: selectedContent.id,
        rating: ratingValue,
        comment: ratingComment
      });
      setUserReviews(prev => [...prev, selectedContent.id]);
      setActionMessage('Avaliação salva com sucesso!');
      setShowRating(false);
    } catch (err: any) {
      if (err.response?.status === 409) {
         setActionMessage('Você já avaliou este conteúdo.');
      } else {
         setActionMessage('Erro ao enviar avaliação.');
      }
    } finally {
      setSubmittingRating(false);
      setTimeout(() => setActionMessage(''), 3000);
    }
  };

  const getSynopsis = (content: Content) => {
    const genre = content.genre.toLowerCase();
    if (genre === 'comédia' || genre === 'comedy') return `Prepare-se para dar muitas risadas com "${content.title}". Uma comédia hilária sobre situações cotidianas que fogem totalmente do controle!`;
    if (genre === 'drama') return `Em "${content.title}", acompanhe uma jornada emocionante e profunda sobre escolhas da vida, perda e esperança. Prepare os lencinhos.`;
    if (genre === 'romance') return `Uma história de amor apaixonante em "${content.title}". Duas pessoas de mundos diferentes descobrem que o amor pode superar qualquer barreira.`;
    if (genre === 'terror' || genre === 'suspense') return `Você não vai conseguir dormir depois de ver "${content.title}". Mistérios obscuros, tensão a cada minuto e um final surpreendente.`;
    if (genre === 'sci-fi') return `Em "${content.title}", o futuro da humanidade está em jogo. Eine incrível aventura científica através do tempo e espaço.`;
    if (genre === 'ação') return `Muitas explosões, lutas épicas e adrenalina pura definem "${content.title}". O herói terá que correr contra o tempo.`;
    return `Descubra a fantástica obra "${content.title}", um título imperdível do gênero ${content.genre}.`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'FILM': return <Film size={18} />;
      case 'SERIES': return <Tv size={18} />;
      case 'BOOK': return <Book size={18} />;
      default: return null;
    }
  };

  const moods = [
    { id: 'feliz', label: 'Feliz', icon: '✨' },
    { id: 'triste', label: 'Triste', icon: '🌧️' },
    { id: 'romantico', label: 'Romântico', icon: '❤️' },
    { id: 'aventureiro', label: 'Aventureiro', icon: '🚀' },
    { id: 'cansado', label: 'Cansado', icon: '😴' }
  ];

  return (
    <div className="dashboard-container relative">
      {actionMessage && <div className="toast-message">{actionMessage}</div>}

      <div className="dashboard-header">
        <h2 className="dashboard-title">Como você está se sentindo hoje?</h2>
        <p className="dashboard-subtitle">Selecione o humor para guiarmos as recomendações</p>
        
        <div className="mood-picker">
          {moods.map((m) => (
            <button 
              key={m.id}
              className={`mood-btn ${activeMood === m.id ? 'active' : ''}`}
              onClick={() => fetchRecommendations(m.id)}
            >
              <span className="text-xl">{m.icon}</span> {m.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Preparando a vibe perfeita para você...</p>
        </div>
      )}

      <div className="recommendations-section">
        {error ? (
          <div className="error-state">{error}</div>
        ) : recommendations.length > 0 ? (
          <div className="animate-fade-in">
            <h3 className="section-title">Recomendado para você</h3>
            <div className="content-grid">
              {recommendations.map((content) => (
                <div 
                  key={content.id} 
                  className="content-card"
                  onClick={() => openSynopsis(content)}
                >
                  <div className="card-image-wrapper">
                    <img src={getMockedImage(content.title, content.genre)} alt={content.title} className="card-image" />
                    <div className="card-overlay"></div>
                    <div className="card-type-badge">
                      {getTypeIcon(content.type)}
                    </div>
                  </div>
                  
                  <div className="card-content">
                    <h4 className="card-title">{content.title}</h4>
                    <p className="card-genre">{content.genre}</p>
                    
                    <div className="card-actions">
                      <button 
                        className={`action-btn ${userFavs.includes(content.id) ? 'favorited' : ''}`} 
                        onClick={(e) => handleFavorite(content.id, e)} 
                        title={userFavs.includes(content.id) ? "Desfavoritar" : "Favoritar"}
                      >
                        <Heart 
                          size={18} 
                          className={userFavs.includes(content.id) ? "fill-current" : ""} 
                        />
                        <span>{userFavs.includes(content.id) ? 'Salvo' : 'Salvar'}</span>
                      </button>
                      <button 
                        className={`action-btn ${userReviews.includes(content.id) ? 'rated' : ''}`} 
                        onClick={(e) => openRating(content, e)} 
                        title="Avaliar"
                      >
                        <Star 
                          size={18} 
                          className={userReviews.includes(content.id) ? "fill-current" : ""} 
                        />
                        <span>{userReviews.includes(content.id) ? 'Avaliado' : 'Avaliar'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeMood ? (
          <div className="empty-state">
            <Search size={48} className="mb-4 text-muted mx-auto opacity-50" style={{color: 'var(--text-secondary)'}} />
            <p style={{color: 'var(--text-secondary)'}}>Não encontramos recomendações exatas para esse humor agora.</p>
          </div>
        ) : (
          <div className="empty-state initial">
            <p style={{color: 'var(--text-secondary)'}}>Selecione um humor acima para começar a descobrir novos conteúdos.</p>
          </div>
        )}
      </div>

      {/* Modal Sinopse */}
      {showSynopsis && selectedContent && (
        <div className="modal-overlay" onClick={() => setShowSynopsis(false)}>
          <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedContent.title}</h3>
              <span className="badge">{selectedContent.genre}</span>
            </div>
            <div className="modal-body">
              <p className="synopsis-text">{getSynopsis(selectedContent)}</p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary w-full" onClick={() => setShowSynopsis(false)}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Avaliação */}
      {showRating && selectedContent && (
        <div className="modal-overlay" onClick={() => setShowRating(false)}>
          <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Avaliar {selectedContent.title}</h3>
            </div>
            <div className="modal-body">
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    size={32} 
                    className={`star-icon ${ratingValue >= star ? 'filled' : ''}`}
                    onClick={() => setRatingValue(star)}
                  />
                ))}
              </div>
              <textarea 
                placeholder="O que você achou? (opcional)"
                value={ratingComment}
                onChange={e => setRatingComment(e.target.value)}
                className="input-field mt-4"
                rows={3}
              />
            </div>
            <div className="modal-footer flex gap-2">
              <button className="btn-secondary flex-1" onClick={() => setShowRating(false)}>Cancelar</button>
              <button className="btn-primary flex-1" onClick={submitRating} disabled={submittingRating || ratingValue === 0}>
                {submittingRating ? 'Enviando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
