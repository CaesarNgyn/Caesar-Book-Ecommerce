import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (status === 403) {
      response.status(status).json({
        statusCode: status,
        message: 'Chỉ có người quản trị Administrator mới đủ quyền thực hiện tác vụ này', // Customize this message
        error: 'Forbidden',
      });
    } else {
      response.status(status).json(exception.getResponse());
    }
  }
}