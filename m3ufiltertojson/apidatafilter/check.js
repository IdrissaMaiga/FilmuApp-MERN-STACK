
import { promises as fsPromises } from 'fs';
import { existsSync, writeFileSync, appendFileSync } from 'node:fs'; // For synchronous file handling

const MAX_CONCURRENT_REQUESTS = 5; // Limit for concurrent requests
const CHECKPOINT_FILE = 'checkp.json';
const OUTPUT_FILE = 'updated_channels.json'; // Output file to store results

// Function to load checkpoint (or start from 0 if not present)
async function loadCheckpoint() {
    try {
        const checkpointData = await fsPromises.readFile(CHECKPOINT_FILE, 'utf-8');
        return JSON.parse(checkpointData);
    } catch (error) {
        return { channelIndex: 0, portIndex: 0 }; // Default if file doesn't exist
    }
}

// Function to save checkpoint
async function saveCheckpoint(channelIndex, portIndex) {
    const checkpoint = { channelIndex, portIndex };
    await fsPromises.writeFile(CHECKPOINT_FILE, JSON.stringify(checkpoint));
}

// Function to test if a port is accessible
async function testPort(port) {
    const url = `http://763025459169.cdn-fug.com:2082/live/115763054352463/iuadobbh3v/${port.indexer}.m3u8`;
    try {
        const response = await fetch(url, { method: 'HEAD' }); // Or use GET as needed
        return response.ok; // If accessible, return true
    } catch (error) {
        return false; // If there's an error, mark it as false
    }
}

// Function to load channels from the JSON file
async function loadChannels() {
    const data = await fsPromises.readFile('transformed_channels.json', 'utf-8');
    return JSON.parse(data);
}

// Function to write updated channels incrementally to output file
function appendToOutputFile(channel) {
    appendFileSync(OUTPUT_FILE, JSON.stringify(channel, null, 2) + ',\n');
}

// Function to process channels with checkpointing and concurrent requests
async function processChannels() {
    const channels = await loadChannels();
    const { channelIndex: startChannelIndex, portIndex: startPortIndex } = await loadCheckpoint();

    const activeRequests = [];

    // Process channels starting from the checkpoint
    for (let i = startChannelIndex; i < channels.length; i++) {
        const channel = channels[i];

        // Process ports for this channel, starting from the saved checkpoint port index
        for (let j = i === startChannelIndex ? startPortIndex : 0; j < channel.ports.length; j++) {
            const port = channel.ports[j];

            const request = testPort(port).then(isAccessible => {
                port.ok = isAccessible; // Update port status
            });

            activeRequests.push(request);

            // If we hit the concurrency limit, wait for the promises to resolve
            if (activeRequests.length >= MAX_CONCURRENT_REQUESTS) {
                await Promise.all(activeRequests);
                activeRequests.length = 0; // Clear the array
            }

            // After each port is processed, update the output file and save the checkpoint
            appendToOutputFile(channel);
            await saveCheckpoint(i, j + 1); // Save the checkpoint after processing the port
        }

        // After processing all ports in the current channel, reset the port index in the checkpoint
        await saveCheckpoint(i + 1, 0); // Proceed to the next channel
    }

    // Ensure all active requests are completed before finishing
    await Promise.all(activeRequests);

    console.log('Channel processing complete.');
}

// Initial setup to ensure output file exists or is cleared
function initializeOutputFile() {
    if (existsSync(OUTPUT_FILE)) {
        writeFileSync(OUTPUT_FILE, ''); // Clear existing content
    }
}

// Run the process
initializeOutputFile(); // Clear output file or create a new one
processChannels().catch(console.error);
