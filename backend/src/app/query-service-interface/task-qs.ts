export class TaskDto {
  public readonly id: string;
  public readonly title: string;
  public readonly content: string;

  public constructor(props: { id: string; title: string; content: string }) {
    const { id, title, content } = props;
    this.id = id;
    this.title = title;
    this.content = content;
  }
}

export interface ITaskQS {
  getAll(): Promise<TaskDto[]>;
}
