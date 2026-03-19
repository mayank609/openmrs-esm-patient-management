import { useMemo } from 'react';
import dayjs from 'dayjs';
import { useAppointmentsCalendar } from './useAppointmentsCalendar';
import { getCalendarSystem, getMonthRange, getWeekRange, getDayRange } from '../helpers/calendar-system';

type PeriodType = 'monthly' | 'weekly' | 'daily';

interface UseInternationalizedCalendarProps {
  forDate: string;
  period: PeriodType;
  locale?: string;
}

/**
 * Hook that provides internationalized calendar support
 * Handles different calendar systems (Ethiopian, Islamic, Hebrew, etc.)
 * Falls back to Gregorian for API calls since OpenMRS API typically uses Gregorian
 */
export const useInternationalizedCalendar = ({ forDate, period, locale }: UseInternationalizedCalendarProps) => {
  const calendarSystem = useMemo(() => getCalendarSystem(locale), [locale]);

  // Get date range based on period
  const dateRange = useMemo(() => {
    if (period === 'monthly') {
      return getMonthRange(forDate);
    } else if (period === 'weekly') {
      return getWeekRange(forDate);
    } else {
      return getDayRange(forDate);
    }
  }, [forDate, period]);

  // Fetch calendar events using the computed date range
  const { calendarEvents, isLoading, error } = useAppointmentsCalendar(forDate, period);

  return {
    calendarEvents,
    isLoading,
    error,
    calendarSystem,
    dateRange,
    locale,
  };
};
