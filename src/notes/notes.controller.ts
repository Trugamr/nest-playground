import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
import { FileInterceptor } from '@nestjs/platform-express'

@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  createNote(
    @GetUser() user: User,
    @Body() createNoteDto: CreateNoteDto,
  ): Promise<Note> {
    return this.notesService.createNote(user, createNoteDto)
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
  updateNote(
    @GetUser() user: User,
    @Param('noteId', ParseObjectIdPipe) noteId: mongoose.Types.ObjectId,
    @Body() updateNoteDto: UpdateNoteDto,
  ): Promise<Note> {
    return this.notesService.updateNote(user, noteId, updateNoteDto)
  }
}
