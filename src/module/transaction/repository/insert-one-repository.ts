import { Injectable } from '@nestjs/common'
import { Prisma, Transaction } from '@prisma/client'
import { PrismaService } from 'src/service/prisma.service'

@Injectable()
export class TransactionInsertOneRepository {
  constructor(private prisma: PrismaService) {}

  async execute(
    data: Prisma.TransactionCreateInput,
  ): Promise<Transaction> {
    return this.prisma.transaction.create({
      data
    })
  }
}
