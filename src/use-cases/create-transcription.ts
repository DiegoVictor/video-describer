import { createReadStream } from 'node:fs';
import { IVideosRepository } from '../contracts/videos';
import { IArtificialIntelligenceService } from '../contracts/artificial-intelligence';
import { IEither, failure, success } from '../contracts/either';
import { IFailure } from '../contracts/failure';

interface IRequest {
  id: string;
  prompt: string;
}

export class CreateTranscriptionUseCase {
  constructor(
    private videosRepository: IVideosRepository,
    private artificialIntelligenceService: IArtificialIntelligenceService
  ) {}

  public async execute({
    id,
    prompt,
  }: IRequest): Promise<IEither<string | null | undefined, IFailure>> {
    const video = await this.videosRepository.findOneById(id);

    if (!video) {
      return failure({
        message: 'Video Not Found',
        code: 404,
      });
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

    return success(transcription);
  }
}
