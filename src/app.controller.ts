import { Controller, Get } from '@nestjs/common'
import {} from '@nestjs/platform-express'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getMessage(): string {
    return this.appService.getMessage()
  }
}
