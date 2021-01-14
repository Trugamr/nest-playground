import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserWithoutPassword } from 'src/users/user'

export const GetUser = createParamDecorator(
  (data, context: ExecutionContext): UserWithoutPassword => {
    const req = context.switchToHttp().getRequest()
    return req.user
  },
)
