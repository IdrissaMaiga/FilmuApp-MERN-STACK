// VideoPlayer component

import React, { useEffect, useState, useContext } from 'react';
import ReactPlayer from 'react-player';
import AuthContext from '../context/AuthContext';
import { Select } from '@chakra-ui/react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8800',
});

const VideoPlayer = ({ channelId, dataType, controls = true, width = '100%', height = '100%' }) => {
  const { user } = useContext(AuthContext);
  const [streamUrl, setStreamUrl] = useState(null);
  const [region, setRegion] = useState('defaultRegion'); // Set your default region here

  const fetchStreamUrl = async (region) => {
    try {
      const response = await api.get('/api/stream', {
        params: {
          username: user?.StreamingAccess?.username,
          password: user?.StreamingAccess?.password,
          dataType,
          id: channelId,
          region,
        },
        withCredentials: true,
      });

      const { url } = response.data;
      setStreamUrl(url);
    } catch (error) {
      console.error('Error fetching stream URL:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStreamUrl(region);
    }
  }, [user, channelId, dataType, region]);

  return (
    <div className='video-player-wrapper' style={{ width, height }}>
      <Select value={region} onChange={(e) => setRegion(e.target.value)}>
        <option value="region1">Region 1</option>
        <option value="region2">Region 2</option>
        {/* Add more regions as needed */}
      </Select>
      {streamUrl ? (
        <ReactPlayer
          url={streamUrl}
          playing={true}
          controls={controls}
          width='100%'
          height='100%'
          config={{
            file: {
              attributes: {
                crossOrigin: 'anonymous'
              }
            }
          }}
        />
      ) : (
        <p>Loading stream...</p>
      )}
    </div>
  );
};

export default VideoPlayer;



