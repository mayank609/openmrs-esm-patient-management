/**
 * Supported calendar systems for the appointments module
 * Based on @internationalized/date which supports 13 calendar systems
 */

export interface CalendarSystemConfig {
  key: string;
  name: string;
  description: string;
  locales: string[];
  yearOffsetFromGregorian?: number;
}

export const SUPPORTED_CALENDAR_SYSTEMS: CalendarSystemConfig[] = [
  {
    key: 'gregory',
    name: 'Gregorian',
    description: 'The ISO 8601 calendar system used in most Western countries',
    locales: ['en-US', 'en-GB', 'en-AU', 'fr-FR', 'de-DE', 'es-ES', 'it-IT'],
  },
  {
    key: 'ethiopic',
    name: 'Ethiopian',
    description: 'The Ethiopic calendar used in Ethiopia, 7-8 years behind Gregorian',
    locales: ['am-ET', 'om-ET', 'ti-ET'],
    yearOffsetFromGregorian: -7,
  },
  {
    key: 'islamic',
    name: 'Islamic',
    description: 'The Hijri calendar used in Islamic countries and communities',
    locales: ['ar-SA', 'ar-AE', 'ar-EG', 'ar-DZ'],
  },
  {
    key: 'hebrew',
    name: 'Hebrew',
    description: 'The Hebrew calendar used by the Jewish community',
    locales: ['he-IL'],
  },
  {
    key: 'persian',
    name: 'Persian',
    description: 'The Persian (Solar Hijri) calendar used in Iran and Afghanistan',
    locales: ['fa-IR'],
  },
  {
    key: 'buddhist',
    name: 'Buddhist',
    description: 'The Buddhist calendar used in Southeast Asia',
    locales: ['th-TH', 'km-KH', 'lo-LA', 'my-MM'],
    yearOffsetFromGregorian: 543,
  },
];

/**
 * Get calendar system config by key
 */
export const getCalendarSystemConfig = (key: string): CalendarSystemConfig | undefined => {
  return SUPPORTED_CALENDAR_SYSTEMS.find((c) => c.key === key);
};

/**
 * Get calendar system by locale
 */
export const getCalendarSystemByLocale = (locale: string): CalendarSystemConfig | undefined => {
  // Try exact match first
  let config = SUPPORTED_CALENDAR_SYSTEMS.find((c) => c.locales.includes(locale));

  // Try language code match if exact locale not found
  if (!config) {
    const language = locale.split('-')[0];
    config = SUPPORTED_CALENDAR_SYSTEMS.find((c) => c.locales.some((l) => l.startsWith(language)));
  }

  return config;
};

/**
 * Default calendar system settings
 */
export const DEFAULT_CALENDAR_SYSTEM = 'gregory';

/**
 * Calendar system feature flags
 */
export const CALENDAR_SYSTEM_FEATURES = {
  MULTI_LANGUAGE: true,
  LOCALE_DETECTION: true,
  CALENDAR_SELECTOR: true,
  TIMEZONE_AWARE: true,
};
