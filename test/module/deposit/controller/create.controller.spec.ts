import { Test, TestingModule } from '@nestjs/testing'
import { Logger } from '@nestjs/common'

import { PrismaService } from 'src/service/prisma.service'
import { MockTransactionDeposit } from 'src/mock/transaction'
import { TransactionValidateUsecase } from 'src/module/transaction/use-case/validate.use-case'
import { DepositCreateController } from 'src/module/deposit/controller/create.controller'
import { DepositCreateUsecase } from 'src/module/deposit/use-case/create.use-case'
import { AccountUpdateOneRepository } from 'src/module/account/repository/update-one-repository'
import { MockAccount } from 'src/mock/account'


let controller
const mockDepositCreateUsecase = {
  execute: jest.fn(),
}

const mockTransactionValidateUsecase = {
  execute: jest.fn(),
}

const mockAccountUpdateOneRepository = {
  execute: jest.fn(),
}

const mockTransaction = MockTransactionDeposit()
const mockAccount = MockAccount()

const Sut = () => {
  const spyTransactionValidateUsecase = jest.spyOn(mockTransactionValidateUsecase, 'execute')
    .mockResolvedValue(mockAccount)

  const spyDepositCreateUsecase = jest.spyOn(mockDepositCreateUsecase, 'execute')
    .mockResolvedValue(mockTransaction)

  const spyAccountUpdateOneRepository = jest.spyOn(mockAccountUpdateOneRepository, 'execute')
    .mockResolvedValue(null)

  return { spyTransactionValidateUsecase, spyDepositCreateUsecase, spyAccountUpdateOneRepository }
}

describe('DepositCreateController', () => {
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepositCreateController],
      providers: [
        TransactionValidateUsecase,
        DepositCreateUsecase,
        AccountUpdateOneRepository,
        PrismaService,
      ],
    })
      .setLogger(new Logger())
      .overrideProvider(TransactionValidateUsecase)
      .useValue(mockTransactionValidateUsecase)
      .overrideProvider(DepositCreateUsecase)
      .useValue(mockDepositCreateUsecase)
      .overrideProvider(AccountUpdateOneRepository)
      .useValue(mockAccountUpdateOneRepository)
      .compile()

    controller = module.get<DepositCreateController>(DepositCreateController)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Controller should be defined', function () {
    expect(controller).toBeDefined()
  })

  const body = {
    accountId: '8b61d335-4387-42f4-bdb8-ebb2e3cf970a',
    amount: '20000',
    transferTime: '2022-11-03T16:53:41.756Z',
    password: '553276',
  }

  it('Should call DepositCreateController with right param', async function () {
    const {
      spyTransactionValidateUsecase,
      spyDepositCreateUsecase,
      spyAccountUpdateOneRepository,
    } = Sut()
  
    const response = await controller.execute(body)
  
    expect(spyTransactionValidateUsecase).toHaveBeenCalledWith(body)
    expect(spyDepositCreateUsecase).toHaveBeenCalledWith({
      accountId: '8b61d335-4387-42f4-bdb8-ebb2e3cf970a',
      amount: '20000',
      transferTime: new Date('2022-11-03T16:53:41.756Z')
    })
    expect(spyAccountUpdateOneRepository).toHaveBeenCalledWith({
      id: '8b61d335-4387-42f4-bdb8-ebb2e3cf970a'
    }, {
      credit: '2020000'
    })

    expect(response).toEqual(mockTransaction)
  })
})
