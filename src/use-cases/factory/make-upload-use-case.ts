import { PrismaVideosRepository } from '../../infra/repositories/prisma/videos-repository';
import { UploadUseCase } from '../upload';

export function makeUploadUseCase(): UploadUseCase {
  const videosRepository = new PrismaVideosRepository();
  const uploadUseCase = new UploadUseCase(videosRepository);

  return uploadUseCase;
}
