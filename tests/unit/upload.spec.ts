import { faker } from '@faker-js/faker';
import { Readable } from 'stream';
import { MultipartFile } from '@fastify/multipart';
import { factory } from '../utils/factory';
import { UploadUseCase } from '../../src/use-cases/upload';
import { ALLOWED_FILES, IVideo } from '../../src/contracts/videos';

const mockPromisify = jest.fn();
jest.mock('node:util', () => {
  return {
    promisify: () => mockPromisify(),
  };
});

jest.mock('node:fs', () => {
  return {
    createWriteStream: jest.fn(),
  };
});

describe('UploadUseCase', () => {
  it('should be able to upload file', async () => {
    const video: IVideo = await factory.attrs('Video');
    const repository = {
      create: jest.fn().mockResolvedValueOnce(video),
      findOneById: jest.fn(),
      updateById: jest.fn(),
    };
    const uploadUseCase = new UploadUseCase(repository);

    mockPromisify.mockReturnValueOnce(async () => {});

    const data = {
      filename: faker.helpers.slugify(faker.lorem.words(3)).concat('.mp3'),
      file: new Readable(),
    } as MultipartFile;
    const response = await uploadUseCase.execute({ data });

    expect(repository.create).toHaveBeenCalledWith({
      name: data.filename,
      path: expect.any(String),
    });
    expect(response.value).toStrictEqual(video);
  });

  it('should not be able to upload a file that is not a MP3', async () => {
    const video: IVideo = await factory.attrs('Video');
    const repository = {
      create: jest.fn().mockResolvedValueOnce(video),
      findOneById: jest.fn(),
      updateById: jest.fn(),
    };
    const uploadUseCase = new UploadUseCase(repository);

    mockPromisify.mockReturnValueOnce(async () => {});

    const data = {
      filename: faker.helpers.slugify(faker.lorem.words(3)).concat('.mp4'),
      file: new Readable(),
    } as MultipartFile;

    const response = await uploadUseCase.execute({ data });
    expect(response.value).toStrictEqual({
      code: 400,
      message: `Invalid file type. Allowed types: ${ALLOWED_FILES.join(', ')}.`,
    });
  });

  it('should not be able to upload a file that is not a MP3', async () => {
    const video: IVideo = await factory.attrs('Video');
    const repository = {
      create: jest.fn().mockResolvedValueOnce(video),
      findOneById: jest.fn(),
      updateById: jest.fn(),
    };
    const uploadUseCase = new UploadUseCase(repository);

    mockPromisify.mockReturnValueOnce(async () => {});

    const data = undefined;

    const response = await uploadUseCase.execute({ data });
    expect(response.value).toStrictEqual({
      code: 400,
      message: 'Missing file input',
    });
  });
});
