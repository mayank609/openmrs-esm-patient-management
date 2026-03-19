import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import { ChevronLeft, ChevronRight } from '@carbon/react/icons';
import { useSelectedDate } from '../../hooks/useSelectedDate';
import styles from './enhanced-calendar-header.scss';

interface EnhancedCalendarHeaderProps {
  currentDate: dayjs.Dayjs;
  currentView: 'monthly' | 'weekly' | 'daily';
  onNavigate: (direction: 'prev' | 'next' | 'today') => void;
  onViewChange?: (view: 'monthly' | 'weekly' | 'daily') => void;
}

const EnhancedCalendarHeader: React.FC<EnhancedCalendarHeaderProps> = ({
  currentDate,
  currentView,
  onNavigate,
  onViewChange,
}) => {
  const { t } = useTranslation();
  const selectedDate = useSelectedDate();

  const getHeaderText = (): string => {
    if (currentView === 'monthly') {
      return currentDate.format('MMMM YYYY');
    } else if (currentView === 'weekly') {
      const weekEnd = currentDate.clone().endOf('week');
      return `${t('week', 'Week')} ${currentDate.format('MMM D')} - ${weekEnd.format('MMM D, YYYY')}`;
    } else {
      return currentDate.format('dddd, MMMM D, YYYY');
    }
  };

  const isToday = currentDate.isSame(dayjs(selectedDate), currentView === 'daily' ? 'day' : 'month');

  return (
    <div className={styles.enhancedCalendarHeader}>
      <div className={styles.headerContent}>
        <div className={styles.navigationSection}>
          <Button
            className={styles.navButton}
            kind="ghost"
            hasIconOnly
            iconDescription={t('previous', 'Previous')}
            renderIcon={ChevronLeft}
            onClick={() => onNavigate('prev')}
            size="lg"
            aria-label={t('previousPeriod', 'Previous period')}
          />

          <h2 className={styles.dateRange}>{getHeaderText()}</h2>

          <Button
            className={styles.navButton}
            kind="ghost"
            hasIconOnly
            iconDescription={t('next', 'Next')}
            renderIcon={ChevronRight}
            onClick={() => onNavigate('next')}
            size="lg"
            aria-label={t('nextPeriod', 'Next period')}
          />
        </div>

        <Button
          className={styles.todayButton}
          kind={isToday ? 'primary' : 'secondary'}
          onClick={() => onNavigate('today')}
          size="sm">
          {t('today', 'Today')}
        </Button>
      </div>
    </div>
  );
};

export default EnhancedCalendarHeader;
