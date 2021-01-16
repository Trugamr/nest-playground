declare interface MulterFile {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  buffer: Buffer
  size: number
}

declare type FilesWithFields<K, T> = {
  [key in keyof K]: T[]
}
