/**
 * https://github.com/kennethjiang/js-file-download/blob/master/file-download.js
 * https://github.com/AleeeKoi/js-file-downloader/blob/master/src/index.js
 * @author trydofor
 * @since 2021-11-10
 * @see {@link http://github.com/trydofor | trydofor}
 */

export function saveFile(blob: Blob, name: string): void {
  // native IE
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const navigator = window.navigator as any;
  if (navigator.msSaveOrOpenBlob) {
    navigator.msSaveOrOpenBlob(blob, name);
    return;
  }

  const tempLink = document.createElement('a');
  const blobUrl = URL.createObjectURL(blob);
  try {
    tempLink.style.display = 'none';
    tempLink.href = blobUrl;
    tempLink.setAttribute('download', name);
    tempLink.setAttribute('target', '_blank');

    document.body.appendChild(tempLink);
    let event;
    try {
      event = new MouseEvent('click');
    } catch (e) {
      event = document.createEvent('MouseEvent');
      event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    tempLink.dispatchEvent(event);
  } finally {
    // Fixes "webkit blob resource error 1"
    setTimeout(function () {
      document.body.removeChild(tempLink);
      (window.URL || window.webkitURL || window).revokeObjectURL(blobUrl);
    }, 1000 * 10);
  }
}
