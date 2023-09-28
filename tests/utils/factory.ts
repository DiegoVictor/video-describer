import { factory } from 'factory-girl';
import { faker } from '@faker-js/faker';

factory.define(
  'Prompt',
  {},
  {
    id: faker.string.uuid,
    title: faker.lorem.words,
    template: faker.lorem.slug,
  }
);

factory.define(
  'Video',
  {},
  {
    id: faker.string.uuid,
    name: faker.system.fileName,
    path: faker.system.filePath,
    transcription: () =>
      faker.lorem.words(faker.number.int({ min: 50, max: 300 })),
  }
);

export { factory };
