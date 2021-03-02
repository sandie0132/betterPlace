/* eslint-disable dot-notation */
/* eslint-disable max-len */
import React, { useCallback, useEffect, useState } from 'react';
import cx from 'classnames';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import moment from 'moment';
import { Button } from 'react-crux';
import { useRouteMatch, useLocation, useHistory } from 'react-router';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import styles from './CreateShiftForm.module.scss';
import ArrowLink from '../../../../../../../components/Atom/ArrowLink/ArrowLink';
import Notification from '../../../../../../../components/Molecule/Notification/Notification';
import Prompt from '../../../../../../../components/Organism/Prompt/Prompt';
import Spinnerload from '../../../../../../../components/Atom/Spinner/Spinner';
import { InitData, requireFields } from '../CreateShiftInitData';
import { validation, message } from '../CreateShiftValidations';
import CancelButton from '../../../../../../../components/Molecule/CancelButton/CancelButton';
import WarningPopUp from '../../../../../../../components/Molecule/WarningPopUp/WarningPopUp';
import CreateShiftInput from '../CreateShiftInput';
import CheckBox from '../../../../../../../components/Atom/CheckBox/CheckBox';
import scrollStyle from '../../../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import warn from '../../../../../../../assets/icons/warning.svg';
import {
  getShiftDetailsById,
  postShiftDetails,
  putShiftDetailsById,
  deleteShiftDetailsById,
} from '../Store/action';

const initialState = {
  formData: cloneDeep(InitData),
  isEdited: false,
  enableSubmit: false,
  showCancelPopup: false,
  errors: {},
  showNotification: false,
  showRemoveShiftPopup: false,
  removeShift: false,
  triggeredSection: false,
  calculatePValue: true,
  isMounted: false,
};

const CreateShiftForm = () => {
  const [state, setState] = useState(cloneDeep(initialState));
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const orgId = match.params.uuid;
  const { siteId } = match.params;
  const { shiftId } = match.params;
  const orgMgmtRState = useSelector((rstate) => get(rstate, 'orgMgmt', {}), shallowEqual);
  const createShiftRState = get(orgMgmtRState, 'orgAttendDashboard.siteShiftMgmt.createShift', {});
  const postShiftState = get(createShiftRState, 'postShiftDetailsByIdState', 'INIT');
  const getShiftState = get(createShiftRState, 'getShiftDetailsByIdState', 'INIT');
  const putShiftState = get(createShiftRState, 'putShiftDetailsByIdState', 'INIT');
  const deleteShiftState = get(createShiftRState, 'deleteShiftDetailsByIdState', 'INIT');
  const shiftDetails = get(createShiftRState, 'shiftDetails', {});
  const error = get(createShiftRState, 'error', null);

  const {
    formData,
    isEdited,
    enableSubmit,
    showCancelPopup,
    errors,
    showRemoveShiftPopup,
    removeShift,
    triggeredSection,
    calculatePValue,
    isMounted,
    showNotification,
  } = state;

  const handlePropsToState = useCallback(() => {
    const formInitData = cloneDeep(InitData);
    let updatedFormData = cloneDeep(formInitData);
    if (!isEmpty(shiftDetails)) {
      updatedFormData = cloneDeep(shiftDetails);
      const inputCheck = ['hours', 'minutes'];
      Object.keys(formInitData).forEach((field) => {
        if (isEmpty(updatedFormData[field])) {
          updatedFormData[field] = formInitData[field];
        }
        if (typeof updatedFormData[field] === 'object') {
          Object.keys(updatedFormData[field]).forEach((key) => {
            if (inputCheck.includes(key)) {
              if (updatedFormData[field][key] !== null) updatedFormData[field][key] = updatedFormData[field][key].toString();
            }
          });
        }
      });
    }
    setState((prev) => ({
      ...prev,
      formData: updatedFormData,
      isEdited: false,
      enableSubmit: false,
      errors: {},
      triggeredSection: null,
      showCancelPopup: false,
      showRemoveShiftPopup: false,
    }));
  }, [shiftDetails]);

  useEffect(() => {
    if (!isEmpty(shiftId) && !isMounted) {
      setState((prev) => ({
        ...prev,
        calculatePValue: false,
      }));
      dispatch(getShiftDetailsById(orgId, siteId, shiftId));
    }
    setState((prev) => ({
      ...prev,
      isMounted: true,
    }));
  }, [match.params, dispatch, orgId, siteId, shiftId, isMounted]);

  useEffect(() => {
    if (!location.pathname.includes('/add') && getShiftState === 'SUCCESS' && shiftDetails['_id'] === shiftId) {
      handlePropsToState();
    }
  }, [getShiftState, location.pathname, shiftId, shiftDetails, handlePropsToState]);

  useEffect(() => {
    if (putShiftState === 'SUCCESS' || putShiftState === 'ERROR') {
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          showNotification: false,
        }));
      }, 5000);
    }
  }, [putShiftState]);

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

  const toggleRemoveShift = (e) => {
    if (e) e.preventDefault();
    setState({
      ...state,
      showRemoveShiftPopup: !showRemoveShiftPopup,
      removeShift: !removeShift,
    });
  };

  const calculatedFormValues = (updatedData) => {
    const updatedFormData = { ...updatedData };
    if (calculatePValue && !isEmpty(updatedFormData.startTime.hours) && (updatedFormData.startTime.hours.length <= 2) && !isEmpty(updatedFormData.endTime.hours) && (updatedFormData.endTime.hours.length <= 2)) {
      const startTime = moment(`${updatedFormData.startTime.hours} ${!isEmpty(updatedFormData.startTime.minutes) ? updatedFormData.startTime.minutes : 0} ${updatedFormData.startTime.period}`, 'HH:mm A');
      const endTime = moment(`${updatedFormData.endTime.hours} ${!isEmpty(updatedFormData.endTime.minutes) ? updatedFormData.endTime.minutes : 0} ${updatedFormData.endTime.period}`, 'HH:mm A');
      if (startTime.isValid() && endTime.isValid()) {
        let duration = moment.duration(endTime.diff(startTime)).asMinutes();
        if (duration < 0) { duration = Math.abs(1440 + duration); }
        updatedFormData.pValue.hours = Math.floor(duration / 60).toString();
        updatedFormData.pValue.minutes = (duration % 60).toString();
        duration = Math.round(duration / 2);
        updatedFormData.hValue.hours = Math.floor(duration / 60).toString();
        updatedFormData.hValue.minutes = (duration % 60).toString();
      }
    }
    setState((prev) => ({
      ...prev,
      formData: updatedFormData,
    }));
  };

  const handleEnableSubmit = (updatedFormData) => {
    let updatedEnableSubmit = true;
    Object.keys(updatedFormData).forEach((field) => {
      if (requireFields.includes(field)) {
        if (typeof updatedFormData[field] === 'object') {
          if (isEmpty(updatedFormData[field].hours)) {
            updatedEnableSubmit = false;
          }
        } else if (isEmpty(updatedFormData[field])) {
          updatedEnableSubmit = false;
        }
      }
    });
    return updatedEnableSubmit;
  };

  const handleInputChange = (value, inputField, section) => {
    let updatedCalculatePvalue = calculatePValue;
    const updatedFormData = { ...formData };
    if (!isEmpty(section)) {
      updatedFormData[section][inputField] = value;
      if (section === 'hValue' || section === 'pValue') {
        updatedCalculatePvalue = false;
      }
    } else {
      updatedFormData[inputField] = value;
    }
    const updatedEnableSubmit = handleEnableSubmit(updatedFormData);

    setState({
      ...state,
      formData: updatedFormData,
      isEdited: true,
      enableSubmit: updatedEnableSubmit,
      triggeredSection: section,
      calculatePValue: updatedCalculatePvalue,
    });
    if (section === 'startTime' || section === 'endTime') {
      calculatedFormValues(updatedFormData);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const updatedFormData = cloneDeep(formData);
    const inputCheck = ['hours', 'minutes'];

    Object.keys(updatedFormData).forEach((field) => {
      if (field === 'pValue' || field === 'hValue') {
        if (isEmpty(updatedFormData[field].hours) && isEmpty(updatedFormData[field].minutes)) {
          updatedFormData[field] = null;
        }
      }
      if (typeof updatedFormData[field] === 'object' && updatedFormData[field] !== null) {
        Object.keys(updatedFormData[field]).forEach((key) => {
          if (inputCheck.includes(key)) {
            if (!isEmpty(updatedFormData[field][key])) updatedFormData[field][key] = parseInt(updatedFormData[field][key], 10);
            else updatedFormData[field][key] = 0;
          }
        });
      }
    });
    if (location.pathname.includes('/add')) {
      const siteIdArr = [siteId];
      updatedFormData.siteIds = siteIdArr;
      const dest = `/customer-mgmt/org/${orgId}/site/${siteId}/shift`;
      dispatch(postShiftDetails(orgId, null, updatedFormData, { history, dest }));
    } else {
      dispatch(putShiftDetailsById(orgId, siteId, shiftId, updatedFormData));
      setState((prev) => ({
        ...prev,
        showNotification: true,
      }));
    }
    setState((prev) => ({
      ...prev,
      isEdited: false,
    }));
  };

  const handleCancel = () => {
    handlePropsToState();
  };

  const handleRemove = (e) => {
    if (e) e.preventDefault();
    const dest = `/customer-mgmt/org/${orgId}/site/${siteId}/shift`;
    dispatch(deleteShiftDetailsById(orgId, siteId, shiftId, { history, dest }));
    toggleRemoveShift();
    setState((prev) => ({
      ...prev,
      isEdited: false,
    }));
  };

  const handleCancelPopUp = () => {
    if (!isEdited) {
      handleCancel();
    } else {
      setState({
        ...state,
        showCancelPopup: !showCancelPopup,
      });
    }
  };

  const mandatoryFieldsFilled = handleEnableSubmit(formData);

  return (
    <>
      <Prompt
        when={postShiftState === 'ERROR' || deleteShiftState === 'ERROR' || isEdited}
      />
      <div className={cx(styles.alignCenter, scrollStyle.scrollbar)}>
        <div className={styles.fixedTopHeader}>
          <ArrowLink
            label="back"
            url={`/customer-mgmt/org/${orgId}/site/${siteId}/shift`}
          />
          <div className={styles.fixedHeader}>
            <div className={cx(styles.formHeader, 'row mx-0')} style={{ height: '3.5rem' }}>
              <div className={cx(styles.timeHeading, 'col-8 mx-0 px-0')}>
                { (postShiftState === 'ERROR' || putShiftState === 'ERROR') && showNotification
                && (
                <Notification
                  type="warning"
                  message={error}
                />
                )}
                { ((putShiftState === 'SUCCESS' && showNotification))
                  ? (
                    <Notification
                      type="success"
                      message="shift updated successfully"
                    />
                  )
                  : !mandatoryFieldsFilled
                  && (
                  <Notification
                    type="basic"
                    message="please fill all the mandatory fields to enable save"
                  />
                  )}
              </div>

              <div className="ml-auto d-flex my-auto">
                <div className={cx('row no-gutters justify-content-end')}>
                  { !(putShiftState === 'LOADING' || postShiftState === 'LOADING')
                  && (
                  <>
                    <CancelButton isDisabled={!isEdited} clickHandler={handleCancelPopUp} className={isEdited ? styles.cancelButtonActive : styles.cancelButtonDisable}>cancel</CancelButton>
                    {showCancelPopup
                    && (
                    <WarningPopUp
                      text="cancel?"
                      para="WARNING: it can not be undone"
                      confirmText="yes, cancel"
                      cancelText="no keep"
                      icon={warn}
                      warningPopUp={handleCancel}
                      closePopup={handleCancelPopUp}
                    />
                    )}
                  </>
                  )}
                  { (putShiftState === 'LOADING' || postShiftState === 'LOADING') ? <Spinnerload type="loading" />
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
        <div className={showRemoveShiftPopup ? cx(styles.container, styles.containerExtraPaddingBotton) : cx(styles.container)}>
          <div className="d-flex flex-column">
            { (location.pathname.includes('/add'))
              ? (
                <span className={cx(styles.sectionHeading)} style={{ paddingBottom: '2rem' }}>configure new shift</span>
              )
              : (
                <span className={cx(styles.sectionHeading)} style={{ paddingBottom: '2rem' }}>edit shift details</span>
              )}
            <form>
              <CreateShiftInput
                formData={formData}
                handleInputChange={handleInputChange}
                errors={errors}
                handleError={handleError}
                validation={validation}
                message={message}
                triggeredSection={triggeredSection}
              />
            </form>
            {/* <hr className={styles.horizontalLine} style={{ marginTop: '1.5rem' }} /> */}
            {showRemoveShiftPopup
                    && (
                    <div className={styles.removeContainer}>
                      <div className="d-flex flex-row justify-content-between">
                        <span className={styles.removeContainerText} style={{ paddingTop: '8px' }}>are you sure you want to delete the shift?</span>
                        <div className="row mr-0">
                          <Button
                            type="noButton"
                            label="no"
                            clickHandler={(e) => toggleRemoveShift(e)}
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

            <div className="d-flex flex-row justify-content-between mt-4">
              <div className="d-flex flex-row position-relative">
                { (!location.pathname.includes('/add'))
                    && (
                    <>
                      <CheckBox
                        type="medium"
                        name="removeShift"
                        value={get(state, 'removeShift', false)}
                        onChange={(e) => toggleRemoveShift(e)}
                        checkMarkStyle={styles.checkMarkStyle}
                      />
                      <div className="ml-4">
                        <span className={styles.checkBoxText}>delete shift </span>
                      </div>
                    </>
                    )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateShiftForm;
