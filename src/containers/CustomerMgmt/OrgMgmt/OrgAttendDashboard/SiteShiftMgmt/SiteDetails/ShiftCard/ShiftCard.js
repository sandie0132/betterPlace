/* eslint-disable no-unused-vars */
import React from 'react';
import cx from 'classnames';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { useRouteMatch, useHistory } from 'react-router';
import styles from './ShiftCard.module.scss';
import time from '../../../../../../../assets/icons/timeBlue.svg';
import employee from '../../../../../../../assets/icons/empBlue.svg';

const ShiftCard = ({ data }) => {
  const match = useRouteMatch();
  const history = useHistory();
  // const location = useLocation();
  // const dispatch = useDispatch();

  const {
    shiftName,
    siteId,
    orgId,
    _id,
    createdOn,
    startTime,
    endTime,
    pValue,
  } = data;

  const redirectUrl = () => {
    const url = `/customer-mgmt/org/${orgId}/site/${siteId}/shift/${_id}`;
    history.push(url);
  };

  const shiftStartTime = moment(`${startTime.hours} ${startTime.minutes} ${startTime.period}`, 'HH:mm A').format('h.mm a');
  const shiftEndTime = moment(`${endTime.hours} ${endTime.minutes} ${endTime.period}`, 'HH:mm A').format('h.mm a');

  let timeString = '';
  if (!isEmpty(pValue)) {
    timeString = ' | ';
    if (pValue.hours !== null || pValue.hours !== 0) timeString += `${pValue.hours.toString()} hrs `;
    if (pValue.minutes !== null || pValue.minutes !== 0) timeString += `${pValue.minutes.toString()} mins`;
  }

  return (
    <div className={cx(styles.cardContainer, 'd-flex flex-column')} onClick={redirectUrl} role="button" aria-hidden>
      <span className={cx(styles.Heading)}>{`${shiftName.toLowerCase()}`}</span>
      <div className={cx(styles.blueContainer, 'd-flex flex-column')}>
        <span className={styles.Text}>
          <img src={time} alt="time" />
          <span>{`${shiftStartTime} to ${shiftEndTime}`}</span>
          { !isEmpty(pValue) && (pValue.hours !== null || pValue.minutes !== null)
          && <span>{timeString}</span>}
        </span>
        {/* <span className={styles.Text} style={{ paddingTop: '12px' }}>
          <img src={employee} alt="emp" />
          --    employees
        </span> */}
      </div>
      <span className={cx(styles.infoText)}>{`created on ${moment(createdOn).format('DD.MM.YYYY')}`}</span>

    </div>
  );
};

export default ShiftCard;
