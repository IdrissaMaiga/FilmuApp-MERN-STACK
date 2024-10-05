const fs = require('fs');
const readline = require('readline');

// Function to read a file and return its content as an array of lines
const readFileLines = (filePath) => {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
    
    const lines = [];
    rl.on('line', (line) => {
      lines.push(line);
    });
    
    rl.on('close', () => {
      resolve(lines);
    });
    
    rl.on('error', (err) => {
      reject(err);
    });
  });
};

// Function to compare two files line by line
const compareFiles = async (filePaths) => {
  if (filePaths.length < 2) {
    console.log("Please provide at least two file paths.");
    return;
  }

  try {
    const fileContents = await Promise.all(filePaths.map(readFileLines));

    // Comparing all files with the first file as the reference
    const referenceFile = fileContents[0];

    for (let i = 1; i < fileContents.length; i++) {
      const currentFile = fileContents[i];

      if (referenceFile.length !== currentFile.length) {
        console.log(`Files are different. File ${filePaths[i]} has a different number of lines.`);
        return;
      }

      for (let lineIndex = 0; lineIndex < referenceFile.length; lineIndex++) {
        if (referenceFile[lineIndex] !== currentFile[lineIndex]) {
          console.log(`Files are different. Mismatch found at line ${lineIndex + 1} in file ${filePaths[i]}.`);
          return;
        }
      }
    }

    console.log("All files are identical.");
  } catch (err) {
    console.error("Error reading files:", err);
  }
};

// Example usage
const filePaths = ['channelnamesm.txt', 'channelnames.txt']; // Replace with actual file paths
compareFiles(filePaths);
