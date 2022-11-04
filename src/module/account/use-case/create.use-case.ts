import { Injectable, Logger } from '@nestjs/common'
import { Account } from '@prisma/client'

import { BcryptService } from 'src/service/bcrypt.service'
import { AccountInsertOneRepository } from '../repository/insert-one-repository'

@Injectable()
export class AccountCreateUsecase {
  private readonly logger = new Logger(AccountCreateUsecase.name)

  constructor(
    private bcrypt: BcryptService,
    private accountInsertOneRepository: AccountInsertOneRepository,
  ) {}

  async execute({ userId, password }): Promise<Account> {
    const encodedPassword = await this.bcrypt.createHash(password)

    return this.accountInsertOneRepository.execute({
      user: {
        connect: {
          id: userId,
        }
      },
      password: encodedPassword
    },
    {
      user: true
    })
  }
}
