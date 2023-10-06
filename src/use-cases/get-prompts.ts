import { IPrompt, IPromptsRepository } from '../contracts/prompts';
import { IEither, success } from '../contracts/either';

export class GetPromptsUseCase {
  constructor(private promptsRepository: IPromptsRepository) {}

  public async execute(): Promise<IEither<IPrompt[]>> {
    const prompts = await this.promptsRepository.getAll();

    return success(prompts);
  }
}
