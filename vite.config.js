import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Photo scanning middleware
function photoScannerMiddleware() {
  return {
    name: 'photo-scanner',
    configureServer(server) {
      server.middlewares.use('/api/photos', (req, res) => {
        try {
          const photosDir = path.join(process.cwd(), 'public', 'photos')
          const structure = scanDirectory(photosDir)
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(structure))
        } catch (error) {
          console.error('Error scanning photos:', error)
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'Failed to scan photos' }))
        }
      })
    }
  }
}

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

// https://vite.dev/config/
export default defineConfig({
  base: '/simple-photo-gallery/',
  plugins: [react(), photoScannerMiddleware()],
})
