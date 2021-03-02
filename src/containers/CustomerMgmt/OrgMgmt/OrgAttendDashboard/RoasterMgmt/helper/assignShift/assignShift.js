import React, { useState, useEffect, useMemo } from 'react';
import cx from 'classnames';
import moment from 'moment';
import { Button, Tooltip } from 'react-crux';
import { useRouteMatch } from 'react-router';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import last from 'lodash/last';
import CheckBox from '../../../../../../../components/Atom/CheckBox/CheckBox';
import CustomRadioButton from '../../../../../../../components/Molecule/CustomRadioButton/CustomRadioButton';
import scrollStyle from '../../../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import CancelButton from '../../../../../../../components/Molecule/CancelButton/CancelButton';
import styles from './assignShift.module.scss';
import DateCard from './dateCard';
import {
  filterAndPush,
  getShiftTime, getTodayAndFuture, isConsequetiveDates, sortDates,
} from '../../roasterHelper';
import { getEmpShiftAndLeaves } from '../../Store/actions';
import Spinnerload from '../../../../../../../components/Atom/Spinner/Spinner';
import emptyShift from '../../../../../../../assets/icons/emptyShift.svg';
import emptyLeave from '../../../../../../../assets/icons/emptyLeave.svg';

const offs = ['weekly-off', 'rest days'];

const initialState = {
  currentOption: 'shift', // shift & date
  shifts: [],
  leaves: [],
  others: [],
  dateList: [],
  selectAllDay: false,
  maxLeaves: 0,
};
const AssignShift = ({
  calendarRange, startDate, onClick, emp, empLeaveData,
}) => {
  const [state, setState] = useState(initialState);
  const {
    currentOption,
    shifts,
    others,
    dateList,
    selectAllDay,
    leaves,
    maxLeaves,
  } = state;

  const { uuid: empId, source_org: sourceOrg } = emp;

  const match = useRouteMatch();
  const dispatch = useDispatch();
  const orgMgmtRState = useSelector((rstate) => get(rstate, 'orgMgmt', {}), shallowEqual);
  const { loading, shiftList, leaves: empLeaves } = get(orgMgmtRState, 'orgAttendDashboard.roasterMgmt.roasterMgmt', {});

  const { siteId, uuid: orgId } = match.params;

  useEffect(() => {
    const updatedDateList = [];
    updatedDateList.push(startDate);
    setState((prev) => ({
      ...prev,
      dateList: updatedDateList,
    }));
    // eslint-disable-next-line
  }, [startDate]);

  useEffect(() => {
    // make api call here
    dispatch(getEmpShiftAndLeaves({
      orgId, siteId, empId, date: moment(startDate, 'MM-DD-YYYY').format('YYYY-MM-DD'),
    }));
    setState(((prev) => ({
      ...prev,
      leaves: [],
      others: [],
      shifts: [],
      currentOption: 'shift',
    })));
    // eslint-disable-next-line
  }, [empId, startDate]);

  const handleCurrentOption = (option) => {
    setState((prev) => ({
      ...prev,
      currentOption: prev.currentOption !== option ? option : null,
    }));
  };

  const handleShiftHoliday = (section, value) => {
    let updatedShifts = [];
    const updatedLeaves = [];
    const updatedOthers = [];
    if (section === 'shift') {
      updatedShifts = [...shifts];
      if (!updatedShifts.includes(value)) updatedShifts.push(value);
      else {
        updatedShifts = updatedShifts.filter((shiftId) => shiftId !== value);
      }
    } else if (section === 'leave') {
      updatedLeaves.push(value);
    } else updatedOthers.push(value);

    setState((prev) => ({
      ...prev,
      shifts: updatedShifts,
      leaves: updatedLeaves,
      others: updatedOthers,
    }));
  };
  const todayAndFuture = useMemo(() => getTodayAndFuture(calendarRange), [calendarRange]);

  const handleDateClick = (date) => {
    const currentDate = date.format('MM-DD-YYYY');
    let updatedDateList = [...dateList];
    if (!updatedDateList.includes(currentDate)) updatedDateList.push(currentDate);
    else {
      updatedDateList = updatedDateList.filter((item) => item !== currentDate);
    }
    if (updatedDateList.length <= maxLeaves || leaves.length === 0) {
      setState((prev) => ({
        ...prev,
        dateList: sortDates(updatedDateList),
        selectAllDay: updatedDateList.length === todayAndFuture.length,
      }));
      onClick({ type: 'calendar', dateList: updatedDateList });
    }
  };

  const selectAllDayHandler = () => {
    const updatedSelectAll = selectAllDay;
    let updatedDayList = [];
    if (!selectAllDay) {
      updatedDayList = todayAndFuture.filter((date) => !(empLeaveData.includes(date)));
    }
    setState((prev) => ({
      ...prev,
      selectAllDay: !updatedSelectAll,
      dateList: updatedDayList,
    }));
    onClick({ type: 'calendar', dateList: updatedDayList });
  };

  const handleButtonLabel = (type) => {
    let finalLabel = 'select one or more';
    if (type === 'shift/leave') {
      if (!isEmpty(shifts)) {
        const [firstShiftId] = shifts;
        const shiftObj = shiftList.filter((shift) => shift._id === firstShiftId);
        if (shifts.length > 1) finalLabel = `${shiftObj[0].shiftName}, +${shifts.length - 1} more`;
        else if (shifts.length === 1) finalLabel = `${shiftObj[0].shiftName}`;
      } else if (others.length === 1) finalLabel = `${others[0]}`;
      else if (leaves.length === 1) {
        const selectedLeave = empLeaves.filter((leave) => leave.leaveName === leaves[0]);
        finalLabel = `${selectedLeave[0].leaveName}`;
      }
    } else if (type === 'date') {
      finalLabel = 'select date(s)';
      if (!isEmpty(dateList)) {
        const [firstDate] = dateList;
        finalLabel = moment(firstDate).format('dddd, DD MMM').toLowerCase();
        if (dateList.length > 1) finalLabel = `${finalLabel}, +${dateList.length - 1} more`;
      }
    }
    return finalLabel;
  };

  const saveAsDraft = () => {
    const assignDates = dateList.map((d) => moment(d, 'MM-DD-YYYY').format('YYYY-MM-DD'));
    const draftList = [];
    const weeklyOffList = [];
    const restDayList = [];
    let leaveList = [];
    if (leaves.length) {
      leaveList = {
        startDate: assignDates[0],
        endDate: last(assignDates),
        leaveName: leaves[0],
        source_org: sourceOrg,
      };
      onClick({
        type: 'leave',
        val: leaveList,
      });
    } else {
      assignDates.forEach((date) => {
        if (shifts.length) {
          draftList.push({
            assignDate: date,
            empId,
            shiftIds: shifts,
            source_org: sourceOrg,
          });
          onClick({
            type: 'shift',
            val: {
              draftList,
              startDate: draftList[0].assignDate,
              endDate: last(draftList).assignDate,
            },
          });
        }

        if (others.length) {
          if (others.includes('weekly-off')) {
            weeklyOffList.push({
              assignDate: date,
              empId,
              source_org: sourceOrg,
            });
            onClick({
              type: 'off',
              val: {
                weeklyOffList,
                startDate: weeklyOffList[0].assignDate,
                endDate: last(weeklyOffList).assignDate,
              },
            });
          }
          if (others.includes('rest days')) {
            restDayList.push({
              assignDate: date,
              empId,
            });
            onClick({
              type: 'off',
              val: {
                restDayList,
                startDate: restDayList[0].assignDate,
                endDate: last(restDayList).assignDate,
              },
            });
          }
        }
      });
    }
  };

  const handleOthers = (val) => {
    setState((prev) => ({
      ...prev,
      others: filterAndPush([], val),
      shifts: [],
      leaves: [],
    }));
  };

  const handleLeaves = (val, max) => {
    if (max > 0) {
      setState((prev) => ({
        ...prev,
        leaves: filterAndPush([], val),
        shifts: [],
        others: [],
        maxLeaves: max,
      }));
    }
  };

  const removeErrorDate = (date) => {
    setTimeout(() => {
      const updatedDayList = filterAndPush(dateList, date);
      setState((prev) => ({
        ...prev,
        dateList: updatedDayList,
      }));
      onClick({ type: 'calendar', dateList: updatedDayList });
    }, 3000);
  };

  const buttonDisable = useMemo(() => !((shifts.length || others.length || leaves.length)
  && dateList.length),
  [shifts, dateList, others, leaves]);

  useMemo(() => loading === 'employee' && setTimeout(() => {
    onClick({ type: 'assign' });
  }, 200),
  // eslint-disable-next-line
  [loading]);

  return (
    <div className={styles.Footer}>
      <div className="d-flex flex-column">
        { currentOption === 'date'
        && (
        <div className={cx(styles.topContainer, 'd-flex flex-row justify-content-between')}>
          <span className={cx(styles.Heading, 'mt-1')}>select days to apply in a week</span>
          <span
            data-tip={leaves.length && todayAndFuture.length > maxLeaves}
            data-for={leaves.length && todayAndFuture.length > maxLeaves}
          >
            <div>
              <CheckBox
                type="medium"
                value={selectAllDay}
                className="mt-1 position-absolute"
                onChange={selectAllDayHandler}
                disabled={leaves.length && todayAndFuture.length > maxLeaves}
              />
              <span className={cx(styles.blackText, 'pl-4')}>select all days</span>
            </div>
            <Tooltip id="true" type="info" place="top" delayShow={300} tooltipClass={styles.tooltipClass}>
              <span className={styles.tooltip}>
                dont have enough leave quota
              </span>
            </Tooltip>
          </span>
        </div>
        )}
        {currentOption !== null
        && (
        <div className={cx(styles.middleContainer, 'row')}>
          { currentOption === 'shift'
            ? (
              <>
                <div className={styles.firstColumn}>
                  <span className={styles.smallText}>shifts</span>
                  <div className={cx('row no-gutters', scrollStyle.scrollbar, styles.scrollContainer)}>
                    {!isEmpty(shiftList) ? shiftList.map((shift) => (
                      <CustomRadioButton
                        key={shift._id}
                        label={`${shift.shiftName} (${getShiftTime(shift.startTime)}-${getShiftTime(shift.endTime)})`}
                        isSelected={shifts.includes(shift._id)}
                        className={cx(styles.radioButton)}
                        hasEditAccess
                        changed={() => handleShiftHoliday('shift', shift._id)}
                      />
                    )) : (
                      <div className="w-100">
                        <div className="d-flex justify-content-center flex-column">
                          <img src={emptyShift} height="120px" alt="empty-shift" />
                          <span className={styles.emptyMessage}>
                            there are no shift added yet for this site or
                            no sites remaining to assign
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.secondColumn}>
                  <span className={styles.smallText}>leaves</span>
                  <div className={cx('row no-gutters', scrollStyle.scrollbar, styles.scrollContainer)}>

                    {!isEmpty(empLeaves) ? empLeaves.map((leave) => (
                      <CustomRadioButton
                        label={`${leave.leaveName} (${leave.remaining}) remaining`}
                        isSelected={leaves.findIndex((lId) => lId === leave.leaveName) > -1}
                        changed={() => handleLeaves(leave.leaveName, leave.remaining)}
                        className={cx(styles.radioButton)}
                        hasEditAccess
                      />
                    )) : (
                      <div className="w-100">
                        <div className="d-flex justify-content-center flex-column">
                          <img src={emptyLeave} height="120px" alt="empty-leave" />
                          <span className={styles.emptyMessage}>
                            the selected employee has no leave quote left ot no leave configured
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.thirdColumn}>
                  <span className={styles.smallText}>others</span>
                  <div className={cx('row no-gutters', scrollStyle.scrollbar, styles.scrollContainer)}>
                    {offs.map((val) => (
                      <CustomRadioButton
                        key={val}
                        label={val}
                        isSelected={others.includes(val)}
                        className={cx(styles.radioButton)}
                        changed={() => handleOthers(val)}
                        hasEditAccess
                      />
                    ))}

                  </div>

                </div>
              </>
            )
            : ( // date design
              <div className="d-flex flex-row mx-auto">
                {!isEmpty(calendarRange) && calendarRange.map((date) => {
                  const { errorDateIndex, errorDate } = isConsequetiveDates(dateList);
                  return (
                    <DateCard
                      key={date.format('MM-DD-YYYY')}
                      date={date}
                      isSelected={dateList.includes(date.format('MM-DD-YYYY'))}
                      rightSelectionIndex={leaves.length && moment(dateList[errorDateIndex], 'MM-DD-YYYY').add(1, 'days').isSame(date)}
                      onSelect={handleDateClick}
                      onError={() => removeErrorDate(errorDate)}
                      error={leaves.length && errorDate === date.format('MM-DD-YYYY')}
                      disable={empLeaveData.includes(date.format('MM-DD-YYYY')) || (maxLeaves <= dateList.length && leaves.length && !dateList.includes(date.format('MM-DD-YYYY')))}
                    />
                  );
                })}

              </div>
            )}

        </div>
        ) }
        <div className={styles.bottomContainer}>
          <div className="d-flex flex-row position-relative">
            <span className={styles.Number}>1</span>
            <span className="ml-3 align-self-center">&nbsp;employee selected</span>
            <div className={cx(styles.verticalLine)} />
            <span className="align-self-center">add shift / leaves / compoff</span>
            <Button
              type="addDropdown"
              label={handleButtonLabel('shift/leave')}
              isSecondary
              labelStyle="pl-2"
              className={cx(styles.Button, 'ml-2 mt-1')}
              clickHandler={() => handleCurrentOption('shift')}
            />
            <span className="align-self-center ml-2">for</span>
            <Button
              type="addDropdown"
              label={handleButtonLabel('date')}
              isSecondary
              labelStyle="pl-2"
              className={cx(styles.Button, 'ml-2 mt-1')}
              clickHandler={() => handleCurrentOption('date')}
              isDisabled={!(others.length || leaves.length || shifts.length)}
            />
            <div className={cx('d-flex position-absolute')} style={{ right: '0px' }}>
              <CancelButton
                className={styles.cancelButton}
                clickHandler={() => onClick({ type: 'cancel' })}
              >
                cancel
              </CancelButton>
              {loading === 'draft' && <Spinnerload type="loading" />}
              { loading !== 'draft' && (
              <Button
                label={leaves.length ? 'apply' : 'assign'}
                type="save"
                isDisabled={buttonDisable}
                clickHandler={saveAsDraft}
              />
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
export default AssignShift;
