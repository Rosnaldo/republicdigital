import { ApiProperty } from '@nestjs/swagger'
import { Transfer } from '@prisma/client'
import { IsDateString, IsNumberString, IsUUID } from 'class-validator'

export class TransferCreateDto implements Omit<Transfer, 'id' | 'createdAt'> {
  @ApiProperty({
    type: String,
  })
  @IsUUID()
  senderAccountId: string

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
    type: String,
  })
  @IsDateString()
  transferTime: Date

  @ApiProperty({
    type: String,
  })
  @IsNumberString()
  password: string
}
