import {
  Composer,
  createI18n,
  LocaleMessages,
  LocaleMessageValue,
  useI18n as baseUseI18n,
  VueMessageType,
} from 'vue-i18n';
import { disableI18n, localeDeclare, localeDefault, localeFallback } from '@/configs/global';
import { DateTimeSchema, MessageSchema, NumberSchema } from '@/locale/schema';

const partialMessages: Record<string, unknown> = {};
const localeKeys: string[] = [];
const moduleFiles = require.context('./lang', true, /\.js$/);
for (const key of moduleFiles.keys()) {
  const matched = key.match(/([0-9a-z-]+)\./i);
  if (matched && matched.length > 1) {
    const lc = matched[1];
    if (!disableI18n || lc === localeDefault || lc === localeFallback) {
      localeKeys.push(lc);
      partialMessages[lc] = moduleFiles(key).default;
    }
  }
}

const i18n = createI18n<false>({
  legacy: false,
  locale: localeDefault,
  fallbackLocale: localeFallback,
  messages: partialMessages as LocaleMessages<Record<string, LocaleMessageValue<VueMessageType>>>,
  globalInjection: false, // 不需要全局注入
});

export function useI18n(): Composer<
  { [localeDeclare]: MessageSchema },
  { [localeDeclare]: DateTimeSchema },
  { [localeDeclare]: NumberSchema },
  string,
  typeof localeDeclare,
  typeof localeDeclare
> {
  // https://youtrack.jetbrains.com/issue/WEB-52090
  return baseUseI18n<
    {
      message: MessageSchema;
      datetime: DateTimeSchema;
      number: NumberSchema;
    },
    typeof localeDeclare
  >();
}

export function standardLocale(value?: string): string {
  if (!value || value.length < 2) return localeDefault;

  for (const lang of localeKeys) {
    if (value === lang) {
      return lang;
    }
  }
  const lc = value.substr(0, 2);
  for (const lang of localeKeys) {
    if (lang.startsWith(lc[0])) {
      return lang;
    }
  }
  return localeDefault;
}

export function getLocaleMessage(locale?: string): unknown {
  return partialMessages[standardLocale(locale)];
}

export const supportLocales = localeKeys;
export const defaultMessage = partialMessages[localeDefault];

export const I18nKey = {
  locale: (key: string): string => 'Locale.' + key,
  router: (key: string): string => 'Router.' + key,
};

export default i18n;
