/**
 * Default configuration
 */
const defaultConfig = {
  title: 'Photo Gallery',
  description: 'A modern photo gallery',
  darkMode: true,
  primaryColor: '#ffffff',
  secondaryColor: '#888888',
  backgroundColor: '#0d0d0d',
  enableSwipe: true,
  enableClickNavigation: true,
  photoQuality: 'auto',
  thumbnailSize: 'medium'
};

/**
 * Loads configuration from config.json if it exists
 */
export async function loadConfig() {
  try {
    const response = await fetch('/config.json');
    if (!response.ok) {
      console.log('Config file not found, using defaults');
      return defaultConfig;
    }
    const customConfig = await response.json();
    return { ...defaultConfig, ...customConfig };
  } catch (error) {
    console.log('Error loading config, using defaults:', error);
    return defaultConfig;
  }
}

export { defaultConfig };
