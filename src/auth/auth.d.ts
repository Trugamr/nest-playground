import { UserWithoutPassword } from 'src/users/user'

declare interface SignInResult {
  access_token: string
  user: UserWithoutPassword
}
