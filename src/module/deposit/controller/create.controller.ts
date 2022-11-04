import { ApiTags } from '@nestjs/swagger'
import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { Deposit } from '@prisma/client'

import { DepositCreateDto } from '../swagger-dto/validate.dto'
import { TransactionValidateUsecase } from 'src/module/transaction/use-case/validate.use-case'
import { DepositCreateUsecase } from '../use-case/create.use-case'
import { AccountUpdateOneRepository } from 'src/module/account/repository/update-one-repository'

@ApiTags('deposit')
@UsePipes(ValidationPipe)
@Controller('deposit')
export class DepositCreateController {
  constructor(
    private transactionValidateUsecase: TransactionValidateUsecase,
    private depositCreateUsecase: DepositCreateUsecase,
    private accountUpdateOneRepository: AccountUpdateOneRepository,
  ) {}

  @Post('create')
  async execute(
    @Body() body: DepositCreateDto,
  ): Promise<Deposit> {
    const account = await this.transactionValidateUsecase.execute(body)

    const { password, ...bodyWithoutPassword } = body

    const deposit = await this.depositCreateUsecase.execute(
      {
        ...bodyWithoutPassword,
        transferTime: new Date(bodyWithoutPassword.transferTime)
      }
    )

    const newAmout = String(Number(account.credit) + Number(deposit.amount))
    await this.accountUpdateOneRepository.execute({
      id: account.id
    }, {
      credit: newAmout
    })
    
    return deposit
  }
}
