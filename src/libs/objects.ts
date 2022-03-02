// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
export function ciGet<T>(obj: any, key: string, els: T): T {
  if (obj == null) return els;

  const lk = key.toLowerCase();
  for (const k of Object.keys(obj)) {
    if (k.toLowerCase() === lk) {
      return obj[k] as T;
    }
  }
  return els;
}
