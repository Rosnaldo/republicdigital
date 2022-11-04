import { Test, TestingModule } from '@nestjs/testing'
import { Logger } from '@nestjs/common'
import { Account } from '@prisma/client'

import { PrismaService } from 'src/service/prisma.service'
import { MockAccountWithUser } from 'src/mock/account'
import { TransferCreateUsecase } from 'src/module/transfer/use-case/create.use-case'
import { TransferInsertOneRepository } from 'src/module/transfer/repository/insert-one-repository'
import { TransactionInsertOneRepository } from 'src/module/transaction/repository/insert-one-repository'
import { MockTransfer } from 'src/mock/transfer'
import { DepositCreateUsecase } from 'src/module/deposit/use-case/create.use-case'
import { DepositInsertOneRepository } from 'src/module/deposit/repository/insert-one-repository'
import { MockDeposit } from 'src/mock/deposit'


let usecase
const mockDepositInsertOneRepository = {
  execute: jest.fn(),
}

const mockTransactionInsertOneRepository = {
  execute: jest.fn(),
}

const mockDeposit = MockDeposit()


const Sut = (account: Account) => {
  const spyDepositInsertOneRepository = jest.spyOn(mockDepositInsertOneRepository, 'execute')
    .mockResolvedValue(mockDeposit)

  const spyTransactionInsertOneRepository = jest.spyOn(mockTransactionInsertOneRepository, 'execute')
    .mockResolvedValue(account)
  
  return { spyDepositInsertOneRepository, spyTransactionInsertOneRepository }
}

describe('DepositCreateUsecase', () => {
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepositCreateUsecase],
      providers: [DepositInsertOneRepository, TransactionInsertOneRepository, PrismaService],
    })
      .setLogger(new Logger())
      .overrideProvider(DepositInsertOneRepository)
      .useValue(mockDepositInsertOneRepository)
      .overrideProvider(TransactionInsertOneRepository)
      .useValue(mockTransactionInsertOneRepository)
      .compile()

      usecase = module.get<DepositCreateUsecase>(DepositCreateUsecase)
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
      accountId: '5d666862-01ad-40b5-b9ac-4332a8dd4191',
      amount: '20000',
    }

    const { spyDepositInsertOneRepository, spyTransactionInsertOneRepository } = Sut(mockAccountWithUser)
  
    const response = await usecase.execute(body)
  
    expect(spyDepositInsertOneRepository).toHaveBeenCalledWith()
    expect(spyTransactionInsertOneRepository).toHaveBeenCalledWith({
      account: {
        connect: {
          id: '5d666862-01ad-40b5-b9ac-4332a8dd4191',
        },
      },
      amount: '20000',
      entity: '8b61d335-4387-42f4-bdb8-ebb2e3cf970a',
      type: 'deposit',
    })
    expect(response).toEqual(mockAccountWithUser)
  })
})
