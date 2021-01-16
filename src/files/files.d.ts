declare interface MulterFile {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  buffer: Buffer
  size: number
}

declare interface FilesWithFields<T> {
  [key: string]: T[]
}
