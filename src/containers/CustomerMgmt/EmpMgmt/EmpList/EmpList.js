/* eslint-disable max-len */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';
import cx from 'classnames';

import * as actions from './Store/action';
import styles from './EmpList.module.scss';
import EmployeeCard from './EmpCard/EmpCard';
import Paginator from '../../../../components/Organism/Paginator/Paginator';
import TileLoader from '../../../../components/Organism/Loader/Loader';
import TerminationCard from '../EmpTermination/TerminationCard/TerminationCard';
import EmpExcelDownloadModal from './EmpExcelDownloadModal/EmpExcelDownloadModal';
import DeployModal from './DeployModal/DeployModal';
import Notifications, { NotificationIcon } from '../../Notifications/Notifications';
import EmpListFooter from './EmpListFooter/EmpListFooter';
import BgvInitiateModal from './BgvInitiateModal/BgvInitiateModal';

import ArrowLink from '../../../../components/Atom/ArrowLink/ArrowLink';
import CustomDropdown from '../../../../components/Molecule/CustomDropdown/CustomDropdown';
import scrollStyle from '../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import Checkbox from '../../../../components/Atom/CheckBox/CheckBox';

import search from '../../../../assets/icons/search.svg';
import emptyFilter from '../../../../assets/icons/filterEmptyState.svg';
import assignIcon from '../../../../assets/icons/assignIcon.svg';
import assignActive from '../../../../assets/icons/assignActive.svg';
import initiateActive from '../../../../assets/icons/initiateActive.svg';
import deployActive from '../../../../assets/icons/deployActive.svg';
import terminateActive from '../../../../assets/icons/terminateActive.svg';
import initiateIcon from '../../../../assets/icons/initiate.svg';
import deployIcon from '../../../../assets/icons/deployIcon.svg';
import terminateIcon from '../../../../assets/icons/terminateIcon.svg';
import download from '../../../../assets/icons/greyDownload.svg';
import dash from '../../../../assets/icons/dash.svg';
import noresult from '../../../../assets/icons/NoResultFound.svg';
import close from '../../../../assets/icons/spocClose.svg';

import HasAccess from '../../../../services/HasAccess/HasAccess';

const mobileRegex = /^([+][9][1]|[9][1]|[0]){0,1}([ ]{0,1})([0-9]{1})([0-9]{9})$/;
const emailRegex = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;
const alphaNumericRegex = /^[a-zA-Z0-9]*$/;
const maxSelectionAllowed = 10000;

class EmployeeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFilter: false,
      selectedEmployees: [],
      selectAll: false,
      showSelectAllOption: false,
      searchKey: '',
      showNotifications: false,
      actionType: '',
      // showSuccessNotification: null,
      // initiateBgvState: false,
      // progress: 100,
      pageSize: 18,
      searchOption: 'profile details',
      onFocusSearch: false,
      showInactiveTooltip: false,
    };
  }

  componentDidMount() {
    const {
      match, location, filterPayload, onGetEmpListCountByFilters, // onGetPaginationCount,
    } = this.props;
    const orgId = match.params.uuid;
    const targetUrl = location.search;
    // onGetPaginationCount(targetUrl, orgId);
    onGetEmpListCountByFilters(targetUrl, orgId, filterPayload);
  }

  componentDidUpdate(prevProps, prevState) {
    const { match, filterPayload } = this.props;
    const orgId = match.params.uuid;
    let searchOption;

    this.props.staticDataEmpListSearch.map((item) => {
      if (item.label === this.state.searchOption) { searchOption = item.value; }
      return searchOption;
    });

    if (prevState.selectedEmployees !== this.props.selectedEmployees) {
      if (this.state.selectedEmployees.length === 0 && this.state.actionType !== '') {
        this.setState({
          actionType: '',
        });
      }
    }
    if (prevProps.getEmployeeListState !== this.props.getEmployeeListState) {
      if (this.props.getEmployeeListState === 'SUCCESS') {
        this.setState({
          showFilter: false,
          actionType: '',
        });
      }
    }

    // vendor filters payload changes
    if (prevProps.filterPayload !== filterPayload) {
      const { location } = this.props;
      const targetUrl = location.search;
      this.props.onGetEmpListCountByFilters(targetUrl, match.params.uuid, filterPayload);
      // this.props.onGetEmpListByFilters(targetUrl, null, orgId, filterPayload);
    }

    if (prevState.searchKey !== this.state.searchKey || (this.state.searchKey !== '' && prevState.searchOption !== this.state.searchOption)) {
      if ((this.state.searchKey.length > 2 && searchOption === 'profile' && alphaNumericRegex.test(this.state.searchKey))
        || (this.state.searchKey.length > 6 && searchOption === 'docId' && alphaNumericRegex.test(this.state.searchKey))
        || (searchOption === 'mobile' && mobileRegex.test(this.state.searchKey))
        || (searchOption === 'email' && emailRegex.test(this.state.searchKey))) {
        if (this.props.location.search !== '') {
          const redirectPath = `/customer-mgmt/org/${orgId}/employee`;
          this.props.history.push(redirectPath);
        }
        const targetUrl = this.props.location.search;
        this.props.onSearchDataCount(targetUrl, this.state.searchKey, orgId, searchOption);
      } else if (this.state.searchKey.length === 0) {
        // this.props.onGetPaginationCount('', orgId);
        this.props.onGetEmpListCountByFilters('', orgId, filterPayload);
      }
    }

    if (prevProps.getCountState !== this.props.getCountState) {
      if (this.props.getCountState === 'SUCCESS') {
        if (this.props.dataCount > this.state.pageSize) {
          if (this.props.location.search.includes('pageNumber')) {
            const targetUrl = this.props.location.search;
            if (this.state.searchKey.length > 0) {
              this.props.onSearchEmployee(
                targetUrl, this.state.searchKey, this.state.pageSize, orgId, searchOption,
              );
            } else {
              // this.props.onGetEmployeeList(targetUrl, this.state.pageSize, orgId);
              this.props.onGetEmpListByFilters(targetUrl, this.state.pageSize, orgId,
                filterPayload);
            }
          } else {
            let redirectPath = '';
            if (this.props.location.search.length !== 0) {
              redirectPath = `/customer-mgmt/org/${orgId}/employee${this.props.location.search}&pageNumber=1`;
            } else {
              redirectPath = `/customer-mgmt/org/${orgId}/employee?pageNumber=1`;
            }
            this.props.history.push(redirectPath);
          }
        } else {
          const targetUrl = this.props.location.search;
          if (this.props.location.search.includes('pageNumber')) {
            const regex = /(?:pageNumber=)([0-9]+)/;
            const newSearchPath = this.props.location.search.replace(regex, '');
            const redirectPath = `/customer-mgmt/org/${orgId}/employee${newSearchPath}`;
            this.props.history.push(redirectPath);
          }

          if (this.state.searchKey.length > 0) {
            this.props.onSearchEmployee(targetUrl, this.state.searchKey, null, orgId, searchOption);
          } else {
            // this.props.onGetEmployeeList(targetUrl, null, orgId);
            this.props.onGetEmpListByFilters(targetUrl, null, orgId, filterPayload);
          }
          // if (this.state.searchKey.length > 0) {
          // this.props.onSearchEmployee(
          // targetUrl, this.state.searchKey, this.state.pageSize, orgId, searchOption
          // );
          // } else this.props.onGetEmployeeList(targetUrl, this.state.pageSize, orgId);
        }
      }
    }
    if (prevProps.location.search !== this.props.location.search) {
      if (this.props.location.search.includes('pageNumber')) {
        const targetUrl = this.props.location.search;
        if (this.state.searchKey.length > 0) {
          this.props.onSearchEmployee(
            targetUrl, this.state.searchKey, this.state.pageSize, orgId, searchOption,
          );
        } else {
          // this.props.onGetEmployeeList(targetUrl, this.state.pageSize, orgId);
          this.props.onGetEmpListByFilters(targetUrl, this.state.pageSize, orgId, filterPayload);
        }
      } else if ((this.state.searchKey.length > 2 && searchOption === 'profile' && alphaNumericRegex.test(this.state.searchKey))
        || (this.state.searchKey.length > 6 && searchOption === 'docId' && alphaNumericRegex.test(this.state.searchKey))
        || searchOption === 'mobile' || searchOption === 'email') {
        const targetUrl = this.props.location.search;
        this.props.onSearchDataCount(targetUrl, this.state.searchKey, orgId, searchOption);
      } else if (this.state.searchKey.length === 0) {
        const targetUrl = this.props.location.search;
        // this.props.onGetPaginationCount(targetUrl, orgId);
        this.props.onGetEmpListCountByFilters(targetUrl, orgId, filterPayload);
      }

      // reset selectall and selected employees when filters are changed

      let prevSearchParams = new URLSearchParams(prevProps.location.search);
      prevSearchParams.delete('pageNumber');
      prevSearchParams = prevSearchParams.toString();

      let currSearchParams = new URLSearchParams(this.props.location.search.toString());
      currSearchParams.delete('pageNumber');
      currSearchParams = currSearchParams.toString();

      if (prevSearchParams !== currSearchParams) {
        this.setState({
          selectedEmployees: [],
          selectAll: false,
          showSelectAllOption: false,
        });
      }
    }

    if (this.props.getEmployeeListState !== prevProps.getEmployeeListState && this.props.getEmployeeListState === 'SUCCESS') {
      const tagArray = [];
      this.props.employeeList.map((employee) => {
        if (!_.isEmpty(employee.defaultRole) && !tagArray.includes(employee.defaultRole)) {
          tagArray.push(employee.defaultRole);
        }
        // if (!_.isEmpty(employee.defaultLocation) && !tagArray.includes(employee.defaultLocation))
        //   tagArray.push(employee.defaultLocation)
        return null;
      });
      if (tagArray.length > 0) this.props.onGetTagInfo(tagArray);
    }
  }

  componentWillUnmount() {
    this.props.initEmployeeList();
  }

  handleSelectEmployee = (empId) => {
    const { selectedEmployees } = this.state;
    let empArray = _.cloneDeep(selectedEmployees);
    if (_.includes(empArray, empId)) {
      empArray = _.remove(empArray, (emp) => emp !== empId);
    } else {
      empArray.push(empId);
    }
    this.setState({
      selectedEmployees: empArray,
      selectAll: false,
      showSelectAllOption: false,
    });
  }

  toggleSelectAll = () => {
    const selectedEmployees = _.cloneDeep(this.state.selectedEmployees);
    let updatedSelectedEmpList = _.cloneDeep(selectedEmployees);
    const pageSelectStatus = this.handleGetPageSelectStatus();
    let showSelectAllOption = false;

    if (pageSelectStatus === null) {
      _.forEach(this.props.employeeList, (emp) => {
        if (!_.includes(selectedEmployees, emp.uuid)) {
          updatedSelectedEmpList.push(emp.uuid);
        }
      });
      if (this.props.dataCount > updatedSelectedEmpList.length) showSelectAllOption = true;
    } else {
      _.forEach(this.props.employeeList, (emp) => {
        if (_.includes(selectedEmployees, emp.uuid)) {
          updatedSelectedEmpList = updatedSelectedEmpList.filter((empId) => empId !== emp.uuid);
        }
      });
    }
    this.setState({
      selectedEmployees: updatedSelectedEmpList,
      showSelectAllOption,
    });
  }

  handleActionSelect = (actionType) => {
    const { match, location } = this.props;
    const orgId = match.params.uuid;

    if (actionType === 'initiateBGV') {
      let urlFilters = {}; // for filters payload - an object
      const currentUrlParams = new URLSearchParams(location.search);
      if (!_.isEmpty(currentUrlParams.get('gender'))) {
        urlFilters = { ...urlFilters, gender: currentUrlParams.get('gender') };
      }
      if (!_.isEmpty(currentUrlParams.get('entityType'))) {
        urlFilters = { ...urlFilters, entityType: currentUrlParams.get('entityType') };
      }
      if (!_.isEmpty(currentUrlParams.get('isActive'))) {
        urlFilters = { ...urlFilters, isActive: JSON.parse(currentUrlParams.get('isActive')) };
      }
      if (!_.isEmpty(currentUrlParams.get('employeeType'))) {
        urlFilters = { ...urlFilters, employeeType: currentUrlParams.get('employeeType') };
      }
      if (!_.isEmpty(currentUrlParams.get('status'))) {
        urlFilters = { ...urlFilters, status: currentUrlParams.get('status') };
      }
      if (!_.isEmpty(currentUrlParams.get('verificationStatus'))) {
        urlFilters = { ...urlFilters, verificationStatus: currentUrlParams.get('verificationStatus') };
      }
      if (!_.isEmpty(currentUrlParams.get('onboardFrom'))) {
        urlFilters = { ...urlFilters, onboardFrom: currentUrlParams.get('onboardFrom') };
      }
      if (!_.isEmpty(currentUrlParams.get('onboardTo'))) {
        urlFilters = { ...urlFilters, onboardTo: currentUrlParams.get('onboardTo') };
      }
      if (!_.isEmpty(currentUrlParams.get('createdFrom'))) {
        urlFilters = { ...urlFilters, createdFrom: currentUrlParams.get('createdFrom') };
      }
      if (!_.isEmpty(currentUrlParams.get('createdTo'))) {
        urlFilters = { ...urlFilters, createdTo: currentUrlParams.get('createdTo') };
      }
      if (!_.isEmpty(currentUrlParams.get('terminationReason'))) {
        urlFilters = { ...urlFilters, terminationReason: currentUrlParams.get('terminationReason') };
      }
      if (!_.isEmpty(currentUrlParams.get('reportsTo'))) {
        urlFilters = { ...urlFilters, reportsTo: currentUrlParams.get('reportsTo') };
      }
      if (!_.isEmpty(currentUrlParams.get('migrationStatus'))) {
        urlFilters = { ...urlFilters, migrationStatus: currentUrlParams.get('migrationStatus') };
      }
      if (!_.isEmpty(currentUrlParams.get('tagAssigned'))) {
        urlFilters = { ...urlFilters, tagAssigned: JSON.parse(currentUrlParams.get('tagAssigned')) };
      }
      if (!_.isEmpty(currentUrlParams.get('isBasicDetailsFilled'))) {
        urlFilters = { ...urlFilters, isBasicDetailsFilled: JSON.parse(currentUrlParams.get('isBasicDetailsFilled')) };
      }
      if (!_.isEmpty(currentUrlParams.get('isAdditionalDetailsFilled'))) {
        urlFilters = { ...urlFilters, isAdditionalDetailsFilled: JSON.parse(currentUrlParams.get('isAdditionalDetailsFilled')) };
      }
      if (!_.isEmpty(currentUrlParams.get('isEmpDetailsFilled'))) {
        urlFilters = { ...urlFilters, isEmpDetailsFilled: JSON.parse(currentUrlParams.get('isEmpDetailsFilled')) };
      }
      if (!_.isEmpty(currentUrlParams.get('isCompanyDocGenerated'))) {
        urlFilters = { ...urlFilters, isCompanyDocGenerated: JSON.parse(currentUrlParams.get('isCompanyDocGenerated')) };
      }
      if (!_.isEmpty(currentUrlParams.get('isGovDocGenerated'))) {
        urlFilters = { ...urlFilters, isGovDocGenerated: JSON.parse(currentUrlParams.get('isGovDocGenerated')) };
      } // tag type filters below
      if (!_.isEmpty(currentUrlParams.get('function'))) {
        const functionalTags = currentUrlParams.get('function').split(',');
        urlFilters = { ...urlFilters, function: functionalTags };
      }
      if (!_.isEmpty(currentUrlParams.get('location'))) {
        const locTags = currentUrlParams.get('location').split(',');
        urlFilters = { ...urlFilters, location: locTags };
      }
      if (!_.isEmpty(currentUrlParams.get('custom'))) {
        const customTags = currentUrlParams.get('custom').split(',');
        urlFilters = { ...urlFilters, custom: customTags };
      }

      let payload = {};
      if (this.state.selectAll) {
        payload = {
          filters: urlFilters,
        };
      } else {
        payload = {
          empIds: [
            ...this.state.selectedEmployees,
          ],
          filters: urlFilters,
        };
      }
      this.props.onGetInitiateData(orgId, payload);
    }

    if (actionType === 'terminate' && this.state.selectAll) {
      this.props.onGetDeployedCount(orgId);
    }
    this.setState({
      actionType,
    });
  }

  handleInitiate = () => {
    const { match, location, onPostBulkActions } = this.props;
    const orgId = match.params.uuid;
    const { selectAll, selectedEmployees } = this.state;

    let searchParams = new URLSearchParams(location.search.toString());
    searchParams.delete('pageNumber');
    searchParams = searchParams.toString();

    const payload = {
      product: 'BGV',
      data: {
        empIds: [
          ...selectedEmployees,
        ],
      },
    };
    onPostBulkActions(orgId, 'EMPLOYEE_BGV_INITIATE', 'PROCESS_DATA', searchParams, payload, selectAll);
    this.handleActionSelect('');
  }

  handleEmployeeSearch = (event) => {
    this.setState({
      searchKey: event.target.value,
      selectedEmployees: [],
      selectAll: false,
      showSelectAllOption: false,
    });
  }

  // handleCloseSuccessNotification = () => {
  //   this.setState({ showSuccessNotification: null });
  // }

  onFocus = () => {
    this.setState({ onFocusSearch: true });
  }

  onBlur = () => {
    if (this.state.searchKey === '') this.setState({ onFocusSearch: false });
  }

  handleClearSearch = () => {
    this.setState({
      searchKey: '',
      onFocusSearch: false,
      selectedEmployees: [],
      selectAll: false,
      showSelectAllOption: false,
    });
  }

  handleSearchOption = (selectedSearchOption) => {
    this.setState({ searchOption: selectedSearchOption });
  }

  handleSelectAllEmployee = () => {
    if (this.state.selectAll) {
      this.setState({
        selectedEmployees: [],
        selectAll: false,
        showSelectAllOption: false,
      });
    } else {
      this.setState({ selectAll: true });
    }
  }

  handleGetPageSelectStatus = () => {
    const selectedEmp = _.cloneDeep(this.state.selectedEmployees);
    let status = null;
    let count = 0;
    _.forEach(this.props.employeeList, (emp) => {
      if (_.includes(selectedEmp, emp.uuid)) {
        count += 1;
      }
    });
    if (!_.isEmpty(this.props.employeeList)
      && count === this.props.employeeList.length && count !== 0) {
      status = 'all-selected';
    } else if (count > 0) {
      status = 'some-selected';
    }
    return status;
  }

  handleCheckActiveEmp = () => {
    const searchParams = new URLSearchParams(window.location.search.toString());
    if (searchParams.has('isActive') && searchParams.get('isActive') === 'true') {
      return true;
    }
    return false;
  }

  showInactiveTooltip = (value) => {
    this.setState({
      showInactiveTooltip: value,
    });
  }

  showVendor = () => {
    const { enabledServicesData } = this.props;
    let vendorExists = false;
    if (!_.isEmpty(enabledServicesData) && !_.isEmpty(enabledServicesData.platformServices)) {
      enabledServicesData.platformServices.forEach((service) => {
        if (service.platformService === 'VENDOR') vendorExists = true;
      });
    }

    return vendorExists;
  }

  render() {
    const pageSelectStatus = this.handleGetPageSelectStatus();

    let searchResult = false;

    if ((this.state.searchKey.length > 2 && !mobileRegex.test(this.state.searchKey) && this.state.searchOption === 'phone number')
      || (this.state.searchKey.length > 2 && !emailRegex.test(this.state.searchKey) && this.state.searchOption === 'email id')) {
      searchResult = true;
    }

    const { t, match, orgData } = this.props;
    const orgId = match.params.uuid;
    const actionIcon = {
      assignActive,
      assignInactive: assignIcon,
      initiateActive,
      initiateInactive: initiateIcon,
      deployActive,
      deployInactive: deployIcon,
      terminateActive,
      terminateInactive: terminateIcon,
    };

    const searchPlaceholder = `search by ${this.state.searchOption === 'phone number' ? 'phone number'
      : this.state.searchOption === 'email id' ? 'email id'
        : this.state.searchOption === 'document ID' ? 'pan, aadhaar etc'
          : 'employee name, empid etc'}`;
    return (
      <>
        {(this.props.getEmployeeListState === 'LOADING' || this.props.getCountState === 'LOADING'
          || this.props.getProfilePictureState === 'LOADING') && this.state.searchKey === ''
          ? (
            <div className={cx(styles.alignCenter, scrollStyle.scrollbar, 'pt-4')}>
              <TileLoader type="empList" empList />
            </div>
          )
          : (
            <div className={cx(styles.alignCenter, scrollStyle.scrollbar, 'pt-4')}>
              <div>
                <div style={{ width: 'max-content' }}>
                  <ArrowLink
                    label={orgData && orgData.name ? orgData.name.toLowerCase() : ''}
                    url={`/customer-mgmt/org/${orgId}/profile`}
                  />
                </div>

                <div className={cx('col-12 pb-0 pl-0 d-flex row no-gutters justify-content-between')} style={{ paddingRight: '1.2rem' }}>
                  <div
                    className={this.state.onFocusSearch ? cx('col-8 px-0', styles.Focus) : cx('col-8 px-0', styles.NoFocus)}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                  >
                    <img src={search} alt={t('translation_empList:image_alt.search')} className="pr-2" />
                    <input
                      type="text"
                      placeholder={searchPlaceholder}
                      value={this.state.searchKey}
                      className={cx('pl-2', styles.searchBar)}
                      onChange={(event) => this.handleEmployeeSearch(event)}
                    />
                    {this.state.searchKey !== ''
                      ? <img src={close} onClick={this.handleClearSearch} aria-hidden style={{ height: '0.75rem', cursor: 'pointer' }} alt="" />
                      : null}
                  </div>
                  <div className="col-4 px-0 mt-1">
                    <div className="row no-gutters justify-content-end">
                      <label className={cx(styles.SearchBy, 'my-auto')}>{t('translation_empList:searchBy')}</label>
&ensp;&ensp;
                      <CustomDropdown
                        empList
                        options={[{ optionLabel: 'select search type' }, { optionLabel: 'profile details' }, { optionLabel: 'phone number' }, { optionLabel: 'document ID' }, { optionLabel: 'email id' }]}
                        changed={(value) => this.handleSearchOption(value)}
                        className={cx(styles.customWidth)}
                        value={this.state.searchOption}
                      />
                    </div>
                  </div>
                </div>

                {/* // </div>
// <div className="d-flex">
//   <div className="w-100">
//     <span className="row mb-2 pr-4">
//       <ul className="w-100 mt-2">
//         <li className="px-0 mx-0 py-0 my-0 w-100">
//           <div className={cx(styles.actionContent, ' d-flex')}>
//             {!_.isEmpty(this.props.employeeList) && this.props.employeeList.length
//               ? (
//                 <>
//                   <Checkbox
//                     type={pageSelectStatus === 'all-selected' ? 'medium15px' : 'medium15pxline'}
//                     value={pageSelectStatus !== null}
//                     name="selectAll"
//                     onChange={() => this.toggleSelectAll()}
//                     className="ml-3 pt-1 mt-2"
//                   />
//                   <img src={dash} alt={t('translation_empList:image_alt.dash')} className="ml-4" />
//                 </>
//               )
//               : null}
//             {this.state.selectedEmployees.length > 0
//               ? (
//                 <span className="row px-0 mx-0">
//                   <span
//                     className={cx(this.handleCheckActiveEmp() ? null : styles.opacity, 'row px-0 mx-0')}
//                     onMouseEnter={() => this.showInactiveTooltip(true)}
//                     onMouseLeave={() => this.showInactiveTooltip(false)}
//                   > */}
              </div>
              <div className="d-flex">
                <div className="w-100">
                  <span className="row mb-2 pr-4">
                    <ul className="w-100 mt-2">
                      <li className="px-0 mx-0 py-0 my-0 w-100">
                        <div className={cx(styles.actionContent, ' d-flex')}>
                          {!_.isEmpty(this.props.employeeList) && this.props.employeeList.length
                            ? (
                              <>
                                <Checkbox
                                  type={pageSelectStatus === 'all-selected' ? 'medium15px' : 'medium15pxline'}
                                  value={pageSelectStatus !== null}
                                  name="selectAll"
                                  onChange={() => this.toggleSelectAll()}
                                  className="ml-3 pt-1 mt-2"
                                />
                                <img src={dash} alt={t('translation_empList:image_alt.dash')} className={cx(styles.dash, 'my-auto ml-4')} />
                              </>
                            )
                            : null}
                          {this.state.selectedEmployees.length > 0
                            ? (
                              <span className="row px-0 mx-0">
                                <span
                                  className={cx(this.handleCheckActiveEmp() ? null : styles.opacity, 'row px-0 mx-0')}
                                  onMouseEnter={() => this.showInactiveTooltip(true)}
                                  onMouseLeave={() => this.showInactiveTooltip(false)}
                                >
                                  <HasAccess
                                    permission={['EMP_MGMT:ASSIGN']}
                                    orgId={orgId}
                                    yes={() => (
                                      <div
                                        className={cx(this.state.actionType !== 'assign' ? styles.mainDiv : null, this.handleCheckActiveEmp() ? null : styles.pointerEvent)}
                                        onClick={() => this.handleActionSelect('assign')}
                                      >
                                        <div className={this.state.actionType === 'assign' ? styles.ActiveButton : styles.InactiveButton}>
                                          <img
                                            src={this.state.actionType === 'assign' ? actionIcon.assignActive : actionIcon.assignInactive}
                                            alt={t('translation_empList:image_alt.assign')}
                                            className="pr-2"
                                          />
                                          {t('translation_empList:button.assign')}
                                        </div>
                                      </div>
                                    )}
                                  />

                                  {this.showVendor()
                                    ? (
                                  // <HasAccess
                                  //   permission={['EMP_MGMT:DEPLOY']}
                                  //   orgId={orgId}
                                  //   yes={() => (
                                      <div
                                        role="button"
                                        tabIndex={0}
                                        className={cx(this.state.actionType !== 'deploy' ? styles.mainDiv : null, this.handleCheckActiveEmp() ? null : styles.pointerEvent)}
                                        onClick={() => this.handleActionSelect('deploy')}
                                      >
                                        <div className={this.state.actionType === 'deploy' ? styles.ActiveButton : styles.InactiveButton}>
                                          <img
                                            src={this.state.actionType === 'deploy' ? actionIcon.deployActive : actionIcon.deployInactive}
                                            alt={t('translation_empList:image_alt.deploy')}
                                            className="pr-2"
                                          />
                                          {t('translation_empList:button.deploy')}
                                        </div>
                                      </div>
                                  //   )}
                                  // />
                                    )
                                    : null}
                                  {!_.isEmpty(this.props.bgvConfigData) && this.props.bgvConfigData.status === 'done'
                                    ? (
                                      <HasAccess
                                        permission={['BGV:INITIATE']}
                                        orgId={orgId}
                                        yes={() => (
                                          <div
                                            role="button"
                                            tabIndex={0}
                                            className={cx(this.state.actionType !== 'initiateBGV' ? styles.mainDiv : null, this.handleCheckActiveEmp() ? null : styles.pointerEvent)}
                                            onClick={() => this.handleActionSelect('initiateBGV')}
                                          >
                                            <div className={this.state.actionType === 'initiateBGV' ? styles.ActiveButton : styles.InactiveButton}>
                                              <img
                                                src={this.state.actionType === 'initiateBGV' ? actionIcon.initiateActive : actionIcon.initiateInactive}
                                                alt={t('translation_empList:image_alt.initiate')}
                                                className="pr-2"
                                              />
                                              {t('translation_empList:button.initiate')}
                                            </div>
                                          </div>
                                        )}
                                      />
                                    ) : null}
                                  <HasAccess
                                    permission={['EMP_MGMT:TERMINATE']}
                                    orgId={orgId}
                                    yes={() => (
                                      <div
                                        role="button"
                                        tabIndex={0}
                                        className={cx(this.state.actionType !== 'terminate' ? styles.mainDivTerminate : null, this.handleCheckActiveEmp() ? null : styles.pointerEvent)}
                                        onClick={() => this.handleActionSelect('terminate')}
                                      >
                                        <div className={this.state.actionType === 'terminate' ? styles.ActiveTermiButton : styles.InactiveTermiButton}>
                                          <img
                                            src={this.state.actionType === 'terminate' ? actionIcon.terminateActive : actionIcon.terminateInactive}
                                            alt={t('translation_empList:image_alt.terminate')}
                                            className="pr-2"
                                          />
                                          {t('translation_empList:button.terminate')}
                                        </div>
                                      </div>
                                    )}
                                  />

                                </span>
                                <HasAccess
                                  permission={['EMP_MGMT:EXCEL_DOWNLOAD', 'BGV:DOWNLOAD_REPORT']}
                                  orgId={orgId}
                                  yes={() => (
                                    <div className={this.state.actionType !== 'downloads' ? styles.mainDiv : null}>
                                      <div
                                        role="button"
                                        tabIndex={0}
                                        className={this.state.actionType === 'downloads' ? styles.ActiveButton : styles.InactiveButton}
                                        onClick={() => this.handleActionSelect('downloads')}
                                      >
                                        <img
                                          className={this.state.actionType === 'downloads' ? cx('pr-2', styles.svg) : 'pr-2'}
                                          src={download}
                                          alt={t('translation_empList:image_alt.downloads')}
                                        />
                                        {t('translation_empList:button.downloads')}
                                      </div>
                                    </div>
                                  )}
                                />
                              </span>
                            ) : <span className="py-3" /> }
                          <div className="ml-auto d-flex">
                            {/* ------------pagination area------------ */}
                            {this.props.dataCount > this.state.pageSize && this.props.getCountState === 'SUCCESS'
                              ? (
                                <Paginator
                                  dataCount={this.props.dataCount}
                                  pageSize={this.state.pageSize}
                                  baseUrl={`/customer-mgmt/org/${orgId}/employee`}
                                />
                              )
                              : null}

                            <img src={dash} alt={t('translation_empList:image_alt.dash')} className={cx(styles.dash, 'my-auto mr-2')} />
                            <HasAccess
                              permission={['NOTIFICATIONS:VIEW']}
                              orgId={orgId}
                              yes={() => (
                                <NotificationIcon
                                  showNotifications={this.state.showNotifications}
                                  orgId={orgId}
                                  handleShowHideNotifications={
                                    (showNotifications) => this.setState({ showNotifications })
                                  }
                                  alignProgress={styles.alignProgress}
                                />
                              )}
                            />
                          </div>
                        </div>
                      </li>
                    </ul>
                    {this.state.showNotifications || this.state.showFilter
                      ? null : <hr className={cx(styles.hr1)} />}
                    {this.state.showNotifications
                      ? (
                        <div className={styles.width} style={{ contain: 'layout', zIndex: 99 }}>
                          <Notifications
                            showNotifications={this.state.showNotifications}
                            orgId={orgId}
                            style={{ width: 'inherit' }}
                          />
                        </div>
                      ) : null}
                  </span>
                  {this.state.showInactiveTooltip && !this.handleCheckActiveEmp()
                    ? (
                      <div style={{ position: 'relative' }}>
                        <div className={styles.inactiveTooltip}>
                          {t('translation_empList:allowedActions')}
                          {' '}
                          <br />
                          {t('translation_empList:selectActive')}
                        </div>
                      </div>
                    )
                    : null}

                  {this.state.selectedEmployees.length > 0
                    ? (
                      <div className={cx(styles.selectAllBar, 'w-94')}>
                        {this.state.showSelectAllOption
                          ? this.state.selectAll
                            ? (
                              <>
                                <span className={styles.selectEmpText}>
                                  {this.props.dataCount > maxSelectionAllowed ? null : t('translation_empList:all')}
                                  <span className={styles.BoldTextSmall}>
                                    {this.props.dataCount > maxSelectionAllowed
                                      ? maxSelectionAllowed : this.props.dataCount}
                                  </span>
                                &nbsp;
                                  {t('translation_empList:empSelected')}
                                &nbsp;
                                </span>
                                <span
                                  role="button"
                                  tabIndex={0}
                                  className={styles.selectAllEmp}
                                  onClick={() => this.handleSelectAllEmployee()}
                                >
                                  {t('translation_empList:clearSelection')}
                                </span>
                              </>
                            )
                            : this.props.dataCount > maxSelectionAllowed
                              ? (
                                <>
                                  <span className={styles.selectEmpText}>
                                    <span className={styles.BoldTextSmall}>
                                      {this.state.selectedEmployees.length}
                                    </span>
                                    {' '}
                                    {t('translation_empList:empAreSelected')}
                                  </span>
                                  <span role="button" tabIndex={0} className={styles.selectAllEmp} onClick={() => this.handleSelectAllEmployee()}>
                                    {t('translation_empList:select')}
                                    {' '}
                                    <span className={styles.BoldTextSmall}>
                                      {maxSelectionAllowed}
                                    </span>
                                    {t('translation_empList:maxLimit')}
                                    <span className={styles.BoldTextSmall}>
                                      &nbsp;
                                      {this.props.dataCount}
                                    </span>
                                    &nbsp;
                                    {t('translation_empList:empFromList')}
                                  </span>
                                </>
                              )
                              : (
                                <>
                                  <span className={styles.selectEmpText}>
                                    <span className={styles.BoldTextSmall}>
                                      {this.state.selectedEmployees.length}
                                    </span>
                                    {' '}
                                    {t('translation_empList:empAreSelected')}
                                  </span>
                                  <span role="button" tabIndex={0} className={styles.selectAllEmp} onClick={() => this.handleSelectAllEmployee()}>
                                    {`${t('translation_empList:select')} ${t('translation_empList:all')}`}
                                    <span className={styles.BoldTextSmall}>
                                      {this.props.dataCount}
                                    </span>
                                    {' '}
                                    {t('translation_empList:empFromList')}
                                  </span>
                                </>
                              )
                          : (
                            <>
                              <span className={styles.selectEmpText}>
                                <span className={styles.BoldTextSmall}>
                                  {this.state.selectedEmployees.length}
                                </span>
                                {' '}
                                {t('translation_empList:emps')}
                              </span>
                            </>
                          )}
                      </div>
                    )
                    : null}

                  <div className={cx('row mt-2 pl-3 pb-2 mr-0')}>

                    {
                      (!_.isEmpty(this.state.searchKey) && _.isEmpty(this.props.employeeList))
                        || searchResult
                        ? (
                          <div className={cx('ml-auto mr-auto', styles.NoResultPage)}>
                            <span className={styles.NoResultLine1}>
                              {t('translation_empList:noResult')}
                              <span className={styles.BoldText}>
                                {`${this.state.searchOption} '${this.state.searchKey}'.`}
                              </span>
                              {' '}
                              {t('translation_empList:search')}
                            </span>
                            <br />
                            {!_.isEmpty(this.props.staticDataEmpListSearch)
                              ? this.props.staticDataEmpListSearch.map((item) => {
                                if (item.label !== this.state.searchOption) {
                                  return (
                                    <span key={item.label} role="button" tabIndex={0} className={styles.NoResultLine2} onClick={() => this.handleSearchOption(item.label)}>
                                      {item.label}
                                      ,&nbsp;
                                    </span>
                                  );
                                }
                                return null;
                              }) : null}
                            <br />
                            <img src={noresult} alt="" />
                          </div>
                        )
                        : (
                          <>
                            {!_.isEmpty(this.props.employeeList)
                              ? this.props.employeeList.map((employee) => {
                                const employeeUrl = `/customer-mgmt/org/${orgId}/employee/${employee.uuid}/profile`;
                                let role = null;
                                if (!_.isEmpty(this.props.tagList)) {
                                  _.forEach(this.props.tagList, (tag) => {
                                    if (tag.uuid === employee.defaultRole) {
                                      role = tag.name;
                                    }
                                  });
                                }
                                const deployedTo = [];
                                if (!_.isEmpty(employee.deployedTo)) {
                                  _.forEach(employee.deployedTo, (dep) => {
                                    deployedTo.push(dep);
                                  });
                                }
                                return (
                                  <EmployeeCard
                                    key={employee.uuid}
                                    id={employee.uuid}
                                    empId={employee.uuid}
                                    index={employee.uuid}
                                    profilePicUrl={employee.profilePicUrl}
                                    url={employeeUrl}
                                    isActive={employee.isActive}
                                    handleSelectedEmployees={
                                      () => this.handleSelectEmployee(employee.uuid)
                                    }
                                    value={_.includes(this.state.selectedEmployees, employee.uuid)}
                                    name={employee.firstName + (!_.isEmpty(employee.lastName) ? ` ${employee.lastName}` : '')}
                                    employeeId={employee.employeeId}
                                    serviceStatus={employee.bgv}
                                    tag={role || null}
                                    orgName="--"
                                    deployedTo={!_.isEmpty(deployedTo) ? deployedTo : []}
                                    sourceOrg={!_.isEmpty(employee.source_org_name) ? `${employee.source_org_name}` : ''}
                                    originOrg={!_.isEmpty(employee.origin_org_name) ? `${employee.origin_org_name}` : ''}
                                    deplength={!_.isEmpty(employee.deployedTo) ? `${employee.deployedTo.length}` : ''}
                                  />
                                );
                              })
                              : (
                                <div className={cx('ml-auto mr-auto', styles.emptyFilterPage)}>
                                  <div className={styles.NoResultLine1}>
                                    {t('translation_empList:filterCriteria')}
                                    <br />
                                    {t('translation_empList:changeFilter')}
                                  </div>
                                  <div className="mt-5">
                                    <img src={emptyFilter} alt="filter" />
                                  </div>
                                </div>
                              )}
                          </>
                        )
                    }
                  </div>
                </div>
              </div>
            </div>
          )}
        {
          // eslint-disable-next-line consistent-return
          (() => {
            if (this.state.actionType === 'assign') {
              return (
                <EmpListFooter
                  closeFooter={() => this.handleActionSelect('')}
                  actionType={this.state.actionType}
                  selectAll={this.state.selectAll}
                  selectedEmployees={this.state.selectedEmployees}
                  totalEmployeeCount={
                    this.props.dataCount > maxSelectionAllowed
                      ? maxSelectionAllowed : this.props.dataCount
                  }
                />
              );
            }
            if (this.state.actionType === 'terminate') {
              return (
                <TerminationCard
                  toggle={() => this.handleActionSelect('')}
                  selectedEmployees={this.state.selectedEmployees}
                  deployedEmpCount={this.state.selectAll
                    ? (!_.isEmpty(this.props.deployedEmpCount)
                      ? this.props.deployedEmpCount.count : null) : null}
                  employeeList={this.props.employeeList}
                  selectAll={this.state.selectAll}
                  bulkAction
                  totalEmployeeCount={
                    this.props.dataCount > maxSelectionAllowed
                      ? maxSelectionAllowed : this.props.dataCount
                  }
                />
              );
            }
            if (this.state.actionType === 'downloads') {
              return (
                <EmpExcelDownloadModal
                  toggle={() => this.handleActionSelect('')}
                  selectedEmployees={this.state.selectedEmployees}
                  employeeList={this.props.employeeList}
                  orgName={orgData && orgData.name ? orgData.name.toLowerCase() : ''}
                  selectAll={this.state.selectAll}
                  totalEmployeeCount={
                    this.props.dataCount > maxSelectionAllowed
                      ? maxSelectionAllowed : this.props.dataCount
                  }
                />
              );
            }
            if (this.state.actionType === 'deploy') {
              return (
                <DeployModal
                  toggle={() => this.handleActionSelect('')}
                  selectedEmployees={this.state.selectedEmployees}
                  employeeList={this.props.employeeList}
                  orgName={!_.isEmpty(orgData) && orgData.name ? orgData.name.toLowerCase() : ''}
                  orgDetails={orgData}
                  selectAll={this.state.selectAll}
                  totalEmployeeCount={
                    this.props.dataCount > maxSelectionAllowed
                      ? maxSelectionAllowed : this.props.dataCount
                  }
                />
              );
            }
            if (this.state.actionType === 'initiateBGV') {
              return (
                <BgvInitiateModal
                  toggle={() => this.handleActionSelect('')}
                  selectedEmployees={this.state.selectedEmployees}
                  employeeList={this.props.employeeList}
                  selectAll={this.state.selectAll}
                  totalEmployeeCount={this.props.dataCount > maxSelectionAllowed
                    ? maxSelectionAllowed : this.props.dataCount}
                  handleBGVInitiate={this.handleInitiate}
                />
              );
            }
          })()
        }

      </>
    );
  }
}

const mapStateToProps = (state) => ({
  getCountState: state.empMgmt.empList.getCountState,
  dataCount: state.empMgmt.empList.dataCount,
  orgData: state.empMgmt.staticData.orgData,
  showModal: state.empMgmt.empAddNew.showModal,
  idNo: state.empMgmt.empAddNew.idNo,
  idState: state.empMgmt.empAddNew.cardtype,
  idImage: state.empMgmt.empAddNew.idImage,
  employeeList: state.empMgmt.empList.employeeList,
  getEmployeeListState: state.empMgmt.empList.getEmployeeListState,
  getProfilePictureState: state.imageStore.getProfilePictureState,
  staticDataEmpListSearch: state.empMgmt.staticData.empMgmtStaticData.EMP_LIST_SEARCH,
  tagInfoState: state.empMgmt.empList.getTagInfoState,
  tagList: state.empMgmt.empList.tagList,
  bgvConfigData: state.empMgmt.staticData.bgvConfigData,
  enabledServicesData: state.empMgmt.staticData.servicesEnabled,
  filterPayload: state.empMgmt.empList.filterPayload,
  deployedEmpCount: state.empMgmt.empList.deployedEmpCount,
  deployedEmpCountState: state.empMgmt.empList.deployedEmpCountState,
});

const mapDispatchToProps = (dispatch) => ({
  initEmployeeList: () => dispatch(actions.initState()),
  onGetEmployeeList: (targetUrl, pageSize, orgId) => dispatch(
    actions.getEmployeeList(targetUrl, pageSize, orgId),
  ),
  onGetPaginationCount: (targetUrl, orgId) => dispatch(
    actions.getListPaginationCount(targetUrl, orgId),
  ),
  onSearchEmployee: (targetUrl, key, pageSize, orgId, type) => dispatch(
    actions.searchEmployee(targetUrl, key, pageSize, orgId, type),
  ),
  onSearchDataCount: (targetUrl, key, orgId, category) => dispatch(
    actions.searchDataCount(targetUrl, key, orgId, category),
  ),
  onGetTagInfo: (tags) => dispatch(actions.getTagInfo(tags)),
  onPostBulkActions: (orgId, action, reqType, query, payload, selectAll) => dispatch(
    actions.employeeBulkActions(orgId, action, reqType, query, payload, selectAll),
  ),
  onGetEmpListCountByFilters: (targetUrl, orgId, payload) => dispatch(
    actions.getListPaginationCountByVendorFilters(targetUrl, orgId, payload),
  ),
  onGetEmpListByFilters: (targetUrl, pageSize, orgId, payload) => dispatch(
    actions.getEmployeeListByVendorFilters(targetUrl, pageSize, orgId, payload),
  ),
  onGetInitiateData: (orgId, payload) => dispatch(actions.getInitiateData(orgId, payload)),
  onGetDeployedCount: (orgId) => dispatch(actions.getDeployedCount(orgId)),
});

export default withTranslation()(withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EmployeeList),
));
