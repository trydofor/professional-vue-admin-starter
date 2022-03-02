// noinspection AllyPlainJsInspection

let popupWin: Window | null = null;
let popupUrl: string | null = null;

export function popupWindow(url: string, name: string, listener: (evt: MessageEvent) => void): void {
  window.removeEventListener('message', listener);

  const options = 'toolbar=no, menubar=no, width=800, height=600, top=100, left=100';

  if (popupWin == null || popupWin.closed) {
    popupWin = window.open(url, name, options);
  } else if (popupUrl !== url) {
    popupWin = window.open(url, name, options);
    popupWin?.focus();
  } else {
    popupWin.focus();
  }

  window.addEventListener('message', event => listener(event), false);
  popupUrl = url;
}

export function messageOpener(text: string, close = true): void {
  if (window.opener) {
    window.opener.postMessage(text, window.location.origin);
  }
  if (close) {
    window.close();
  }
}
