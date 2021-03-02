/* eslint-disable no-lonely-if */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-shadow */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';
import cx from 'classnames';
import styles from './VendorProfile.module.scss';

import ArrowLink from '../../../../components/Atom/ArrowLink/ArrowLink';
import Loader from '../../../../components/Organism/Loader/Loader';
import EmptyState from '../../../../components/Atom/EmptyState/EmptyState';

import vendorOrg from '../../../../assets/icons/vendorOrg.svg';
import insight from '../../../../assets/icons/active.svg';
import folderVendor from '../../../../assets/icons/folderVendor.svg';
import rolesFolder from '../../../../assets/icons/vendorRolesFolder.svg';
import building from '../../../../assets/icons/greyBuilding.svg';
import vendorImg from '../../../../assets/icons/vendor.svg';
import whiteBuilding from '../../../../assets/icons/whiteBuilding.svg';
import deployedEmployeesVendor from '../../../../assets/icons/deployedEmployeesVendor.svg';
import activeEmployeesVendor from '../../../../assets/icons/activeEmployeesVendor.svg';
import search from '../../../../assets/icons/search.svg';
import awaiting from '../../../../assets/icons/inprogress.svg';
// import smallEmployeeVendor from '../../../../assets/icons/empFolder.svg';
// import smallFolderVendor from '../../../../assets/icons/siteFolder.svg';
// import smallRolesFolder from '../../../../assets/icons/roleFolder.svg';
import OverallInsights from './OverallInsights/OverallInsights';
import VendorCard from './VendorRow/VendorRow';
// import HasAccess from '../../../../services/HasAccess/HasAccess';

import * as actions from './Store/action';
import * as vendorDetailsActions from '../VendorDetails/Store/action';
import * as actionsOrgMgmt from '../../OrgMgmt/OrgMgmtStore/action';

class VendorProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchParam: '',
      focus: false,
      assignedClientsList: [],
      associatedVendorsList: [],
    };
  }

  componentDidMount = () => {
    const { match, location, orgData } = this.props;
    const orgId = match.params.uuid;

    if (_.isEmpty(orgData)) {
      this.props.onGetOrgData(orgId);
    }
    const { vendorId } = match.params;
    this.props.onGetVendorData(orgId, vendorId);

    if (!_.isEmpty(location.search)) {
      this.handleApiCalls();
    }
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.location.search !== this.props.location.search) {
      this.handleApiCalls();
    }

    if (prevProps.assignedClientsState !== this.props.assignedClientsState && this.props.assignedClientsState === 'SUCCESS') {
      this.setState({ assignedClientsList: this.props.assignedClients });
    }

    if (prevProps.associatedVendorsState !== this.props.associatedVendorsState && this.props.associatedVendorsState === 'SUCCESS') {
      this.setState({ associatedVendorsList: this.props.associatedVendors });
    }
  }

  componentWillUnmount = () => {
    this.props.onGetInitState();
  }

  handleApiCalls = () => {
    const { match, location } = this.props;
    const orgId = match.params.uuid;
    const { vendorId } = match.params;
    if (location.search === '?filter=overall_insights') {
      this.props.onGetOverallInsights(orgId, vendorId);
    } else if (location.search === '?filter=my_assigned_clients') {
      this.props.onGetAssignedClientsCount(orgId, vendorId);
      this.props.onGetAssignedClients(orgId, vendorId);
    } else if (location.search === '?filter=associated_vendors') {
      this.props.onGetAssociatedVendorsCount(orgId, vendorId);
      this.props.onGetAssociatedVendors(orgId, vendorId);
    }
  }

  handleInputChange = (event, inputIdentifier) => {
    let key = event.target.value;
    key = key.toLowerCase();
    let assignedClientsList = [];
    let associatedVendorsList = [];
    const thisRef = this;
    if (key.length > 0) {
      if (inputIdentifier === 'assignedClients') {
        _.forEach(thisRef.props.assignedClients, (eachClient) => {
          if ((eachClient.name.toLowerCase()).includes(key)) assignedClientsList.push(eachClient);
        });
      } else {
        _.forEach(thisRef.props.associatedVendors, (eachVendor) => {
          if ((eachVendor.name.toLowerCase()).includes(key)) associatedVendorsList.push(eachVendor);
        });
      }
    } else {
      if (inputIdentifier === 'assignedClients') {
        assignedClientsList = this.props.assignedClients;
      } else {
        associatedVendorsList = this.props.associatedVendors;
      }
    }

    this.setState({
      assignedClientsList,
      associatedVendorsList,
      searchParam: key,
    });
  }

  handleFilterChange = (type) => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    let url = this.props.location.pathname;
    urlSearchParams.set('filter', type);
    urlSearchParams.delete('pageNumber');
    url = `${url}?${urlSearchParams.toString()}`;
    return url;
  }

  handleRedirect = () => {
    const { match } = this.props;
    const orgId = match.params.uuid;
    const redirectPath = `/customer-mgmt/org/${orgId}/vendor-mgmt?filter=vendors`;
    this.props.history.push(redirectPath);
  }

  onFocus = () => {
    this.setState({ focus: true });
  }

  onBlur = () => {
    if (this.state.searchParam === '') this.setState({ focus: false });
  }

  render() {
    const {
      t, match, location, orgDataState, orgData, vendorDataState, vendorData,
      insightsDataState, insightsData,
      assignedClientsCountState, assignedClientsState, assignedClientsCount,
      associatedVendorsCountState, associatedVendorsState, associatedVendorsCount,
    } = this.props;

    const orgId = match.params.uuid;
    const urlSearchParams = location;

    const org = !_.isEmpty(orgData) ? orgData : {};
    const vendor = !_.isEmpty(vendorData) ? vendorData : {};
    const orgName = !_.isEmpty(org) ? org.name.toLowerCase() : 'org_name';
    const vendorName = !_.isEmpty(vendor) ? vendor.vendorLegalName.toLowerCase() : 'vendor_name';

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
            {
              orgDataState === 'LOADING' || vendorDataState === 'LOADING'
                ? <Loader type="orgProfile" />
                : (
                  <>
                    <ArrowLink
                      label={`${orgName}/vendors`}
                      url={`/customer-mgmt/org/${orgId}/vendor-mgmt?filter=vendors`}
                      className="mb-2"
                    />
                    <span className={styles.orgName}>
                      {' '}
                      {vendorName}
                      {' '}
                      - vendor information
                      {' '}
                    </span>

                    <div className={cx('card-body mb-3', styles.HeadCard)}>
                      <div className={cx('row no-gutters')}>
                        <div className={styles.box} style={{ backgroundColor: !_.isEmpty(vendor) ? vendor.brandColor : '#8697A8' }}>
                          <img
                            className={styles.icon}
                            src={vendorOrg}
                            alt={t('translation_orgProfile:image_alt_orgProfile.icon')}
                          />
                        </div>

                        <div className="ml-4 my-auto d-flex flex-column" style={{ width: '70%' }}>
                          <div className={styles.orgHeading}>
                            {vendorName}
                            {vendor.status === 'pendingapproval' ? (
                              <label className={cx('ml-4', styles.orgAddress)}>
                                <img src={awaiting} className="mr-2" style={{ height: '16px' }} alt="" />
                                <i>awaiting approval</i>
                              </label>
                            )
                              : ''}
                          </div>
                          {vendor.address
                            ? (
                              <span className={styles.orgAddress}>
                                {vendor.address.addressLine1}
                                {', '}
                                {vendor.address.addressLine2 ? `${vendor.address.addressLine2}, ` : null}
                                {vendor.address.city}
                                {', '}
                                {vendor.address.state}
                                {', '}
                                {vendor.address.country}
                                {', '}
                                {vendor.address.pincode}
                              </span>
                            )
                            : null}
                        </div>

                        <div className="ml-auto">
                          <NavLink
                            to={`/customer-mgmt/org/${orgId}/vendor-mgmt/vendor/${vendor.vendorId}/config/vendordetails`}
                            className={styles.Link}
                          >
                            <div className={cx('d-flex flex-row', styles.configButton)}>
                              <div className={cx('mx-1', styles.configImg)} alt="" />
                              <span className="px-1">configuration</span>
                            </div>
                          </NavLink>
                        </div>
                      </div>
                    </div>

                    <>
                      <div className="row no-gutters">
                        <div className={cx('pl-0 mr-5 ')}>
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
                            <button className={styles.NavLinkfont}>
                              <span className={styles.svg}>
                                <img src={insight} alt="img_alt" />
                                <span>&nbsp; overall insights </span>
                              </span>
                            </button>
                          </NavLink>
                        </div>
                        <div className={cx('pl-2 mr-5')}>
                          <NavLink
                            to={this.handleFilterChange('my_assigned_clients')}
                            activeClassName={cx(styles.NavLinkfontActive)}
                            isActive={(match, location) => {
                              if (!match) {
                                return false;
                              }
                              const searchParams = new URLSearchParams(location.search);
                              return match.isExact && searchParams.get('filter') === 'my_assigned_clients';
                            }}
                          >
                            <button className={styles.NavLinkfont}>
                              <span className={styles.svg}>
                                <img src={building} style={{ height: '16px' }} alt="active" />
                                <span>&nbsp; my assigned clients</span>
                              </span>
                            </button>
                          </NavLink>
                        </div>
                        {vendor.status === 'active' ? (
                          <div className={cx('pl-2')}>
                            <NavLink
                              to={this.handleFilterChange('associated_vendors')}
                              activeClassName={cx(styles.NavLinkfontActive)}
                              isActive={(match, location) => {
                                if (!match) {
                                  return false;
                                }
                                const searchParams = new URLSearchParams(location.search);
                                return match.isExact && searchParams.get('filter') === 'associated_vendors';
                              }}
                            >
                              <button className={styles.NavLinkfont}>
                                <span className={styles.svg}>
                                  <img src={vendorImg} style={{ height: '16px' }} alt="active" />
                                  <span>
                                    &nbsp;
                                    associated
                                    {' '}
                                    {vendor.vendorLegalName.toLowerCase()}
                                    {' '}
                                    vendors
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
                                      heading={`assigned to ${vendorName} by ${orgName}`}
                                      number={
                                    `${!_.isEmpty(insightsData.site) && insightsData.site.total
                                      ? insightsData.site.total : '00'} sites`
                                  }
                                      leftHeading={`from ${orgName} alone`}
                                      leftNumber={
                                    `${!_.isEmpty(insightsData.site) && insightsData.site.fromClientAlone
                                      ? insightsData.site.fromClientAlone : '00'} sites`
                                  }
                                      rightHeading={`from ${orgName} clients`}
                                      rightNumber={
                                    `${!_.isEmpty(insightsData.site) && insightsData.site.fromAssociatedClients
                                      ? insightsData.site.fromAssociatedClients : '00'} sites`
                                  }
                                      show
                                    />

                                    <OverallInsights
                                      icon={rolesFolder}
                                      heading={`assigned to ${vendorName} by ${orgName}`}
                                      number={
                                    `${!_.isEmpty(insightsData.role) && insightsData.role.total
                                      ? insightsData.role.total : '00'} roles`
                                  }
                                      leftHeading={`from ${orgName} alone`}
                                      leftNumber={
                                    `${!_.isEmpty(insightsData.role) && insightsData.role.fromClientAlone
                                      ? insightsData.role.fromClientAlone : '00'} roles`
                                  }
                                      rightHeading={`from ${orgName} clients`}
                                      rightNumber={
                                    `${!_.isEmpty(insightsData.role) && insightsData.role.fromAssociatedClients
                                      ? insightsData.role.fromAssociatedClients : '00'} roles`
                                  }
                                      show
                                    />
                                    <OverallInsights
                                      icon={deployedEmployeesVendor}
                                      heading={`total deployed employees by ${vendorName}`}
                                      number={insightsData.totalEmployees > 0 ? insightsData.totalEmployees : '00'}
                                      leftHeading={`to ${orgName} alone`}
                                      leftNumber={insightsData.toClientAlone > 0 ? insightsData.toClientAlone : '00'}
                                      rightHeading={`to ${orgName}'s clients`}
                                      rightNumber={insightsData.toAssociatedClients > 0 ? insightsData.toAssociatedClients : '00'}
                                      show={vendor.status !== 'pendingapproval'}
                                    />

                                    <OverallInsights
                                      icon={activeEmployeesVendor}
                                      heading={`active employees on sites by ${vendorName}`}
                                      number={insightsData.totalActiveEmployees > 0 ? insightsData.totalActiveEmployees : '00'}
                                      leftHeading={`to ${orgName} alone`}
                                      leftNumber={insightsData.toClientAloneActive > 0 ? insightsData.toClientAloneActive : '00'}
                                      rightHeading={`to ${orgName}'s clients`}
                                      rightNumber={insightsData.toAssociatedClientsActive > 0 ? insightsData.toAssociatedClientsActive : '00'}
                                      show={vendor.status !== 'pendingapproval'}
                                    />
                                  </>
                                ) : <EmptyState type="emptyVendorTagsList" label="no insights" />}
                            </div>
                          ) : null)
                      : _.includes(urlSearchParams.search, 'my_assigned_clients', 0)
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
                                        clientName={orgName}
                                        show
                                      />

                                      {/* search tasks */}
                                      <div className={cx('mt-4 mb-3', styles.singleCard)}>
                                        <label className={cx(styles.searchLabel)}>
                                          {' '}
                                          my assigned clients to
                                          {' '}
                                          {vendorName}
                                        </label>

                                        <div className={cx(this.state.focus ? styles.InputPlace : styles.InputPlaceBlur, 'col-7')}>
                                          <img src={search} className="mt-0 mb-1" alt={t('translation_orgList:image_alt_orgList.search')} />
                                          {' '}
&nbsp;
                                          <input
                                            type="text"
                                            placeholder={t('translation_orgList:input_orgList.placeholder.searchClient')}
                                            value={this.state.searchParam}
                                            className={cx(styles.searchBar)}
                                            onChange={(event) => this.handleInputChange(event, 'assignedClients')}
                                            onFocus={this.onFocus}
                                            onBlur={this.onBlur}
                                          />
                                        </div>

                                        {!_.isEmpty(this.state.assignedClientsList)
                                          ? this.state.assignedClientsList.map((item) => (
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
                                              vendorName={vendorName}
                                              searchKey={this.state.searchParam}
                                              className={styles.font}
                                              height={styles.height}
                                            />
                                          )}
                                      </div>
                                    </>
                                  )
                                  : <EmptyState type="emptyVendorTagsList" label="no clients assigned yet" />}
                              </div>
                            ) : null)
                        : (vendor.status === 'active')
                          ? (associatedVendorsCountState === 'LOADING' || associatedVendorsState === 'LOADING'
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
                                            {' '}
                                            associated
                                            {' '}
                                            {vendorName}
                                            {' '}
                                            vendors
                                          </label>

                                          <div className={cx(this.state.focus ? styles.InputPlace : styles.InputPlaceBlur, 'col-7')}>
                                            <img src={search} className="mt-0 mb-1" alt={t('translation_orgList:image_alt_orgList.search')} />
                                            {' '}
                                        &nbsp;
                                            <input
                                              type="text"
                                              placeholder={t('translation_orgList:input_orgList.placeholder.searchClient')}
                                              value={this.state.searchParam}
                                              className={cx(styles.searchBar)}
                                              onChange={(event) => this.handleInputChange(event, 'associatedVendors')}
                                              onFocus={this.onFocus}
                                              onBlur={this.onBlur}
                                            />
                                          </div>

                                          {!_.isEmpty(this.state.associatedVendorsList)
                                            ? this.state.associatedVendorsList.map((item) => (
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
                                                vendorName={vendorName}
                                                searchKey={this.state.searchParam}
                                                className={styles.font}
                                                height={styles.height}
                                              />
                                            )}
                                        </div>
                                      </>
                                    ) : <EmptyState type="emptyVendorTagsList" label="no associated vendors" />}
                                </div>
                              ) : null)
                          : null}
                  </>
                )
            }
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  orgData: state.orgMgmt.staticData.orgData,
  orgDataState: state.orgMgmt.staticData.getOrgDataState,
  vendorData: state.vendorMgmt.vendorDetails.getVendorData,
  vendorDataState: state.vendorMgmt.vendorDetails.getVendorDataState,

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
  onGetInitState: () => dispatch(actions.initState()),
  onGetVendorData: (orgId, vendorId) => dispatch(
    vendorDetailsActions.getVendorData(orgId, vendorId),
  ),
  onGetOrgData: (orgId) => dispatch(actionsOrgMgmt.getDataById(orgId)),

  onGetOverallInsights: (orgId, vendorId) => dispatch(actions.getOverallInsights(orgId, vendorId)),
  onGetAssignedClientsCount: (orgId, vendorId) => dispatch(
    actions.getAssignedClientsCount(orgId, vendorId),
  ),
  onGetAssignedClients: (orgId, vendorId) => dispatch(actions.getAssignedClients(orgId, vendorId)),
  onGetAssociatedVendorsCount: (orgId, vendorId) => dispatch(
    actions.getAssociatedVendorsCount(orgId, vendorId),
  ),
  onGetAssociatedVendors: (orgId, vendorId) => dispatch(
    actions.getAssociatedVendors(orgId, vendorId),
  ),
});

export default withTranslation()(withRouter(
  connect(mapStateToProps, mapDispatchToProps)(VendorProfile),
));
