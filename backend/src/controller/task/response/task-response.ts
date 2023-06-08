import { ApiProperty } from '@nestjs/swagger';
import { TaskDto } from 'src/query/usecase/query-service-interface/task-qs';

export class GetAllTaskResponse {
  @ApiProperty({ type: () => [TaskData] })
  taskData: TaskData[];

  public constructor(params: { taskDtos: TaskDto[] }) {
    const { taskDtos } = params;
    this.taskData = taskDtos.map((dto) => new TaskData({ ...dto }));
  }
}

class TaskData {
  @ApiProperty()
  id: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  content: string;

  public constructor(params: { id: string; title: string; content: string }) {
    this.id = params.id;
    this.title = params.title;
    this.content = params.content;
  }
}
