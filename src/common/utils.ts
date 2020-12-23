export function getRandomNumber(min: number, max: number): number {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

export function getRandomIndexFromArray<T>(array: T[]): number {
    return getRandomNumber(0, array.length - 1)
}

export function getRandomItemFromArray<T>(array: T[]): T {
    return array[getRandomIndexFromArray(array)];
}