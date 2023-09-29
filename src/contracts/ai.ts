import { ReadStream } from 'node:fs';

interface ITranscription {
  text: string;
}

export interface IAiService {
  createAudioTranscription(
    file: ReadStream,
    prompt: string
  ): Promise<ITranscription>;
  createChatCompletion(
    temperature: number,
    message: string
  ): Promise<ReadableStream>;
}
