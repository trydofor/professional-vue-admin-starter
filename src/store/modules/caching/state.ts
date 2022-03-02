/**
 * @file file description
 * @author trydofor
 * @since 2021-10-12
 * @see {@link http://github.com/trydofor | trydofor}
 */

export interface ViewData {
  path: string;
  name: string;
}

export interface CachingState {
  views: ViewData[];
}
