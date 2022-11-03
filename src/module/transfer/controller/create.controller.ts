import { ApiTags } from '@nestjs/swagger'
import { BadRequestException, Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { Transfer } from '@prisma/client'

import { TransferCreateDto } from '../swagger-dto/create.dto'
import { TransferInsertOneRepository } from '../repository/insert-one-repository'
import { AccountGetOneRepository } from 'src/module/account/repository/get-one-repository'
import { BcryptService } from 'src/service/bcrypt.service'

@ApiTags('transfer')
@UsePipes(ValidationPipe)
@Controller('transfer')
export class TransferCreateController {
  constructor(
    private bcrypt: BcryptService,
    private accountGetOneRepository: AccountGetOneRepository,
    private transferInsertOneRepository: TransferInsertOneRepository,
  ) {}

  @Post('create')
  async execute(
    @Body() body: TransferCreateDto,
  ): Promise<Transfer> {
    if (Number(body.amount) <= 0) {
      throw new BadRequestException('quantidade deve ser maior que zero')  
    }

    const sender = await this.accountGetOneRepository.execute({
      userId: body.senderAccountId
    }, {
      user: true
    })

    if (sender === null) {
      throw new BadRequestException('senderAccountId não existe')      
    }

    if (!await this.bcrypt.check(body.password, sender.password)) {
      throw new BadRequestException('senha incorreta')  
    }

    if (sender.credit <= body.amount) {
      throw new BadRequestException('saldo insuficiente')  
    }

    const recipient = await this.accountGetOneRepository.execute({
      userId: body.recipientAccountId
    }, {
      user: true
    })

    if (recipient === null) {
      throw new BadRequestException('recipientAccountId não existe')      
    }

    const { password, ...bodyWithoutPassword } = body

    return this.transferInsertOneRepository.execute(
      bodyWithoutPassword
    )
  }
}
