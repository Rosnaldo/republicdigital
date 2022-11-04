import { Injectable } from '@nestjs/common'
import { Deposit } from '@prisma/client'
import { PrismaService } from 'src/service/prisma.service'

@Injectable()
export class DepositInsertOneRepository {
  constructor(private prisma: PrismaService) {}

  async execute(): Promise<Deposit> {
    return this.prisma.deposit.create({
      data: {}
    })
  }
}
