import { FastifyInstance } from 'fastify';
import { fastifyMultipart } from '@fastify/multipart';
import { makeUploadUseCase } from '../../../use-cases/factory/make-upload-use-case';

export async function uploads(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1048576 * 25, // 25mb
    },
  });

  app.post('/upload', async request => {
    const data = await request.file();

    const uploadUseCase = makeUploadUseCase();
    const video = await uploadUseCase.execute({ data });

    return video;
  });
}
