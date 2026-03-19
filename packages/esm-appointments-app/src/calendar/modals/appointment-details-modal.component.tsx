import React, { useMemo } from 'react';
import type dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Loading,
  InlineNotification,
} from '@carbon/react';
import { type Appointment } from '../../types';
import { formatAMPM } from '../../helpers';
import styles from './appointment-details-modal.scss';

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Array<Appointment>;
  isLoading?: boolean;
  error?: Error;
  selectedDate: dayjs.Dayjs;
  serviceUuid?: string;
}

const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({
  isOpen,
  onClose,
  appointments,
  isLoading = false,
  error,
  selectedDate,
  serviceUuid,
}) => {
  const { t } = useTranslation();

  const rows = useMemo(
    () =>
      appointments.map((appointment, index) => ({
        id: `${appointment.uuid}-${index}`,
        patientName: appointment.patient.name,
        patientIdentifier: appointment.patient.identifier,
        serviceName: appointment.service.name,
        time: formatAMPM(new Date(appointment.startDateTime)),
        provider: appointment.provider?.display || appointment.providers?.[0]?.display || '-',
        status: appointment.status,
        appointmentKind: appointment.appointmentKind,
        uuid: appointment.uuid,
      })),
    [appointments],
  );

  const headers = [
    { key: 'patientName', header: t('patientName', 'Patient Name') },
    { key: 'patientIdentifier', header: t('identifier', 'Identifier') },
    { key: 'serviceName', header: t('service', 'Service') },
    { key: 'time', header: t('time', 'Time') },
    { key: 'provider', header: t('provider', 'Provider') },
    { key: 'status', header: t('status', 'Status') },
    { key: 'appointmentKind', header: t('kind', 'Kind') },
  ];

  return (
    <Modal
      open={isOpen}
      onRequestClose={onClose}
      modalHeading={t('appointmentDetails', 'Appointment Details')}
      primaryButtonText={t('close', 'Close')}
      onRequestSubmit={onClose}
      className={styles.appointmentDetailsModal}>
      <div className={styles.modalBody}>
        <div className={styles.dateHeader}>
          <h3>{selectedDate.format('dddd, MMMM D, YYYY')}</h3>
          <p>
            {t('totalAppointments', 'Total Appointments')}: {appointments.length}
          </p>
        </div>

        {isLoading && <Loading description={t('loading', 'Loading')} />}

        {error && (
          <InlineNotification kind="error" title={t('error', 'Error')} subtitle={error.message} onClose={() => {}} />
        )}

        {!isLoading && !error && appointments.length > 0 ? (
          <div className={styles.tableWrapper}>
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
                    {rows.map((row) => (
                      <TableRow {...getRowProps({ row })} key={row.id}>
                        {row.cells.map((cell) => (
                          <TableCell key={`${row.id}-${cell.info.header}`}>{cell.value}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </DataTable>
          </div>
        ) : (
          !isLoading && (
            <div className={styles.emptyState}>
              <p>{t('noAppointments', 'No appointments scheduled')}</p>
            </div>
          )
        )}
      </div>
    </Modal>
  );
};

export default AppointmentDetailsModal;
