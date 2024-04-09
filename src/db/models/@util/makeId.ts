export default function makeId<T extends { [key in string]: number | string }>(
  t: T
): { [K in keyof T]: T[K] } & {
  getList(copy?: boolean): T[keyof T][];
} {
  const keys = Object.keys(t);
  const values = keys.map((k) => t[k]);

  const result: any = {
    getList(copy = false): (number | string)[] {
      if (copy) {
        return [...values];
      } else {
        return values;
      }
    },
  };

  keys.forEach((k) => {
    result[k] = t[k];
  });

  return result;
}
