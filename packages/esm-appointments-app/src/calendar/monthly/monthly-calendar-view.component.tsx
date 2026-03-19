import React from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { type DailyAppointmentsCountByService } from '../../types';
import { monthDays } from '../../helpers';
import MonthlyViewWorkload from './monthly-workload-view.component';
import MonthlyHeader from './monthly-header.component';
import { useSelectedDate } from '../../hooks/useSelectedDate';
import styles from '../appointments-calendar-view-view.scss';

dayjs.extend(isBetween);

interface MonthlyCalendarViewProps {
  events: Array<DailyAppointmentsCountByService>;
  onDaySelect?: (dateTime: dayjs.Dayjs) => void;
  onModalOpen?: (dateTime: dayjs.Dayjs, serviceUuid?: string) => void;
}

const MonthlyCalendarView: React.FC<MonthlyCalendarViewProps> = ({ events, onDaySelect, onModalOpen }) => {
  const selectedDate = useSelectedDate();

  return (
    <div className={styles.calendarViewContainer}>
      <MonthlyHeader />
      <div className={styles.wrapper}>
        <div className={styles.monthlyCalendar}>
          {monthDays(dayjs(selectedDate)).map((dateTime, i) => (
            <MonthlyViewWorkload
              key={i}
              dateTime={dateTime}
              events={events}
              onDaySelect={onDaySelect}
              onModalOpen={onModalOpen}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthlyCalendarView;
