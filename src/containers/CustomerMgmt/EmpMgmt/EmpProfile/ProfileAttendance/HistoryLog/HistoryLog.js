/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
/* eslint-disable arrow-body-style */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
/* eslint-disable no-trailing-spaces */
import React from 'react';
import cx from 'classnames';
import { isEmpty, get } from 'lodash';
import moment from 'moment';
import styles from './HistoryLog.module.scss';
import scrollStyle from '../../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import plus from '../../../../../../assets/icons/addition.svg';
import minus from '../../../../../../assets/icons/minus.svg';

const HistoryLog = ({ logs, leaveName }) => {
  const returnLeaveIcon = (status) => {
    if (status === 'GRANTED') return plus;
    return minus;
  };

  let dayCount = 0;

    return (
      <div className="d-flex flex-column">
        <div className="d-flex flex-row justify-content-between" style={{ paddingBottom: '18px' }}>
          <span className={cx(styles.Text, styles.boldText)}>timeline</span>
          <span className={cx(styles.Text, styles.boldText, 'pr-3')}>remaining</span>
        </div>
        <div className={cx(scrollStyle.scrollbarBlue, 'd-flex flex-column')} style={{ overflow: 'auto', maxHeight: '256px' }}>
          {!isEmpty(logs) && logs.map((log, index) => {
            if (log.type === 'GRANTED') dayCount += log.leaveCount;
            else dayCount -= log.leaveCount;
            return (
              <div className="d-flex flex-row position-relative" style={{ height: '64px' }} key={log.postedDate}>
                <div className="position-relative" style={{ flex: '0 0 5%' }}>
                  <img src={returnLeaveIcon(log.type)} className={styles.icon} alt="icon" />
                  {index === 0 && (logs.length - 1 !== index) ? <div className={styles.progressInitial} />
                  : logs.length - 1 > index ? <div className={styles.progressMiddle} />
                  : logs.length - 1 === index ? <div className={styles.progressEnd} /> : null}
                </div>
                <div className="d-flex flex-row justify-content-between" style={{ flex: '0 0 94%' }}>
                  <span className={styles.Text}>
                    {log.type.toLowerCase()}
                    &nbsp;
                    <span className={styles.boldText}>{`${log.leaveCount} ${leaveName.replace('_', ' ')}`}</span>
                      &nbsp;on&nbsp;
                    <span className={styles.boldText}>{moment(log.postedDate).format('DD MMM YYYY').toLowerCase()}</span>
                  </span>

                  <div className={styles.daysContainer}>
                    {`${dayCount} days`}
                  </div>
                </div>
                {index !== logs.length - 1 && <hr className={styles.horizontalLine} />}
              </div>
           ); 
       })}

          {/* <div className="d-flex flex-row position-relative" style={{ height: '64px' }}>
            <div className="position-relative" style={{ flex: '0 0 5%' }}>
              <img src={minus} className={styles.icon} alt="plus" />
              <div className={styles.progressMiddle} />
            </div>
            <div className="d-flex flex-row justify-content-between" style={{ flex: '0 0 94%' }}>
              <span className={styles.Text}>
                granted&nbsp;
                <span className={styles.boldText}>6 earned leave</span>
              &nbsp;on&nbsp;
                <span className={styles.boldText}>01 jan 2020</span>
              </span>

              <div className={styles.daysContainer}>
                6 days
              </div>
            </div>
            <hr className={styles.horizontalLine} />
          </div>

          <div className="d-flex flex-row position-relative" style={{ height: '64px' }}>
            <div className="position-relative" style={{ flex: '0 0 5%' }}>
              <img src={minus} className={styles.icon} alt="plus" />
              <div className={styles.progressMiddle} />
            </div>
            <div className="d-flex flex-row justify-content-between" style={{ flex: '0 0 94%' }}>
              <span className={styles.Text}>
                granted&nbsp;
                <span className={styles.boldText}>6 earned leave</span>
              &nbsp;on&nbsp;
                <span className={styles.boldText}>01 jan 2020</span>
              </span>

              <div className={styles.daysContainer}>
                6 days
              </div>
            </div>
            <hr className={styles.horizontalLine} />
          </div>

          <div className="d-flex flex-row position-relative" style={{ height: '64px' }}>
            <div className="position-relative" style={{ flex: '0 0 5%' }}>
              <img src={plus} className={styles.icon} alt="plus" />
              <div className={styles.progressMiddle} />
            </div>
            <div className="d-flex flex-row justify-content-between" style={{ flex: '0 0 94%' }}>
              <span className={styles.Text}>
                granted&nbsp;
                <span className={styles.boldText}>6 earned leave</span>
              &nbsp;on&nbsp;
                <span className={styles.boldText}>01 jan 2021</span>
              </span>

              <div className={styles.daysContainer}>
                6 days
              </div>
            </div>
            <hr className={styles.horizontalLine} />
          </div>

          <div className="d-flex flex-row position-relative" style={{ height: '64px' }}>
            <div className="position-relative" style={{ flex: '0 0 5%' }}>
              <img src={plus} className={styles.icon} alt="plus" />
              <div className={styles.progressEnd} />
            </div>
            <div className="d-flex flex-row justify-content-between" style={{ flex: '0 0 94%' }}>
              <span className={styles.Text}>
                granted&nbsp;
                <span className={styles.boldText}>6 earned leave</span>
              &nbsp;on&nbsp;
                <span className={styles.boldText}>01 jan 2020</span>
              </span>

              <div className={styles.daysContainer}>
                6 days
              </div>
            </div>
            <hr className={styles.horizontalLine} />
          </div> */}

        </div>

      </div>
    );
};

export default HistoryLog;
