// noinspection AllyPlainJsInspection

/**
 * @file file description
 * @author trydofor
 * @since 2021-11-10
 * @see {@link http://github.com/trydofor | trydofor}
 */

export const enum OrderStatus {
  UPCOMING = 'UPCOMING',
  UNSENT = 'UNSENT',
  SENDING = 'SENDING',
  STORING = 'STORING',
  BACKING = 'BACKING',
  SIGNED = 'SIGNED',
}

export const enum QueryType {
  OrderNum = 'OrderNum',
  FedexNum = 'FedexNum',
  Email = 'Email',
}
