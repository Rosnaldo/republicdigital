import { ApiProperty } from '@nestjs/swagger'
import { Transaction, Account } from '@prisma/client'
import { IsNumberString, IsUUID } from 'class-validator'

type TransactionOmit = Omit<Transaction, 'id' | 'type' | 'entity' | 'createdAt'>
type AccountPassword = Pick<Account, 'password'>

type TransferType = TransactionOmit & AccountPassword

export class TransactionValidateDto implements TransferType {
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
  @IsNumberString()
  password: string
}
