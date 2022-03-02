import { AuthnState } from '@/store/modules/authn/state';
import { SettingState } from '@/store/modules/setting/state';
import { CachingState } from '@/store/modules/caching/state';

/**
 * @file 建议一层modules，即modules下面不要再有modules
 * @author trydofor
 * @since 2021-10-04
 * @see {@link http://github.com/trydofor | trydofor}
 */

export interface RootState {
  authn: AuthnState;
  setting: SettingState;
  caching: CachingState;
}
