import fs from 'fs/promises';
import prismaclient from '../../api/lib/prisma.js';
import { encrypt } from '../../api/lib/crypto.js';

/**
 * Creates movies in the database from a JSON file.
 * @param {string} filePath - The path to the JSON file containing movie data.
 * @returns {Promise<object>} - A result object containing the status and count of created movies or an error message.
 */
async function createMoviesFromJson(filePath) {
  try {
    // Read and parse the JSON file
    const data = await fs.readFile(filePath, 'utf-8');
    const movies = JSON.parse(data);

    // Validate the movies data
    if (!Array.isArray(movies) || movies.length === 0) {
      console.error('The JSON file must contain an array of movies');
      return { status: 400, message: 'The JSON file must contain an array of movies' };
    }

    // Validate required fields in each movie
   

    // Insert movies into the database
    const createdMovies = await prismaclient.movie.createMany({
      data: movies.map(({ name, indexer, isAdult, extension, tmdb, downloadPrice, imagePath, rating, added, genres }) => ({
        name,
        indexer: encrypt(String(indexer)), // Encrypt the indexer
        isAdult,
        extension,
        tmdb,
        downloadPrice,
        imagePath,
        rating,
        genres: genres, // Join genres array into a comma-separated string
        added: new Date(added), // Convert added date
      })),
    });

    console.log(`Successfully inserted ${createdMovies.count} movies into the database.`);
    return {
      status: 201,
      message: 'Movies created successfully',
      count: createdMovies.count,
    };
  } catch (error) {
    console.error('Error creating movies:', error);
    return { status: 500, message: 'Failed to create movies', error: error.message };
  }
}

// Call the function with the JSON file path
createMoviesFromJson('movies.json')
  .catch(err => console.error('Unhandled error:', err));
