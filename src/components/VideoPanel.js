
import React from 'react';

function VideoPanel({ videoIDs }) {
  return (
    <div className="video-panel">
      {videoIDs.map((videoId, index) => (
        <iframe
          key={index}
          src={`https://www.youtube.com/embed/${videoId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="youtube-video"
        ></iframe>
      ))}
    </div>
  );
}
export default VideoPanel;