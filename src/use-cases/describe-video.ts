import { IVideosRepository } from '../contracts/videos';
import { IArtificialIntelligenceService } from '../contracts/artificial-intelligence';
import { IEither, failure, success } from '../contracts/either';
import { IFailure } from '../contracts/failure';

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

  public async execute({
    id,
    prompt,
    temperature,
  }: IRequest): Promise<IEither<ReadableStream, IFailure>> {
    const video = await this.videosRepository.findOneById(id);

    if (!video) {
      return failure({
        code: 404,
        message: 'Video not found',
      });
    }

    const { transcription } = video;
    if (!transcription) {
      return failure({
        message: 'Transcription not generated yet',
        code: 400,
      });
    }

    const message = prompt.replace('{transcription}', transcription);
    const stream =
      await this.artificialIntelligenceService.createChatCompletion(
        temperature,
        message
      );

    return success(stream);
  }
}
