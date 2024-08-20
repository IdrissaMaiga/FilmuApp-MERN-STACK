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
import streamRoute from './routes/stream.route.js'
import hlsRouter from './routes/hls.route.js'
const app = express()

import bodyParser from 'body-parser'

// Increase the limit for JSON payloads
app.use(bodyParser.json({ limit: '50mb' })) // Adjust '50mb' to the desired size

// Increase the limit for URL-encoded payloads
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
// Your other middleware and routes here
app.use(
  cors({
    origin: [process.env.SERVER_URL, 'http://localhost:5173'],
    credentials: true
  })
)
app.use(express.json())
app.use(cookieParser())

// Authentication routes
app.use('/api/auth', authRoute)
// serie router
app.use('/api/series', SerieRouter)
// episode router
app.use('/api', EpisodeRouter)
// User profile routes
app.use('/api/user', profileRoute)
app.use('/api', channelRoute)
app.use('/api', portRoute)
app.use('/api', streamRoute)

// Admin routes
// app.use('/api/admin', adminRoute);

// taste routes  normal user can only create ,delete , or update the lastupdated or name field
app.use('/api', tasteRoute)
app.use(hlsRouter)
// Download route
app.use('/api', downloadRoute)
// movie route
app.use('/api', movieRoute)

// watching route   user add movie or series to their  watching  the time at witch they where ,also delete and update
app.use('/api', watchingRoute)

app.listen(8800, () => {
  console.log('Server is running!')
})
