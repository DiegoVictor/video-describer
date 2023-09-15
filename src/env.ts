import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  DATABASE_URL: z.string({
    required_error: 'Missing DATABASE_URL in environment variable',
  }),
  PORT: z.coerce
    .number({
      invalid_type_error: 'PORT must be a number',
    })
    .default(3333),
  NODE_ENV: z
    .enum(['dev', 'test'], {
      invalid_type_error:
        'NODE_ENV must one of the following: development or test',
      required_error: 'Missing NODE_ENV in environment variables',
    })
    .default('dev'),
  OPENAI_API_KEY: z.string({
    required_error: 'Missing Open AI API Key',
  }),
  HOST: z.string().default('localhost'),
});

export const env = schema.parse(process.env);
