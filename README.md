# Simple Photo Gallery

A modern, sleek photo gallery application built with React and Vite. Perfect for photographers to showcase their work with a beautiful dark theme and seamless mobile experience.

## Features

- 🎨 **Modern Dark Theme**: Sleek, professional dark UI with dynamic accent colors extracted from photos
- 📱 **Mobile Optimized**: Fully responsive design that works flawlessly on all devices
- 🖼️ **Photo Organization**: Hierarchical menu system with category-specific visual indicators
- 🔄 **Multiple Navigation Methods**:
  - Click/tap left and right sides of photos
  - Swipe left/right on mobile (with visual hint)
  - Arrow key navigation
  - Keyboard shortcuts (ESC, F for fullscreen)
- 🎯 **Smart Home Page**: Masonry grid display of all photos with category badges and hover effects
- 📷 **Photo Metadata**: View dimensions, file size, and complete EXIF camera data
- 🌈 **Dynamic Colors**: Photo-based accent colors for UI elements (frame borders, buttons, dots)
- 🏷️ **Category Badges**: Identify which category each photo belongs to with hover labels
- ⛶ **Fullscreen Mode**: Immersive photo viewing experience (press F or click button)
- ⌨️ **Keyboard Shortcuts**: On-screen hint showing all available shortcuts on first visit
- 👆 **Swipe Hints**: Mobile users see subtle animation guiding swipe navigation
- ⚙️ **Configuration**: Optional `config.json` for customizing site appearance
- ⚡ **Built with Vite**: Lightning-fast development and production builds

## Project Structure

```
public/
  photos/
    Fauna/
      photo1.jpg
      photo2.jpg
    Flora/
    Places/
    Streets/
    Things/
    Water/
  config.json (optional)

utility-scripts/
  optimize-photos.sh    - Photo optimization utility
  sanitize-exif.sh      - EXIF metadata sanitization
```

## Getting Started

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Add your photos**:
   - Place your photos in the `public/photos/` directory
   - Organize them into folders and subfolders as desired
   - Supported formats: JPG, JPEG, PNG, GIF, WEBP, SVG

3. **(Optional) Create config.json**:
   ```json
   {
     "title": "My Photo Gallery",
     "description": "Welcome to my photography showcase"
   }
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Photo Optimization

To optimize photos for web use, use the provided utility script:

```bash
./utility-scripts/optimize-photos.sh
```

This script will:
1. **Analyze** your photos and identify any larger than the specified threshold
2. **Display** a list of photos requiring optimization with their file sizes
3. **Prompt** you to confirm before proceeding
4. **Optimize** selected photos by:
   - Resizing to a maximum of 1400×1400 pixels
   - Reducing JPEG quality to 80% for better compression
   - Maintaining aspect ratios

### Usage

The script will ask you to accept the default threshold (1.5MB) or specify a custom limit:

```
🎯 Size Threshold Configuration
Default limit: 1.5MB

Use default threshold? (y/n)
```

Enter `y` to use the default, or `n` to specify a custom threshold in MB (e.g., `0.5`, `1.0`, `2.0`).

**Note**: Your original photos are safe - git will preserve version history. The script only optimizes in-place and is designed to reduce file sizes for faster web loading while maintaining visual quality.

## EXIF Data Sanitization

To remove personal information from photo metadata while preserving camera settings, use the EXIF sanitization script:

```bash
./utility-scripts/sanitize-exif.sh
```

This script will:
1. **Scan** all photos for personal EXIF and XMP metadata
2. **Display** what will be removed before proceeding
3. **Prompt** for confirmation before sanitization
4. **Remove** personal information while preserving camera settings
5. **Report** which files were successfully sanitized

### What Gets Removed

- GPS coordinates and location data
- Date/time information (creation, modification dates)
- User comments and artist information
- Copyright notices and software metadata
- IPTC and XMP personal tags

### What Gets Preserved

- Camera make, model, and body information
- Lens model and focal length
- Shutter speed, aperture (f-number), and ISO
- White balance and metering mode
- Other technical camera settings

### Prerequisites

The script requires `exiftool` to be installed:

```bash
sudo apt-get install -y libimage-exiftool-perl
```

### Usage

Run the script and follow the prompts:

```bash
./utility-scripts/sanitize-exif.sh
```

The script will:
1. Show all photos with removable personal data
2. Display the specific EXIF tags that will be removed
3. Ask for confirmation before proceeding
4. Sanitize confirmed photos and report results

**Note**: This modifies your original files directly. Ensure you have backups if needed.

## Configuration

Create a `config.json` file in the public directory to customize:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | Photo Gallery | Gallery title |
| `description` | string | A modern photo gallery | Gallery subtitle |

## Usage

### Keyboard Shortcuts

- **Arrow Left/Right (←→)**: Navigate between photos
- **F**: Toggle fullscreen mode
- **ESC**: Close photo viewer or exit fullscreen
- **Click left/right side**: Navigate photos (desktop)
- **Swipe left/right**: Navigate photos (mobile)

### Photo Viewer Features

- **EXIF Data**: Hover over a photo to see dimensions, file size, and camera metadata
- **Category Labels**: Hover over masonry grid items to see which category they belong to
- **Dynamic Colors**: UI accents change based on the dominant color of each photo
- **Navigation Dots**: Click dots at bottom to jump to specific photos

### Menu Navigation

- **"All" button**: View all photos from all categories
- **Category buttons**: Click to view photos from a specific category
- **Left sidebar** (desktop): Full category navigation
- **Hamburger menu** (mobile): Category navigation drawer
- **Category borders**: Each category has a unique color-coded border for visual organization

### First Time User Experience

- **Keyboard Shortcuts Hint**: Modal appears on first visit showing all available shortcuts
- **Swipe Hint**: Mobile users see animated arrows guiding swipe navigation
- Both hints auto-dismiss and won't show again (unless browser storage is cleared)

## Technologies

- **React 19**: UI library
- **Vite 7**: Build tool and dev server
- **Exifr**: EXIF data extraction from photos
- **React Masonry CSS**: Responsive masonry grid layout
- **CSS3**: Custom styling with flexbox, grid, and animations
- **JavaScript ES6+**: Modern JavaScript with async/await
- **ImageMagick**: Photo optimization (optional, for utility scripts)

## Performance

- Fast photo loading with lazy loading
- Optimized image rendering
- Smooth animations and transitions
- Touch-optimized for mobile devices

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

### Project Layout

```
src/
  components/
    Menu.jsx                      - Photo category navigation with color-coded borders
    PhotoGallery.jsx              - Grid view of photos
    PhotoViewer.jsx               - Full-screen photo viewer with EXIF data
    HomePage.jsx                  - Masonry grid with category badges and overlays
    KeyboardShortcutsHint.jsx     - First-visit keyboard shortcuts hint
  utils/
    photoLoader.js                - Photo directory scanning
    configLoader.js               - Configuration loading
  App.jsx                         - Main application component
  main.jsx                        - React entry point

utility-scripts/
  optimize-photos.sh              - Photo optimization for web
  sanitize-exif.sh                - Remove personal metadata while preserving camera data
```

### Key Components Details

**PhotoViewer.jsx**
- Displays photos in fullscreen modal
- Extracts and shows EXIF metadata (camera, lens, ISO, aperture, shutter speed, date)
- Extracts dominant color from image for dynamic UI accents
- Supports keyboard navigation and fullscreen mode
- Shows swipe hints on mobile devices

**HomePage.jsx**
- Masonry grid layout of all photos
- Category-specific gradient overlays on hover
- Shows category badges when hovering over photos
- Dynamic accent colors based on image content

**Menu.jsx**
- Category navigation with color-coded borders
- Each category has unique visual identity
- "All" button to return to home page
- Responsive: sidebar on desktop, drawer on mobile

## License

Specify your license here.

## Support

For issues and feature requests, please open an issue on GitHub.

---

Built with ❤️ for photographers
