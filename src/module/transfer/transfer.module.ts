import { Module } from '@nestjs/common'

import { PrismaService } from 'src/service/prisma.service'
import { AccountModule } from '../account/account.module'
import { TransactionModule } from '../transaction/transaction.module'
import { TransferCreateController } from './controller/create.controller'
import { TransferInsertOneRepository } from './repository/insert-one-repository'
import { TransferCreateUsecase } from './use-case/create.use-case'

@Module({
  imports: [AccountModule, TransactionModule],
  controllers: [TransferCreateController],
  providers: [
    PrismaService,
    TransferInsertOneRepository,
    TransferCreateUsecase,
  ],
  exports: []
})
export class TransferModule {}
