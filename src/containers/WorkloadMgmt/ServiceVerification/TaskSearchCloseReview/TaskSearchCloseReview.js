import React, { Component } from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';
import cx from 'classnames';
import { withTranslation } from 'react-i18next';
import styles from './TaskSearchCloseReview.module.scss';

// import searchIcon from '../../../../assets/icons/search.svg';
import blueSearch from '../../../../assets/icons/blueSearch.svg';
import close from '../../../../assets/icons/spocClose.svg';
import downArrow from '../../../../assets/icons/downArrow.svg';

import HasAccess from '../../../../services/HasAccess/HasAccess';
import TaskCloseReview from './TaskCloseReview/TaskCloseReview';
import CustomDropdown from '../../../../components/Molecule/CustomDropdown/CustomDropdown';
import DownloadButton from '../../../../components/Atom/DownloadButton/DownloadButton';
import SuccessNotification from '../../../../components/Organism/Notifications/SuccessNotification/SuccessNotification';
import {
  nameHandler, permissionName, options, searchOptions, mobileRegex,
} from '../initData';
import TaskSearchList from './TaskSearchList/TaskSearchList';

import * as serviceVerificationActions from '../Store/action';
import * as OpsHomePageAction from '../../../Home/OpsHome/Store/action';
import * as imageStoreActions from '../../../Home/Store/action';

class TaskSearchCloseReview extends Component {

    state = {
        searchKey: '',
        searchResultSelectedTask: {},
        searchResults: [],
        showSearchResults: false,
        onFocusSearch: false,
        viewType: 'select view type',
        
        taskSearchFilter: 'in progress',
        taskFilterDropdown: false,
        showNotification: false,

        phyAddressViewType: 'task closure view',
        phyAddressDropdown: false,
        searchOption: 'by profile',
    }

    componentDidMount = () => {
        const thisRef = this;
        
        _.forEach(this.props.policies, function (policy) {
            if (_.includes(policy.businessFunctions, "HEALTH:DOWNLOAD") && ['health'].includes(thisRef.props.taskType)) {
                thisRef.props.getExcelCount(thisRef.props.taskType);
            }
            if (_.includes(policy.businessFunctions, "EDU_CHECK:DOWNLOAD") && ['education'].includes(thisRef.props.taskType)) {
                thisRef.props.getExcelCount(thisRef.props.taskType);
            }
        });
        
        this.setState({viewType: "single task view"})
    }

    componentDidUpdate = (prevProps, prevState) => {
        
        if (prevProps.postDocumentTasksState !== this.props.postDocumentTasksState && this.props.postDocumentTasksState === "SUCCESS") {
            if (this.state.taskSearchFilter === "in progress") {
                this.props.getDocuments();
            }
            this.setState({ searchResultSelectedTask: {}, searchKey: "",searchCompletedTasks: {}, searchInProgressTasks: {}})
        }
        
        if (this.props.searchData !== prevProps.searchData || this.props.searchCompletedData !== prevProps.searchCompletedData) {
            let updatedSearchResults = this.state.taskSearchFilter === "in progress" ? this.props.searchData : this.props.searchCompletedData;
            let thisRef = this;
            _.forEach(updatedSearchResults, function(searchResult){
                if(searchResult.profilePicUrl){
                    thisRef.props.onGetProfilePic(searchResult.empId , searchResult.profilePicUrl)
                }
            })
            this.setState({ showSearchResults: true, searchResults: updatedSearchResults });
        }

        if (this.props.getInProgressTasksState !== prevProps.getInProgressTasksState || this.props.getCompletedTasksState !== prevProps.getCompletedTasksState) {
            if (this.props.getCompletedTasksState === "SUCCESS" || this.props.getInProgressTasksState === "SUCCESS") {
                let updatedSearchResults = this.state.taskSearchFilter === "in progress" ? this.props.searchData : this.props.searchCompletedData;
                let thisRef = this;
                _.forEach(updatedSearchResults, function(searchResult){
                    if(searchResult.profilePicUrl){
                        thisRef.props.onGetProfilePic(searchResult.empId , searchResult.profilePicUrl)
                    }
                })
                this.setState({ searchResults: updatedSearchResults })
            }
        }
        
        if(this.props.excelDownloadState !== prevProps.excelDownloadState && this.props.excelDownloadState === "SUCCESS"){
            if(this.props.excelCountState !== prevProps.excelCountState && this.props.excelCountState === "SUCCESS") {
                this.setState({showNotification : true});   
                setTimeout(() => {
                    this.setState({ showNotification:  false});
                },3000); 
            }
        }
        
        if (this.props.getExcelDownloadTasksState !== prevProps.getExcelDownloadTasksState && this.props.getExcelDownloadTasksState === "SUCCESS") {
            if (this.props.excelTasksCountState === "SUCCESS" || this.props.excelPostalTasksCountState === "SUCCESS") {
                this.setState({ showNotification: true });
                setTimeout(() => {
                    this.setState({ showNotification: false });
                }, 3000);
            }
        }

        if(prevState.taskSearchFilter !== this.state.taskSearchFilter) {
            this.setState({searchResultSelectedTask: {},searchResults: []})
        }

        // unused code
        // if(this.props.postalService !== prevProps.postalService && prevProps.postalService !== "select service"){
        //    let key = this.state.searchKey;
        //    if (key.length >= 3) {
        //        if (this.state.taskSearchFilter === "in progress") {
        //            this.props.searchTasks(nameHandler[this.props.taskType], key, this.state.searchOption);
        //         }
        //         else {
        //             this.props.searchTasksCompleted(nameHandler[this.props.taskType], key, this.state.searchOption);
        //         }
        //     }
        //     this.setState({viewType : "single task view", taskSearchFilter:"in progress", searchResults : [] , searchResultSelectedTask : {}})
        // } 

        //postal service notification
        if (prevProps.processUploadedTasksState !== this.props.processUploadedTasksState && this.props.processUploadedTasksState === "ERROR") {
            this.setState({ showNotification: true })
            setTimeout(() => {
                this.setState({ showNotification: false });
            }, 3000);
        }

        if(prevProps.getUserInfoState !== this.props.getUserInfoState && this.props.getUserInfoState === "SUCCESS"){
            if(this.props.userInfo.profilePicUrl ){
                this.props.onGetProfilePic(this.props.userInfo.empId, this.props.userInfo.profilePicUrl)
            }
        }

        if (prevState.searchOption !== this.state.searchOption && !_.isEmpty(this.state.searchKey)
            && ((this.state.searchOption === 'by profile' && this.state.searchKey.length > 2)
                || (this.state.searchOption === 'by phone number' && mobileRegex.test(this.state.searchKey)))
        ) {
            if (this.state.taskSearchFilter === "in progress") {
                this.props.searchTasks(nameHandler[this.props.taskType], this.state.searchKey, this.state.searchOption);
            } else {
                this.props.searchTasksCompleted(nameHandler[this.props.taskType], this.state.searchKey, this.state.searchOption);
            }
        }
    }

    handleEmployeeSearch = (event) => {    
        let key;
        if(_.isEmpty(this.state.searchResults)){
            document.addEventListener('click', this.handleOutsideSearchBarClick,false);
        } else {
            document.removeEventListener('click', this.handleOutsideSearchBarClick, false);
        }
        
        if(event) {
            key = event.target.value
            this.setState({ searchKey: event.target.value })
            if ((key.length > 2 && this.state.searchOption === 'by profile')
            || (key.length > 2 && this.state.searchOption === 'by phone number' && mobileRegex.test(key))) {
                if (this.state.taskSearchFilter === "in progress") {
                    this.props.searchTasks(nameHandler[this.props.taskType], key, this.state.searchOption);
                }
                else {
                    this.props.searchTasksCompleted(nameHandler[this.props.taskType], key, this.state.searchOption);
                }
            }
        }
        else {
            this.setState({searchResults: []})
        }
    }

    handleOutsideSearchBarClick = (e) => {
        if (!_.isEmpty(this.node)) {
            if (this.node.contains(e.target)) {
              return;
            }
            this.handleEmployeeSearch();
        }
    }


    handleSelectedTaskType = (filter) => {
        this.setState({ taskSearchFilter: filter, taskFilterDropdown: false, showSearchResults: false, searchResultSelectedTask:{} })

        if (!_.isEmpty(this.state.searchKey) && this.state.searchKey.length >= 3) {
            if (this.state.searchOption === 'by profile' || (this.state.searchOption === 'by phone number' && mobileRegex.test(this.state.searchKey))) {
                if (filter === "in progress") {
                    this.props.searchTasks(nameHandler[this.props.taskType], this.state.searchKey, this.state.searchOption);
                } else {
                    this.props.searchTasksCompleted(nameHandler[this.props.taskType], this.state.searchKey, this.state.searchOption);
                }
            }
        }
    }

    handleSelectedTask = (data) => {
        let service = data.service;
        if(service === "CRC_PERMANENT_ADDRESS" || service === "CRC_CURRENT_ADDRESS") {
            service = "crc";
        }
        else if(service === "POLICE_VERIFICATION"){
            service = "pvc";
        }
        if(this.props.taskType === "addressReview"){
            service = "address_review";
        }
        
        if (data.queue === "main") {
            this.props.WorkLoadTransfer(service.toLowerCase(), data.serviceRequestId);
        }
        else if(this.state.taskSearchFilter === "in progress" && data.queue === "inProgress"){
            this.props.getUserInfo(data.userId);
        }
        this.setState({ 
            searchResultSelectedTask: data, 
            showSearchResults: false, 
            searchKey: this.state.searchOption === 'by phone number' ? this.state.searchKey : data.fullName })
    }

    downloadExcelHandler = () => {
        this.props.onDownloadExcel(this.props.taskType);
    }

    clearSelectedData = () => {
        this.setState({searchResultSelectedTask:{}})
    }

    onFocus = () => {
        this.setState({ onFocusSearch: true })
    }
    
    onBlur = () => {
    if (this.state.searchKey === '')
        this.setState({ onFocusSearch: false })
    }
    
    handleClearSearch = () => {
        this.setState({ searchKey: '', onFocusSearch: false })
    }

    handleViewType = (viewType) => {
        if(viewType !== 'select view type') {
            this.setState({ viewType: viewType , searchResultSelectedTask: {}, searchKey: ""})
        }
    }

    downloadPvcTasksHandler = () => {
        this.props.onDownloadPvcTasks('police verification tasks');
    }

    handleSearchOption = (value) => {
        this.setState({ searchOption: value,  searchKey : ''});
    }

    render () {
        const { t } = this.props;
        let showSearchResult = false;
        if ((this.state.searchKey.length > 2 && !mobileRegex.test(this.state.searchKey) && this.state.searchOption === 'by phone number')) {
            showSearchResult = true;
        }

        return(
        <React.Fragment>
            <React.Fragment>
                <div className={cx('row no-gutters col-12 d-flex justify-content-between pb-3 px-0')} ref={node => { this.node = node; }}>
                    {this.state.viewType === "single task view" ? 
                        <div className={cx("col-7 d-flex")}>
                            {/* <img src={searchIcon} alt={t('translation_docVerification:image_alt_docVerification.search')} className='pr-2' /> */}
                            <CustomDropdown
                                options={searchOptions}
                                changed={(value) => this.handleSearchOption(value)}
                                className="col-4 px-0"
                                value={this.state.searchOption}
                                disabled={false}
                                searchIcon={blueSearch}
                            />
                            <input
                                type='text'
                                placeholder={this.state.searchOption === 'by profile' ?
                                    t('translation_docVerification:searchByName') : t('translation_docVerification:searchByPhone')}
                                value={this.state.searchKey}
                                className={cx('pl-2', styles.searchBar, this.state.onFocusSearch ? styles.Focus : styles.NoFocus)}
                                onPaste={(event) => this.handleEmployeeSearch(event)}
                                onChange={(event) => this.handleEmployeeSearch(event)}
                                disabled={this.props.taskType === "postalAddress" && this.props.postalService === 'select service' ? true : false}
                                onFocus={this.onFocus}
                                onBlur={this.onBlur}
                            />
                            {this.state.searchKey !== '' ? <img src={close} onClick={this.handleClearSearch} style={{ height: '0.75rem', marginTop: '1rem', cursor: 'pointer' }} alt='' /> : null}
                        </div>
                    : 
                        <div className="col-7"></div>
                    }

                    {nameHandler[this.props.taskType] === "health" ||  nameHandler[this.props.taskType] === "education" ?
                        <HasAccess 
                            permission={[permissionName[this.props.taskType] + "DOWNLOAD"]}
                            yes={() => (
                                <DownloadButton
                                    type='opsDownloadTask'
                                    label={t('translation_docVerification:downloadTasks') + (this.props.excelCount ? '(' + this.props.excelCount.count + ')' : '')}
                                    className={cx(styles.customWidth, styles.customHeight)}
                                    downloadState={this.props.excelDownloadState}
                                    clickHandler={this.props.excelDownloadState === 'LOADING' ? null : this.downloadExcelHandler}
                                    disabled={this.state.taskSearchFilter === "closed" || (this.props.excelCount ? this.props.excelCount.count === 0 : false)}
                                />
                            )}
                        />
                        : nameHandler[this.props.taskType] === "pvc" ?
                            <HasAccess
                                permission={[permissionName[this.props.taskType] + "DOWNLOAD",permissionName[this.props.taskType] + "UPLOAD"]}
                                yes={() => (
                                    <DownloadButton
                                        type='opsDownloadTask'
                                        label={t('translation_docVerification:downloadTasks')}
                                        className={cx(styles.customWidth, styles.customHeight)}
                                        downloadState={this.props.getExcelDownloadTasksState}
                                        clickHandler={this.props.getExcelDownloadTasksState === 'LOADING' ? null : this.downloadPvcTasksHandler}
                                        disabled={this.state.taskSearchFilter === "closed"}
                                    />
                                    // <CustomDropdown
                                    //     options={options.viewOptions}
                                    //     changed={(value) => this.handleViewType(value)}
                                    //     className={styles.customWidth}
                                    //     value={this.state.viewType}
                                    //     disabled={(this.props.taskType === 'postalAddress' && this.props.postalService === 'select service') || this.state.taskSearchFilter === "closed"}
                                    // />
                                )}
                            />
                            : null 
                    }

                    <HasAccess 
                        permission={[permissionName[this.props.taskType] + 'CLOSE',permissionName[this.props.taskType] + 'REVIEW']}
                        yes={() => (
                            <CustomDropdown
                                options={options.taskStatusOptions}
                                changed={(value) => this.handleSelectedTaskType(value)}
                                className={styles.progressWidth}
                                value={this.state.taskSearchFilter}
                                disabled={( (this.props.taskType === "police" || this.props.taskType === "postalAddress") && this.state.viewType === "excel upload/download") ||
                                (this.props.taskType === 'postalAddress' && this.props.postalService === 'select service')}
                            />
                        )}
                        no={()=> (
                            <div className={cx(styles.Select, "col-2 d-flex justify-content-between pr-2")} disabled={true}>
                                <span className={cx(styles.filterText, "text-nowrap")}>{this.state.taskSearchFilter}</span>
                                <span><img className={cx(styles.imgColor, styles.Rotate)} src={downArrow} alt="" /></span>
                            </div>
                        )}
                    />
                </div>

                
                {this.state.showSearchResults || showSearchResult ? 
                    <TaskSearchList 
                        searchResults = {this.state.searchResults}
                        handleSelectedTask = {(task) => this.handleSelectedTask(task)}
                        verificationType = {this.props.taskType}
                    />
                : ""} 

                
                {this.state.showNotification ?
                    (this.props.taskType === "police" ?
                        <SuccessNotification type="excelNotification" excelCount={this.props.pvcTasksCount.count} verificationType={"police"} />
                        : <SuccessNotification type="excelNotification" excelCount={this.props.excelCount.count} verificationType={nameHandler[this.props.taskType]} />
                    )
                : ''}
            </React.Fragment>

            <TaskCloseReview
                cardType={nameHandler[this.props.taskType]}
                cardNumber={this.props.cardNumber}
                searchResult={this.state.searchResultSelectedTask}
                searchType={this.state.taskSearchFilter}
                userInfo={this.props.userInfo}
                clearSelectedData={this.clearSelectedData}
                viewType={this.state.viewType}
                addressViewType={this.state.phyAddressViewType}
                postalService={this.props.postalService}
            />

        </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        postDocumentTasksState: state.workloadMgmt.DocVerification.postDocumentTasksState,
        searchData: state.workloadMgmt.DocVerification.searchData,
        searchCompletedData: state.workloadMgmt.DocVerification.searchCompletedData,
        getInProgressTasksState: state.workloadMgmt.DocVerification.getInProgressTasksState,
        getCompletedTasksState: state.workloadMgmt.DocVerification.getCompletedTasksState,
        userInfo: state.workloadMgmt.DocVerification.userInfo,
        getUserInfoState : state.workloadMgmt.DocVerification.getUserInfoState,
        excelDownloadState : state.workloadMgmt.DocVerification.getDownloadTaskPocState,
        excelCountState: state.workloadMgmt.DocVerification.getExcelCountState,
        excelCount: state.workloadMgmt.DocVerification.excelCount,
        getExcelDownloadTasksState: state.workloadMgmt.DocVerification.getExcelDownloadTasksState,
        excelTasksCountState : state.workloadMgmt.DocVerification.excelTasksCountState,
        excelPostalTasksCountState :  state.workloadMgmt.DocVerification.excelPostalTasksCountState,
        pvcTasksCount: state.workloadMgmt.DocVerification.pvcTasksCount,
        postalTasksCount: state.workloadMgmt.DocVerification.postalTasksCount,
        getAddressPictureState: state.imageStore.getAddressPictureState,
        processUploadedTasksState: state.workloadMgmt.DocVerification.processUploadedTasksState,
        processUploadedTasksError: state.workloadMgmt.DocVerification.error,

        policies: state.auth.policies,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getDocuments: () => dispatch(OpsHomePageAction.getDocuments()),
        getPostalCount: (type,agencyName) => dispatch(serviceVerificationActions.excelTasksCount(type,agencyName)),
        searchTasks: (service, key, searchOption) => dispatch(serviceVerificationActions.searchInProgressTasks(service, key, searchOption)),
        searchTasksCompleted: (service, key, searchOption) => dispatch(serviceVerificationActions.searchCompletedTasks(service, key, searchOption)),
        WorkLoadTransfer: (service, serviceRequestId) => dispatch(serviceVerificationActions.WorkLoadTransfer(service, serviceRequestId)),
        getUserInfo: (userId) => dispatch(serviceVerificationActions.getUserInfo(userId)),
        onDownloadExcel: (service) => dispatch(serviceVerificationActions.downloadTask(service)),
        getExcelCount: (service) => dispatch(serviceVerificationActions.getExcelCount(service)),
        onGetProfilePic: (empId, filePath) => dispatch(imageStoreActions.getProfilePic(empId, filePath)) ,
        getAgencyTypeCount :(agencyType) => dispatch(serviceVerificationActions.getAgencyTypeCount(agencyType)),

        onDownloadPvcTasks: (type) => dispatch(serviceVerificationActions.downloadExcelTasks(type)),
    }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(TaskSearchCloseReview));
