import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function scanDirectory(dir) {
  const result = {
    photos: [],
    folders: {}
  }

  try {
    if (!fs.existsSync(dir)) {
      return result
    }

    const items = fs.readdirSync(dir, { withFileTypes: true })
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']

    items.forEach(item => {
      if (item.isFile()) {
        const ext = path.extname(item.name).toLowerCase()
        if (imageExtensions.includes(ext)) {
          result.photos.push(item.name)
        }
      } else if (item.isDirectory()) {
        result.folders[item.name] = scanDirectory(path.join(dir, item.name))
      }
    })

    result.photos.sort()
    Object.keys(result.folders).forEach(key => {
      result.folders[key] = scanDirectory(path.join(dir, key))
    })
  } catch (error) {
    console.error('Error reading directory:', dir, error)
  }

  return result
}

// Plugin to generate photos.json for both dev and production
function photosJsonPlugin() {
  return {
    name: 'photos-json',
    configResolved(config) {
      // Generate the file in the public directory so it's served by Vite in dev
      const photosDir = path.join(process.cwd(), 'public', 'photos')
      const structure = scanDirectory(photosDir)
      const apiDir = path.join(process.cwd(), 'public', 'api')
      
      // Create api directory if it doesn't exist
      if (!fs.existsSync(apiDir)) {
        fs.mkdirSync(apiDir, { recursive: true })
      }
      
      // Write the photos.json file
      fs.writeFileSync(
        path.join(apiDir, 'photos.json'),
        JSON.stringify(structure, null, 2)
      )
    },
    writeBundle(options) {
      // Also generate it in dist for production (if different from public)
      const photosDir = path.join(process.cwd(), 'public', 'photos')
      const structure = scanDirectory(photosDir)
      const outputDir = options.dir
      const apiDir = path.join(outputDir, 'api')
      
      // Create api directory if it doesn't exist
      if (!fs.existsSync(apiDir)) {
        fs.mkdirSync(apiDir, { recursive: true })
      }
      
      // Write the photos.json file
      fs.writeFileSync(
        path.join(apiDir, 'photos.json'),
        JSON.stringify(structure, null, 2)
      )
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/photo-gallery/',
  plugins: [react(), photosJsonPlugin()],
})
