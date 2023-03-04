export const randomChoice = <T>(list: T[]) => {
    return list[Math.floor(Math.random() * list.length)];
}
