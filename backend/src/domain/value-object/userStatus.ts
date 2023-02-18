const UserStatusValues = {
  Zaiseki: '在籍中',
  Kyukai: '休会中',
  Taikai: '退会済',
} as const;

export const Zaiseki = Symbol();
export const Kyukai = Symbol();
export const Taikai = Symbol();
export type UserStatus = typeof Zaiseki | typeof Kyukai | typeof Taikai;

export function createUserStatus(status: string): UserStatus {
  switch (status) {
    case UserStatusValues.Zaiseki:
      return Zaiseki;
    case UserStatusValues.Kyukai:
      return Kyukai;
    case UserStatusValues.Taikai:
      return Taikai;
  }
  throw Error(
    '不正な値です。在籍中, 休会中, 退会済を指定してください。: ' + status,
  );
}
