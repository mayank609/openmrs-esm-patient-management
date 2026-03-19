import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { type DailyAppointmentsCountByService } from '../../types';
import { useSelectedDate } from '../../hooks/useSelectedDate';
import { DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@carbon/react';
import styles from './daily-calendar-view.scss';

interface DailyCalendarViewProps {
  events?: Array<DailyAppointmentsCountByService>;
  selectedDate?: dayjs.Dayjs;
  onModalOpen?: (dateTime: dayjs.Dayjs, serviceUuid?: string) => void;
}

const DailyCalendarView: React.FC<DailyCalendarViewProps> = ({
  events = [],
  selectedDate: propSelectedDate,
  onModalOpen,
}) => {
  const { t } = useTranslation();
  const defaultSelectedDate = useSelectedDate();
  const selectedDate = propSelectedDate || dayjs(defaultSelectedDate);

  const dayEvents = useMemo(() => {
    if (!events || events.length === 0) {
      return [];
    }
    const eventData = events.find(
      (event) => dayjs(event.appointmentDate).format('YYYY-MM-DD') === dayjs(selectedDate).format('YYYY-MM-DD'),
    );
    return eventData?.services || [];
  }, [events, selectedDate]);

  const rows = dayEvents.map((service, index) => ({
    id: `${service.serviceUuid}-${index}`,
    serviceName: service.serviceName,
    serviceUuid: service.serviceUuid,
    count: service.count,
  }));

  const headers = [
    {
      key: 'serviceName',
      header: t('service', 'Service'),
    },
    {
      key: 'count',
      header: t('appointmentCount', 'Appointment Count'),
    },
  ];

  return (
    <div className={styles.dailyCalendarView}>
      <div className={styles.dayHeader}>
        <h2 className={styles.dayTitle}>{selectedDate.format('dddd, MMMM D, YYYY')}</h2>
        <p className={styles.totalAppointments}>
          {t('totalAppointments', 'Total Appointments')}: {dayEvents.reduce((sum, service) => sum + service.count, 0)}
        </p>
      </div>

      {dayEvents.length > 0 ? (
        <div className={styles.tableContainer}>
          <DataTable rows={rows} headers={headers}>
            {({ rows, headers, getHeaderProps, getRowProps, getTableProps }) => (
              <Table {...getTableProps()} className={styles.appointmentsTable}>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader
                        {...getHeaderProps({
                          header,
                        })}
                        key={header.key}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, i) => (
                    <TableRow
                      {...getRowProps({ row })}
                      key={row.id}
                      className={styles.clickableRow}
                      onClick={() => onModalOpen && onModalOpen(selectedDate, dayEvents[i]?.serviceUuid)}>
                      <TableCell key={`${row.id}-service`}>{row.cells[0].value}</TableCell>
                      <TableCell key={`${row.id}-count`}>{row.cells[1].value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </DataTable>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>{t('noAppointmentsForDay', 'No appointments scheduled for this day')}</p>
        </div>
      )}
    </div>
  );
};

export default DailyCalendarView;
