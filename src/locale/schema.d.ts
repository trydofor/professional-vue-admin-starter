import enUS from '@/locale/json/en-US.json';

export type MessageSchema = typeof enUS;

export type DateTimeSchema = {
  short: {
    hour: 'numeric';
    minute: 'numeric';
    second: 'numeric';
    timeZoneName: 'short';
    timezone: string;
  };
};

export type NumberSchema = {
  currency: {
    style: 'currency';
    currencyDisplay: 'symbol';
    currency: string;
  };
};

// /* eslint-disable @typescript-eslint/no-unused-vars */
// // noinspection ES6UnusedImports
// import { DefineDateTimeFormat, DefineLocaleMessage, DefineNumberFormat } from 'vue-i18n';
//
// declare module 'vue-i18n' {
//   // eslint-disable-next-line
//   export declare interface DefineLocaleMessage extends MessageSchema {}
//   // eslint-disable-next-line
//   export declare interface DefineDateTimeFormat extends DateTimeSchema {}
//   // eslint-disable-next-line
//   export declare interface DefineNumberFormat extends NumberSchema {}
// }
