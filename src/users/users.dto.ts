import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'
import { Role } from './user.schema'

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  name: string

  @IsString()
  @MinLength(3)
  @MaxLength(32)
  username: string

  @IsEmail()
  @MinLength(3)
  @MaxLength(32)
  email: string

  @IsEnum(Role, {
    each: true,
    message: `Roles can have values from ${Object.keys(Role).toString()}`,
  })
  @IsOptional()
  roles?: Role[]

  @IsString()
  @MinLength(3)
  @MaxLength(128)
  password: string
}
