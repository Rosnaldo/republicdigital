import { ApiTags } from '@nestjs/swagger'
import { BadRequestException, Body, Controller, Post, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common'
import { BcryptService } from 'src/service/bcrypt.service'
import { PrismaExceptionFilter } from '../exception-filter/prisma-exception.filter'
import { UserInsertOneRepository } from '../repository/insert-one-repository'
import { ValidateCPFService } from '../service/cpf-validate'
import { UserRegisterDto } from '../swagger-dto/register.dto'

@ApiTags('user')
@UsePipes(ValidationPipe)
@Controller('user')
@UseFilters(new PrismaExceptionFilter())
export class UserRegisterController {
  constructor(
    private repository: UserInsertOneRepository,
    private validateCpf: ValidateCPFService,
    private bcrypt: BcryptService,
  ) {}

  @Post('register')
  async execute(
    @Body() body: UserRegisterDto,
  ): Promise<void> {
    const isCpfValid = this.validateCpf.execute(body.cpf)

    if (!isCpfValid) {
      throw new BadRequestException('Cpf invalid')
    }

    const encodedPassword = await this.bcrypt.createHash(body.password)

    this.repository.execute({
      ...body,
      password: encodedPassword
    })
  }
}
