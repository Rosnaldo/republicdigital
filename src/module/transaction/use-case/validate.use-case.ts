import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { Account } from '@prisma/client'

import { AccountGetOneRepository } from 'src/module/account/repository/get-one-repository'
import { BcryptService } from 'src/service/bcrypt.service'
import { TransactionValidateDto } from '../swagger-dto/create.dto'


@Injectable()
export class TransactionValidateUsecase {
  private readonly logger = new Logger(TransactionValidateUsecase.name)

  constructor(
    private bcrypt: BcryptService,
    private accountGetOneRepository: AccountGetOneRepository,
  ) {}

  async execute(body: TransactionValidateDto): Promise<Account> {
    if (Number(body.amount) <= 0) {
      throw new BadRequestException('quantidade deve ser maior que zero')  
    }

    const account = await this.accountGetOneRepository.execute({
      id: body.accountId
    })

    if (account === null) {
      throw new BadRequestException('conta não existe')      
    }

    if (!await this.bcrypt.check(body.password, account.password)) {
      throw new BadRequestException('senha incorreta')  
    }

    return account
  }
}
