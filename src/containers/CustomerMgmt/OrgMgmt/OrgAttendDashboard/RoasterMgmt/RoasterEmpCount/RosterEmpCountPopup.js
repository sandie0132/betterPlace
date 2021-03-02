/* eslint-disable max-len */
import React, {
  useEffect, useCallback, useState,
} from 'react';
import cx from 'classnames';
import moment from 'moment';
import { Button, Input } from 'react-crux';
import {
  isEmpty,
  get,
  cloneDeep,
  isEqual,
} from 'lodash';
import { useRouteMatch, useLocation } from 'react-router';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { validation, message } from './RosterEmpCountValidations';
// import Prompt from '../../../../../../components/Organism/Prompt/Prompt';
import Notification from '../../../../../../components/Molecule/Notification/Notification';
import CustomSelect from '../../../../../../components/Atom/CustomSelect/CustomSelect';
import CheckBox from '../../../../../../components/Atom/CheckBox/CheckBox';
import CancelButton from '../../../../../../components/Molecule/CancelButton/CancelButton';
import WarningPopUp from '../../../../../../components/Molecule/WarningPopUp/WarningPopUp';
import DeleteButton from '../../../../../../components/Molecule/DeleteButton/DeleteButton';
import scrollStyle from '../../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import Spinnerload from '../../../../../../components/Atom/Spinner/Spinner';
import yellowWarn from '../../../../../../assets/icons/yellowWarnRound.svg';
import warn from '../../../../../../assets/icons/warning.svg';
import addButton from '../../../../../../assets/icons/addMore.svg';
import styles from './RosterEmpCountPopup.module.scss';
import { isPastDate, isToday } from '../roasterHelper';

import closePage from '../../../../../../assets/icons/closeBigIcon.svg';
import {
  getVendorData,
  postExpectedEmpCount,
  getExpectedEmpCount,
  deleteExpectedEmpCount,
} from '../Store/actions';

const initialState = {
  assignDates: [],
  shiftIds: [],
  expectedEmpCount: '',
  vendors: [],
  addingForDropdown: [],
  shiftsDropDown: [],
  vendorDropDown: [],
  enableSubmit: false,
  errors: {},
  filterOptionsBy: {},
  showCancelPopUp: false,
  isEdited: false,
  showNotification: false,
  remainingCount: null,
  showRemoveCountPopup: false,
};

const payloadFields = ['assignDates', 'shiftIds', 'expectedEmpCount', 'vendors'];

const RosterEmpCountPopup = ({
  toggleFunction, countDetails, startDate, endDate,
}) => {
  const [state, setState] = useState(cloneDeep(initialState));
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const location = useLocation();
  const orgMgmtRState = useSelector((rstate) => get(rstate, 'orgMgmt', {}), shallowEqual);
  const {
    vendorData,
    empCountData,
    error,
    loading,
  } = get(orgMgmtRState, 'orgAttendDashboard.roasterMgmt.roasterMgmt', {});
  const orgId = match.params.uuid;
  const {
    dateDropDown, shiftDropdown, shiftId, countId,
  } = countDetails;
  const { siteId } = match.params;

  const {
    enableSubmit,
    errors,
    showCancelPopUp,
    vendors,
    isEdited,
    assignDates,
    vendorDropDown,
    shiftIds,
    expectedEmpCount,
    addingForDropdown,
    shiftsDropDown,
    filterOptionsBy,
    remainingCount,
    showRemoveCountPopup,
  } = state;

  // create random alpha numeric string used for uid
  const randomString = () => Math.random().toString(36).slice(2);

  const handlePropsToState = useCallback(() => {
    const initState = {
      assignDates: [],
      shiftIds: [],
      expectedEmpCount: '',
      vendors: [],
    };
    if (!isEmpty(empCountData)) {
      Object.keys(initState).forEach((field) => {
        if (field === 'expectedEmpCount' && !Number.isNaN(empCountData[field])) { initState[field] = empCountData[field].toString(); } else if (field === 'vendors') {
          const updatedVendors = [];
          if (!isEmpty(empCountData[field])) {
            empCountData[field].forEach((vndr) => {
              updatedVendors.push({ vendorId: vndr.vendorId, expectedEmpCount: vndr.expectedEmpCount.toString(), uid: randomString() });
            });
          }
          initState[field] = updatedVendors;
        } else if (field === 'assignDates' && !isEmpty(empCountData.assignDate)) { initState[field] = [empCountData.assignDate]; } else if (field === 'shiftIds' && !isEmpty(empCountData.shiftId)) initState[field] = [empCountData.shiftId];
      });
    }
    setState((prev) => ({
      ...prev,
      ...initState,
      errors: {},
      isEdited: false,
      enableSubmit: false,
      showCancelPopUp: false,
    }));
  }, [empCountData]);

  // if dropdown data in location empty return to roaster/ setting dropdown to state
  useEffect(() => {
    dispatch(getVendorData(orgId));
    if (!isEmpty(countId)) dispatch(getExpectedEmpCount(orgId, siteId, shiftId, countId));

    setState((prev) => ({
      ...prev,
      addingForDropdown: dateDropDown,
      shiftsDropDown: shiftDropdown,
    }));
    if (isEmpty(countId)) {
      setState((prev) => ({
        ...prev,
        assignDates: dateDropDown[0].value,
        shiftIds: shiftDropdown[0].value,
      }));
    }
    // eslint-disable-next-line
  }, [])

  /// handle  props to state on successful state
  useEffect(() => {
    if (!location.pathname.includes('/add') && !error && empCountData._id === countId) {
      handlePropsToState();
    }
  }, [error, location.pathname, handlePropsToState, countId, empCountData]);

  // vendor dropdown creation with the vendor data
  useEffect(() => {
    const allVendors = get(vendorData, 'vendors', []);
    const updtedVendorDropDown = [];
    updtedVendorDropDown.push({ value: null, label: 'select vendor' });
    if (!isEmpty(allVendors)) {
      allVendors.forEach((vendor) => {
        updtedVendorDropDown.push({ value: vendor._id, label: vendor.name.toLowerCase() });
      });
    }
    setState((prev) => ({
      ...prev,
      vendorDropDown: updtedVendorDropDown,
    }));
  },
  [vendorData]);

  const handleSubmit = () => {
    const updatedState = cloneDeep(state);
    Object.keys(updatedState).forEach((field) => {
      if (!payloadFields.includes(field)) { delete updatedState[field]; }
    });
    const futureDates = updatedState.assignDates.filter((date) => !isPastDate(moment(date, 'YYYY-MM-DD') || isToday(moment(date, 'YYYY-MM-DD'))));
    updatedState.assignDates = futureDates;
    updatedState.expectedEmpCount = parseInt(updatedState.expectedEmpCount, 10);
    const vendorList = updatedState.vendors;
    if (!isEmpty(vendorList)) {
      vendorList.forEach((vendor, index) => {
        if (isEmpty(vendor.vendorId) && isEmpty(vendor.expectedEmpCount)) delete vendorList[index];
        else {
          vendorList[index].expectedEmpCount = parseInt(vendor.expectedEmpCount, 10);
          delete vendorList[index].uid;
        }
      });
    }

    updatedState.vendors = vendorList;
    const data = {
      expectedEmpCountList: [updatedState],
    };
    dispatch(postExpectedEmpCount(orgId, siteId, data, startDate, endDate));
    setState((prev) => ({
      ...prev,
      isEdited: false,
      showNotification: true,
    }));
  };

  const handleEnableSubmit = (requiredFields, vendorList) => {
    let updatedEnableSubmit = requiredFields.every((field) => !isEmpty(field));
    if (!isEmpty(vendorList)) {
      vendorList.forEach((vendr) => {
        if (isEmpty(vendr.vendorId) || isEmpty(vendr.expectedEmpCount)) {
          updatedEnableSubmit = false;
        }
      });
    }
    setState((prev) => ({
      ...prev,
      enableSubmit: updatedEnableSubmit,
    }));
  };

  const handleInputChange = (value, inputField, section, index) => {
    const updatedState = { ...state };
    if (!isEmpty(section)) {
      const vendorList = updatedState.vendors;
      vendorList.forEach((vendor, indx) => {
        if (index === indx) vendorList[indx][inputField] = value;
      });
      updatedState.vendors = vendorList;
    } else {
      updatedState[inputField] = value;
    }
    setState({
      ...updatedState,
      isEdited: true,
    });
  };

  const handleAddVendor = () => {
    const updatedState = { ...state };
    let updatedVendors = updatedState.vendors;
    const randomStr = randomString();
    const newVendorObj = { vendorId: null, expectedEmpCount: '', uid: randomStr };
    updatedVendors = [
      ...updatedVendors.slice(0),
      newVendorObj,
    ];
    updatedState.vendors = updatedVendors;
    setState({
      ...updatedState,
    });
  };

  const handleDeleteVendor = (e, targetIndex) => {
    const updatedState = { ...state };
    let updatedVendors = updatedState.vendors;
    let randomStr = '';
    updatedVendors = updatedVendors.filter((data, index) => {
      if (index === targetIndex) { randomStr = data.uid; return null; }
      return data;
    });
    updatedState.vendors = updatedVendors;
    const cloneErr = cloneDeep(errors);
    delete cloneErr[`vendorExpectedEmpCount_${randomStr}`];
    setState({
      ...updatedState,
      errors: cloneErr,
    });
  };

  const handleCancel = () => {
    handlePropsToState();
  };

  const handleCancelPopUp = () => {
    if (!isEdited) {
      handleCancel();
    } else {
      setState((prev) => ({
        ...prev,
        showCancelPopUp: !prev.showCancelPopUp,
      }));
    }
  };

  const handleError = (err, inputField) => {
    const currentErrors = cloneDeep(errors);
    const updatedErrors = cloneDeep(currentErrors);
    if (!isEmpty(err)) {
      updatedErrors[inputField] = err;
    } else {
      delete updatedErrors[inputField];
    }
    if (!isEqual(updatedErrors, currentErrors)) {
      setState((prev) => ({
        ...prev,
        errors: updatedErrors,
      }));
    }
  };

  const handleRemainingCount = useCallback(() => {
    let updatedRemainingCount = null;
    if (!isEmpty(expectedEmpCount)) {
      updatedRemainingCount = parseInt(expectedEmpCount, 10);
      if (!isEmpty(vendors)) {
        vendors.forEach((vd) => {
          const vendorExpCount = !isEmpty(vd.expectedEmpCount) ? parseInt(vd.expectedEmpCount, 10) : 0;
          updatedRemainingCount -= vendorExpCount;
        });
      }
    }
    setState((prev) => ({
      ...prev,
      remainingCount: updatedRemainingCount,
    }));
    // eslint-disable-next-line
  }, [expectedEmpCount, vendors, JSON.stringify(vendors)]);

  useEffect(() => {
    handleRemainingCount();
    // eslint-disable-next-line
  }, [handleRemainingCount, expectedEmpCount, JSON.stringify(vendors)]);

  // checking enable button for every form values
  // eslint-disable-next-line
  useEffect(() => { if (isEdited) handleEnableSubmit([assignDates, shiftIds, expectedEmpCount], vendors)}, [JSON.stringify(assignDates), shiftIds, vendors, expectedEmpCount, JSON.stringify(vendors)]);

  // filter options by for every vendor
  useEffect(() => {
    const filter = { value: [] };
    vendorDropDown.forEach((option) => {
      let vendorFound = false;
      vendors.forEach((vendor) => {
        if (vendor.vendorId === option.value) vendorFound = true;
      });
      if (!vendorFound) filter.value.push(option.value);
    });
    setState((prev) => ({
      ...prev,
      filterOptionsBy: filter,
    }));
  }, [vendors, vendorDropDown]);

  const toggleRemoveCount = (e) => {
    if (e) e.preventDefault();
    setState((prev) => ({
      ...prev,
      showRemoveCountPopup: !prev.showRemoveCountPopup,
    }));
  };

  const handleRemove = (e) => {
    if (e) e.preventDefault();
    dispatch(deleteExpectedEmpCount({
      orgId, siteId, countId, startDate, endDate, assignDates, shiftIds,
    }));
    toggleRemoveCount();
    setState((prev) => ({
      ...prev,
      isEdited: false,
    }));
  };
  return (
    <div className={styles.backDrop}>
      <img src={closePage} alt="close" className={styles.closeIcon} onClick={() => toggleFunction({}, true)} aria-hidden />
      <div className={cx(styles.alignCenter, scrollStyle.scrollbar)}>
        <div className={styles.formContainer}>
          <div className={styles.scrollableForm}>
            <form>
              <div className="d-flex flex-column">
                { (isEmpty(countId))
                  ? (
                    <span className={cx(styles.sectionHeading, 'pl-3')} style={{ paddingBottom: '2rem' }}>add expected employee count for shift&#39;s</span>
                  )
                  : (
                    <span className={cx(styles.sectionHeading, 'pl-3')} style={{ paddingBottom: '2rem' }}>edit expected employee count for shift&#39;s</span>
                  )}
                <div className="row no-gutters">
                  <Input
                    name="expectedEmpCount"
                    placeholder="total count"
                    required
                    className="col-4 pl-3"
                    value={get(state, 'expectedEmpCount', '30')}
                    onChange={(val) => handleInputChange(val, 'expectedEmpCount')}
                    label="total expected count"
                    onError={(err) => handleError(err, 'expectedEmpCount')}
                    validation={validation.count}
                    message={message.count}
                    errors={errors.expectedEmpCount}
                  />
                  <CustomSelect
                    name="addingFor"
                    className="my-1 col-4 py-2 pl-3"
                    label="adding for"
                    required
                    options={addingForDropdown}
                    value={get(state, 'assignDates', [])}
                    onChange={(value) => handleInputChange(value, 'assignDates')}
                    disabled={!!countId}
                  />

                  <CustomSelect
                    name="shift"
                    className="my-1 col-4 py-2 pl-3"
                    label="shift"
                    required
                    options={shiftsDropDown}
                    value={get(state, 'shiftIds', '[]')}
                    onChange={(value) => handleInputChange(value, 'shiftIds')}
                    disabled={!!countId}
                  />

                </div>
                {/* <hr className={styles.horizontalLine} /> */}
                <div className={cx(styles.bubble)}>
                  <div className="d-flex flex-row justify-content-between">
                    <span className={cx(styles.subHeading, 'pl-3 mt-3 mb-2')}>expected employees from vendors</span>
                    {!isEmpty(vendors) && !isEmpty(expectedEmpCount) && remainingCount < 0 && (
                      <div className="d-flex flex-row position-relative ml-3 mb-3">
                        <div style={{ marginTop: '0.5rem' }}>
                          <span className={styles.infoText}>
                            <img src={yellowWarn} alt="warning" className="pr-2" />
                            total count for verdors exceeds the total expected count. please check again
                          </span>
                        </div>
                      </div>
                    )}

                  </div>
                  {!isEmpty(vendors) && vendors.map((vendor, index) => (
                    <div className="row no-gutters" key={vendor.uid}>
                      <CustomSelect
                        name="vendorId"
                        className="my-1 col-4 py-2 pl-3"
                        label="select a vendor"
                        required
                        filterOptionsBy={filterOptionsBy}
                        options={vendorDropDown}
                        value={get(vendor, 'vendorId', null)}
                        onChange={(val) => handleInputChange(val, 'vendorId', 'vendors', index)}
                      />

                      <Input
                        placeholder=""
                        className="col-4 pl-3"
                        required
                        value={get(vendor, 'expectedEmpCount', '')}
                        onChange={(val) => handleInputChange(val, 'expectedEmpCount', 'vendors', index)}
                        label="select count for vendor"
                        onError={(err) => handleError(err, `vendorExpectedEmpCount_${vendor.uid}`)}
                        validation={validation.count}
                        message={message.count}
                        errors={errors[`vendorExpectedEmpCount_${vendor.uid}`]}
                      />

                      <DeleteButton
                        label="delete"
                        isDisabled={false}
                        isDeleteIconRequired
                        className={styles.deleteButton}
                        clickHandler={(e) => handleDeleteVendor(e, index)}
                      />
                    </div>
                  ))}

                  <div className={cx(styles.blueText, 'ml-3 mt-2')} onClick={handleAddVendor} role="button" aria-hidden>
                    <img src={addButton} className="mr-2" alt="add button" />
                    add new vendor
                  </div>
                </div>
                {!isEmpty(countId)
              && (
              <>
                <hr className={styles.horizontalLine} />
                <div className="d-flex flex-row justify-content-between mt-2 ml-3">
                  <div className="d-flex flex-row position-relative">

                    <CheckBox
                      type="medium"
                      name="removeCount"
                      value={get(state, 'showRemoveCountPopup', false)}
                      onChange={(e) => toggleRemoveCount(e)}
                      checkMarkStyle={styles.checkMarkStyle}
                    />
                    <div className="ml-4">
                      <span className={styles.checkBoxText}>delete count </span>
                    </div>

                  </div>

                </div>
              </>
              )}

              </div>

            </form>
          </div>
          {showRemoveCountPopup
            && (
            <div className={styles.removeContainer}>
              <div className="d-flex flex-row justify-content-between">
                <span className={styles.removeContainerText} style={{ paddingTop: '8px' }}>are you sure you want to delete the count?</span>
                <div className="row mr-0">
                  <Button
                    type="noButton"
                    label="no"
                    clickHandler={(e) => toggleRemoveCount(e)}
                  />
                  <Button
                    type="yesButton"
                    label="yes"
                    clickHandler={(e) => handleRemove(e)}
                  />
                </div>
              </div>

            </div>
            )}
          {/* //////// save buttons */}
          <div className={styles.fixedFooter}>
            <div className={cx(styles.formFooter, 'row')} style={{ height: '3.5rem' }}>
              <div className={cx(styles.timeFooter, 'col-8 mx-0 px-0')}>
                { error
                  ? (
                    <Notification
                      type="warning"
                      message={error}
                    />
                  )
                  : !enableSubmit && loading !== 'expectedEmpCount'
                    && (
                    <Notification
                      type="basic"
                      message="please fill all the mandatory fields to enable save"
                    />
                    )}
              </div>

              <div className="ml-auto d-flex my-auto">
                <div className={cx('row no-gutters justify-content-end')}>
                  <CancelButton isDisabled={false} clickHandler={handleCancelPopUp} className={styles.cancelButton}>cancel</CancelButton>
                  {showCancelPopUp
                    && (
                      <WarningPopUp
                        text="cancel?"
                        para="WARNING: it can not be undone"
                        confirmText="yes, cancel"
                        cancelText="keep"
                        icon={warn}
                        warningPopUp={handleCancel}
                        closePopup={handleCancelPopUp}
                      />
                    )}
                  {(loading === 'empCountPost' || loading === 'deleteExpectedCount') ? <Spinnerload type="loading" />
                    : (
                      <Button
                        label="done"
                        isDisabled={!(enableSubmit && isEmpty(errors))}
                        clickHandler={(e) => handleSubmit(e)}
                        type="save"
                      />
                    )}
                </div>

              </div>

            </div>
          </div>

        </div>
        <div />
      </div>
    </div>
  );
};

export default RosterEmpCountPopup;
