import express from 'express'
import cors from 'cors'
import env from 'dotenv'
env.config()
import cookieParser from 'cookie-parser'
import authRoute from './routes/auth.route.js'
import profileRoute from './routes/userprofile.route.js'
import tasteRoute from './routes/taste.route.js'
import watchingRoute from './routes/watching.route.js'
import downloadRoute from './routes/download.route.js'
import movieRoute from './routes/movie.route.js'
import SerieRouter from './routes/serie.router.js'
import EpisodeRouter from './routes/episode.route.js'
import portRoute from './routes/port.route.js'
import channelRoute from './routes/channel.route.js'
const app = express()
import bodyParser from 'body-parser'
import transactionRoute from './routes/transaction.route.js'
import subscriptionRoute from './routes/subscriptions.router.js'
import prismaclient from './lib/prisma.js'
// Increase the limit for JSON payloads
app.use(bodyParser.json({ limit: '50mb' })) // Adjust '50mb' to the desired size

// Increase the limit for URL-encoded payloads
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
// Your other middleware and routes here
app.use(
  cors({
    origin: [process.env.SERVER_URL, 'http://localhost:5173',"http://192.168.1.100:5173","http://10.53.73.180:5173"],
    credentials: true

  })
)
app.use(express.json())
app.use(cookieParser())


app.use('/api/auth', authRoute)

app.use('/api/user', profileRoute)

app.use('/api/subscription', subscriptionRoute);

app.use('/api/transaction',transactionRoute)

app.use('/api/channels', channelRoute)

app.use('/api/ports', portRoute)

app.use('/api/series', SerieRouter)

app.use('/api/episode', EpisodeRouter)

app.use('/api/taste', tasteRoute)

app.use('/api/transaction', transactionRoute)

app.use('/api/download', downloadRoute)

app.use('/api/movie', movieRoute)

app.use('/api/watching', watchingRoute)

app.get('/images', async (req, res) => {
  try {
    const images = await prismaclient.image.findMany();
    res.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ error: "An error occurred while fetching images" });
  }
});





app.listen(8800, () => {
  console.log('Server is running!')
})
