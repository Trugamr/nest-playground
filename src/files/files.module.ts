import { Module } from '@nestjs/common'
import { FilesService } from './files.service'
import { FilesController } from './files.controller'

import { TypegooseModule } from 'nestjs-typegoose'
import { File } from './file.schema'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [TypegooseModule.forFeature([File]), ConfigModule],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
