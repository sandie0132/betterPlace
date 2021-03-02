/* eslint-disable no-lonely-if */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-shadow */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-did-update-set-state */
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { Button } from 'react-crux';
import _ from 'lodash';
import cx from 'classnames';
import styles from './clientProfile.module.scss';

import SuccessNotification from '../../../../components/Organism/Notifications/SuccessNotification/SuccessNotification';
import ErrorNotification from '../../../../components/Organism/Notifications/ErrorNotification/ErrorNotification';
import ArrowLink from '../../../../components/Atom/ArrowLink/ArrowLink';
import Loader from '../../../../components/Organism/Loader/Loader';
import EmptyState from '../../../../components/Atom/EmptyState/EmptyState';

import insight from '../../../../assets/icons/active.svg';
import folderVendor from '../../../../assets/icons/folderVendor.svg';
import rolesFolder from '../../../../assets/icons/vendorRolesFolder.svg';
import building from '../../../../assets/icons/greyBuilding.svg';
import whiteBuilding from '../../../../assets/icons/whiteBuilding.svg';
import deployedEmployeesVendor from '../../../../assets/icons/deployedEmployeesVendor.svg';
import activeEmployeesVendor from '../../../../assets/icons/activeEmployeesVendor.svg';
import search from '../../../../assets/icons/search.svg';
import awaiting from '../../../../assets/icons/inprogress.svg';
import vendorOrg from '../../../../assets/icons/vendorOrg.svg';
import vendorImg from '../../../../assets/icons/vendor.svg';

import OverallInsights from '../VendorProfile/OverallInsights/OverallInsights';
import VendorCard from '../VendorProfile/VendorRow/VendorRow';
import ClientApprovalNotification from './ClientApprovalNotification';

import * as actions from './Store/action';
import * as vendorProfileActions from '../VendorProfile/Store/action';

import HasAccess from '../../../../services/HasAccess/HasAccess';

class VendorProfile extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      showRequestNotification: false,
      showSuccessNotification: false,
      showErrorNotification: false,
      searchParam: '',
      focus: false,
      assignedClientsList: [],
      associatedVendorsList: [],
    };
  }

  componentDidMount = () => {
    const {
      match, location, onGetClientData, onGetNotification,
    } = this.props;
    const orgId = match.params.uuid;
    const { clientId } = match.params;
    onGetClientData(orgId, clientId);
    onGetNotification(orgId);
    if (!_.isEmpty(location.search)) {
      this.handleApiCalls();
    }
  }

  componentDidUpdate = (prevProps) => {
    const {
      match, history, clientNotification, putClientNotificationState, putClientNotification,
      assignedClientsState, associatedVendorsState, assignedClients, associatedVendors,
    } = this.props;
    const orgId = match.params.uuid;

    // eslint-disable-next-line react/destructuring-assignment
    if (prevProps.location.search !== this.props.location.search) {
      this.handleApiCalls();
    }

    if (prevProps.assignedClientsState !== assignedClientsState && assignedClientsState === 'SUCCESS') {
      this.setState({ assignedClientsList: assignedClients });
    }

    if (prevProps.associatedVendorsState !== associatedVendorsState && associatedVendorsState === 'SUCCESS') {
      this.setState({ associatedVendorsList: associatedVendors });
    }

    if (prevProps.clientNotification !== clientNotification && clientNotification.length > 0) {
      this.setState({ showRequestNotification: true });
    }

    if (prevProps.putClientNotificationState !== putClientNotificationState && putClientNotificationState === 'SUCCESS') {
      if (_.isEmpty(putClientNotification)) {
        history.push(`/customer-mgmt/org/${orgId}/vendor-mgmt?filter=clients`);
      } else {
        this.setState({ showSuccessNotification: true });
        setTimeout(() => {
          this.setState({ showSuccessNotification: false });
        }, 3000);
      }
    }
  }

  componentWillUnmount = () => {
    const { onGetInitState } = this.props;
    onGetInitState();
  }

  handleApiCalls = () => {
    const {
      match, location, onGetOverallInsights, onGetAssignedClientsCount, onGetAssignedClients,
      onGetAssociatedVendorsCount, onGetAssociatedVendors,
    } = this.props;
    const orgId = match.params.uuid;
    const { clientId } = match.params;
    if (location.search === '?filter=overall_insights') {
      onGetOverallInsights(clientId, orgId);
    } else if (location.search === '?filter=associated_clients') {
      onGetAssignedClientsCount(clientId, orgId);
      onGetAssignedClients(clientId, orgId);
    } else if (location.search === '?filter=my_associated_vendors') {
      onGetAssociatedVendorsCount(clientId, orgId);
      onGetAssociatedVendors(clientId, orgId);
    }
  }

  handleFilterChange = (type) => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const { location } = this.props;
    let url = location.pathname;
    urlSearchParams.set('filter', type);
    urlSearchParams.delete('pageNumber');
    url = `${url}?${urlSearchParams.toString()}`;

    return url;
  }

  handleNotification = (value) => {
    const { match, onPutNotification } = this.props;
    const orgId = match.params.uuid;
    const { clientId } = match.params;

    const payload = { status: value };
    if (value === 'rejected') {
      this.setState({ showErrorNotification: true });
    }
    onPutNotification(payload, orgId, clientId);
    this.setState({ showRequestNotification: false });
  }

  handleCloseSuccessNotification = () => {
    this.setState({ showSuccessNotification: false });
  }

  handleCloseErrorNotification = () => {
    this.setState({ showErrorNotification: false });
  }

  handleInputChange = (event, inputIdentifier) => {
    let key = event.target.value;
    key = key.toLowerCase();
    let assignedClientsList = [];
    let associatedVendorsList = [];
    const { assignedClients, associatedVendors } = this.props;
    if (key.length > 0) {
      if (inputIdentifier === 'assignedClients') {
        _.forEach(assignedClients, (eachClient) => {
          if ((eachClient.name.toLowerCase()).includes(key)) assignedClientsList.push(eachClient);
        });
      } else {
        _.forEach(associatedVendors, (eachVendor) => {
          if ((eachVendor.name.toLowerCase()).includes(key)) associatedVendorsList.push(eachVendor);
        });
      }
    } else {
      if (inputIdentifier === 'assignedClients') {
        assignedClientsList = assignedClients;
      } else {
        associatedVendorsList = associatedVendors;
      }
    }
    this.setState({
      assignedClientsList,
      associatedVendorsList,
      searchParam: key,
    });
  }

  onFocus = () => {
    this.setState({ focus: true });
  }

  onBlur = () => {
    const { searchParam } = this.state;
    if (searchParam === '') this.setState({ focus: false });
  }

  render() {
    const {
      t, match, location, orgDataState, orgData, clientDataByIdState, clientData,
      clientNotification, putClientNotificationState,
      insightsDataState, insightsData,
      assignedClientsCountState, assignedClientsState, assignedClientsCount,
      associatedVendorsCountState, associatedVendorsState, associatedVendorsCount,
    } = this.props;

    const {
      showSuccessNotification, showErrorNotification, showRequestNotification, focus, searchParam,
      associatedVendorsList, assignedClientsList,
    } = this.state;
    const orgId = match.params.uuid;
    const { clientId } = match.params;
    const urlSearchParams = location;
    const org = !_.isEmpty(orgData) ? orgData : {};
    const client = !_.isEmpty(clientData) ? clientData : {};
    const orgName = !_.isEmpty(org) ? org.name.toLowerCase() : 'org_name';
    const clientName = !_.isEmpty(client) ? client.orgName.toLowerCase() : 'client_name';

    let roleCount = 0; let locCount = 0; let deployedEmpCount = 0; let activeEmpCount = 0;
    let associatedRoles = 0; let associatedSites = 0;
    let associatedDeployedEmp = 0; let associatedActiveEmp = 0;

    if (!_.isEmpty(assignedClientsCount)) {
      _.forEach(assignedClientsCount, (data) => {
        if (data._id === 'role') {
          roleCount = data.count;
          deployedEmpCount = data.emps;
          activeEmpCount = data.activeEmps;
        }
        if (data._id === 'site') {
          locCount = data.count;
          deployedEmpCount = data.emps;
          activeEmpCount = data.activeEmps;
        }
      });
    }

    if (!_.isEmpty(associatedVendorsCount)) {
      _.forEach(associatedVendorsCount, (data) => {
        if (data._id === 'role') {
          associatedRoles = data.count;
          associatedDeployedEmp = data.emps;
          associatedActiveEmp = data.activeEmps;
        }
        if (data._id === 'site') {
          associatedSites = data.count;
          associatedDeployedEmp = data.emps;
          associatedActiveEmp = data.activeEmps;
        }
      });
    }

    return (
      <>
        <div className={styles.alignCenter}>
          <div className={cx(styles.Card)}>
            {orgDataState === 'LOADING' || clientDataByIdState === 'LOADING'
              ? <Loader type="orgProfile" />
              : (
                <>
                  <ArrowLink
                    label={`${orgName}/vendors`}
                    url={`/customer-mgmt/org/${orgId}/vendor-mgmt?filter=clients`}
                    className="mb-2"
                  />
                  <span className={styles.orgName}>
                    {' '}
                    {clientName}
                    {' '}
                    - client information
                    {' '}
                  </span>

                  {showSuccessNotification
                    ? (
                      <SuccessNotification
                        type="agencyNotification"
                        className="mt-3 mb-1"
                        message={`${clientName} has been successfully added as a client`}
                        clicked={this.handleCloseSuccessNotification}
                      />
                    ) : showErrorNotification
                      ? (
                        <ErrorNotification
                          type="excelTaskUpload"
                          className="mt-3 mb-1"
                          error={`${clientName} has been rejected as a client`}
                          clicked={this.handleCloseErrorNotification}
                        />
                      ) : showRequestNotification
                        ? (
                          <HasAccess
                            permission={['CLIENT:ACCEPT']}
                            orgId={orgId}
                            yes={() => (
                              clientNotification.map((item) => (
                                item.data.clientId === clientData.orgId
                                  ? (
                                    <ClientApprovalNotification
                                      key={item.data.clientId}
                                      className="mt-3"
                                      orgName={clientName}
                                      handleNotification={
                                        (value) => this.handleNotification(value)
                                      }
                                    />
                                  ) : null))
                            )}
                          />
                        ) : null}

                  <div className={cx('card-body mb-3', styles.HeadCard)}>
                    <div className="row no-gutters">
                      <div className={styles.box} style={{ backgroundColor: match.params.clientId ? clientData.brandColor : '#8697A8' }}>
                        <img
                          className={styles.icon}
                          src={whiteBuilding}
                          alt={t('translation_orgProfile:image_alt_orgProfile.icon')}
                        />
                      </div>

                      <div className="ml-4 my-auto d-flex flex-column" style={{ width: '70%' }}>
                        <div className={styles.orgHeading}>
                          {clientName}
                          {client.status === 'pendingapproval'
                            ? (
                              <label className={cx('ml-4', styles.orgAddress)}>
                                <img src={awaiting} className="mr-2" style={{ height: '16px' }} alt="" />
                                <i>awaiting approval</i>
                              </label>
                            )
                            : null}
                        </div>
                        {client.address
                          ? (
                            <span className={styles.orgAddress}>
                              {client.address.addressLine1}
                              {', '}
                              {client.address.addressLine2 ? `${client.address.addressLine2}, ` : null}
                              {client.address.city}
                              {', '}
                              {client.address.state}
                              {', '}
                              {client.address.country}
                              {', '}
                              {client.address.pincode}
                            </span>
                          )
                          : null}
                      </div>
                      {client.status === 'active'
                        ? (
                          <div className="d-flex flex-row ml-auto">
                            <NavLink to={`/customer-mgmt/org/${orgId}/vendor-mgmt/client/${clientId}/details/location-sites`}>
                              <Button
                                type="secondaryButtonWithArrow"
                                label="view details"
                                isDisabled={false}
                                className={styles.DetailsButton}
                                arrowStyle={cx('ml-1', styles.DetailsButtonArrow)}
                              />
                            </NavLink>
                          </div>
                        ) : null}
                    </div>
                  </div>

                  <>
                    <div className="row no-gutters">
                      <div className={cx('pl-0 mr-4')}>
                        <NavLink
                          to={this.handleFilterChange('overall_insights')}
                          activeClassName={cx(styles.NavLinkfontActive)}
                          isActive={(match, location) => {
                            if (!match) {
                              return false;
                            }
                            const searchParams = new URLSearchParams(location.search);
                            return match.isExact && searchParams.get('filter') === 'overall_insights';
                          }}
                        >
                          <button className={styles.NavLinkfont} type="button">
                            <span className={styles.svg}>
                              <img src={insight} alt="img_alt" />
                              <span>&nbsp; overall insights </span>
                            </span>
                          </button>
                        </NavLink>
                      </div>
                      <div className={cx('pl-2 mr-4')}>
                        <NavLink
                          to={this.handleFilterChange('associated_clients')}
                          activeClassName={cx(styles.NavLinkfontActive)}
                          isActive={(match, location) => {
                            if (!match) {
                              return false;
                            }
                            const searchParams = new URLSearchParams(location.search);
                            return match.isExact && searchParams.get('filter') === 'associated_clients';
                          }}
                        >
                          <button className={styles.NavLinkfont} type="button">
                            <span className={styles.svg}>
                              <img src={building} className="pr-2" style={{ height: '16px' }} alt="active" />
                              <span>
                                {`associated ${clientName}'s clients`}
                              </span>
                            </span>
                          </button>
                        </NavLink>
                      </div>
                      {client.status === 'active' ? (
                        <div className={cx('pl-2')}>
                          <NavLink
                            to={this.handleFilterChange('my_associated_vendors')}
                            activeClassName={cx(styles.NavLinkfontActive)}
                            isActive={(match, location) => {
                              if (!match) {
                                return false;
                              }
                              const searchParams = new URLSearchParams(location.search);
                              return match.isExact && searchParams.get('filter') === 'my_associated_vendors';
                            }}
                          >
                            <button className={styles.NavLinkfont} type="button">
                              <span className={styles.svg}>
                                <img src={vendorImg} style={{ height: '16px' }} alt="active" />
                                <span>
                                  &nbsp;
                                  my assigned vendors
                                </span>
                              </span>
                            </button>
                          </NavLink>
                        </div>
                      ) : null}
                    </div>

                    <hr className={cx(styles.hr1)} />
                  </>

                  {_.includes(urlSearchParams.search, 'overall_insights', 0)
                    ? (insightsDataState === 'LOADING'
                      ? <Loader type="list" />
                      : insightsDataState === 'SUCCESS'
                        ? (
                          <div className="d-flex flex-row flex-wrap justify-content-between">

                            {!_.isEmpty(insightsData)
                              ? (
                                <>
                                  <OverallInsights
                                    icon={folderVendor}
                                    heading={`assigned to ${orgName} by ${clientName}`}
                                    number={
                                      `${!_.isEmpty(insightsData.site) && insightsData.site.total
                                        ? insightsData.site.total : '00'} sites`
                                    }
                                    leftHeading={`from ${clientName} alone`}
                                    leftNumber={
                                      `${!_.isEmpty(insightsData.site) && insightsData.site.fromClientAlone
                                        ? insightsData.site.fromClientAlone : '00'} sites`
                                    }
                                    rightHeading={`from ${clientName} clients`}
                                    rightNumber={
                                      `${!_.isEmpty(insightsData.site) && insightsData.site.fromAssociatedClients
                                        ? insightsData.site.fromAssociatedClients : '00'} sites`
                                    }
                                    show
                                  />

                                  <OverallInsights
                                    icon={rolesFolder}
                                    heading={`assigned to ${orgName} by ${clientName}`}
                                    number={
                                      `${!_.isEmpty(insightsData.role) && insightsData.role.total
                                        ? insightsData.role.total : '00'} roles`
                                    }
                                    leftHeading={`from ${clientName} alone`}
                                    leftNumber={
                                      `${!_.isEmpty(insightsData.role) && insightsData.role.fromClientAlone
                                        ? insightsData.role.fromClientAlone : '00'} roles`
                                    }
                                    rightHeading={`from ${clientName} clients`}
                                    rightNumber={
                                      `${!_.isEmpty(insightsData.role) && insightsData.role.fromAssociatedClients
                                        ? insightsData.role.fromAssociatedClients : '00'} roles`
                                    }
                                    show
                                  />

                                  <OverallInsights
                                    icon={deployedEmployeesVendor}
                                    heading={`total deployed employees by ${orgName}`}
                                    number={insightsData.totalEmployees > 0 ? insightsData.totalEmployees : '00'}
                                    leftHeading={`to ${clientName} alone`}
                                    leftNumber={insightsData.toClientAlone > 0 ? insightsData.toClientAlone : '00'}
                                    rightHeading={`to ${clientName}'s clients`}
                                    rightNumber={insightsData.toAssociatedClients > 0 ? insightsData.toAssociatedClients : '00'}
                                    show={client.status === 'active'}
                                  />

                                  <OverallInsights
                                    icon={activeEmployeesVendor}
                                    heading={`active employees on sites by ${orgName}`}
                                    number={insightsData.totalActiveEmployees > 0 ? insightsData.totalActiveEmployees : '00'}
                                    leftHeading={`to ${clientName} alone`}
                                    leftNumber={insightsData.toClientAloneActive > 0 ? insightsData.toClientAloneActive : '00'}
                                    rightHeading={`to ${clientName}'s clients`}
                                    rightNumber={insightsData.toAssociatedClientsActive > 0 ? insightsData.toAssociatedClientsActive : '00'}
                                    show={client.status === 'active'}
                                  />

                                </>
                              ) : <EmptyState type="emptyVendorTagsList" label="no insights" />}
                          </div>
                        ) : null)
                    : _.includes(urlSearchParams.search, 'associated_clients', 0)
                      ? (assignedClientsCountState === 'LOADING' || assignedClientsState === 'LOADING'
                        ? <Loader type="list" />
                        : assignedClientsCountState === 'SUCCESS' && assignedClientsState === 'SUCCESS'
                          ? (
                            <div>
                              {!_.isEmpty(assignedClientsCount)
                                ? (
                                  <>
                                    <OverallInsights
                                      singleCard
                                      locations={locCount}
                                      roles={roleCount}
                                      deployedEmployees={deployedEmpCount}
                                      activeEmployees={activeEmpCount}
                                      clientName={clientName}
                                      show
                                    />

                                    <div className={cx('mt-4 mb-3', styles.singleCard)}>
                                      <label className={cx(styles.searchLabel)}>
                                        {' '}
                                        associated
                                        {' '}
                                        {clientName}
                                        {' '}
                                        clients
                                        {' '}
                                      </label>

                                      <div className={cx(focus ? styles.InputPlace : styles.InputPlaceBlur, 'col-7')}>
                                        <img src={search} className="mt-0 mb-1" alt={t('translation_orgList:image_alt_orgList.search')} />
                                        {' '}
                                    &nbsp;
                                        <input
                                          type="text"
                                          placeholder={t('translation_orgList:input_orgList.placeholder.searchClient')}
                                          value={searchParam}
                                          className={cx(styles.searchBar)}
                                          onChange={(event) => this.handleInputChange(event, 'assignedClients')}
                                          onFocus={this.onFocus}
                                          onBlur={this.onBlur}
                                        />
                                      </div>
                                      {!_.isEmpty(assignedClientsList)
                                        ? assignedClientsList.map((item) => (
                                          <React.Fragment key={item.orgId}>
                                            <hr className={cx(styles.horizontalLine, 'mt-4')} />
                                            <VendorCard
                                              vendorName={item.name.toLowerCase()}
                                              icon={whiteBuilding}
                                              locations={item.sites ? item.sites : 0}
                                              roles={item.roles ? item.roles : 0}
                                              employees={item.employees ? item.employees : 0}
                                              brandColor={item.brandColor}
                                            />
                                          </React.Fragment>
                                        ))
                                        : (
                                          <EmptyState
                                            type="emptyvendorSearch"
                                            name="client"
                                            vendorName={clientName}
                                            searchKey={searchParam}
                                            className={styles.font}
                                            height={styles.height}
                                          />
                                        )}
                                    </div>
                                  </>
                                )
                                : <EmptyState type="emptyVendorTagsList" label="no associated clients yet" />}
                            </div>
                          ) : null)
                      : (client.status === 'active' || putClientNotificationState === 'SUCCESS')
                        ? (associatedVendorsCountState === 'LOADING' && associatedVendorsState === 'LOADING'
                          ? <Loader type="list" />
                          : associatedVendorsCountState === 'SUCCESS' && associatedVendorsState === 'SUCCESS'
                            ? (
                              <div>
                                {!_.isEmpty(associatedVendorsCount)
                                  ? (
                                    <>
                                      <OverallInsights
                                        singleCard
                                        associatedVendors
                                        locations={associatedSites}
                                        roles={associatedRoles}
                                        deployedEmployees={associatedDeployedEmp}
                                        activeEmployees={associatedActiveEmp}
                                        clientName={orgName}
                                        show
                                      />

                                      <div className={cx('mt-4 mb-3', styles.singleCard)}>
                                        <label className={cx(styles.searchLabel)}>
                                          my associated vendors
                                        </label>

                                        <div className={cx(focus ? styles.InputPlace : styles.InputPlaceBlur, 'col-7')}>
                                          <img src={search} className="mt-0 mb-1" alt={t('translation_orgList:image_alt_orgList.search')} />
                                          {' '}
                                    &nbsp;
                                          <input
                                            type="text"
                                            placeholder={t('translation_orgList:input_orgList.placeholder.searchClient')}
                                            value={searchParam}
                                            className={cx(styles.searchBar)}
                                            onChange={(event) => this.handleInputChange(event, 'associatedVendors')}
                                            onFocus={this.onFocus}
                                            onBlur={this.onBlur}
                                          />
                                        </div>

                                        {!_.isEmpty(associatedVendorsList)
                                          ? associatedVendorsList.map((item) => (
                                            <React.Fragment key={item.orgId}>
                                              <hr className={cx(styles.horizontalLine, 'mt-4')} />
                                              <VendorCard
                                                vendorName={item.name.toLowerCase()}
                                                icon={vendorOrg}
                                                iconStyle={styles.vendorOrgIcon}
                                                locations={item.sites ? item.sites : 0}
                                                roles={item.roles ? item.roles : 0}
                                                employees={item.employees ? item.employees : 0}
                                                brandColor={item.brandColor}
                                              />
                                            </React.Fragment>
                                          ))
                                          : (
                                            <EmptyState
                                              type="emptyvendorSearch"
                                              name="vendor"
                                              vendorName={clientName}
                                              searchKey={searchParam}
                                              className={styles.font}
                                              height={styles.height}
                                            />
                                          )}
                                      </div>
                                    </>
                                  ) : <EmptyState type="emptyVendorTagsList" label="no assigned vendors" />}
                              </div>
                            ) : null)
                        : null}
                </>
              )}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  orgData: state.orgMgmt.staticData.orgData,
  orgDataState: state.orgMgmt.staticData.getOrgDataState,

  clientDataByIdState: state.vendorMgmt.clientProfile.getClientDataByIdState,
  clientData: state.vendorMgmt.clientProfile.clientData,

  clientNotificationState: state.vendorMgmt.clientProfile.getClientNotificationState,
  clientNotification: state.vendorMgmt.clientProfile.getClientNotification,

  putClientNotificationState: state.vendorMgmt.clientProfile.putClientNotificationState,
  putClientNotification: state.vendorMgmt.clientProfile.putClientNotification,

  insightsData: state.vendorMgmt.vendorProfile.insightsData,
  insightsDataState: state.vendorMgmt.vendorProfile.insightsDataState,
  assignedClientsCount: state.vendorMgmt.vendorProfile.assignedClientsCount,
  assignedClientsCountState: state.vendorMgmt.vendorProfile.assignedClientsCountState,
  assignedClients: state.vendorMgmt.vendorProfile.assignedClients,
  assignedClientsState: state.vendorMgmt.vendorProfile.assignedClientsState,
  associatedVendorsCount: state.vendorMgmt.vendorProfile.associatedVendorsCount,
  associatedVendorsCountState: state.vendorMgmt.vendorProfile.associatedVendorsCountState,
  associatedVendors: state.vendorMgmt.vendorProfile.associatedVendors,
  associatedVendorsState: state.vendorMgmt.vendorProfile.associatedVendorsState,
});

const mapDispatchToProps = (dispatch) => ({
  onGetClientData: (orgId, clientId) => dispatch(actions.getClientData(orgId, clientId)),
  onGetNotification: (orgId) => dispatch(actions.getNotification(orgId)),
  onPutNotification: (payload, orgId, clientId) => dispatch(
    actions.putNotification(payload, orgId, clientId),
  ),

  onGetInitState: () => dispatch(vendorProfileActions.initState()),
  onGetOverallInsights: (orgId, vendorId) => dispatch(
    vendorProfileActions.getOverallInsights(orgId, vendorId),
  ),
  onGetAssignedClientsCount: (orgId, vendorId) => dispatch(
    vendorProfileActions.getAssignedClientsCount(orgId, vendorId),
  ),
  onGetAssignedClients: (orgId, vendorId) => dispatch(
    vendorProfileActions.getAssignedClients(orgId, vendorId),
  ),
  onGetAssociatedVendorsCount: (orgId, vendorId) => dispatch(
    vendorProfileActions.getAssociatedVendorsCount(orgId, vendorId),
  ),
  onGetAssociatedVendors: (orgId, vendorId) => dispatch(
    vendorProfileActions.getAssociatedVendors(orgId, vendorId),
  ),
});

export default withTranslation()(withRouter(
  connect(mapStateToProps, mapDispatchToProps)(VendorProfile),
));
