import { FastifyInstance } from 'fastify';
import { createReadStream } from 'node:fs';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { openai } from '../lib/openai';

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

    const { path } = await prisma.video.findUniqueOrThrow({
      where: {
        id,
      },
    });

    const stream = createReadStream(path);
    const response = await openai.audio.transcriptions.create({
      file: stream,
      model: 'whisper-1',
      language: 'pt',
      response_format: 'json',
      temperature: 0,
      prompt,
    });

    const { transcription } = await prisma.video.update({
      where: {
        id,
      },
      data: {
        transcription: response.text,
      },
    });

    return transcription;
  });

}
