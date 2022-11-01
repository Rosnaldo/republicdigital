import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

@Injectable()
export class BcryptService {
  private readonly bcryptService: any
  constructor() {
    this.bcryptService = bcrypt
  }

  async check (input: string, hash: string): Promise<boolean> {
    return this.bcryptService.compare(input, hash)
  }

  async createHash (input: string): Promise<string> {
    const saltRounds = 10
    return bcrypt.hash(input, saltRounds)
  }
}
