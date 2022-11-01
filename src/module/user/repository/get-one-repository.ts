import { Injectable } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { PrismaService } from 'src/service/prisma.service'

@Injectable()
export class UserGetOneRepository {
  constructor(private prisma: PrismaService) {}

  async execute(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {

    return this.prisma.user.findFirst({
      where,
    })
  }
}
