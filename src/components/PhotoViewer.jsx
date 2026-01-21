import React, { useState, useEffect, useRef } from 'react';
import * as exifr from 'exifr';
import './PhotoViewer.css';
import { getPhotoUrl } from '../utils/photoLoader';

export function PhotoViewer({ photos, initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [photoMeta, setPhotoMeta] = useState(null);
  const [exifData, setExifData] = useState(null);
  const [dominantColor, setDominantColor] = useState('#ffffff');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const photoRef = useRef(null);
  const viewerRef = useRef(null);

  const currentPhoto = photos[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') {
        if (isFullscreen) {
          handleExitFullscreen();
        } else {
          onClose();
        }
      }
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        handleToggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isFullscreen]);

  useEffect(() => {
    // Fetch photo metadata (dimensions and file size)
    const fetchPhotoMeta = async () => {
      try {
        const photoPath = getPhotoUrl(currentPhoto.path);
        const response = await fetch(photoPath, { method: 'HEAD' });
        const fileSize = response.headers.get('content-length');
        
        // Get dimensions by loading the image
        const img = new Image();
        img.onload = () => {
          setPhotoMeta({
            width: img.naturalWidth,
            height: img.naturalHeight,
            fileSize: fileSize ? formatFileSize(parseInt(fileSize)) : 'Unknown'
          });
          
          // Extract dominant color
          extractDominantColor(img);
        };
        img.src = photoPath;

        // Extract EXIF data
        try {
          const exif = await exifr.parse(photoPath);
          if (exif) {
            setExifData(exif);
          }
        } catch (e) {
          console.log('No EXIF data found or error reading EXIF:', e.message);
          setExifData(null);
        }
      } catch (error) {
        console.error('Error fetching photo metadata:', error);
      }
    };

    if (currentPhoto) {
      setPhotoMeta(null);
      setExifData(null);
      fetchPhotoMeta();
    }
  }, [currentIndex, currentPhoto]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const extractDominantColor = (img) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Resize image for performance
      canvas.width = 150;
      canvas.height = 150;
      ctx.drawImage(img, 0, 0, 150, 150);
      
      const imageData = ctx.getImageData(0, 0, 150, 150);
      const data = imageData.data;
      
      let r = 0, g = 0, b = 0;
      let count = 0;
      
      // Sample every 4th pixel for performance, skip mostly transparent pixels
      for (let i = 0; i < data.length; i += 16) {
        if (data[i + 3] > 128) { // Only consider pixels with decent opacity
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
      }
      
      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);
      
      const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
      setDominantColor(hex);
    } catch (error) {
      console.error('Error extracting dominant color:', error);
    }
  };

  const formatExifData = (exif) => {
    const formatted = {};
    
    if (exif.Make && exif.Model) {
      formatted.camera = `${exif.Make} ${exif.Model}`;
    } else if (exif.Model) {
      formatted.camera = exif.Model;
    }
    
    if (exif.LensModel) {
      formatted.lens = exif.LensModel;
    }
    
    if (exif.FocalLength) {
      formatted.focal = `${exif.FocalLength}mm`;
    }
    
    if (exif.FNumber) {
      formatted.aperture = `f/${exif.FNumber}`;
    }
    
    if (exif.ExposureTime) {
      const exp = exif.ExposureTime;
      formatted.shutter = exp < 1 ? `1/${Math.round(1/exp)}s` : `${exp}s`;
    }
    
    if (exif.ISOSpeedRatings) {
      const iso = Array.isArray(exif.ISOSpeedRatings) 
        ? exif.ISOSpeedRatings[0] 
        : exif.ISOSpeedRatings;
      formatted.iso = `ISO ${iso}`;
    }
    
    if (exif.DateTimeOriginal) {
      const date = new Date(exif.DateTimeOriginal);
      formatted.date = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    return formatted;
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
    setDragX(0);
  };

  const handleTouchMove = (e) => {
    if (!touchStart || !isDragging) return;
    
    const currentX = e.targetTouches[0].clientX;
    const distance = currentX - touchStart;
    
    // Apply resistance for better feel - reduce movement to 1/3 of actual drag
    // This allows user to see where they're dragging
    setDragX(distance * 0.5);
  };

  const handleTouchEnd = (e) => {
    setTouchEnd(e.changedTouches[0].clientX);
    setIsDragging(false);
    handleSwipe();
    setDragX(0);
  };

  const handleSwipe = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrevious();

    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleMouseDown = (e) => {
    if (e.button === 0) {
      const x = e.clientX;
      const rect = photoRef.current?.getBoundingClientRect();
      if (rect) {
        const clickPosition = x - rect.left;
        const clickPercent = clickPosition / rect.width;
        if (clickPercent < 0.3) {
          handlePrevious();
        } else if (clickPercent > 0.7) {
          handleNext();
        }
      }
    }
  };

  const handleToggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        if (viewerRef.current?.requestFullscreen) {
          await viewerRef.current.requestFullscreen();
          setIsFullscreen(true);
        } else if (viewerRef.current?.webkitRequestFullscreen) {
          await viewerRef.current.webkitRequestFullscreen();
          setIsFullscreen(true);
        }
      } else {
        handleExitFullscreen();
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  };

  const handleExitFullscreen = async () => {
    try {
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        }
      }
      setIsFullscreen(false);
    } catch (err) {
      console.error('Error exiting fullscreen:', err);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (!currentPhoto) return null;

  return (
    <div
      ref={viewerRef}
      className={`photo-viewer ${isFullscreen ? 'fullscreen' : ''}`}
      style={{ '--accent-color': dominantColor }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <button className="close-button" onClick={onClose} title="Close (ESC)">
        ✕
      </button>

      <button 
        className="fullscreen-button" 
        onClick={handleToggleFullscreen}
        title={isFullscreen ? 'Exit fullscreen (F)' : 'Enter fullscreen (F)'}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? '⛶' : '⛶'}
      </button>

      <div className="photo-container">
        <button
          className="nav-button prev-button"
          onClick={handlePrevious}
          aria-label="Previous photo"
        >
          ❮
        </button>

        <img
          ref={photoRef}
          src={getPhotoUrl(currentPhoto.path)}
          alt={currentPhoto.name}
          className="photo"
          style={{
            transform: `translateX(${dragX}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out'
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />

        <button
          className="nav-button next-button"
          onClick={handleNext}
          aria-label="Next photo"
        >
          ❯
        </button>
      </div>

      <div className="photo-info">
        {exifData && (
          <div className="exif-data">
            {exifData.Make && exifData.Model && (
              <div className="exif-item">
                <span className="exif-icon">📷</span>
                <span className="exif-text">{exifData.Make} {exifData.Model}</span>
              </div>
            )}
            {exifData.LensModel && (
              <div className="exif-item">
                <span className="exif-icon">🔭</span>
                <span className="exif-text">{exifData.LensModel}</span>
              </div>
            )}
            <div className="exif-row">
              {exifData.FocalLength && (
                <span className="exif-badge">{exifData.FocalLength}mm</span>
              )}
              {exifData.FNumber && (
                <span className="exif-badge">f/{exifData.FNumber}</span>
              )}
              {exifData.ExposureTime && (
                <span className="exif-badge">
                  {exifData.ExposureTime < 1 
                    ? `1/${Math.round(1 / exifData.ExposureTime)}s` 
                    : `${exifData.ExposureTime}s`}
                </span>
              )}
              {exifData.ISOSpeedRatings && (
                <span className="exif-badge">
                  ISO{' '}
                  {Array.isArray(exifData.ISOSpeedRatings)
                    ? exifData.ISOSpeedRatings[0]
                    : exifData.ISOSpeedRatings}
                </span>
              )}
            </div>
            {exifData.DateTimeOriginal && (
              <div className="exif-item">
                <span className="exif-icon">📅</span>
                <span className="exif-text">
                  {new Date(exifData.DateTimeOriginal).toLocaleDateString(
                    'en-US',
                    {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }
                  )}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="photo-navigation-dots">
        {photos.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to photo ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
