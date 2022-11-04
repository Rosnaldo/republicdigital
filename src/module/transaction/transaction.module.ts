import { Module } from '@nestjs/common'

import { BcryptService } from 'src/service/bcrypt.service'
import { PrismaService } from 'src/service/prisma.service'
import { AccountModule } from '../account/account.module'
import { TransactionInsertOneRepository } from './repository/insert-one-repository'
import { TransactionValidateUsecase } from './use-case/validate.use-case'

@Module({
  imports: [AccountModule],
  controllers: [],
  providers: [
    PrismaService,
    BcryptService,
    TransactionValidateUsecase,
    TransactionInsertOneRepository,
  ],
  exports: [TransactionValidateUsecase, TransactionInsertOneRepository]
})
export class TransactionModule {}
