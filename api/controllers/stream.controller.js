import prisma from '../lib/prisma.js'
import { decrypt } from '../lib/crypto.js'

export const getstream = async (req, res) => {
  try {
    const { username, password, dataType, id } = req.query

    // Get the channel from the database
    const channel = await prisma.channel.findUnique({
      where: { id },
      include: { ports: true }
    })

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' })
    }

    const decryptedChannel = {
      ...channel,
      ports: channel.ports.map(port => ({
        ...port,
        indexer: decrypt(port.indexer)
      }))
    }

    const indexer = decryptedChannel.ports[0].indexer

    // Construct the URL for the .m3u8 file
    const originalUrl = process.env.SERVER_URL
    const m3u8Url = `${originalUrl}${dataType}/${username}/${password}/${indexer}.m3u8`

    // Instead of fetching the .m3u8 file, just return the URL
    res.status(200).json({ url: m3u8Url })
  } catch (error) {
    console.error('Streaming error:', error)
    res.status(500).json({ message: 'Failed to stream content' })
  }
}
