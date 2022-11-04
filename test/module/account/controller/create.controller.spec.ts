import { Test, TestingModule } from '@nestjs/testing'
import { Logger } from '@nestjs/common'
import { Account, User } from '@prisma/client'

import { MockUser } from 'src/mock/user'
import { PrismaService } from 'src/service/prisma.service'
import { AccountCreateController } from 'src/module/account/controller/create.controller'
import { UserRegisterUsecase } from 'src/module/user/use-case/register.use-case'
import { MockAccountWithUser } from 'src/mock/account'
import { AccountCreateUsecase } from 'src/module/account/use-case/create.use-case'


let controller
const mockUserRegisterUsecase = {
  execute: jest.fn(),
}

const mockAccountCreateUsecase = {
  execute: jest.fn(),
}

const Sut = (user: User, account: Account) => {
  const spyUserRegisterUsecase = jest.spyOn(mockUserRegisterUsecase, 'execute').mockResolvedValue(user)
  const spyAccountCreateUsecase = jest.spyOn(mockAccountCreateUsecase, 'execute').mockResolvedValue(account)
  
  return { spyUserRegisterUsecase, spyAccountCreateUsecase }
}

describe('AccountCreateController', () => {
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountCreateController],
      providers: [AccountCreateUsecase, UserRegisterUsecase, PrismaService],
    })
      .setLogger(new Logger())
      .overrideProvider(UserRegisterUsecase)
      .useValue(mockUserRegisterUsecase)
      .overrideProvider(AccountCreateUsecase)
      .useValue(mockAccountCreateUsecase)
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

    const { spyUserRegisterUsecase, spyAccountCreateUsecase } = Sut(mockUser, mockAccountWithUser)
  
    const response = await controller.execute(body)
  
    expect(spyUserRegisterUsecase).toHaveBeenCalledWith({
      name: 'Andrey Kenji Tsuzuki',
      cpf: '94795967253',
    })
    expect(spyAccountCreateUsecase).toHaveBeenCalledWith({
      password: '423300',
      userId: '5d666862-01ad-40b5-b9ac-4332a8dd4191'
    })
    // expect(spyBcryptService).toHaveBeenCalledWith(body.password)
    // expect(spyAccountInsertOneRepository).toHaveBeenCalledWith({
    //   user: {
    //     connect: {
    //       id: mockUser.id,
    //     }
    //   },
    //   password: 'encodedPassword'
    // }, {
    //   user: true
    // })
    expect(response).toEqual(mockAccountWithUser)
  })
})
