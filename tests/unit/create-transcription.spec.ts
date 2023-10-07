import { faker } from '@faker-js/faker';
import { factory } from '../utils/factory';
import { CreateTranscriptionUseCase } from '../../src/use-cases/create-transcription';
import { IVideo } from '../../src/contracts/videos';

const mockCreateReadStream = jest.fn();
jest.mock('node:fs', () => {
  return {
    createReadStream: (path: string) => mockCreateReadStream(path),
  };
});

describe('CreateTranscriptionUseCase', () => {
  it('should be able to create a transcription', async () => {
    const video = await factory.attrs<Required<IVideo>>('Video');
    const repository = {
      create: jest.fn(),
      findOneById: jest.fn(),
      updateById: jest.fn(),
    };
    const service = {
      createAudioTranscription: jest.fn(),
      createChatCompletion: jest.fn(),
    };

    repository.findOneById.mockResolvedValueOnce(video);

    const stream = {};
    mockCreateReadStream.mockReturnValueOnce(stream);

    const result = {
      text: faker.lorem.words(faker.number.int({ min: 50, max: 300 })),
    };
    service.createAudioTranscription.mockResolvedValueOnce(result);

    repository.updateById.mockResolvedValueOnce({ transcription: result.text });

    const createTranscriptionUseCase = new CreateTranscriptionUseCase(
      repository,
      service
    );

    const prompt = faker.lorem.words(5);
    const response = await createTranscriptionUseCase.execute({
      id: video.id,
      prompt,
    });

    expect(repository.findOneById).toHaveBeenCalledWith(video.id);
    expect(mockCreateReadStream).toHaveBeenCalledWith(video.path);
    expect(service.createAudioTranscription).toHaveBeenCalledWith(
      stream,
      prompt
    );
    expect(repository.updateById).toHaveBeenCalledWith(video.id, {
      transcription: result.text,
    });

    expect(response.value).toStrictEqual(result.text);
  });

  it('should not be able to create a transcription if the video does not exists', async () => {
    const id = faker.string.uuid();
    const repository = {
      create: jest.fn(),
      findOneById: jest.fn(),
      updateById: jest.fn(),
    };
    const service = {
      createAudioTranscription: jest.fn(),
      createChatCompletion: jest.fn(),
    };

    repository.findOneById.mockResolvedValueOnce(undefined);

    const createTranscriptionUseCase = new CreateTranscriptionUseCase(
      repository,
      service
    );

    const prompt = faker.lorem.words(5);
    const response = await createTranscriptionUseCase.execute({
      id,
      prompt,
    });

    expect(repository.findOneById).toHaveBeenCalledWith(id);
    expect(response.value).toStrictEqual({
      code: 404,
      message: 'Video Not Found',
    });
  });
});
