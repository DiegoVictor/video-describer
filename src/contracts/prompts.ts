export interface IPrompt {
  id?: string;
  title: string;
  template: string;
}

export interface IPromptsRepository {
  getAll(): Promise<IPrompt[]>;
}
