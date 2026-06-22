export const getMockedImage = (title: string, genre: string) => {
  const titleMap: Record<string, string> = {
    'De Volta para o Futuro': 'https://m.media-amazon.com/images/M/MV5BZmM3ZjE0NzctNjBiOC00MDZmLTgzMTUtNGVlOWFlOTNiZDJiXkEyXkFqcGc@._V1_QL75_UX380_CR0,14,380,562_.jpg',
    'Superbad: É Hoje': 'https://m.media-amazon.com/images/M/MV5BNjk0MzdlZGEtNTRkOC00ZDRiLWJkYjAtMzUzYTRiNzk1YTViXkEyXkFqcGc@._V1_SX600.jpg',
    'Brooklyn Nine-Nine': 'https://m.media-amazon.com/images/M/MV5BNzBiODQxZTUtNjc0MC00Yzc1LThmYTMtN2YwYTU3NjgxMmI4XkEyXkFqcGc@._V1_SX600.jpg',
    'Vingadores: Ultimato': 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_QL75_UX600.jpg',
    'O Guia do Mochileiro das Galáxias': 'https://m.media-amazon.com/images/M/MV5BMTg4OWYwZjgtZDU0ZS00NjU4LTkxNjItYmYyYmUwNDU5YmM3XkEyXkFqcGc@._V1_SX600.jpg',
    'Modern Family': 'https://m.media-amazon.com/images/M/MV5BYzFlOWFjNzQtODViNC00NzgzLThhZmItZTc1N2VlZDgwODUwXkEyXkFqcGc@._V1_SX600.jpg',
    'Deadpool': 'https://m.media-amazon.com/images/M/MV5BNzY3ZWU5NGQtOTViNC00ZWVmLTliNjAtNzViNzlkZWQ4YzQ4XkEyXkFqcGc@._V1_QL75_UX600.jpg',
    'A Culpa é das Estrelas': 'https://m.media-amazon.com/images/M/MV5BYTA4ODg5YWUtYmZiYy00Y2M4LWE0NjEtODE5MzhkYmJmZGEwXkEyXkFqcGc@._V1_SX600.jpg',
    'This Is Us': 'https://m.media-amazon.com/images/M/MV5BNzk4YzY2ZjUtNTQ2YS00MWQ5LTgzZjctZTRlMmZlMzNjNDc3XkEyXkFqcGc@._V1_SX600.jpg',
    'O Menino do Pijama Listrado': 'https://m.media-amazon.com/images/M/MV5BMTMzMTc3MjA5NF5BMl5BanBnXkFtZTcwOTk3MDE5MQ@@._V1_SX600.jpg',
    'Orgulho e Preconceito': 'https://m.media-amazon.com/images/M/MV5BYzNkMjRmZGMtODg1Ni00MjIxLWI4MTYtOGEwM2YyMmZiMjUzXkEyXkFqcGc@._V1_SX600.jpg',
    'A Lista de Schindler': 'https://m.media-amazon.com/images/M/MV5BNjM1ZDQxYWUtMzQyZS00MTE1LWJmZGYtNGUyNTdlYjM3ZmVmXkEyXkFqcGc@._V1_QL75_UX600.jpg',
    'Me Chame Pelo Seu Nome': 'https://m.media-amazon.com/images/M/MV5BNDk3NTEwNjc0MV5BMl5BanBnXkFtZTgwNzYxNTMwMzI@._V1_SX600.jpg',
    'A Origem': 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_QL75_UX600.jpg',
    'Stranger Things': 'https://m.media-amazon.com/images/M/MV5BNjRiMTA4NWUtNmE0ZC00NGM0LWJhMDUtZWIzMDM5ZDIzNTg3XkEyXkFqcGc@._V1_QL75_UX600.jpg',
    'O Iluminado': 'https://m.media-amazon.com/images/M/MV5BNmM5ZThhY2ItOGRjOS00NzZiLWEwYTItNDgyMjFkOTgxMmRiXkEyXkFqcGc@._V1_SX600.jpg',
    'It: A Coisa': 'https://m.media-amazon.com/images/M/MV5BZGZmOTZjNzUtOTE4OS00OGM3LWJiNGEtZjk4Yzg2M2Q1YzYxXkEyXkFqcGc@._V1_QL75_UX600.jpg',
    'Chernobyl': 'https://m.media-amazon.com/images/M/MV5BNzU0OTI4YTQtNGQ1ZS00ZjA4LTg3MTMtZjkyZWNjN2RiZDJmXkEyXkFqcGc@._V1_QL75_UX600.jpg',
    'Black Mirror': 'https://m.media-amazon.com/images/M/MV5BODcxMWI2NDMtYTc3NC00OTZjLWFmNmUtM2NmY2I1ODkxYzczXkEyXkFqcGc@._V1_QL75_UX600.jpg',
    'Ilha do Medo': 'https://m.media-amazon.com/images/M/MV5BN2FjNWExYzEtY2YzOC00YjNlLTllMTQtNmIwM2Q1YzBhOWM1XkEyXkFqcGc@._V1_QL75_UX600.jpg',
    'Interestelar': 'https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_QL75_UX600.jpg'
  };

  if (titleMap[title]) return titleMap[title];

  const genreMap: Record<string, string> = {
    'Sci-Fi': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80',
    'Romance': 'https://images.unsplash.com/photo-1518199266791-5375a83164ba?auto=format&fit=crop&w=400&q=80',
    'Ação': 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80',
    'Drama': 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&q=80',
    'Terror': 'https://images.unsplash.com/photo-1505635552518-3448ff116af3?auto=format&fit=crop&w=400&q=80',
    'Suspense': 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=400&q=80',
    'Comédia': 'https://images.unsplash.com/photo-1543584756-8f40a802e14f?auto=format&fit=crop&w=400&q=80',
    'Documentário': 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=400&q=80'
  };
  return genreMap[genre] || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80';
};
