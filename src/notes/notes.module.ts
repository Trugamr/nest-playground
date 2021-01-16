import { Module } from '@nestjs/common'
import { NotesService } from './notes.service'
import { NotesController } from './notes.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { Note } from './note.schema'
import { FilesModule } from 'src/files/files.module'

@Module({
  imports: [TypegooseModule.forFeature([Note]), FilesModule],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
