import React, { useState } from 'react';
import './PhotoGallery.css';
import { PhotoViewer } from './PhotoViewer';

export function PhotoGallery({ photos = [], folderName = 'Photos' }) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

  if (!photos || photos.length === 0) {
    return (
      <div className="photo-gallery">
        <div className="empty-state">
          <p>No photos found in this folder</p>
        </div>
      </div>
    );
  }

  return (
    <div className="photo-gallery">
      <div className="gallery-header">
        <h2>{folderName}</h2>
        <p className="photo-count">{photos.length} photo{photos.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="gallery-grid">
        {photos.map((photo, index) => (
          <button
            key={index}
            className="photo-thumbnail"
            onClick={() => setSelectedPhotoIndex(index)}
          >
            <img
              src={`/photos${photo.path}`}
              alt={photo.name}
              loading="lazy"
            />
            <div className="photo-overlay">
              <span className="play-icon">👁</span>
            </div>
          </button>
        ))}
      </div>

      {selectedPhotoIndex !== null && (
        <PhotoViewer
          photos={photos}
          initialIndex={selectedPhotoIndex}
          onClose={() => setSelectedPhotoIndex(null)}
        />
      )}
    </div>
  );
}
