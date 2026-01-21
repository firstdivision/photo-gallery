import React, { useState } from 'react';
import Masonry from 'react-masonry-css';
import './HomePage.css';
import { PhotoViewer } from './PhotoViewer';

// Category to gradient mapping
const CATEGORY_GRADIENTS = {
  'Fauna': 'linear-gradient(135deg, rgba(220, 180, 100, 0.6), rgba(180, 140, 60, 0.6))',      // Warm browns for animals
  'Flora': 'linear-gradient(135deg, rgba(100, 200, 120, 0.6), rgba(60, 180, 80, 0.6))',       // Greens for plants
  'Places': 'linear-gradient(135deg, rgba(135, 180, 220, 0.6), rgba(100, 150, 200, 0.6))',    // Blues for landscapes
  'Streets': 'linear-gradient(135deg, rgba(180, 140, 200, 0.6), rgba(150, 100, 180, 0.6))',   // Purples for urban
  'Things': 'linear-gradient(135deg, rgba(200, 160, 120, 0.6), rgba(160, 120, 80, 0.6))',     // Earthy tones for objects
  'Water': 'linear-gradient(135deg, rgba(100, 180, 220, 0.6), rgba(80, 160, 200, 0.6))'       // Cyan/blues for water
};

export function HomePage({ allPhotos = [], config = {} }) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

  const handlePhotoClick = (index) => {
    setSelectedPhotoIndex(index);
  };

  const getCategory = (photoPath) => {
    // Extract category from path (e.g., "/Fauna/subfolder/photo.jpg" -> "Fauna")
    const parts = photoPath.split('/').filter(p => p);
    return parts[0] || 'default';
  };

  const getCategoryGradient = (category) => {
    return CATEGORY_GRADIENTS[category] || 'linear-gradient(135deg, rgba(100, 100, 100, 0.6), rgba(80, 80, 80, 0.6))';
  };

  const breakpointColumns = {
    default: 4,
    1200: 3,
    768: 2,
    480: 1
  };

  return (
    <div className="home-page">
      <div className="home-hero">
        <h1 className="home-title">{config.title || 'Photo Gallery'}</h1>
        <p className="home-description">
          {config.description || 'Discover beautiful photography'}
        </p>
      </div>

      {allPhotos.length > 0 ? (
        <Masonry
          breakpointCols={breakpointColumns}
          className="home-masonry"
          columnClassName="masonry-column"
        >
          {allPhotos.map((photo, index) => {
            const category = getCategory(photo.path);
            const gradient = getCategoryGradient(category);
            return (
              <button
                key={index}
                className="masonry-item"
                onClick={() => handlePhotoClick(index)}
                aria-label={`View ${photo.name}`}
                data-category={category}
              >
                <img
                  src={`/photos${photo.path}`}
                  alt={photo.name}
                  loading="lazy"
                />
                <div 
                  className="masonry-overlay"
                  style={{ background: gradient }}
                >
                  <span className="masonry-icon">👁</span>
                  <span className="masonry-category-badge">{category}</span>
                </div>
              </button>
            );
          })}
        </Masonry>
      ) : (
        <div className="home-empty">
          <p>No photos available</p>
        </div>
      )}

      {selectedPhotoIndex !== null && (
        <PhotoViewer
          photos={allPhotos}
          initialIndex={selectedPhotoIndex}
          onClose={() => setSelectedPhotoIndex(null)}
        />
      )}
    </div>
  );
}
