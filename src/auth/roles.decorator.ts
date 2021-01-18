import { SetMetadata } from '@nestjs/common'
import { Role } from 'src/users/user.schema'

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles)
