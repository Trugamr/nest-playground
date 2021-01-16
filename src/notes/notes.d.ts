type NoteFileFields = 'icon' | 'background'

declare type NoteFiles = {
  [key in NoteFileFields]?: [MulterFile]
}
