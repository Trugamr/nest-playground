import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { DocumentType, ReturnModelType } from '@typegoose/typegoose'
import { InjectModel } from 'nestjs-typegoose'
import { File } from './file.schema'
import { v4 as uuidv4 } from 'uuid'
import { ConfigService } from '@nestjs/config'
import { User } from 'src/users/user.schema'
import * as path from 'path'
import * as fs from 'fs'
import * as filenamify from 'filenamify'

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File) private readonly fileModel: ReturnModelType<typeof File>,
    private readonly configService: ConfigService,
  ) {}

  async createFilesWithFields<K>(
    user: User,
    filesWithFields: FilesWithFields<K, MulterFile>,
  ): Promise<FilesWithFields<K, DocumentType<File>>> {
    // Get all available file fields from files object
    const fields = Object.keys(filesWithFields)

    // Flatten object files into single files array
    const files = fields
      .map(field => filesWithFields[field])
      .reduce((acc, fileArr) => [...acc, ...fileArr], [] as MulterFile[])

    // Map files array to file write and insert promises
    const filePromises = files.map(file => this.createFile(user, file))

    // After all files are written and inserted in database
    const documents = await Promise.all(filePromises)

    // Create similar object with fields and insert documents using the number of files each filed had
    const documentsWithFields: FilesWithFields<
      K,
      DocumentType<File>
    > = {} as FilesWithFields<K, DocumentType<File>>

    fields.forEach(field => {
      documentsWithFields[field] = documents.splice(
        0,
        filesWithFields[field].length,
      )
    })

    return documentsWithFields
  }

  createFile(user: User, fileData: MulterFile): Promise<DocumentType<File>> {
    const {
      buffer,
      encoding,
      fieldname,
      mimetype,
      originalname,
      size,
    } = fileData
    const file = new this.fileModel()

    file.encoding = encoding
    file.fieldname = fieldname
    file.mimetype = mimetype
    file.originalname = originalname
    file.size = size
    file.filename = this._getRandomFilename(originalname)
    file.destination = this._getDestination()
    file.path = this._getFilePath(file.destination, file.filename)
    file.createdBy = user

    // Writing to disk
    try {
      this._writeFile(file.path, buffer)
    } catch (error) {
      throw new InternalServerErrorException('Failed to save files')
    }

    return file.save()
  }

  /** Write file to disk
   * @param {string} path - Full path including filename
   * @param {Buffer} buffer - Buffer data to write
   */
  async _writeFile(path: string, buffer: Buffer): Promise<boolean> {
    try {
      await fs.promises.writeFile(path, buffer)
      return true
    } catch (error) {
      throw new Error('Failed to write file to disk')
    }
  }

  _getRandomFilename(name: string) {
    return `${uuidv4()}_${filenamify(name)}`
  }

  _getDestination() {
    return this.configService.get('UPLOADS_DEST')
  }

  _getFilePath(destination: string, filename: string) {
    return path.join(destination, filename)
  }
}
