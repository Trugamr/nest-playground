import { prop, Ref } from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { File } from 'src/files/file.schema'
import { User } from 'src/users/user.schema'

export class Note extends TimeStamps {
  @prop({ required: true })
  title: string

  @prop({ type: String })
  body?: string

  @prop({ ref: User, required: true })
  createdBy: Ref<User>

  @prop({ ref: File })
  icon?: Ref<File>

  @prop({ ref: File })
  background?: Ref<File>
}
