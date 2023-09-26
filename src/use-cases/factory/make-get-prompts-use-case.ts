import { PrismaPromptsRepository } from '../../infra/repositories/prisma/prompts-repository';
import { GetPromptsUseCase } from '../get-prompts';

export function makeGetPromptsUseCase(): GetPromptsUseCase {
  const promptsRepository = new PrismaPromptsRepository();
  const getPromptsUseCase = new GetPromptsUseCase(promptsRepository);

  return getPromptsUseCase;
}
