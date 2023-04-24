const ParticipantStatusValues = {
  Zaiseki: '在籍中',
  Kyukai: '休会中',
  Taikai: '退会済',
} as const;

export const Zaiseki = Symbol(ParticipantStatusValues.Zaiseki);
export const Kyukai = Symbol(ParticipantStatusValues.Kyukai);
export const Taikai = Symbol(ParticipantStatusValues.Taikai);
export type ParticipantStatus = typeof Zaiseki | typeof Kyukai | typeof Taikai;

export function getParticipantStatusValue(status: ParticipantStatus): string {
  switch (status) {
    case Zaiseki:
      return ParticipantStatusValues.Zaiseki;
    case Kyukai:
      return ParticipantStatusValues.Kyukai;
    case Taikai:
      return ParticipantStatusValues.Taikai;
  }
  throw new Error();
}

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
