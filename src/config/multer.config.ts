import { BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'
import { diskStorage } from 'multer'
import { v4 as uuidv4 } from 'uuid'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sanitize = require('sanitize-filename')

// Fields used in notes route to get files
enum NotesFileFields {
  Icon = 'icon',
  Background = 'background',
}

const createMulterOptions = async (
  configService: ConfigService,
): Promise<MulterOptions> => {
  return {
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
    storage: diskStorage({
      destination: configService.get('UPLOADS_DEST'),
      filename: (req, file, cb) => {
        return cb(null, `${uuidv4()}___${sanitize(file.originalname)}`)
      },
    }),
  }
}

export default createMulterOptions
