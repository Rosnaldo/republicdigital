import { Test, TestingModule } from '@nestjs/testing'
import { Logger } from '@nestjs/common'
import { Account } from '@prisma/client'

import { PrismaService } from 'src/service/prisma.service'
import { MockAccountWithUser } from 'src/mock/account'
import { TransferCreateUsecase } from 'src/module/transfer/use-case/create.use-case'
import { TransferInsertOneRepository } from 'src/module/transfer/repository/insert-one-repository'
import { TransactionInsertOneRepository } from 'src/module/transaction/repository/insert-one-repository'
import { MockTransfer } from 'src/mock/transfer'


let usecase
const mockTransferInsertOneRepository = {
  execute: jest.fn(),
}

const mockTransactionInsertOneRepository = {
  execute: jest.fn(),
}

const mockTransfer = MockTransfer()


const Sut = (account: Account) => {
  const spyTransferInsertOneRepository = jest.spyOn(mockTransferInsertOneRepository, 'execute')
    .mockResolvedValue(mockTransfer)

  const spyTransactionInsertOneRepository = jest.spyOn(mockTransactionInsertOneRepository, 'execute')
    .mockResolvedValue(account)
  
  return { spyTransferInsertOneRepository, spyTransactionInsertOneRepository }
}

describe('TransferCreateUsecase', () => {
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransferCreateUsecase],
      providers: [TransactionInsertOneRepository, TransferInsertOneRepository, PrismaService],
    })
      .setLogger(new Logger())
      .overrideProvider(TransferInsertOneRepository)
      .useValue(mockTransferInsertOneRepository)
      .overrideProvider(TransactionInsertOneRepository)
      .useValue(mockTransactionInsertOneRepository)
      .compile()

      usecase = module.get<TransferCreateUsecase>(TransferCreateUsecase)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Usecase should be defined', function () {
    expect(usecase).toBeDefined()
  })

  it('Should call AccountCreateUsecase with right param', async function () {
    const mockAccountWithUser = MockAccountWithUser()

    const body = {
      recipientAccountId: '857ef810-d6fa-4203-b4ad-84008fb72095',
      accountId: '5d666862-01ad-40b5-b9ac-4332a8dd4191',
      amount: '20000',
    }

    const { spyTransferInsertOneRepository, spyTransactionInsertOneRepository } = Sut(mockAccountWithUser)
  
    const response = await usecase.execute(body)
  
    expect(spyTransferInsertOneRepository).toHaveBeenCalledWith({
      recipientAccountId: '857ef810-d6fa-4203-b4ad-84008fb72095',
    })
    expect(spyTransactionInsertOneRepository).toHaveBeenCalledWith({
      account: {
        connect: {
          id: '5d666862-01ad-40b5-b9ac-4332a8dd4191',
        },
      },
      amount: '20000',
      entity: '8b61d335-4387-42f4-bdb8-ebb2e3cf970a',
      type: 'transfer',
    })
    expect(response).toEqual(mockAccountWithUser)
  })
})
