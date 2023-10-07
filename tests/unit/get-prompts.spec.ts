import { factory } from '../utils/factory';
import { IPrompt } from '../../src/contracts/prompts';
import { GetPromptsUseCase } from '../../src/use-cases/get-prompts';

describe('GetPromptsUseCase', () => {
  it('should be able to get prompts', async () => {
    const prompts: IPrompt[] = await factory.attrsMany('Prompt', 3);
    const repository = {
      getAll: jest.fn().mockResolvedValueOnce(prompts),
    };
    const getPromptsUseCase = new GetPromptsUseCase(repository);

    const response = await getPromptsUseCase.execute();

    expect(repository.getAll).toHaveBeenCalled();
    expect(response.value).toStrictEqual(prompts);
  });
});
