import { faker } from '@faker-js/faker';
import { factory } from '../utils/factory';
import { DescribeVideoUseCase } from '../../src/use-cases/describe-video';
import { IVideo } from '../../src/contracts/videos';

describe('DescribeVideoUseCase', () => {
  it('should be able to describe a video', async () => {
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

    const describeVideoUseCase = new DescribeVideoUseCase(repository, service);

    const stream = {};
    service.createChatCompletion.mockResolvedValueOnce(stream);

    const prompt = faker.lorem.words(10);
    const temperature = 0.5;
    const response = await describeVideoUseCase.execute({
      id: video.id,
      prompt,
      temperature,
    });

    expect(repository.findOneById).toHaveBeenCalledWith(video.id);
    expect(service.createChatCompletion).toHaveBeenCalledWith(
      temperature,
      prompt
    );
    expect(response.value).toStrictEqual(stream);
  });

  it('should not be able to describe a video that does not have a transcription', async () => {
    const video = await factory.attrs<Required<IVideo>>('Video', {
      transcription: undefined,
    });
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

    const describeVideoUseCase = new DescribeVideoUseCase(repository, service);

    const stream = {};
    service.createChatCompletion.mockResolvedValueOnce(stream);

    const prompt = faker.lorem.words(10);
    const temperature = 0.5;

    const response = await describeVideoUseCase.execute({
      id: video.id,
      prompt,
      temperature,
    });

    expect(repository.findOneById).toHaveBeenCalledWith(video.id);
    expect(response.value).toStrictEqual({
      code: 400,
      message: 'Transcription not generated yet',
    });
  });

  it('should not be able to describe a video that not exists', async () => {
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

    repository.findOneById.mockResolvedValueOnce(undefined);

    const describeVideoUseCase = new DescribeVideoUseCase(repository, service);

    const prompt = faker.lorem.words(10);
    const temperature = 0.5;

    const response = await describeVideoUseCase.execute({
      id: video.id,
      prompt,
      temperature,
    });

    expect(repository.findOneById).toHaveBeenCalledWith(video.id);
    expect(response.value).toStrictEqual({
      code: 404,
      message: 'Video not found',
    });
  });
});
