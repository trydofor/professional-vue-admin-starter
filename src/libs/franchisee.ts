import { isProduction } from '@/configs/global';

export function isFranchisee() {
  if (isProduction) {
    const host = window.location.hostname.toLowerCase();
    return !host.endsWith('buybuylabel.com');
  } else {
    return JSON.parse(sessionStorage.getItem('franchisee') as string) as boolean;
  }
}
