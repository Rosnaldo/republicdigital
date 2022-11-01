import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common'
import { Response } from 'express'

@Catch(Error)
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    this.logger.error(exception)

    response.status(500).send({
      error: 'Interno Error',
    })
  }
}
