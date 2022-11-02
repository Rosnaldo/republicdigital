import { Account, Prisma } from '@prisma/client'
import { MockUser } from './user'

export const MockAccount = (): Account => ({
  id: '8b61d335-4387-42f4-bdb8-ebb2e3cf970a',
  credit: '1200',
  password: '447822',
  userId: '5d666862-01ad-40b5-b9ac-4332a8dd4191',
  createdAt: new Date(),
})

export type AccountWithUser = Prisma.AccountGetPayload<{
  include: {
    user: true
  }
}>

export const MockAccountWithUser = (): AccountWithUser => ({
  id: '8b61d335-4387-42f4-bdb8-ebb2e3cf970a',
  credit: '1200',
  password: '447822',
  userId: '5d666862-01ad-40b5-b9ac-4332a8dd4191',
  createdAt: new Date(),
  user: MockUser()
})
