import { Module } from '@nestjs/common'

import { BcryptService } from 'src/service/bcrypt.service'
import { PrismaService } from 'src/service/prisma.service'
import { AccountModule } from '../account/account.module'
import { TransferCreateController } from './controller/create.controller'
import { TransferInsertOneRepository } from './repository/insert-one-repository'

@Module({
  imports: [AccountModule],
  controllers: [TransferCreateController],
  providers: [
    PrismaService,
    TransferInsertOneRepository,
    BcryptService,
  ],
  exports: []
})
export class TransferModule {}
