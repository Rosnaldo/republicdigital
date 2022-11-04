import { ApiTags } from '@nestjs/swagger'
import { Body, Controller, Post, UseFilters, UsePipes, ValidationPipe, Logger } from '@nestjs/common'
import { Account } from '@prisma/client'

import { AccountCreateDto } from '../swagger-dto/create.dto'
import { UserRegisterUsecase } from 'src/module/user/use-case/register.use-case'
import { PrismaExceptionFilter } from '../exception-filter/prisma-exception.filter'
import { AccountCreateUsecase } from '../use-case/create.use-case'

@ApiTags('account')
@UsePipes(ValidationPipe)
@UseFilters(new PrismaExceptionFilter())
@Controller('account')
export class AccountCreateController {
  private readonly logger = new Logger(AccountCreateController.name)
  
  constructor(
    private userRegisterUsecase: UserRegisterUsecase,
    private accountCreateUsecase: AccountCreateUsecase,
  ) {}

  @Post('create')
  async execute(
    @Body() body: AccountCreateDto,
  ): Promise<Account> {
    const { password, ...bodyWithoutPassword } = body

    const user = await this.userRegisterUsecase.execute(bodyWithoutPassword)

    return this.accountCreateUsecase.execute(
      {
        password: password,
        userId: user.id,
      }
    )
  }
}
