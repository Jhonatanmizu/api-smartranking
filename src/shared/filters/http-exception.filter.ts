import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger = new Logger(AllExceptionsFilter.name)) {}

  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();

    const response = context.getResponse();
    const request = context.getRequest();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException ? exception.getResponse() : exception;

    this.logger.error(
      `Http Status:${statusCode} Error message ${JSON.stringify(message)}`,
    );
    response.status(statusCode).json({
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
