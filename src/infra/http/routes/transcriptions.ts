import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { makeCreateTranscriptionUseCase } from '../../../use-cases/factory/make-create-transcription-use-case';
export async function transcriptions(app: FastifyInstance) {
  app.post('/videos/:id/transcription', async request => {
    const { id } = z
      .object({
        id: z.string().uuid(),
      })
      .parse(request.params);

    const { prompt } = z
      .object({
        prompt: z.string(),
      })
      .parse(request.body);

    const createTranscriptionUseCase = makeCreateTranscriptionUseCase();
    const transcription = await createTranscriptionUseCase.execute({
      id,
      prompt,
    });

    return transcription;
  });

}
