import React, { useMemo } from 'react';
import classNames from 'classnames';
import dayjs, { type Dayjs } from 'dayjs';
import { User } from '@carbon/react/icons';
import { useLayoutType } from '@openmrs/esm-framework';
import { type DailyAppointmentsCountByService } from '../../types';
import styles from './calendar-cell.scss';

interface CalendarCellProps {
  dateTime: Dayjs;
  events: Array<DailyAppointmentsCountByService>;
  onCellClick: (dateTime: Dayjs) => void;
  isCurrentMonth?: boolean;
  isLargeCell?: boolean;
}

const CalendarCell: React.FC<CalendarCellProps> = ({
  dateTime,
  events,
  onCellClick,
  isCurrentMonth = true,
  isLargeCell = false,
}) => {
  const layout = useLayoutType();

  const currentData = useMemo(
    () =>
      events?.find(
        (event) => dayjs(event.appointmentDate)?.format('YYYY-MM-DD') === dayjs(dateTime)?.format('YYYY-MM-DD'),
      ),
    [dateTime, events],
  );

  const totalAppointments = useMemo(() => {
    if (currentData?.services) {
      return currentData.services.reduce((sum, { count = 0 }) => sum + count, 0);
    }
    return 0;
  }, [currentData?.services]);

  const visibleServices = useMemo(() => {
    if (currentData?.services) {
      return currentData.services.slice(0, isLargeCell ? 5 : 2);
    }
    return [];
  }, [currentData, isLargeCell]);

  return (
    <div
      onClick={() => onCellClick(dateTime)}
      className={classNames(styles.calendarCell, {
        [styles.disabledCell]: !isCurrentMonth,
        [styles.largeCell]: isLargeCell,
        [styles.hasAppointments]: totalAppointments > 0,
      })}>
      <div className={styles.header}>
        <span className={styles.date}>{dateTime.format('D')}</span>
        <span className={styles.dayName}>{dateTime.format('ddd')}</span>
      </div>

      {totalAppointments > 0 && (
        <div className={styles.appointmentSummary}>
          <div className={styles.totalCount}>
            <User size={16} />
            <span>{totalAppointments}</span>
          </div>
        </div>
      )}

      {visibleServices.length > 0 && (
        <div className={styles.services}>
          {visibleServices.map(({ serviceName, count }, i) => (
            <div key={i} className={styles.serviceItem}>
              <span className={styles.serviceName}>{serviceName}</span>
              <span className={styles.serviceCount}>{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CalendarCell;
