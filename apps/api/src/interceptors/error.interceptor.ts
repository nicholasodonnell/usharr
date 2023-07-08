import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
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
                route: request.path,
                method: request.method,
              },
              e?.statusCode ?? 500,
            ),
        ),
      ),
    )
  }
}
