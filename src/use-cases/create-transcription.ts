import { createReadStream } from 'node:fs';
import { IVideosRepository } from '../contracts/videos';
import { IArtificialIntelligenceService } from '../contracts/artificial-intelligence';

interface IRequest {
  id: string;
  prompt: string;
}

export class CreateTranscriptionUseCase {
  constructor(
    private videosRepository: IVideosRepository,
    private artificialIntelligenceService: IArtificialIntelligenceService
  ) {}

  public async execute({ id, prompt }: IRequest) {
    const video = await this.videosRepository.findOneById(id);

    if (!video) {
      throw new Error('Video Not Found');
    }

    const { path } = video;
    const stream = createReadStream(path);

    const response =
      await this.artificialIntelligenceService.createAudioTranscription(
        stream,
        prompt
      );

    const { transcription } = await this.videosRepository.updateById(id, {
      transcription: response.text,
    });

    return transcription;
  }
}
