import { Injectable } from '@nestjs/common'
import { Prisma, Transfer } from '@prisma/client'
import { PrismaService } from 'src/service/prisma.service'

@Injectable()
export class TransferInsertOneRepository {
  constructor(private prisma: PrismaService) {}

  async execute(
    data: Prisma.TransferCreateInput,
  ): Promise<Transfer> {
    return this.prisma.transfer.create({
      data,
    })
  }
}
