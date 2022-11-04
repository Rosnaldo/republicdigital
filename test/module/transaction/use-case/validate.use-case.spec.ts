import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException, Logger } from '@nestjs/common'

import { PrismaService } from 'src/service/prisma.service'
import { MockAccountWithUser } from 'src/mock/account'
import { TransactionValidateUsecase } from 'src/module/transaction/use-case/validate.use-case'
import { AccountGetOneRepository } from 'src/module/account/repository/get-one-repository'
import { BcryptService } from 'src/service/bcrypt.service'


let usecase
const mockBcryptService = {
  check: jest.fn(),
}

const mockAccountGetOneRepository = {
  execute: jest.fn(),
}

const mockAccount = MockAccountWithUser()

const Sut = (account = mockAccount, check = true) => {
  const spyBcryptService = jest.spyOn(mockBcryptService, 'check')
    .mockResolvedValue(check)

  const spyAccountGetOneRepository = jest.spyOn(mockAccountGetOneRepository, 'execute')
    .mockResolvedValue(account)
  
  return { spyBcryptService, spyAccountGetOneRepository }
}

describe('TransactionValidateUsecase', () => {
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionValidateUsecase],
      providers: [BcryptService, AccountGetOneRepository, PrismaService],
    })
      .setLogger(new Logger())
      .overrideProvider(BcryptService)
      .useValue(mockBcryptService)
      .overrideProvider(AccountGetOneRepository)
      .useValue(mockAccountGetOneRepository)
      .compile()

      usecase = module.get<TransactionValidateUsecase>(TransactionValidateUsecase)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Usecase should be defined', function () {
    expect(usecase).toBeDefined()
  })

  const body = {
    accountId: '5d666862-01ad-40b5-b9ac-4332a8dd4191',
    amount: '20000',
    password: '442200'
  }

  it('Should call TransactionValidateUsecase with right param', async function () {
    const { spyBcryptService, spyAccountGetOneRepository } = Sut()
  
    const response = await usecase.execute(body)
  
    expect(spyAccountGetOneRepository).toHaveBeenCalledWith({
      id: '5d666862-01ad-40b5-b9ac-4332a8dd4191',
    })
    expect(spyBcryptService).toHaveBeenCalledWith('442200', '447822')
    expect(response).toEqual(mockAccount)
  })

  it('When amount is not bigger than zero should throw', async function () {
    Sut()
  
    const body = {
      accountId: '5d666862-01ad-40b5-b9ac-4332a8dd4191',
      amount: '0',
      password: '442200'
    }

    const promise = usecase.execute(body)

    expect(promise).rejects.toThrowError(BadRequestException)
  })

  it('When sender not exist should throw', async function () {
    Sut(null)
    
    const promise = usecase.execute(body)

    expect(promise).rejects.toThrowError(BadRequestException)
  })

  it('When password is incorrect should throw', async function () {
    Sut(undefined, false)
    
    const promise = usecase.execute(body)

    expect(promise).rejects.toThrowError(BadRequestException)
  })
})
