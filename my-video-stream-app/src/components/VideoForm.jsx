import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VideoForm = () => {
  const [channelId, setChannelId] = useState('');
  const [dataType, setDataType] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (channelId && dataType) {
      // Redirect to VideoPlayer with channelId and dataType as URL parameters
      navigate(`/stream/${channelId}?dataType=${dataType}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="channelId">Channel ID:</label>
        <input
          type="text"
          id="channelId"
          value={channelId}
          onChange={(e) => setChannelId(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="dataType">Data Type:</label>
        <input
          type="text"
          id="dataType"
          value={dataType}
          onChange={(e) => setDataType(e.target.value)}
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default VideoForm;
