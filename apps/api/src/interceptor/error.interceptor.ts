import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import { Request } from 'express'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ErrorInterceptor.name)

  private getResponse(e: Error): Record<string, any> | string {
    if (e instanceof HttpException) {
      return e.getResponse()
    }

    return e.message ?? `An unexpected error occurred`
  }

  private getStatusCode(e: Error): number {
    return e instanceof HttpException ? e.getStatus() : 500
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest()

    return next.handle().pipe(
      catchError((e) => {
        const statusCode = this.getStatusCode(e)

        this.logger.error(
          `${request.method} ${request.url} ${statusCode} ${e.message}`,
          e.stack,
        )

        return throwError(
          () => new HttpException(this.getResponse(e), statusCode),
        )
      }),
    )
  }
}
