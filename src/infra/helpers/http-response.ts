import { FastifyReply } from 'fastify';
import { IEither } from '../../contracts/either';
import { IFailure } from '../../contracts/failure';

export class HttpResponse {
  public static parse<S>(
    result: IEither<S, IFailure | undefined>,
    reply: FastifyReply
  ) {
    if (result.isSuccess()) {
      return result.value;
    }

    if (result.value) {
      const { code, message } = result.value;
      return reply.status(code).send({
        message,
      });
    }

    return reply.status(500).send();
  }
}
