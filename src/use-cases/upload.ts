import { MultipartFile } from '@fastify/multipart';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { promisify } from 'node:util';
import { pipeline } from 'node:stream';
import { createWriteStream } from 'node:fs';
import { ALLOWED_FILES, IVideosRepository } from '../contracts/videos';

interface IRequest {
  data: MultipartFile | undefined;
}

export class UploadUseCase {
  constructor(private videoRepository: IVideosRepository) {}

  public async execute({ data }: IRequest) {
    if (!data) {
      throw new Error('Missing file input');
    }

    const ext = path.extname(data.filename);
    if (!ALLOWED_FILES.includes(ext)) {
      throw new Error(
        `Invalid file type. Allowed types: ${ALLOWED_FILES.join(', ')}.`
      );
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

    const video = await this.videoRepository.create({
      name: data.filename,
      path: uploadDestination,
    });

    return video;
  }
}
