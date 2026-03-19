import React, { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppointmentsCalendar } from '../hooks/useAppointmentsCalendar';
import { useAppointmentsByDateAndService } from '../hooks/useAppointmentsByDateAndService';
import AppointmentsHeader from '../header/appointments-header.component';
import CalendarHeader from './header/calendar-header.component';
import EnhancedCalendarHeader from './enhanced-calendar-header/enhanced-calendar-header.component';
import MonthlyCalendarView from './monthly/monthly-calendar-view.component';
import WeeklyCalendarView from './weekly/weekly-calendar-view.component';
import DailyCalendarView from './daily/daily-calendar-view.component';
import ViewToggle from './view-toggle/view-toggle.component';
import AppointmentDetailsModal from './modals/appointment-details-modal.component';
import { useSelectedDate } from '../hooks/useSelectedDate';
import styles from './appointments-calendar-view-view.scss';

type ViewType = 'monthly' | 'weekly' | 'daily';

const AppointmentsCalendarView: React.FC = () => {
  const { t } = useTranslation();
  const selectedDate = useSelectedDate();
  const [currentView, setCurrentView] = useState<ViewType>('monthly');
  const [displayDate, setDisplayDate] = useState<dayjs.Dayjs>(dayjs(selectedDate));
  const [showModal, setShowModal] = useState(false);
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<string | undefined>(undefined);

  const { calendarEvents, isLoading, error } = useAppointmentsCalendar(displayDate.toISOString(), currentView);

  const {
    appointments,
    isLoading: appointmentsLoading,
    error: appointmentsError,
  } = useAppointmentsByDateAndService(displayDate.toISOString(), selectedServiceForModal);

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
  };

  const handleNavigate = (direction: 'prev' | 'next' | 'today') => {
    let newDate = displayDate;

    if (direction === 'today') {
      newDate = dayjs(selectedDate);
    } else if (direction === 'prev') {
      if (currentView === 'monthly') {
        newDate = displayDate.subtract(1, 'month');
      } else if (currentView === 'weekly') {
        newDate = displayDate.subtract(1, 'week');
      } else {
        newDate = displayDate.subtract(1, 'day');
      }
    } else if (direction === 'next') {
      if (currentView === 'monthly') {
        newDate = displayDate.add(1, 'month');
      } else if (currentView === 'weekly') {
        newDate = displayDate.add(1, 'week');
      } else {
        newDate = displayDate.add(1, 'day');
      }
    }

    setDisplayDate(newDate);
  };

  const handleDaySelect = (dateTime: dayjs.Dayjs) => {
    setDisplayDate(dateTime);
    if (currentView !== 'daily') {
      setCurrentView('daily');
    }
  };

  const openModal = (dateTime: dayjs.Dayjs, serviceUuid?: string) => {
    setDisplayDate(dateTime);
    setSelectedServiceForModal(serviceUuid);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedServiceForModal(undefined);
  };

  return (
    <div data-testid="appointments-calendar" className={styles.appointmentsCalendarWrapper}>
      <AppointmentsHeader title={t('calendar', 'Calendar')} />
      <CalendarHeader />

      <div className={styles.calendarControls}>
        <EnhancedCalendarHeader
          currentDate={displayDate}
          currentView={currentView}
          onNavigate={handleNavigate}
          onViewChange={handleViewChange}
        />
        <ViewToggle currentView={currentView} onViewChange={handleViewChange} />
      </div>

      <div className={styles.calendarViewContainer}>
        {currentView === 'monthly' && (
          <MonthlyCalendarView events={calendarEvents} onDaySelect={handleDaySelect} onModalOpen={openModal} />
        )}
        {currentView === 'weekly' && (
          <WeeklyCalendarView
            events={calendarEvents}
            onDaySelect={handleDaySelect}
            selectedDate={displayDate}
            onModalOpen={openModal}
          />
        )}
        {currentView === 'daily' && (
          <DailyCalendarView events={calendarEvents} selectedDate={displayDate} onModalOpen={openModal} />
        )}
      </div>

      <AppointmentDetailsModal
        isOpen={showModal}
        onClose={closeModal}
        appointments={appointments}
        isLoading={appointmentsLoading}
        error={appointmentsError}
        selectedDate={displayDate}
        serviceUuid={selectedServiceForModal}
      />
    </div>
  );
};

export default AppointmentsCalendarView;
