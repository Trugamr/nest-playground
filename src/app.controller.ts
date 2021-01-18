import { Controller, Get, UseGuards } from '@nestjs/common'
import {} from '@nestjs/platform-express'
import { AppService } from './app.service'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { Roles } from './auth/roles.decorator'
import { RolesGuard } from './auth/roles.guard'
import { Role } from './users/user.schema'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getMessage(): string {
    return this.appService.getMessage()
  }

  @Get('admin')
  @Roles(Role.Admin)
  getAdminMessage(): string {
    return this.appService.getAdminMessage()
  }
}
