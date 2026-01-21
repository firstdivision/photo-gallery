# Using Vite with Node.js ESM modules requires Node version 14.6+

## Installation

```bash
npm install
```

## Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in your browser. The page will reload when you make changes. You will also see any lint errors in the console.

## Vite Features

- Hot Module Replacement (HMR) for instant updates during development
- Lightning-fast build tool with ES modules support
- Pre-configured React development environment

## Building & Preview

### Build for Production
```bash
npm run build
```

### Preview the Production Build
```bash
npm run preview
```

## ESLint

The project includes ESLint configuration for code quality. Run linting with:
```bash
npm run lint
```

## Adding Photos

1. Create folders in `public/photos/` for your photo categories
2. Place your image files in these folders
3. Organize into subfolders for subcategories
4. The app will automatically scan and organize them in the menu

### Supported Image Formats
- JPG / JPEG
- PNG
- GIF
- WEBP
- SVG

## Configuration

Create `public/config.json` to customize your gallery:

```json
{
  "title": "My Gallery",
  "description": "Welcome to my photos",
  "darkMode": true,
  "primaryColor": "#ffffff",
  "secondaryColor": "#888888",
  "backgroundColor": "#0d0d0d",
  "enableSwipe": true,
  "enableClickNavigation": true
}
```

## Project Structure

```
public/
├── photos/                 # Your photo files organized by folder
│   ├── category-1/
│   │   ├── photo1.jpg
│   │   └── subcategory/
│   │       └── photo2.jpg
│   └── category-2/
├── config.json            # (Optional) Gallery configuration
└── vite.svg

src/
├── components/
│   ├── Menu.jsx           # Navigation sidebar
│   ├── PhotoGallery.jsx   # Photo grid view
│   ├── PhotoViewer.jsx    # Full-screen photo viewer
│   └── HomePage.jsx       # Featured photo home
├── utils/
│   ├── photoLoader.js     # Photo directory scanning
│   └── configLoader.js    # Configuration management
├── App.jsx                # Main application
├── main.jsx               # React entry point
├── App.css
├── index.css
└── assets/
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile, etc.)

## Keyboard Shortcuts

- **←  →** : Navigate between photos
- **ESC** : Close photo viewer
- **Swipe** : Navigate on touch devices
- **Click sides** : Navigate on desktop

## Tips

- Organize photos into meaningful folder structures
- Use descriptive folder names - they'll become menu items
- The app automatically detects new photos without restart
- Try the "Another Photo" button on the home page for random selections

---

Enjoy your photo gallery!
