import { BadRequestException } from '@nestjs/common'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'

// Fields used in notes route to get files
enum NotesFileFields {
  Icon = 'icon',
  Background = 'background',
}

const createMulterOptions = async (): Promise<MulterOptions> => ({
  limits: {
    fileSize: 1 * 1000000, // 1 MB
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === NotesFileFields.Icon) {
      return cb(null, true)
    }

    if (file.fieldname === NotesFileFields.Background) {
      return cb(null, true)
    }

    cb(new BadRequestException('Bad file type or name'), false)
  },
})

export default createMulterOptions
