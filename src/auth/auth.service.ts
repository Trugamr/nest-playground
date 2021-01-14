import { BadRequestException, Injectable } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import * as bcrypt from 'bcrypt'
import { SignInDto, SignUpDto } from './auth.dto'
import { User } from 'src/users/user.schema'
import { JwtService } from '@nestjs/jwt'
import { SignInResult } from './auth'
import { UserWithoutPassword } from 'src/users/user'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<SignInResult> {
    const { username, password } = signUpDto
    const hashedPassword = await bcrypt.hash(password, 10)
    signUpDto.password = hashedPassword

    await this.usersService.create(signUpDto)

    return this.signIn({ username, password })
  }

  async getAuthenticatedUser(
    username: string,
    plainPassword: string,
  ): Promise<UserWithoutPassword> {
    try {
      const user = await this.usersService.getByUsername(username)

      await this._verifyPassword(plainPassword, user.password)

      return this._sanitizeUser(user)
    } catch (error) {
      throw new BadRequestException('Invalid credentials')
    }
  }

  async signIn(signInDto: SignInDto): Promise<SignInResult> {
    const { username, password } = signInDto
    const user = await this.getAuthenticatedUser(username, password)
    const accessToken = await this.jwtService.sign(user)
    return {
      access_token: accessToken,
      user,
    }
  }

  async _verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const isPasswordMatching = await bcrypt.compare(
      plainPassword,
      hashedPassword,
    )

    if (!isPasswordMatching)
      throw new BadRequestException('Invalid credentials')

    return isPasswordMatching
  }

  _sanitizeUser(user: User): UserWithoutPassword {
    user.password = undefined
    return user
  }
}
