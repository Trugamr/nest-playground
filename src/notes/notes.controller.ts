import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { CreateNoteDto } from './notes.dto'
import { Note } from './note.schema'
import { NotesService } from './notes.service'
import { GetUser } from 'src/auth/get-user.decorater'
import { User } from 'src/users/user.schema'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'

@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  createNote(
    @GetUser() user: User,
    @Body() createNoteDto: CreateNoteDto,
  ): Promise<Note> {
    return this.notesService.createNote(user, createNoteDto)
  }

  @Get()
  getNotes(@GetUser() user: User): Promise<Note[]> {
    console.log('USER', user)
    return this.notesService.getNotes(user)
  }
}
