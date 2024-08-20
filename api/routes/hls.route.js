import path from 'path';
import fs from 'fs';
import express from 'express'

const hlsRouter=express.Router()
// Endpoint to serve .ts segment files
hlsRouter.get('/hls/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'hls', filename);

  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'video/mp2t');
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.status(404).send('File not found');
  }
});
export default hlsRouter