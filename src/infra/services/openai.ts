import { OpenAI } from 'openai';
import { Uploadable } from 'openai/uploads';
import { OpenAIStream } from 'ai';
import { env } from '../../env';
import { IArtificialIntelligenceService } from '../../contracts/artificial-intelligence';

export class OpenAiService implements IArtificialIntelligenceService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });
  }

  public async createAudioTranscription(file: Uploadable, prompt: string) {
    return this.openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      language: 'pt',
      response_format: 'json',
      temperature: 0,
      prompt,
    });
  }

  public async createChatCompletion(temperature: number, message: string) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
      stream: true,
    });

    return OpenAIStream(response);
  }
}
