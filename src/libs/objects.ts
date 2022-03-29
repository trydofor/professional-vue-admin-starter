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

export function copyTruthy<T>(from: T, to: T): boolean {
  if (!from) return false;

  let fd = false;
  for (const k in from) {
    if (from[k]) {
      to[k] = from[k];
      fd = true;
    }
  }

  return fd;
}
