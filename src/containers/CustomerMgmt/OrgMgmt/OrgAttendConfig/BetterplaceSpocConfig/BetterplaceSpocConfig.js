/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Button } from 'react-crux';
import cx from 'classnames';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import forEach from 'lodash/forEach';
import includes from 'lodash/includes';
import { withTranslation } from 'react-i18next';
import * as actions from './Store/action';
import * as actionsOrgMgmt from '../../OrgMgmtStore/action';
import styles from './BetterplaceSpocConfig.module.scss';
import SpocCard from './SpocCard/SpocCard';
import CardHeader from '../../../../../components/Atom/PageTitle/PageTitle';
import bgvConfMap from '../../../../../assets/icons/bgvConfMap.svg';
import plus from '../../../../../assets/icons/search.svg';
import Spinnerload from '../../../../../components/Atom/Spinner/Spinner';
import ArrowLink from '../../../../../components/Atom/ArrowLink/ArrowLink';
import Notification from '../../../../../components/Molecule/Notification/Notification';
import Prompt from '../../../../../components/Organism/Prompt/Prompt';
import HasAccess from '../../../../../services/HasAccess/HasAccess';
import Loader from '../../../../../components/Organism/Loader/SpocLoader/SpocLoader';
import scrollStyle from '../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import CancelButton from '../../../../../components/Molecule/CancelButton/CancelButton';
import WarningPopUp from '../../../../../components/Molecule/WarningPopUp/WarningPopUp';
import warn from '../../../../../assets/icons/warning.svg';
import VendorDropdown from '../../../../VendorSearch/VendorDropdown/VendorDropdown';

const mobileRegex = /^([+][9][1]|[9][1]|[0]){0,1}([ ]{0,1})([0-9]{1})([0-9]{9})$/;
const emailRegex = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;

let hasCreateAccess = false;

class BetterplaceSpocConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enableSave: false,

      inputManagerValue: '',
      selectedManagerList: [],
      managerIdArray: [],
      tagManager: [],

      showNotification: true,
      checkAccess: true,
      betterplaceOrgId: null,
      showCancelPopUp: false,
    };
  }

  componentDidMount = () => {
    const {
      match, initState, onGetSelectedSpocs, orgData, getOrgData, rightnavOrgId,
    } = this.props;
    initState();
    const orgId = match.params.uuid;
    const query = { ...this.handleGetQueryParams() };
    onGetSelectedSpocs(orgId, query); // to get selected spocs, if any
    if (isEmpty(orgData) && orgId) {
      getOrgData(orgId);
    }
    if (orgId !== rightnavOrgId) {
      getOrgData(orgId);
    }
    document.addEventListener('click', this.handleClick, false);
  }

  componentDidUpdate = (prevProps, prevState) => {
    const {
      onSearchEmployee, initState, allSelectedSpocsState, getEmpDetailsById,
      getEmpDetailsState, getSingleEmpDataState, location,
    } = this.props;
    const { inputManagerValue } = this.state;
    if (prevState.inputManagerValue !== inputManagerValue) {
      if (inputManagerValue.length !== 0) {
        onSearchEmployee(inputManagerValue); // search api
      } else {
        initState();
      }
    }

    if (allSelectedSpocsState !== prevProps.allSelectedSpocsState && allSelectedSpocsState === 'SUCCESS') {
      this.handleSelectedSpocs();
      // matching the uuid to contact and updating contact array of uuids
    }

    if (getEmpDetailsById !== prevProps.getEmpDetailsById && getEmpDetailsState === 'SUCCESS') {
      this.handleGetSelectedSpocs(); // update state of selectedcards
    }

    if (getSingleEmpDataState !== prevProps.getSingleEmpDataState && getSingleEmpDataState === 'SUCCESS') {
      this.handleDesignation();
    }

    if (prevProps.location.search !== location.search) {
      this.handleCancel();
    }
  }

  componentWillUnmount() {
    const { initState } = this.props;
    document.removeEventListener('click', this.handleClick, false);
    initState();
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

  handleDesignation = () => {
    const { selectedManagerList } = this.state;
    const { singleEmpData } = this.props;
    const singleEmpDataProps = cloneDeep(singleEmpData);
    const updatedSelectedManagerList = cloneDeep(selectedManagerList);

    if (!isEmpty(singleEmpDataProps) && !isEmpty(singleEmpDataProps.contacts)) {
      forEach(updatedSelectedManagerList, (manager) => {
        if (manager.uuid === singleEmpDataProps.uuid) {
          forEach(singleEmpDataProps.contacts, (contact) => {
            forEach(manager.contacts, (mgContact) => {
              if (contact.uuid === mgContact.uuid) {
                if (mgContact.isPrimary && mgContact.type === 'MOBILE') {
                  mgContact.contact = contact.contact;
                }
                if (mgContact.isPrimary && mgContact.type === 'EMAIL') {
                  mgContact.contact = contact.contact;
                }
              }
            });
          });
        }
      });
    }
    this.setState({
      selectedManagerList: updatedSelectedManagerList,
    });
  }

  handleSelectedSpocs = () => {
    const { allSelectedSpocs, onGetEmployeeById } = this.props;
    const { managerIdArray } = this.state;
    if (!isEmpty(allSelectedSpocs)) {
      const getSelectedManager = cloneDeep(allSelectedSpocs.deploymentManagers);
      const updatedManagerArray = cloneDeep(managerIdArray);

      if (updatedManagerArray !== undefined || updatedManagerArray !== null) {
        getSelectedManager.map((id) => {
          if (!includes(updatedManagerArray, id)) {
            updatedManagerArray.push(id);
          }
          return updatedManagerArray;
        });
      }
      const empArray = updatedManagerArray;

      if (empArray.length > 0) onGetEmployeeById(empArray);
      this.setState({
        managerIdArray: updatedManagerArray,
        betterplaceOrgId: allSelectedSpocs.betterplaceOrgId,
      });
    }
  }

  handleGetSelectedSpocs = () => {
    const { getEmpDetailsById } = this.props;
    const { managerIdArray } = this.state;
    const empDetails = !isEmpty(getEmpDetailsById) ? cloneDeep(getEmpDetailsById) : '';

    const updatedSelectedManagerList = [];

    const updatedManagerArray = cloneDeep(managerIdArray);

    if (!isEmpty(empDetails)) {
      forEach(empDetails, (employee) => {
        if (updatedManagerArray.includes(employee.uuid)) {
          const updatedEmployee = { ...employee, designation: employee.defaultRole };
          updatedSelectedManagerList.push(updatedEmployee);
        }
      });
    }
    this.setState({
      selectedManagerList: updatedSelectedManagerList,
    });
  }

  handleSave = () => {
    const { managerIdArray, betterplaceOrgId } = this.state;
    const { match, onPostSelectedCards } = this.props;
    const orgId = match.params.uuid;

    const payload = {
      deploymentManagers: managerIdArray,
      betterplaceOrgId,
    };
    const query = { ...this.handleGetQueryParams() };
    onPostSelectedCards(payload, orgId, query);
    this.setState({ enableSave: false, showNotification: true });
  }

  handleInputChange = (event, type) => { // value is entered
    const updatedInput = event.target.value;
    if (type === 'manager') {
      this.setState({ inputManagerValue: updatedInput });
    }
  };

  // called when contact selected from dropdown
  handleSelectedValue = (targetUuid, typeOfOps) => {
    const { orgContactList, onGetEmployeeById } = this.props;
    const {
      tagManager, selectedManagerList, managerIdArray,
    } = this.state;

    const orgContactListData = !isEmpty(orgContactList) ? orgContactList : ''; // selected from dropdown option
    const updatedTagManager = cloneDeep(tagManager);

    if (typeOfOps === 'manager') {
      let selectedCards = cloneDeep(selectedManagerList);
      const updatedContactList = cloneDeep(managerIdArray);

      forEach(orgContactListData, (contact) => {
        if (contact.uuid === targetUuid) {
          selectedCards.push(contact);
          updatedContactList.push(contact.uuid);
        }
      });
      // creating additional designation field inside state
      selectedCards = selectedCards.map((manager) => ({
        ...manager,
        designation: '',
      }));

      this.setState({
        inputManagerValue: '',
        enableSave: true,
        selectedManagerList: selectedCards,
        managerIdArray: updatedContactList,
      });

      if (!isEmpty(selectedCards)) {
        forEach(selectedCards, (mg) => {
          if (!isEmpty(mg.defaultRole)) {
            updatedTagManager.push(mg.defaultRole);
          }
        });
      }
      onGetEmployeeById(updatedContactList);
    }
    this.setState({ betterplaceOrgId: orgContactListData[0].orgId, showNotification: true });
  }

  handleCloseSpocCard = (uuid, typeOfOps) => {
    const {
      selectedManagerList, managerIdArray,
    } = this.state;

    if (typeOfOps === 'manager') {
      let selectedContacts = cloneDeep(selectedManagerList);
      let updatedContactList = cloneDeep(managerIdArray);

      if (!isEmpty(selectedContacts)) { // unselect a spoc card
        selectedContacts = selectedContacts.filter((spoc) => {
          if (spoc.uuid === uuid) return null;
          return selectedContacts;
        });
      }

      if (!isEmpty(managerIdArray)) { // removing the same from uuidarray
        updatedContactList = managerIdArray.filter((selectedUuid) => {
          if (selectedUuid === uuid) return null;
          return selectedUuid;
        });
      }
      this.setState({
        selectedManagerList: selectedContacts,
        managerIdArray: updatedContactList,
        enableSave: true,
      });
    }
  }

  handleClick = () => {
    const { initState } = this.props;
    if (this.dropDownDiv) {
      initState();
    }
  }

  handleSetCreateAccess = () => {
    const query = { ...this.handleGetQueryParams() };
    if (query.vendorId) {
      hasCreateAccess = false;
      return false;
    }
    hasCreateAccess = true;
    return true;
  }

  disableNotification = () => {
    setTimeout(() => {
      this.setState({
        showNotification: false,
      });
    }, 5000);
  }

  handleShowCancelPopUp = () => {
    const { showCancelPopUp } = this.state;
    this.setState({
      showCancelPopUp: !showCancelPopUp,
    });
  }

  handleCancel = () => {
    const {
      match, onGetSelectedSpocs, initState,
    } = this.props;
    const orgId = match.params.uuid;
    const query = { ...this.handleGetQueryParams() };
    this.setState({
      enableSave: false,
      showCancelPopUp: false,
      inputManagerValue: '',
      selectedManagerList: [],
      managerIdArray: [],
      tagManager: [],
    }, initState(), onGetSelectedSpocs(orgId, query));
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
      match, t, error, orgContactList, postContactListState,
      orgData, allSelectedSpocsState, getEmpDetailsState,
    } = this.props;

    const {
      selectedManagerList, managerIdArray, checkAccess, inputManagerValue,
      enableSave, showNotification, showCancelPopUp,
    } = this.state;

    const showVendorDropDown = this.handleShowVendorDropDown();
    const newContactList = orgContactList;

    const orgId = match.params.uuid;

    return (
      <>
        <Prompt
          when={postContactListState === 'ERROR' || enableSave}
        />
        {checkAccess
          ? (
            <HasAccess
              permission={['BP_SPOC_CONFIG:CREATE']}
              orgId={orgId}
              yes={() => this.handleSetCreateAccess()}
            />
          )
          : null}
        <div className={styles.alignCenter}>
          {allSelectedSpocsState === 'LOADING' || getEmpDetailsState === 'LOADING'
            ? (
              <div style={{ marginTop: '3.2rem' }}>
                <Loader />
              </div>
            )
            : (
              <>
                <div className={styles.fixedHeader}>
                  <div className="d-flex">
                    <ArrowLink
                      label={isEmpty(orgData) ? ' ' : orgData.name.toLowerCase()}
                      url={`/customer-mgmt/org/${orgId}/profile`}
                    />
                    {showVendorDropDown && (
                    <div className="ml-auto mt-2">
                      <VendorDropdown showIcon />
                    </div>
                    )}
                  </div>

                  <CardHeader label={t('translation_orgBgvBetterplaceSpoc:cardHeader')} iconSrc={bgvConfMap} />
                  {
                    hasCreateAccess
                      ? (
                        <div className={styles.formHeader} style={{ height: '3.5rem' }}>
                          <div className={cx(styles.formHeaderContent, 'row mx-0')}>
                            <div className={styles.timeHeading}>
                              {postContactListState === 'SUCCESS'
                                && showNotification
                                && (
                                  <>
                                    <Notification
                                      type="success"
                                      message="configuration saved successfully"
                                    />
                                    {this.disableNotification()}
                                  </>
                                )}
                              {
                                (postContactListState === 'ERROR' || getEmpDetailsState === 'ERROR')
                                && showNotification
                                && (
                                  <>
                                    <Notification
                                      type="warning"
                                      message={error}
                                    />
                                    {this.disableNotification()}
                                  </>
                                )
                              }
                            </div>
                            <div className="ml-auto d-flex">
                              <div className={cx('row no-gutters justify-content-end')}>
                                <CancelButton
                                  isDisabled={!enableSave}
                                  clickHandler={this.handleShowCancelPopUp}
                                  className={styles.cancelButton}
                                >
                                  cancel
                                </CancelButton>
                                {showCancelPopUp
                                  ? (
                                    <WarningPopUp
                                      text={t('translation_empBasicRegistration:warning_empBasicDetails_cancel.text')}
                                      para={t('translation_empBasicRegistration:warning_empBasicDetails_cancel.para')}
                                      confirmText={t('translation_empBasicRegistration:warning_empBasicDetails_cancel.confirmText')}
                                      cancelText={t('translation_empBasicRegistration:warning_empBasicDetails_cancel.cancelText')}
                                      icon={warn}
                                      warningPopUp={this.handleCancel}
                                      closePopup={this.handleShowCancelPopUp}
                                    />
                                  )
                                  : null}
                                {postContactListState === 'LOADING' || postContactListState === 'LOADING'
                                  ? <Spinnerload type="loading" className="ml-auto " />
                                  : (
                                    <Button
                                      className={cx('float-right px-4', styles.ButtonMargin)}
                                      label="save"
                                      type="medium"
                                      isDisabled={!enableSave}
                                      clickHandler={() => this.handleSave()}
                                    />
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                      : null
                  }
                </div>
                <div className={cx(styles.CardPadding)}>
                  <div>
                    <span className={cx(styles.TextSelect)}>deployment manager</span>
                  </div>

                  <div className={cx('mt-2 col-8', styles.addSpoc)}>
                    <img className="pr-2 mt-0" src={plus} alt={t('translation_orgBgvBetterplaceSpoc:image_alt.plus')} />
                    <input
                      name="manager"
                      className={cx('pl-1 pr-2 ', styles.searchBar)}
                      type="text"
                      value={inputManagerValue}
                      placeholder={t('translation_orgBgvBetterplaceSpoc:add')}
                      onChange={(event) => this.handleInputChange(event, 'manager')}
                      disabled={!hasCreateAccess}
                      autoComplete="off"
                    />
                  </div>

                  {!isEmpty(inputManagerValue)
                    ? (
                      <div className={cx(styles.dropdownMenu, scrollStyle.scrollbar)}>
                        {!isEmpty(newContactList)
                          ? newContactList.map((result) => {
                            if (includes(managerIdArray, result.uuid)) return null;
                            return (
                              <div
                                key={result.uuid}
                                ref={(dropDownDiv) => this.dropDownDiv = dropDownDiv}
                              >
                                <div
                                  className={cx(styles.tagDropDown)}
                                  onClick={() => this.handleSelectedValue(result.uuid, 'manager')}
                                >
                                  {`${result.firstName} ${result.lastName}`}
                                </div>
                              </div>
                            );
                          })
                          : ''}
                      </div>
                    )
                    : ''}

                  <div className="d-flex justify-content-between flex-wrap mt-3">
                    {!isEmpty(selectedManagerList)
                      ? selectedManagerList.map((spoc) => {
                        let primaryMobile; let
                          primaryEmail;
                        if (spoc.contacts) {
                          forEach(spoc.contacts, (contact) => {
                            if (contact.type === 'MOBILE' && contact.isPrimary && mobileRegex.test(contact.contact)) primaryMobile = contact.contact;
                            if (contact.type === 'EMAIL' && contact.isPrimary && emailRegex.test(contact.contact)) primaryEmail = contact.contact;
                          });
                        }
                        return (
                          <SpocCard
                            key={spoc.uuid}
                            name={spoc.firstName ? spoc.firstName + (spoc.lastName ? ` ${spoc.lastName}` : '') : '--'}
                            designation={spoc.designation ? spoc.designation : '--'}
                            phoneNumber={primaryMobile}
                            emailId={primaryEmail}
                            profilePicUrl={spoc.profilePicUrl}
                            empId={spoc.uuid}
                            isChecked
                            changed={() => this.handleCloseSpocCard(spoc.uuid, 'manager')}
                            isDisabled={!hasCreateAccess}
                          />
                        );
                      })
                      : (
                        <div className={styles.subHeading}>
                          <i>search and add spoc for attendance from above</i>
                        </div>
                      )}
                  </div>

                  <hr className={styles.HorizontalLine} />
                </div>
              </>
            )}
        </div>

      </>
    );
  }
}

const mapStateToProps = (state) => ({
  error: state.orgMgmt.orgAttendConfig.bpSpocConfig.error,
  orgContactList: state.orgMgmt.orgAttendConfig.bpSpocConfig.getContactList,
  orgContactListState: state.orgMgmt.orgAttendConfig.bpSpocConfig.getContactListState,
  postContactListState: state.orgMgmt.orgAttendConfig.bpSpocConfig.postSelectedSpocs,
  allSelectedSpocs: state.orgMgmt.orgAttendConfig.bpSpocConfig.postedContacts,
  allSelectedSpocsState: state.orgMgmt.orgAttendConfig.bpSpocConfig.getPostedSpocs,
  getEmpDetailsById: state.orgMgmt.orgAttendConfig.bpSpocConfig.empDetails,
  getEmpDetailsState: state.orgMgmt.orgAttendConfig.bpSpocConfig.empDetailsState,
  getTagDataState: state.orgMgmt.orgAttendConfig.bpSpocConfig.tagDataState,
  getTagData: state.orgMgmt.orgAttendConfig.bpSpocConfig.tagData,
  rightnavOrgId: state.orgMgmt.staticData.rightnavOrgId,
  singleEmpData: state.orgMgmt.orgAttendConfig.bpSpocConfig.singleEmpData,
  getSingleEmpDataState: state.orgMgmt.orgAttendConfig.bpSpocConfig.singleEmpDataState,
  // configuredData: state.orgMgmt.orgAttendConfig.bpSpocConfig.configuredData,
  orgData: state.orgMgmt.staticData.orgData,
  enabledServices: state.orgMgmt.staticData.servicesEnabled,
});

const mapDispatchToProps = (dispatch) => ({
  initState: () => dispatch(actions.getInitState()),
  onSearchEmployee: (input) => dispatch(actions.getContactList(input)),
  onPostSelectedCards:
    (data, orgId, query) => dispatch(actions.postSelectedSpocs(data, orgId, query)),
  onGetSelectedSpocs: (orgId, query) => dispatch(actions.getSelectedSpocs(orgId, query)),
  onGetEmployeeById:
    (id) => dispatch(actions.getEmployeeById(id)),
  getOrgData: (orgId) => dispatch(actionsOrgMgmt.getDataById(orgId)),
});

export default
withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(BetterplaceSpocConfig)));
