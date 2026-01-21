/**
 * Gets the correct photo URL with base path
 */
export function getPhotoUrl(photoPath) {
  const base = import.meta.env.BASE_URL || '/photo-gallery/';
  return `${base}photos${photoPath}`;
}

/**
 * Loads the photo directory structure and returns a hierarchical menu
 */
export async function loadPhotoStructure() {
  try {
    const base = import.meta.env.BASE_URL || '/photo-gallery/';
    const response = await fetch(`${base}api/photos.json`);
    if (!response.ok) throw new Error('Failed to load photos');
    return await response.json();
  } catch (error) {
    console.error('Error loading photo structure:', error);
    return {};
  }
}

/**
 * Flattens the photo structure into a single array of all photos with their paths
 */
export function flattenPhotos(structure, basePath = '') {
  const photos = [];

  function traverse(obj, currentPath) {
    if (obj.photos && Array.isArray(obj.photos)) {
      obj.photos.forEach(photo => {
        const pathSegment = currentPath ? `${currentPath}/${photo}` : photo;
        photos.push({
          path: `/${pathSegment}`,
          name: photo,
          fullPath: currentPath
        });
      });
    }

    if (obj.folders && typeof obj.folders === 'object') {
      Object.entries(obj.folders).forEach(([folderName, folderContent]) => {
        const newPath = currentPath ? `${currentPath}/${folderName}` : folderName;
        traverse(folderContent, newPath);
      });
    }
  }

  traverse(structure, basePath);
  return photos;
}

/**
 * Gets a random photo from the entire collection
 */
export function getRandomPhoto(photos) {
  if (!photos || photos.length === 0) return null;
  return photos[Math.floor(Math.random() * photos.length)];
}

/**
 * Gets all photos in a specific folder
 */
export function getPhotosInFolder(structure, folderPath = '') {
  if (!folderPath) {
    // Root level
    if (structure.photos) {
      return structure.photos.map(photo => ({
        path: `/${photo}`,
        name: photo,
        fullPath: '/'
      }));
    }
    return [];
  }

  const parts = folderPath.split('/').filter(p => p);
  let current = structure;

  for (const part of parts) {
    if (current.folders && current.folders[part]) {
      current = current.folders[part];
    } else {
      return [];
    }
  }

  if (current.photos) {
    const pathPrefix = folderPath.endsWith('/') ? folderPath : `${folderPath}/`;
    return current.photos.map(photo => ({
      path: `${pathPrefix}${photo}`,
      name: photo,
      fullPath: folderPath
    }));
  }

  return [];
}
