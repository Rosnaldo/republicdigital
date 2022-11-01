import { Test, TestingModule } from '@nestjs/testing'
import { Logger } from '@nestjs/common'
import { User } from '@prisma/client'
import { UserGetOneController } from 'src/module/user/controller/get-one.controller'
import { UserGetOneRepository } from 'src/module/user/repository/get-one-repository'
import { MockUser } from 'src/mock/user'
import { PrismaService } from 'src/service/prisma.service'


let controller
const mockUserGetOneRepository = {
  execute: jest.fn(),
}

const Sut = (user: User) => {
  const spyGetRepository = jest.spyOn(mockUserGetOneRepository, 'execute').mockResolvedValue(user)
  
  return { spyGetRepository }
}

describe('UserGetOneController', () => {
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserGetOneController],
      providers: [UserGetOneRepository, PrismaService],
    })
      .setLogger(new Logger())
      .overrideProvider(UserGetOneRepository)
      .useValue(mockUserGetOneRepository)
      .compile()

    controller = module.get<UserGetOneController>(UserGetOneController)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Controller should be defined', function () {
    expect(controller).toBeDefined()
  })

  it('Should call UserGetOneController with right param', async function () {
    const id = '5d666862-01ad-40b5-b9ac-4332a8dd4191'
    const mockUser = MockUser()

    const { spyGetRepository } = Sut(mockUser)
  
    const response = await controller.execute(id)
  
    expect(spyGetRepository).toHaveBeenCalledWith({ id })
    expect(response).toEqual(mockUser)
  })
})
