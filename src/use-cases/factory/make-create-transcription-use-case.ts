import { PrismaVideosRepository } from '../../infra/repositories/prisma/videos-repository';
import { OpenAiService } from '../../infra/services/openai';
import { CreateTranscriptionUseCase } from '../create-transcription';

export function makeCreateTranscriptionUseCase(): CreateTranscriptionUseCase {
  const videosRepository = new PrismaVideosRepository();
  const openAiService = new OpenAiService();
  const createTranscriptionUseCase = new CreateTranscriptionUseCase(
    videosRepository,
    openAiService
  );

  return createTranscriptionUseCase;
}
