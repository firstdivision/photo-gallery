# Photo Gallery

A responsive React + Vite application for presenting curated photo collections with category navigation, fullscreen viewing, and optional metadata tooling.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Usage](#usage)
- [Utility Scripts](#utility-scripts)
- [Tech Stack](#tech-stack)
- [Browser Support](#browser-support)
- [License](#license)
- [Support](#support)

## Overview

This project is designed for photographers and visual creators who want a lightweight, modern gallery experience. It supports organized photo categories, mobile-friendly navigation, and optional EXIF handling workflows.

## Features

- Responsive layout for desktop and mobile
- Category-based organization with visual category indicators
- Masonry-style homepage preview of all photos
- Fullscreen photo viewer with keyboard and touch navigation
- EXIF metadata display (dimensions, file size, camera details)
- Dynamic accent colors derived from image content
- First-visit keyboard shortcut and swipe hints
- Optional `public/config.json` for gallery title and description

## Project Structure

```text
public/
  api/
    photos.json
  photos/
    Fauna/
    Flora/
    Places/
    Streets/
    Things/
    Things That Fly/
    Water/
  config.json

src/
  components/
  utils/
  App.jsx
  main.jsx

utility-scripts/
  optimize-photos.sh
  sanitize-exif.sh
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Add Photos

1. Place photos under `public/photos/`.
2. Organize photos into category folders as needed.
3. Supported formats include: `jpg`, `jpeg`, `png`, `gif`, `webp`, `svg`.

### Run Locally

```bash
npm run dev
```

Default local URL: `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Build output is generated in `dist/`.

### Preview Production Build

```bash
npm run preview
```

## Configuration

Create `public/config.json` to customize gallery text:

```json
{
  "title": "My Photo Gallery",
  "description": "Welcome to my photography showcase"
}
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | string | `Photo Gallery` | Gallery title |
| `description` | string | `A modern photo gallery` | Gallery subtitle |

## Usage

### Keyboard and Navigation

- `Arrow Left` / `Arrow Right`: previous/next photo
- `F`: toggle fullscreen
- `Esc`: close viewer or exit fullscreen
- Desktop: click photo edges to navigate
- Mobile: swipe left/right to navigate

### Gallery Behavior

- Use the `All` view to browse every category
- Select category buttons to filter by folder
- Hover photos in the homepage grid to view category labels

## Utility Scripts

### Optimize Photos

```bash
./utility-scripts/optimize-photos.sh
```

What it does:

- Finds images above a configurable size threshold
- Confirms before modifying files
- Resizes images up to 1400x1400 max
- Applies JPEG compression (quality 80)

### Sanitize EXIF Metadata

```bash
./utility-scripts/sanitize-exif.sh
```

What it does:

- Detects personal EXIF/XMP metadata
- Prompts before changes
- Removes personal metadata (for example GPS, timestamps, comments)
- Preserves technical camera settings where possible

Prerequisite on Debian/Ubuntu:

```bash
sudo apt-get install -y libimage-exiftool-perl
```

## Tech Stack

- React 19
- Vite 7
- exifr
- react-masonry-css
- CSS3
- JavaScript (ES modules)

## Browser Support

- Chrome / Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari and Chrome Mobile

## License

Add your preferred license information here.

## Support

Use GitHub Issues for bug reports and feature requests.
