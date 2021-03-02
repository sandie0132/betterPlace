import React from 'react';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import styles from './collapsedCount.module.scss';
import { fetchCountData, getShiftColor } from '../../roasterHelper';

const isPropsEqual = (prev, next) => {
  const prevShiftList = prev.shifts.slice(0, 5);
  const nextShiftList = next.shifts.slice(0, 5);
  return (
    JSON.stringify(prevShiftList) === JSON.stringify(nextShiftList)
    && prev.date.isSame(next.date)
    && JSON.stringify(prev.totalEmpCountData) === JSON.stringify(next.totalEmpCountData)
  );
};
const CollapsedCountCell = ({ shifts, date, totalEmpCountData }) => {
  const isEmpCountAdded = totalEmpCountData.some((empCount) => get(empCount, 'expectedEmpCountDetails', [])
    .some((count) => count.assignDate === date.format('YYYY-MM-DD')));
  const restNumbers = isEmpCountAdded ? shifts.length - 5 : shifts.length - 3;
  return (
    <div className="row mt-2 mb-2 mr-2 ml-0 justify-content-center">
      { isEmpCountAdded ? (
        <>
          {shifts.slice(0, 5).map(({ _id }) => {
            let expectedCount = 0;
            let count = 0;
            const data = fetchCountData({ shiftId: _id, date, totalEmpCountData });
            if (!isEmpty(data)) {
              expectedCount = parseInt(data.expectedEmpCount, 10);
              count = Object.values(data.actualEmpCountDetails).reduce((acc, val) => acc + val, 0);
            }
            const { backgroundColor, color } = getShiftColor(_id);
            const height = 36 * (count / expectedCount);
            return (
              <div key={_id} className={styles.countBar} style={{ backgroundColor, height: '36px' }}>
                <div
                  className={styles.countBar}
                  style={
                    {
                      backgroundColor: color,
                      height: `${height}px`,
                      margin: `${36 - height}px 0 0 0`,
                    }
                  }
                />
              </div>

            );
          })}
        </>
      ) : (
        <>
          {shifts.slice(0, 3).map(({ _id }) => {
            let count = 0;
            const data = fetchCountData({ shiftId: _id, date, totalEmpCountData });
            if (!isEmpty(data)) {
              count = Object.values(data.actualEmpCountDetails).reduce((acc, val) => acc + val, 0);
            }
            const { backgroundColor, color } = getShiftColor(_id);
            return (
              <div key={_id} className={styles.empty} style={{ backgroundColor, color, height: '20px' }}>
                {count}
              </div>
            );
          })}
        </>
      )}

      <div className="mt-auto mb-auto">
        <span>
          {isEmpty(shifts) && (<span className={styles.extra}>NA</span>) }
          {parseInt(restNumbers, 10) > 0 && (<span className={styles.extra}>{`+ ${restNumbers}`}</span>)}
        </span>
      </div>
    </div>
  );
};

export default React.memo(CollapsedCountCell, isPropsEqual);
