import { Injectable } from '@nestjs/common';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class ChatService {
    constructor(private readonly configService: ConfigService) {
    }
    getResponse(query: string) {
        return `Hello! ${this.configService.get<string>("NAME")} ${query}`
    }
}
