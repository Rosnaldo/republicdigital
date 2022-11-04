import { ApiTags } from '@nestjs/swagger'
import { BadRequestException, Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { Deposit } from '@prisma/client'

import { AccountGetOneRepository } from 'src/module/account/repository/get-one-repository'
import { BcryptService } from 'src/service/bcrypt.service'
import { DepositCreateDto } from '../swagger-dto/validate.dto'
import { DepositInsertOneRepository } from '../repository/insert-one-repository'
import { TransactionValidateUsecase } from 'src/module/transaction/use-case/validate.use-case'
import { DepositCreateUsecase } from '../use-case/create.use-case'

@ApiTags('deposit')
@UsePipes(ValidationPipe)
@Controller('deposit')
export class DepositCreateController {
  constructor(
    private transactionValidateUsecase: TransactionValidateUsecase,
    private depositCreateUsecase: DepositCreateUsecase,
  ) {}

  @Post('create')
  async execute(
    @Body() body: DepositCreateDto,
  ): Promise<Deposit> {
    await this.transactionValidateUsecase.execute(body)

    const { password, ...bodyWithoutPassword } = body

    const deposit = await this.depositCreateUsecase.execute(
      bodyWithoutPassword
    )
    
    return deposit
  }
}
