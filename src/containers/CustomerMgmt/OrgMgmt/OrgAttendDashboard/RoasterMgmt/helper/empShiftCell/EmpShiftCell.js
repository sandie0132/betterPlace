import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import moment from 'moment';
import { Button } from 'react-crux';
import isEqual from 'lodash/isEqual';
import styles from './EmpShiftCell.module.scss';
import add from '../../../../../../../assets/icons/addMoreWhite.svg';
import addMore from '../../../../../../../assets/icons/addMore.svg';
import {
  getShiftTime, isShiftTimeElapsed, getShiftColor, getSourceImage,
} from '../../roasterHelper';
import arrow from '../../../../../../../assets/icons/arrowUp.svg';
import close from '../../../../../../../assets/icons/closeNotification.svg';
import editRound from '../../../../../../../assets/icons/editRound.svg';
import bin from '../../../../../../../assets/icons/delete.svg';
import notAllowed from '../../../../../../../assets/icons/notAllowed.svg';
import Loader from '../../../../../../../components/Organism/Loader/Loader';

const ifPropsEqual = (prev, next) => prev.isLeave === next.isLeave
&& JSON.stringify(prev.shift) === JSON.stringify(next.shift)
&& prev.isDisabled === next.isDisabled
&& isEqual(prev.emp, next.emp)
&& prev.date === next.date
&& prev.offType === next.offType
&& JSON.stringify(prev.ids) === JSON.stringify(next.ids)
&& prev.isFocused === next.isFocused
&& prev.disableShiftPopup === next.disableShiftPopup
&& prev.isSelected === next.isSelected;

const initialState = {
  showDropdown: false,
  deleteIndex: -1,
};

const EmpShiftCell = ({
  isLeave,
  shift,
  isDisabled,
  onClick,
  emp,
  date,
  offType,
  ids = [],
  isFocused,
  disableShiftPopup,
  isSelected,
}) => {
  const [state, setState] = useState(initialState);
  const {
    showDropdown,
    deleteIndex,
  } = state;

  const toggleDropdown = () => {
    setState((prev) => ({
      ...prev,
      showDropdown: !prev.showDropdown,
    }));
  };

  const onAsssign = () => {
    toggleDropdown();
    onClick({ type: 'addFirst', emp, date });
  };

  const onDelete = (index) => {
    onClick({
      type: 'delete', id: ids[index], emp, date,
    });
    setState({
      ...state,
      deleteIndex: index,
    });
  };

  useEffect(() => {
    if (deleteIndex > -1) {
      setState((prev) => ({
        ...prev,
        deleteIndex: -1,
      }));
    }
  },
  // eslint-disable-next-line
  [ids.length]);

  useEffect(() => {
    if (shift.length > 0 && showDropdown) {
      setState((prev) => ({
        ...prev,
        showDropdown: false,
      }));
    }
  },
  // eslint-disable-next-line
  [isFocused]);

  if ((isLeave && !isSelected) || offType) {
    return (
      <div className={cx(styles.shiftCell)} style={{ minHeight: '90px', margin: '10px 0 0 0' }}>
        <div className={styles.leaveText}>{isLeave ? 'on leave' : offType.replace('_', ' ').toLowerCase()}</div>
        <div className={styles.add}>
          {!isDisabled && (
          <div style={{ display: 'inline-flex', padding: '20px 0 0 0' }}>
            { offType && (
            <div onClick={() => onClick({ type: 'edit', emp, date })} role="button" tabIndex="0" aria-hidden>
              <img className={styles.cursor} src={editRound} alt="add" height="30px" />
            </div>
            )}
            <div className={styles.cursor}>
              <div
                className={styles.imgWrapper}
                onClick={() => (isLeave ? () => null : onClick({
                  type: 'delete', emp, date, id: ids[0],
                }))}
                role="button"
                tabIndex="0"
                aria-hidden
              />
            </div>
          </div>
          )}
        </div>
      </div>
    );
  }

  if (isLeave && isSelected) {
    return (
      <div className={cx(styles.cannotCopy)} style={{ minHeight: '100px' }}>
        <div className="d-flex flex-row">
          <div className={styles.deletePill}>
            <img src={notAllowed} alt="delete" height="27px" className="p-2" />
            <span className={cx('pl-2 pt-1')}>
              can&apos;t copy
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (shift.length === 1 && shift[0]) {
    const {
      startTime = {}, endTime = {}, shiftName = '',
    } = shift[0];
    const shiftStart = getShiftTime(startTime);
    const shiftEnd = getShiftTime(endTime);
    if (deleteIndex === -1) {
      return (
        <div className={cx(styles.shiftCell)} style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}>
          <div className={styles.shiftHeading}>
            {shiftName}
          </div>
          <div className={styles.shiftTime}>{`${shiftStart}-${shiftEnd}`}</div>
          <div className={styles.add}>
            {!isDisabled && (
            <div style={{ display: 'inline-flex' }}>
              <div onClick={() => onClick({ type: 'addFirst', emp, date })} role="button" tabIndex="0" aria-hidden>
                <img className={styles.cursor} src={addMore} alt="add" />
              </div>
              {!isShiftTimeElapsed(startTime, moment(date, 'MM-DD-YYYY'))
            && (
            <div className={styles.cursor}>
              <div
                className={styles.imgWrapper}
                onClick={() => onDelete(0)}
                role="button"
                tabIndex="0"
                aria-hidden
              />
            </div>
            )}
            </div>
            )}
          </div>
        </div>
      );
    }
    return (
      <div className="d-flex flex-row">
        <div className={styles.deletePill}>
          <img src={bin} alt="delete" height="27px" className="p-2" />
          <span className={cx('pl-2 pt-1')}>
            deleting...
          </span>
        </div>
      </div>
    );
  }

  if (shift.length > 1) {
    return (
      <div className={styles.multipleShiftBG}>
        <div className={styles.multipleShiftText}>
          {shift.length}
          {' '}
          shifts added
        </div>
        <div>
          {
            shift.length < 4
              ? (
                shift.map((shiftData) => {
                  const { color } = getShiftColor(shiftData._id);
                  return (
                    <div
                      key={shiftData._id}
                      className={styles.shiftIconSquare}
                      style={{ backgroundColor: color }}
                    />
                  );
                })
              )
              : (
                <>
                  {
                shift.slice(0, 4).map((shiftData) => {
                  const { color } = getShiftColor(shiftData._id);
                  return (
                    <div
                      key={shiftData._id}
                      className={styles.shiftIconSquare}
                      style={{ backgroundColor: color }}
                    />
                  );
                })
              }
                  {
                shift.length !== 4
                && (
                <div className={styles.extraCountTab}>
                  +
                  {shift.length - 4}
                </div>
                )
              }
                </>
              )
          }
        </div>
        {!disableShiftPopup
        && (
        <>
          <div
            className={styles.alignArrowIcon}
            aria-hidden
          >
            <img src={arrow} onClick={toggleDropdown} aria-hidden alt="arrow" height="6px" className={!showDropdown && styles.invertIcon} />
          </div>
          <div className="position-relative">
            {
          showDropdown
        && (
        <div className={styles.shiftDropdown}>
          <div className="d-flex mb-2">
            <div className={cx(styles.shiftCount, 'my-auto')}>
              added shifts (
              {shift.length}
              )
            </div>
            <div className="ml-auto">
              <Button isDisabled={isDisabled || deleteIndex > -1} label="assign" type="add" role="button" tabIndex={0} aria-hidden clickHandler={!isDisabled ? onAsssign : null} />
            </div>
          </div>
          {
            shift.map((shifts, index) => {
              const { backgroundColor } = getShiftColor(shifts._id);
              if (index === deleteIndex) {
                return (
                  <div
                    className={styles.delete}
                    style={{ backgroundColor: '#FBE9EB' }}
                  >
                    <img src={bin} alt="delete" height="30px" className="p-2" />
                    <span className={cx(styles.deleteText, 'pl-2 pt-1')}>
                      deleting
                    </span>
                    <span style={{ paddingLeft: '190px' }}>
                      <Loader type="stepLoaderRed" />
                    </span>
                  </div>
                );
              }

              return (
                <div
                  className={styles.shiftBar}
                  style={{ backgroundColor, pointerEvents: deleteIndex > -1 ? 'none' : 'all' }}
                >
                  <img src={getSourceImage({ startTime: shifts.startTime })} alt="shift" height="24px" />
                  <span className={cx(styles.dropdownName, {
                    [`${styles.edited}`]: shifts.status === 'DRAFT',
                  })}
                  >
                    {shifts.shiftName}
                  </span>
                  <span style={{ fontFamily: 'Gilroy Medium', fontStyle: 'normal' }}>&nbsp;|</span>
                  <span className={cx(styles.dropdownTime, {
                    [`${styles.edited}`]: shifts.status === 'DRAFT',
                  })}
                  >
                    {getShiftTime(shifts.startTime)}
                    -
                    {getShiftTime(shifts.endTime)}
                  </span>
                  {!isDisabled && !isShiftTimeElapsed(shifts.startTime, moment(date, 'MM-DD-YYYY'))
                  && (
                  <div
                    className={cx('ml-auto', styles.cursor)}
                    onClick={() => onDelete(index)}
                    role="button"
                    tabIndex="0"
                    aria-hidden
                  >
                    <img
                      src={close}
                      alt="close"
                    />
                  </div>
                  )}
                </div>
              );
            })
          }
        </div>
        )
          }
          </div>
        </>
        )}
      </div>
    );
  }

  return (
    <div className={cx(styles.shiftCell)} style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}>
      <div className={styles.leaveText} role="button" tabIndex={0} aria-hidden onClick={() => (!isDisabled ? onClick({ type: 'addFirst', emp, date }) : null)}>
        <img src={add} alt="add" height="24px" />
      </div>
    </div>
  );
};

export default React.memo(EmpShiftCell, ifPropsEqual);
