import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AzureChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { PrismaVectorStore } from '@langchain/community/vectorstores/prisma';

@Injectable()
export class ChatService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaVectorStore: PrismaVectorStore<any, any, any, any>,
  ) {}

  async getResponse(query: string) {
    const model = new AzureChatOpenAI({
      model: 'gpt-4o',
      temperature: 0.3,
      maxTokens: undefined,
      maxRetries: 2,
      azureOpenAIApiKey: this.configService.get<string>('AZURE_OPENAI_API_KEY'),
      azureOpenAIApiInstanceName: this.configService.get<string>(
        'AZURE_OPENAI_API_INSTANCE_NAME',
      ),
      azureOpenAIApiDeploymentName: 'gpt-4o-interns-bootcamp-2025',
      azureOpenAIApiVersion: '2024-08-01-preview',
    });
    let similarPagesOfQuery =
      await this.prismaVectorStore.similaritySearchWithScore(query);
    const similarDocsString = similarPagesOfQuery
      .map((message) => message[0].pageContent)
      .join('\n')
      .trim();

    const request = `
      ###CONTEXT###:
      ${similarDocsString}
 
      ###QUESTION###:
      ${query}
      
      ###INSTRUCTIONS###:
      - If relevant, utilize CONTEXT to find answers; ignore it if it's empty
      - If applicable, Ensure that all answers are factually-based on the given resources.
`;
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', request],
      [
        'human',
        'I am giving you information about people working in my organization with their name and email answer the query' +
          '{input}',
      ],
    ]);

    const chain = prompt.pipe(model);
    const response = await chain.invoke({
      input: query,
    });

    return `${response.content}`;
  }
}
