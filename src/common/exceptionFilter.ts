import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = 500;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object') {
        const isArr = Array.isArray(res['message']);
        if (isArr) {
          const messages = res['message'] as string[];
          message = messages.join(', ');
        } else {
          message = res['message'] as string;
        }
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          status = 409;
          message = 'Unique constraint failed';
          break;
        case 'P2025':
          status = 404;
          message = 'Record not found';
          break;
        default:
          status = 400;
          message = exception.message;
      }
    }

    this.logger.error(
      `HTTP ${status} - ${JSON.stringify(message)} - ${request.method} ${request.url}`,
      exception,
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
