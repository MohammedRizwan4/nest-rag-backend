import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { PrismaVectorStore } from '@langchain/community/vectorstores/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { DocumentEmbedding, Prisma } from '@prisma/client';
import { AzureOpenAIEmbeddings } from '@langchain/openai';

@Module({
  controllers: [ChatController],
  providers: [
    ChatService,
    PrismaService,
    {
      provide: PrismaVectorStore,
      useFactory: (prismaService: PrismaService) => {
        return PrismaVectorStore.withModel<DocumentEmbedding>(
          prismaService,
        ).create(new AzureOpenAIEmbeddings(), {
          prisma: Prisma,
          tableName: 'document_embeddings' as any,
          vectorColumnName: 'vector',
          columns: {
            id: PrismaVectorStore.IdColumn,
            content: PrismaVectorStore.ContentColumn,
            documentName: true,
          },
        });
      },
      inject: [PrismaService],
    },
  ],
})
export class ChatModule {}
