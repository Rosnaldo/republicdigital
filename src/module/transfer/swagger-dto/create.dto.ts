import { ApiProperty } from '@nestjs/swagger'
import { Transfer } from '@prisma/client'
import { IsDateString, IsNumberString, IsUUID } from 'class-validator'

import { TransactionValidateDto } from 'src/module/transaction/swagger-dto/create.dto'

type TransferOmit = Omit<Transfer, 'id' | 'createdAt'>
type TransferType = TransferOmit & TransactionValidateDto

export class TransferCreateDto implements TransferType {
  @ApiProperty({
    type: String,
  })
  @IsUUID()
  accountId: string

  @ApiProperty({
    type: String,
  })
  @IsUUID()
  recipientAccountId: string

  @ApiProperty({
    type: String,
  })
  @IsNumberString()
  amount: string

  @ApiProperty({
    type: Date,
  })
  @IsDateString()
  transferTime: Date

  @ApiProperty({
    type: String,
  })
  @IsNumberString()
  password: string
}
