const ParticipantStatusValues = {
  Zaiseki: '在籍中',
  Kyukai: '休会中',
  Taikai: '退会済',
} as const;

/** 在籍中 */
export const Zaiseki = Symbol(ParticipantStatusValues.Zaiseki);
/** 休会中 */
export const Kyukai = Symbol(ParticipantStatusValues.Kyukai);
/** 退会済 */
export const Taikai = Symbol(ParticipantStatusValues.Taikai);
/** 参加者在籍ステータス */
export type ParticipantStatus = typeof Zaiseki | typeof Kyukai | typeof Taikai;

/**
 * 文字列から参加者在籍ステータスの型へ変換します。
 *
 * @param status 参加者在籍ステータスの文字列
 * @returns 参加者在籍ステータスの型
 */
export function createUserStatus(status: string): ParticipantStatus {
  switch (status) {
    case ParticipantStatusValues.Zaiseki:
      return Zaiseki;
    case ParticipantStatusValues.Kyukai:
      return Kyukai;
    case ParticipantStatusValues.Taikai:
      return Taikai;
  }
  throw Error(
    '不正な値です。在籍中, 休会中, 退会済を指定してください。: ' + status,
  );
}

/**
 * 参加者在籍ステータスの型から文字列へ変換します。
 *
 * @param status 参加者在籍ステータスの型
 * @returns 参加者在籍ステータスの文字列
 */
export function getParticipantStatusValue(status: ParticipantStatus): string {
  switch (status) {
    case Zaiseki:
      return ParticipantStatusValues.Zaiseki;
    case Kyukai:
      return ParticipantStatusValues.Kyukai;
    case Taikai:
      return ParticipantStatusValues.Taikai;
  }
}
