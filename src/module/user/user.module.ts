import { Module } from '@nestjs/common'
import { UserGetOneRepository } from './repository/get-one-repository'
import { UserGetOneController } from './controller/get-one.controller'
import { UserInsertOneRepository } from './repository/insert-one-repository'
import { ValidateCPFService } from './service/cpf-validate'
import { UserRegisterController } from './controller/register.controller'
import { PrismaService } from 'src/service/prisma.service'
import { BcryptService } from 'src/service/bcrypt.service'

@Module({
  imports: [],
  controllers: [
    UserGetOneController,
    UserRegisterController,
  ],
  providers: [
    PrismaService,
    BcryptService,
    UserGetOneRepository,
    UserInsertOneRepository,
    ValidateCPFService,
  ],
  exports: []
})
export class UserModule {}
