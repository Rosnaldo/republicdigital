import { ApiProperty } from '@nestjs/swagger'
import { User } from '@prisma/client'
import { Length, IsNumberString } from 'class-validator'

export class UserRegisterDto implements Omit<User, 'id' | 'createdAt'> {
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
  password: string
}
