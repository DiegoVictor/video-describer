import { FastifyInstance } from 'fastify';
import { makeGetPromptsUseCase } from '../../../use-cases/factory/make-get-prompts-use-case';

export async function prompts(app: FastifyInstance) {
  app.get('/prompts', async () => {
    const getPrompts = makeGetPromptsUseCase();
    const prompts = await getPrompts.execute();

    return prompts;
  });
}
