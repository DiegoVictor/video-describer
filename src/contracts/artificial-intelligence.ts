import { ReadStream } from 'node:fs';
import { ITranscription } from './transcriptions';

export interface IArtificialIntelligenceService {
  createAudioTranscription(
    file: ReadStream,
    prompt: string
  ): Promise<ITranscription>;
  createChatCompletion(
    temperature: number,
    message: string
  ): Promise<ReadableStream>;
}
