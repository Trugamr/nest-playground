import { IsOptional, IsString } from 'class-validator'

export class CreateNoteDto {
  @IsString()
  readonly title: string

  @IsOptional()
  @IsString()
  readonly body?: string
}
