export const ALLOWED_FILES = ['.mp3'];

export interface IVideo {
  id?: string;
  name: string;
  path: string;
  transcription?: string | null;
}

export interface IVideosRepository {
  create(data: IVideo): Promise<IVideo>;
  findOneById(id: string): Promise<IVideo | null>;
  updateById(id: string, data: Partial<IVideo>): Promise<IVideo>;
}
