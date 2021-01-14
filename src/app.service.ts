import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getMessage(): string {
    return this.configService.get('MESSAGE')
  }
}
