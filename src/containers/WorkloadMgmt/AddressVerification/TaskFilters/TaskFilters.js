import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import _ from 'lodash';
import cx from 'classnames';
import styles from './TaskFilters.module.scss';
import ClickAwayListener from 'react-click-away-listener';

import { assignStatusData, initFilterState } from './StaticFilterData';
import Loader from '../../../../components/Organism/Loader/Loader';
import Dropdown from "../../../../components/Atom/Dropdown/Dropdown";
import { Button } from 'react-crux';
import CancelButton from "../../../../components/Molecule/CancelButton/CancelButton";
import TaskCount from "./TaskCount/TaskCount";
import Checkbox from "../../../../components/Atom/CheckBox/CheckBox";
import scrollStyle from '../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import DateRangeModal from '../../../../components/Molecule/DateRangeModal/DateRangeModal';
import SearchWithOptions from "./SearchWithOptions/SearchWithOptions";
import HasAccess from '../../../../services/HasAccess/HasAccess';

import * as taskListActions from '../TaskList/Store/action';
import * as addressActions from '../Store/action';

import close from '../../../../assets/icons/closeNotification.svg';
import arrowDown from '../../../../assets/icons/greyDropdown.svg';
import arrowUp from '../../../../assets/icons/dropdownArrow.svg';
import reset from '../../../../assets/icons/resetBlue.svg';
import search from '../../../../assets/icons/search.svg';

class TaskFilters extends Component {

    state = {
        caseStatus: 'select case status',
        dateRange: 'select date range',
        dateRangeDropdownValues: [],
        agency: { label: 'unassigned', value: 'UNASSIGNED' },
        filters: { ...initFilterState },
        defaultClientData: null,
        filterCount: 1,
        showMoreFilters: false,
        showPincodeList: false,
        toggleDateRange: false,
        payload: {},
        cancelFilters: { ...initFilterState },
        cancelFilterCount: 1,
        cancelDateRange: 'last month'
    }

    componentDidMount = () => {

        let targetUrl = this.props.location.search;
        const baseUrl = this.props.location.pathname;

        const { match } = this.props;
        this.props.onGetClientStaticData(match.params.cardType);

        if (_.isEmpty(targetUrl)) {
            targetUrl += "?dateRange=LAST_MONTH";
            this.props.history.push(baseUrl + targetUrl);
        }
        else { //target url has data
            if (!targetUrl.includes("dateRange")) {
                targetUrl += "&dateRange=LAST_MONTH";
                this.props.history.push(baseUrl + targetUrl);
            }
        }
    }

    componentDidUpdate = (prevProps) => {

        //to get url data after refresh
        if (prevProps.getStaticDataState !== this.props.getStaticDataState && this.props.getStaticDataState === "SUCCESS") {
            let { dateRange, caseStatus, filters, filterCount, showMoreFilters, dateRangeDropdownValues } = _.cloneDeep(this.state);
            let currentUrlParams = new URLSearchParams(window.location.search);

            dateRangeDropdownValues = !_.isEmpty(this.props.WORKLOAD_MGMT_AGENCY_CASE_DATE_RANGE) ?
                _.cloneDeep(this.props.WORKLOAD_MGMT_AGENCY_CASE_DATE_RANGE) : [];

            if (!_.isEmpty(currentUrlParams.get('dateRange'))) {
                if (currentUrlParams.get('dateRange').includes('.')) {
                    dateRange = currentUrlParams.get('dateRange');
                    //changing dropdown value to the date from url
                    if (!_.isEmpty(dateRangeDropdownValues)) {
                        dateRangeDropdownValues.forEach(function (ele) {
                            if (ele.value === 'CUSTOM') { ele.label = currentUrlParams.get('dateRange'); }
                        });
                    }
                }
                else {
                    dateRange = !_.isEmpty(dateRangeDropdownValues)
                        ? dateRangeDropdownValues.find(ele => {
                            return ele.value === currentUrlParams.get('dateRange');
                        }).label
                        : "";
                }
            }
            if (!_.isEmpty(currentUrlParams.get('caseStatus'))) {
                let caseStatusOptions = [];
                caseStatusOptions =
                    this.props.cardType === 'postal' && !_.isEmpty(this.props.staticData) ? this.props.staticData.WORKLOAD_MGMT_POSTAL_STATUS
                        : this.props.cardType === 'physical' && !_.isEmpty(this.props.staticData) 
                            ? caseStatusOptions.concat(this.props.staticData.WORKLOAD_MGMT_PHYSICAL_VERIFIER_STATUS, 
                                this.props.staticData.WORKLOAD_MGMT_PHYSICAL_OPS_STATUS,
                                this.props.staticData.WORKLOAD_MGMT_PHYSICAL_UNASSIGNED_STATUS)
                            : []

                caseStatus = !_.isEmpty(this.props.staticData) ?
                    caseStatusOptions.find(ele => {
                        return ele.value === currentUrlParams.get('caseStatus')
                    }).label : "";
            }

            if (!_.isEmpty(currentUrlParams.get('state'))) {
                this.props.onGetDistrictStaticData(currentUrlParams.get('state'));
            }
            if (!_.isEmpty(currentUrlParams.get('district'))) {
                this.props.onGetCityStaticData(currentUrlParams.get('district'));
            }

            let optionMapping = {
                state: this.props.WORKLOAD_MGMT_AGENCY_STATE,
                district: this.props.WORKLOAD_MGMT_AGENCY_DISTRICT,
                city: this.props.WORKLOAD_MGMT_AGENCY_CITY,
                // pincodeList: this.props.WORKLOAD_MGMT_AGENCY_PINCODE,
                tatLeft: this.props.WORKLOAD_MGMT_AGENCY_TAT_LEFT,
                client: this.props.clientStaticData
            }
            Object.keys(filters).forEach(key => {
                if (key === 'caseAssignee' && !_.isEmpty(currentUrlParams.get('caseAssignee'))) {
                }
                else {
                    if (!_.isEmpty(currentUrlParams.get(key)) && !_.isEmpty(optionMapping[key])) {
                        let filterArray = optionMapping[key].filter(ele => {
                            return (ele.value.toString(2) === currentUrlParams.get(key))
                        })

                        if (!_.isEmpty(filterArray[0])) {
                            filters[key] = filterArray[0];
                        }
                        filterCount += 1;
                    }
                }
            });
            this.setState({
                caseStatus: caseStatus,
                dateRange: dateRange,
                filters: filters,
                filterCount: filterCount,
                showMoreFilters: filterCount > 1 ? true : showMoreFilters,
                dateRangeDropdownValues: dateRangeDropdownValues
            })
        }

        //agency static data
        if (prevProps.agencyListState !== this.props.agencyListState && this.props.agencyListState === "SUCCESS" && !_.isEmpty(this.props.agencyList)) {
            let { agency } = _.cloneDeep(this.state);
            let currentUrlParams = new URLSearchParams(window.location.search);

            if (!_.isEmpty(currentUrlParams.get('agency'))) {
                agency = this.props.agencyList.find(ele => {
                    return ele.value === currentUrlParams.get('agency')
                })
            }
            this.setState({ agency: agency })
        }

        //client static data
        if (prevProps.clientStaticState !== this.props.clientStaticState && this.props.clientStaticState === "SUCCESS" && _.isEmpty(this.state.defaultClientData)) {
            let clientData = this.props.clientStaticData;
            this.setState({ defaultClientData: clientData })
        }
    }

    handleSelectedValue = (option, inputIdentifier) => {

        let { dateRange, caseStatus, agency, filterCount } = this.state;
        let updatedFilters = _.cloneDeep(this.state.filters);

        if (inputIdentifier === 'caseStatus') {
            caseStatus = option.label;
            this.handleUrlChange(inputIdentifier, option.value);
        }
        else if (inputIdentifier === 'dateRange') {
            if (option.value === 'CUSTOM') {
                this.toggleDateRange();
            }
            else {
                dateRange = option.label;
            }
        }
        else if (inputIdentifier === 'agency') {
            agency = option;
            this.handleUrlChange(inputIdentifier, option.value);
        }
        else {
            let oldData = updatedFilters[inputIdentifier];
            if (!_.isEmpty(option.label)) {
                if (initFilterState[inputIdentifier].label === oldData.label) {
                    if (inputIdentifier === 'state') {
                        filterCount = filterCount + 2;
                    } else filterCount++;
                }

                else {
                    if (inputIdentifier === 'state') {
                        if (initFilterState['district'].label !== updatedFilters['district'].label) {
                            filterCount--;
                        }
                        if (initFilterState['city'].label !== updatedFilters['city'].label) {
                            filterCount--;
                        }
                    }
                    if (inputIdentifier === 'district') {
                        if (initFilterState['city'].label !== updatedFilters['city'].label) {
                            filterCount--;
                        }
                    }
                }
            }


            updatedFilters[inputIdentifier] = option;
            updatedFilters[inputIdentifier].value = option.value;

            if (inputIdentifier === 'state') {
                updatedFilters['district'] = initFilterState['district'];
                updatedFilters['city'] = initFilterState['city'];
                if (!updatedFilters.allPincodes) this.props.onGetPincodes(option.value);
                this.props.onGetDistrictStaticData(option.value);
            }
            else if (inputIdentifier === 'district') {
                updatedFilters['city'] = initFilterState['city'];
                this.props.onGetCityStaticData(this.state.filters.state.value, option.value);
            }
        }
        this.setState({
            caseStatus: caseStatus,
            dateRange: dateRange,
            agency: agency,
            filters: updatedFilters,
            filterCount: filterCount
        })
    }

    toggleFilterDropdown = () => {
        this.setState({ showMoreFilters: !this.state.showMoreFilters });
    }

    handleCancelFilters = () => {
        let cancelFilters = _.cloneDeep(this.state.cancelFilters);
        let cancelFilterCount = this.state.cancelFilterCount;
        let cancelDateRange = this.state.cancelDateRange;
        this.setState({
            showMoreFilters: false,
            filters: cancelFilters,
            filterCount: cancelFilterCount,
            dateRange: cancelDateRange
        });
    }

    handleApply = () => {
        let search = "", dateRangeVal = "";
        let baseUrl = this.props.location.pathname;
        let { dateRange, payload, filters, filterCount, dateRangeDropdownValues } = this.state;
        let currentUrlParams = new URLSearchParams(this.props.location.search.slice(1));

        if (!_.isEmpty(currentUrlParams.get('dateRange'))) {
            if (dateRange.includes('-')) {
                dateRangeVal = dateRange;
                dateRangeDropdownValues.forEach(function (ele) {
                    if (ele.value === 'CUSTOM') { ele.label = dateRange; }
                });
            }
            else {
                dateRangeVal = !_.isEmpty(dateRangeDropdownValues) ?
                    dateRangeDropdownValues.find(ele => {
                        return ele.label === dateRange
                    }).value
                    : "";
                //custom label = "custom date range" if any other val is selected
                dateRangeDropdownValues = _.cloneDeep(this.props.WORKLOAD_MGMT_AGENCY_CASE_DATE_RANGE);
                // dateRangeDropdownValues.forEach(function (ele) {
                //     if (ele.value === 'CUSTOM') { ele.label = "custom date range"; }
                // });
            }
            search += "?dateRange=" + dateRangeVal;
        }
        if (!_.isEmpty(currentUrlParams.get('caseStatus'))) {
            search += "&caseStatus=" + currentUrlParams.get('caseStatus');
        }
        if (!_.isEmpty(currentUrlParams.get('agency'))) {
            search += "&agency=" + currentUrlParams.get('agency');
        }

        Object.entries(filters).forEach(k => {
            if (k[0] === 'pincodeList') {
                if (!_.isEmpty(k[1])) {
                    payload = { "pincode": k[1] }
                }
                else {
                    payload = {}
                }
            }
            else if (initFilterState[k[0]] && initFilterState[k[0]].label && initFilterState[k[0]].label !== k[1].label) {
                if (!_.isEmpty(k[1].value)) {
                    search += "&" + k[0] + "=" + k[1].value;
                }
            }
        })
        this.props.history.push(baseUrl + search);
        this.setState({
            showMoreFilters: false,
            payload: payload,
            dateRangeDropdownValues: dateRangeDropdownValues,
            cancelFilters: filters,
            cancelFilterCount: filterCount,
            cancelDateRange: dateRange
        })
        this.props.handleShowFilteredResults(payload);
    }

    handleUrlChange = (inputIdentifier, value) => {
        let url = this.props.location.search;
        let baseUrl = this.props.location.pathname + '?';
        if (_.isEmpty(url)) {
            url += inputIdentifier + "=" + value;
            return url;
        }
        else {
            let currentUrlParams = new URLSearchParams(this.props.location.search.slice(1));
            if (inputIdentifier === 'caseStatus' && value === null) {
                currentUrlParams.delete('caseStatus');
                if (url.includes('pageNumber')) { //removing pageNumber from url
                    currentUrlParams.delete('pageNumber');
                }
            }
            else {
                if (url.includes('pageNumber')) { //removing pageNumber from url
                    currentUrlParams.delete('pageNumber');
                }
                currentUrlParams.set(inputIdentifier, value); //add new filter to url
            }
            this.props.history.push(baseUrl + currentUrlParams);
        }
    }

    handleResetFilters = () => {
        let filters = _.cloneDeep(initFilterState);
        let initDropdownValues = _.cloneDeep(this.state.dateRangeDropdownValues);//_.cloneDeep(this.props.WORKLOAD_MGMT_AGENCY_CASE_DATE_RANGE);

        if (this.state.dateRange.includes("-")) {
            initDropdownValues = _.cloneDeep(this.props.WORKLOAD_MGMT_AGENCY_CASE_DATE_RANGE)
            // initDropdownValues.forEach(function (ele) {
            //     if (ele.value === 'CUSTOM') { ele.label = "custom date range"; }
            // });
        }

        let currentUrlParams = new URLSearchParams(window.location.search);
        let baseUrl = this.props.location.pathname;
        let payload = {}, agency = { label: "unassigned", value: "UNASSIGNED" };

        if (!_.isEmpty(currentUrlParams.get('dateRange'))) {
            baseUrl += '?dateRange=LAST_MONTH';
        }
        this.props.history.push(baseUrl);
        this.setState({
            filterCount: 1,
            filters: filters,
            agency: agency,
            dateRangeDropdownValues: initDropdownValues,
            caseStatus: 'select case status',
            dateRange: 'last month',
            payload: payload
        });
        //calling this function to reset payload: {}
        this.props.handleShowFilteredResults(payload);
    }

    togglePincodeCheckBox = () => {
        let updatedFilters = { ...this.state.filters };
        updatedFilters['allPincodes'] = !updatedFilters['allPincodes'];
        updatedFilters['pincodeList'] = [];

        let count = this.state.filterCount;
        count = updatedFilters['allPincodes']
            ? _.isEmpty(updatedFilters['pincodeList']) ? count + 1 : count
            : _.isEmpty(updatedFilters['pincodeList']) ? count - 1 : count

        //check if pincode api for respective state has already been called
        let isPincodeCalled = false;
        if (this.state.filters.state && this.props.pincodeStaticDataState === 'SUCCESS' && !_.isEmpty(this.props.WORKLOAD_MGMT_AGENCY_PINCODE)) {
            if (this.state.filters.state.value === this.props.WORKLOAD_MGMT_AGENCY_PINCODE[0].state) {
                isPincodeCalled = true;
            }
            else {
                isPincodeCalled = false;
            }
        }
        if (!updatedFilters['allPincodes'] && !isPincodeCalled) {
            this.props.onGetPincodes(this.state.filters.state.value); //calling pincode data only if unchecked
        }
        this.setState({ filters: updatedFilters, filterCount: count });
    }

    handlePincodeList = (event, inputIdentifier) => {
        let updatedFilters = _.cloneDeep(this.state.filters);
        updatedFilters[inputIdentifier] = event.target.value;
        this.setState({ filters: updatedFilters, showPincodeList: true });
    }

    handlePincodeListAction = (value, action) => {
        let updatedFilters = this.state.filters;
        let filterCount = _.cloneDeep(this.state.filterCount);

        let updatedPincodes = updatedFilters.pincodeList;

        if (action === 'delete') {
            updatedPincodes = updatedPincodes.filter(pin => pin !== value);
            if (_.isEmpty(updatedPincodes)) filterCount--;
        }
        else if (action === 'add') {
            if (!_.includes(updatedPincodes, value)) {
                updatedPincodes.push(value);
            }
            if (updatedPincodes.length === 1) filterCount++;
        }
        updatedFilters['pincodeList'] = updatedPincodes;
        updatedFilters['pincodeSearch'] = '';

        this.setState({ filters: updatedFilters, showPincodeList: false, filterCount: filterCount });
    }

    handleClickAway = () => {
        this.setState({ showPincodeList: false })
    }

    getCustomDate = (value) => {
        let fromDate = value.from.split("-").reverse().join(".")
        let toDate = value.to.split("-").reverse().join(".")
        let dateRange = fromDate + "-" + toDate;
        this.setState({ dateRange: dateRange });
    }

    toggleDateRange = (event) => {
        if (event) event.preventDefault();
        this.setState({ toggleDateRange: !this.state.toggleDateRange })
    }

    handleAssignData = (data) => {
        let filterCount = _.cloneDeep(this.state.filterCount);
        let updatedFilters = this.state.filters;

        let assignee = data.label ? data.label : data.firstName + " " + data.lastName;
        let assigneeEmpId = data.empId && data.empId !== '*' ? data.empId : data.value;

        if (updatedFilters['caseAssignee'].label === initFilterState['caseAssignee'].label)
            filterCount++;

        updatedFilters['caseAssignee'] = { label: assignee, value: assigneeEmpId }
        this.setState({ filters: updatedFilters, filterCount: filterCount });
        this.handleUrlChange('caseAssignee', assigneeEmpId);
    }

    handleClientData = (data) => {
        let filterCount = _.cloneDeep(this.state.filterCount);
        let updatedFilters = this.state.filters;
        let client = data.label;
        let clientOrgId = data.value;
        if (updatedFilters['client'].label === initFilterState['client'].label)
            filterCount++;
        updatedFilters['client'] = { label: client, value: clientOrgId };
        this.setState({ filters: updatedFilters, filterCount: filterCount });
    }

    handleAssignSearch = (key) => {
        this.props.onSearchExecutive(key);
    }

    searchFilter = (key) => {
        let query = key;
        let clientData = _.cloneDeep(this.props.clientStaticData)

        let searchArray = clientData.filter(obj =>
            !_.isEmpty(obj.label) && _.includes(obj.label.toLowerCase(), query.toLowerCase()) ?
                true : false
        )
        return searchArray;
    }

    handleClientSearch = (key) => {
        let resultArray = this.searchFilter(key);
        return resultArray;
    }

    handleFilteredPincodes() {
        let totalPincodes = _.cloneDeep(this.props.WORKLOAD_MGMT_AGENCY_PINCODE);
        let filteredPincodes = totalPincodes.filter(pincode => {
            return pincode.label.includes(this.state.filters.pincodeSearch)
        })
        return filteredPincodes;
    }

    render() {
        const { t } = this.props;

        let caseStatusOptions = [];
        const thisRef = this;

        //case status static data based on cardType and permissions
        if (this.props.cardType === 'postal') {
            caseStatusOptions = this.props.staticData.WORKLOAD_MGMT_POSTAL_STATUS;
        }
        else if (this.props.cardType === 'physical') {
            _.forEach(this.props.policies, function (policy) {
                if (_.includes(policy.businessFunctions, "PHYSICAL_ADDRESS:CLOSE")
                    || _.includes(policy.businessFunctions, "PHYSICAL_ADDRESS:LIST")
                    || _.includes(policy.businessFunctions, "*")) {
                    if(thisRef.state.agency.label === "unassigned"){
                        caseStatusOptions = thisRef.props.staticData.WORKLOAD_MGMT_PHYSICAL_UNASSIGNED_STATUS;
                    } else {
                        caseStatusOptions = thisRef.props.staticData.WORKLOAD_MGMT_PHYSICAL_OPS_STATUS;
                    }
                }
                else if (_.includes(policy.businessFunctions, "AGENCY_DASHBOARD:VIEW_ASSIGNED")
                    || _.includes(policy.businessFunctions, "AGENCY_DASHBOARD:VIEW_ALL")) {
                    caseStatusOptions = thisRef.props.staticData.WORKLOAD_MGMT_PHYSICAL_VERIFIER_STATUS;
                }
            });
        }

        return (
            <React.Fragment>
                <div className={cx(styles.Card)} disabled={this.props.disabled}>
                    <div className={'row no-gutters'}>
                        <div className='col-8 px-0'>
                            <div className='row no-gutters mt-1'>

                                {this.props.cardType === 'physical' ?
                                    <HasAccess denySuperAdminAccess
                                        permission={["AGENCY_DASHBOARD:VIEW_ALL"]}
                                        yes={() => (
                                            <div className='col-6 pr-3'>
                                                <div className=''>
                                                    <label className={cx(styles.DropdownLabel, 'row no-gutters mb-2')}>{t('translation_addressVerification:taskFilters.caseAssignee')}</label>
                                                    <SearchWithOptions
                                                        defaultOptions={assignStatusData}
                                                        value={this.state.filters.caseAssignee.label}
                                                        selectedAssignData={(value) => this.handleAssignData(value)}
                                                        searchExecutive={(key) => this.handleAssignSearch(key)}
                                                        searchExecutiveResults={this.props.searchExecutiveResults}
                                                        type="assign"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    />
                                    : null}
                                {this.props.cardType === 'physical' ?
                                    <HasAccess
                                        permission={["PHYSICAL_ADDRESS:LIST"]}
                                        yes={() => (
                                            <div className='col-6 pr-3'>
                                                <Dropdown
                                                    label={t('translation_addressVerification:taskFilters.agencies')}
                                                    options={this.props.agencyList}
                                                    changed={(option) => this.handleSelectedValue(option, 'agency')}
                                                    value={this.state.agency.label}
                                                    disabled={this.props.disabled}
                                                    className='mb-4'
                                                    showLoader={this.props.agencyListState === 'LOADING'}
                                                    horizontalLineIndex={1}
                                                />
                                            </div>
                                        )}
                                    />
                                    : this.props.cardType === 'postal' ?
                                        <HasAccess
                                            permission={["POSTAL_ADDRESS:LIST"]}
                                            yes={() => (
                                                <div className='col-6 pr-3'>
                                                    <Dropdown
                                                        label={t('translation_addressVerification:taskFilters.agencies')}
                                                        options={this.props.agencyList}
                                                        changed={(option) => this.handleSelectedValue(option, 'agency')}
                                                        value={this.state.agency.label}
                                                        disabled={this.props.disabled}
                                                        className='mb-4'
                                                        showLoader={this.props.agencyListState === 'LOADING'}
                                                        horizontalLineIndex={1}
                                                    />
                                                </div>
                                            )}
                                        />
                                        : null}

                                <div className='col-6 pr-4'>
                                    {this.props.cardType === 'physical' ?
                                        <React.Fragment>
                                            <HasAccess
                                                permission={["PHYSICAL_ADDRESS:LIST"]}
                                                yes={() => (
                                                    <Dropdown
                                                        label={t('translation_addressVerification:taskFilters.caseStatus')}
                                                        options={caseStatusOptions}
                                                        changed={(option) => this.handleSelectedValue(option, 'caseStatus')}
                                                        value={this.state.caseStatus}
                                                        disabled={this.props.disabled}
                                                        className='mb-4'
                                                        showLoader={this.props.getStaticDataState === 'LOADING'}
                                                        horizontalLineIndex={[2,4]}
                                                        showDemarkation = {this.state.agency.label !== "unassigned"}
                                                    />
                                                )}
                                            />
                                            <HasAccess denySuperAdminAccess
                                                permission={["AGENCY_DASHBOARD:VIEW_ALL", "AGENCY_DASHBOARD:VIEW_ASSIGNED"]}
                                                yes={() => (
                                                    <Dropdown
                                                        label={t('translation_addressVerification:taskFilters.caseStatus')}
                                                        options={caseStatusOptions}
                                                        changed={(option) => this.handleSelectedValue(option, 'caseStatus')}
                                                        value={this.state.caseStatus}
                                                        disabled={this.props.disabled}
                                                        className='mb-4'
                                                        showLoader={this.props.getStaticDataState === 'LOADING'}
                                                    />
                                                )}
                                            />
                                        </React.Fragment>
                                        : this.props.cardType === 'postal' ?
                                            <HasAccess
                                                permission={["POSTAL_ADDRESS:LIST"]}
                                                yes={() => (
                                                    <Dropdown
                                                        label={t('translation_addressVerification:taskFilters.caseStatus')}
                                                        options={caseStatusOptions}
                                                        changed={(option) => this.handleSelectedValue(option, 'caseStatus')}
                                                        value={this.state.caseStatus}
                                                        disabled={this.props.disabled}
                                                        className='mb-4'
                                                        showLoader={this.props.getStaticDataState === 'LOADING'}
                                                    />
                                                )}
                                            />
                                            : null}
                                </div>
                            </div>
                        </div>

                        {this.props.filterCountState === 'LOADING' ?
                            <div className={cx('col-4 px-0')}>
                                <Loader type='taskFilter' />
                            </div>
                            :
                            !_.isEmpty(this.props.filterCount) ?
                                <div className={cx('col-4 px-0')}>
                                    <HasAccess
                                        permission={["POSTAL_ADDRESS:LIST", "PHYSICAL_ADDRESS:LIST"]}
                                        yes={() => (
                                            <TaskCount
                                                numerator={this.props.filterCount.agencyTaskWithStatus ? this.props.filterCount.agencyTaskWithStatus : 0}
                                                denominator={this.props.filterCount.agencyTotalTask ? this.props.filterCount.agencyTotalTask : 0}
                                                caseStatus={this.state.caseStatus}
                                                cardType={this.props.cardType}
                                                agency={this.state.agency.label}
                                            />
                                        )}
                                    />
                                    <HasAccess denySuperAdminAccess
                                        permission={["AGENCY_DASHBOARD:VIEW_ALL", "AGENCY_DASHBOARD:VIEW_ASSIGNED"]}
                                        yes={() => (
                                            <React.Fragment>
                                                <HasAccess 
                                                    permission={["AGENCY_DASHBOARD:VIEW_ALL"]}
                                                    yes={() => (
                                                        <TaskCount
                                                            numerator={this.props.filterCount.agencyTaskWithStatus ? this.props.filterCount.agencyTaskWithStatus : 0}
                                                            denominator={this.props.filterCount.agencyTotalTask ? this.props.filterCount.agencyTotalTask : 0}
                                                            caseStatus={this.state.caseStatus}
                                                            caseAssignee={this.state.filters.caseAssignee.label}
                                                            cardType={this.props.cardType}
                                                        />
                                                    )}
                                                    no={() => (
                                                        <TaskCount
                                                            numerator={this.props.filterCount.agencyTaskWithStatus ? this.props.filterCount.agencyTaskWithStatus : 0}
                                                            denominator={this.props.filterCount.agencyTotalTask ? this.props.filterCount.agencyTotalTask : 0}
                                                            caseStatus={this.state.caseStatus}
                                                            cardType={this.props.cardType}
                                                        />
                                                    )}
                                                />
                                            </React.Fragment>
                                        )}
                                    />
                                    
                                </div>
                                : null}
                    </div>

                    {this.state.showMoreFilters ?
                        <React.Fragment>
                            <HasAccess
                                permission={["AGENCY_DASHBOARD:VIEW_ALL", "AGENCY_DASHBOARD:VIEW_ASSIGNED", "POSTAL_ADDRESS:LIST", "PHYSICAL_ADDRESS:LIST"]}
                                yes={() => (
                                    <div className='row no-gutters'>
                                        <div className='col-3'>
                                            <div className={cx(styles.ShowMoreFilters)} onClick={this.toggleFilterDropdown}>
                                                <label className={cx(styles.Hover, 'mb-0 row no-gutters justify-content-between')}>
                                                    &ensp;{t('translation_addressVerification:taskFilters.viewMore')}
                                                    <span className={cx('')}>
                                                        <span className={cx("mr-1", styles.FilterCountOpen)}>
                                                            {'0' + (this.state.filterCount)}
                                                        </span>
                                                        <img src={arrowUp} className={cx("ml-1", styles.DropdownIconUp)} alt='' />
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            />

                            <div className={cx(styles.FilterCard)}>
                                <div className='row no-gutters mb-4'>
                                    <HasAccess
                                        permission={["AGENCY_DASHBOARD:VIEW_ALL", "AGENCY_DASHBOARD:VIEW_ASSIGNED", "POSTAL_ADDRESS:LIST", "PHYSICAL_ADDRESS:LIST"]}
                                        yes={() => (
                                            <React.Fragment>
                                                <div className='col-4 pr-3'>
                                                    <Dropdown filters
                                                        label={t('translation_addressVerification:taskFilters.state')}
                                                        options={this.props.WORKLOAD_MGMT_AGENCY_STATE}
                                                        changed={(option) => this.handleSelectedValue(option, 'state')}
                                                        value={this.state.filters.state.label}
                                                        disabled={this.props.disabled}
                                                        showLoader={this.props.getStaticDataState === 'LOADING'}
                                                        defaultOption={'select state'}
                                                    />
                                                </div>

                                                <div className='col-4 pr-3'>
                                                    <Dropdown filters
                                                        label={t('translation_addressVerification:taskFilters.district')}
                                                        options={this.props.WORKLOAD_MGMT_AGENCY_DISTRICT}
                                                        changed={(option) => this.handleSelectedValue(option, 'district')}
                                                        value={this.state.filters.district.label}
                                                        disabled={this.state.filters.state.value === ''}
                                                        showLoader={this.props.districtStaticDataState === 'LOADING'}
                                                        defaultOption={'select district'}
                                                    />
                                                </div>

                                                <div className='col-4 pr-3'>
                                                    <Dropdown filters
                                                        label={t('translation_addressVerification:taskFilters.city')}
                                                        options={this.props.WORKLOAD_MGMT_AGENCY_CITY}
                                                        changed={(option) => this.handleSelectedValue(option, 'city')}
                                                        value={this.state.filters.city.label}
                                                        disabled={this.state.filters.district.value === ''}
                                                        showLoader={this.props.cityStaticDataState === 'LOADING'}
                                                        defaultOption={'select town/city'}
                                                    />
                                                </div>
                                            </React.Fragment>
                                        )}
                                    />
                                </div>
                                <HasAccess
                                    permission={["AGENCY_DASHBOARD:VIEW_ALL", "AGENCY_DASHBOARD:VIEW_ASSIGNED", "POSTAL_ADDRESS:LIST", "PHYSICAL_ADDRESS:LIST"]}
                                    yes={() => (
                                        <div className='row no-gutters mb-4'>
                                            <div className='col-3 pr-3'>
                                                <div className={cx('row no-gutters justify-content-between', styles.Border)} disabled={this.state.filters.state.value === ''}>
                                                    <label className={cx(styles.Hover, 'mb-0')}>&ensp;{t('translation_addressVerification:taskFilters.allPincodes')}</label>
                                                    <Checkbox
                                                        type='medium'//medium15px
                                                        className="mr-3 mt-1"
                                                        name="allPincodes"
                                                        value={this.state.filters.allPincodes}
                                                        onChange={() => this.togglePincodeCheckBox()}
                                                    />
                                                </div>
                                            </div>

                                            <div className='col-9 pr-3' disabled={this.state.filters.allPincodes}>
                                                <div className={cx('row no-gutters', styles.Border)}>
                                                    <img src={search} className='mx-2 my-auto' style={{ height: '16px' }} alt='' />
                                                    {!_.isEmpty(this.state.filters.pincodeList) ?
                                                        this.state.filters.pincodeList.map((pincode, index) => {
                                                            return (
                                                                <div key={index} className={cx('mr-2 mb-1', styles.PinButton)}>
                                                                    {pincode}&nbsp;
                                                                    <img src={close} alt='' className={cx(styles.Hover, "ml-2")}
                                                                        onClick={() => this.handlePincodeListAction(pincode, 'delete')} />
                                                                </div>
                                                            )
                                                        })
                                                        : null}
                                                    <input
                                                        className={styles.SearchPincode}
                                                        type='text'
                                                        value={this.state.filters.pincodeSearch}
                                                        placeholder={t('translation_addressVerification:taskFilters.searchPincode')}
                                                        onChange={(event) => this.handlePincodeList(event, 'pincodeSearch')}
                                                        onPaste={(event) => this.handlePincodeList(event, 'pincodeSearch')}
                                                    />
                                                </div>
                                                <ClickAwayListener onClickAway={this.handleClickAway}>
                                                    <div>
                                                        {this.state.showPincodeList && !_.isEmpty(this.state.filters.pincodeSearch) && !_.isEmpty(this.props.WORKLOAD_MGMT_AGENCY_PINCODE) ?
                                                            <div className={cx("d-flex flex-column", styles.PincodeDropdown, scrollStyle.scrollbar)}>
                                                                {this.handleFilteredPincodes().map((pin, index) => {
                                                                    return (
                                                                        <span key={index} className={styles.PincodeOptions} onClick={() => this.handlePincodeListAction(pin.label, 'add')}>
                                                                            {pin.label}
                                                                        </span>)
                                                                })
                                                                }
                                                            </div>
                                                            : this.props.pincodeStaticDataState === 'LOADING' && !_.isEmpty(this.state.filters.pincodeSearch) ?
                                                                <div className={cx("d-flex flex-column", styles.EmptyDropdown, scrollStyle.scrollbar)}>
                                                                    <Loader type='stepLoaderGrey' className={styles.Loader} />
                                                                    <span className={styles.PincodeOptions}>&emsp;&emsp;{t('translation_addressVerification:taskFilters.loading')}</span>
                                                                </div>
                                                                : null}
                                                    </div>
                                                </ClickAwayListener>
                                            </div>
                                        </div>
                                    )}
                                />

                                <div className='row no-gutters mb-4'>
                                    <HasAccess
                                        permission={["AGENCY_DASHBOARD:VIEW_ALL", "AGENCY_DASHBOARD:VIEW_ASSIGNED", "POSTAL_ADDRESS:LIST", "PHYSICAL_ADDRESS:LIST"]}
                                        yes={() => (
                                            <div className='col-4 pr-3'>
                                                {!_.isEmpty(this.state.dateRangeDropdownValues) ?
                                                    <Dropdown
                                                        label={t('translation_addressVerification:taskFilters.dateRange')}
                                                        options={this.state.dateRangeDropdownValues}//{this.props.WORKLOAD_MGMT_AGENCY_CASE_DATE_RANGE}
                                                        changed={(option) => this.handleSelectedValue(option, 'dateRange')}
                                                        value={this.state.dateRange}
                                                        disabled={this.props.disabled}
                                                        className='mb-4'
                                                        showLoader={this.props.getStaticDataState === 'LOADING'}
                                                        defaultOption={'select date range'}
                                                    /> : null}
                                            </div>
                                        )}
                                    />
                                    <HasAccess
                                        permission={["AGENCY_DASHBOARD:VIEW_ALL", "AGENCY_DASHBOARD:VIEW_ASSIGNED", "POSTAL_ADDRESS:LIST", "PHYSICAL_ADDRESS:LIST"]}
                                        yes={() => (
                                            <div className='col-4 pr-3'>
                                                <Dropdown filters
                                                    label={t('translation_addressVerification:taskFilters.tat')}
                                                    options={this.props.WORKLOAD_MGMT_AGENCY_TAT_LEFT}
                                                    changed={(option) => this.handleSelectedValue(option, 'tatLeft')}
                                                    value={this.state.filters.tatLeft.label}
                                                    disabled={this.props.disabled}
                                                    showLoader={this.props.getStaticDataState === 'LOADING'}
                                                    defaultOption={'select tat left'}
                                                />
                                            </div>
                                        )}
                                    />
                                    <HasAccess
                                        permission={["AGENCY_DASHBOARD:VIEW_ALL", "AGENCY_DASHBOARD:VIEW_ASSIGNED", "POSTAL_ADDRESS:LIST", "PHYSICAL_ADDRESS:LIST"]}
                                        yes={() => (
                                            <div className='col-4 pr-3'>
                                                <label className={cx(styles.DropdownLabel, 'row no-gutters mb-2')}>{t('translation_addressVerification:taskFilters.client')}</label>
                                                <SearchWithOptions
                                                    defaultOptions={this.state.defaultClientData}
                                                    value={this.state.filters.client.label}
                                                    selectedAssignData={(value) => this.handleClientData(value)}
                                                    searchExecutiveResults={(key) => this.handleClientSearch(key)}
                                                    type="client"
                                                />
                                            </div>
                                        )}
                                    />
                                </div>
                                <HasAccess
                                    permission={["AGENCY_DASHBOARD:VIEW_ALL", "AGENCY_DASHBOARD:VIEW_ASSIGNED", "POSTAL_ADDRESS:LIST", "PHYSICAL_ADDRESS:LIST"]}
                                    yes={() => (
                                        <div className='row no-gutters justify-content-between'>
                                            <div className='my-auto' onClick={this.handleResetFilters}>
                                                <img src={reset} className={cx(styles.Hover)} alt='' />
                                                <small className={cx(styles.Hover, styles.GreyText)}>&nbsp;{t('translation_addressVerification:taskFilters.reset')}</small>
                                            </div>
                                            <div className="row no-gutters pr-3">
                                                <CancelButton clickHandler={this.handleCancelFilters} />
                                                <Button label={t('translation_addressVerification:taskFilters.apply')} isDisabled={false} clickHandler={this.handleApply} type='save' />
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                        </React.Fragment>
                        :
                        <HasAccess
                            permission={["AGENCY_DASHBOARD:VIEW_ALL", "AGENCY_DASHBOARD:VIEW_ASSIGNED", "POSTAL_ADDRESS:LIST", "PHYSICAL_ADDRESS:LIST"]}
                            yes={() => (
                                <div className='row no-gutters'>
                                    <div className='col-3'>
                                        <div className={cx(styles.SelectedOption)} onClick={this.toggleFilterDropdown}>
                                            <label className={cx(styles.Hover, 'mb-0 row no-gutters justify-content-between')}>
                                                &ensp;{t('translation_addressVerification:taskFilters.viewMore')}

                                                <span className={cx('')}>
                                                    <span className={cx("mr-1", styles.FilterCount)}>
                                                        {'0' + (this.state.filterCount)}
                                                    </span>
                                                    <img src={arrowDown} className={cx("ml-1", styles.DropdownIconDown)} alt='' />
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        />
                    }
                </div>


                {this.state.toggleDateRange ?
                    <DateRangeModal taskFilters
                        toggle={this.toggleDateRange}
                        onChange={this.getCustomDate}
                        value={this.state.dateRange}
                    />
                    : null
                }
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        searchExecutiveResultsState: state.workloadMgmt.addressVerification.taskList.searchExecutiveResultsState,
        searchExecutiveResults: state.workloadMgmt.addressVerification.taskList.searchExecutiveResults,

        getStaticDataState: state.workloadMgmt.addressVerification.address.getStaticDataState,
        staticData: state.workloadMgmt.addressVerification.address.staticData,
        WORKLOAD_MGMT_AGENCY_CASE_DATE_RANGE: state.workloadMgmt.addressVerification.address.staticData['WORKLOAD_MGMT_AGENCY_CASE_DATE_RANGE'],
        WORKLOAD_MGMT_AGENCY_TAT_LEFT: state.workloadMgmt.addressVerification.address.staticData['WORKLOAD_MGMT_AGENCY_TAT_LEFT'],
        WORKLOAD_MGMT_AGENCY_STATE: state.workloadMgmt.addressVerification.address.staticData['WORKLOAD_MGMT_AGENCY_STATE'],

        clientStaticData: state.workloadMgmt.addressVerification.address.clientStaticData,
        clientStaticState: state.workloadMgmt.addressVerification.address.clientStaticState,

        districtStaticDataState: state.workloadMgmt.addressVerification.address.getDistrictStaticDataState,
        WORKLOAD_MGMT_AGENCY_DISTRICT: state.workloadMgmt.addressVerification.address.getDistrictStaticData,
        cityStaticDataState: state.workloadMgmt.addressVerification.address.getCityStaticDataState,
        WORKLOAD_MGMT_AGENCY_CITY: state.workloadMgmt.addressVerification.address.getCityStaticData,
        pincodeStaticDataState: state.workloadMgmt.addressVerification.address.getPincodeStaticDataState,
        WORKLOAD_MGMT_AGENCY_PINCODE: state.workloadMgmt.addressVerification.address.getPincodeStaticData,

        filterCountState: state.workloadMgmt.addressVerification.address.filterCountState,
        filterCount: state.workloadMgmt.addressVerification.address.filterCount,
        agencyList: state.workloadMgmt.addressVerification.address.agencyList,
        agencyListState: state.workloadMgmt.addressVerification.address.getAgencyListState,

        authUser: state.auth.user,
        userDetails: state.user.userProfile.profile,
        policies: state.auth.policies
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onSearchExecutive: (searchKey) => dispatch(taskListActions.searchExecutive(searchKey)),
        onGetClientStaticData: (addressType, key) => dispatch(addressActions.getClientStaticData(addressType, key)),
        onGetDistrictStaticData: (state) => dispatch(addressActions.getDistrictStaticData(state)),
        onGetCityStaticData: (state, district) => dispatch(addressActions.getCityStaticData(state, district)),
        onGetPincodes: (state) => dispatch(addressActions.getPincodeStaticData(state)),
    }
}

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(TaskFilters)));