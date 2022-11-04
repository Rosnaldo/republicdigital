import { ApiTags } from '@nestjs/swagger'
import { BadRequestException, Body, Controller, Logger, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { Transaction } from '@prisma/client'

import { TransferCreateDto } from '../swagger-dto/create.dto'
import { AccountGetOneRepository } from 'src/module/account/repository/get-one-repository'
import { TransactionValidateUsecase } from 'src/module/transaction/use-case/validate.use-case'
import { TransferCreateUsecase } from '../use-case/create.use-case'

@ApiTags('transfer')
@UsePipes(ValidationPipe)
@Controller('transfer')
export class TransferCreateController {
  private readonly logger = new Logger(TransferCreateController.name)

  constructor(
    private transactionValidateUsecase: TransactionValidateUsecase,
    private accountGetOneRepository: AccountGetOneRepository,
    private transferCreateUsecase: TransferCreateUsecase,
  ) {}

  @Post('create')
  async execute(
    @Body() body: TransferCreateDto,
  ): Promise<Transaction> {
    const sender = await this.transactionValidateUsecase.execute(body)

    if (sender.credit < body.amount) {
      throw new BadRequestException('saldo insuficiente')  
    }

    const recipient = await this.accountGetOneRepository.execute({
      id: body.recipientAccountId
    })

    if (recipient === null) {
      throw new BadRequestException('recipientAccountId não existe')      
    }

    const { password, transferTime, ...bodyWithoutPassword } = body

    return this.transferCreateUsecase.execute(
      bodyWithoutPassword
    )
  }
}
