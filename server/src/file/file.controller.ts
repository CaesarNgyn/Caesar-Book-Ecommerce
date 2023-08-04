import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { Public } from 'src/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseMessage } from 'src/decorators/message.decorator';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) { }
  @Post('upload')
  @UseInterceptors(FileInterceptor('fileImgUpload'))
  @ResponseMessage("Upload single file")
  uploadFile(@UploadedFile() file: Express.Multer.File) {

    return {
      fileName: file.filename
    }
  }
}
