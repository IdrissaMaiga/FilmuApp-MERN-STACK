import React, { useEffect, useRef } from 'react';
import YouTubeIframeLoader from 'youtube-iframe';

const CustomYouTubePlayer = ({ videoId = 'Qv70RMUFlu0' }) => {
  const playerRef = useRef(null);

  useEffect(() => {
    YouTubeIframeLoader.load((YT) => {
      new YT.Player(playerRef.current, {
        videoId: videoId,
        playerVars: {
          autoplay: 1,      // Autoplay the video
          modestbranding: 1, // Minimizes branding
          controls: 0,      // Hides default controls
          rel: 0,           // Doesn't show related videos at the end
          showinfo: 0,      // Deprecated, but can be included
          disablekb: 1,     // Disables keyboard controls
          fs: 0,            // Disables fullscreen button
          iv_load_policy: 3, // Hides video annotations
        },
      });
    });
  }, [videoId]);

  return (
    <div ref={playerRef} style={{ width: '100%', height: '100%' }} />
  );
};

export default CustomYouTubePlayer;
