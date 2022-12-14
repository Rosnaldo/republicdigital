import { Module } from '@nestjs/common'

import { PrismaService } from 'src/service/prisma.service'
import { AccountModule } from '../account/account.module'
import { TransactionModule } from '../transaction/transaction.module'
import { DepositCreateController } from './controller/create.controller'
import { DepositInsertOneRepository } from './repository/insert-one-repository'
import { DepositCreateUsecase } from './use-case/create.use-case'

@Module({
  imports: [TransactionModule, AccountModule],
  controllers: [DepositCreateController],
  providers: [
    PrismaService,
    DepositCreateUsecase,
    DepositInsertOneRepository,
  ],
  exports: []
})
export class DepositModule {}
