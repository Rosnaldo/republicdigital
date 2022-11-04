import { Injectable, Logger } from '@nestjs/common'
import { Transaction } from '@prisma/client'

import { TransactionInsertOneRepository } from 'src/module/transaction/repository/insert-one-repository'
import { DepositInsertOneRepository } from '../repository/insert-one-repository'

type CreateDepositBodyType = Pick<Transaction, 'accountId' | 'amount'>

@Injectable()
export class DepositCreateUsecase {
  private readonly logger = new Logger(DepositCreateUsecase.name)

  constructor(
    private depositInsertOneRepository: DepositInsertOneRepository,
    private transactionInsertOneRepository: TransactionInsertOneRepository,
  ) {}

  async execute(body: CreateDepositBodyType): Promise<Transaction> {
    const deposit = await this.depositInsertOneRepository.execute()

    return this.transactionInsertOneRepository.execute(
      {
        account: {
          connect: {
            id: body.accountId,
          },
        },
        amount: body.amount,
        entity: deposit.id,
        type: 'deposit',
      }
    )
  }
}
