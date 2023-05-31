import { Either, left, right } from 'fp-ts/lib/Either';

export const TaskStatusValues = {
  Yet: '未着手',
  Waiting: 'レビュー待ち',
  Done: '完了',
} as const;

/** 未着手 */
export const Yet = Symbol();
/** レビュー待ち */
export const Waiting = Symbol();
/** 完了 */
export const Done = Symbol();
/** 課題進捗ステータス */
export type TaskStatusValue = typeof Yet | typeof Waiting | typeof Done;

/**
 * 文字列から課題進捗ステータスの型へ変換します。
 *
 * @param status 課題進捗ステータスの文字列
 * @returns 課題進捗ステータスの型
 */
export const createTaskStatusValue = (
  status: string,
): Either<Error, TaskStatusValue> => {
  switch (status) {
    case TaskStatusValues.Yet:
      return right(Yet);
    case TaskStatusValues.Waiting:
      return right(Waiting);
    case TaskStatusValues.Done:
      return right(Done);
  }
  return left(
    new Error(
      '不正な値です。未着手, レビュー待ち, 完了を指定してください。: ' + status,
    ),
  );
};

/**
 * 課題進捗ステータスの型から文字列へ変換します。
 *
 * @param taskStatus 課題進捗ステータスの型
 * @returns 課題進捗ステータスの文字列
 */
export const getTaskStatusValue = (taskStatus: TaskStatusValue) => {
  switch (taskStatus) {
    case Yet:
      return TaskStatusValues.Yet;
    case Waiting:
      return TaskStatusValues.Waiting;
    case Done:
      return TaskStatusValues.Done;
  }
};
