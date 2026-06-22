import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database with movies and series...');

  const contents = [
    // Feliz
    { title: 'De Volta para o Futuro', type: 'FILM', genre: 'Sci-Fi' },
    { title: 'Superbad: É Hoje', type: 'FILM', genre: 'Comédia' },
    { title: 'Brooklyn Nine-Nine', type: 'SERIES', genre: 'Comédia' },
    { title: 'Vingadores: Ultimato', type: 'FILM', genre: 'Ação' },
    { title: 'O Guia do Mochileiro das Galáxias', type: 'BOOK', genre: 'Sci-Fi' },
    { title: 'Modern Family', type: 'SERIES', genre: 'Comédia' },
    { title: 'Deadpool', type: 'FILM', genre: 'Ação' },
    
    // Triste / Melancolico
    { title: 'A Culpa é das Estrelas', type: 'FILM', genre: 'Romance' },
    { title: 'This Is Us', type: 'SERIES', genre: 'Drama' },
    { title: 'O Menino do Pijama Listrado', type: 'FILM', genre: 'Drama' },
    { title: 'Orgulho e Preconceito', type: 'BOOK', genre: 'Romance' },
    { title: 'A Lista de Schindler', type: 'FILM', genre: 'Drama' },
    { title: 'Me Chame Pelo Seu Nome', type: 'FILM', genre: 'Romance' },

    // Tenso / Suspense / Terror
    { title: 'A Origem', type: 'FILM', genre: 'Suspense' },
    { title: 'Stranger Things', type: 'SERIES', genre: 'Suspense' },
    { title: 'O Iluminado', type: 'BOOK', genre: 'Terror' },
    { title: 'It: A Coisa', type: 'FILM', genre: 'Terror' },
    { title: 'Chernobyl', type: 'SERIES', genre: 'Documentário' },
    { title: 'Black Mirror', type: 'SERIES', genre: 'Sci-Fi' },
    { title: 'Ilha do Medo', type: 'FILM', genre: 'Suspense' }
  ];

  for (const content of contents) {
    await prisma.content.create({
      data: content,
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
