import { Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { ValidateCPFService } from 'src/module/user/service/cpf-validate'

let validate: ValidateCPFService

describe('ValidateCPFService', () => {
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateCPFService,
      ],
    })
      .setLogger(new Logger())
      .compile()

    validate = module.get<ValidateCPFService>(ValidateCPFService)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Service should be defined', function () {
    expect(validate).toBeDefined()
  })

  it('Should be assert valid cpf', async function () {
    const isValid = validate.execute(
      '52998224725'
    )

    expect(isValid).toBeTruthy()
  })

  it('Should be assert valid cpf', async function () {
    const isValid = validate.execute(
      '94795967253'
    )

    expect(isValid).toBeTruthy()
  })

  it('Can not be repeted digits', async function () {
    const isValid = validate.execute(
      '11111111111'
    )

    expect(isValid).toBeFalsy()
  })

  it('Must be convertable to number', async function () {
    const isValid = validate.execute(
      '11111111a11'
    )

    expect(isValid).toBeFalsy()
  })

  it('Must be habe 11 caracters', async function () {
    const isValid = validate.execute(
      '111111111'
    )

    expect(isValid).toBeFalsy()
  })
})
