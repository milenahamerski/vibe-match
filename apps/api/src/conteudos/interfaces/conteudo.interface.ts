export interface Conteudo {
  id: number;
  title: string;
  type: 'filme' | 'série' | 'livro';
  genre: string;
  rating: number;
  details: {
    director: string;
    releaseYear: number;
  };
}
