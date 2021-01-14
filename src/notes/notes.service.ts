import { Injectable } from '@nestjs/common'
import { ReturnModelType } from '@typegoose/typegoose'
import { InjectModel } from 'nestjs-typegoose'
import { CreateNoteDto } from './notes.dto'
import { Note } from './note.schema'
import { User } from 'src/users/user.schema'

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note)
    private readonly notesModel: ReturnModelType<typeof Note>,
  ) {}

  createNote(user: User, createNoteDto: CreateNoteDto): Promise<Note> {
    const note = new this.notesModel({ ...createNoteDto, createdBy: user })
    return note.save()
  }

  async getNotes(user: User): Promise<Note[]> {
    const notes = await this.notesModel.find({ createdBy: user })
    return notes
  }
}
