import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { CreateNoteDto, UpdateNoteDto } from './notes.dto'
import { Note } from './note.schema'
import { NotesService } from './notes.service'
import { GetUser } from 'src/auth/get-user.decorater'
import { User } from 'src/users/user.schema'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { ParseObjectIdPipe } from 'src/utils/parse-objectid.pipe'
import * as mongoose from 'mongoose'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { NoteFiles } from './notes'

@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'icon', maxCount: 1 },
      { name: 'background', maxCount: 1 },
    ]),
  )
  createNote(
    @GetUser() user: User,
    @UploadedFiles() files: NoteFiles,
    @Body() createNoteDto: CreateNoteDto,
  ): Promise<Note> {
    return this.notesService.createNote(user, createNoteDto, files)
  }

  @Get()
  getNotes(@GetUser() user: User): Promise<Note[]> {
    return this.notesService.getNotes(user)
  }

  @Delete(':noteId')
  deleteNote(
    @GetUser() user: User,
    @Param('noteId', ParseObjectIdPipe) noteId: mongoose.Types.ObjectId,
  ): Promise<void> {
    return this.notesService.deleteNote(user, noteId)
  }

  @Patch(':noteId')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'icon', maxCount: 1 },
      { name: 'background', maxCount: 1 },
    ]),
  )
  updateNote(
    @GetUser() user: User,
    @Param('noteId', ParseObjectIdPipe) noteId: mongoose.Types.ObjectId,
    @Body() updateNoteDto: UpdateNoteDto,
    @UploadedFiles() files: NoteFiles,
  ): Promise<Note> {
    return this.notesService.updateNote(user, noteId, updateNoteDto, files)
  }
}
