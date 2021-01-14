import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import configModuleOptions from './config/configModuleOptions'
import createTypegooseOptions from './config/database.config'

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: createTypegooseOptions,
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
