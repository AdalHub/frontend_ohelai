import React, { useEffect, useRef } from 'react';

function VideoPanel({ videoIDs }) {
  const playersRef = useRef([]);

  useEffect(() => {
    // Load the Iframe API script if not already loaded
    if (!window.YT) {
      // Create script tag
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      // If API is already loaded, initialize players
      initializePlayers();
    }

    // This function will be called by the YouTube API when it's ready
    window.onYouTubeIframeAPIReady = () => {
      initializePlayers();
    };

    function initializePlayers() {
      videoIDs.forEach((videoId, index) => {
        playersRef.current[index] = new window.YT.Player(`player-${index}`, {
          videoId: videoId,
          height: '200',
          width: '200',
          events: {
            'onStateChange': onPlayerStateChange
          }
        });
      });
    }

    function onPlayerStateChange(event) {
      if (event.data === window.YT.PlayerState.PLAYING) {
        // Pause other players
        playersRef.current.forEach((player) => {
          if (player !== event.target) {
            player.pauseVideo();
          }
        });
      }
    }

    // Cleanup on unmount
    return () => {
      playersRef.current.forEach((player) => {
        player.destroy();
      });
    };
  }, [videoIDs]);

  return (
    <div className="video-panel">
      {videoIDs.map((videoId, index) => (
        <div key={index}>
          <div id={`player-${index}`}></div>
        </div>
      ))}
    </div>
  );
}

export default VideoPanel;
