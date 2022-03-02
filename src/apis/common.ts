import client, { Result } from '@/apis/api-client';

/**
 * @file file description
 * @author trydofor
 * @since 2021-11-10
 * @see {@link http://github.com/trydofor | trydofor}
 */

export function downloadLabel(trackNum: string, fedex: boolean): void {
  const name = trackNum + '.pdf';
  const url = (fedex ? '/admin/label/res-id-' : '/admin/whlabel/res-id-') + trackNum + '.pdf';
  client.downloadFile(name, url);
}

export function listState(doSuccess: (result: Result<Record<string, string>>) => void): void {
  const url = '/pub/state.json';
  client.handJson<Result<Record<string, string>>>(url, doSuccess);
}
