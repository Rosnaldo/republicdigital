import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common'
import { Response } from 'express'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    let message = ''

    if(exception.code == 'P2002' && exception.meta.target == 'cpf') {
      message = 'Cpf já está cadastrado'
    }

    if (message == '') {
      message = exception.message
    }

    response.status(402).send({
      error: message,
    })
  }
}
