import _dayjs from 'dayjs';

/* eslint-disable */
declare global {
  var dayjs: typeof _dayjs;
}
/* eslint-enable */

globalThis.dayjs = _dayjs;

export {};
