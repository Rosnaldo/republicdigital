import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException, Logger } from '@nestjs/common'

import { PrismaService } from 'src/service/prisma.service'
import { MockAccount, MockAccount2 } from 'src/mock/account'
import { BcryptService } from 'src/service/bcrypt.service'
import { TransferCreateController } from 'src/module/transfer/controller/create.controller'
import { AccountGetOneRepository } from 'src/module/account/repository/get-one-repository'
import { MockTransfer } from 'src/mock/transfer'
import { TransferInsertOneRepository } from 'src/module/transfer/repository/insert-one-repository'


let controller
const mockTransferInsertOneRepository = {
  execute: jest.fn(),
}

const mockAccountGetOneRepository = {
  execute: jest.fn(),
}

const mockBcryptService = {
  check: jest.fn(),
}

const mockAccount = MockAccount()
const mockAccount2 = MockAccount2()
const mockTransfer = MockTransfer()

const Sut = (account = mockAccount, isCheck = true, account2 = mockAccount2) => {
  const spyAccountGetOneRepository = jest.spyOn(mockAccountGetOneRepository, 'execute')
    .mockResolvedValueOnce(account)
    .mockResolvedValueOnce(account2)

  const spyBcryptService = jest.spyOn(mockBcryptService, 'check')
    .mockResolvedValue(isCheck)

  const spyTransferInsertOneRepository = jest.spyOn(mockTransferInsertOneRepository, 'execute')
    .mockResolvedValue(mockTransfer)

  return { spyTransferInsertOneRepository, spyAccountGetOneRepository, spyBcryptService }
}

describe('TransferCreateController', () => {
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransferCreateController],
      providers: [TransferInsertOneRepository, AccountGetOneRepository, BcryptService, PrismaService],
    })
      .setLogger(new Logger())
      .overrideProvider(BcryptService)
      .useValue(mockBcryptService)
      .overrideProvider(AccountGetOneRepository)
      .useValue(mockAccountGetOneRepository)
      .overrideProvider(TransferInsertOneRepository)
      .useValue(mockTransferInsertOneRepository)
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
    const { spyTransferInsertOneRepository, spyAccountGetOneRepository, spyBcryptService } = Sut()
  
    const response = await controller.execute(body)
  
    expect(spyAccountGetOneRepository).toHaveBeenCalledWith({
      userId: '5d666862-01ad-40b5-b9ac-4332a8dd4191',
    }, {
      user: true,
    })
    expect(spyBcryptService).toHaveBeenNthCalledWith(1, body.password, mockAccount.password)
    expect(spyTransferInsertOneRepository).toHaveBeenCalledWith({
      senderAccountId: '5d666862-01ad-40b5-b9ac-4332a8dd4191',
      recipientAccountId: '8b61d335-4387-42f4-bdb8-ebb2e3cf970a',
      amount: '10000',
      transferTime: '2022-11-03T16:53:41.756Z',
    })
    expect(response).toEqual(mockTransfer)
  })

  it('When amount is not bigger than zero should throw', async function () {
    Sut()
  
    const body = {
      senderAccountId: '5d666862-01ad-40b5-b9ac-4332a8dd4191',
      recipientAccountId: '8b61d335-4387-42f4-bdb8-ebb2e3cf970a',
      amount: '0',
      transferTime: '2022-11-03T16:53:41.756Z',
      password: '553276',
    }

    const promise = controller.execute(body)

    expect(promise).rejects.toThrowError(BadRequestException)
  })

  it('When sender not exist should throw', async function () {
    Sut(null)
    
    const promise = controller.execute(body)

    expect(promise).rejects.toThrowError(BadRequestException)
  })

  it('When password is incorrect should throw', async function () {
    Sut(undefined, false)
    
    const promise = controller.execute(body)

    expect(promise).rejects.toThrowError(BadRequestException)
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
    Sut(undefined, undefined, null)
    
    const promise = controller.execute(body)

    expect(promise).rejects.toThrowError(BadRequestException)
  })
})
