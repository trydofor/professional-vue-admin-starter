import { refStore } from '@/store';

/**
 * @file file description
 * @author trydofor
 * @since 2021-11-18
 * @see {@link http://github.com/trydofor | trydofor}
 */

/**
 * 参数为empty，则返回empty
 * @param needs
 * @param empty
 */
export function hasPermit(needs: string | string[] | undefined, empty: boolean | null = null): boolean | null {
  if (typeof needs === 'string') {
    const perms = refStore().state.authn.permits;
    return perms.includes(needs);
  } else if (Array.isArray(needs) && needs.length > 0) {
    const perms = refStore().state.authn.permits;
    return perms.some(it => needs.includes(it));
  }
  return empty;
}

export function setPermit(perm: string[] | undefined): void {
  const store = refStore();
  if (perm && perm.length > 0) {
    store.commit('authn/permits', perm);
  } else {
    store.commit('authn/permits', ['NO_PERMIT']);
  }
}
