import { Module } from '@nestjs/common'
import { NotesService } from './notes.service'
import { NotesController } from './notes.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { Note } from './note.schema'

@Module({
  imports: [TypegooseModule.forFeature([Note])],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
