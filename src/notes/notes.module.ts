import { Module } from '@nestjs/common'
import { NotesService } from './notes.service'
import { NotesController } from './notes.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { Note } from './note.schema'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express'
import createMulterOptions from 'src/config/multer.config'
import { FilesModule } from 'src/files/files.module'

@Module({
  imports: [
    TypegooseModule.forFeature([Note]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: createMulterOptions,
      inject: [ConfigService],
    }),
    FilesModule,
  ],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
