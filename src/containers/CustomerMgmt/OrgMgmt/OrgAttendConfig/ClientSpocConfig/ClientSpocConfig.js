import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Button } from 'react-crux';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import cx from 'classnames';
import styles from './ClientSpocConfig.module.scss';

import basicDetails from '../../../../../assets/icons/bgvConfMap.svg';

import SpocCard from './SpocCard/SpocCard';
import ArrowLink from '../../../../../components/Atom/ArrowLink/ArrowLink';
import CardHeader from '../../../../../components/Atom/PageTitle/PageTitle';
import Loader from '../../../../../components/Organism/Loader/SpocLoader/SpocLoader';
import Spinnerload from '../../../../../components/Atom/Spinner/Spinner';
import Notification from '../../../../../components/Molecule/Notification/Notification';
import Prompt from '../../../../../components/Organism/Prompt/Prompt';
import CancelButton from '../../../../../components/Molecule/CancelButton/CancelButton';
import WarningPopUp from '../../../../../components/Molecule/WarningPopUp/WarningPopUp';
import warn from '../../../../../assets/icons/warning.svg';

import * as actions from './Store/action';
import * as actionTypes from './Store/actionTypes';
import * as actionsOrgMgmt from '../../OrgMgmtStore/action';
import HasAccess from '../../../../../services/HasAccess/HasAccess';
import VendorDropdown from '../../../../VendorSearch/VendorDropdown/VendorDropdown';

let hasCreateAccess = false;

class ClientSpocConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enableSave: false,
      orgId: null,
      checkAccess: true,
      showNotification: true,
      showCancelPopUp: false,
    };
  }

  componentDidMount = () => {
    const {
      match, onGetContactsListById, onGetSelectedSpocs, onGetOrgData, orgData,
    } = this.props;
    const orgId = match.params.uuid;
    if (orgId) {
      this.setState({ orgId });
      const query = { ...this.handleGetQueryParams() };
      onGetContactsListById(query.vendorId ? query.vendorId : orgId);
      onGetSelectedSpocs(orgId, query);
    }
    if (isEmpty(orgData) && orgId) {
      onGetOrgData(orgId);
    }
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (prevProps.location.search !== location.search) {
      this.handleCancel();
    }
  }

  componentWillUnmount() {
    const { initState } = this.props;
    initState();
  }

  radioChangeHandler = (Uid) => {
    const { postedSpocs, onUpdatePostedSpocs } = this.props;
    let updatedSpocs = postedSpocs;
    if (postedSpocs.includes(Uid)) {
      updatedSpocs = postedSpocs.filter((spoc) => {
        if (spoc !== Uid) return spoc;
        return null;
      });
    } else {
      updatedSpocs = [].concat(postedSpocs, Uid);
    }
    onUpdatePostedSpocs(updatedSpocs);
    this.setState({ enableSave: true });
  }

  handleSave = () => {
    const { postedSpocs, onPostSelectedSpocs } = this.props;
    const { orgId } = this.state;
    const payloadData = {
      clientSpocs: postedSpocs,
    };
    const query = { ...this.handleGetQueryParams() };
    onPostSelectedSpocs(payloadData, orgId, query);
    this.setState({ enableSave: false, showNotification: true });
  }

  errorClickedHandler = () => {
    const { onResetError } = this.props;
    onResetError();
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
      match, onGetContactsListById, onGetSelectedSpocs,
    } = this.props;
    const orgId = match.params.uuid;
    const query = { ...this.handleGetQueryParams() };
    onGetContactsListById(query.vendorId ? query.vendorId : orgId);
    onGetSelectedSpocs(orgId, query);
    this.setState({
      enableSave: false,
      showCancelPopUp: false,
    });
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

  render() {
    const {
      match, orgContacts, postedSpocs, getContactList, getPostedSpocs, orgData, t,
      postSelectedSpocsState, error,
    } = this.props;
    const {
      checkAccess, enableSave, showNotification, showCancelPopUp,
    } = this.state;

    const orgId = match.params.uuid;
    const showVendorDropDown = this.handleShowVendorDropDown();

    const spocCards = orgContacts.map((contact) => {
      if ((postedSpocs.length === 0)
        || (postedSpocs.length !== 0 && !postedSpocs.includes(contact.uuid))) {
        return (
          <SpocCard
            key={contact.uuid ? contact.uuid : null}
            name={contact.fullName ? contact.fullName : null}
            designation={contact.designation ? contact.designation : null}
            phoneNumber={contact.phoneNumber ? contact.phoneNumber : null}
            emailId={contact.emailAddress ? contact.emailAddress : null}
            id={contact.uuid ? contact.uuid : null}
            isChecked={false}
            changed={() => this.radioChangeHandler(contact.uuid)}
            isDisabled={!hasCreateAccess}
          />
        );
      }
      return null;
    });
    let selectedSpocCards = orgContacts.map((contact) => {
      if (postedSpocs.length !== 0 && postedSpocs.includes(contact.uuid)) {
        return (
          <SpocCard
            key={contact.uuid ? contact.uuid : null}
            name={contact.fullName ? contact.fullName : null}
            designation={contact.designation ? contact.designation : null}
            phoneNumber={contact.phoneNumber ? contact.phoneNumber : null}
            emailId={contact.emailAddress ? contact.emailAddress : null}
            id={contact.uuid ? contact.uuid : null}
            isChecked
            changed={() => this.radioChangeHandler(contact.uuid)}
            isDisabled={!hasCreateAccess}
          />
        );
      } return null;
    });

    selectedSpocCards = selectedSpocCards.filter((spoc) => !isEmpty(spoc));
    return (
      <>
        <Prompt
          when={postSelectedSpocsState === 'ERROR' || enableSave}
        />
        {checkAccess
          ? (
            <HasAccess
              permission={['CLIENT_SPOC_CONFIG:CREATE']}
              orgId={orgId}
              yes={() => this.handleSetCreateAccess()}
            />
          )
          : null}

        <div className={styles.alignCenter}>

          {getContactList === 'LOADING' || getPostedSpocs === 'LOADING'
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
                      label={get(orgData, 'name', '').toLowerCase()}
                      url={`/customer-mgmt/org/${orgId}/profile`}
                    />
                    {showVendorDropDown
                    && (
                    <div className="ml-auto mt-2">
                      <VendorDropdown showIcon />
                    </div>
                    )}
                  </div>
                  <CardHeader label={t('translation_orgClientSpoc:cardHeader')} iconSrc={basicDetails} />
                  {
                    hasCreateAccess
                      ? (
                        <div className={styles.formHeader} style={{ height: '3.5rem' }}>
                          <div className={cx(styles.formHeaderContent, 'row mx-0')}>
                            <div className={styles.timeHeading}>
                              {postSelectedSpocsState === 'SUCCESS'
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
                                postSelectedSpocsState === 'ERROR'
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
                                {postSelectedSpocsState === 'LOADING' ? <Spinnerload type="loading" />
                                  : (
                                    <Button
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
                    <span className={cx(styles.TextSelect)}>{t('translation_orgClientSpoc:span.s1')}</span>
                    <div className="row no-gutters mt-4 d-flex justify-content-between">{spocCards}</div>
                  </div>
                  <div>
                    <HasAccess
                      permission={['ORG_CONTACT:CREATE']}
                      orgId={orgId}
                      yes={() => (
                        <div className={styles.subHeading}>
                          <i>{t('translation_orgClientSpoc:span.s3')}</i>
                          <NavLink to={`/customer-mgmt/org/${orgId}/contact`} className={styles.NavLink}><i className={styles.activeText}>{t('translation_orgClientSpoc:span.s5')}</i></NavLink>
                        </div>
                      )}
                    />
                    <hr className={styles.HorizontalLine} />
                    <span className={cx(styles.TextSelect)}>{t('translation_orgClientSpoc:span.s2')}</span>

                    {selectedSpocCards.length === 0
                      ? <div className={cx('row d-flex no-gutters justify-content-between mt-4', styles.subHeading)}><i>{t('translation_orgClientSpoc:span.s4')}</i></div>
                      : <div className={cx('row d-flex no-gutters justify-content-between mt-4')}>{selectedSpocCards}</div>}
                  </div>
                </div>
              </>
            )}
        </div>

      </>
    );
  }
}

const mapStateToProps = (state) => ({
  orgContacts: state.orgMgmt.orgAttendConfig.clientSpoc.orgContacts,
  getContactList: state.orgMgmt.orgAttendConfig.clientSpoc.getContactList,
  getPostedSpocs: state.orgMgmt.orgAttendConfig.clientSpoc.getPostedSpocs,
  postedSpocs: state.orgMgmt.orgAttendConfig.clientSpoc.postedContacts,
  error: state.orgMgmt.orgAttendConfig.clientSpoc.error,
  postSelectedSpocsState: state.orgMgmt.orgAttendConfig.clientSpoc.postSelectedSpocs,
  orgData: state.orgMgmt.staticData.orgData,
  enabledServices: state.orgMgmt.staticData.servicesEnabled,
});

const mapDispatchToProps = (dispatch) => ({
  initState: () => dispatch(actions.getInitState()),
  onGetContactsListById: (orgId) => dispatch(actions.getContactsListById(orgId)),
  onPostSelectedSpocs:
    (selectedUids, orgId, query) => dispatch(actions.postSelectedSpocs(selectedUids, orgId, query)),
  onGetSelectedSpocs: (orgId, query) => dispatch(actions.getSelectedSpocs(orgId, query)),
  onUpdatePostedSpocs: (updatedSpocs) => dispatch(actions.updatePostedSpocs(updatedSpocs)),
  onResetError: () => dispatch({ type: actionTypes.RESET_ERROR }),
  onGetOrgData: (orgId) => dispatch(actionsOrgMgmt.getDataById(orgId)),
});
export default
withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(ClientSpocConfig)));
