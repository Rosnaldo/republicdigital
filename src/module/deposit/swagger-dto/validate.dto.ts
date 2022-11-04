import { ApiProperty } from '@nestjs/swagger'
import { Deposit } from '@prisma/client'
import { IsDateString, IsNumberString, IsUUID } from 'class-validator'
import { TransactionValidateDto } from 'src/module/transaction/swagger-dto/create.dto'

type DepositOmit = Omit<Deposit, 'id' | 'createdAt'>

type DepositType = DepositOmit & TransactionValidateDto

export class DepositCreateDto implements DepositType {
  @ApiProperty({
    type: String,
  })
  @IsUUID()
  accountId: string

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
