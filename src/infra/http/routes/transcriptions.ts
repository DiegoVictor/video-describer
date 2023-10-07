import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { streamToResponse } from 'ai';
import { makeCreateTranscriptionUseCase } from '../../../use-cases/factory/make-create-transcription-use-case';
import { makeDescribeVideoUseCase } from '../../../use-cases/factory/make-describe-video-use-case';
import { HttpResponse } from '../../helpers/http-response';

export async function transcriptions(app: FastifyInstance) {
  app.post('/videos/:id/transcription', async (request, reply) => {
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
    const result = await createTranscriptionUseCase.execute({
      id,
      prompt,
    });

    return HttpResponse.parse(result, reply);
  });

  app.post('/videos/:id/generate', async (request, reply) => {
    const { id } = z
      .object({
        id: z.string().uuid(),
      })
      .parse(request.params);

    const { prompt, temperature } = z
      .object({
        prompt: z.string(),
        temperature: z.number().min(0).max(1).default(0.5),
      })
      .parse(request.body);

    const describeVideoUseCase = makeDescribeVideoUseCase();
    const result = await describeVideoUseCase.execute({
      id,
      prompt,
      temperature,
    });

    if (!result.isSuccess()) {
      return HttpResponse.parse(result, reply);
    }

    streamToResponse(result.value, reply.raw, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      },
    });
  });
}
