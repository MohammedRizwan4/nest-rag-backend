import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import {ChatService} from "../chat/chat.service";
import {ChatModule} from "../chat/chat.module";

@Module({
  imports: [ChatModule],
  controllers: [UploadController],
  providers: [UploadService, ChatService]
})
export class UploadModule {}
