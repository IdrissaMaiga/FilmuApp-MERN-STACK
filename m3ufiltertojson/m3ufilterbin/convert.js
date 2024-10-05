const fs = require('fs')
const readline = require('readline')

// Function to read lines from a text file
async function readLines (filePath) {
  const fileStream = fs.createReadStream(filePath)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })

  let lines = []
  for await (const line of rl) {
    lines.push(line)
  }
  return lines
}

// Main function to process the text file
async function processTextFile (filePath) {
  const lines = await readLines(filePath)
  let channels = []
  let ports = []
  let channelnames = []

  let currentChannel = null

  lines.forEach(line => {
    if (line.startsWith('LogoName:')) {
      // Extract channel information
      let parts = line.split(', Logos:')
      currentChannel = {
        name: parts[0].split('LogoName: ')[1].trim(),
        logos: parts[1].trim().split(', '),
        ports: []
      }
      channels.push(currentChannel)
      channelnames.push(currentChannel.name)
    } else if (line.startsWith('http') && currentChannel) {
      // Extract port information
      let url = line.split(',')[0].trim()

      let tvgNameMatch = line.match(/tvg-name="([^"]*)"/);
      let classNameMatch = line.match(/className="([^"]*)"/);
      let resolutionMatch = line.match(/resolution="([^"]*)"/);
      let uctMatch = line.match(/uct="([^"]*)"/);

      if (!tvgNameMatch || !classNameMatch || !resolutionMatch || !uctMatch) {
        console.error('Error parsing line:', line)
        return
      }

      let name = tvgNameMatch[1].trim();
      let region = classNameMatch[1].trim();
      let resolution = resolutionMatch[1].trim();
      let utc = uctMatch[1].trim();
      let indexer = url.split('/').pop().split('.')[0].trim();

      let port = {
        name,
        region,
        resolution,
        utc,
        indexer
      }

      ports.push(port)

      // Connect port to the current channel
      if (currentChannel.name.replace(/\s+/g, '') === name.replace(/\s+/g, '')) {
        currentChannel.ports.push(port)
      }
    }
  })

  return { channels, ports, channelnames}
}

function saveToJson (filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
}

// Example usage
processTextFile('filtered.txt')
  .then(data => {
    saveToJson('channelsg.json', data.channels)
    saveToJson('portsg.json', data.ports)
    saveToJson('channelnamesg.txt', data.channelnames)
    console.log(
      'Data saved to channels.json and ports.json',
      
    )
  })
  .catch(err => {
    console.error('Error processing text file:', err)
  })
