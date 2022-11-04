import { Test, TestingModule } from '@nestjs/testing'
import { Logger } from '@nestjs/common'
import { Account } from '@prisma/client'

import { PrismaService } from 'src/service/prisma.service'
import { MockAccountWithUser } from 'src/mock/account'
import { AccountCreateUsecase } from 'src/module/account/use-case/create.use-case'
import { BcryptService } from 'src/service/bcrypt.service'
import { AccountInsertOneRepository } from 'src/module/account/repository/insert-one-repository'


let usecase
const mockBcryptService = {
  createHash: jest.fn(),
}

const mockAccountInsertOneRepository = {
  execute: jest.fn(),
}

const Sut = (account: Account) => {
  const spyBcryptService = jest.spyOn(mockBcryptService, 'createHash')
    .mockResolvedValue('encodedPassword')

  const spyAccountInsertOneRepository = jest.spyOn(mockAccountInsertOneRepository, 'execute')
    .mockResolvedValue(account)
  
  return { spyBcryptService, spyAccountInsertOneRepository }
}

describe('AccountCreateUsecase', () => {
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountCreateUsecase],
      providers: [BcryptService, AccountInsertOneRepository, PrismaService],
    })
      .setLogger(new Logger())
      .overrideProvider(BcryptService)
      .useValue(mockBcryptService)
      .overrideProvider(AccountInsertOneRepository)
      .useValue(mockAccountInsertOneRepository)
      .compile()

      usecase = module.get<AccountCreateUsecase>(AccountCreateUsecase)
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
      userId: '5d666862-01ad-40b5-b9ac-4332a8dd4191',
      password: '423300',
    }

    const { spyBcryptService, spyAccountInsertOneRepository } = Sut(mockAccountWithUser)
  
    const response = await usecase.execute(body)
  
    expect(spyBcryptService).toHaveBeenCalledWith('423300')
    expect(spyAccountInsertOneRepository).toHaveBeenCalledWith({
      user: {
        connect: {
          id: '5d666862-01ad-40b5-b9ac-4332a8dd4191',
        }
      },
      password: 'encodedPassword'
    }, {
      user: true
    })
    expect(response).toEqual(mockAccountWithUser)
  })
})
