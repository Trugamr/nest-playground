import { ConfigService } from '@nestjs/config'
import {
  TypegooseConnectionOptions,
  TypegooseModuleOptions,
} from 'nestjs-typegoose'

const options: TypegooseConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
}

const createTypegooseOptions = async (
  configService: ConfigService,
): Promise<TypegooseModuleOptions> => {
  return {
    uri: configService.get('MONGODB_URI'),
    ...options,
  }
}

export default createTypegooseOptions
