import { IVideosRepository } from '../contracts/videos';
import { IAiService } from '../contracts/ai';

interface IRequest {
  id: string;
  prompt: string;
  temperature: number;
}

export class DescribeVideoUseCase {
  constructor(
    private videosRepository: IVideosRepository,
    private aiService: IAiService
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
    return this.aiService.createChatCompletion(temperature, message);
  }
}
