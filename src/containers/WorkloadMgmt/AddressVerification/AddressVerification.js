import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import _ from 'lodash';
import cx from 'classnames';
import styles from './AddressVerification.module.scss';

import * as actions from './Store/action';
import * as postalActions from './PostalAddress/Store/action';
import * as physicalActions from './PhysicalAddress/Store/action';
import { searchDropdownStaticData } from './TaskFilters/StaticFilterData';

import TaskFilters from './TaskFilters/TaskFilters';
import TaskList from './TaskList/TaskList';
import ArrowLink from '../../../components/Atom/ArrowLink/ArrowLink';
import HasAccess from "../../../services/HasAccess/HasAccess";

import physical from '../../../assets/icons/physicalAddress.svg';
import postal from '../../../assets/icons/postalBigIcon.svg';
import searchIcon from '../../../assets/icons/search.svg';
import close from '../../../assets/icons/spocClose.svg';
import arrowDown from '../../../assets/icons/greyDropdown.svg';
import arrowUp from '../../../assets/icons/dropdownArrow.svg';

const regex = /(?:pageNumber=)([0-9]+)/;
const regex1 = /(&pageNumber=)([0-9]+)/;
let mobileRegex = /^([+][9][1]|[9][1]|[0]){0,1}([ ]{0,1})([0-9]{1})([0-9]{9})$/;
let alphaNumericRegex = /^[a-zA-Z0-9 ]*$/;

class AddressVerification extends Component {

    state = {
        searchKey: '',
        searchOption: 'profile details',
        searchFocus: false,
        pageSize: 20,
        cardType: '',
        payload: {},
        userPrivilege : '',
        showSearchDropdown: false
    }

    componentDidMount = () => {
        const { match } = this.props;
        const cardType = match.params.cardType;
        let { userPrivilege } = this.state;
        

        const targetUrl = this.props.location.search;
        this.props.onGetTasksCount(cardType, targetUrl, this.state.payload);//count api
        this.props.onGetStaticDataList(cardType);  //staticData for date,tat,state

        const thisRef = this;
        _.forEach(this.props.policies, function (policy) {
            if (_.includes(policy.businessFunctions, "*")) {
                thisRef.props.onGetAgencyList(cardType);
                userPrivilege = 'SUPER_ADMIN';
            }
            else if (_.includes(policy.businessFunctions, "POSTAL_ADDRESS:LIST") && cardType === 'postal') {
                thisRef.props.onGetAgencyList('postal'); //fedex, indiapost etc
                userPrivilege = 'BPSS_USER';
            }
            else if (_.includes(policy.businessFunctions, "PHYSICAL_ADDRESS:LIST") && cardType === 'physical') {
                thisRef.props.onGetAgencyList('physical'); //delhivery, rj etc
                userPrivilege = 'BPSS_USER';
            }
            else if(_.includes(policy.businessFunctions, "AGENCY_DASHBOARD:VIEW_ALL") && cardType === 'physical'){
                userPrivilege = 'AGENCY_ADMIN';
            }
        });

        this.setState({ cardType: cardType , userPrivilege : userPrivilege});
        const currentUrlParams = new URLSearchParams(this.props.location.search);
        this.props.onGetTaskFilterCount(cardType, currentUrlParams.get('agency'), currentUrlParams.get('caseStatus'), 
            currentUrlParams.get('caseAssignee'), userPrivilege, targetUrl, this.state.payload);
    }

    componentDidUpdate = (prevProps, prevState) => {
        const targetUrl = this.props.location.search;
        const currentUrlParams = new URLSearchParams(this.props.location.search);

        //search tasks based on category
        let searchOption;
        searchDropdownStaticData.map(item => {
            if (item.label === this.state.searchOption) { searchOption = item.value; }
            return searchOption;
        })

        if (prevState.searchKey !== this.state.searchKey || (this.state.searchKey !== '' && prevState.searchOption !== this.state.searchOption)) {
            if ((this.state.searchKey.length > 2 && searchOption === 'profile' && alphaNumericRegex.test(this.state.searchKey))
                || (searchOption === 'phoneNumber' && mobileRegex.test(this.state.searchKey))) {
                this.props.onSearchCandidate(this.state.cardType, this.state.searchKey, searchOption);
            }
            else if (this.state.searchKey.length === 0) {
                this.props.onGetTasksCount(this.state.cardType, targetUrl, this.state.payload);
                this.props.onGetTaskFilterCount(this.state.cardType, currentUrlParams.get('agency'), 
                    currentUrlParams.get('caseStatus'), currentUrlParams.get('caseAssignee'), this.state.userPrivilege, targetUrl, this.state.payload);
            }
        }

        //page number in url
        if (prevProps.tasksCountState !== this.props.tasksCountState && this.props.tasksCountState === 'SUCCESS') {
            if (this.props.tasksCount > this.state.pageSize) {
                if (this.props.location.search.includes('pageNumber')) {
                    this.props.onGetTasksList(this.state.cardType, this.state.payload, targetUrl, this.state.pageSize);
                }
                else {
                    let redirectPath = '';
                    if (this.props.location.search.length !== 0) {
                        redirectPath = this.props.location.pathname + this.props.location.search + '&pageNumber=1';
                    }
                    else {
                        redirectPath = this.props.location.pathname + '?pageNumber=1';
                    }
                    this.props.history.push(redirectPath);
                }
            }
            else { //<20 tasks from tasklist api
                if (targetUrl.includes("?pageNumber=")) {
                    const newSearchPath = this.props.location.search.replace(regex, '');
                    const redirectPath = this.props.location.pathname + newSearchPath;
                    this.props.history.push(redirectPath);
                    this.props.onGetTasksList(this.state.cardType, this.state.payload, newSearchPath, null);
                }
                else if (targetUrl.includes("&pageNumber=")) {
                    const newSearchPath = this.props.location.search.replace(regex1, '');
                    const redirectPath = this.props.location.pathname + newSearchPath;
                    this.props.history.push(redirectPath);
                    this.props.onGetTasksList(this.state.cardType, this.state.payload, newSearchPath, null);
                }
                else {
                    this.props.onGetTasksList(this.state.cardType, this.state.payload, targetUrl, null);
                }
            }
        }

        if (prevState.payload !== this.state.payload && prevProps.location.search === this.props.location.search) {
            this.props.onGetTasksCount(this.state.cardType, targetUrl, this.state.payload);
            this.props.onGetTaskFilterCount(this.state.cardType, currentUrlParams.get('agency'), 
            currentUrlParams.get('caseStatus'), currentUrlParams.get('caseAssignee'), this.state.userPrivilege, targetUrl, this.state.payload);
        }

        //applied filters
        if (prevProps.location.search !== this.props.location.search) {
            if (this.props.location.search.includes('pageNumber')) {
                this.props.onGetTasksList(this.state.cardType, this.state.payload, targetUrl, this.state.pageSize);
            }
            else {
                if (this.state.searchKey.length === 0) {
                    this.props.onGetTasksCount(this.state.cardType, targetUrl, this.state.payload);
                    this.props.onGetTaskFilterCount(this.state.cardType, currentUrlParams.get('agency'), 
                        currentUrlParams.get('caseStatus'), currentUrlParams.get('caseAssignee'), this.state.userPrivilege, targetUrl, this.state.payload);
                }
            }
        }

        //to show tasklist after assigning task to employee
        if ((prevProps.postAssignmentState !== this.props.postAssignmentState && this.props.postAssignmentState === 'SUCCESS')
            || (prevProps.reassignDataState !== this.props.reassignDataState && this.props.reassignDataState === 'SUCCESS')) {
            const targetUrl = this.props.location.search;
            this.props.onGetTasksCount(this.state.cardType, targetUrl, this.state.payload);
            this.props.onGetTaskFilterCount(this.state.cardType, currentUrlParams.get('agency'), currentUrlParams.get('caseStatus'),
                currentUrlParams.get('caseAssignee'), this.state.userPrivilege, targetUrl, this.state.payload);
        }
    }

    componentWillUnmount = () => {
        this.props.onGetInitState();

        if (this.state.cardType === 'postal' && !_.isEmpty(this.props.postalSuccessData)) {
            this.props.onGetPostalInitData();
        }
        if (this.state.cardType === 'physical' && !_.isEmpty(this.props.physicalSuccessData)) {
            this.props.onGetPhysicalInitData();
        }
    }

    handleInputChange = (e) => {
        this.setState({ searchKey: e.target.value });
    }

    onFocus = () => {
        this.setState({ searchFocus: true })
    }

    onBlur = () => {
        this.setState({ searchFocus: false })
    }

    handleClearSearch = () => {
        this.setState({ searchKey: '', searchFocus: false })
    }

    handleShowFilteredResults = (payload) => {
        this.setState({ payload: payload }); //payload data for pincodes
    }

    handleSearchOption = (selectedSearchOption) => {
        this.setState({ searchOption: selectedSearchOption })
    }

    handleOutsideClick = (e) => {
        if (!_.isEmpty(this.node)) {
            if (this.node.contains(e.target)) {
                return;
            }
            this.handleClick();
        }
    }

    handleClick = (event) => {
        if (event) {
            event.preventDefault();
        }
        if (!this.state.showSearchDropdown) {
            document.addEventListener('click', this.handleOutsideClick, false);
        } else {
            document.removeEventListener('click', this.handleOutsideClick, false);
        }
        this.setState(prevState => ({
            showSearchDropdown: !prevState.showSearchDropdown
        }));
    }

    render() {
        const { t } = this.props;
        let searchPlaceholder = this.state.searchOption === 'phone number' ?
            'search by phone number' : 'search by candidate name/empid';

        return (
            <div className={cx(styles.WorkloadSection)}>
                <div className="d-flex flex-row">
                    <ArrowLink
                        label={t('translation_addressVerification:dashboard')}
                        url={'/workload-mgmt'}
                    />
                </div>

                <div className={cx('d-flex flex-row justify-content-between mt-2')}>
                    <div className='d-flex flex-column' style={{ width: '100%' }}>
                        <div className={cx('mb-3', styles.Dashboard)}>{t('translation_addressVerification:todos')} {this.state.cardType} {t('translation_addressVerification:address')}</div>

                        <div className='row no-gutters justify-content-between'>
                            <div className={cx("col-8 px-0 d-flex",
                                (this.state.searchFocus || this.state.searchKey !== '') ? styles.Focus : styles.NoFocus)}
                                onFocus={this.onFocus}
                                onBlur={this.onBlur}
                            >
                                <img src={searchIcon} alt='' className='pr-2' />
                                <input
                                    type='text'
                                    placeholder={searchPlaceholder}
                                    value={this.state.searchKey}
                                    className={cx('pl-2', styles.SearchBar)}
                                    onPaste={(event) => this.handleInputChange(event)}
                                    onChange={(event) => this.handleInputChange(event)}
                                    disabled={false}
                                />
                                {this.state.searchKey !== '' ?
                                    <img src={close} onClick={this.handleClearSearch} className={styles.CloseSearch} alt='' />
                                    : null}
                            </div>

                            {/* search dropdown below */}
                            <div className="col-4 px-0">
                                <div className={'row no-gutters justify-content-end mr-2'} ref={node => { this.node = node; }}>
                                    <span className={cx("mt-2", styles.SearchBy)}>{t('translation_addressVerification:searchBy')}</span>
                                    {this.state.showSearchDropdown ?
                                        <div className={cx(styles.SearchDropdown)} onClick={this.handleClick}>
                                            <div className={cx(styles.FirstOption)} onClick={() => this.handleSearchOption('profile details')}>
                                                <label className={cx(styles.hover, 'mb-0')}>{t('translation_addressVerification:profile')}</label>
                                                <img src={arrowUp} className={styles.DropdownIconDown} align='right' alt='' />
                                            </div>
                                            <div className={cx(styles.LastOption)} onClick={() => this.handleSearchOption('phone number')}>
                                                <label className={cx(styles.hover, 'mb-0')}>{t('translation_addressVerification:phoneNo')}</label>
                                            </div>
                                        </div>
                                        :
                                        <div className={styles.SelectedOption} onClick={this.handleClick}>
                                            <span style={{ cursor: 'pointer' }}>{this.state.searchOption}</span>
                                            <img className={styles.Icon} src={arrowDown} alt='' />
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <img src={this.state.cardType === 'physical' ? physical : postal} alt='' />
                    </div>
                </div>


                <div className='mt-3 mb-4'>
                    <TaskFilters
                        cardType={this.state.cardType}
                        disabled={!_.isEmpty(this.state.searchKey)}
                        tasksCount={this.props.tasksCount}
                        pageSize={this.state.pageSize}
                        handleShowFilteredResults={(payload) => this.handleShowFilteredResults(payload)}
                    />
                </div>
                {this.state.cardType === 'physical' ?
                    <HasAccess
                        permission={["AGENCY_DASHBOARD:VIEW_ALL", "AGENCY_DASHBOARD:VIEW_ASSIGNED", "PHYSICAL_ADDRESS:LIST"]}
                        yes={() => (
                            <TaskList
                                tasksList={this.props.tasksList}
                                tasksCount={this.props.tasksCount}
                                tasksCountState={this.props.tasksCountState}
                                searchResultsState={this.props.searchResultsState}
                                searchResults={this.props.searchResults}
                                searchKey={this.state.searchKey}
                                tasksListState={this.props.tasksListState}
                                cardType={this.state.cardType}
                                searchOption={this.state.searchOption}
                            />
                        )}
                    />
                    :
                    this.state.cardType === 'postal' ?
                        <HasAccess
                            permission={["POSTAL_ADDRESS:LIST"]}
                            yes={() => (
                                <TaskList
                                    tasksList={this.props.tasksList}
                                    tasksCount={this.props.tasksCount}
                                    tasksCountState={this.props.tasksCountState}
                                    searchResultsState={this.props.searchResultsState}
                                    searchResults={this.props.searchResults}
                                    searchKey={this.state.searchKey}
                                    tasksListState={this.props.tasksListState}
                                    cardType={this.state.cardType}
                                    searchOption={this.state.searchOption}
                                />
                            )}
                        />
                        : null}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        searchResultsState: state.workloadMgmt.addressVerification.address.searchResultsState,
        searchResults: state.workloadMgmt.addressVerification.address.searchResults,

        tasksCountState: state.workloadMgmt.addressVerification.address.getTasksCountState,
        tasksCount: state.workloadMgmt.addressVerification.address.getTasksCount,
        tasksListState: state.workloadMgmt.addressVerification.address.getAgencyTasksState,
        tasksList: state.workloadMgmt.addressVerification.address.getAgencyTasks,

        postAssignmentState: state.workloadMgmt.addressVerification.taskList.postAssignmentState,
        postAssignmentData: state.workloadMgmt.addressVerification.taskList.postAssignmentData,
        reassignDataState: state.workloadMgmt.addressVerification.address.reassignDataState,
        reassignData: state.workloadMgmt.addressVerification.address.reassignData,

        postalSuccessData: state.workloadMgmt.addressVerification.postalAddress.postalSuccessData,
        physicalSuccessData: state.workloadMgmt.addressVerification.physicalAddress.physicalSuccessData,

        policies: state.auth.policies
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onGetInitState: () => dispatch(actions.initState()),
        onSearchCandidate: (cardType, searchKey, category, targetUrl, pageSize) => dispatch(actions.searchCandidate(cardType, searchKey, category, targetUrl, pageSize)),
        onGetTasksCount: (cardType, targetUrl, payload) => dispatch(actions.getTasksCount(cardType, targetUrl, payload)),
        onGetTasksList: (cardType, payload, targetUrl, pageSize) => dispatch(actions.getTasksList(cardType, payload, targetUrl, pageSize)),
        onGetTaskFilterCount: (cardType, agency, caseStatus, caseAssignee, userPrivilege, targetUrl, payload) => dispatch(actions.getFilterCount(cardType, agency, caseStatus, caseAssignee, userPrivilege, targetUrl, payload)),
        onGetStaticDataList: (cardType) => dispatch(actions.getStaticDataList(cardType)),
        onGetAgencyList: (agencyType) => dispatch(actions.getAgencyList(agencyType)),

        onGetPhysicalInitData: () => dispatch(physicalActions.initState()),
        onGetPostalInitData: () => dispatch(postalActions.initState()),
    }
}

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(AddressVerification)));