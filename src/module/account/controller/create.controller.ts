import { ApiTags } from '@nestjs/swagger'
import { Body, Controller, Post, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common'
import { Account } from '@prisma/client'

import { AccountInsertOneRepository } from '../repository/insert-one-repository'
import { AccountCreateDto } from '../swagger-dto/create.dto'
import { UserRegisterUsecase } from 'src/module/user/use-case/register.use-case'
import { PrismaExceptionFilter } from '../exception-filter/prisma-exception.filter'
import { BcryptService } from 'src/service/bcrypt.service'

@ApiTags('account')
@UsePipes(ValidationPipe)
@UseFilters(new PrismaExceptionFilter())
@Controller('account')
export class AccountCreateController {
  constructor(
    private bcrypt: BcryptService,
    private userRegisterUsecase: UserRegisterUsecase,
    private accountInsertOneRepository: AccountInsertOneRepository,
  ) {}

  @Post('create')
  async execute(
    @Body() body: AccountCreateDto,
  ): Promise<Account> {
    const user = await this.userRegisterUsecase.execute(body)

    const encodedPassword = await this.bcrypt.createHash(body.password)

    return this.accountInsertOneRepository.execute({
      user: {
        connect: {
          id: user.id,
        }
      },
      password: encodedPassword
    },
    {
      user: true
    })
  }
}
