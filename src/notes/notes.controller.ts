import { Body, Controller, Get, Post } from '@nestjs/common'
import { CreateNoteDto } from './notes.dto'
import { Note } from './notes.schema'
import { NotesService } from './notes.service'

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  createNote(@Body() createNoteDto: CreateNoteDto): Promise<Note> {
    return this.notesService.createNote(createNoteDto)
  }

  @Get()
  getNotes(): Promise<Note[]> {
    return this.notesService.getNotes()
  }
}
