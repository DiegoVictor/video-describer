import { PrismaVideosRepository } from '../../infra/repositories/prisma/videos-repository';
import { OpenAiService } from '../../infra/services/openai';
import { DescribeVideoUseCase } from '../describe-video';

export function makeDescribeVideoUseCase(): DescribeVideoUseCase {
  const videosRepository = new PrismaVideosRepository();
  const openAiService = new OpenAiService();
  const describeVideoUseCase = new DescribeVideoUseCase(
    videosRepository,
    openAiService
  );

  return describeVideoUseCase;
}
