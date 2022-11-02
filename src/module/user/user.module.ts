import { Module } from '@nestjs/common'
import { PrismaService } from 'src/service/prisma.service'

import { UserGetOneRepository } from './repository/get-one-repository'
import { UserInsertOneRepository } from './repository/insert-one-repository'
import { ValidateCPFService } from './service/cpf-validate'
import { UserRegisterUsecase } from './use-case/register.use-case'

@Module({
  imports: [],
  controllers: [],
  providers: [
    PrismaService,
    UserRegisterUsecase,
    UserGetOneRepository,
    UserInsertOneRepository,
    ValidateCPFService,
  ],
  exports: [
    UserRegisterUsecase,
    UserInsertOneRepository,
    ValidateCPFService,
  ]
})
export class UserModule {}
