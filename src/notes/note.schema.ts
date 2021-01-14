import { prop } from '@typegoose/typegoose'

export class Note {
  @prop({ required: true })
  title: string

  @prop({ type: String })
  body?: string
}
