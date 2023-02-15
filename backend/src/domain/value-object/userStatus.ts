const UserStatus = {
  Zaiseki: '在籍',
  Kyukai: '休会',
  Taikai: '退会',
};

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
