/* eslint-disable arrow-body-style */
import React from 'react';
import cx from 'classnames';
import moment from 'moment';
import { Tooltip } from 'react-crux';
import styles from './assignShift.module.scss';
import { isPastDate } from '../../roasterHelper';

const DateCard = ({
  date, isSelected, onSelect, rightSelectionIndex, error, onError, disable,
}) => {
  if (error) onError();
  return (
    <span data-tip={`${date.format('MM-DD-YYYY')}-${disable}`} data-for={`${date.format('MM-DD-YYYY')}-${disable}`}>
      <div
        className={cx(styles.Container, 'd-flex flex-column',
          {
            [`${styles.pointer}`]: !isPastDate(date),
          },
          {
            [`${styles.selectedContainer}`]: !!isSelected,
          },
          {
            [`${styles.tomorrowContainer}`]: rightSelectionIndex,
          },
          {
            [`${styles.dateError}`]: error,
          },
          {
            [`${styles.disabled}`]: disable || isPastDate(date),
          })}
        onClick={!isPastDate(date) && !disable ? () => onSelect(date) : null}
        role="button"
        aria-hidden
      >
        <span>{moment(date).format('ddd').toLowerCase()}</span>
        <span className={cx(styles.disableDate,
          {
            [`${styles.activeDate}`]: !isPastDate(date),
          })}
        >
          {moment(date).format('DD')}
        </span>
        <span>{moment(date).format('MMMM YY').toLowerCase()}</span>
      </div>
      {Boolean(error)
      && (
      <div className={cx(styles.box, styles.arrowTop)}>
        please select consecutive dates
      </div>
      )}
      {disable
        ? (
          <Tooltip
            id={`${date.format('MM-DD-YYYY')}-${disable}`}
            arrowColor="transparent"
            place="top"
            type="info"
            tooltipClass={styles.tooltipClass}
            delayShow={300}
          >
            <div>
              This date is not selectable, please check availble leaves
            </div>
          </Tooltip>
        )
        : null }
    </span>
  );
};

export default DateCard;
