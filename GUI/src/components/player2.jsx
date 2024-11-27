import React, { useEffect, useRef } from 'react';
import Artplayer from 'artplayer';
import { Box } from '@chakra-ui/react';


const ArtPlayerComponent = ({ videourl, extension,canDownload }) => {
  const artPlayerRef = useRef(null);

 // Function to handle download
 const handleDownload = () => {
    // Create a temporary link to trigger download
    const link = document.createElement('a');
    link.href = videourl; // The URL of the video to download
    link.download = videourl.split('/').pop(); // Use the file name from the URL
    document.body.appendChild(link); // Append link to the document
    link.click(); // Trigger the download
    document.body.removeChild(link); // Clean up the link after download
  };

  useEffect(() => {
    
    if (artPlayerRef.current) {
        Artplayer.CONTEXTMENU = false;

      const art = new Artplayer({
        container: artPlayerRef.current,
        url: videourl, // Dynamic video URL
        volume: 0.5,
        type: extension || 'mp4',
        isLive: false,
        muted: false,
        fastForward: true,
        autoplay: true,
        pip: true,
        autoMini: true,
        screenshot: false,
        setting: true,
        loop: true,
        flip: true,
        playbackRate: true,
        autoOrientation: true,
        aspectRatio: true,
        fullscreen: true,
        fullscreenWeb: true,
        subtitleOffset: true,
        miniProgressBar: true,
        mutex: true,
        backdrop: true,
        playsInline: true,
        autoPlayback: true,
        airplay: true,
        theme: "red",
        lang: navigator.language.toLowerCase(),
        moreVideoAttr: {
          crossOrigin: 'anonymous', // Ensuring cross-origin security
        },
        contextmenu: [
          {
            html: 'Custom menu',
            click: function (contextmenu) {
              console.info('You clicked on the custom menu');
              contextmenu.show = false;
            },
          },
        ],
        quality: [
          {
            default: true,
            html: 'SD 480P',
            url: videourl + '?q=480',
          },
          {
            html: 'HD 720P',
            url: videourl + '?q=720',
          },
        ],
       
        controls:(canDownload? [
            {
                position: 'right',
                html: '<img width="22" heigth="22" src="https://i.ibb.co/f9LTmnn/downbutton.webp">',
                tooltip: 'download',
                style: {
                    color: 'green',
                },
                click: function () {
                    handleDownload()
                },
            },
        ]:[]),
      });

      return () => {
        // Cleanup the player instance on component unmount
        art.destroy();
      };
    }
  }, [videourl, extension]); // Reinitialize player when video URL or extension changes

  // Handle double-tap to skip forward/backward
  

  return (
    <Box
      ref={artPlayerRef}
      style={{
        width: '100%', // Full width of the container
        aspectRatio: '16/9', // Maintain 16:9 aspect ratio
        background: 'black',
        borderRadius: '15px', // Adding border radius for rounded corners
        position: 'relative',
        overflow: 'hidden', // Ensure video content stays within rounded edges
      }}
    >
      {/* ArtPlayer will mount here */}
     
      
    </Box>
  );
};

export default ArtPlayerComponent;
