import fs from 'fs/promises';
import prismaclient from '../../api/lib/prisma.js';
import { encrypt } from '../../api/lib/crypto.js';

/**
 * Creates series in the database from a JSON file.
 * @param {string} filePath - The path to the JSON file containing series data.
 * @returns {Promise<object>} - A result object containing the status and count of created series or an error message.
 */
async function createSeriesFromJson(filePath) {
  try {
    // Read and parse the JSON file
    const data = await fs.readFile(filePath, 'utf-8');
    const series = JSON.parse(data);

    // Validate the series data
    if (!Array.isArray(series) || series.length === 0) {
      console.error('The JSON file must contain an array of series');
      return { status: 400, message: 'The JSON file must contain an array of series' };
    }

    // Validate required fields in each series
    for (const serie of series) {
      

      // Validate genres
      if (!Array.isArray(serie.genres) || !serie.genres.every(genre => typeof genre === 'string')) {
        console.error(`Invalid genres for series "${serie.name}". Genres must be an array of strings.`);
        return {
          status: 400,
          message: `Invalid genres for series "${serie.name}". Genres must be an array of strings.`,
        };
      }
    }

    // Insert series into the database
    const createdSeries = await prismaclient.series.createMany({
      data: series.map(({ name, downloadPrice, seenby, published, serieId, imagePath, genres, tmdb, rating }) => ({
        name,
        downloadPrice,
        seenby,
        published: new Date(published), // Convert published date
        serieId: encrypt(String(serieId)), // Encrypt the serieId
        imagePath,
        genres: genres, // Join genres array into a comma-separated string
        tmdb,
        rating: rating ?? null, // Use null if rating is undefined
      })),
    });

    console.log(`Successfully inserted ${createdSeries.count} series into the database.`);
    return {
      status: 201,
      message: 'Series created successfully',
      count: createdSeries.count,
    };
  } catch (error) {
    console.error('Error creating series:', error);
    return { status: 500, message: 'Failed to create series', error: error.message };
  }
}

// Call the function with the JSON file path
createSeriesFromJson('mappedSeries.json')
  .catch(err => console.error('Unhandled error:', err));
