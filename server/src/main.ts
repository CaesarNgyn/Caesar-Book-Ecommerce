import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService)
  const port = configService.get<string>('PORT')

  //applies the validation pipe to all routes and controllers, including third-party libraries and external endpoints.
  app.useGlobalPipes(new ValidationPipe());

  //use cookies
  app.use(cookieParser());

  //config cors
  app.enableCors(
    {
      origin: true,
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      //enables the inclusion of credentials (such as cookies or HTTP authentication) in cross-origin requests.
      credentials: true,
      preflightContinue: false
    }
  )


  //Enable JWT guard for all routes
  const reflector = app.get(Reflector)
  app.useGlobalGuards(new JwtAuthGuard(reflector))

  //use transform interceptor globally
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  //use versioning to have different versions of controllers or individual routes running within the same application
  app.setGlobalPrefix('api')
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],

  });


  await app.listen(port);
}
bootstrap();
