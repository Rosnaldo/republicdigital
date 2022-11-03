import { Transfer } from '@prisma/client'

export const MockTransfer = (): Transfer => ({
  id: '8b61d335-4387-42f4-bdb8-ebb2e3cf970a',
  senderAccountId: 'c602b2c6-0088-42dd-9780-89e43635830d',
  recipientAccountId: '687068de-9780-4c12-9d85-bb9559c727a2',
  amount: '10000',
  transferTime: new Date(),
  createdAt: new Date(),
})
