import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';

    // 1. Handle Standard NestJS HTTP Exceptions (like Validation errors)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse: any = exception.getResponse();
      
      // ValidationPipe returns an array of messages, others return a string
      message = exceptionResponse.message || exception.message;
      error = exceptionResponse.error || exception.name;
    } 
    // 2. Handle Prisma Database Errors
    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        const target = (exception.meta?.target as string[])?.join(', ') || 'field';
        message = `Unique constraint failed on ${target}. This record already exists.`;
        error = 'Conflict';
      }
    } 
    // 3. Fallback for unhandled native Javascript errors
    else if (exception instanceof Error) {
      message = exception.message;
    }

    // Standardize the message to always be an array for frontend consistency
    const formattedMessage = Array.isArray(message) ? message : [message];

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: formattedMessage,
      error: error,
    });
  }
}