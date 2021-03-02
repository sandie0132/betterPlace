/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-did-update-set-state */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';

import _ from 'lodash';
import cx from 'classnames';
import styles from './VendorList.module.scss';
import scrollStyle from '../../../../components/Atom/ScrollBar/ScrollBar.module.scss';

import VendorOnboarding from '../VendorOnboarding/VendorOnboarding';
import VendorClientInfoCard from './VendorClientInfoCard/VendorClientInfoCard';

import * as actionsOrgMgmt from '../../OrgMgmt/OrgMgmtStore/action';
import * as actions from './Store/action';

import ArrowLink from '../../../../components/Atom/ArrowLink/ArrowLink';
import Loader from '../../../../components/Organism/Loader/Loader';
import SuccessNotification from '../../../../components/Organism/Notifications/SuccessNotification/SuccessNotification';
import ErrorNotification from '../../../../components/Organism/Notifications/ErrorNotification/ErrorNotification';
import Notifications, { NotificationIcon } from '../../Notifications/Notifications';

import insightIcon from '../../../../assets/icons/active.svg';
import vendor from '../../../../assets/icons/vendor.svg';
import client from '../../../../assets/icons/client.svg';
import dash from '../../../../assets/icons/dash.svg';
import search from '../../../../assets/icons/search.svg';
import close from '../../../../assets/icons/spocClose.svg';
import up from '../../../../assets/icons/up.svg';
import down from '../../../../assets/icons/down.svg';
import vendorOnboard from '../../../../assets/icons/vendorOnboard.svg';

import HasAccess from '../../../../services/HasAccess/HasAccess';

class VendorList extends Component {
  clientName = ''

  constructor(props) {
    super(props);
    this.state = {
      showNotifications: false,
      showErrorNotification: false,
      showSuccessNotification: false,
      orgList: [],
      showAwaitingVendor: true,
      showActiveVendor: true,
      searchParam: '',
      onFocusSearch: false,
    };
  }

  componentDidMount = () => {
    const {
      match, location, history, rightnavOrgId,
      onGetOrgData, onGetVendorClientList, onGetVendorClientCount,
    } = this.props;
    const orgId = match.params.uuid;
    const redirectPath = `/customer-mgmt/org/${orgId}/vendor-mgmt?filter=insights`;

    if (orgId !== rightnavOrgId && rightnavOrgId !== null) {
      onGetOrgData(orgId);
    }
    history.push(redirectPath);

    if (location.search.includes('filter=vendors')) {
      const url = location.search.replace(location.search, '?filter=vendors');
      history.push(url);
      onGetVendorClientList(orgId, 'vendor');
    }
    if (location.search.includes('filter=clients')) {
      const url = location.search.replace(location.search, '?filter=clients');
      history.push(url);
      onGetVendorClientList(orgId, 'client');
    }
    onGetVendorClientCount(orgId);
  }

  componentDidUpdate = (prevProps) => {
    const {
      match, location, getVendorListState, updateVendorApprovalReqState,
      // notificationList,
      vendorListData, onGetVendorClientCount, onGetVendorClientList,
    } = this.props;
    const orgId = match.params.uuid;

    if (prevProps.getVendorListState !== getVendorListState && getVendorListState === 'SUCCESS') {
      this.setState({ orgList: vendorListData });
    }

    if (prevProps.updateVendorApprovalReqState !== updateVendorApprovalReqState && updateVendorApprovalReqState === 'SUCCESS') {
      onGetVendorClientCount(orgId);
      if (location.search === '?filter=clients') {
        onGetVendorClientList(orgId, 'client');
      }

      // if (_.isEmpty(notificationList)) {
      //   this.setState({ showErrorNotification: true });
      //   setTimeout(() => {
      //     this.setState({ showErrorNotification: false });
      //   }, 2000);
      // } else {
      //   this.setState({ showSuccessNotification: true });
      //   setTimeout(() => {
      //     this.setState({ showSuccessNotification: false });
      //   }, 2000);
      // }
    }
  }

  shortenDisplayName = (displayName) => {
    if (displayName.length > 12) {
      const updatedDisplayName = `${displayName.substring(0, 12)}...`;
      return (updatedDisplayName);
    }
    return (displayName);
  }

  handleChangeUrl = (filterType) => {
    let url;
    const {
      match, location, history, onGetVendorClientList,
    } = this.props;
    const orgId = match.params.uuid;
    if (filterType === 'insights') {
      if (!location.search.includes('filter=insights')) {
        url = location.search.replace(location.search, '?filter=insights');
        history.push(url);
      }
    } else if (filterType === 'vendors') {
      if (!location.search.includes('filter=vendors')) {
        url = location.search.replace(location.search, '?filter=vendors');
        history.push(url);
        onGetVendorClientList(orgId, 'vendor');
      }
    } else if (!location.search.includes('filter=clients')) {
      url = location.search.replace(location.search, '?filter=clients');
      history.push(url);
      onGetVendorClientList(orgId, 'client');
    }
    this.setState({ searchParam: '', onFocusSearch: false });
  }

  handleAwaitingVendors = () => {
    const { showAwaitingVendor } = this.state;
    this.setState({
      showAwaitingVendor: !showAwaitingVendor,
    });
  }

  handleActiveVendors = () => {
    const { showActiveVendor } = this.state;
    this.setState({
      showActiveVendor: !showActiveVendor,
    });
  }

  handleInputChange = (event) => {
    const { vendorListData } = this.props;
    let key = event.target.value;
    const orgList = [];
    if (key.length) {
      key = key.toLowerCase();
      _.forEach(vendorListData, (eachVendor) => {
        if ((eachVendor.name.toLowerCase()).includes(key)) {
          orgList.push(eachVendor);
        }
      });
    } else {
      _.forEach(vendorListData, (eachVendor) => {
        orgList.push(eachVendor);
      });
    }
    this.setState({
      orgList,
      searchParam: key,
    });
  }

  handleRedirect = (id, type) => {
    const { match, history } = this.props;
    const orgId = match.params.uuid;
    let redirectPath = '';
    if (type === 'vendors') {
      redirectPath = `/customer-mgmt/org/${orgId}/vendor-mgmt/vendor/${id}/vendorprofile?filter=overall_insights`;
    } else if (type === 'clients') {
      redirectPath = `/customer-mgmt/org/${orgId}/vendor-mgmt/client/${id}/clientprofile?filter=overall_insights`;
    }
    history.push(redirectPath);
  }

  getClientData = (clientData) => {
    const clientName = !_.isEmpty(clientData) && !_.isEmpty(clientData.clientName) ? clientData.clientName : 'client';
    this.clientName = clientName;
  }

  handleClearSearch = () => {
    const { vendorListData } = this.props;
    this.setState({ searchParam: '', orgList: vendorListData });
  }

  onFocus = () => {
    this.setState({ onFocusSearch: true });
  }

  onBlur = () => {
    const { searchParam } = this.state;
    if (searchParam === '') this.setState({ onFocusSearch: false });
  }

  render() {
    const {
      t, match, location, orgData, vendorClientCount, getVendorListState,
      vendorClientCountState, vendorListData, showModal, getDocNumber, getDocType,
      notificationList,
    } = this.props;
    const {
      orgList, showNotifications, onFocusSearch, searchParam, showSuccessNotification,
      showErrorNotification, showAwaitingVendor, showActiveVendor,
    } = this.state;
    const pendingVendorList = [];
    const approvedVendorList = [];
    const orgId = match.params.uuid;
    const category = location.search.split('=').pop();
    const query = {
      name: ['VENDOR_CLIENT_REQUEST_APPROVAL'],
      platformService: 'VENDOR',
    };
    _.forEach(orgList, (eachVendor) => {
      if (eachVendor.status === 'pendingapproval') pendingVendorList.push(eachVendor);
      else approvedVendorList.push(eachVendor);
    });

    return (
      <>
        <div className={cx(styles.alignCenter, scrollStyle.scrollbar)}>
          {!_.isEmpty(orgData)
            ? (
              <div style={{ width: 'max-content' }}>
                <ArrowLink
                  label={`${orgData.name.toLowerCase()}/vendors`}
                  url={`/customer-mgmt/org/${orgData.uuid}/profile`}
                />
              </div>
            )
            : (
              <div style={{ width: 'max-content' }}>
                <ArrowLink
                  label="vendors"
                  url={`/customer-mgmt/org/${orgId}/profile`}
                />
              </div>
            )}
          {getVendorListState === 'LOADING' || vendorClientCountState === 'LOADING'
            ? <Loader type="tabLoader" />
            : (
              <>
                <div className="row-fluid pt-3">
                  <div style={{ width: '100%' }}>
                    <ul>
                      <li
                        className={location.search === '?filter=insights' ? cx('pl-0 mr-5', styles.ActiveTabLink) : cx('pl-0 mr-5', styles.InactiveTabLink)}
                        onClick={() => this.handleChangeUrl('insights')}
                        aria-hidden="true"
                      >
                        <img src={insightIcon} alt="insights" className={location.search === '?filter=insights' ? cx(styles.ActiveTabLinkImage, 'pr-2') : cx('pr-2')} />
                        <span>
                          {' '}
                          {t('translation_vendorList:insights')}
                          {' '}
                        </span>
                      </li>

                      <HasAccess
                        permission={['VENDOR:VIEW']}
                        orgId={orgId}
                        yes={() => (
                          <li
                            className={location.search === '?filter=vendors' ? cx('pl-0 mr-5', styles.ActiveTabLink) : cx('pl-0 mr-5', styles.InactiveTabLink)}
                            onClick={() => this.handleChangeUrl('vendors')}
                            aria-hidden="true"
                          >
                            <img src={vendor} alt="vendors" className={location.search === '?filter=vendors' ? cx(styles.ActiveTabLinkImage, 'pr-2') : cx('pr-2')} />
                            <span>
                              {' '}
                              {t('translation_vendorList:vendors')}
                              {' '}
                              (
                              {' '}
                              {vendorClientCount.vendorCount}
                              {' '}
                              )
                              {' '}
                            </span>
                          </li>
                        )}
                      />

                      <HasAccess
                        permission={['CLIENT:VIEW']}
                        orgId={orgId}
                        yes={() => (
                          <li
                            className={location.search === '?filter=clients' ? cx('pl-0 mr-5', styles.ActiveTabLink) : cx('pl-0 mr-5', styles.InactiveTabLink)}
                            onClick={() => this.handleChangeUrl('clients')}
                            aria-hidden="true"
                          >
                            <img src={client} alt="clients" className={location.search === '?filter=clients' ? cx(styles.ActiveTabLinkImage, 'pr-2') : cx('pr-2')} />
                            <span>
                              {' '}
                              {t('translation_vendorList:clients')}
                              {' '}
                              (
                              {' '}
                              {vendorClientCount.clientCount}
                              {' '}
                              )
                              {' '}
                            </span>

                            {!_.isEmpty(notificationList)
                              ? <div className={styles.redDot} /> : null}
                          </li>
                        )}
                      />

                      <div className={cx('row no-gutters justify-content-end')}>
                        <HasAccess
                          permission={['CLIENT:ACCEPT']}
                          orgId={orgId}
                          yes={() => (
                            <>
                              <img src={dash} alt="dash" className="mr-2 mt-2" />
                              <NotificationIcon
                                showNotifications={showNotifications}
                                orgId={orgId}
                                handleShowHideNotifications={
                                  // eslint-disable-next-line no-shadow
                                  (showNotifications) => this.setState({ showNotifications })
                                }
                                alignProgress={styles.alignProgress}
                                query={query}
                                name={['VENDOR_CLIENT_REQUEST_APPROVAL']}
                                platformService="VENDOR"
                              />
                            </>
                          )}
                        />
                      </div>
                    </ul>
                    <hr className={styles.hr1} />
                    {/* {showNotifications ? null : <hr className={styles.hr1} />} */}
                    {showNotifications
                      ? (
                        <div className={styles.NotifWidth} style={{ contain: 'layout', zIndex: 99 }}>
                          <Notifications
                            showNotifications={showNotifications}
                            orgId={orgId}
                            style={{ width: 'inherit' }}
                          />
                        </div>
                      )
                      : null}
                  </div>
                </div>
                <div
                  className={cx(styles.searchIcon, onFocusSearch
                    ? styles.Focus : styles.NoFocus)}
                  onFocus={this.onFocus}
                  onBlur={this.onBlur}
                >
                  <img className="pb-1" src={search} alt="search" />
                  {' '}
                  &nbsp;
                  <input
                    type="text"
                    placeholder={t('translation_vendorList:searchPlaceholder')}
                    value={searchParam}
                    className={styles.searchBar}
                    onChange={(event) => this.handleInputChange(event)}
                    disabled={location.search === '?filter=insights'}
                  />
                  {searchParam !== ''
                    ? <img src={close} onClick={this.handleClearSearch} aria-hidden style={{ height: '0.75rem', cursor: 'pointer' }} alt="" />
                    : null}
                </div>
              </>
            )}

          {showSuccessNotification
            ? (
              <SuccessNotification
                type="greenCardWithBorder"
                className="mt-3 mb-3"
                message={`${this.clientName} has been successfully added as a client`}
                clicked={this.handleCloseSuccessNotification}
              />
            )
            : showErrorNotification
              ? (
                <ErrorNotification
                  type="excelTaskUpload"
                  className="mt-3 mb-3"
                  error={`${this.clientName} has been rejected as a client`}
                  clicked={this.handleCloseErrorNotification}
                />
              )
              : null}

          {vendorClientCountState === 'LOADING' || getVendorListState === 'LOADING'
            ? (
              <div className="mt-4">
                <Loader type="vendorList" />
              </div>
            )
            : !_.isEmpty(vendorListData) && category !== 'insights' ? (
              <>
                {!_.isEmpty(pendingVendorList)
                  ? (
                    <>
                      <div className="row no-gutters">
                        <div className={cx(styles.AwaitBox)}>
                          <span className={styles.Await}>
                            {t('translation_vendorList:awaiting')}
                            {' '}
                            (
                            {' '}
                            {pendingVendorList.length}
                            {' '}
                            )
                          </span>
                        </div>
                        <hr className={styles.hr2} />
                        <div
                          className="no-gutters mt-1"
                          style={{ cursor: 'pointer' }}
                          onClick={this.handleAwaitingVendors}
                          aria-hidden="true"
                          role="button"
                        >
                          {showAwaitingVendor ? <img src={down} alt="down" /> : <img src={up} alt="up" />}
                        </div>
                      </div>
                      {showAwaitingVendor
                        ? pendingVendorList.map((pendingVendor, index) => (
                          <div key={pendingVendor.name} style={{ marginTop: '1.5rem' }}>
                            <VendorClientInfoCard
                              orgId={orgId}
                              category={category}
                              showLine={index !== pendingVendorList.length - 1}
                              type="pending"
                              brandColor={pendingVendor.brandColor}
                              orgName={pendingVendor.name}
                              id={category === 'vendors' ? pendingVendor.vendorId : pendingVendor.orgId}
                              handleRedirect={this.handleRedirect}
                              roles={pendingVendor.roles}
                              sites={pendingVendor.sites}
                              employees={pendingVendor.employees}
                            />
                          </div>
                        ))
                        : ''}
                    </>
                  )
                  : ''}
                {!_.isEmpty(approvedVendorList)
                  ? (
                    <>
                      <div className={cx('row no-gutters')} style={{ marginTop: pendingVendorList.length === 0 ? '0rem' : '1.5rem' }}>
                        <div className={cx(styles.ActiveBox)}>
                          <span className={styles.Await}>
                            {t('translation_vendorList:active')}
                            {' '}
                            {category}
                            {' '}
                            (
                            {' '}
                            {approvedVendorList.length}
                            {' '}
                            )
                          </span>
                        </div>
                        <hr className={styles.hr3} />
                        <div className="no-gutters mt-1" aria-hidden="true" role="button" style={{ cursor: 'pointer' }} onClick={this.handleActiveVendors}>
                          {showActiveVendor ? <img src={down} alt="down" /> : <img src={up} alt="up" />}
                        </div>
                      </div>
                      {showActiveVendor
                        ? approvedVendorList.map((approvedVendor, index) => (
                          <div key={approvedVendor.name} style={{ marginTop: '1.5rem' }}>
                            <VendorClientInfoCard
                              orgId={orgId}
                              category={category}
                              showLine={index !== approvedVendorList.length - 1}
                              type="approved"
                              brandColor={approvedVendor.brandColor}
                              orgName={approvedVendor.name}
                              id={category === 'vendors' ? approvedVendor.vendorId : approvedVendor.orgId}
                              handleRedirect={this.handleRedirect}
                              roles={approvedVendor.roles}
                              sites={approvedVendor.sites}
                              employees={approvedVendor.employees}
                            />
                          </div>
                        ))
                        : ''}
                    </>
                  )
                  : ''}
                {_.isEmpty(pendingVendorList) && _.isEmpty(approvedVendorList)
                  ? (
                    <VendorOnboarding
                      main
                      showModal={showModal}
                      // showModal={true}
                      idNo={getDocNumber}
                      idState={getDocType}
                      idImage={vendorOnboard}
                      type={category}
                      emptySearchResult
                      searchKey={searchParam}
                    />
                  )
                  : ''}
              </>
            )
              : (
                <VendorOnboarding
                  main
                  showModal={showModal}
                  // showModal={true}
                  idNo={getDocNumber}
                  idState={getDocType}
                  idImage={vendorOnboard}
                  type={category}
                />
              )}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  getDocType: state.vendorMgmt.vendorOnboarding.docType,
  getDocNumber: state.vendorMgmt.vendorOnboarding.docNumber,
  getDocCard: state.vendorMgmt.vendorOnboarding.docCard,
  showModal: state.vendorMgmt.vendorOnboarding.showModal,
  vendorListData: state.vendorMgmt.vendorList.vendorList,
  getVendorListState: state.vendorMgmt.vendorList.getVendorListState,
  orgData: state.orgMgmt.staticData.orgData,
  rightnavOrgId: state.orgMgmt.staticData.rightnavOrgId,

  notificationList: state.notifications.notificationList,
  updateVendorApprovalReqState: state.notifications.updateVendorApprovalReqState,

  clientNotificationState: state.vendorMgmt.vendorList.getClientNotificationState,
  clientNotification: state.vendorMgmt.vendorList.getClientNotification,
  vendorClientCountState: state.vendorMgmt.vendorList.getVendorClientCountState,
  vendorClientCount: state.vendorMgmt.vendorList.getVendorClientCount,

  putClientNotificationState: state.vendorMgmt.vendorList.putClientNotificationState,
  putClientNotification: state.vendorMgmt.vendorList.putClientNotification,
});

const mapDispatchToProps = (dispatch) => ({
  onGetVendorClientList: (orgId, type) => dispatch(actions.getList(orgId, type)),
  onGetOrgData: (orgId) => dispatch(actionsOrgMgmt.getDataById(orgId)),
  onGetNotification: (orgId) => dispatch(actions.getNotification(orgId)),
  onGetVendorClientCount: (orgId) => dispatch(actions.getVendorClientCount(orgId)),
});

export default withTranslation()(withRouter(
  connect(mapStateToProps, mapDispatchToProps)(VendorList),
));
