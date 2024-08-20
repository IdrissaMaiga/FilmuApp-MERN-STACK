import prismaclient from '../lib/prisma.js'
import updateAField from '../functions/fieldUpdate.js'

// Create a new episode
export const createEpisode = async (req, res) => {
  try {
    const { name, description, downloadPrice, seasonId, address, filename } =
      req.body

    // Only allow admin to create episodes
    if (!req.IsAdmin) {
      return res
        .status(403)
        .json({ message: 'Only admin can create an episode' })
    }

    const newEpisode = await prismaclient.episode.create({
      data: {
        name,
        description,
        downloadPrice,
        seasonId,
        address,
        filename
      },
      include: {
        Season: true,
        Downloads: true,
        Watching: true
      }
    })

    res
      .status(201)
      .json({ message: 'Episode created successfully', episode: newEpisode })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to create episode' })
  }
}

// Get all episodes
export const getEpisodes = async (req, res) => {
  try {
    // Fetch all episodes for admin, only basic details for normal users
    let episodes = []
    if (req.IsAdmin) {
      episodes = await prismaclient.episode.findMany({
        include: {
          Season: true,
          Downloads: true,
          Watching: true
        }
      })
    } else {
      episodes = await prismaclient.episode.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          downloadPrice: true,
          address: true,
          filename: true,
          seasonId: true,
          Season: true,
          Downloads: {
            where: {
              OR: [
                { adminconfirm: true, userId: req.user.id }, // Allow confirmed downloads by admin
                {
                  userId: req.user.id, // Allow downloads by the logged-in user
                  clientconfirm: true
                }
              ]
            }
          },
          Watching: {
            where: {
              userId: req.user.id // Allow downloads by the logged-in user
            }
          }
        }
      })
    }
    res.status(200).json(episodes)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to fetch episodes' })
  }
}

// Get an episode by ID
export const getEpisodeById = async (req, res) => {
  try {
    const { id } = req.params
    let episode
    if (req.IsAdmin) {
      episode = await prismaclient.episode.findUnique({
        where: { id },
        include: {
          Season: true,
          Downloads: true,
          Watching: true
        }
      })
    } else {
      episode = await prismaclient.episode.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
          downloadPrice: true,
          address: true,
          filename: true,
          seasonId: true,

          Season: true,
          Downloads: {
            where: {
              OR: [
                { adminconfirm: true, userId: req.user.id }, // Allow confirmed downloads by admin
                {
                  userId: req.user.id, // Allow downloads by the logged-in user
                  clientconfirm: true
                }
              ]
            }
          },
          Watching: {
            where: {
              userId: req.user.id // Allow downloads by the logged-in user
            }
          }
        }
      })
    }

    // Fetch the episode by ID

    if (!episode) {
      return res.status(404).json({ message: 'Episode not found' })
    }

    res.status(200).json(episode)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to fetch episode' })
  }
}

// Update an episode by ID
export const updateEpisode = async (req, res) => {
  try {
    const { id } = req.params
    const { fieldName, fieldValue } = req.body

    // Only allow admin to update episodes
    if (!req.IsAdmin) {
      return res
        .status(403)
        .json({ message: 'Only admin can update an episode' })
    }

    const updatedEpisode = await updateAField(
      'episode',
      { id },
      fieldName,
      fieldValue
    )

    res.status(200).json({
      message: 'Episode updated successfully',
      episode: updatedEpisode
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to update episode' })
  }
}

// Delete an episode by ID
export const deleteEpisode = async (req, res) => {
  try {
    const { id } = req.params

    // Only allow admin to delete episodes
    if (!req.isAdmin) {
      return res
        .status(403)
        .json({ message: 'Only admin can delete an episode' })
    }

    await prismaclient.episode.delete({
      where: { id }
    })

    res.status(200).json({ message: 'Episode deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to delete episode' })
  }
}
