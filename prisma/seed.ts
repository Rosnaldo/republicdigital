import { Prisma, PrismaClient, User } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'AndreY Kenji Tsuzuki',
      cpf: '94795967253'
    }
  })

  const user2 = await prisma.user.create({
    data: {
      name: 'Dodo Aca',
      cpf: '94795967252',
    }
  })

  const account = await prisma.account.create(
    {
      data: {
        userId: user.id,
        password: '558833'
      }
    }
  )

  const account2 = await prisma.account.create(
    {
      data: {
        userId: user2.id,
        password: '420033'
      }
    }
  )

  const transfer = await prisma.transfer.create(
    {
      data: {
        recipientAccountId: account.id,
        senderAccountId: account2.id,
        amount: '1000',
        transferTime: new Date()
      }
    }
  )

}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
