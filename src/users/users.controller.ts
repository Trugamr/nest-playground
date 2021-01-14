import { Controller, Get, UseGuards } from '@nestjs/common'
import { GetUser } from 'src/auth/get-user.decorater'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserWithoutPassword } from './user'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@GetUser() user: UserWithoutPassword) {
    return user
  }
}
