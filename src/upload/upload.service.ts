import { Injectable } from '@nestjs/common';
import {PDFLoader} from "@langchain/community/document_loaders/fs/pdf";
import {ChatService} from "../chat/chat.service";

@Injectable()
export class UploadService {
    constructor(private readonly chatService: ChatService) {

    }
    async uploadFile(file) {
        const {path, mimetype} = file;
        const loader = new PDFLoader(path);
        const docs = await loader.load();
        const content = docs[0].pageContent;

        return this.chatService.getResponse(content);
    }
}
