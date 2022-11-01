import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common'
import { Response } from 'express'

interface HttpExceptionResponse {
  message: string
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    const status = exception.getStatus()
    const errorResponse = exception.getResponse()
    const errorMessage = (errorResponse as HttpExceptionResponse).message || exception.message

    this.logger.error(exception)

    response.status(status).send({
      error: errorMessage,
    })
  }
}
