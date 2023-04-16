export const TaskStatusValues = {
  Yet: '未着手',
  Waiting: 'レビュー待ち',
  Done: '完了',
} as const;

export const Yet = Symbol();
export const Waiting = Symbol();
export const Done = Symbol();
export type TaskStatusValue = typeof Yet | typeof Waiting | typeof Done;

export function createTaskStatusValue(status: string): TaskStatusValue {
  switch (status) {
    case TaskStatusValues.Yet:
      return Yet;
    case TaskStatusValues.Waiting:
      return Waiting;
    case TaskStatusValues.Done:
      return Done;
  }
  throw Error(
    '不正な値です。未着手, レビュー待ち, 完了を指定してください。: ' + status,
  );
}

export const convertToString = (taskStatus: TaskStatusValue) => {
  switch (taskStatus) {
    case Yet:
      return TaskStatusValues.Yet;
    case Waiting:
      return TaskStatusValues.Waiting;
    case Done:
      return TaskStatusValues.Done;
  }
};
