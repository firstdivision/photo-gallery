import React, { useState, useEffect } from 'react';
import './KeyboardShortcutsHint.css';

export function KeyboardShortcutsHint() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen the hint before
    const hasSeenHint = localStorage.getItem('hasSeenKeyboardHint');
    
    if (!hasSeenHint) {
      // Show hint after a short delay on first load
      const timer = setTimeout(() => {
        setIsVisible(true);
        localStorage.setItem('hasSeenKeyboardHint', 'true');
      }, 800);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const shortcuts = [
    { keys: '←  →', description: 'Navigate photos' },
    { keys: 'F', description: 'Fullscreen' },
    { keys: 'ESC', description: 'Close' }
  ];

  if (!isVisible) return null;

  return (
    <div className="keyboard-hints-overlay">
      <div className="keyboard-hints-container">
        <div className="hints-header">
          <h3 className="hints-title">⌨️ Keyboard Shortcuts</h3>
          <button 
            className="hints-close"
            onClick={handleDismiss}
            aria-label="Dismiss shortcuts"
          >
            ✕
          </button>
        </div>
        <div className="hints-grid">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="hint-item">
              <span className="hint-keys">{shortcut.keys}</span>
              <span className="hint-description">{shortcut.description}</span>
            </div>
          ))}
        </div>
        <button 
          className="hints-dismiss-button"
          onClick={handleDismiss}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
