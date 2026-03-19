import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from '@carbon/react';
import { SUPPORTED_CALENDAR_SYSTEMS } from '../../config/calendar-systems';
import styles from './calendar-system-selector.scss';

interface CalendarSystemSelectorProps {
  currentCalendarSystem: string;
  onCalendarSystemChange: (system: string) => void;
  disabled?: boolean;
}

const CalendarSystemSelector: React.FC<CalendarSystemSelectorProps> = ({
  currentCalendarSystem,
  onCalendarSystemChange,
  disabled = false,
}) => {
  const { t } = useTranslation();

  const items = useMemo(
    () =>
      SUPPORTED_CALENDAR_SYSTEMS.map((system) => ({
        id: system.key,
        label: system.name,
        text: system.description,
      })),
    [],
  );

  const selectedItem = useMemo(
    () => items.find((item) => item.id === currentCalendarSystem) || items[0],
    [items, currentCalendarSystem],
  );

  return (
    <div className={styles.calendarSystemSelector}>
      <label htmlFor="calendar-system-dropdown" className={styles.label}>
        {t('calendarSystem', 'Calendar System')}
      </label>
      <Dropdown
        id="calendar-system-dropdown"
        label={currentCalendarSystem}
        titleText={t('selectCalendarSystem', 'Select a calendar system')}
        items={items}
        itemToString={(item) => (item ? item.label : '')}
        selectedItem={selectedItem}
        onChange={({ selectedItem }) => {
          if (selectedItem) {
            onCalendarSystemChange(selectedItem.id);
          }
        }}
        disabled={disabled}
        size="sm"
      />
    </div>
  );
};

export default CalendarSystemSelector;
