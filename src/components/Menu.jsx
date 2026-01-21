import React, { useState } from 'react';
import './Menu.css';

// Category to color mapping (matching HomePage gradients)
const CATEGORY_COLORS = {
  'All': '#7a7a7a',        // Neutral gray
  'Fauna': '#8b7355',      // Muted brown
  'Flora': '#5a9b6f',      // Muted green
  'Places': '#6b8ba3',     // Muted blue
  'Streets': '#8b75a3',    // Muted purple
  'Things': '#9d8a6d',     // Muted earthy
  'Water': '#5a9bb3'       // Muted cyan
};

export function Menu({ structure, currentFolder, onNavigate, onHome }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigateToFolder = (folderName) => {
    onNavigate(`/${folderName}`);
    closeMenuOnMobile();
  };

  const handleHome = () => {
    onHome();
    closeMenuOnMobile();
  };

  const closeMenuOnMobile = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const getCategoryColor = (categoryName) => {
    return CATEGORY_COLORS[categoryName] || '#666666';
  };

  return (
    <nav className="top-nav">
      <div className="nav-container">
        <button 
          className="nav-home-button"
          onClick={handleHome}
          title="Home"
          aria-label="Home"
        >
          📷
        </button>
        
        <div className="nav-categories">
          <button
            className={`nav-item ${!currentFolder || currentFolder === '/' ? 'active' : ''}`}
            onClick={handleHome}
            style={{ '--category-color': getCategoryColor('All') }}
            title="View all photos"
          >
            All
          </button>
          {structure.folders && Object.keys(structure.folders).length > 0 ? (
            Object.entries(structure.folders).map(([name]) => (
              <button
                key={name}
                className={`nav-item ${currentFolder === `/${name}` ? 'active' : ''}`}
                onClick={() => handleNavigateToFolder(name)}
                style={{ '--category-color': getCategoryColor(name) }}
              >
                {name}
              </button>
            ))
          ) : null}
        </div>

        <button 
          className="hamburger-menu"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {isOpen && (
        <>
          <div className="menu-overlay" onClick={() => setIsOpen(false)}></div>
          <div className="mobile-menu">
            <div className="mobile-menu-items">
              <button
                className={`mobile-menu-item ${!currentFolder || currentFolder === '/' ? 'active' : ''}`}
                onClick={handleHome}
                style={{ '--category-color': getCategoryColor('All') }}
              >
                All
              </button>
              {structure.folders && Object.keys(structure.folders).length > 0 ? (
                Object.entries(structure.folders).map(([name]) => (
                  <button
                    key={name}
                    className={`mobile-menu-item ${currentFolder === `/${name}` ? 'active' : ''}`}
                    onClick={() => handleNavigateToFolder(name)}
                    style={{ '--category-color': getCategoryColor(name) }}
                  >
                    {name}
                  </button>
                ))
              ) : (
                <div className="mobile-menu-empty">No folders</div>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
