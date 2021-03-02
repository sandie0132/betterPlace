/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable max-len */
import React, { Component } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import toString from 'lodash/toString';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import { connect } from 'react-redux';
import { Button, Input } from 'react-crux';
import { withRouter } from 'react-router';
import cx from 'classnames';
import Notification from '../../../../../components/Molecule/Notification/Notification';
import Loader from '../../../../../components/Organism/Loader/Loader';
import Spinnerload from '../../../../../components/Atom/Spinner/Spinner';
import styles from './OrgLevelConfig.module.scss';
import scrollStyle from '../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import Prompt from '../../../../../components/Organism/Prompt/Prompt';
import ArrowLink from '../../../../../components/Atom/ArrowLink/ArrowLink';
import DropDownSmall from '../../../../../components/Atom/SmallDropDown/SmallDropDown';
import CardHeader from '../../../../../components/Atom/PageTitle/PageTitle';
import container from '../../../../../assets/icons/attendenceContainer.svg';
import question from '../../../../../assets/icons/question.svg';
import { OrgLevelConfigOptions } from './OrgLevelConfigFormConfig';
import { InitData } from './OrgLevelConfigInitData';
import { validation, message } from './OrgLevelConfigValidation';
import * as actions from './Store/action';
import CancelButton from '../../../../../components/Molecule/CancelButton/CancelButton';
import WarningPopUp from '../../../../../components/Molecule/WarningPopUp/WarningPopUp';
import HasAccess from '../../../../../services/HasAccess/HasAccess';
import warn from '../../../../../assets/icons/warning.svg';
import fullDay from '../../../../../assets/icons/fullDay.svg';
import halfDay from '../../../../../assets/icons/halfDay.svg';
import overtime from '../../../../../assets/icons/sandclock.svg';
import tolerance from '../../../../../assets/icons/watch.svg';
import editLog from '../../../../../assets/icons/editLog.svg';
import logOut from '../../../../../assets/icons/logout.svg';
import liveliness from '../../../../../assets/icons/livelinessIcon.svg';
import yellowWarn from '../../../../../assets/icons/yellowWarnRound.svg';
import HistoryPill from './HistoryPill';
import historyIcon from '../../../../../assets/icons/to-do-list.svg';
import VendorDropdown from '../../../../VendorSearch/VendorDropdown/VendorDropdown';

const historyApiKeyPair = [
  { key: 'pValue', label: 'p value', value: [{ key: 'hours', label: 'hr' }, { key: 'minutes', label: 'min' }] },
  { key: 'hValue', label: 'h value', value: [{ key: 'hours', label: 'hr' }, { key: 'minutes', label: 'min' }] },
  { key: 'maxOverTimePerMonth', label: 'max overtime', value: [{ key: 'hours', label: 'hr' }, { key: 'minutes', label: 'min' }] },
  { key: 'timeTolerance', label: 'time tolerance', value: [{ key: 'minutes', label: 'min' }] },
  { key: 'daysToEditLogHistory', label: 'max days allowd to edit history', value: null },
  {
    key: 'isForcedLogoutEnabled', label: 'forced logout', value: null, options: { true: 'yes', false: 'no' },
  },
  {
    key: 'isLivelinessCheckEnabled', label: 'liveliness check', value: null, options: { true: 'yes', false: 'no' },
  },
];

class OrgLevelConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: cloneDeep(InitData),
      isEdited: false,
      enableSubmit: false,
      errors: {},
      historyEditedById: null,
      showSuccessNotification: false,
      triggeredSection: null,
    };
  }

  handleGetQueryParams = () => {
    const { location } = this.props;
    const urlSearchParams = new URLSearchParams(location.search);
    if (urlSearchParams.get('vendorId')) {
      return { vendorId: urlSearchParams.get('vendorId') };
    }
    if (urlSearchParams.get('clientId')) {
      return { clientId: urlSearchParams.get('clientId') };
    }
    return {};
  }

  componentDidMount = () => {
    const { match, onGetOrgAttendanceConfig, getOrgLevelConfigHistory } = this.props;
    const orgId = match.params.uuid;
    const query = { ...this.handleGetQueryParams() };
    onGetOrgAttendanceConfig(orgId, query);
    getOrgLevelConfigHistory(orgId, query);
  }

  componentDidUpdate = (prevProps) => {
    const {
      getOrgAtttendanceCfgState, location, match, onGetOrgAttendanceConfig,
      getOrgLevelConfigHistory,
    } = this.props;
    if (getOrgAtttendanceCfgState !== prevProps.getOrgAtttendanceCfgState && getOrgAtttendanceCfgState === 'SUCCESS') {
      this.handlePropstoState();
    }
    if (prevProps.location.search !== location.search) {
      const orgId = match.params.uuid;
      const query = { ...this.handleGetQueryParams() };
      onGetOrgAttendanceConfig(orgId, query);
      getOrgLevelConfigHistory(orgId, query);
    }
  }

  handleError = (error, inputField) => {
    const { errors } = this.state;
    const currentErrors = cloneDeep(errors);
    const updatedErrors = cloneDeep(currentErrors);
    if (!isEmpty(error)) {
      updatedErrors[inputField] = error;
    } else {
      delete updatedErrors[inputField];
    }
    if (!isEqual(updatedErrors, currentErrors)) {
      this.setState({
        errors: updatedErrors,
      });
    }
  };

  handleEnableSubmit = (formData) => {
    let enableSubmit = false;
    if (!isEmpty(formData)) {
      if ((!isEmpty(formData.pValue.hours) && parseInt(formData.pValue.hours, 10) !== 0) || (!isEmpty(formData.pValue.minutes) && parseInt(formData.pValue.minutes, 10) !== 0)) {
        enableSubmit = true;
      }
    }
    return enableSubmit;
  }

  handleInputChange = (value, inputField, section) => {
    const { formData } = this.state;
    const updatedFormData = cloneDeep(formData);
    if (!isEmpty(section)) {
      updatedFormData[section][inputField] = value;
    } else {
      updatedFormData[inputField] = value;
    }

    const enableSubmit = this.handleEnableSubmit(updatedFormData);

    this.setState({
      formData: updatedFormData,
      isEdited: true,
      enableSubmit,
      showSuccessNotification: true,
      triggeredSection: section,
    });
  }

  handlePropstoState = () => {
    const { orgAttendanceCfg } = this.props;
    let updatedFormData = cloneDeep(orgAttendanceCfg);
    let enableSubmit = true;

    if (!isEmpty(updatedFormData)) {
      updatedFormData.pValue.hours = !Number.isNaN(updatedFormData.pValue.hours) ? toString(updatedFormData.pValue.hours) : null;
      updatedFormData.pValue.minutes = !Number.isNaN(updatedFormData.pValue.minutes) ? toString(updatedFormData.pValue.minutes) : null;

      updatedFormData.hValue.hours = !Number.isNaN(updatedFormData.hValue.hours) ? toString(updatedFormData.hValue.hours) : null;
      updatedFormData.hValue.minutes = !Number.isNaN(updatedFormData.hValue.minutes) ? toString(updatedFormData.hValue.minutes) : null;

      updatedFormData.maxOverTimePerMonth.hours = !Number.isNaN(updatedFormData.maxOverTimePerMonth.hours) ? toString(updatedFormData.maxOverTimePerMonth.hours) : null;
      updatedFormData.maxOverTimePerMonth.minutes = !Number.isNaN(updatedFormData.maxOverTimePerMonth.minutes) ? toString(updatedFormData.maxOverTimePerMonth.minutes) : null;

      updatedFormData.timeTolerance.minutes = !Number.isNaN(updatedFormData.timeTolerance.minutes) ? toString(updatedFormData.timeTolerance.minutes) : null;

      updatedFormData.daysToEditLogHistory = !Number.isNaN(updatedFormData.daysToEditLogHistory) ? toString(updatedFormData.daysToEditLogHistory) : null;

      enableSubmit = false;
    } else {
      updatedFormData = cloneDeep(InitData);
    }

    this.setState({
      formData: updatedFormData,
      enableSubmit,
      isEdited: false,
      showCancelPopUp: false,
    });
  }

  handleSubmit = () => {
    const { match, onPostOrgAttendanceConfig } = this.props;
    const orgId = match.params.uuid;
    const { formData } = this.state;
    const updatedFormData = cloneDeep(formData);

    updatedFormData.pValue.hours = !isEmpty(updatedFormData.pValue.hours) ? parseInt(updatedFormData.pValue.hours, 10) : 0;
    updatedFormData.pValue.minutes = !isEmpty(updatedFormData.pValue.minutes) ? parseInt(updatedFormData.pValue.minutes, 10) : 0;

    updatedFormData.hValue.hours = !isEmpty(updatedFormData.hValue.hours) ? parseInt(updatedFormData.hValue.hours, 10) : 0;
    updatedFormData.hValue.minutes = !isEmpty(updatedFormData.hValue.minutes) ? parseInt(updatedFormData.hValue.minutes, 10) : 0;

    updatedFormData.maxOverTimePerMonth.hours = !isEmpty(updatedFormData.maxOverTimePerMonth.hours) ? parseInt(updatedFormData.maxOverTimePerMonth.hours, 10) : 0;
    updatedFormData.maxOverTimePerMonth.minutes = !isEmpty(updatedFormData.maxOverTimePerMonth.minutes) ? parseInt(updatedFormData.maxOverTimePerMonth.minutes, 10) : 0;

    updatedFormData.timeTolerance.minutes = !isEmpty(updatedFormData.timeTolerance.minutes) ? parseInt(updatedFormData.timeTolerance.minutes, 10) : 0;

    updatedFormData.daysToEditLogHistory = !isEmpty(updatedFormData.daysToEditLogHistory) ? parseInt(updatedFormData.daysToEditLogHistory, 10) : 0;
    this.setState({
      enableSubmit: false,
      isEdited: false,
      errors: {},
    });
    const query = { ...this.handleGetQueryParams() };
    onPostOrgAttendanceConfig(orgId, updatedFormData, query);
  }

  handleCancel = () => {
    this.handlePropstoState();
    this.setState({ errors: {} });
  }

  handleCancelPopUp = () => {
    const { isEdited, showCancelPopUp } = this.state;
    if (!isEdited) {
      this.handleCancel();
    } else {
      this.setState({
        showCancelPopUp: !showCancelPopUp,
      });
    }
  }

  onTooltipShow = (id) => {
    const { getEditedUser } = this.props;
    getEditedUser(id);
    this.setState({
      historyEditedById: id,
    });
  }

  disableNotification = () => {
    setTimeout(() => {
      this.setState({
        showSuccessNotification: false,
      });
    }, 5000);
  }

  handleShowVendorDropDown = () => {
    let showVendorDropDown = false;
    const { enabledServices } = this.props;
    if (!isEmpty(enabledServices) && !isEmpty(enabledServices.platformServices)) {
      forEach(enabledServices.platformServices, (service) => {
        if (service.platformService === 'VENDOR') showVendorDropDown = true;
      });
    }
    return showVendorDropDown;
  }

  render() {
    const {
      match,
      error,
      getOrgAtttendanceCfgState,
      postOrgAtttendanceCfgState,
      attendanceConfigHistory,
      orgLevelConfig,
      location,
    } = this.props;

    const urlSearchParams = new URLSearchParams(location.search);
    const viewOnly = !!urlSearchParams.get('vendorId');

    const orgId = match.params.uuid;
    const showVendorDropDown = this.handleShowVendorDropDown();

    const {
      formData,
      isEdited,
      enableSubmit,
      errors,
      historyEditedById,
      showSuccessNotification,
      showCancelPopUp,
      triggeredSection,
    } = this.state;

    let mandatoryFieldsFilled = enableSubmit;
    mandatoryFieldsFilled = this.handleEnableSubmit(formData);

    return (
      <div>
        <>
          <Prompt
            when={postOrgAtttendanceCfgState === 'ERROR' || isEdited}
          />
          <div className={styles.alignCenter}>
            {getOrgAtttendanceCfgState === 'LOADING' ? (
              <div className={cx(scrollStyle.scrollbar, 'pt-4')}>
                <Loader type="onboardForm" />
              </div>
            )
              : (
                <>
                  <div className={styles.fixedHeaderTop}>
                    <div className="d-flex">
                      <ArrowLink
                        label={get(this.props, 'orgData.name', '').toLowerCase()}
                        url={`/customer-mgmt/org/${orgId}/profile`}
                      />
                      {showVendorDropDown
                        && (
                          <div className="ml-auto mt-2">
                            <VendorDropdown showIcon />
                          </div>
                        )}
                    </div>
                    <CardHeader label="org level configuration" iconSrc={container} />
                    <div className={styles.fixedHeader}>
                      <div className={cx(styles.formHeader, 'row mx-0')} style={{ height: '3.5rem' }}>
                        <div className={cx(styles.timeHeading, 'col-8 mx-0 px-0')}>
                          {(postOrgAtttendanceCfgState === 'ERROR')
                            ? (
                              <Notification
                                type="warning"
                                message={error}
                              />
                            )
                            : (postOrgAtttendanceCfgState === 'SUCCESS' && showSuccessNotification)
                              ? (
                                <>
                                  <Notification
                                    type="success"
                                    message="org level configuration updated successfully"
                                  />
                                  {this.disableNotification()}
                                </>
                              )
                              : !mandatoryFieldsFilled && getOrgAtttendanceCfgState !== 'LOADING'
                              && (
                                <Notification
                                  type="basic"
                                  message="please fill all the mandatory fields to enable save"
                                />
                              )}

                        </div>

                        <div className="ml-auto d-flex my-auto">
                          {
                          !viewOnly
                          && (
                          <HasAccess
                            permission={['ORG_LEVEL_CONFIG:CREATE']}
                            orgId={orgId}
                            yes={() => (
                              <div className={cx('row no-gutters justify-content-end')}>
                                <CancelButton isDisabled={false} clickHandler={this.handleCancelPopUp} className={styles.cancelButton}>cancel</CancelButton>
                                {showCancelPopUp
                                  && (
                                    <WarningPopUp
                                      text="cancel?"
                                      para="WARNING: it can not be undone"
                                      confirmText="yes, cancel"
                                      cancelText="no keep"
                                      icon={warn}
                                      warningPopUp={this.handleCancel}
                                      closePopup={this.handleCancelPopUp}
                                    />
                                  )}
                                {postOrgAtttendanceCfgState === 'LOADING' ? <Spinnerload type="loading" />
                                  : (
                                    <Button
                                      label="save"
                                      type="save"
                                      isDisabled={!(enableSubmit && isEmpty(errors))}
                                      clickHandler={this.handleSubmit}
                                    />
                                  )}
                              </div>
                            )}
                          />
                          )
                          }
                        </div>

                      </div>
                    </div>
                  </div>

                  <div className={cx(styles.cardLayout)}>
                    <div className="d-flex flex-column" style={{ padding: '0.5rem 0rem 2.5rem 2rem' }}>
                      <span className={styles.heading}>attendence</span>
                      <span className={styles.subHeading} style={{ paddingTop: '0.5rem' }}>before starting attendance please configure the given information for a better experience</span>
                      <div className="d-flex flex-row">
                        <div className="flex-grow-1">
                          <div className="d-flex flex-column" style={{ marginTop: '2rem' }}>
                            <div className="d-flex flex-row">
                              <div className={styles.textContainer}>
                                <img className={cx(styles.textIcon)} src={fullDay} alt="icon" />
                                <span className={cx(styles.text, styles.alignSelfCenter)}>
                                  defined timings for full day (p value)
                                  <span className={styles.requiredStar}> *</span>
                                </span>

                                <div>
                                  {' '}
                                  <img className={cx(styles.tooltipIcon)} src={question} alt="tooltip" />
                                </div>
                              </div>
                              <div className="d-flex flex-column">
                                <div className={styles.valueContainer}>
                                  <Input
                                    name="pValue_hours"
                                    className={cx(styles.inputContainer, 'p-2 col-6')}
                                    label=""
                                    type="text"
                                    placeholder=""
                                    required
                                    value={get(formData, 'pValue.hours', '')}
                                    onChange={(value) => this.handleInputChange(value, 'hours', 'pValue')}
                                    validation={validation.pValue}
                                    message={message.pValue}
                                    errors={!isEmpty(errors.pValue) && { error: '' }}
                                    onError={(err) => this.handleError(err, 'pValue')}
                                    customValidators={[get(this.state, 'formData.pValue', {})]}
                                    disabled={viewOnly}
                                  />
                                  <span className={cx(styles.subHeading, styles.alignSelfCenter)} style={{ marginBottom: '0rem' }}>hr</span>
                                  <Input
                                    name="pValue_minutes"
                                    className={cx(styles.inputContainer, 'p-2 col-6')}
                                    label=""
                                    type="text"
                                    placeholder=""
                                    required
                                    value={get(formData, 'pValue.minutes', '')}
                                    onChange={(value) => this.handleInputChange(value, 'minutes', 'pValue')}
                                    validation={validation.pValue}
                                    message={message.pValue}
                                    errors={!isEmpty(errors.pValue) && { error: '' }}
                                    onError={(err) => this.handleError(err, 'pValue')}
                                    customValidators={[get(this.state, 'formData.pValue', {})]}
                                    disabled={viewOnly}
                                  />
                                  <span className={cx(styles.subHeading, styles.alignSelfCenter)} style={{ marginBottom: '0rem' }}>min</span>
                                </div>
                                <div className="d-flex flex-column ml-2">
                                  {Object.values(get(this.state, 'errors.pValue', {})).map((val) => <span key={val} className={styles.errorMessage}>{val}</span>)}

                                </div>

                              </div>
                            </div>
                            <div />

                            <div className="d-flex flex-row">
                              <div className={styles.textContainer}>
                                <img className={cx(styles.textIcon)} src={halfDay} alt="icon" />
                                <span className={cx(styles.text, styles.alignSelfCenter)}>defined timings for half day (h value) </span>
                                <div>
                                  {' '}
                                  <img className={cx(styles.tooltipIcon)} src={question} alt="tooltip" />
                                </div>
                              </div>
                              <div className="d-flex flex-column">
                                <div className={styles.valueContainer}>
                                  <Input
                                    name="hValue_hours"
                                    className={cx(styles.inputContainer, 'p-2 col-6')}
                                    label=""
                                    type="text"
                                    placeholder=""
                                    required
                                    value={formData.hValue.hours}
                                    onChange={(value) => this.handleInputChange(value, 'hours', 'hValue')}
                                    triggerValidation={triggeredSection === 'pValue'}
                                    validation={validation.hValue}
                                    message={message.hValue}
                                    errors={!isEmpty(errors.hValue) && { error: '' }}
                                    onError={(err) => this.handleError(err, 'hValue')}
                                    customValidators={[get(this.state, 'formData.pValue', {}), get(this.state, 'formData.hValue', {})]}
                                    disabled={viewOnly}
                                  />
                                  <span className={cx(styles.subHeading, styles.alignSelfCenter)} style={{ marginBottom: '0rem' }}>hr</span>
                                  <Input
                                    name="hValue_minutes"
                                    className={cx(styles.inputContainer, 'p-2 col-6')}
                                    label=""
                                    type="text"
                                    placeholder=""
                                    required
                                    value={formData.hValue.minutes}
                                    onChange={(value) => this.handleInputChange(value, 'minutes', 'hValue')}
                                    validation={validation.hValue}
                                    message={message.hValue}
                                    errors={!isEmpty(errors.hValue) && { error: '' }}
                                    onError={(err) => this.handleError(err, 'hValue')}
                                    customValidators={[get(this.state, 'formData.pValue', {}), get(this.state, 'formData.hValue', {})]}
                                    disabled={viewOnly}
                                  />
                                  <span className={cx(styles.subHeading, styles.alignSelfCenter)} style={{ marginBottom: '0rem' }}>min</span>
                                </div>
                                <div className="d-flex flex-column ml-2">
                                  {Object.values(get(this.state, 'errors.hValue', {})).map((val) => <span key={val} className={styles.errorMessage}>{val}</span>)}

                                </div>
                              </div>
                            </div>

                            <div className="d-flex flex-row">
                              <div className={styles.textContainer}>
                                <img className={cx(styles.textIcon)} src={overtime} alt="icon" />
                                <span className={cx(styles.text, styles.alignSelfCenter)}>maximum overtime per month</span>
                                <div>
                                  {' '}
                                  <img className={cx(styles.tooltipIcon)} src={question} alt="tooltip" />
                                </div>
                              </div>
                              <div className="d-flex flex-column">
                                <div className={styles.valueContainer}>
                                  <Input
                                    name="maxOverTimePerMonth_hours"
                                    className={cx(styles.inputContainer, 'p-2 col-6')}
                                    label=""
                                    type="text"
                                    placeholder=""
                                    required
                                    value={formData.maxOverTimePerMonth.hours}
                                    onChange={(value) => this.handleInputChange(value, 'hours', 'maxOverTimePerMonth')}
                                    validation={validation.maxOvertime}
                                    message={message.maxOvertime}
                                    errors={!isEmpty(errors.maxOverTime) && { error: '' }}
                                    onError={(err) => this.handleError(err, 'maxOverTime')}
                                    customValidators={[get(this.state, 'formData.maxOverTimePerMonth', {})]}
                                    disabled={viewOnly}
                                  />
                                  <span className={cx(styles.subHeading, styles.alignSelfCenter)} style={{ marginBottom: '0rem' }}>hr</span>
                                  <Input
                                    name="maxOverTimePerMonth_minutes"
                                    className={cx(styles.inputContainer, 'p-2 col-6')}
                                    label=""
                                    type="text"
                                    placeholder=""
                                    required
                                    value={formData.maxOverTimePerMonth.minutes}
                                    onChange={(value) => this.handleInputChange(value, 'minutes', 'maxOverTimePerMonth')}
                                    validation={validation.maxOvertime}
                                    message={message.maxOvertime}
                                    errors={!isEmpty(errors.maxOverTime) && { error: '' }}
                                    onError={(err) => this.handleError(err, 'maxOverTime')}
                                    customValidators={[get(this.state, 'formData.maxOverTimePerMonth', {})]}
                                    disabled={viewOnly}
                                  />
                                  <span className={cx(styles.subHeading, styles.alignSelfCenter)} style={{ marginBottom: '0rem' }}>min</span>
                                </div>
                                <div className="d-flex flex-column ml-2">
                                  {Object.values(get(this.state, 'errors.maxOverTime', {})).map((val) => <span key={val} className={styles.errorMessage}>{val}</span>)}

                                </div>
                              </div>
                            </div>

                            <div className="d-flex flex-row">
                              <div className={styles.textContainer}>
                                <img className={cx(styles.textIcon)} src={tolerance} alt="icon" />
                                <span className={cx(styles.text, styles.alignSelfCenter)}>time tolerance value</span>
                                <div>
                                  {' '}
                                  <img className={cx(styles.tooltipIcon)} src={question} alt="tooltip" />
                                </div>
                              </div>
                              <div className="d-flex flex-column">
                                <div className={styles.valueContainer}>
                                  <Input
                                    name="timeTolerance"
                                    className={cx(styles.inputContainer, 'p-2 col-6')}
                                    label=""
                                    type="text"
                                    placeholder=""
                                    required
                                    value={formData.timeTolerance.minutes}
                                    onChange={(value) => this.handleInputChange(value, 'minutes', 'timeTolerance')}
                                    validation={validation.timeTolerance}
                                    message={message.timeTolerance}
                                    errors={!isEmpty(errors.timeTolerance) && { error: '' }}
                                    onError={(err) => this.handleError(err, 'timeTolerance')}
                                    customValidators={[get(this.state, 'formData.pValue', {}), get(this.state, 'formData.timeTolerance', {})]}
                                    disabled={viewOnly}
                                  />
                                  <span className={cx(styles.subHeading, styles.alignSelfCenter)} style={{ marginBottom: '0rem' }}>min</span>
                                </div>
                                <div className="d-flex flex-column ml-2">
                                  {Object.values(get(this.state, 'errors.timeTolerance', {})).map((val) => <span key={val} className={styles.errorMessage}>{val}</span>)}

                                </div>
                              </div>
                            </div>

                            <div className="d-flex flex-row">
                              <div className={styles.textContainer}>
                                <img className={cx(styles.textIcon)} src={editLog} alt="icon" />
                                <span className={cx(styles.text, styles.alignSelfCenter)}>max no. of days allowed to edit log history</span>
                                <div>
                                  {' '}
                                  <img className={cx(styles.tooltipIcon)} src={question} alt="tooltip" />
                                </div>
                              </div>
                              <div className="d-flex flex-column">
                                <div className={styles.valueContainer}>
                                  <Input
                                    name="daysToEditLogHistory"
                                    className={cx(styles.inputContainer, 'p-2 col-6')}
                                    label=""
                                    type="text"
                                    placeholder=""
                                    required
                                    value={formData.daysToEditLogHistory}
                                    onChange={(value) => this.handleInputChange(value, 'daysToEditLogHistory', null)}
                                    validation={validation.daysToEditLogHistory}
                                    message={message.daysToEditLogHistory}
                                    errors={!isEmpty(errors.daysToEditLogHistory) && { error: '' }}
                                    onError={(err) => this.handleError(err, 'daysToEditLogHistory')}
                                    disabled={viewOnly}
                                  />
                                  <span className={cx(styles.subHeading, styles.alignSelfCenter)} style={{ marginBottom: '0rem' }}>days</span>
                                </div>
                                <div className="d-flex flex-column ml-2">
                                  {Object.values(get(this.state, 'errors.daysToEditLogHistory', {})).map((val) => <span key={val} className={styles.errorMessage}>{val}</span>)}
                                </div>
                              </div>
                            </div>
                            <div className="d-flex flex-row" style={{ height: '4rem' }}>
                              <div className={styles.textContainer}>
                                <img className={cx(styles.textIcon)} src={logOut} alt="icon" />
                                <span className={cx(styles.text, styles.alignSelfCenter)}>do you want to enable forced log out option?</span>
                                <div>
                                  {' '}
                                  <img className={cx(styles.tooltipIcon)} src={question} alt="tooltip" />
                                </div>
                              </div>
                              <div className={cx(styles.valueContainer)} style={{ marginTop: '0.8rem' }}>
                                <DropDownSmall
                                  Options={OrgLevelConfigOptions.booleanOption.options}
                                  className={cx(styles.dropDownStyle, 'ml-2')}
                                  dropdownMenu={styles.dropdownMenu}
                                  value={formData.isForcedLogoutEnabled}
                                  changed={(value) => this.handleInputChange(value, 'isForcedLogoutEnabled', null)}
                                  defaultColor={cx(styles.optionDropdown)}
                                  disabled={viewOnly}
                                />
                              </div>
                            </div>

                            <div className="d-flex flex-row" style={{ height: '4rem' }}>
                              <div className={styles.textContainer}>
                                <img className={cx(styles.textIcon)} src={liveliness} alt="icon" />
                                <span className={cx(styles.text, styles.alignSelfCenter)}>do you want to enable liveliness check conditions</span>
                                <div>
                                  {' '}
                                  <img className={cx(styles.tooltipIcon)} src={question} alt="tooltip" />
                                </div>
                              </div>
                              <div className={cx(styles.valueContainer)} style={{ marginTop: '0.8rem' }}>
                                <DropDownSmall
                                  Options={OrgLevelConfigOptions.booleanOption.options}
                                  className={cx(styles.dropDownStyle, 'ml-2')}
                                  dropdownMenu={styles.dropdownMenu}
                                  value={formData.isLivelinessCheckEnabled}
                                  changed={(value) => this.handleInputChange(value, 'isLivelinessCheckEnabled', null)}
                                  defaultColor={cx(styles.optionDropdown)}
                                  disabled={viewOnly}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        {attendanceConfigHistory.length > 0
                          && (
                            <HistoryPill
                              editedBy={get(orgLevelConfig, `attendanceConfigHistoryEditedBy${historyEditedById}`, { firstName: '---', lastName: '---' })}
                              onTooltipShow={this.onTooltipShow}
                              title="last edited on"
                              footer={{ collapsed: 'show history', expanded: 'hide history' }}
                              icon={historyIcon}
                              historyItems={attendanceConfigHistory}
                              expandedTitle="configuration edit history"
                              keyPair={historyApiKeyPair}
                            />
                          )}
                      </div>
                      <div className="d-flex flex-row position-relative" style={{ marginTop: '3rem' }}>
                        <div style={{ marginTop: '0.5rem' }}>
                          <span className={styles.subHeading}>
                            <img src={yellowWarn} alt="warning" />
                            &nbsp;&nbsp;according to government mandate 1 weekly off is mendatory
                          </span>
                        </div>

                      </div>
                    </div>
                  </div>
                </>
              )}
          </div>
        </>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  orgData: state.orgMgmt.staticData.orgData,
  enabledServices: state.orgMgmt.staticData.servicesEnabled,
  postOrgAtttendanceCfgState: state.orgMgmt.orgAttendConfig.orgLevelConfig.postOrgAttendanceConfigState,
  getOrgAtttendanceCfgState: state.orgMgmt.orgAttendConfig.orgLevelConfig.getOrgAttendanceConfigState,
  orgAttendanceCfg: state.orgMgmt.orgAttendConfig.orgLevelConfig.orgAttendanceConfig,
  attendanceConfigHistory: get(state, 'orgMgmt.orgAttendConfig.orgLevelConfig.attendanceConfigHistory', []),
  error: state.orgMgmt.orgAttendConfig.orgLevelConfig.error,
  orgLevelConfig: state.orgMgmt.orgAttendConfig.orgLevelConfig,
});

const mapDispatchToProps = (dispatch) => ({
  onPostOrgAttendanceConfig: (orgId, config, query) => dispatch(actions.postAttendenceConfig(orgId, config, query)),
  onGetOrgAttendanceConfig: (orgId, query) => dispatch(actions.getOrgLevelConfig(orgId, query)),
  getOrgLevelConfigHistory: (orgId, query) => dispatch(actions.getOrgLevelConfigHistory(orgId, query)),
  getEditedUser: (userId) => dispatch(actions.getEditedUser(userId)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OrgLevelConfig));
