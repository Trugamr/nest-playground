import { Module } from '@nestjs/common'
import { FilesService } from './files.service'
import { FilesController } from './files.controller'
import { MulterModule } from '@nestjs/platform-express'
import createMulterOptions from 'src/config/multer.config'
import { TypegooseModule } from 'nestjs-typegoose'
import { File } from './file.schema'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    TypegooseModule.forFeature([File]),
    MulterModule.registerAsync({
      useFactory: createMulterOptions,
    }),
    ConfigModule,
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
