import { createReadStream } from 'node:fs';
import { IVideosRepository } from '../contracts/videos';
import { IAiService } from '../contracts/ai';

interface IRequest {
  id: string;
  prompt: string;
}

export class CreateTranscriptionUseCase {
  constructor(
    private videosRepository: IVideosRepository,
    private aiService: IAiService
  ) {}

  public async execute({ id, prompt }: IRequest) {
    const video = await this.videosRepository.findOneById(id);

    if (!video) {
      throw new Error('Video Not Found');
    }

    const { path } = video;
    const stream = createReadStream(path);

    const response = await this.aiService.createAudioTranscription(
      stream,
      prompt
    );

    const { transcription } = await this.videosRepository.updateById(id, {
      transcription: response.text,
    });

    return transcription;
  }
}
