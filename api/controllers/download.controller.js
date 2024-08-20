import updateAField from '../functions/fieldUpdate.js'
import prismaclient from '../lib/prisma.js'
import { addHours } from '../functions/addHours.js'
// Create a new download
export const createDownload = async (req, res) => {
  try {
    const { movieId, episodeId, paymentproof } = req.body
    const userId = req.user.id // Assuming user ID is stored in req.user

    // Validate that either movieId or episodeId is provided, but not both
    if ((movieId && episodeId) || (!movieId && !episodeId)) {
      return res
        .status(400)
        .json({ message: 'Provide either movieId or episodeId, but not both' })
    }
    let existingDownloads = await prismaclient.downloads.findMany({
      where: {
        userId,

        OR: [
          { movieId: movieId ? movieId : undefined },
          { episodeId: episodeId ? episodeId : undefined }
        ]
      }
    })
    const now = new Date()
    const existingDownload = existingDownloads.filter(download => {
      return !download.expirationDate || new Date(download.expirationDate) > now
    })

    if (existingDownload.length > 0) {
      return res.status(400).json({
        message:
          'User' +
          (existingDownload[0]?.expirationDate
            ? 'download  has not expired in the 24h'
            : ' should confirm the download ') +
          ' for this episode or movie'
      })
    }

    // Determine clientconfirm based on paymentproof
    const clientconfirm = paymentproof ? true : false

    // Create the new download
    const newDownload = await prismaclient.downloads.create({
      data: {
        userId,
        movieId: movieId || undefined,
        episodeId: episodeId || undefined,
        paymentproof,
        clientconfirm
      },
      include: {
        movie: true,
        episode: true
      }
    })

    res.status(201).json({
      message: 'Download created successfully',
      download: newDownload
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to create download' })
  }
}

// Get all downloads of the logged-in user
export const getDownloads = async (req, res) => {
  try {
    const userId = req.user.id // Assuming user ID is stored in req.user

    // Fetch the downloads for the logged-in user
    const downloads = await prismaclient.downloads.findMany({
      where: { userId },
      include: {
        movie: true,
        episode: true
      }
    })

    res.status(200).json(downloads)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to fetch downloads' })
  }
}

// Update a download
export const updateDownload = async (req, res) => {
  try {
    const { id } = req.params // Download ID to update
    const { fieldName, fieldValue, targetId } = req.body

    // Fetch the existing download
    const existingDownload = await prismaclient.downloads.findUnique({
      where: { id, userId: req.IsAdmin ? targetId : req.user.id },
      include: {
        movie: true,
        episode: true
      }
    })

    if (!existingDownload) {
      return res.status(404).json({ message: 'Download not found' })
    }

    // If the user is not an admin and clientconfirm or adminconfirm is true, prevent modification
    if (
      !req.IsAdmin &&
      (existingDownload.adminconfirm ||
        fieldName === 'adminconfirm' ||
        fieldName === 'clientconfirm')
    ) {
      return res
        .status(403)
        .json({ message: 'Modification not allowed after confirmation' })
    }

    // Determine clientconfirm based on paymentproof

    if (fieldName === 'paymentproof') {
      const clientconfirm = fieldValue ? true : existingDownload.clientconfirm
      await updateAField('downloads', { id }, 'clientconfirm', clientconfirm)
    }
    console.log(fieldName, fieldValue)

    // Update the download
    const updatedDownload = await updateAField(
      'downloads',
      { id },
      fieldName,
      fieldValue
    )
    console.log(addHours(new Date(), 24))
    // Set expirationDate logic
    if (fieldName === 'adminconfirm') {
      const newExpirationDate = addHours(new Date(), 24)

      await updateAField(
        'downloads',
        { id },
        'expirationDate',
        newExpirationDate
      )
    }
    res.status(200).json({
      message: 'Download updated successfully',
      download: updatedDownload
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to update download' })
  }
}

// Delete a download
export const deleteDownload = async (req, res) => {
  try {
    const { id } = req.params // Download ID to delete

    // Fetch the existing download
    const existingDownload = await prismaclient.downloads.findUnique({
      where: { id }
    })

    if (!existingDownload) {
      return res.status(404).json({ message: 'Download not found' })
    }

    // Prevent deletion if adminconfirm is true and the user is not an admin
    if (existingDownload.adminconfirm && req.IsAdmin) {
      return res
        .status(403)
        .json({ message: 'Only admins can delete this download' })
    }

    // Delete the download
    await prismaclient.downloads.delete({
      where: { id }
    })

    res.status(200).json({ message: 'Download deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to delete download' })
  }
}
