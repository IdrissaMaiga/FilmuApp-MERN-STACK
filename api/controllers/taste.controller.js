import prismaclient from '../lib/prisma.js'
import updateAField from '../functions/fieldUpdate.js'

// Create a new taste
export const createTaste = async (req, res) => {
  try {
    const { name } = req.body
    const userId = req.user.id // Assuming user ID is stored in req.user

    // Check if the user already has a taste
    const existingTaste = await prismaclient.taste.findFirst({
      where: { userId }
    })

    if (existingTaste) {
      return res.status(400).json({ message: 'User already has a taste' })
    }

    // Create the new taste
    const newTaste = await prismaclient.taste.create({
      data: {
        name: name || 'mylist',
        userId
      }
    })

    res.status(201).json({
      message: 'Taste created successfully',
      taste: newTaste
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to create taste' })
  }
}
// Get the taste of the logged-in user
export const getTaste = async (req, res) => {
  try {
    const { userId } = req.params // User ID to update (for admin use)
    const loggedInUserId = req.user.id // Logged-in user ID
    const { selections } = req.body
    // Check if the logged-in user is an admin
    const isAdmin = req.isAdmin

    // Determine the user ID to update based on admin status
    const targetUserId = isAdmin ? userId : loggedInUserId

    // Fetch the taste for the logged-in user including related movieorseries
    const taste = await prismaclient.taste.findUnique({
      where: { userId: targetUserId },
      include: isAdmin ? selections : { Movies: true, Series: true } // Include movieorseries details
    })

    if (!taste) {
      return res.status(404).json({ message: 'Taste not found for the user' })
    }

    res.status(200).json(taste)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to fetch taste' })
  }
}

// Function to add a movie or series to the user's taste
export const addordeleteTaste = async (req, res) => {
  try {
    const { movieId, seriesId, inOut } = req.body
    const userId = req.user.id // Assuming user ID is stored in req.user

    // Validate that either movieId or seriesId is provided, but not both
    if ((movieId && seriesId) || (!movieId && !seriesId)) {
      return res
        .status(400)
        .json({ message: 'Provide either movieId or seriesId, but not both' })
    }

    // Fetch the user's taste
    const userTaste = await prismaclient.taste.findUnique({
      where: { userId },
      select: {
        id: true,
        MovieIds: true,
        SerieIds: true,
        Series: true,
        Movies: true
      }
    })

    if (!userTaste) {
      return res.status(404).json({ message: 'Taste not found for the user' })
    }

    // Check if the movie or series is already in the user's taste
    if (movieId) {
      const isMovieInTaste = userTaste.MovieIds.includes(movieId)
      if (isMovieInTaste && inOut) {
        return res
          .status(400)
          .json({ message: 'Movie is already in your taste list' })
      }
      if (!inOut && userTaste.Movies.length === 0) {
        return res
          .status(400)
          .json({ message: 'You have no movies in your taste list' })
      }
      let updatedMovieIds
      if (!inOut) {
        updatedMovieIds = userTaste.MovieIds.filter(id => id !== movieId)
      }

      // Add the movie to the user's taste

       await prismaclient.movie.update({
        where: { id: movieId },
        data: {
          tasteIds: inOut
            ? {
                push: userTaste.id
              }
            : {
                set: userTaste.Movies.find(
                  movie => movie.id === movieId
                ).tasteIds.filter(id => id !== userTaste.id)
              }
        }
      })
      const updatedTaste = await prismaclient.taste.update({
        where: { userId },
        data: {
          MovieIds: inOut
            ? {
                push: movieId
              }
            : updatedMovieIds
        },
        include: {
          Series: true,
          Movies: true
        }
      })

      res.status(200).json({
        message:
          'Movie ' +
          (inOut ? 'added to' : 'deleted from') +
          ' taste successfully',
        taste: updatedTaste
      })
    } else if (seriesId) {
      const isSeriesInTaste = userTaste.SerieIds.includes(seriesId)
      if (isSeriesInTaste && inOut) {
        return res
          .status(400)
          .json({ message: 'Series is already in your taste list' })
      }
      if (!inOut && userTaste.Series.length === 0) {
        return res
          .status(400)
          .json({ message: 'You have no movies in your taste list' })
      }
      let updatedSerieIds
      if (!inOut) {
        updatedSerieIds = userTaste.seriesId.filter(id => id !== seriesId)
      }
      // Add the series to the user's taste
      await prismaclient.series.update({
        where: { id: seriesId },
        data: {
          tasteIds: inOut
            ? {
                push: userTaste.id
              }
            : {
                set: userTaste.Series.find(
                  serie => serie.id === seriesId
                ).tasteIds.filter(id => id !== userTaste.id)
              }
        }
      })
      const updatedTaste = await prismaclient.taste.update({
        where: { userId },
        data: {
          SerieIds: inOut
            ? {
                push: seriesId
              }
            : updatedSerieIds
        },
        include: {
          Series: true,
          Movies: true
        }
      })
      

      res.status(200).json({
        message:
          'Series ' +
          (inOut ? 'added to' : 'deleted from') +
          ' taste successfully',
        taste: updatedTaste
      })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to add to taste' })
  }
}

// Update the taste of a user (either the logged-in user or another user if admin)
export const updateTaste = async (req, res) => {
  try {
    const { userId } = req.params // User ID to update (for admin use)
    const loggedInUserId = req.user.id // Logged-in user ID
    const { fieldName, fieldValue } = req.body

    // Check if the logged-in user is an admin
    const isAdmin = req.isAdmin

    // Determine the user ID to update based on admin status
    const targetUserId = isAdmin ? userId : loggedInUserId

    // Fetch the existing taste for the specified user
    const existingTaste = await prismaclient.taste.findFirst({
      where: { userId: targetUserId }
    })

    if (!existingTaste) {
      return res.status(404).json({ message: 'Taste not found for the user' })
    }
    if (
      
      fieldName !== 'name' &&
      fieldName !== 'SerieIds' &&
      fieldName !== 'MovieIds'
    ) {
      return res.status(403).json({ message: 'Unauthorized endpoint' })
    }

    // Update the existing taste using the generic function
    const updatedTaste = await updateAField(
      'taste',
      { userId: targetUserId },
      fieldName,
      fieldValue
    )

    res.status(200).json({
      message: 'Taste updated successfully',
      taste: updatedTaste
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to update taste' })
  }
}

// Delete the taste of the logged-in user
export const deleteTaste = async (req, res) => {
  try {
    const { userId } = req.params // User ID to update (for admin use)
    const loggedInUserId = req.user.id // Logged-in user ID

    // Check if the logged-in user is an admin
    const isAdmin = req.isAdmin

    // Determine the user ID to update based on admin status
    const targetUserId = isAdmin ? userId : loggedInUserId

    // Fetch the existing taste for the specified user

    // Fetch the taste for the logged-in user
    const existingTaste = await prismaclient.taste.findFirst({
      where: { userId: targetUserId }
    })

    if (!existingTaste) {
      return res.status(404).json({ message: 'Taste not found for the user' })
    }

    // Delete the taste
    await prismaclient.taste.delete({
      where: { userId: targetUserId }
    })

    res.status(200).json({ message: 'Taste deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to delete taste' })
  }
}

// Get all tastes (for admin use)
export const getAllTastes = async (req, res) => {
  try {
    const { selections } = req.body
    // Check if the logged-in user is an admin
    const isAdmin = req.isAdmin

    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: 'Unauthorized: Only admins can access this endpoint' })
    }

    // Fetch all tastes including related movieorseries
    const allTastes = await prismaclient.taste.findMany({
      include: selections
    })

    res.status(200).json(allTastes)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to fetch tastes' })
  }
}
