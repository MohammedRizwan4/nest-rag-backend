import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
    getResponse(query: string) {
        return `Hello! ${query}`
    }
}
