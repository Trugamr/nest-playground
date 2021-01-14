import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces'
import validate from './validate'

const configModuleOptions: ConfigModuleOptions = {
  envFilePath: ['.env.development', '.env.production'],
  isGlobal: true,
  validate,
}

export default configModuleOptions
