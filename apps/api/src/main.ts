import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as morgan from 'morgan'

import { AppModule } from './app.module'
import { ErrorInterceptor } from './interceptor/error.interceptor'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const isProd = process.env.NODE_ENV === 'production'
  const port = isProd ? 1225 : 3001

  if (!isProd) {
    app.enableCors()
  }

  // middleware
  app.use(morgan(isProd ? 'combined' : 'dev'))

  // pipes
  app.useGlobalPipes(new ValidationPipe())

  // interceptors
  app.useGlobalInterceptors(new ErrorInterceptor())
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

  await app.listen(port, '0.0.0.0')
}

bootstrap()
