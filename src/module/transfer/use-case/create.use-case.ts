import { Injectable, Logger } from '@nestjs/common'
import { Transaction, Transfer } from '@prisma/client'

import { TransactionInsertOneRepository } from 'src/module/transaction/repository/insert-one-repository'
import { TransferInsertOneRepository } from '../repository/insert-one-repository'

type CreateTransferBodyType =
  Pick<Transfer, 'recipientAccountId'>
  & Pick<Transaction, 'accountId' | 'amount' | 'transferTime'>

@Injectable()
export class TransferCreateUsecase {
  private readonly logger = new Logger(TransferCreateUsecase.name)

  constructor(
    private transferInsertOneRepository: TransferInsertOneRepository,
    private transactionInsertOneRepository: TransactionInsertOneRepository,
  ) {}

  async execute(body: CreateTransferBodyType): Promise<Transaction> {
    const transfer = await this.transferInsertOneRepository.execute({
      recipientAccountId: body.recipientAccountId,
    })

    return this.transactionInsertOneRepository.execute(
      {
        account: {
          connect: {
            id: body.accountId,
          },
        },
        amount: body.amount,
        entity: transfer.id,
        type: 'transfer',
        transferTime: body.transferTime,
      }
    )
  }
}
