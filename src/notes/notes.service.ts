import { Injectable } from '@nestjs/common'
import { ReturnModelType } from '@typegoose/typegoose'
import { InjectModel } from 'nestjs-typegoose'
import { CreateNoteDto } from './notes.dto'
import { Note } from './note.schema'

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note)
    private readonly notesModel: ReturnModelType<typeof Note>,
  ) {}

  createNote(createNoteDto: CreateNoteDto): Promise<Note> {
    const note = new this.notesModel(createNoteDto)
    return note.save()
  }

  async getNotes(): Promise<Note[]> {
    const notes = await this.notesModel.find({})
    return notes
  }
}
