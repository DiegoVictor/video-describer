import { MultipartFile } from '@fastify/multipart';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { promisify } from 'node:util';
import { pipeline } from 'node:stream';
import { createWriteStream } from 'node:fs';
import { ALLOWED_FILES, IVideo, IVideosRepository } from '../contracts/videos';
import { IEither, failure, success } from '../contracts/either';
import { IFailure } from '../contracts/failure';

interface IRequest {
  data: MultipartFile | undefined;
}

export class UploadUseCase {
  constructor(private videoRepository: IVideosRepository) {}

  public async execute({ data }: IRequest): Promise<IEither<IVideo, IFailure>> {
    if (!data) {
      return failure({
        message: 'Missing file input',
        code: 400,
      });
    }

    const ext = path.extname(data.filename);
    if (!ALLOWED_FILES.includes(ext)) {
      return failure({
        message: `Invalid file type. Allowed types: ${ALLOWED_FILES.join(
          ', '
        )}.`,
        code: 400,
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

    const video = await this.videoRepository.create({
      name: data.filename,
      path: uploadDestination,
    });

    return success(video);
  }
}
