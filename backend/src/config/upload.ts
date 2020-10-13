import { request } from 'express'
import multer from 'multer'
import path from 'path'

export default {
  storage: multer.diskStorage({
    destination: path.join(__dirname, '..', '..', 'uploads'),
    filename: (request, file, cb) => {
      const originalNameFormatted = file.originalname.replace(/\s/g, '').replace('#', '')

      const filename = `${Date.now()}-${originalNameFormatted}`

      cb(null, filename)
    }
  })
}
