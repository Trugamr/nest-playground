import { prop } from '@typegoose/typegoose'

export enum Role {
  Admin = 'Admin',
}

export class User {
  @prop({ required: true, minlength: 1, maxlength: 64 })
  name: string

  @prop({ required: true, unique: true, minlength: 3, maxlength: 32 })
  username: string

  @prop({ required: true, unique: true, minlength: 3, maxlength: 32 })
  email: string

  @prop({ default: false })
  emailVerified: boolean

  @prop({ enum: Role, type: [String], default: [] })
  roles: Role[]

  @prop({ required: true, minlength: 6, maxlength: 128 })
  password: string
}
