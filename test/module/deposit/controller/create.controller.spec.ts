import { Test, TestingModule } from '@nestjs/testing'
import { Logger } from '@nestjs/common'

import { PrismaService } from 'src/service/prisma.service'
import { MockTransactionDeposit, MockTransactionTranfer } from 'src/mock/transaction'
import { TransactionValidateUsecase } from 'src/module/transaction/use-case/validate.use-case'
import { DepositCreateController } from 'src/module/deposit/controller/create.controller'
import { DepositCreateUsecase } from 'src/module/deposit/use-case/create.use-case'


let controller
const mockDepositCreateUsecase = {
  execute: jest.fn(),
}

const mockTransactionValidateUsecase = {
  execute: jest.fn(),
}

const mockTransaction = MockTransactionDeposit()

const Sut = () => {
  const spyTransactionValidateUsecase = jest.spyOn(mockTransactionValidateUsecase, 'execute')
    .mockResolvedValue(mockTransaction)

  const spyDepositCreateUsecase = jest.spyOn(mockDepositCreateUsecase, 'execute')
    .mockResolvedValue(mockTransaction)

  return { spyTransactionValidateUsecase, spyDepositCreateUsecase }
}

describe('DepositCreateController', () => {
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepositCreateController],
      providers: [
        TransactionValidateUsecase,
        DepositCreateUsecase,
        PrismaService,
      ],
    })
      .setLogger(new Logger())
      .overrideProvider(TransactionValidateUsecase)
      .useValue(mockTransactionValidateUsecase)
      .overrideProvider(DepositCreateUsecase)
      .useValue(mockDepositCreateUsecase)
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
    amount: '10000',
    transferTime: '2022-11-03T16:53:41.756Z',
    password: '553276',
  }

  it('Should call DepositCreateController with right param', async function () {
    const {
      spyTransactionValidateUsecase,
      spyDepositCreateUsecase,
    } = Sut()
  
    const response = await controller.execute(body)
  
    expect(spyTransactionValidateUsecase).toHaveBeenCalledWith(body)
    expect(spyDepositCreateUsecase).toHaveBeenCalledWith({
      accountId: '8b61d335-4387-42f4-bdb8-ebb2e3cf970a',
      amount: '10000',
      transferTime: '2022-11-03T16:53:41.756Z',
    })

    expect(response).toEqual(mockTransaction)
  })
})
