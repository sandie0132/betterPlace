import React from 'react';
import cx from 'classnames';
import styles from './StatusChangeTab.module.scss';

import info from '../../../../../assets/icons/info.svg';

const StatusChangeTab = ({
  type, platformStatus, clientStatus, propsClassname,
}) => {
  const handleColor = (status) => {
    if (status === 'red') return styles.statusRed;
    if (status === 'green') return styles.statusGreen;
    if (status === 'yellow') return styles.statusYellow;
    return null;
  };

  return (
    <div className={cx((propsClassname || 'mt-3 mb-1'), styles.statusChange)}>
      <img className={styles.img16px} src={info} alt="info" />
      <span className={cx(styles.statusChangeContent, 'ml-2')} htmlFor="idCard">
        {type}
        {' '}
        final status has been changed to
        {' '}
        <span className={handleColor(clientStatus.toLowerCase())}>
          {clientStatus.toLowerCase()}
          {' '}
          case
        </span>
        {', '}
        from betterplace default status
        {' '}
        <span className={handleColor(platformStatus.toLowerCase())}>
          {platformStatus.toLowerCase()}
          {' '}
          case
        </span>
      </span>
    </div>
  );
};

export default StatusChangeTab;
