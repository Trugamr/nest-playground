import { Injectable, NotFoundException } from '@nestjs/common'
import { DocumentType, Ref, ReturnModelType } from '@typegoose/typegoose'
import { InjectModel } from 'nestjs-typegoose'
import { CreateNoteDto, UpdateNoteDto } from './notes.dto'
import { Note } from './note.schema'
import { User } from 'src/users/user.schema'
import { FilesService } from 'src/files/files.service'
import * as mongoose from 'mongoose'
import { File } from 'src/files/file.schema'

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note)
    private readonly notesModel: ReturnModelType<typeof Note>,
    private readonly filesService: FilesService,
  ) {}

  fieldsToPopulate = 'icon background'

  async createNote(
    user: User,
    createNoteDto: CreateNoteDto,
    files?: NoteFiles,
  ): Promise<Note> {
    const note = new this.notesModel({ ...createNoteDto, createdBy: user })

    if (files) {
      const fileDocuments = await this.filesService.createFilesWithFields<NoteFiles>(
        user,
        files,
      )

      if (fileDocuments.icon) {
        note.icon = fileDocuments.icon[0]
      }

      if (fileDocuments.background) {
        note.background = fileDocuments.background[0]
      }
    }

    return await note.save()
  }

  async getNotebyId(
    user: User,
    noteId: mongoose.Types.ObjectId,
  ): Promise<DocumentType<Note>> {
    const note = await this.notesModel.findOne({ createdBy: user, _id: noteId })

    if (!note) throw new NotFoundException('Note with specified id not found')

    return note
  }

  async getNotes(user: User): Promise<Note[]> {
    const notes = await this.notesModel
      .find({ createdBy: user })
      .populate(this.fieldsToPopulate)
    return notes
  }

  async deleteNote(user: User, noteId: mongoose.Types.ObjectId): Promise<void> {
    const note = await this.getNotebyId(user, noteId)
    const filesToRemove: Ref<File, mongoose.Types.ObjectId>[] = []

    if (note.icon) {
      filesToRemove.push(note.icon)
    }

    if (note.background) {
      filesToRemove.push(note.background)
    }

    this.filesService.removeFiles(filesToRemove)

    await note.deleteOne()
  }

  async updateNote(
    user: User,
    noteId: mongoose.Types.ObjectId,
    updateNoteDto: UpdateNoteDto,
    files?: NoteFiles,
  ): Promise<Note> {
    const note = await this.getNotebyId(user, noteId)
    await note.populate(this.fieldsToPopulate).execPopulate()

    if (files) {
      const fileDocuments = await this.filesService.createFilesWithFields<NoteFiles>(
        user,
        files,
      )

      if (fileDocuments.icon) {
        note.icon = fileDocuments.icon[0]
      }

      if (fileDocuments.background) {
        note.background = fileDocuments.background[0]
      }
    }

    Object.assign(note, updateNoteDto)

    return note.save()
  }
}
