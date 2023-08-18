import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [TerminusModule],
  controllers: [HealthController]
})
export class HealthModule { }