import { OpenAI } from 'openai';
import { Uploadable } from 'openai/uploads';
import { env } from '../../env';
import { IAiService } from '../../contracts/ai';

export class OpenAiService implements IAiService {
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
}
