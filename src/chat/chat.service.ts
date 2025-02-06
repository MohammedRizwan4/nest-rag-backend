import {Injectable} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {AzureChatOpenAI} from "@langchain/openai";
import {ChatPromptTemplate} from "@langchain/core/prompts";

@Injectable()
export class ChatService {
    constructor(private readonly configService: ConfigService) {
    }

    async getResponse(query: string) {
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
            "Analyze the sentiment of the following user input. If the input contains sarcasm or negation, detect it. Examples:\n" +
            "1. \"Oh great, another software update that crashes my phone. Amazing!\"  \n" +
            "   Sentiment: Negative  \n" +
            "   Sarcasm: Yes  \n" +
            "\n" +
            "2. \"I had a terrible experience. Never buying from here again.\"  \n" +
            "   Sentiment: Negative  \n" +
            "   Sarcasm: No  "
            ],
            ["human", "{input}"]
        ]);
        const chain = prompt.pipe(model);
        const response = await chain.invoke({
            input: query
        });
        return `${response.content}`;
    }
}
