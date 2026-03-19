import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { type DailyAppointmentsCountByService } from '../../types';
import { weekDays } from '../../helpers';
import { useSelectedDate } from '../../hooks/useSelectedDate';
import CalendarCell from '../common/calendar-cell.component';
import styles from './weekly-calendar-view.scss';

interface WeeklyCalendarViewProps {
  events: Array<DailyAppointmentsCountByService>;
  onDaySelect: (dateTime: dayjs.Dayjs) => void;
  selectedDate?: dayjs.Dayjs;
  onModalOpen?: (dateTime: dayjs.Dayjs, serviceUuid?: string) => void;
}

const WeeklyCalendarView: React.FC<WeeklyCalendarViewProps> = ({
  events,
  onDaySelect,
  selectedDate: propSelectedDate,
  onModalOpen,
}) => {
  const { t } = useTranslation();
  const defaultSelectedDate = useSelectedDate();
  const selectedDate = propSelectedDate || dayjs(defaultSelectedDate);

  const days = weekDays(selectedDate);
  const weekStart = dayjs(selectedDate).startOf('week');
  const weekEnd = dayjs(selectedDate).endOf('week');

  return (
    <div className={styles.weeklyCalendarView}>
      <div className={styles.weekHeader}>
        <p className={styles.weekRange}>
          {t('weekOf', 'Week of')} {weekStart.format('MMM D')} - {weekEnd.format('MMM D, YYYY')}
        </p>
      </div>

      <div className={styles.weekGrid}>
        {days.map((day, i) => (
          <CalendarCell
            key={i}
            dateTime={day}
            events={events}
            onCellClick={onDaySelect}
            isCurrentMonth={true}
            isLargeCell={true}
          />
        ))}
      </div>
    </div>
  );
};

export default WeeklyCalendarView;
