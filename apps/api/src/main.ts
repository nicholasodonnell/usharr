import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as morgan from 'morgan'

import { AppModule } from './app.module'
import { ErrorInterceptor } from './interceptors/error.interceptor'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const port = process.env.NODE_ENV === 'production' ? 5588 : 3001

  app.enableCors()
  app.use(morgan('tiny'))
  app.useGlobalInterceptors(new ErrorInterceptor())

  await app.listen(port, '0.0.0.0')
}

bootstrap()
