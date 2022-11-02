import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { User } from '@prisma/client'

import { UserInsertOneRepository } from '../repository/insert-one-repository'
import { ValidateCPFService } from '../service/cpf-validate'
import { UserRegisterDto } from '../swagger-dto/register.dto'

@Injectable()
export class UserRegisterUsecase {
  private readonly logger = new Logger(UserRegisterUsecase.name)

  constructor(
    private repository: UserInsertOneRepository,
    private validateCpf: ValidateCPFService,
  ) {}

  async execute(body: UserRegisterDto): Promise<User> {
    const isCpfValid = this.validateCpf.execute(body.cpf)

    if (!isCpfValid) {
      throw new BadRequestException('Cpf invalid')
    }

    return this.repository.execute(body)
  }
}
