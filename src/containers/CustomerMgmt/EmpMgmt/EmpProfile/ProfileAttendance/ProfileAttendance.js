/* eslint-disable no-nested-ternary */
/* eslint-disable no-else-return */
import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { isEmpty, get } from 'lodash';
import moment from 'moment';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useRouteMatch } from 'react-router';
import styles from './ProfileAttendance.module.scss';
import sickLeave from '../../../../../assets/icons/sickLeave.svg';
import casualLeave from '../../../../../assets/icons/casualLeave.svg';
import earnedLeave from '../../../../../assets/icons/earnedLeave.svg';
import dropdown from '../../../../../assets/icons/dropdownArrow.svg';
import genericLeave from '../../../../../assets/icons/genericLeaveIcon.svg';
import view from '../../../../../assets/icons/viewLog.svg';
import HistoryLog from './HistoryLog/HistoryLog';
import Loader from '../../../../../components/Organism/Loader/Loader';
import { colorPallate } from './ProfileAttendanceInitData';
import { getEmpLeaveQuota } from '../Store/action';

const initialState = {
  showHistory: false,
  showHistoryIndex: null,
  leaveQuota: [],
};

const ProfileAttendance = () => {
  const [state, setState] = useState(initialState);
  const match = useRouteMatch();
  const dispatch = useDispatch();

  const orgId = match.params.uuid;
  const { empId } = match.params;

  const empProfileRState = useSelector((rstate) => get(rstate, 'empMgmt.empProfile', {}), shallowEqual);
  const empLeaveQuota = get(empProfileRState, 'empLeaveQuota', {});
  const { getEmpLeaveQuotaState } = empProfileRState;

  const {
    showHistory,
    showHistoryIndex,
    leaveQuota,
  } = state;

  useEffect(() => {
    if (!isEmpty(empLeaveQuota)) {
      if (empLeaveQuota.empId !== empId) {
        dispatch(getEmpLeaveQuota(orgId, empId));
      }
    } else dispatch(getEmpLeaveQuota(orgId, empId));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!isEmpty(empLeaveQuota)) {
      const { leaves } = empLeaveQuota;
      if (!isEmpty(leaves)) {
        leaves.forEach((leave, index) => {
          leaves[index].logs = leave.logs.sort((a, b) => moment(`${a.postedDate}`) - moment(`${b.postedDate}`));
        });
      }
      setState((prev) => ({
        ...prev,
        leaveQuota: leaves,
      }));
    }
    // eslint-disable-next-line
  }, [JSON.stringify(empLeaveQuota)]);

  const handleShowHistory = (index) => {
    let updatedShowHistory = true;
    if (showHistoryIndex === index && showHistory) updatedShowHistory = false;
    setState((prev) => ({
      ...prev,
      showHistory: updatedShowHistory,
      showHistoryIndex: index,
    }));
  };

  const handleLeaveIcon = (leaveType) => {
    if (leaveType === 'sick_leave') return sickLeave;
    else if (leaveType === 'earned_leave') return earnedLeave;
    else if (leaveType === 'annual_leave') return casualLeave;
    else return genericLeave;
  };

  const latestDate = (logs) => {
    let leaveLog = logs.filter((log) => log.type === 'AVAILED');
    if (!isEmpty(leaveLog)) {
      leaveLog = leaveLog.sort((a, b) => moment(`${a.postedDate}`, 'DD MM YYYY') - moment(`${b.postedDate}`, 'DD MM YYYY'));
      leaveLog = leaveLog.reverse();
      return moment(leaveLog[0].postedDate).format('DD MMM YYYY');
    }
    return '--';
  };

  const colorpickerFromPallate = (leaveType) => {
    const randomIndex = Math.floor(Math.random() * colorPallate.length);
    if (leaveType === 'sick_leave') return { color: '#BFD554', opacColor: 'rgba(191,213,84,0.1)' };
    else if (leaveType === 'earned_leave') return { color: '#976CA7', opacColor: 'rgba(151,108,167,0.1)' };
    else if (leaveType === 'annual_leave') return { color: '#A84567', opacColor: 'rgba(168,69,103,0.1)' };
    else return colorPallate[randomIndex];
  };

  return (
    <div className={cx('d-flex flex-column', styles.attendContainer)}>
      {getEmpLeaveQuotaState === 'LOADING' ? <Loader type="taskListLoader" />
        : !isEmpty(leaveQuota)
          ? (
            <>
              <span className={styles.sectionHeading}>leaves quota</span>
              <div className={cx(styles.leaveListContainer)} style={{ marginBottom: '2rem' }}>
                <div className="row no-gutters mt-4 position-relative" style={{ overflow: 'hidden' }}>
                  <span className={cx(styles.Heading, styles.headingWidth1)}>leave type</span>
                  <span className={cx(styles.Heading, styles.headingWidth2)}>remaining</span>
                  <span className={cx(styles.Heading, styles.headingWidth3)}>expiry policy</span>
                  <span className={cx(styles.Heading, styles.headingWidth4)}>
                    last leave taken on
                  </span>
                  <span className={cx(styles.Heading, styles.headingWidth5)}>history</span>
                </div>
                <hr />
                {!isEmpty(leaveQuota) && leaveQuota.map((leave, index) => {
                  const randomColor = colorpickerFromPallate(leave.leaveName);
                  return (
                    <div key={leave.leaveId} className="position-relative">
                      <div className="d-flex flex-row position-relative" style={{ paddingTop: '4px', paddingBottom: '4px' }}>
                        <div className={cx(styles.Text, styles.boldText, styles.headingWidth1)}>
                          <img className={cx(styles.leaveIcon, 'mr-2')} src={handleLeaveIcon(leave.leaveName)} style={{ backgroundColor: `${randomColor.opacColor}` }} alt="sict leave" />
                          {leave.leaveName.replace('_', ' ')}
                        </div>
                        <div className={cx(styles.Text, styles.headingWidth2, 'd-flex')}>
                          <span style={{ width: '72px' }}>{`${leave.remaining} out of ${leave.totalLeaves}`}</span>
                          <div className="position-relative ml-3">
                            <div className={styles.progressBarContainer} style={{ backgroundColor: `${randomColor.opacColor}` }} />
                            <div className={styles.progressBar} style={{ backgroundColor: `${randomColor.color}`, width: `calc((${leave.remaining}/${leave.totalLeaves})*120px)` }} />
                          </div>
                        </div>
                        <div className={cx(styles.Text, styles.headingWidth3)}>{`${leave.remaining} on 31 Dec ${moment().format('YYYY')}`}</div>
                        <div className={cx(styles.Text, styles.headingWidth4)}>
                          {latestDate(leave.logs)}
                        </div>

                        <div className={cx(styles.Text, styles.blueText, styles.pointer, styles.headingWidth5)} role="button" aria-hidden onClick={() => handleShowHistory(index)}>
                          <img className="pr-2" src={view} alt="view" />
                          view log
                          <img className={styles.dropdownIcon} src={dropdown} alt="dropdown" />
                        </div>

                      </div>
                      { showHistory && showHistoryIndex === index
                      && (
                      <>
                        <div className={styles.historyActiveContainer} />
                        <div className={styles.historyContainer}>
                          <HistoryLog
                            logs={leave.logs}
                            leaveName={leave.leaveName}
                          />
                        </div>
                      </>
                      )}
                      <hr />
                    </div>
                  );
                }) }

              </div>
            </>
          )
          : (
            <div className={styles.emptyInfo}>
              no data available
            </div>
          )}
    </div>
  );
};

export default ProfileAttendance;
