import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { DocumentType, mongoose, ReturnModelType } from '@typegoose/typegoose'
import { InjectModel } from 'nestjs-typegoose'
import { File } from './file.schema'
import * as fs from 'fs'
import * as path from 'path'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File) private readonly fileModel: ReturnModelType<typeof File>,
    private readonly configService: ConfigService,
  ) {}

  async createOne(file: File): Promise<DocumentType<File>> {
    const newFile = await new this.fileModel(file)
    return newFile.save()
  }

  async deleteMany(
    files: DocumentType<File>[],
    deleteFromDisk = true,
  ): Promise<void> {
    const fileIds = files.reduce(
      (acc, { _id }) => [...acc, _id],
      [] as mongoose.Types.ObjectId[],
    )
    // Deleting file documents from mongo
    await this.fileModel.deleteMany({ _id: { $in: fileIds } })

    if (deleteFromDisk) {
      const fileNames = files.map(({ filename }) => filename)
      this.deleteByFileNames(fileNames)
    }
  }

  async deleteByFileNames(fileNames: string[]): Promise<void> {
    const uploadsDir = this.configService.get('UPLOADS_DEST')
    const filePaths = fileNames.map(name =>
      path.join(__dirname, '../..', uploadsDir, name),
    )
    const deletePromises: Promise<boolean>[] = filePaths.map(filePath =>
      this.deleteFile(filePath),
    )

    try {
      await Promise.all(deletePromises)
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to delete files')
    }
  }

  async deleteFile(filePath): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, err => {
        if (err) reject(err)
        console.log('DELETING', filePath)
        resolve(true)
      })
    })
  }
}
