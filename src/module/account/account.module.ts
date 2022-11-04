import { Module } from '@nestjs/common'
import { PrismaService } from 'src/service/prisma.service'

import { UserModule } from '../user/user.module'
import { UserRegisterUsecase } from '../user/use-case/register.use-case'
import { AccountCreateController } from './controller/create.controller'
import { AccountInsertOneRepository } from './repository/insert-one-repository'
import { BcryptService } from 'src/service/bcrypt.service'
import { AccountGetOneRepository } from './repository/get-one-repository'
import { AccountCreateUsecase } from './use-case/create.use-case'

@Module({
  imports: [UserModule],
  controllers: [
    AccountCreateController,
  ],
  providers: [
    PrismaService,
    AccountInsertOneRepository,
    UserRegisterUsecase,
    BcryptService,
    AccountGetOneRepository,
    AccountCreateUsecase,
  ],
  exports: [AccountGetOneRepository]
})
export class AccountModule {}
