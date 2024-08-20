import prismaclient from '../lib/prisma.js'
import updateAField from '../functions/fieldUpdate.js'

// Create a new series
export const createSeries = async (req, res) => {
  try {
    const { name, description, downloadPrice, seasonData } = req.body

    // Only allow admin to create series
    if (!req.IsAdmin) {
      return res.status(403).json({ message: 'Only admin can create a series' })
    }

    // Create series and its seasons
    const createdSeries = await prismaclient.series.create({
      data: {
        name,
        description,
        downloadPrice,
        season: {
          create: seasonData.map(season => ({
            number: season.number,
            data: season.data,
            episodes: {
              create: season.episodes.map(episode => ({
                name: episode.name,
                description: episode.description,
                adress: episode.adress,
                filename: episode.filename,
                downloadPrice: episode.downloadPrice
              }))
            }
          }))
        }
      },
      include: {
        season: {
          include: {
            episodes: {
              include: {
                Downloads: true,
                Watching: true
              }
            }
          }
        },
        Tastes: true
      }
    })

    res
      .status(201)
      .json({ message: 'Series created successfully', series: createdSeries })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to create series' })
  }
}

// Get all series
export const getSeries = async (req, res) => {
  try {
    // Fetch all series for admin, only basic details for normal users
    let series = []
    if (req.isAdmin) {
      series = await prismaclient.series.findMany({
        include: {
          season: {
            include: {
              episodes: {
                include: {
                  Downloads: true,
                  Watching: true
                }
              }
            }
          },
          Tastes: true
        }
      })
    } else {
      series = await prismaclient.series.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          downloadPrice: true,
          type_: true,
          season: {
            select: {
              id: true,
              number: true,
              episodes: {
                select: {
                  id: true,
                  name: true,
                  downloadPrice: true,
                  paymentStatus: true,
                  seenby: true,
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
              }
            }
          }
        }
      })
    }

    res.status(200).json(series)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to fetch series' })
  }
}
// the series of the user taste
export const getSeriesofmylist = async (req, res) => {
  try {
    // Fetch all series for admin, only basic details for normal users
    series = await prismaclient.series.findMany({
      where: {
        tasteIds: { contains: req.user.taste.id } // Fetch only series that belong to the user's taste
      },
      select: {
        id: true,
        name: true,
        description: true,
        downloadPrice: true,
        type_: true,
        season: {
          select: {
            id: true,
            number: true,
            episodes: {
              select: {
                id: true,
                name: true,
                downloadPrice: true,
                paymentStatus: true,
                seenby: true,
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
            }
          }
        }
      }
    })

    res.status(200).json(series)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to fetch series' })
  }
}
// Get a series by ID
export const getSeriesById = async (req, res) => {
  try {
    const { id } = req.params
    // Fetch the series by ID including episodes
    let serie
    if (req.isAdmin) {
      serie = await prismaclient.series.findUnique({
        where: { id },
        include: {
          season: {
            include: {
              episodes: {
                include: {
                  Downloads: true,
                  Watching: true
                }
              }
            }
          },
          Tastes: true
        }
      })
    } else {
      serie = await prismaclient.series.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
          downloadPrice: true,
          type_: true,
          season: {
            select: {
              id: true,
              number: true,
              episodes: {
                select: {
                  id: true,
                  name: true,
                  downloadPrice: true,
                  paymentStatus: true,
                  seenby: true,
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
              }
            }
          }
        }
      })
    }

    if (!serie) {
      return res.status(404).json({ message: 'Series not found' })
    }

    // Restrict access for normal users

    res.status(200).json(series)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to fetch series' })
  }
}

// Update a series by ID
export const updateSeries = async (req, res) => {
  try {
    const { id } = req.params
    const { fieldName, fieldValue } = req.body

    // Only allow admin to update series
    if (!req.isAdmin) {
      return res.status(403).json({ message: 'Only admin can update a series' })
    }

    const updatedSeries = await updateAField(
      'series',
      { id },
      fieldName,
      fieldValue
    )

    res.status(200).json({
      message: 'Series updated successfully',
      series: updatedSeries
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to update series' })
  }
}
