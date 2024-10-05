const fs = require('fs').promises;
const path = require('path');
const ProgressBar = require('progress');

// Define the country data with associated language tags
const countrydata = {
  
  "Mali": ["|FR|", "|MALI|","|BURKIN|","|BURK|","|BENIN|"],
  "United States": ["|EN|", "|US|", "|CA|"],
};

// Define the criteria for filtering channels based on country data
const filterCriteria = (channel, tags) => {
  return tags.some(tag => channel.includes(tag));
};

// Function to parse the M3U file and filter channels based on tags
const processM3UFile = async (inputFile, outputFile, tags) => {
  try {
    const data = await fs.readFile(inputFile, 'utf8');
    const lines = data.split('\n');
    const channels = [];
    let currentChannel = [];

    // Split the file into channels
    for (let line of lines) {
      if (line.startsWith('#EXTINF:')) {
        if (currentChannel.length > 0) {
          channels.push(currentChannel);
        }
        currentChannel = [line];
      } else {
        currentChannel.push(line);
      }
    }
    if (currentChannel.length > 0) {
      channels.push(currentChannel);
    }

    // Filter channels based on the criteria
    const filteredChannels = channels.filter(channel =>
      filterCriteria(channel.join('\n'), tags)
    );

    // Sort channels by extension
    const m3u8Channels = filteredChannels.filter(
      channel => channel[1] && channel[1].endsWith('.m3u8')
    );
    const otherChannels = filteredChannels.filter(
      channel => channel[1] && !channel[1].endsWith('.m3u8')
    );

    const sortedChannels = [...m3u8Channels, ...otherChannels];

    // Write the sorted channels back to the file
    const outputData = ['#EXTM3U', ...sortedChannels.flat()].join('\n');
    await fs.writeFile(outputFile, outputData, 'utf8');
    console.log(`M3U file for ${path.basename(outputFile)} created successfully!`);
  } catch (err) {
    console.error('Error processing the file:', err);
  }
};

// Specify the input file path
const inputFilePath = path.join(__dirname, 'playlist.m3u');

// Create a progress bar
const bar = new ProgressBar('Processing [:bar] :percent :current/:total :elapsed', {
  total: Object.keys(countrydata).length,
  width: 40,
  complete: '=',
  incomplete: ' ',
  renderThrottle: 100,
});

// Generate M3U files for each country
const generateM3UFiles = async () => {
  const countries = Object.keys(countrydata);

  for (let [index, country] of countries.entries()) {
    const tags = countrydata[country];
    const safeCountryName = country.replace(/[^a-zA-Z0-9]/g, '_'); // Sanitize country name for filename
    const outputFilePath = path.join(__dirname, `${safeCountryName}_playlist.m3u`);
    
    await processM3UFile(inputFilePath, outputFilePath, tags);
    bar.tick();
  }
};

// Start generating M3U files
generateM3UFiles();
