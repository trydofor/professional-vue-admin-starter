/**
 * @file file description
 * @author trydofor
 * @since 2021-10-04
 * @see {@link http://github.com/trydofor | trydofor}
 */

export interface Captcha {
  path?: string;
  code?: string;
}

export interface AuthnState {
  token: string;
  name: string;
  captcha: Captcha;
  permits: string[];
}
