import {Controller, Get, Query} from '@nestjs/common';
import {ChatService} from "./chat.service";

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {
    }
    @Get("")
    getResponse(@Query("query") query: string) {
        return this.chatService.getResponse(query);
    }
}
