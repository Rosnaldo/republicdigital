import { Test, TestingModule } from '@nestjs/testing'
import { Logger } from '@nestjs/common'
import { Account, User } from '@prisma/client'

import { MockUser } from 'src/mock/user'
import { PrismaService } from 'src/service/prisma.service'
import { AccountCreateController } from 'src/module/account/controller/create.controller'
import { UserRegisterUsecase } from 'src/module/user/use-case/register.use-case'
import { MockAccount, MockAccountWithUser } from 'src/mock/account'
import { BcryptService } from 'src/service/bcrypt.service'
import { AccountInsertOneRepository } from 'src/module/account/repository/insert-one-repository'


let controller
const mockUserRegisterUsecase = {
  execute: jest.fn(),
}

const mockAccountInsertOneRepository = {
  execute: jest.fn(),
}

const mockBcryptService = {
  createHash: jest.fn(),
}

const Sut = (user: User, account: Account) => {
  const spyUserRegisterUsecase = jest.spyOn(mockUserRegisterUsecase, 'execute').mockResolvedValue(user)
  const spyAccountInsertOneRepository = jest.spyOn(mockAccountInsertOneRepository, 'execute').mockResolvedValue(account)
  const spyBcryptService = jest.spyOn(mockBcryptService, 'createHash').mockResolvedValue('encodedPassword')
  
  return { spyUserRegisterUsecase, spyAccountInsertOneRepository, spyBcryptService }
}

describe('AccountCreateController', () => {
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountCreateController],
      providers: [AccountInsertOneRepository, BcryptService, UserRegisterUsecase, PrismaService],
    })
      .setLogger(new Logger())
      .overrideProvider(UserRegisterUsecase)
      .useValue(mockUserRegisterUsecase)
      .overrideProvider(BcryptService)
      .useValue(mockBcryptService)
      .overrideProvider(AccountInsertOneRepository)
      .useValue(mockAccountInsertOneRepository)
      .compile()

    controller = module.get<AccountCreateController>(AccountCreateController)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Controller should be defined', function () {
    expect(controller).toBeDefined()
  })

  it('Should call AccountCreateController with right param', async function () {
    const mockUser = MockUser()
    const mockAccountWithUser = MockAccountWithUser()

    const body = {
      name: 'Andrey Kenji Tsuzuki',
      cpf: '94795967253',
      password: '423300',
    }

    const { spyUserRegisterUsecase, spyAccountInsertOneRepository, spyBcryptService } = Sut(mockUser, mockAccountWithUser)
  
    const response = await controller.execute(body)
  
    expect(spyUserRegisterUsecase).toHaveBeenCalledWith(body)
    expect(spyBcryptService).toHaveBeenCalledWith(body.password)
    expect(spyAccountInsertOneRepository).toHaveBeenCalledWith({
      user: {
        connect: {
          id: mockUser.id,
        }
      },
      password: 'encodedPassword'
    }, {
      user: true
    })
    expect(response).toEqual(mockAccountWithUser)
  })
})
