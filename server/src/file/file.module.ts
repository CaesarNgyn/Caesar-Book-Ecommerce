import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express'
import { MulterConfigService } from './multer.config';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    CloudinaryModule
  ],
  controllers: [FileController],
  providers: [FileService]
})
export class FileModule { }
