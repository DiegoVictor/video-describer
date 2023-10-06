import { FastifyInstance } from 'fastify';
import { fastifyMultipart } from '@fastify/multipart';
import { makeUploadUseCase } from '../../../use-cases/factory/make-upload-use-case';
import { HttpResponse } from '../../helpers/http-response';

export async function uploads(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1048576 * 25, // 25mb
    },
  });

  app.post('/upload', async (request, reply) => {
    const data = await request.file();

    const uploadUseCase = makeUploadUseCase();
    const result = await uploadUseCase.execute({ data });

    return HttpResponse.parse(result, reply);
  });
}
