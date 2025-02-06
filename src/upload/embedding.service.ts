import {Injectable} from "@nestjs/common";
import {ChatService} from "../chat/chat.service";
import {PDFLoader} from "@langchain/community/document_loaders/fs/pdf";
import {PrismaService} from "../prisma/prisma.service";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

@Injectable()
export class EmbeddingService {
    textSplitter;
    constructor(private readonly chatService: ChatService, private readonly prismaService: PrismaService) {
        this.textSplitter = new RecursiveCharacterTextSplitter();
    }
    async embeddFile(file) {
        const {path, mimetype} = file;
        const loader = new PDFLoader(path);
        const docs = await loader.load();
        const content = docs[0].pageContent;


        const chunks = await this.textSplitter.splitDocuments(await loader.load());
        const embeddings = await Promise.all(
            chunks.map((doc) => {
                return this.prismaService.documentEmbedding.create({
                    data: {
                        content: doc.pageContent,
                        documentName: file.originalname,
                    },
                });
            }),
        );

        return "Success";
    }
}
