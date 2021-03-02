import React, { useRef, useMemo } from 'react';
import cx from 'classnames';
import { Pill, Tooltip } from 'react-crux';
import styles from './dayCell.module.scss';
import pen from '../../../../../../../assets/icons/pen.svg';
import doubleTick from '../../../../../../../assets/icons/doubleTickGreen.svg';

const ifPropsEqual = (prevCell, nextCell) => prevCell.isHoliday === nextCell.isHoliday
  && prevCell.isToday === nextCell.isToday
  && prevCell.date.isSame(nextCell.date)
  && prevCell.isEdited === nextCell.isEdited
  && prevCell.isPublished === nextCell.isPublished;

const DayCell = ({
  isToday, isHoliday, date, isEdited, isPublished, onDateClick,
}) => {
  const icon = useMemo(() => {
    if (isEdited) return pen;
    if (isPublished) return doubleTick;
    return false;
  }, [isEdited, isPublished]);

  const cellRef = useRef('');
  return (
    <div ref={cellRef}>
      <span data-tip={`tooltip${date.format('MM-DD-YYYY')}`} data-for={`tooltip${date.format('MM-DD-YYYY')}`}>
        <div className={cx(styles.cell)} onClick={() => onDateClick({ date: date.format('MM-DD-YYYY'), ref: cellRef.current })} role="button" tabIndex="0" aria-hidden>
          {icon && <img className={styles.iconDay} src={icon} alt="edit" height="16px" />}
          <span className={cx('p-1 m-0', styles.cellDay)} style={{ fontFamily: date.format('ddd').toLowerCase() === 'sun' ? 'Gilroy-Medium' : 'Gilroy-Bold' }}>
            <span>{date.format('ddd').toLowerCase()}</span>
          </span>
          {!(isHoliday && isToday) && <br />}
          <span className={cx('pb-1 m-0 pt-0', styles.cellDate)}>
            <span>
              {date.format('MMM DD').toLowerCase()}
            </span>
            {isHoliday && isToday && <br />}
            <span>
              {isToday && <Pill className={styles.pillClass} text="today" backgroundColor="#4BB752" /> }
              {isHoliday && <Pill className={styles.pillClass} text="holiday" backgroundColor="#F5A996" /> }
            </span>
          </span>
        </div>
        <Tooltip id={`tooltip${date.format('MM-DD-YYYY')}`} type="info" place="top" delayShow={300} tooltipClass={styles.tooltipClass}>
          <span className={styles.tooltip}>
            click to select
          </span>
        </Tooltip>
      </span>
    </div>
  );
};

export default React.memo(DayCell, ifPropsEqual);
