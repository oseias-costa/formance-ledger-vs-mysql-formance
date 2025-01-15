export const splitIntoBatches = (arr: any[], batchSize: number) =>
  arr.map((_, index) => arr.slice(index * batchSize, (index + 1) * batchSize));
