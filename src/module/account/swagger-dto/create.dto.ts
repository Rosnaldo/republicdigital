import { ApiProperty } from '@nestjs/swagger'
import { User } from '@prisma/client'
import { IsNumberString, Length } from 'class-validator'

export class AccountCreateDto implements Omit<User, 'id' | 'createdAt'> {
  @ApiProperty({
    type: String,
  })
  name: string

  @ApiProperty({
    type: String,
  })
  @Length(11, 11)
  @IsNumberString()
  cpf: string

  @ApiProperty({
    type: String,
  })
  @Length(6, 6)
  @IsNumberString()
  password: string
}
