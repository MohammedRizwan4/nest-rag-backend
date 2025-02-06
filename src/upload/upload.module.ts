import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import {ChatService} from "../chat/chat.service";
import {ChatModule} from "../chat/chat.module";
import {EmbeddingService} from "./embedding.service";
import {Prisma} from "prisma/prisma-client/scripts/default-index";
import {PrismaModule} from "../prisma/prisma.module";
import {PrismaService} from "../prisma/prisma.service";

@Module({
  imports: [ChatModule, PrismaModule],
  controllers: [UploadController],
  providers: [UploadService, ChatService, EmbeddingService, PrismaService]
})
export class UploadModule {


}
