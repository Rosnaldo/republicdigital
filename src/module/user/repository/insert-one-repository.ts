import { Injectable } from '@nestjs/common'
import { User, Prisma } from '@prisma/client'
import { PrismaService } from 'src/service/prisma.service'

@Injectable()
export class UserInsertOneRepository {
  constructor(private prisma: PrismaService) {}

  async execute(
    data: Prisma.UserCreateInput,
  ): Promise<User> {
    return this.prisma.user.create({
      data,
    })
  }
}
