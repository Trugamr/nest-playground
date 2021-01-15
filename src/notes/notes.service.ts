import { Injectable, NotFoundException } from '@nestjs/common'
import { DocumentType, ReturnModelType } from '@typegoose/typegoose'
import { InjectModel } from 'nestjs-typegoose'
import { CreateNoteDto, UpdateNoteDto } from './notes.dto'
import { Note } from './note.schema'
import { User } from 'src/users/user.schema'
import * as mongoose from 'mongoose'
import { NoteFiles } from './notes'
import { FilesService } from 'src/files/files.service'
import { File } from 'src/files/file.schema'

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note)
    private readonly notesModel: ReturnModelType<typeof Note>,
    private readonly fileService: FilesService,
  ) {}

  async createNote(
    user: User,
    createNoteDto: CreateNoteDto,
    files: NoteFiles = null,
  ): Promise<Note> {
    const note = new this.notesModel({ ...createNoteDto, createdBy: user })

    if (files?.icon && files.icon.length) {
      note.icon = await this.fileService.createOne(files.icon[0])
    }

    if (files?.background && files.background.length) {
      note.background = await this.fileService.createOne(files.background[0])
    }

    return note.save()
  }

  async getNote(
    user: User,
    noteId: mongoose.Types.ObjectId,
  ): Promise<DocumentType<Note>> {
    const note = await this.notesModel.findOne({ _id: noteId, createdBy: user })

    if (!note)
      throw new NotFoundException('Note with specified id does not exist')

    return note
  }

  async getNotes(user: User): Promise<Note[]> {
    const fieldsToPopulate = 'createdBy icon background'
    const notes = await this.notesModel
      .find({ createdBy: user })
      .populate(fieldsToPopulate)
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
    files: NoteFiles = null,
  ): Promise<Note> {
    try {
      // If note not found error will be thrown
      // Catching error to delete file and then re-throw error
      await this.getNote(user, noteId)
    } catch (error) {
      // Delete files saved by multer
      if (files) {
        const fileNames = (Object.values(files) as File[][])
          .reduce((acc, item) => [...acc, ...item], [] as File[])
          .map(({ filename }) => filename)
        await this.fileService.deleteByFileNames(fileNames)
      }

      // Re-throw not found execption
      throw error
    }

    const updates: Partial<Note> = {
      ...updateNoteDto,
    }

    if (files?.icon && files.icon.length) {
      updates.icon = await this.fileService.createOne(files.icon[0])
    }

    if (files?.background && files.background.length) {
      updates.background = await this.fileService.createOne(files.background[0])
    }

    const updatedNote = await this.notesModel.findOneAndUpdate(
      { _id: noteId, createdBy: user },
      updates,
      { new: true },
    )

    return updatedNote
  }
}
