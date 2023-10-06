import { FastifyInstance } from 'fastify';
import { makeGetPromptsUseCase } from '../../../use-cases/factory/make-get-prompts-use-case';
import { HttpResponse } from '../../helpers/http-response';

export async function prompts(app: FastifyInstance) {
  app.get('/prompts', async (_, reply) => {
    const getPrompts = makeGetPromptsUseCase();
    const result = await getPrompts.execute();

    return HttpResponse.parse(result, reply);
  });
}
