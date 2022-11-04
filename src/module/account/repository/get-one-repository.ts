import { Injectable } from '@nestjs/common'
import { Account, Prisma } from '@prisma/client'
import { PrismaService } from 'src/service/prisma.service'

@Injectable()
export class AccountGetOneRepository {
  constructor(private prisma: PrismaService) {}

  async execute(
    where: Prisma.AccountWhereUniqueInput,
    include: Prisma.AccountInclude = { user: true },
  ): Promise<Account | null> {

    return this.prisma.account.findFirst({
      where,
      include,
    })
  }
}
