import { Transaction } from '@prisma/client'

export const MockTransactionTranfer = (): Transaction => ({
  id: '8b61d335-4387-42f4-bdb8-ebb2e3cf970a',
  accountId: '8b61d335-4387-42f4-bdb8-ebb2e3cf970a',
  amount: '20000',
  type: 'transfer',
  entity: '8b61d335-4387-42f4-bdb8-ebb2e3cf970a',
  createdAt: new Date(),
})


export const MockTransactionDeposit = (): Transaction => ({
  id: '8b61d335-4387-42f4-bdb8-ebb2e3cf970a',
  accountId: '8b61d335-4387-42f4-bdb8-ebb2e3cf970a',
  amount: '20000',
  type: 'deposit',
  entity: '8b61d335-4387-42f4-bdb8-ebb2e3cf970a',
  createdAt: new Date(),
})
