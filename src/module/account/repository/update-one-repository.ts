import { Injectable } from '@nestjs/common'
import { Account, Prisma } from '@prisma/client'
import { PrismaService } from 'src/service/prisma.service'

@Injectable()
export class AccountUpdateOneRepository {
  constructor(private prisma: PrismaService) {}

  async execute(
    where: Prisma.AccountWhereUniqueInput,
    data: Prisma.AccountUpdateInput = {},
  ): Promise<Account | Account> {
    return this.prisma.account.update({
      where,
      data,
    })
  }
}
