import { FastifyInstance } from 'fastify';
import { fastifyMultipart } from '@fastify/multipart';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { pipeline } from 'node:stream';
import { promisify } from 'node:util';
import { createWriteStream } from 'node:fs';
import { prisma } from '../lib/prisma';

const ALLOWED_FILES = ['.mp3'];

export async function uploads(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1048576 * 25, // 25mb
    },
  });

  app.post('/upload', async (request, reply) => {
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({
        error: 'Missing file input',
      });
    }

    const ext = path.extname(data.filename);
    if (!ALLOWED_FILES.includes(ext)) {
      return reply.status(400).send({
        error: `Invalid file type. Allowed types: ${ALLOWED_FILES.join(', ')}.`,
      });
    }

    const originalName = path.basename(data.filename, ext);
    const fileName = `${originalName}-${randomUUID()}${ext}`;

    const uploadDestination = path.resolve(
      __dirname,
      '..',
      '..',
      'tmp',
      fileName
    );

    const pump = promisify(pipeline);
    await pump(data.file, createWriteStream(uploadDestination));

    const video = await prisma.video.create({
      data: {
        name: data.filename,
        path: uploadDestination,
      },
    });

    return video;
  });
}
