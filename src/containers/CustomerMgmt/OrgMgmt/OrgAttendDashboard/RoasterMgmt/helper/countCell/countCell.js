/* eslint-disable dot-notation */
import React from 'react';
import cx from 'classnames';
import { useRouteMatch } from 'react-router';
import { Tooltip } from 'react-crux';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import moment from 'moment';
import { getShiftColor } from '../../roasterHelper';
import styles from './countCell.module.scss';

const isPropsEqual = (prev, next) => (
  prev.isDisabled === next.isDisabled
  && prev.shiftId === next.shiftId
  && get(prev, 'data._id', '') === get(next, 'data._id', '')
  && isEqual(prev.data, next.data)
  && isEqual(prev.calendarRange, next.calendarRange)
  && moment(prev.date).isSame(next.date)
);

const CountCell = ({
  isDisabled, shiftId, shiftList, calendarRange, clickedDate, data, vendorData, toggleFunction,
}) => {
  let expectedCount = 0; let count = 0;
  const { backgroundColor, color } = getShiftColor(shiftId);
  const bgColor = isDisabled ? '#E9EAEA' : backgroundColor;
  const fontColor = isDisabled ? '#A9ABAE' : color;
  const match = useRouteMatch();
  const { uuid: orgId } = match.params;
  if (!isEmpty(data)) {
    expectedCount = parseInt(data.expectedEmpCount, 10);
    count = Object.values(data.actualEmpCountDetails).reduce((acc, val) => acc + val, 0);
  }

  const cellClickHandler = () => {
  // date dropdown data
    if (!isDisabled) {
      const dateDropDown = [{ value: [], label: 'select date' }];
      dateDropDown.push({ value: [moment(clickedDate).format('YYYY-MM-DD')], label: `${moment(clickedDate).format('dddd (DD MMM)').toLowerCase()}` });
      const dateRangeArray = calendarRange.map((day) => moment(day).format('YYYY-MM-DD'));
      dateDropDown.push({
        value: [...dateRangeArray],
        label: `entire week (${calendarRange[0].format('DD MMM').toLowerCase()} - ${calendarRange[calendarRange.length - 1].format('DD MMM').toLowerCase()})`,
      });

      // shift dropdown
      const shiftDropdown = [{ value: [], label: 'select shift' }];
      // const [firstShift] = shiftList;
      const selectedShiftObj = shiftList.filter((shift) => shift._id === shiftId);
      shiftDropdown.push({ label: selectedShiftObj[0].shiftName, value: [selectedShiftObj[0]['_id']] });
      const shiftIdList = shiftList
      // .filter((shift) => !isShiftTimeElapsed(shift.startTime, date))
        .map((shift) => shift['_id']);
      shiftDropdown.push({ label: 'all shift', value: [...shiftIdList] });
      const updatedState = {
        dateDropDown, shiftDropdown, shiftId, countId: !isEmpty(data) ? data._id : null,
      };
      toggleFunction(updatedState);
    }
  };

  const selectedShiftObj = shiftList.filter((shift) => shift._id === shiftId);
  const shiftName = selectedShiftObj[0].shiftName.toLowerCase();
  let orgCount = expectedCount - get(data, 'vendors', []).reduce((acc, val) => acc + val.expectedEmpCount, 0);
  orgCount = orgCount > -1 ? orgCount : 0;
  // }
  return (
    <div>
      {expectedCount ? (
        <div>
          <span
            data-tip={get(data, '_id', '')}
            data-for={get(data, '_id', '')}
            style={{ cursor: isDisabled ? 'not-allowed' : 'pointer', color: isDisabled ? '#8697A8' : 'inherit' }}
            onClick={cellClickHandler}
            role="button"
            aria-hidden
          >
            {`${count}/${expectedCount}`}

            <div className={styles.countBar} style={{ backgroundColor: bgColor, width: '38px' }}>
              <div
                className={styles.countBar}
                style={{
                  margin: 0, width: `${(count / expectedCount) * 38}px`, backgroundColor: color,
                }}
              />
              <Tooltip id={get(data, '_id', '')} place="right" tooltipClass={styles.tooltip} delayShow={300}>
                <div className="p-2">
                  <table className={styles.tooltipData}>
                    <tbody>
                      <tr>
                        <td className={styles.tooltipTitle} colSpan="2">{`${shiftName} shift time details`}</td>
                      </tr>
                      <tr className={cx(styles.tableHead)}>
                        <td className={styles.tooltipValue}> employee source</td>
                        <td className={styles.tooltipValue}> added/expected emp</td>
                      </tr>
                      <tr>
                        <td className={styles.tooltipValue}>my organization</td>
                        <td className={styles.tooltipValue}>{`${get(data, `actualEmpCountDetails.${orgId}`, 0)}/${orgCount}`}</td>
                      </tr>
                      {!isEmpty(data.vendors) && data.vendors.map((vendor) => (
                        <tr key={vendor.vendorId}>
                          <td className={styles.tooltipValue}>{vendorData[vendor.vendorId]}</td>
                          <td className={styles.tooltipValue}>{`${get(data, `actualEmpCountDetails.${vendor.vendorId}`, 0)}/${vendor.expectedEmpCount}`}</td>
                        </tr>
                      ))}
                      <tr className={cx(styles.tooltipTitle, styles.tableTotal)}>
                        <td className={styles.tooltipValue}>total</td>
                        <td className={styles.tooltipValue}>{`${count}/${expectedCount}`}</td>
                      </tr>

                    </tbody>
                  </table>
                </div>
              </Tooltip>
            </div>
          </span>
        </div>
      )
        : (
          <span
            className={cx(styles.plus, {
              [`${styles.disabled}`]: isDisabled,
            })}
            style={{ backgroundColor: bgColor, color: fontColor }}
            role="button"
            tabIndex="0"
            aria-hidden
            onClick={cellClickHandler}
          >
            {`${count}`}
          </span>
        )}
    </div>
  );
};

export default React.memo(CountCell, isPropsEqual);
