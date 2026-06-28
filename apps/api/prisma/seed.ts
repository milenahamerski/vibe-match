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
  console.log('Seeding database with movies and series (100+ items)...');
  
  await prisma.content.deleteMany();

  const contents = [
    { title: "Mad Max: Fury Road", type: "FILM", genre: "Action" },
    { title: "John Wick", type: "FILM", genre: "Action" },
    { title: "The Matrix", type: "FILM", genre: "Action" },
    { title: "Gladiator", type: "FILM", genre: "Action" },
    { title: "Die Hard", type: "FILM", genre: "Action" },
    { title: "Terminator 2: Judgment Day", type: "FILM", genre: "Action" },
    { title: "The Dark Knight", type: "FILM", genre: "Action" },
    { title: "Avengers: Endgame", type: "FILM", genre: "Action" },
    { title: "Mission: Impossible - Fallout", type: "FILM", genre: "Action" },
    { title: "Black Panther", type: "FILM", genre: "Action" },
    { title: "Spider-Man: Into the Spider-Verse", type: "FILM", genre: "Action" },
    { title: "Jurassic Park", type: "FILM", genre: "Action" },
    { title: "The Batman", type: "FILM", genre: "Action" },
    { title: "Superbad", type: "FILM", genre: "Comedy" },
    { title: "The Hangover", type: "FILM", genre: "Comedy" },
    { title: "White Chicks", type: "FILM", genre: "Comedy" },
    { title: "The 40-Year-Old Virgin", type: "FILM", genre: "Comedy" },
    { title: "School of Rock", type: "FILM", genre: "Comedy" },
    { title: "Deadpool", type: "FILM", genre: "Comedy" },
    { title: "Tropic Thunder", type: "FILM", genre: "Comedy" },
    { title: "Dumb and Dumber", type: "FILM", genre: "Comedy" },
    { title: "American Pie", type: "FILM", genre: "Comedy" },
    { title: "Brooklyn Nine-Nine", type: "SERIES", genre: "Comedy" },
    { title: "The Truman Show", type: "FILM", genre: "Comedy" },
    { title: "Spirited Away", type: "FILM", genre: "Comedy" },
    { title: "Monty Python and the Holy Grail", type: "FILM", genre: "Comedy" },
    { title: "The Godfather", type: "FILM", genre: "Drama" },
    { title: "The Green Mile", type: "FILM", genre: "Drama" },
    { title: "The Shawshank Redemption", type: "FILM", genre: "Drama" },
    { title: "Schindler's List", type: "FILM", genre: "Drama" },
    { title: "This Is Us", type: "SERIES", genre: "Drama" },
    { title: "Fight Club", type: "FILM", genre: "Drama" },
    { title: "Forrest Gump", type: "FILM", genre: "Drama" },
    { title: "The Boy in the Striped Pajamas", type: "FILM", genre: "Drama" },
    { title: "Succession", type: "SERIES", genre: "Drama" },
    { title: "Breaking Bad", type: "SERIES", genre: "Drama" },
    { title: "The Godfather: Part II", type: "FILM", genre: "Drama" },
    { title: "Whiplash", type: "FILM", genre: "Drama" },
    { title: "Joker", type: "FILM", genre: "Drama" },
    { title: "The Fault in Our Stars", type: "FILM", genre: "Romance" },
    { title: "Pride & Prejudice", type: "FILM", genre: "Romance" },
    { title: "The Notebook", type: "FILM", genre: "Romance" },
    { title: "Call Me by Your Name", type: "FILM", genre: "Romance" },
    { title: "Titanic", type: "FILM", genre: "Romance" },
    { title: "La La Land", type: "FILM", genre: "Romance" },
    { title: "Before Sunrise", type: "FILM", genre: "Romance" },
    { title: "About Time", type: "FILM", genre: "Romance" },
    { title: "Me Before You", type: "FILM", genre: "Romance" },
    { title: "P.S. I Love You", type: "FILM", genre: "Romance" },
    { title: "Your Name", type: "FILM", genre: "Romance" },
    { title: "Eternal Sunshine of the Spotless Mind", type: "FILM", genre: "Romance" },
    { title: "Interstellar", type: "FILM", genre: "Sci-Fi" },
    { title: "Back to the Future", type: "FILM", genre: "Sci-Fi" },
    { title: "Blade Runner 2049", type: "FILM", genre: "Sci-Fi" },
    { title: "The Hitchhiker's Guide to the Galaxy", type: "BOOK", genre: "Sci-Fi" },
    { title: "The Martian", type: "FILM", genre: "Sci-Fi" },
    { title: "Star Wars: Episode V", type: "FILM", genre: "Sci-Fi" },
    { title: "Dune", type: "FILM", genre: "Sci-Fi" },
    { title: "Black Mirror", type: "SERIES", genre: "Sci-Fi" },
    { title: "Dark", type: "SERIES", genre: "Sci-Fi" },
    { title: "The Terminator", type: "FILM", genre: "Sci-Fi" },
    { title: "WALL-E", type: "FILM", genre: "Sci-Fi" },
    { title: "Alien", type: "FILM", genre: "Sci-Fi" },
    { title: "The Thing", type: "FILM", genre: "Sci-Fi" },
    { title: "The Shining", type: "FILM", genre: "Horror" },
    { title: "It", type: "FILM", genre: "Horror" },
    { title: "The Conjuring", type: "FILM", genre: "Horror" },
    { title: "Hereditary", type: "FILM", genre: "Horror" },
    { title: "Get Out", type: "FILM", genre: "Horror" },
    { title: "The Witch", type: "FILM", genre: "Horror" },
    { title: "The Exorcist", type: "FILM", genre: "Horror" },
    { title: "Sinister", type: "FILM", genre: "Horror" },
    { title: "A Quiet Place", type: "FILM", genre: "Horror" },
    { title: "Halloween", type: "FILM", genre: "Horror" },
    { title: "Psycho", type: "FILM", genre: "Horror" },
    { title: "Inception", type: "FILM", genre: "Thriller" },
    { title: "Stranger Things", type: "SERIES", genre: "Thriller" },
    { title: "Shutter Island", type: "FILM", genre: "Thriller" },
    { title: "Se7en", type: "FILM", genre: "Thriller" },
    { title: "The Silence of the Lambs", type: "FILM", genre: "Thriller" },
    { title: "Zodiac", type: "FILM", genre: "Thriller" },
    { title: "Gone Girl", type: "FILM", genre: "Thriller" },
    { title: "The Sixth Sense", type: "FILM", genre: "Thriller" },
    { title: "Mindhunter", type: "SERIES", genre: "Thriller" },
    { title: "Black Swan", type: "FILM", genre: "Thriller" },
    { title: "Pulp Fiction", type: "FILM", genre: "Thriller" },
    { title: "Parasite", type: "FILM", genre: "Thriller" },
    { title: "No Country for Old Men", type: "FILM", genre: "Thriller" },
    { title: "Memento", type: "FILM", genre: "Thriller" },
    { title: "The Prestige", type: "FILM", genre: "Thriller" },
    { title: "Super 8", type: "FILM", genre: "Thriller" },
    { title: "Chernobyl", type: "SERIES", genre: "Documentary" },
    { title: "My Octopus Teacher", type: "FILM", genre: "Documentary" },
    { title: "Our Planet", type: "SERIES", genre: "Documentary" },
    { title: "Making a Murderer", type: "SERIES", genre: "Documentary" },
    { title: "The Social Dilemma", type: "FILM", genre: "Documentary" },
    { title: "The Last Dance", type: "SERIES", genre: "Documentary" },
    { title: "Icarus", type: "FILM", genre: "Documentary" },
    { title: "Fyre", type: "FILM", genre: "Documentary" },
    { title: "March of the Penguins", type: "FILM", genre: "Documentary" },
    { title: "Super Size Me", type: "FILM", genre: "Documentary" },
    { title: "Free Solo", type: "FILM", genre: "Documentary" }
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
