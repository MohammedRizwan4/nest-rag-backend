import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import {ChatService} from "../chat/chat.service";
import {ChatModule} from "../chat/chat.module";
import {EmbeddingService} from "./embedding.service";
import {PrismaModule} from "../prisma/prisma.module";
import {PrismaService} from "../prisma/prisma.service";
import { PrismaVectorStore } from '@langchain/community/vectorstores/prisma';
import { DocumentEmbedding } from '@prisma/client';
import { AzureOpenAIEmbeddings } from '@langchain/openai';
import { Prisma } from '@prisma/client';

@Module({
  imports: [ChatModule, PrismaModule],
  controllers: [UploadController],
  providers: [UploadService, ChatService, EmbeddingService, PrismaService, {
    provide: PrismaVectorStore,
    useFactory: (prismaService: PrismaService) => {
      return PrismaVectorStore.withModel<DocumentEmbedding>(
        prismaService,
      ).create(new AzureOpenAIEmbeddings(), {
        prisma: Prisma,
        tableName: "document_embeddings" as any,
        vectorColumnName: "vector",
        columns: {
          id: PrismaVectorStore.IdColumn,
          content: PrismaVectorStore.ContentColumn,
          documentName: true,
        },
      });
    },
    inject: [PrismaService],
  },
  ]
})
export class UploadModule {


}
