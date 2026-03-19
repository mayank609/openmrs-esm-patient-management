import dayjs from 'dayjs';
import useSWR from 'swr';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { type AppointmentsFetchResponse } from '../types';

export const useAppointmentsByDateAndService = (date: string, serviceUuid?: string) => {
  const startOfDay = dayjs(date).startOf('day').toISOString();
  const endOfDay = dayjs(date).endOf('day').toISOString();
  const searchUrl = `${restBaseUrl}/appointments?forDate=${startOfDay}`;

  const { data, isLoading, error } = useSWR<AppointmentsFetchResponse, Error>(searchUrl, openmrsFetch);

  // Filter by service if provided
  const filteredAppointments =
    data?.data?.filter((appointment) => {
      if (serviceUuid) {
        return appointment.service.uuid === serviceUuid;
      }
      return true;
    }) ?? [];

  return { appointments: filteredAppointments, isLoading, error };
};
