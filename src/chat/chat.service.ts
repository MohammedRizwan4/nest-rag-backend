import {Injectable} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {AzureChatOpenAI} from "@langchain/openai";
import {ChatPromptTemplate} from "@langchain/core/prompts";

@Injectable()
export class ChatService {
    constructor(private readonly configService: ConfigService) {
    }

    async getResponse(pdfContent: string) {
        const model = new AzureChatOpenAI({
            model: "gpt-4o",
            temperature: 0.3,
            maxTokens: undefined,
            maxRetries: 2,
            azureOpenAIApiKey: this.configService.get<string>("AZURE_OPENAI_API_KEY"), // In Node.js defaults to process.env.AZURE_OPENAI_API_KEY
            azureOpenAIApiInstanceName: this.configService.get<string>("AZURE_OPENAI_API_INSTANCE_NAME"), // In Node.js defaults to process.env.AZURE_OPENAI_API_INSTANCE_NAME
            azureOpenAIApiDeploymentName: this.configService.get<string>("AZURE_OPENAI_API_DEPLOYMENT_NAME"), // In Node.js defaults to process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME
            azureOpenAIApiVersion: this.configService.get<string>("AZURE_OPENAI_API_VERSION"), // In Node.js defaults to process.env.AZURE_OPENAI_API_VERSION
        });
        const prompt = ChatPromptTemplate.fromMessages([[
            "system",
            pdfContent
        ],[
                "human",
                "{input}"
            ]
        ]);
        const chain = prompt.pipe(model);
        const response = await chain.invoke({
            input: `please give me content of 6th line `

        });
        return `${response.content}`;
    }
}
