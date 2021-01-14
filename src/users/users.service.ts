import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ReturnModelType } from '@typegoose/typegoose'
import { InjectModel } from 'nestjs-typegoose'
import { MongoError } from 'src/utils/mongo.errors'
import { User } from './user.schema'
import { CreateUserDto } from './users.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto)

    try {
      await user.save()
    } catch (error) {
      if (error.code === MongoError.DuplicateKey) {
        throw new BadRequestException(
          'User with this email or username already exists',
        )
      } else {
        throw new BadRequestException('Something went wrong, try again later')
      }
    }

    return user
  }

  async getByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username }).lean()

    // If user with specified username doesn't exist throw error
    if (!user)
      throw new NotFoundException('User with specified username not found')

    return user
  }
}
