import { IPromptsRepository } from '../contracts/prompts';

export class GetPromptsUseCase {
  constructor(private promptsRepository: IPromptsRepository) {}

  public async execute() {
    const prompts = await this.promptsRepository.getAll();

    return prompts;
  }
}
