import { prop, Ref } from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { User } from 'src/users/user.schema'

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

  @prop({ required: true })
  filename: string

  @prop({ required: true })
  path: string

  @prop({ required: true })
  size: number

  @prop({ ref: User, required: true })
  createdBy: Ref<User>
}
