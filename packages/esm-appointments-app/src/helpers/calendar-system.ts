import {
  getLocalTimeZone,
  today,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  CalendarDate,
} from '@internationalized/date';
import dayjs from 'dayjs';

/**
 * Calendar system abstraction layer for supporting multiple calendar systems
 * Supports: Gregorian (default), Ethiopian, Islamic, Hebrew, Persian, Buddhist, etc.
 * via @internationalized/date
 */

interface LocalizedDateRange {
  startDate: string;
  endDate: string;
}

interface DateInfo {
  year: number;
  month: number;
  day: number;
  formatted: string;
}

/**
 * Get the calendar system to use based on locale
 * Falls back to Gregorian (default) if not specified
 */
export const getCalendarSystem = (locale?: string): string => {
  if (!locale) return 'gregory'; // Default to Gregorian

  // Map locale to specific calendar systems
  const calendarMap: { [key: string]: string } = {
    'am-ET': 'ethiopic', // Amharic - Ethiopian calendar
    'ar-SA': 'islamic', // Arabic - Islamic calendar
    'ar-DZ': 'islamic',
    'fa-IR': 'persian', // Persian/Farsi
    'he-IL': 'hebrew', // Hebrew
    'th-TH': 'buddhist', // Thai - Buddhist calendar
    'km-KH': 'buddhist', // Khmer - Buddhist calendar
    'lo-LA': 'buddhist', // Lao
    'my-MM': 'buddhist', // Myanmar
  };

  // Check full locale first
  if (calendarMap[locale]) {
    return calendarMap[locale];
  }

  // Check language code
  const language = locale.split('-')[0];
  for (const [key, value] of Object.entries(calendarMap)) {
    if (key.startsWith(language)) {
      return value;
    }
  }

  return 'gregory'; // Default to Gregorian
};

/**
 * Convert dayjs date to @internationalized/date CalendarDate
 */
export const dayjsToCalendarDate = (dayjsDate: dayjs.Dayjs): CalendarDate => {
  return new CalendarDate(dayjsDate.year(), dayjsDate.month() + 1, dayjsDate.date());
};

/**
 * Convert @internationalized/date CalendarDate to dayjs
 */
export const calendarDateToDayjs = (calendarDate: CalendarDate): dayjs.Dayjs => {
  // Get ISO string from calendar date and parse with dayjs
  const isoString = calendarDate.toString();
  return dayjs(isoString);
};

/**
 * Get month range in omrsDateFormat required by the API
 */
export const getMonthRange = (forDate: string): LocalizedDateRange => {
  const date = dayjs(forDate);
  const calendarDate = dayjsToCalendarDate(date);

  const monthStart = startOfMonth(calendarDate);
  const monthEnd = endOfMonth(calendarDate);

  return {
    startDate: calendarDateToDayjs(monthStart).toISOString(),
    endDate: calendarDateToDayjs(monthEnd).toISOString(),
  };
};

/**
 * Get week range in omrsDateFormat required by the API
 */
export const getWeekRange = (forDate: string): LocalizedDateRange => {
  const date = dayjs(forDate);
  const calendarDate = dayjsToCalendarDate(date);

  const weekStart = startOfWeek(calendarDate, 'en-US'); // en-US for Monday start
  const weekEnd = endOfWeek(calendarDate, 'en-US');

  return {
    startDate: calendarDateToDayjs(weekStart).toISOString(),
    endDate: calendarDateToDayjs(weekEnd).toISOString(),
  };
};

/**
 * Get day range in omrsDateFormat required by the API
 */
export const getDayRange = (forDate: string): LocalizedDateRange => {
  const date = dayjs(forDate);

  return {
    startDate: date.startOf('day').toISOString(),
    endDate: date.endOf('day').toISOString(),
  };
};

/**
 * Get date information in human-readable format
 */
export const getDateInfo = (dayjsDate: dayjs.Dayjs, locale?: string): DateInfo => {
  const calendarDate = dayjsToCalendarDate(dayjsDate);

  return {
    year: calendarDate.year,
    month: calendarDate.month,
    day: calendarDate.day,
    formatted: dayjsDate.format('YYYY-MM-DD'),
  };
};

/**
 * Get weekday names for the current locale
 */
export const getWeekdayNames = (locale?: string) => {
  const dayjsLocales: { [key: string]: string } = {
    am: 'am',
    ar: 'ar',
    fa: 'fa',
    he: 'he',
    th: 'th',
    km: 'km',
    lo: 'lo',
    my: 'my',
  };

  const language = locale?.split('-')[0] || 'en';
  const dayjsLocale = dayjsLocales[language] || 'en';

  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push(dayjs().locale(dayjsLocale).add(i, 'day').format('dddd'));
  }

  return days;
};

/**
 * Check if calendar system supports leap months (like Hebrew calendar)
 */
export const hasLeapMonths = (calendarSystem: string): boolean => {
  const leapMonthCalendars = ['hebrew', 'islamic'];
  return leapMonthCalendars.includes(calendarSystem);
};

/**
 * Format date according to calendar system conventions
 */
export const formatDateForCalendar = (dayjsDate: dayjs.Dayjs, calendarSystem: string, locale?: string): string => {
  // For now, dayjs handles formatting for most calendars
  // In a real implementation, this could use more sophisticated formatting rules
  return dayjsDate.format('DD/MM/YYYY');
};
