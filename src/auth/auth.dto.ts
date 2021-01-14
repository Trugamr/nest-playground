import { IsString, MinLength, MaxLength } from 'class-validator'
import { CreateUserDto } from 'src/users/users.dto'

export class SignUpDto extends CreateUserDto {}

export class SignInDto {
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  username: string

  @IsString()
  @MinLength(3)
  @MaxLength(128)
  password: string
}
