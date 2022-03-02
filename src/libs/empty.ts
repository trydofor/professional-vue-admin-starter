export function emptyObject<T>(obj?: T): T {
  return obj ? obj : (Object.create(null) as T);
}
export function emptyArray<T>(arr?: T[]): T[] {
  return arr ? arr : new Array<T>(0);
}
export function emptyFunction(): void {
  // ignore
}
