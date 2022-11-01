import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException, Logger } from '@nestjs/common'
import { User } from '@prisma/client'
import { MockUser } from 'src/mock/user'
import { PrismaService } from 'src/service/prisma.service'
import { UserRegisterController } from 'src/module/user/controller/register.controller'
import { UserInsertOneRepository } from 'src/module/user/repository/insert-one-repository'
import { ValidateCPFService } from 'src/module/user/service/cpf-validate'
import { BcryptService } from 'src/service/bcrypt.service'


let controller
const mockUserInsertOneRepository = {
  execute: jest.fn(),
}

const mockValidateCPFService = {
  execute: jest.fn(),
}

const mockBcryptService = {
  createHash: jest.fn(),
}

const Sut = (user: User, isValid) => {
  const spyRepository = jest.spyOn(mockUserInsertOneRepository, 'execute').mockResolvedValue(user)
  const spyValidateCpf = jest.spyOn(mockValidateCPFService, 'execute').mockReturnValue(isValid)
  const spyBcrypt = jest.spyOn(mockBcryptService, 'createHash').mockReturnValue('hash')
  
  return { spyRepository, spyValidateCpf, spyBcrypt }
}

describe('UserRegisterController', () => {
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRegisterController],
      providers: [BcryptService, ValidateCPFService, UserInsertOneRepository, PrismaService],
    })
      .setLogger(new Logger())
      .overrideProvider(UserInsertOneRepository)
      .useValue(mockUserInsertOneRepository)
      .overrideProvider(ValidateCPFService)
      .useValue(mockValidateCPFService)
      .overrideProvider(BcryptService)
      .useValue(mockBcryptService)
      .compile()

    controller = module.get<UserRegisterController>(UserRegisterController)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Controller should be defined', function () {
    expect(controller).toBeDefined()
  })

  const mockUser = MockUser()
  const body = {
    name: 'Andrey',
    cpf: '52998224725',
    password: 'password'
  }

  it('When cpf is invalid should throw', async function () {
    Sut(mockUser, false)
  
    const promise = controller.execute(body)
  
    expect(promise).rejects.toThrowError(BadRequestException)
  })

  it('Should call UserRegisterController with right param', async function () {
    const { spyRepository, spyValidateCpf, spyBcrypt } = Sut(mockUser, true)
  
    const response = await controller.execute(body)
  
    expect(spyRepository).toHaveBeenCalledWith({
      name: 'Andrey',
      cpf: '52998224725',
      password: 'hash'
    })

    expect(spyValidateCpf).toHaveBeenCalledWith(body.cpf)
    expect(spyBcrypt).toHaveBeenCalledWith(body.password)

    expect(response).toEqual(mockUser)
  })
})
