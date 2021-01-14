import { User } from './user.schema'

declare type UserWithoutPassword = Omit<User, 'password'>
