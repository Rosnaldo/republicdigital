import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class ValidateCPFService {
  private readonly logger = new Logger(ValidateCPFService.name)

  execute(cpf: string): boolean {
    if (cpf.length !== 11) {
      return false
    }

    if (Number(cpf) === NaN) {
      return false
    }

    const repetedDigits = [
      '00000000000',
      '11111111111',
      '22222222222',
      '33333333333',
      '44444444444',
      '55555555555',
      '66666666666',
      '77777777777',
      '88888888888',
      '99999999999'
    ]

    if (repetedDigits.includes(cpf)) {
      return false
    }

    const digits = cpf.split('')
    const sum = digits.slice(0, 9).reduce((acc, val, inx) => {
      return acc + (Number(val) * (10 - inx))
    }, 0)

    const rest = (sum * 10) % 11

    if (rest !== Number(digits[9])) {
      return false
    }

    const sum2 = digits.slice(0, 10).reduce((acc, val, inx) => {
      return acc + (Number(val) * (11 - inx))
    }, 0)

    const rest2 = (sum2 * 10) % 11

    if (rest2 !== Number(digits[10])) {
      return false
    }

    return true
  }
}
