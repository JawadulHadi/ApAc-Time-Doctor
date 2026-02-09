import { ArgumentsHost, Catch, ExceptionFilter, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
@Catch(UnauthorizedException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(_exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(200).json({
      success: false,
      data: null,
      message: "Oops! We couldn't find you, Please contact jhadi@apac-dev.agilebrains.com",
      statusCode: 200,
      timestamp: new Date().toISOString(),
    });
  }
}
