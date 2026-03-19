import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import styles from './view-toggle.scss';

interface ViewToggleProps {
  currentView: 'monthly' | 'weekly' | 'daily';
  onViewChange: (view: 'monthly' | 'weekly' | 'daily') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.viewToggleContainer}>
      <div className={styles.buttonGroup}>
        <Button
          className={styles.toggleButton}
          kind={currentView === 'daily' ? 'primary' : 'secondary'}
          onClick={() => onViewChange('daily')}
          size="sm">
          {t('daily', 'Daily')}
        </Button>
        <Button
          className={styles.toggleButton}
          kind={currentView === 'weekly' ? 'primary' : 'secondary'}
          onClick={() => onViewChange('weekly')}
          size="sm">
          {t('weekly', 'Weekly')}
        </Button>
        <Button
          className={styles.toggleButton}
          kind={currentView === 'monthly' ? 'primary' : 'secondary'}
          onClick={() => onViewChange('monthly')}
          size="sm">
          {t('monthly', 'Monthly')}
        </Button>
      </div>
    </div>
  );
};

export default ViewToggle;
