import { Body, Controller, Post } from '@nestjs/common'
import { SignInResult } from './auth'
import { SignInDto, SignUpDto } from './auth.dto'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto)
  }

  @Post('/signin')
  signIn(@Body() signInDto: SignInDto): Promise<SignInResult> {
    return this.authService.signIn(signInDto)
  }
}
