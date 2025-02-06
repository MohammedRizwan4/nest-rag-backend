import {Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {UploadService} from "./upload.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {PDFLoader} from "@langchain/community/document_loaders/fs/pdf";
import {EmbeddingService} from "./embedding.service";

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService, private readonly embeddingService: EmbeddingService) {
    }

    @Post("/file")
    @UseInterceptors(FileInterceptor("file", {
        storage: diskStorage({
            destination: "/temp"
        }),
    }),)
    async uploadFile(@UploadedFile() file) {
        return this.embeddingService.embeddFile(file);
    }
}
