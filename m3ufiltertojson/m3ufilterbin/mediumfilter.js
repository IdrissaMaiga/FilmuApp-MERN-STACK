const fs = require('fs').promises;
const path = require('path');
const cliProgress = require('cli-progress');

// Resolution mapping to convert all to ASCII uppercase format
const resolutionMapping = {
  HD: 'HD',
  SD: 'SD',
  ᵁᴴᴰ: 'HD',
  '4K': '4K',
  UHD: '4K',
  FULL: 'FULL',
  FHD: 'FHD',
  '4K UHD': '4K',
  ᴴᴰ: 'HD',
  '𝐻𝒟': 'HD',
  '𝗛𝗗': 'HD',
  ＨＤ: 'HD',
  '🅷🅳': 'HD',
  '𝐇𝐃': 'HD',
  ˢᴰ: 'SD',
  '４Ｋ': '4K',
  '𝟜𝐾': '4K',
  '𝟒𝗞': '4K'
};

// Function to remove special characters except the plus sign
const removeSpecialChars = str => {
  return str.replace(/[^\w\s+]/g, '');
};

// Function to parse the M3U file, count channels by logo, and extract `m3u8` URLs with their metadata for each logo
const extractM3u8UrlsByLogo = async (inputFile, outputFile) => {
  try {
    const data = await fs.readFile(inputFile, 'utf8');
    const lines = data.split('\n');
    const logoMap = new Map(); // To keep track of logos and their corresponding channel data

    // Create a new progress bar instance and use shades_classic theme
    const progressBar = new cliProgress.SingleBar(
      {},
      cliProgress.Presets.shades_classic
    );
    progressBar.start(lines.length, 0);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('#EXTINF:')) {
        try {
          // Extract tvg-logo and other attributes
          const logoMatch = line.match(/tvg-logo="([^"]+)"/);
          const nameMatch = line.match(/tvg-name="([^"]+)"/);
          if (logoMatch && nameMatch) {
            const logo = logoMatch[1];
            let tvgName = nameMatch[1];
            const urlLineIndex = i + 1;
            if (
              urlLineIndex < lines.length &&
              lines[urlLineIndex].trim().endsWith('.m3u8')
            ) {
              const url = lines[urlLineIndex].trim();

              // Extract className
              let classNameMatches = tvgName.match(/\|([^|]+)\|/g);
              let className = classNameMatches
                ? classNameMatches.map(match => match.slice(1, -1)).join(',')
                : '';

              // Extract additional classNames like "C+ RÉU| LCP ASSEMBLEE NATIONALE"
              const extendedClassNameMatch = tvgName.match(/C\+\s*([^|]+)\|/);
              if (extendedClassNameMatch) {
                className = `${className}, ${extendedClassNameMatch[1]}`
                  .trim()
                  .replace(/^,|,$/g, '');
              }

              // Remove className from tvgName
              tvgName = tvgName
                .replace(/\|[^|]+\|/g, '')
                .replace(/C\+\s*[^|]+\|/, '')
                .trim();

              // Extract resolution
              let resolution = '';
              for (const [key, value] of Object.entries(resolutionMapping)) {
                if (tvgName.includes(key)) {
                  resolution = value;
                  tvgName = tvgName.replace(key, '').trim();
                  break;
                }
              }

              // Determine uct based on className containing a digit
              let uct = '';
              if (/\d/.test(className)) {
                uct = className;
                className = '';
              }

              // Remove special characters from tvgName and className
              tvgName = removeSpecialChars(tvgName);
              className = removeSpecialChars(className);

              const channelData = {
                url,
                className,
                cleanedTvgName: tvgName,
                resolution,
                uct
              };
              if (logoMap.has(logo)) {
                logoMap.get(logo).push(channelData);
              } else {
                logoMap.set(logo, [channelData]);
              }
            }
          }
        } catch (innerErr) {
          console.error(`Error processing line ${i + 1}: ${line}`, innerErr);
        }
      }
      // Update the progress bar
      progressBar.update(i + 1);
    }

    progressBar.stop();

    // Generate the output data
    const outputData = [];
    for (const [logo, channels] of logoMap.entries()) {
      // Find the most common cleanedTvgName for the logoName
      const nameCounts = new Map();
      channels.forEach(channel => {
        nameCounts.set(
          channel.cleanedTvgName,
          (nameCounts.get(channel.cleanedTvgName) || 0) + 1
        );
      });
      let logoName = [...nameCounts.entries()].reduce((a, b) =>
        b[1] > a[1] ? b : a
      )[0];

      // Uppercase the logoName
      logoName = logoName.toUpperCase();

      // Filter out entries with a plus sign stuck to a digit
      if (/\+\d/.test(logoName)) {
        continue;
      }

      // Compare logoName with TVG names and remove non-matching entries
      const filteredChannels = channels.filter(
        channel => channel.cleanedTvgName.toUpperCase() === logoName
      );

      // Remove groups with empty logo names
      if (!logoName || logoName.trim() === '' || filteredChannels.length === 0) {
        continue;
      }

      outputData.push(`Logo: ${logo}, LogoName: ${logoName}`); // Keep logos in their original case
      filteredChannels.forEach(channel => {
        outputData.push(
          `${
            channel.url
          }, tvg-name="${channel.cleanedTvgName.toUpperCase()}" className="${
            channel.className.toUpperCase()
          }" resolution="${channel.resolution}" uct="${channel.uct.toUpperCase()}"`
        );
      });
      outputData.push(''); // Add a blank line for better readability
    }

    console.log('URLs associated with each logo:', outputData);

    // Write the output data to the output file
    const outputString = outputData.join('\n');
    await fs.writeFile(outputFile, outputString, 'utf8');
    console.log(`URLs associated with each logo saved to ${outputFile}`);
  } catch (err) {
    console.error('Error processing the file:', err);
  }
};

// Specify the input and output file paths
const inputFilePath = path.join(__dirname, 'playlist.m3u');
const outputFilePath = path.join(__dirname, 'outputfilter.txt');

// Start extracting m3u8 URLs for each logo and save to file
extractM3u8UrlsByLogo(inputFilePath, outputFilePath);
