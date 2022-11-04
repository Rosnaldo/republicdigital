import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException, Logger } from '@nestjs/common'

import { PrismaService } from 'src/service/prisma.service'
import { MockTransactionTranfer } from 'src/mock/transaction'
import { MockAccount, MockAccount2 } from 'src/mock/account'
import { TransferCreateController } from 'src/module/transfer/controller/create.controller'
import { AccountGetOneRepository } from 'src/module/account/repository/get-one-repository'
import { TransactionValidateUsecase } from 'src/module/transaction/use-case/validate.use-case'
import { TransferCreateUsecase } from 'src/module/transfer/use-case/create.use-case'
import { AccountUpdateOneRepository } from 'src/module/account/repository/update-one-repository'


let controller
const mockTransactionValidateUsecase = {
  execute: jest.fn(),
}

const mockAccountGetOneRepository = {
  execute: jest.fn(),
}

const mockTransferCreateUsecase = {
  execute: jest.fn(),
}

const mockAccountUpdateOneRepository = {
  execute: jest.fn(),
}

const mockAccount = MockAccount()
const mockAccount2 = MockAccount2()
const mockTransaction = MockTransactionTranfer()

const Sut = (account2 = mockAccount2) => {
  const spyTransactionValidateUsecase = jest.spyOn(mockTransactionValidateUsecase, 'execute')
    .mockResolvedValue(mockAccount)

  const spyTransferCreateUsecase = jest.spyOn(mockTransferCreateUsecase, 'execute')
    .mockResolvedValue(mockTransaction)

  const spyAccountGetOneRepository = jest.spyOn(mockAccountGetOneRepository, 'execute')
    .mockResolvedValue(account2)

  const spyAccountUpdateOneRepository = jest.spyOn(mockAccountUpdateOneRepository, 'execute')
    .mockResolvedValue(null)

  return {
    spyAccountGetOneRepository,
    spyTransactionValidateUsecase,
    spyTransferCreateUsecase,
    spyAccountUpdateOneRepository,
  }
}

describe('TransferCreateController', () => {
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransferCreateController],
      providers: [
        TransactionValidateUsecase,
        AccountGetOneRepository,
        TransferCreateUsecase,
        AccountUpdateOneRepository,
        PrismaService,
      ],
    })
      .setLogger(new Logger())
      .overrideProvider(TransferCreateUsecase)
      .useValue(mockTransferCreateUsecase)
      .overrideProvider(AccountGetOneRepository)
      .useValue(mockAccountGetOneRepository)
      .overrideProvider(TransactionValidateUsecase)
      .useValue(mockTransactionValidateUsecase)
      .overrideProvider(AccountUpdateOneRepository)
      .useValue(mockAccountUpdateOneRepository)
      .compile()

    controller = module.get<TransferCreateController>(TransferCreateController)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Controller should be defined', function () {
    expect(controller).toBeDefined()
  })

  const body = {
    senderAccountId: '5d666862-01ad-40b5-b9ac-4332a8dd4191',
    recipientAccountId: '8b61d335-4387-42f4-bdb8-ebb2e3cf970a',
    amount: '10000',
    transferTime: '2022-11-03T16:53:41.756Z',
    password: '553276',
  }

  it('Should call TransferCreateController with right param', async function () {
    const {
      spyAccountGetOneRepository,
      spyTransactionValidateUsecase,
      spyTransferCreateUsecase,
      spyAccountUpdateOneRepository,
    } = Sut()
  
    const response = await controller.execute(body)
  
    expect(spyTransactionValidateUsecase).toHaveBeenCalledWith(body)
    expect(spyAccountGetOneRepository).toHaveBeenCalledWith({
      id: '8b61d335-4387-42f4-bdb8-ebb2e3cf970a',
    })
    expect(spyTransferCreateUsecase).toHaveBeenCalledWith({
      senderAccountId: '5d666862-01ad-40b5-b9ac-4332a8dd4191',
      recipientAccountId: '8b61d335-4387-42f4-bdb8-ebb2e3cf970a',
      amount: '10000',
      transferTime: new Date('2022-11-03T16:53:41.756Z')
    })

    expect(spyAccountUpdateOneRepository).toHaveBeenNthCalledWith(1, {
      id: '8b61d335-4387-42f4-bdb8-ebb2e3cf970a'
    }, {
      credit: '1990000'
    })
    expect(spyAccountUpdateOneRepository).toHaveBeenNthCalledWith(2, {
      id: 'e9547a13-f21a-4077-80d0-1ad597d94517'
    }, {
      credit: '2010000'
    })

    expect(response).toEqual(mockTransaction)
  })

  it('When sender credit is not enough should throw', async function () {
    Sut()

    const body = {
      senderAccountId: '5d666862-01ad-40b5-b9ac-4332a8dd4191',
      recipientAccountId: '8b61d335-4387-42f4-bdb8-ebb2e3cf970a',
      amount: '300000',
      transferTime: '2022-11-03T16:53:41.756Z',
      password: '553276',
    }
    
    const promise = controller.execute(body)

    expect(promise).rejects.toThrowError(BadRequestException)
  })

  it('When recipient not exist should throw', async function () {
    Sut(null)
    
    const promise = controller.execute(body)

    expect(promise).rejects.toThrowError(BadRequestException)
  })
})
