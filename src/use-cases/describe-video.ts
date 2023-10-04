import { IVideosRepository } from '../contracts/videos';
import { IArtificialIntelligenceService } from '../contracts/artificial-intelligence';

interface IRequest {
  id: string;
  prompt: string;
  temperature: number;
}

export class DescribeVideoUseCase {
  constructor(
    private videosRepository: IVideosRepository,
    private artificialIntelligenceService: IArtificialIntelligenceService
  ) {}

  public async execute({ id, prompt, temperature }: IRequest) {
    const video = await this.videosRepository.findOneById(id);

    if (!video) {
      throw new Error('Video Not Found');
    }

    const { transcription } = video;
    if (!transcription) {
      throw new Error('Transcription not generated yet');
    }

    const message = prompt.replace('{transcription}', transcription);
    return this.artificialIntelligenceService.createChatCompletion(
        temperature,
        message
      );
  }
}
