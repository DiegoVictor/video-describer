import { FastifyInstance } from 'fastify';
import { createReadStream } from 'node:fs';
import { z } from 'zod';
import { streamToResponse, OpenAIStream } from 'ai';
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

  app.post('/videos/:id/summarize', async (request, reply) => {
    const { id } = z
      .object({
        id: z.string().uuid(),
      })
      .parse(request.params);

    const { template, temperature } = z
      .object({
        template: z.string(),
        temperature: z.number().min(0).max(1).default(0.5),
      })
      .parse(request.body);

    const { transcription } = await prisma.video.findUniqueOrThrow({
      where: {
        id,
      },
    });

    if (!transcription) {
      return reply.status(400).send({
        error: 'Transcription not generated yet',
      });
    }

    const message = template.replace('{transcription}', transcription);

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
      stream: true,
    });

    const stream = OpenAIStream(response);
    streamToResponse(stream, reply.raw, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      },
    });
  });
}
