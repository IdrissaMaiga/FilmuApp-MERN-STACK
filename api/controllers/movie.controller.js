import prismaclient from '../lib/prisma.js'
import updateAField from '../functions/fieldUpdate.js'

// Create a new movie
export const createMovie = async (req, res) => {
  try {
    const { name, description, downloadPrice, type_, address, filename } =
      req.body

    // Only allow admin to create movies
    if (!req.IsAdmin) {
      return res.status(403).json({ message: 'Only admin can create a movie' })
    }

    const newMovie = await prismaclient.movie.create({
      data: {
        name,
        description,
        downloadPrice,
        type_,
        address,
        filename
      }
    })

    res
      .status(201)
      .json({ message: 'Movie created successfully', movie: newMovie })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to create movie' })
  }
}

// Get all movies
export const getMovies = async (req, res) => {
  try {
    let movies = []

    if (req.IsAdmin) {
      // Admin sees all details
      movies = await prismaclient.movie.findMany({
        include: {
          Tastes: true,
          Downloads: true,
          Watchings: true
        }
      })
    } else {
      // Normal user sees limited details
      movies = await prismaclient.movie.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          downloadPrice: true,
          type_: true,
          address: true,
          filename: true,
          Tastes: {
            where: { userId: req.user.id }
          },
          Downloads: {
            where: {
              userId: req.user.id,
              clientconfirm: true
            }
          }, // User's confirmed downloads
          Watchings: {
            where: { userId: req.user.id }
          }
        }
      })
    }

    res.status(200).json(movies)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to fetch movies' })
  }
}

// Get a movie by ID
export const getMovieById = async (req, res) => {
  try {
    const { id } = req.params

    // Fetch the movie by ID
    const movie = await prismaclient.movie.findUnique({
      where: { id },
      include: {
        Tastes: true,
        Downloads: true,
        Watchings: true
      }
    })

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    // Restrict access for normal users
    if (!req.isAdmin) {
      movie.Tastes = movie.Tastes.filter(
        Tastes => Tastes.userId === req.user.id
      )
      movie.Downloads = movie.Watchings.filter(
        Downloads => Downloads.userId === req.user.id
      )
      movie.Watchings = movie.Watchings.filter(
        watchings => watchings.userId === req.user.id
      )
    }

    res.status(200).json(movie)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to fetch movie' })
  }
}

// Update a movie by ID
export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params
    const { fieldName, fieldValue } = req.body

    // Only allow admin to update movies
    if (!req.IsAdmin) {
      return res.status(403).json({ message: 'Only admin can update a movie' })
    }

    const updatedMovie = await updateAField(
      'movie',
      { id },
      fieldName,
      fieldValue
    )

    res.status(200).json({
      message: 'Movie updated successfully',
      movie: updatedMovie
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to update movie' })
  }
}

// Delete a movie by ID
export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params

    // Only allow admin to delete movies
    if (!req.IsAdmin) {
      return res.status(403).json({ message: 'Only admin can delete a movie' })
    }

    await prismaclient.movie.delete({
      where: { id }
    })

    res.status(200).json({ message: 'Movie deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to delete movie' })
  }
}
