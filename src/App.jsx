import React, { useState, useEffect } from 'react';
import './App.css';
import { Menu } from './components/Menu';
import { PhotoGallery } from './components/PhotoGallery';
import { HomePage } from './components/HomePage';
import { KeyboardShortcutsHint } from './components/KeyboardShortcutsHint';
import { loadPhotoStructure, flattenPhotos, getPhotosInFolder } from './utils/photoLoader';
import { loadConfig } from './utils/configLoader';

function App() {
  const [photoStructure, setPhotoStructure] = useState(null);
  const [allPhotos, setAllPhotos] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folderPhotos, setFolderPhotos] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    // Set document title from config
    if (config?.title) {
      document.title = config.title;
    }
  }, [config]);

  const loadInitialData = async () => {
    try {
      const [configData, photoData] = await Promise.all([
        loadConfig(),
        loadPhotoStructure()
      ]);
      
      setConfig(configData);
      setPhotoStructure(photoData);
      
      const flattened = flattenPhotos(photoData);
      setAllPhotos(flattened);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentFolder && photoStructure) {
      const photos = getPhotosInFolder(photoStructure, currentFolder);
      setFolderPhotos(photos);
    } else {
      setFolderPhotos([]);
    }
  }, [currentFolder, photoStructure]);

  const handleNavigate = (folder) => {
    setCurrentFolder(folder);
  };

  const handleHomeClick = () => {
    setCurrentFolder(null);
  };

  if (loading) {
    return (
      <div className="app loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="app">
      <KeyboardShortcutsHint />
      
      {photoStructure && (
        <Menu
          structure={photoStructure}
          currentFolder={currentFolder}
          onNavigate={handleNavigate}
          onHome={handleHomeClick}
        />
      )}
      
      <main className="main-content">
        {currentFolder ? (
          <PhotoGallery
            photos={folderPhotos}
            folderName={currentFolder.split('/').filter(Boolean).pop() || 'Photos'}
          />
        ) : (
          <HomePage allPhotos={allPhotos} config={config} />
        )}
      </main>
    </div>
  );
}

export default App;
