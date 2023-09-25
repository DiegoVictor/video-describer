import { fastify } from 'fastify';
import { fastifyCors } from '@fastify/cors';
import { prompts } from './routes/prompts';
import { uploads } from './routes/uploads';
import { transcriptions } from './routes/transcriptions';
import { env } from '../../env';

const app = fastify();

app.register(fastifyCors, {
  origin: '*',
});

app.register(prompts);
app.register(uploads);
app.register(transcriptions);

app
  .listen({
    port: env.PORT,
    host: env.HOST,
  })
  .then(() => {
    console.log('HTTP Server Running!');
  });
