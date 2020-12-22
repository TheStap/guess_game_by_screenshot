export function getRandomIndexFromArray<T>(array: T[]): number {
    return Math.floor(Math.random() * array.length);
}

export function getRandomItemFromArray<T>(array: T[]): T {
    return array[getRandomIndexFromArray(array)];
}