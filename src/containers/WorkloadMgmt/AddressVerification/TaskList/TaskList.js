import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import _ from 'lodash';
import cx from 'classnames';
import styles from './TaskList.module.scss';

import TaskRow from "./TaskRow";
import Loader from '../../../../components/Organism/Loader/Loader';
import Paginator from '../../../../components/Organism/Paginator/Paginator';
import SuccessNotification from "../../../../components/Organism/Notifications/SuccessNotification/SuccessNotification";
import ErrorNotification from "../../../../components/Organism/Notifications/ErrorNotification/ErrorNotification";
import scrollStyle from '../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import TaskListFooter from './TaskListFooter/TaskListFooter';
import UploadExcelPopUp from './UploadExcelPopUp/UploadExcelPopUp';
import EmptyState from '../../../../components/Atom/EmptyState/EmptyState';
import Checkbox from "../../../../components/Atom/CheckBox/CheckBox";

import dash from '../../../../assets/icons/dash.svg';
import assignActive from "../../../../assets/icons/assignActive.svg";
import assignInactive from "../../../../assets/icons/assignIcon.svg";
import unassignActive from "../../../../assets/icons/unassignActive.svg";
import unassignInactive from "../../../../assets/icons/unassignInactive.svg";
import downloadActive from '../../../../assets/icons/downloadIcon.svg';
import downloadInactive from '../../../../assets/icons/greyDownload.svg';

import * as actions from './Store/action';
import * as addressActions from '../Store/action';
import * as actionTypes from './Store/actionTypes';
import * as addressActionTypes from '../Store/actionTypes';

import HasAccess from '../../../../services/HasAccess/HasAccess';

const regex = /(?:pageNumber=)([0-9]+)/;
const regex1 = /(&pageNumber=)([0-9]+)/;
const mobileRegex = /^([+][9][1]|[9][1]|[0]){0,1}([ ]{0,1})([0-9]{1})([0-9]{9})$/;
const filters = ['caseStatus', 'agency', 'state', 'district', 'city', 'tatLeft', 'client', 'caseAssignee'];

class TaskList extends Component {

    state = {
        selectedTasks: [],
        actionType: '',
        showSuccessNotification: false,
        showDownloadSuccessNotification: false,
        showSuccessTaskNotification: false,
        assignedExecutive: '',
        pageSize: 20,
        allTasksSelected: false,
        appliedFilters: false
    }

    componentDidMount = () => {
        if (this.props.postalTaskState === 'SUCCESS' || this.props.physicalTaskState === 'SUCCESS') {
            this.setState({ showSuccessTaskNotification: true });
            setTimeout(() => {
                this.setState({ showSuccessTaskNotification: false });
            }, 4000);
        }


        //calling agency list api for footer wrt permissions;
        const thisRef = this;
        _.forEach(this.props.policies, function (policy) {
            if (_.includes(policy.businessFunctions, "*")) {
                thisRef.props.onGetAgencyList(thisRef.props.cardType);
            }
            else if (_.includes(policy.businessFunctions, "POSTAL_ADDRESS:REASSIGN") && thisRef.props.cardType === 'postal') {
                if (_.isEmpty(thisRef.props.postalAgencyList)) {
                    thisRef.props.onGetAgencyList('postal', thisRef.props.postalAgencyList, thisRef.props.physicalAgencyList);
                }
            }
            else if (_.includes(policy.businessFunctions, "PHYSICAL_ADDRESS:REASSIGN") && thisRef.props.cardType === 'physical') {
                if (_.isEmpty(thisRef.props.physicalAgencyList)) {
                    thisRef.props.onGetAgencyList('physical', thisRef.props.postalAgencyList, thisRef.props.physicalAgencyList);
                }
            }
        });
    }

    componentDidUpdate = (prevProps) => {
        if ((prevProps.postAssignmentState !== this.props.postAssignmentState && this.props.postAssignmentState === 'SUCCESS')
            || (prevProps.reassignDataState !== this.props.reassignDataState && this.props.reassignDataState === 'SUCCESS')) {
            this.setState({ showSuccessNotification: true, allTasksSelected: false, selectedTasks: [], actionType: "" });
            setTimeout(() => {
                this.setState({ showSuccessNotification: false });
            }, 4000);
        }
        if (prevProps.downloadAgencyTasksState !== this.props.downloadAgencyTasksState && this.props.downloadAgencyTasksState === 'SUCCESS') {
            this.setState({ showDownloadSuccessNotification: true, actionType: "" });
            setTimeout(() => {
                this.setState({ showDownloadSuccessNotification: false, allTasksSelected: false, selectedTasks: [] });
            }, 4000);
        }

        if (this.props.excelUploadTasksState !== prevProps.excelUploadTasksState && this.props.excelUploadTasksState === 'SUCCESS') {
            this.props.onProcessUploadedTasks(this.props.postalUploadId);
        }

        if (prevProps.location.search !== this.props.location.search) {
            const currentUrlParams = new URLSearchParams(this.props.location.search);
            let includesFilters = filters.map(key => currentUrlParams.has(key));

            if (includesFilters.includes(true)) {
                this.setState({ appliedFilters: true });
                setTimeout(() => {
                    this.setState({ appliedFilters: false });
                }, 4000);
            }
        }

    }

    componentWillUnmount = () => {
        this.props.onGetInitState();
    }

    handleSelectedTasks = (_id) => {
        let taskArray = _.cloneDeep(this.state.selectedTasks);
        if (_.includes(taskArray, _id)) {
            taskArray = _.remove(taskArray, function (task) {
                return task !== _id
            });
        }
        else {
            taskArray.push(_id);
        }

        // if (this.state.allTasksSelected) {
        //     this.setState({ allTasksSelected: false })
        // }
        this.setState({ selectedTasks: taskArray })
    }

    toggleSelectAll = () => {
        if (this.state.selectedTasks.length > 0) {
            this.setState({ selectedTasks: [], allTasksSelected: false })
        }
        else {
            let selectAll = [];
            if (!_.isEmpty(this.props.tasksList) && _.isEmpty(this.props.searchKey)) {
                this.props.tasksList.map(task => { return (selectAll.push(task._id)) })
            }
            else {
                this.props.searchResults.map(task => { return (selectAll.push(task._id)) })
            }
            this.setState({ selectedTasks: selectAll })
        }
    }

    getUserPreference = () => {
        let userPreference = '';
        if(this.props.user.userGroup === 'SUPER_ADMIN'){
            userPreference = 'SUPER_ADMIN';
        }
        _.forEach(this.props.policies, function(policy){
            if(_.includes(policy.businessFunctions, "PHYSICAL_ADDRESS:UNASSIGN") || 
                    _.includes(policy.businessFunctions, "POSTAL_ADDRESS:UNASSIGN")) {
                userPreference = 'BPSS_USER';
            } else if(_.includes(policy.businessFunctions, "AGENCY_DASHBOARD:UNASSIGN")){
                userPreference = 'AGENCY_USER';
            }
        })
        return userPreference;
    }

    getPermission = () => {
        let permission = "";
        if(this.props.cardType === 'postal'){
            permission = "POSTAL_ADDRESS:UNASSIGN";
        } else {
            let userPreference = this.getUserPreference();
            if(userPreference === "AGENCY_USER"){
                permission = "AGENCY_DASHBOARD:UNASSIGN";
            } else {
                permission = "PHYSICAL_ADDRESS:UNASSIGN";
            }
        }
        return permission;
    }

    handleActionSelect = (actionType) => {
        let payload = {};

        if (actionType === 'unassign') {
            let currentUrlParams = new URLSearchParams(this.props.location.search.slice(1));

            if (!_.isEmpty(currentUrlParams.get('pageNumber'))) {
                currentUrlParams.delete('pageNumber');
            }
            let userPreference = this.getUserPreference();

            
            if (this.state.allTasksSelected) {
                payload = { "assignStatus": "open" };
            }
            else {
                payload = {
                    "assignStatus": "open",
                    "objectIds": this.state.selectedTasks
                };
            }
            if(userPreference !== "AGENCY_USER"){
                payload.assignStatus = "unassigned";
            }
            this.props.onPostAssignment(payload, actionType, this.state.allTasksSelected, currentUrlParams, this.props.cardType);
            this.setState({ assignedExecutive: '' })
        }
        else if (actionType === 'download') {
            let targetUrl = this.props.location.search;
            payload = { "objectIds": this.state.selectedTasks };

            if (targetUrl.includes('?pageNumber=')) {
                targetUrl = targetUrl.replace(regex, '');
            }
            else if (targetUrl.includes('&pageNumber=')) {
                targetUrl = targetUrl.replace(regex1, '');
            }
            if (this.props.cardType === 'physical') {
                this.props.onDownloadPhysicalTasks(this.state.allTasksSelected, targetUrl, payload);
            }
            else if (this.props.cardType === 'postal') {
                this.props.onDownloadPostalTasks(this.state.allTasksSelected, targetUrl, payload);
            }
        }
        this.setState({ actionType: actionType })
    }

    handleAllTaskSelection = (msg) => {
        if (msg === "select from all pages")
            this.setState({ allTasksSelected: true })
        else {
            let taskArray = _.cloneDeep(this.state.selectedTasks);
            this.setState({ allTasksSelected: false, selectedTasks: taskArray });
        }
    }

    handleAssignment = (name, empId) => {
        let payload = {};
        let currentUrlParams = new URLSearchParams(this.props.location.search.slice(1));
        if (!_.isEmpty(currentUrlParams.get('pageNumber'))) {
            currentUrlParams.delete('pageNumber');
        }
        if (this.state.allTasksSelected) {
            payload = {
                "assignStatus": 'picked',
                "assignedTo": name,
                "assigneeEmpId": empId
            };
        }
        else {
            payload = {
                "assignStatus": 'picked',
                "assignedTo": name,
                "assigneeEmpId": empId,
                "objectIds": this.state.selectedTasks
            };
        }
        this.props.onPostAssignment(payload, 'assign', this.state.allTasksSelected, currentUrlParams, this.props.cardType);
        this.setState({ assignedExecutive: name, actionType: 'assign' })
    }

    handleExecutiveSearch = (searchKey) => {
        this.props.onSearchExecutive(searchKey);
    }

    closeSuccessNotification = () => {
        this.setState({ showSuccessNotification: false, showDownloadSuccessNotification: false, showSuccessTaskNotification: false })
    }

    handleFileUpload = (file) => {
        let formData = new FormData();
        formData.append('file', file);
        this.setState({ file: file.name });
        this.props.onUploadExcelTasks(formData);
    }

    handleReassign = (verification, agency, agencyId) => {
        let verificationType = verification === 'postal verification' ? 'POSTAL' : 'PHYSICAL';
        let payload = {
            "agencyToAgencyType": verificationType,
            "agencyFromAgencyType": this.props.cardType.toUpperCase(),
            "agencyToAgencyId": agencyId,
            "objectIds": this.state.selectedTasks
        }
        this.props.onReassign(payload, agency, 'reassign', this.state.selectedTasks);
    }

    onAgencyChange = (verificationType) => {
        this.props.onGetAgencyList(verificationType, this.props.postalAgencyList, this.props.physicalAgencyList);
    }

    handleErrorExcelDownload = () => {
        this.props.onDownloadPostalErrorExcel('error download', this.props.processedData.errorPath);
    }

    resetError = () => {
        this.props.onResetError();
    }

    resetAddressError = () => {
        this.props.onResetAddressError();
    }

    render() {
        const { t } = this.props;

        let selectAllMsg = this.state.allTasksSelected ? 'select from this page only' : 'select from all pages'

        const disableActions = (this.props.postAssignmentState === 'LOADING' || this.props.unassignState === 'LOADING'
            || this.props.downloadState === 'LOADING') ? true : false;

        let showSearchResults = this.props.searchOption === 'profile details' ?
            this.props.searchKey.length > 2 : mobileRegex.test(this.props.searchKey);

        let checkboxStatus = null;
        if (_.isEmpty(this.props.searchKey) && this.props.tasksList.length > 0) {
            if (!_.isEmpty(this.state.selectedTasks) && this.state.selectedTasks.length > 0) {
                checkboxStatus = this.state.allTasksSelected ? "all-selected" : "some-selected";
            }
        }
        else if (!_.isEmpty(this.props.searchKey) && this.props.searchResults.length > 0) { //search key length > 2
            if (!_.isEmpty(this.state.selectedTasks) && this.state.selectedTasks.length > 0) {
                checkboxStatus = this.state.allTasksSelected ? "all-selected" : "some-selected";
            }
        }

        return (
            <React.Fragment>
                <div className='d-flex flex-row'>
                    {/* success notification after task closure */}
                    {this.state.showSuccessTaskNotification && (!_.isEmpty(this.props.postalSuccessData) || !_.isEmpty(this.props.physicalSuccessData)) ?
                        <SuccessNotification
                            type='agencyNotification'
                            color={!_.isEmpty(this.props.postalSuccessData) ? this.props.postalSuccessData.color : this.props.physicalSuccessData.color}
                            empCount={!_.isEmpty(this.props.postalSuccessData) ? this.props.postalSuccessData.name : this.props.physicalSuccessData.name}
                            message={'case status has been successfully marked as'}
                            boldText={!_.isEmpty(this.props.postalSuccessData) ? this.props.postalSuccessData.color.toLowerCase().replace(/_/g, " ") + ' case'
                                : this.props.physicalSuccessData.color.toLowerCase().replace(/_/g, " ") + ' case'}
                            closeNotification={this.closeSuccessNotification}
                        />
                        :
                        this.props.error ?
                            <ErrorNotification type='agencyErrorNotification' error={this.props.error} clicked={this.resetError} />
                            :
                            this.props.addressError ?
                                <ErrorNotification type='agencyErrorNotification' error={this.props.addressError} clicked={this.resetAddressError} />
                                : null}
                </div>
                <div className='d-flex flex-row justify-content-between'>
                    <div>
                        <div className={cx(styles.actionContent, "d-flex")}>

                            {(!_.isEmpty(this.props.tasksList) && this.props.tasksList.length > 0 && _.isEmpty(this.props.searchKey)) ||
                                (!_.isEmpty(this.props.searchResults) && this.props.searchResults.length > 0 && !_.isEmpty(this.props.searchKey)) ?
                                <React.Fragment>
                                    <Checkbox
                                        type={checkboxStatus === 'all-selected' ? 'medium15px' : 'medium15pxline'}
                                        value={checkboxStatus === null ? false : true}
                                        name="selectAll"
                                        onChange={() => this.toggleSelectAll()}
                                        className={"pt-1 mt-2"}
                                    />
                                    <img src={dash} alt='' className={cx(styles.dash, "my-auto ml-4")} />

                                    {this.state.selectedTasks.length > 0 ?
                                        <span className="row px-0 mx-0">
                                            <React.Fragment>
                                                {this.props.cardType === 'physical' ?
                                                    <HasAccess denySuperAdminAccess
                                                        permission={["AGENCY_DASHBOARD:ASSIGN"]}
                                                        yes={() => (
                                                            <div className={this.state.actionType !== "assign" ? styles.mainDiv : null} onClick={() => this.handleActionSelect("assign")} disabled={disableActions}>
                                                                <div className={this.state.actionType === "assign" ? styles.ActiveButton : styles.InactiveButton} >
                                                                    <img src={this.state.actionType === "assign" ? assignActive : assignInactive}
                                                                        alt='' className="pr-2" />{t('translation_addressVerification:taskList.assign')}
                                                                </div>
                                                            </div>
                                                        )}
                                                    />
                                                : null}
                                                <HasAccess 
                                                    permission={[this.getPermission()]}
                                                    yes={() => (
                                                        <div className={this.state.actionType !== "unassign" ? styles.mainDiv : null} onClick={() => this.handleActionSelect("unassign")} disabled={disableActions}>
                                                            <div className={this.state.actionType === "unassign" ? styles.ActiveButton : styles.InactiveButton}>
                                                                <img src={this.state.actionType === "unassign" ? unassignActive : unassignInactive}
                                                                    alt='' className="pr-2" />{t('translation_addressVerification:taskList.unassign')}
                                                            </div>
                                                        </div>
                                                    )}
                                                />
                                            </React.Fragment>

                                            {this.props.cardType === 'physical' ?
                                                <HasAccess
                                                    permission={["PHYSICAL_ADDRESS:REASSIGN"]}
                                                    yes={() => (
                                                        <div className={this.state.actionType !== "reassign" ? styles.mainDiv : null} onClick={() => this.handleActionSelect("reassign")} disabled={disableActions}>
                                                            <div className={this.state.actionType === "reassign" ? styles.ActiveButton : styles.InactiveButton}>
                                                                <img src={this.state.actionType === "reassign" ? assignActive : assignInactive}
                                                                    alt='' className="pr-2" />{t('translation_addressVerification:taskList.reassign')}
                                                            </div>
                                                        </div>
                                                    )}
                                                />
                                                : this.props.cardType === 'postal' ?
                                                    <HasAccess
                                                        permission={["POSTAL_ADDRESS:REASSIGN"]}
                                                        yes={() => (
                                                            <div className={this.state.actionType !== "reassign" ? styles.mainDiv : null} onClick={() => this.handleActionSelect("reassign")} disabled={disableActions}>
                                                                <div className={this.state.actionType === "reassign" ? styles.ActiveButton : styles.InactiveButton}>
                                                                    <img src={this.state.actionType === "reassign" ? assignActive : assignInactive}
                                                                        alt='' className="pr-2" />{t('translation_addressVerification:taskList.reassign')}
                                                                </div>
                                                            </div>
                                                        )}
                                                    />
                                                    : null}

                                            {this.props.cardType === 'physical' ?
                                                <HasAccess
                                                    permission={["AGENCY_DASHBOARD:DOWNLOAD", "PHYSICAL_ADDRESS:DOWNLOAD"]}
                                                    yes={() => (
                                                        <div className={this.state.actionType !== "download" ? styles.mainDiv : null} onClick={() => this.handleActionSelect("download")} disabled={disableActions}>
                                                            <div className={this.state.actionType === "download" ? styles.ActiveButton : styles.InactiveButton}>
                                                                {this.state.actionType === "download" ?
                                                                    (this.props.downloadAgencyTasksState === 'LOADING' ?
                                                                        <div> <Loader type='stepLoaderBlue' className={styles.DownloadLoader} /> </div>
                                                                        : <img src={downloadActive} alt='' className="pr-2" style={{ height: '16px' }} />
                                                                    )
                                                                    : <img src={downloadInactive} alt='' className="pr-2" style={{ height: '16px' }} />
                                                                }
                                                                {this.props.downloadAgencyTasksState === 'LOADING' ?
                                                                    <span className="ml-4">{t('translation_addressVerification:taskList.download')}</span>
                                                                    : t('translation_addressVerification:taskList.download')
                                                                }
                                                            </div>
                                                        </div>
                                                    )}
                                                />
                                                :
                                                this.props.cardType === 'postal' ?
                                                    <HasAccess
                                                        permission={["POSTAL_ADDRESS:DOWNLOAD"]}
                                                        yes={() => (
                                                            <div className={this.state.actionType !== "download" ? styles.mainDiv : null} onClick={() => this.handleActionSelect("download")} disabled={disableActions}>
                                                                <div className={this.state.actionType === "download" ? styles.ActiveButton : styles.InactiveButton}>
                                                                    {this.state.actionType === "download" ?
                                                                        (this.props.downloadAgencyTasksState === 'LOADING' ?
                                                                            <div> <Loader type='stepLoaderBlue' className={styles.DownloadLoader} /> </div>
                                                                            : <img src={downloadActive} alt='' className="pr-2" style={{ height: '16px' }} />
                                                                        )
                                                                        : <img src={downloadInactive} alt='' className="pr-2" style={{ height: '16px' }} />
                                                                    }
                                                                    {this.props.downloadAgencyTasksState === 'LOADING' ?
                                                                        <span className="ml-4">{t('translation_addressVerification:taskList.download')}</span>
                                                                        : t('translation_addressVerification:taskList.download')
                                                                    }
                                                                </div>
                                                            </div>
                                                        )}
                                                    />
                                                    : null}
                                        </span>
                                        : <span className="py-3" />
                                    }
                                </React.Fragment>
                                :
                                null
                            }
                        </div>
                    </div>
                    <div className="d-flex flex-row">
                        {this.props.cardType === 'postal' ?
                            <HasAccess
                                permission={["POSTAL_ADDRESS:UPLOAD"]}
                                yes={() => (
                                    this.props.cardType === 'postal' ?
                                        <div className={this.state.actionType !== "upload" ? styles.mainDiv : null} onClick={() => this.handleActionSelect("upload")} disabled={disableActions}>
                                            <div className={this.state.actionType === "upload" ? styles.ActiveButton : styles.InactiveButton}>
                                                <img src={this.state.actionType === "upload" ? downloadActive : downloadInactive}
                                                    alt='' className={cx(styles.rotate, "mr-2")} style={{ height: '16px' }} />{t('translation_addressVerification:taskList.upload')}
                                            </div>
                                        </div>
                                        : null
                                )}
                            />
                            : null}

                        {this.props.tasksCountState === 'SUCCESS' && _.isEmpty(this.props.searchKey)
                            && this.props.tasksCount > this.state.pageSize ?
                            <React.Fragment>
                                <img src={dash} alt='' className={cx(styles.dash, "my-auto mr-3 ml-2")} />
                                <Paginator
                                    dataCount={this.props.tasksCount}
                                    pageSize={this.state.pageSize}
                                    baseUrl={this.props.location.pathname}
                                    className='mt-2'
                                />
                            </React.Fragment>
                            : null}
                    </div>
                </div>
                <div>
                    {this.state.showDownloadSuccessNotification && this.props.downloadAgencyTasksState === 'SUCCESS' ?
                        <SuccessNotification
                            type='agencyNotification'
                            empCount={this.state.allTasksSelected ? this.props.tasksCount : this.state.selectedTasks.length}
                            message='tasks have been downloaded successfully'
                            boldText=''
                            closeNotification={this.closeSuccessNotification}
                            className={'mb-3'}
                        />
                        : this.state.showSuccessNotification ?
                            this.props.actionType === 'assign' || this.props.actionType === 'unassign' ?
                                <SuccessNotification
                                    type='agencyNotification'
                                    empCount={this.props.postAssignmentData && this.props.postAssignmentData.modifiedCount ? this.props.postAssignmentData.modifiedCount : 0}
                                    message={this.props.actionType === 'assign' ? 'unasssigned cases have been successfully assigned to'
                                        : this.getUserPreference() === 'AGENCY_USER' 
                                            ? 'assigned cases have been successfully unassigned'
                                            : 'cases have been successfully unassigned'
                                        }
                                    boldText={this.props.actionType === 'assign' ? this.state.assignedExecutive : ''}
                                    closeNotification={this.closeSuccessNotification}
                                    className={'mb-3'}
                                />
                                :
                                (this.props.reassignData && this.props.reassignData.actionType === 'reassign' ?
                                    (this.props.reassignData.selectedTasks === 0 ?
                                        <ErrorNotification
                                            type='agencyErrorNotification'
                                            error={"closed/same agency tasks cannot be re-assigned"}
                                            clicked={this.resetAddressError}
                                            className={'mb-3'}
                                        />
                                        :
                                        this.props.reassignData.selectedTasks > 0 ?
                                            <SuccessNotification
                                                type='agencyNotification'
                                                empCount={this.props.reassignData.selectedTasks}
                                                message={' cases have been successfully re-assigned to '}
                                                boldText={this.props.reassignData.agencyName}
                                                closeNotification={this.closeSuccessNotification}
                                                className={'mb-3'}
                                            /> : null)
                                    : null)
                                // :
                                // <SuccessNotification
                                //     type='agencyNotification'
                                //     empCount={this.props.postAssignmentData && this.props.postAssignmentData.modifiedCount ? this.props.postAssignmentData.modifiedCount : 0}
                                //     message={this.props.actionType === 'assign' ? 'unasssigned cases have been successfully assigned to'
                                //         : 'assigned cases have been successfully unassigned'}
                                //     boldText={this.props.actionType === 'assign' ? this.state.assignedExecutive : ''}
                                //     closeNotification={this.closeSuccessNotification}
                                //     className={'mb-3'}
                                // />)
                            : this.props.tasksList && this.state.selectedTasks.length === this.state.pageSize ?
                                <SuccessNotification
                                    type='selectAll'
                                    empCount={this.state.allTasksSelected ? this.props.tasksCount : this.state.selectedTasks.length}
                                    message={this.state.allTasksSelected ? 'tasks selected from all pages' : 'tasks selected from current page'}
                                    selectAllMsg={selectAllMsg}
                                    clickHandler={() => this.handleAllTaskSelection(selectAllMsg)}
                                    className={'mb-3'}
                                />
                                : null
                    }
                </div>

                {this.props.tasksCountState === 'LOADING' || this.props.tasksListState === 'LOADING' || this.props.searchResultsState === 'LOADING' ?
                    <Loader type='taskListLoader' />
                    :
                    !_.isEmpty(this.props.searchResults) || !_.isEmpty(this.props.tasksList) ?
                        <div className={cx('mt-1 mb-4', styles.Card)}>
                            <div className={cx('row no-gutters')} style={{ overflow: 'hidden' }}>
                                <span className={cx(styles.Heading, styles.Width1)}>{t('translation_addressVerification:taskList.name')}</span>
                                <span className={cx(styles.Heading, styles.Width2)}>{t('translation_addressVerification:taskList.pincode')}</span>
                                <span className={cx(styles.Heading, styles.Width3)}>{t('translation_addressVerification:taskList.assignedTo')}</span>
                                <span className={cx(styles.Heading, styles.Width4)}>{t('translation_addressVerification:taskList.caseStatus')}</span>
                                <span className={cx(styles.Heading, styles.Width5)}>{t('translation_addressVerification:taskList.tatLeft')}</span>
                            </div>

                            <hr style={{ marginLeft: '2rem', marginRight: '1rem' }} />
                            {this.state.appliedFilters && _.isEmpty(this.props.searchKey) && !_.isEmpty(this.props.tasksList) ?
                                <div className='row no-gutters'>
                                    <span className={styles.filtersMessage}>
                                        {t('translation_addressVerification:taskList.showingResults')}
                                    </span>
                                </div>
                                : null}
                            <div style={{ overflow: 'auto', maxHeight: '40rem' }} className={scrollStyle.scrollbarBlue}>
                                {!_.isEmpty(this.props.searchKey) ?
                                    (!_.isEmpty(this.props.searchResults) && showSearchResults ?
                                        this.props.searchResults.map((item, index) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    <HasAccess
                                                        permission={["PHYSICAL_ADDRESS:LIST", "POSTAL_ADDRESS:LIST"]}
                                                        yes={() => (
                                                            <TaskRow
                                                                key={index}
                                                                _id={item._id}
                                                                profilePicUrl={item.profilePicUrl}
                                                                name={item.fullName}
                                                                pincode={item.address.pincode}
                                                                assignedTo={item.agency ? item.agency.agency : 'unassigned'}
                                                                caseStatus={item.caseStatus}
                                                                tatLeft={item.tat}
                                                                handleSelectedTasks={() => this.handleSelectedTasks(item._id)}
                                                                selectedTasks={this.state.selectedTasks}
                                                                agencyEmpId={item.agencyEmpId}
                                                                allTasksSelected={this.state.allTasksSelected}
                                                            />
                                                        )}
                                                    />
                                                    <HasAccess denySuperAdminAccess
                                                        permission={["AGENCY_DASHBOARD:VIEW_ASSIGNED", "AGENCY_DASHBOARD:VIEW_ALL"]}
                                                        yes={() => (
                                                            <TaskRow
                                                                key={index}
                                                                _id={item._id}
                                                                profilePicUrl={item.profilePicUrl}
                                                                name={item.fullName}
                                                                pincode={item.address.pincode}
                                                                assignedTo={item.agencyExecutive ? (_.isEmpty(item.agencyExecutive.assignedTo) ? 'unassigned' : item.agencyExecutive.assignedTo) : 'unassigned'}
                                                                assigneeEmpId={item.agencyExecutive ? item.agencyExecutive.assigneeEmpId : ''}
                                                                caseStatus={item.caseStatus}
                                                                tatLeft={item.tat}
                                                                handleSelectedTasks={() => this.handleSelectedTasks(item._id)}
                                                                selectedTasks={this.state.selectedTasks}
                                                                agencyEmpId={item.agencyEmpId}
                                                                allTasksSelected={this.state.allTasksSelected}
                                                            />
                                                        )}
                                                    />
                                                </React.Fragment>
                                            )
                                        })
                                        :
                                        <div className={cx('d-flex justify-content-center', styles.Heading)}>{t('translation_addressVerification:taskList.noResults')}</div>
                                    )
                                    : !_.isEmpty(this.props.tasksList) ?
                                        this.props.tasksList.map((item, index) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    <HasAccess
                                                        permission={["PHYSICAL_ADDRESS:LIST", "POSTAL_ADDRESS:LIST"]}
                                                        yes={() => (
                                                            <TaskRow
                                                                key={index}
                                                                _id={item._id}
                                                                profilePicUrl={item.profilePicUrl}
                                                                name={item.fullName}
                                                                pincode={item.address.pincode}
                                                                assignedTo={item.agency ? item.agency.agency : 'unassigned'}
                                                                caseStatus={item.caseStatus}
                                                                tatLeft={item.tat}
                                                                handleSelectedTasks={() => this.handleSelectedTasks(item._id)}
                                                                selectedTasks={this.state.selectedTasks}
                                                                agencyEmpId={item.agencyEmpId}
                                                                allTasksSelected={this.state.allTasksSelected}
                                                            />
                                                        )}
                                                    />
                                                    <HasAccess denySuperAdminAccess
                                                        permission={["AGENCY_DASHBOARD:VIEW_ASSIGNED", "AGENCY_DASHBOARD:VIEW_ALL"]}
                                                        yes={() => (
                                                            <TaskRow
                                                                key={index}
                                                                _id={item._id}
                                                                profilePicUrl={item.profilePicUrl}
                                                                name={item.fullName}
                                                                pincode={item.address.pincode}
                                                                assignedTo={item.agencyExecutive ? (_.isEmpty(item.agencyExecutive.assignedTo) ? 'unassigned' : item.agencyExecutive.assignedTo) : 'unassigned'}
                                                                assigneeEmpId={item.agencyExecutive ? item.agencyExecutive.assigneeEmpId : ''}
                                                                caseStatus={item.caseStatus}
                                                                tatLeft={item.tat}
                                                                handleSelectedTasks={() => this.handleSelectedTasks(item._id)}
                                                                selectedTasks={this.state.selectedTasks}
                                                                agencyEmpId={item.agencyEmpId}
                                                                allTasksSelected={this.state.allTasksSelected}
                                                            />
                                                        )}
                                                    />
                                                </React.Fragment>
                                            )
                                        })
                                        : <EmptyState type='emptyTaskList' />
                                }
                            </div>

                            {this.state.actionType === 'assign' ?
                                <TaskListFooter
                                    selectedEmployee={this.state.selectedTasks}
                                    selectedTaskCount={this.state.allTasksSelected ? this.props.tasksCount : this.state.selectedTasks.length}
                                    closeFooter={() => this.handleActionSelect('')}
                                    actionType={this.state.actionType}
                                    handleAssign={(executiveName, executiveEmpId) => this.handleAssignment(executiveName, executiveEmpId)}
                                    searchExecutive={(searchKey) => this.handleExecutiveSearch(searchKey)}
                                    searchExecutiveResults={this.props.searchExecutiveResults}
                                />
                                : this.state.actionType === 'reassign' ?
                                    <TaskListFooter
                                        type='reassign'
                                        cardType={this.props.cardType}
                                        selectedEmployee={this.state.selectedTasks}
                                        selectedTaskCount={this.state.allTasksSelected ? this.props.tasksCount : this.state.selectedTasks.length}
                                        closeFooter={() => this.handleActionSelect('')}
                                        actionType={this.state.actionType}
                                        handleReassign={(verification, agency, id) => this.handleReassign(verification, agency, id)}
                                        onAgencyChange={(verificationType) => this.onAgencyChange(verificationType)}
                                    />
                                    : null}
                        </div>
                        : _.isEmpty(this.props.tasksList) ?
                            <EmptyState type={'address_verification'} />
                            : null}

                {this.state.actionType === "upload" ?
                    <UploadExcelPopUp
                        fileUpload={this.handleFileUpload}
                        uploadState={this.props.excelUploadTasksState}
                        processingState={this.props.processUploadedTasksState}
                        processedData={this.props.processedData}
                        closeFooter={() => this.handleActionSelect('')}
                        error={this.props.error}
                        downloadPostalErrorExcel={this.handleErrorExcelDownload}
                        excelErrorDownloadState={this.props.excelErrorDownloadTasksState}
                    />
                    : null}

            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        searchExecutiveResultsState: state.workloadMgmt.addressVerification.taskList.searchExecutiveResultsState,
        searchExecutiveResults: state.workloadMgmt.addressVerification.taskList.searchExecutiveResults,
        postAssignmentState: state.workloadMgmt.addressVerification.taskList.postAssignmentState,
        postAssignmentData: state.workloadMgmt.addressVerification.taskList.postAssignmentData,
        actionType: state.workloadMgmt.addressVerification.taskList.actionType,
        downloadAgencyTasksState: state.workloadMgmt.addressVerification.taskList.downloadAgencyTasksState,
        excelUploadTasksState: state.workloadMgmt.addressVerification.taskList.excelUploadTasksState,
        postalUploadId: state.workloadMgmt.addressVerification.taskList.postalUploadId,
        processUploadedTasksState: state.workloadMgmt.addressVerification.taskList.processUploadedTasksState,
        processedData: state.workloadMgmt.addressVerification.taskList.processedData,
        excelErrorDownloadTasksState: state.workloadMgmt.addressVerification.taskList.excelErrorDownloadTasksState,
        error: state.workloadMgmt.addressVerification.taskList.error,
        addressError: state.workloadMgmt.addressVerification.address.error,

        physicalTaskState: state.workloadMgmt.addressVerification.physicalAddress.postIndividualTaskState,
        physicalSuccessData: state.workloadMgmt.addressVerification.physicalAddress.physicalSuccessData,
        postalTaskState: state.workloadMgmt.addressVerification.postalAddress.postPostalTaskDetailsState,
        postalSuccessData: state.workloadMgmt.addressVerification.postalAddress.postalSuccessData,

        reassignDataState: state.workloadMgmt.addressVerification.address.reassignDataState,
        reassignData: state.workloadMgmt.addressVerification.address.reassignData,

        agencyListState: state.workloadMgmt.addressVerification.taskList.getAgencyTasksListState,
        agencyList: state.workloadMgmt.addressVerification.taskList.agencyTasksList,
        physicalAgencyList: state.workloadMgmt.addressVerification.taskList.physicalAgencyList,
        postalAgencyList: state.workloadMgmt.addressVerification.taskList.postalAgencyList,

        policies: state.auth.policies,
        user: state.auth.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onGetInitState: () => dispatch(actions.initState()),
        onSearchExecutive: (searchKey) => dispatch(actions.searchExecutive(searchKey)),
        onPostAssignment: (payload, actionType, selectAll, url, cardType) => dispatch(actions.postAssignment(payload, actionType, selectAll, url, cardType)),
        onDownloadPhysicalTasks: (allSelected, targetUrl, payload) => dispatch(actions.downloadTasks(allSelected, targetUrl, payload)),
        onDownloadPostalTasks: (allSelected, targetUrl, payload) => dispatch(actions.downloadPostalTasks(allSelected, targetUrl, payload)),
        onUploadExcelTasks: (formData) => dispatch(actions.uploadExcelTasks(formData)),
        onProcessUploadedTasks: (uploadId) => dispatch(actions.processUploadedTasks(uploadId)),

        onReassign: (payload, agencyName, actionType, selectedTasks) => dispatch(addressActions.reassignAgency(payload, agencyName, actionType, selectedTasks)),
        onGetAgencyList: (agencyType, postalAgencyList, physicalAgencyList) => dispatch(actions.getAgencyList(agencyType, postalAgencyList, physicalAgencyList)),

        onDownloadPostalErrorExcel: (type, errorPath) => dispatch(actions.downloadPostalErrorExcel(type, errorPath)),

        onResetError: () => dispatch({ type: actionTypes.RESET_ERROR }),
        onResetAddressError: () => dispatch({ type: addressActionTypes.RESET_ERROR })
    }
}

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(TaskList)));