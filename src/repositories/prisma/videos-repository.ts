import { prisma } from './prisma';
import { IVideosRepository, IVideo } from '../../contracts/videos';

export class PrismaVideosRepository implements IVideosRepository {
  public async create(data: IVideo): Promise<IVideo> {
    const video = await prisma.video.create({
      data,
    });

    return video;
  }

  public async findOneById(id: string): Promise<IVideo | null> {
    const video = await prisma.video.findUnique({
      where: {
        id,
      },
    });

    return video;
  }

  public async updateById(id: string, data: Partial<IVideo>): Promise<IVideo> {
    const video = await prisma.video.update({
      where: {
        id,
      },
      data,
    });

    return video;
  }
}
