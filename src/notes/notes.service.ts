import { Injectable, NotFoundException } from '@nestjs/common'
import { ReturnModelType } from '@typegoose/typegoose'
import { InjectModel } from 'nestjs-typegoose'
import { CreateNoteDto, UpdateNoteDto } from './notes.dto'
import { Note } from './note.schema'
import { User } from 'src/users/user.schema'
import * as mongoose from 'mongoose'

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

  async deleteNote(user: User, noteId: mongoose.Types.ObjectId): Promise<void> {
    const { deletedCount } = await this.notesModel.deleteOne({
      createdBy: user,
      _id: noteId,
    })

    if (!deletedCount)
      throw new NotFoundException('Note with specified id does not exist')
  }

  async updateNote(
    user: User,
    noteId: mongoose.Types.ObjectId,
    updateNoteDto: UpdateNoteDto,
  ): Promise<Note> {
    const updatedNote = await this.notesModel.findOneAndUpdate(
      { createdBy: user, _id: noteId },
      updateNoteDto,
      {
        new: true,
      },
    )

    if (!updatedNote)
      throw new NotFoundException('Note with specified id does not exist')

    return updatedNote
  }
}
