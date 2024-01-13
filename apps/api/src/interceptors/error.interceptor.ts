import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Request } from 'express'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest()

    return next.handle().pipe(
      catchError((e) =>
        throwError(
          () =>
            new HttpException(
              {
                message: e?.message || 'Something went wrong',
                method: request.method,
                route: request.path,
              },
              e?.statusCode ?? 500,
            ),
        ),
      ),
    )
  }
}
