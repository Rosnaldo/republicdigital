import { Injectable } from '@nestjs/common'
import { Account, Prisma } from '@prisma/client'
import { PrismaService } from 'src/service/prisma.service'

@Injectable()
export class AccountInsertOneRepository {
  constructor(private prisma: PrismaService) {}

  async execute(
    data: Prisma.AccountCreateInput,
    include: Prisma.AccountInclude,
  ): Promise<Account> {
    return this.prisma.account.create({
      data,
      include,
    })
  }
}
