/**
 * @file file description
 * @author trydofor
 * @since 2022-03-26
 * @see {@link http://github.com/trydofor | trydofor}
 */

export function right(str: string | string[], len = 5): string | null {
  if (str == null) return null;

  let s = null;
  if (typeof str === 'string') {
    s = str;
  } else {
    if (str.length > 0) {
      s = str[str.length - 1];
    }
  }
  if (s) {
    const ln = s.length;
    return ln <= len ? s : s.substring(ln - len);
  }
  return s;
}
