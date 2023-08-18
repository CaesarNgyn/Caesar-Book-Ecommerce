import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { RolesGuard } from './users/roles/roles.guard';
import { ForbiddenExceptionFilter } from './core/forbidden-exception.filter';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

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

  //access public folder
  //http://localhost:6969/images/resume/fluffboi.jpg accessing without /public
  app.useStaticAssets(join(__dirname, '..', 'public'));





  //Enable JWT guard for all routes
  const reflector = app.get(Reflector)
  app.useGlobalGuards(new JwtAuthGuard(reflector))

  //Enable role based guard
  app.useGlobalGuards(new RolesGuard(reflector))

  //use transform interceptor globally
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  app.useGlobalFilters(new ForbiddenExceptionFilter());

  //use versioning to have different versions of controllers or individual routes running within the same application
  app.setGlobalPrefix('api', {
    exclude: [{ path: '/', method: RequestMethod.ALL }],
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
  });


  //The helmet middleware adds several security-related HTTP headers to the responses sent by application.
  app.use(helmet())

  await app.listen(port);
}
bootstrap();
