import { ApiTags } from '@nestjs/swagger'
import { Controller, Get, Param } from '@nestjs/common'
import { User } from '@prisma/client'
import { UserGetOneRepository } from '../repository/get-one-repository'

@ApiTags('user')
@Controller('user')
export class UserGetOneController {
  constructor(private repository: UserGetOneRepository) {}

  @Get('get-one/:id')
  execute(
    @Param('id') id: string,
  ): Promise<User | null> {
    return this.repository.execute({
      id,
    })
  }
}
