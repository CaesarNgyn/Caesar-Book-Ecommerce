import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { Public } from 'src/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseMessage } from 'src/decorators/message.decorator';
import * as fs from 'fs';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('file')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  @Post('upload')
  @ResponseMessage('Upload file')
  @UseInterceptors(FileInterceptor('fileImgUpload'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    // Call the CloudinaryService's method to upload the file
    try {
      const fileBuffer = await fs.promises.readFile(file.path);
      file.buffer = fileBuffer
      const uploadedResult = await this.cloudinaryService.uploadImage(file);
      return {
        // uploadedResult
        file: file.filename
      };
    } catch {
      throw new BadRequestException('Invalid file type.');
    }

  }
}

