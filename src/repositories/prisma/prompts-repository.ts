import { prisma } from './prisma';
import { IPromptsRepository, IPrompt } from '../../contracts/prompts';

export class PrismaPromptsRepository implements IPromptsRepository {
  public async getAll(): Promise<IPrompt[]> {
    const prompts = await prisma.prompt.findMany();

    return prompts;
  }
}
