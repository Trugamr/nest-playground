import { prop } from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'

export class File extends TimeStamps {
  @prop({ required: true })
  fieldname: string

  @prop({ required: true })
  originalname: string

  @prop({ required: true })
  encoding: string

  @prop({ required: true })
  mimetype: string

  @prop({ required: true })
  destination: string

  @prop({ required: true, unique: true })
  filename: string

  @prop({ required: true })
  path: string

  @prop({ required: true })
  size: number
}
