const UserStatus = {
  Zaiseki: '在籍中',
  Kyukai: '休会中',
  Taikai: '退会済',
};

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
