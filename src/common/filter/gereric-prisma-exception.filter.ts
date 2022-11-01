import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common'
import { Response } from 'express'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'

@Catch(PrismaClientKnownRequestError)
export class GenerericPrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GenerericPrismaExceptionFilter.name)

  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    response.status(402).send({
      error: exception,
    })
  }
}
