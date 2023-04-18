import { v4 as uuidv4 } from 'uuid';

export const createRandomIdString = () => {
  return uuidv4();
};

export const randomChoice = <T>(list: T[]) => {
  return list[Math.floor(Math.random() * list.length)];
};
