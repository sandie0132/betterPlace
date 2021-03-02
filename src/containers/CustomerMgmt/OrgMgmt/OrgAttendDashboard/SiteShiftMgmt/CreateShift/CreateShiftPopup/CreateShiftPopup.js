/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import { Button } from 'react-crux';
import { useRouteMatch, useHistory } from 'react-router';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import moment from 'moment';
import ShiftInputs from '../CreateShiftInput';
import styles from './CreateShiftPopup.module.scss';
import sites from '../../../../../../../assets/icons/sites.svg';
import yellowWarningIcon from '../../../../../../../assets/icons/yellowInfoCircle.svg';
import CancelButton from '../../../../../../../components/Molecule/CancelButton/CancelButton';
import WarningPopUp from '../../../../../../../components/Molecule/WarningPopUp/WarningPopUp';
import Spinnerload from '../../../../../../../components/Atom/Spinner/Spinner';
import warn from '../../../../../../../assets/icons/warning.svg';
import closePage from '../../../../../../../assets/icons/closePageWhite.svg';
import { InitData, requireFields } from '../CreateShiftInitData';
import { validation, message } from '../CreateShiftValidations';
import { postShiftDetails } from '../Store/action';

const initialState = {
  formData: cloneDeep(InitData),
  showCancelPopUp: false,
  isEdited: false,
  enableSubmit: false,
  triggeredSection: null,
  calculatePValue: true,
  dataSubmitted: false,
  errors: {},
};

const CreateShiftPopup = ({
  toggleFunction,
  siteIdList,
  selectAll,
  totalCount,
}) => {
  const [state, setState] = useState(cloneDeep(initialState));
  const match = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();
  const orgId = match.params.uuid;
  const { siteId } = match.params;
  const orgMgmtRState = useSelector((rstate) => get(rstate, 'orgMgmt', {}), shallowEqual);
  const CreateShiftRState = get(orgMgmtRState, 'orgAttendDashboard.siteShiftMgmt.createShift', {});
  const postShiftState = get(CreateShiftRState, 'postShiftDetailsByIdState', 'INIT');

  const {
    formData,
    isEdited,
    enableSubmit,
    showCancelPopUp,
    errors,
    triggeredSection,
    calculatePValue,
    dataSubmitted,
  } = state;

  useEffect(() => {
    if (postShiftState === 'SUCCESS' && dataSubmitted) {
      toggleFunction();
    }
  }, [postShiftState, toggleFunction, dataSubmitted]);

  const handleError = (error, inputField) => {
    const currentErrors = cloneDeep(errors);
    const updatedErrors = cloneDeep(currentErrors);
    if (!isEmpty(error)) {
      updatedErrors[inputField] = error;
    } else {
      delete updatedErrors[inputField];
    }
    if (!isEqual(updatedErrors, currentErrors)) {
      setState({
        ...state,
        errors: updatedErrors,
      });
    }
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

  const handleReset = () => {
    const updatedFormData = cloneDeep(InitData);
    setState({
      ...state,
      formData: updatedFormData,
      isEdited: false,
      enableSubmit: false,
      errors: {},
      triggeredSection: null,
      showCancelPopUp: false,
    });
  };

  const handleCancel = () => {
    handleReset();
  };

  const handleCancelPopUp = () => {
    if (!isEdited) {
      handleCancel();
    } else {
      setState({
        ...state,
        showCancelPopUp: !showCancelPopUp,
      });
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
    let siteIdArr = [];
    if (!selectAll) {
      siteIdArr = [...siteIdList];
    }
    updatedFormData.siteIds = siteIdArr;
    const dest = `/customer-mgmt/org/${orgId}/dashboard/attend/site-shift-mgmt/site/${siteId}`;
    dispatch(postShiftDetails(orgId, null, updatedFormData, { history, dest }, totalCount));
    setState((prev) => ({
      ...prev,
      dataSubmitted: true,
    }));
  };

  return (
    <div className={styles.backDrop}>
      <img src={closePage} alt="close" className={styles.closeIcon} onClick={toggleFunction} aria-hidden />
      <div className={styles.formContainer}>
        <div className="d-flex flex-column">
          <span className={styles.Heading}>create new shift</span>
          <div className="d-flex flex-row" style={{ marginTop: '24px' }}>
            <img src={sites} alt="sites" />
            <span className={cx(styles.SubText, 'ml-2')}>{`${totalCount || '--'} sites selected`}</span>
          </div>
          <div className="d-flex flex-row mt-1" style={{ marginLeft: '-2px' }}>
            <img src={yellowWarningIcon} alt="info" />
            <span className={cx(styles.greySmallText, 'align-self-center')} style={{ marginLeft: '12px' }}>please fill in the details to create new shift in selected site</span>
          </div>
          <hr className="w-100" />

          <ShiftInputs
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
            handleError={handleError}
            validation={validation}
            message={message}
            triggeredSection={triggeredSection}
          />
          <hr className="w-100" />
          <div className="ml-auto d-flex my-auto">
            <div className={cx('row no-gutters justify-content-end')}>
              { postShiftState !== 'LOADING'
              && (
              <>
                <CancelButton isDisabled={!isEdited} clickHandler={handleCancelPopUp} className={isEdited ? styles.cancelButtonActive : styles.cancelButtonDisable}>cancel</CancelButton>
                {showCancelPopUp
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
              { postShiftState === 'LOADING' ? <Spinnerload type="loading" />
                : (
                  <Button
                    label="create"
                    type="save"
                    isDisabled={!(enableSubmit && isEmpty(errors))}
                    clickHandler={handleSubmit}
                  />
                )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export default CreateShiftPopup;
