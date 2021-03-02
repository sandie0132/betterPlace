import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import _ from 'lodash';
import cx from 'classnames';
import styles from './ExcelOnboarding.module.scss';

import * as actions from './Store/action';
import * as onboardingActions from '../EmpAddNewModal/Store/action';
import * as imageStoreActions from "../../../Home/Store/action";

import CardHeader from '../../../../components/Atom/PageTitle/PageTitle';
import ArrowLink from '../../../../components/Atom/ArrowLink/ArrowLink';
import Loader from '../../../../components/Organism/Loader/Loader';

import excelIcon from '../../../../assets/icons/excelOnboarding.svg';
import excelUpload from '../../../../assets/icons/excelUpload.svg';
import excelSuccess from '../../../../assets/icons/excelSuccess.svg';
import stop from '../../../../assets/icons/stop.svg';
import stopBg from '../../../../assets/icons/stopWithBackground.svg';
import excelConfirmed from '../../../../assets/icons/excelConfirmationPopup.svg';

import ExcelUpload from '../../../../components/Molecule/ExcelUpload/ExcelUpload';
import ExcelUploadIndicator from '../../../../components/Molecule/ExcelUploadIndicator/ExcelUploadIndicator';
import { Button } from 'react-crux';
import WarningPopUp from '../../../../components/Molecule/WarningPopUp/WarningPopUp';
import ProgressSlider from '../../../../components/Molecule/ProgressBarSlider/ProgressBarSlider';
import VerificationExcel from './VerificationExcel/VerificationExcel';
import ResultCard from './ResultCard/ResultCard';
import scrollStyle from '../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import LockedUpperCard from './LockedUpperCard/LockedUpperCard';

class ExcelOnboarding extends Component {

    state = {
        orgId: null,
        scanDocument: 'INIT',
        processData: 'INIT',
        processCompleted: 'INIT',

        fileName: '',
        scannedRowCount: 0,
        totalRows: 0,
        successScannedCount: 0,

        uploadResponse: null,
        processActions: [],

        downloadExcel: 'download excel',
        showExcelConfirmationPopup: false,
        showStopPopUp: false,
        errorExcel: null,
        showSuccessCard: false
    }

    componentDidMount = () => {
        const { match } = this.props;
        const orgId = match.params.uuid;
        this.setState({ orgId: orgId });

        //if user has clicked on stop process - reset the page
        if (!_.isEmpty(this.props.stopProcessData) && this.props.stopProcessData.status === 'success') {
            this.props.onGetInitState();
        }
        //check excel status inside data
        this.props.onCheckFile(orgId);
    }

    componentDidUpdate = (prevProps, prevState) => {

        let thisRef = this;

        //if already file uploaded - scanned - processed
        if (prevProps.checkExcelStatusState !== this.props.checkExcelStatusState && this.props.checkExcelStatusState === 'SUCCESS') {
            if (!_.isEmpty(this.props.checkExcelStatus)) {
                //user api to lock/unlock excel screen
                this.props.onGetUserDetails(this.state.orgId, this.props.checkExcelStatus.userId);

                //reset state and reducer if status=done
                if (!_.isEmpty(this.props.checkExcelStatus.status) && this.props.checkExcelStatus.status === 'done') {
                    this.handleNextUpload('now');
                }

                else if (!_.isEmpty(this.props.checkExcelStatus.status) && this.props.checkExcelStatus.status !== 'done') {
                    //check for any error files to download
                    if (!_.isEmpty(this.props.checkExcelStatus.errorFileUrl)) {
                        this.setState({ errorExcel: this.props.checkExcelStatus.errorFileUrl })
                    }
                    //check if file has been uploaded and update accordingly
                    if (!_.isEmpty(this.props.checkExcelStatus.fileUrl)) {
                        let fileName = this.props.checkExcelStatus.fileUrl.split('/');
                        fileName = fileName[fileName.length - 1]
                        this.setState({ fileName: fileName })
                    }
                    //if excel has been processed, check and update state
                    if (this.props.checkExcelStatus.currentStatus === 'processed' && !_.isEmpty(this.props.checkExcelStatus.processedDetails)) {
                        this.handlePropsToState(this.props.checkExcelStatus.processedDetails, 'process', []);
                    }
                    //check if processing is half done only
                    else if (this.props.checkExcelStatus.currentStatus === 'processing') {
                        this.props.onProcessData(this.state.orgId, this.props.checkExcelStatus._id);
                        this.handlePropsToState(this.props.checkExcelStatus.scannedDetails, 'scan', []);
                    }
                    //if excel has been scanned, not processed, then update state
                    else if (!_.isEmpty(this.props.checkExcelStatus.scannedDetails)) {
                        this.handlePropsToState(this.props.checkExcelStatus.scannedDetails, 'scan', []);
                    }
                    //if only upload stage success and scanning failed
                    else if (this.props.checkExcelStatus.currentStatus === 'uploaded') {
                        this.handleRetry();
                    }
                }
            }
        }

        //call socket connection if processDataStatus api successful
        if (prevProps.processDataStatusState !== this.props.processDataStatusState && this.props.processDataStatusState === 'SUCCESS') {
            if (!_.isEmpty(this.props.checkExcelStatus)) {
                this.props.onProcessData(this.state.orgId, this.props.checkExcelStatus._id);
            }
            else {
                this.props.onProcessData(this.state.orgId, this.props.uploadResponse.data._id);
            }
        }

        //get profile pic of logged_in user
        if (prevProps.userDetails !== this.props.userDetails && this.props.userDetailsState === 'SUCCESS') {
            if (this.props.userDetails.data && !_.isEmpty(this.props.userDetails.data.profilePicUrl) && !_.isEmpty(this.props.userDetails.data.uuid)) {
                this.props.onGetProfilePic(this.props.userDetails.data.uuid, this.props.userDetails.data.profilePicUrl)
            }
        }

        //scan success case
        if (this.props.scannedRowCount === this.props.totalRows && this.state.scanDocument !== 'SUCCESS') {
            this.setState({ scanDocument: 'SUCCESS', processData: 'LOADING' })
        }

        //scan error case - socket api
        if (prevProps.socketConnectionState !== this.props.socketConnectionState && this.props.socketConnectionState === 'ERROR') {
            this.setState({ scanDocument: 'ERROR' })
        }

        //after scan completed successfully
        if (prevProps.dataCount !== this.props.dataCount && this.state.scanDocument === 'SUCCESS') {
            this.handlePropsToState('', '', []);
        }

        //after upload success, call socket api
        if (this.props.uploadFileState !== prevProps.uploadFileState && this.props.uploadFileState === 'SUCCESS') {
            if (this.props.uploadResponse !== null) {
                this.props.onGetSocketData(this.props.uploadResponse.data._id)
                this.setState({ scanDocument: 'LOADING', uploadResponse: this.props.uploadResponse.data })
            }
        }

        //if process socket connection success, update process data obj accordingly
        if (this.props.processDataCount !== prevProps.processDataCount && this.props.processSocketConnectionState === 'SUCCESS') { //socket - change status of processActions from init-loading-success
            _.forEach(this.state.processActions, function (action) {
                //to resume process if connection fails in between
                if (thisRef.props.processDataCount.count !== prevProps.processDataCount.count
                    && thisRef.props.processDataCount.type === 'onboard' && action.actionType === 'onboard') {
                    action.actionStatus = 'LOADING'
                    action.count = thisRef.props.processDataCount.count
                }
                if (thisRef.props.processDataCount.count !== prevProps.processDataCount.count
                    && thisRef.props.processDataCount.type === 'update' && action.actionType === 'update') {
                    action.actionStatus = 'LOADING'
                    action.count = thisRef.props.processDataCount.count
                }
                if (thisRef.props.processDataCount.count !== prevProps.processDataCount.count
                    && thisRef.props.processDataCount.type === 'terminate' && action.actionType === 'terminate') {
                    action.actionStatus = 'LOADING'
                    action.count = thisRef.props.processDataCount.count
                }
            })
            //shows success when process completed
            _.forEach(this.state.processActions, function (action) {
                if (thisRef.props.processDataCount.onboardCount > 0 && thisRef.props.processDataCount.onboardErrorCount === 0 && action.actionType === 'onboard') {
                    action.actionStatus = 'SUCCESS'
                }
                else if (thisRef.props.processDataCount.onboardErrorCount > 0 && action.actionType === 'onboard') {
                    action.actionStatus = 'ERROR'
                }
                if (thisRef.props.processDataCount.updateCount > 0 && thisRef.props.processDataCount.updateErrorCount === 0 && action.actionType === 'update') {
                    action.actionStatus = 'SUCCESS'
                }
                else if (thisRef.props.processDataCount.updateErrorCount > 0 && action.actionType === 'update') {
                    action.actionStatus = 'ERROR'
                }
                if (thisRef.props.processDataCount.terminateCount > 0 && thisRef.props.processDataCount.terminateErrorCount === 0 && action.actionType === 'terminate') {
                    action.actionStatus = 'SUCCESS'
                }
                else if (thisRef.props.processDataCount.terminateErrorCount > 0 && action.actionType === 'terminate') {
                    action.actionStatus = 'ERROR'
                }
            })
            this.setState({ processData: 'SUCCESS', processCompleted: 'SUCCESS' })
        }

        //if process socket connection failed, update process data obj to init state
        if (prevProps.processSocketConnectionState !== this.props.processSocketConnectionState && this.props.processSocketConnectionState === 'ERROR') {
            let updatedProcessActions = [];
            let propsData = !_.isEmpty(this.props.dataCount) ? this.props.dataCount : this.props.checkExcelStatus.scannedDetails;
            if (!_.isEmpty(propsData)) {
                Object.entries(propsData).forEach(key => {
                    let data = {
                        actionType: '',
                        actionStatus: 'INIT',
                        count: null
                    };
                    if (key[0] === 'onboardedCount' && key[1] > 0) {
                        data.actionType = 'onboard'
                        data.actionStatus = 'INIT'
                        data.count = key[1]
                        updatedProcessActions.push(data);
                    }
                    else if ((key[0] === 'updateCount' || key[0] === 'updatedCount') && key[1] > 0) {
                        data.actionType = 'update'
                        data.actionStatus = 'INIT'
                        data.count = key[1]
                        updatedProcessActions.push(data);
                    }
                    else if (key[0] === 'terminatedCount' && key[1] > 0) {
                        data.actionType = 'terminate'
                        data.actionStatus = 'INIT'
                        data.count = key[1]
                        updatedProcessActions.push(data);
                    }
                })
            }
            this.setState({ processData: 'ERROR', processCompleted: 'ERROR', processActions: updatedProcessActions })
        }

        //error excel download - and show pop up - upload now or later
        if (prevProps.downloadErrorFileState !== this.props.downloadErrorFileState && this.props.downloadErrorFileState === 'SUCCESS') {
            this.setState({ downloadExcel: 'downloaded excel', showExcelConfirmationPopup: true })
        }

        //if clicked done without bgvInitiate - redirect to empList page after api success
        if (prevProps.changeStatusState !== this.props.changeStatusState && this.props.changeStatusState === 'SUCCESS') {
            let redirectPath = '/customer-mgmt/org/' + this.state.orgId + '/employee?isActive=true';
            this.props.history.push(redirectPath);
        }
    }

    handleRetry = () => { //called if scanning has failed
        this.setState({ scanDocument: 'LOADING' })
        if (!_.isEmpty(this.props.checkExcelStatus)) {
            this.props.onGetSocketData(this.props.checkExcelStatus._id);
        }
        else {
            this.props.onGetSocketData(this.props.uploadResponse.data._id);
        }
    }

    componentWillUnmount = () => {
        this.props.onGetInitState();

        //closing socket for both scan/process
        if (!_.isEmpty(this.props.scanSocket)) {
            this.props.scanSocket.close();
        }
        if (!_.isEmpty(this.props.processSocket)) {
            this.props.processSocket.close();
        }
        // this.setState({
        //     scanDocument: 'INIT',
        //     processData: 'INIT',
        //     processCompleted: 'INIT',
        //     fileName: '',
        //     scannedRowCount: 0,
        //     totalRows: 0,
        //     successScannedCount: 0,
        //     uploadResponse: null,
        //     processActions: [],
        //     downloadExcel: 'download excel',
        //     showExcelConfirmationPopup: false,
        //     showStopPopUp: false,
        //     errorExcel: null,
        //     showSuccessCard: false
        // })
    }

    uploadFile = (file) => {
        let formData = new FormData();
        formData.append('file', file);
        this.setState({ fileName: file.name });
        this.props.onUploadFile(formData, this.state.orgId, file.name);
    }

    handlePropsToState = (props, type, processActions) => {
        let updatedProcessActions = processActions;
        let successScannedCount = this.state.successScannedCount;
        let onboardFlag = false, updateFlag = false, terminateFlag = false;
        let onboardError = false, updateError = false, terminateError = false;

        if (!_.isEmpty(props)) {
            if (type === 'process') {
                Object.entries(props).forEach(key => {
                    if (key[0] === 'onboardCount' && key[1] > 0) {
                        onboardFlag = true;
                    }
                    else if (key[0] === 'onboardErrorCount' && key[1] > 0) {
                        onboardFlag = true;
                        onboardError = true;
                    }
                    else if (key[0] === 'terminateCount' && key[1] > 0) {
                        terminateFlag = true;
                    }
                    else if (key[0] === 'terminateErrorCount' && key[1] > 0) {
                        terminateFlag = true;
                        terminateError = true;
                    }
                    else if (key[0] === 'updateCount' && key[1] > 0) {
                        updateFlag = true;
                    }
                    else if (key[0] === 'updateErrorCount' && key[1] > 0) {
                        updateFlag = true;
                        updateError = true;
                    }
                })
                if (onboardFlag) {
                    let data = {
                        actionType: 'onboard',
                        actionStatus: onboardError ? 'ERROR' : 'SUCCESS'
                    };
                    updatedProcessActions.push(data);
                }
                if (updateFlag) {
                    let data = {
                        actionType: 'update',
                        actionStatus: updateError ? 'ERROR' : 'SUCCESS'
                    };
                    updatedProcessActions.push(data);
                }
                if (terminateFlag) {
                    let data = {
                        actionType: 'terminate',
                        actionStatus: terminateError ? 'ERROR' : 'SUCCESS'
                    };
                    updatedProcessActions.push(data);
                }
            }
            else {//if scan
                Object.entries(props).forEach(key => {
                    let data = {
                        actionType: '',
                        actionStatus: 'INIT',
                        count: null
                    };
                    if (key[0] === 'onboardedCount' && key[1] > 0) {
                        data.actionType = 'onboard'
                        data.actionStatus = 'INIT'
                        data.count = key[1]
                        updatedProcessActions.push(data);
                    }
                    else if (key[0] === 'updatedCount' && key[1] > 0) {
                        data.actionType = 'update'
                        data.actionStatus = 'INIT'
                        data.count = key[1]
                        updatedProcessActions.push(data);
                    }
                    else if (key[0] === 'terminatedCount' && key[1] > 0) {
                        data.actionType = 'terminate'
                        data.actionStatus = 'INIT'
                        data.count = key[1]
                        updatedProcessActions.push(data);
                    }
                })
            }
        }
        else {
            if (!_.isEmpty(this.props.dataCount)) {
                Object.entries(this.props.dataCount).forEach(key => {
                    let data = {
                        actionType: '',
                        actionStatus: 'INIT',
                        count: null
                    };

                    if (key[0] === 'onboardedCount' && key[1] > 0) {
                        data.actionType = 'onboard'
                        data.actionStatus = 'INIT'
                        data.count = key[1]
                        successScannedCount += key[1]
                        updatedProcessActions.push(data);
                    }
                    else if (key[0] === 'updateCount' && key[1] > 0) {
                        data.actionType = 'update'
                        data.actionStatus = 'INIT'
                        data.count = key[1]
                        successScannedCount += key[1]
                        updatedProcessActions.push(data);
                    }
                    else if (key[0] === 'terminatedCount' && key[1] > 0) {
                        data.actionType = 'terminate'
                        data.actionStatus = 'INIT'
                        data.count = key[1]
                        successScannedCount += key[1]
                        updatedProcessActions.push(data);
                    }
                })
            }
        }
        if (type === 'process') { this.setState({ processCompleted: 'SUCCESS' }) }
        this.setState({ processActions: updatedProcessActions, scanDocument: 'SUCCESS', processData: 'SUCCESS', successScannedCount: successScannedCount })
    }

    handleProcess = () => {//called for processing excel
        let updatedProcessActions = _.cloneDeep(this.state.processActions);
        updatedProcessActions.forEach(action => {
            if (action.actionStatus === 'INIT' && action.count > 0) {
                action.actionStatus = 'LOADING';
            }
        })
        this.setState({ processData: 'LOADING', processCompleted: 'LOADING', processActions: updatedProcessActions })

        if (!_.isEmpty(this.props.checkExcelStatus)) {
            this.props.onProcessDataStatus(this.state.orgId, this.props.checkExcelStatus._id);
            // this.props.onProcessData(this.state.orgId, this.props.checkExcelStatus._id)
        }
        else {
            this.props.onProcessDataStatus(this.state.orgId, this.props.uploadResponse.data._id);
            // this.props.onProcessData(this.state.orgId, this.props.uploadResponse.data._id)
        }
    }

    handleStopProcessing = (type) => {//called for stop_process after scan & before process
        if (!_.isEmpty(type)) {
            if (type === 'yes') {//redirect to empList page if user clicks on 'upload_later'
                if (!_.isEmpty(this.props.checkExcelStatus)) {
                    this.props.onStopProcess(this.state.orgId, this.props.checkExcelStatus._id)
                }
                else {
                    this.props.onStopProcess(this.state.orgId, this.props.uploadResponse.data._id)
                }
                let redirectPath = '/customer-mgmt/org/' + this.state.orgId + '/employee?isActive=true';
                this.props.history.push(redirectPath);
            }
            else if (type === 'new') {//stop process api call
                if (!_.isEmpty(this.props.checkExcelStatus)) {
                    this.props.onStopProcess(this.state.orgId, this.props.checkExcelStatus._id)
                }
                else {
                    this.props.onStopProcess(this.state.orgId, this.props.uploadResponse.data._id)
                }
                this.handleNextUpload('now');//reset state and reducer
            }
            else if (type === 'resetFile') {//upload failed
                this.props.onCheckFile(this.state.orgId);
            }
            this.setState({ showStopPopUp: false })
        }
    }

    handleDownload = () => {//download error excel
        this.setState({ downloadExcel: 'downloading excel', showSuccessCard: false });
        // if (!_.isEmpty(this.props.checkExcelStatus)) {
        //     this.props.onDownloadExcelStatus(this.state.orgId, this.props.checkExcelStatus._id);
        // }
        // else {
        //     this.props.onDownloadExcelStatus(this.state.orgId, this.props.uploadResponse.data._id);
        // }
        const monthObject = {
            1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun", 7: "Jul", 8: "Aug",
            9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"
        }
        const dt = new Date();
        const updatedDate = dt.getDate() + monthObject[dt.getMonth() + 1];
        let updatedTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const fileName = "excel_error_" + updatedDate + "_" + updatedTime;
        this.props.onDownloadErrorExcel(this.state.orgId, fileName);
    }

    handleTemplateDownload = () => {
        this.props.onDownloadExcelTemplate();
    }

    handleNextUpload = (type, action) => {
        if (type === 'later') {
            if (action === 'done') {//user clicks on done without bgv initiate
                // let initiateCount = !_.isEmpty(this.props.checkExcelStatus) && this.props.checkExcelStatus.processedDetails ? this.props.checkExcelStatus.processedDetails.initiateCount : this.props.processDataCount.initiateCount;
                // let reinitiateCount = !_.isEmpty(this.props.checkExcelStatus) && this.props.checkExcelStatus.processedDetails ? this.props.checkExcelStatus.processedDetails.reInitiateCount : this.props.processDataCount.reInitiateCount;

                //checking for initiation status and making it done
                // if ((this.props.bgvInitiateExcelState === 'INIT' && initiateCount > 0) || (this.props.reinitiateExcelState === 'INIT' && reinitiateCount > 0)) {
                if (!_.isEmpty(this.props.checkExcelStatus)) {
                    this.props.onChangeStatus(this.state.orgId, this.props.checkExcelStatus._id);
                }
                else {
                    this.props.onChangeStatus(this.state.orgId, this.props.uploadResponse.data._id);
                }
                // }
            }
            else {//redirect to empList page
                let redirectPath = '/customer-mgmt/org/' + this.state.orgId + '/employee?isActive=true';
                this.props.history.push(redirectPath);
            }
        }
        else {
            // if (action === 'done') { //user clicks on "restart excel onboarding" button - call done api
            //     if (!_.isEmpty(this.props.checkExcelStatus)) {
            //         this.props.onChangeStatus(this.state.orgId, this.props.checkExcelStatus._id);
            //     }
            //     else {
            //         this.props.onChangeStatus(this.state.orgId, this.props.uploadResponse.data._id);
            //     }
            // }
        }
        this.props.onGetInitState();
        this.setState({
            scanDocument: 'INIT',
            processData: 'INIT',
            processCompleted: 'INIT',
            fileName: '',
            scannedRowCount: 0,
            totalRows: 0,
            successScannedCount: 0,

            uploadResponse: null,
            processActions: [],

            downloadExcel: 'download excel',
            showExcelConfirmationPopup: false,
            showStopPopUp: false,
            errorExcel: null,
            showSuccessCard: false
        })
    }

    handleVerification = (verificationProps, verificationState) => {
        //all steps success -> show green card
        if (verificationProps.initiateCount > 0 || verificationProps.initiateCount === 0) {
            this.setState({ showSuccessCard: true })
        }
        else if (verificationProps.reinitiateCount > 0 || verificationProps.reinitiateCount === 0) {
            this.setState({ showSuccessCard: true })
        }
        else if (verificationProps.terminateCount > 0 && verificationProps.initiateCount === 0 && verificationProps.reinitiateCount === 0) {
            this.setState({ showSuccessCard: true })
        }
    }

    toggleStop = () => {
        this.setState({ showStopPopUp: true })
    }

    render() {
        const empId = (this.props.userDetailsState === 'SUCCESS' && this.props.userDetails.data
            && this.props.userDetails.data.uuid) ? this.props.userDetails.data.uuid : null

        const { match } = this.props;
        let firstRowMessage = this.props.uploadFileState === 'INIT' ? "start uploading"
            : this.props.uploadFileState === 'LOADING' || this.props.uploadFileState === 'SUCCESS' ? "excel uploading"
                : "excel uploading failed"

        let onboardProcessedCount = 0, updateProcessedCount = 0, terminateProcessedCount = 0, errorCount = 0;
        let onboardTotalCount = 0, updateTotalCount = 0, terminateTotalCount = 0;

        //after processing, total number of errors
        if (!_.isEmpty(this.props.processDataCount)) {
            errorCount = this.props.processDataCount.onboardErrorCount + this.props.processDataCount.updateErrorCount + this.props.processDataCount.terminateErrorCount;
        }
        //after processing, page refreshed, total number of errors
        else if (this.props.checkExcelStatusState === 'SUCCESS' && !_.isEmpty(this.props.checkExcelStatus.processedDetails)) {
            Object.entries(this.props.checkExcelStatus.processedDetails).forEach(key => {
                if (key[0] === 'onboardErrorCount' || key[0] === 'terminateErrorCount' || key[0] === 'updateErrorCount') {
                    errorCount += (key[1]);
                }
                if (key[0] === 'onboardCount') onboardProcessedCount = key[1]
                else if (key[0] === 'updateCount') updateProcessedCount = key[1]
                else if (key[0] === 'terminateCount') terminateProcessedCount = key[1]

                if (key[0] === 'onboardErrorCount') onboardTotalCount = onboardProcessedCount + key[1]
                else if (key[0] === 'updateErrorCount') updateTotalCount = updateProcessedCount + key[1]
                else if (key[0] === 'terminateErrorCount') terminateTotalCount = terminateProcessedCount + key[1]
            })
        }

        //maintain scanCount if page refreshed after scanned
        let scanCount = 0;
        if (this.props.checkExcelStatusState === 'SUCCESS' && this.props.checkExcelStatus.scannedDetails) {
            Object.values(this.props.checkExcelStatus.scannedDetails).forEach(key => {
                scanCount += key;
            })
        }

        return (
            <React.Fragment>

                <div className={cx(styles.alignCenter, scrollStyle.scrollbar, "pt-4")}>
                    <ArrowLink
                        label='all employees'
                        url={`/customer-mgmt/org/${match.params.uuid}/employee?isActive=true`}
                        className='mb-3'
                    />

                    {this.props.checkExcelStatusState === 'LOADING' ?
                        <Loader type='form' />
                        :
                        <React.Fragment>
                            <CardHeader label='excel uploading' iconSrc={excelIcon} />

                            {!_.isEmpty(this.props.checkExcelStatus) && this.props.checkExcelStatus.userId !== this.props.authUser.userId ?
                                <LockedUpperCard empId={empId} /> : null}

                            <div className={(!_.isEmpty(this.props.checkExcelStatus) && this.props.checkExcelStatus.userId !== this.props.authUser.userId) ? cx(styles.CardLayoutInactive, 'row no-gutters') : cx(styles.CardLayout, 'row no-gutters')}>
                                <div className='col-3 pr-0 pl-3'>
                                    <ExcelUpload
                                        className={this.props.uploadFileState === 'SUCCESS' || (!_.isEmpty(this.props.checkExcelStatus) && this.props.checkExcelStatus.userId !== this.props.authUser.userId) ? null : styles.Preview}
                                        upload={excelUpload}
                                        disabled={this.props.uploadFileState !== 'INIT' || this.state.scanDocument !== 'INIT' || (!_.isEmpty(this.props.checkExcelStatus) && this.props.checkExcelStatus.userId !== this.props.authUser.userId) ? true : false}
                                        fileUpload={(file) => this.uploadFile(file)}
                                        excelLoadingState={!_.isEmpty(this.props.checkExcelStatus) && (this.props.checkExcelStatus.status === 'inProgress' || this.props.checkExcelStatus.status === 'done') ? 'SUCCESS' : this.props.uploadFileState}
                                        percentCompleted={!_.isEmpty(this.props.checkExcelStatus) && (this.props.checkExcelStatus.status === 'inProgress' || this.props.checkExcelStatus.status === 'done') ? 100 : this.props.percentCompleted}
                                    />

                                    {this.props.uploadFileState === 'INIT' && this.state.scanDocument === 'INIT' ?
                                        <div className={cx(styles.TextAlign, 'mt-3')}>
                                            <p className={styles.GreyText}>don't have excel template?</p>
                                            <p className={styles.DownloadTemp} style={this.props.downloadExcelTemplateState === 'LOADING' ? { cursor: 'progress' } : { cursor: 'pointer' }}
                                                onClick={this.props.downloadExcelTemplateState === 'LOADING' ? null : this.handleTemplateDownload}>
                                                <u>download here</u>
                                            </p>
                                        </div>
                                        :
                                        this.state.scanDocument === 'SUCCESS' && this.state.processCompleted === 'INIT' ?
                                            <Button
                                                type='custom'
                                                label='stop process'
                                                icon1={stop}
                                                className={cx('ml-3', styles.StopButton)}
                                                clickHandler={!_.isEmpty(this.props.checkExcelStatus) && (this.props.checkExcelStatus.userId !== this.props.authUser.userId || this.props.checkExcelStatus.currentStatus === 'processing') ? null : this.toggleStop}
                                                labelStyle={styles.StopLabel}
                                                isDisabled={!_.isEmpty(this.props.checkExcelStatus) && (this.props.checkExcelStatus.userId !== this.props.authUser.userId || this.props.checkExcelStatus.currentStatus === 'processing') ? true : false}
                                            />
                                            : null
                                    }
                                </div>

                                <div className='col-9 px-0'>
                                    <ExcelUploadIndicator first
                                        imageState={!_.isEmpty(this.props.checkExcelStatus) && (this.props.checkExcelStatus.status === 'inProgress' || this.props.checkExcelStatus.status === 'done') ? 'SUCCESS' : this.props.uploadFileState}
                                        label={!_.isEmpty(this.props.checkExcelStatus) && (this.props.checkExcelStatus.status === 'inProgress' || this.props.checkExcelStatus.status === 'done') ? 'excel uploading' : firstRowMessage}
                                        stepNumber='1'
                                        fileName={this.state.fileName}
                                        newFileUpload={!_.isEmpty(this.props.checkExcelStatus) && this.props.checkExcelStatus.userId !== this.props.authUser.userId ? null : () => this.handleStopProcessing('resetFile')}
                                        disabled={!_.isEmpty(this.props.checkExcelStatus) && this.props.checkExcelStatus.userId !== this.props.authUser.userId ? true : false}
                                    />
                                    <ExcelUploadIndicator second
                                        imageState={this.state.scanDocument}
                                        label='scanning excel'
                                        stepNumber='2'
                                        scannedRowCount={!_.isEmpty(this.props.checkExcelStatus) && !_.isEmpty(this.props.checkExcelStatus.scannedDetails) ? scanCount : this.props.scannedRowCount}
                                        totalRows={!_.isEmpty(this.props.checkExcelStatus) && !_.isEmpty(this.props.checkExcelStatus.scannedDetails) ? scanCount : this.props.totalRows}
                                        retry={!_.isEmpty(this.props.checkExcelStatus) && this.props.checkExcelStatus.userId !== this.props.authUser.userId ? null : this.handleRetry}
                                        newUpload={!_.isEmpty(this.props.checkExcelStatus) && this.props.checkExcelStatus.userId !== this.props.authUser.userId ? null : () => this.handleStopProcessing('new')}
                                        successScannedCount={this.state.scanDocument === 'SUCCESS' && _.isEmpty(this.state.checkExcelStatus) ? this.state.successScannedCount : 0}
                                        scannedErrorMsg={this.props.scannedErrorMsg}
                                        disabled={!_.isEmpty(this.props.checkExcelStatus) && this.props.checkExcelStatus.userId !== this.props.authUser.userId ? true : false}
                                    />
                                    <ExcelUploadIndicator third
                                        imageState={this.state.processData}
                                        label='process data'
                                        stepNumber='3'
                                        handleProcess={!_.isEmpty(this.props.checkExcelStatus) && (this.props.checkExcelStatus.userId !== this.props.authUser.userId || this.props.checkExcelStatus.currentStatus === 'processing') ? null : this.handleProcess}
                                        length={this.state.processActions.length}
                                        processedDataCount={!_.isEmpty(this.props.checkExcelStatus) && !_.isEmpty(this.props.checkExcelStatus.scannedDetails) ? scanCount : this.props.totalRows}
                                        processCompleted={this.state.processCompleted}
                                        successScannedCount={this.state.successScannedCount}
                                        disabled={!_.isEmpty(this.props.checkExcelStatus) && (this.props.checkExcelStatus.userId !== this.props.authUser.userId || this.props.checkExcelStatus.currentStatus === 'processing') ? true : false}
                                    />

                                    {this.state.processData !== 'INIT' ?
                                        <div style={{ marginLeft: '4rem' }}>
                                            <hr className={cx(styles.HorizontalLine, 'mt-0')} />

                                            {this.state.processActions.map((item, index) => {
                                                return (
                                                    <React.Fragment key={index}>
                                                        <div style={{ height: "4rem" }}>
                                                            <div className={cx(styles.FlexContainer)}>
                                                                <div style={{ width: "100%" }}>
                                                                    <label className={styles.ProcessHeading}> {item.actionType} </label>
                                                                    {item.actionStatus === 'LOADING' ?
                                                                        (item.actionType === 'onboard' && this.props.processDataCount.type === 'onboard' ?
                                                                            <div className={cx(styles.ProgressBarLayout)}>
                                                                                <span className={styles.ProgressBarMessage}> onboarding <label style={{ width: '1.8rem', textAlign: "center" }}>{this.props.processDataCount.count}</label>/ {this.props.processDataCount.total} &nbsp; employees </span>
                                                                                <ProgressSlider
                                                                                    min={0}
                                                                                    max={this.props.processDataCount.total}
                                                                                    value={this.props.processDataCount.count}
                                                                                    status='LOADING'
                                                                                />
                                                                            </div>
                                                                            : item.actionType === 'update' && this.props.processDataCount.type === 'update' ?
                                                                                <div className={cx(styles.ProgressBarLayout)}>
                                                                                    <span className={styles.ProgressBarMessage}> updating <label style={{ width: '1.8rem', textAlign: "center" }}>{this.props.processDataCount.count}</label>/ {this.props.processDataCount.total} &nbsp; employees </span>
                                                                                    <ProgressSlider
                                                                                        min={0}
                                                                                        max={this.props.processDataCount.total}
                                                                                        value={this.props.processDataCount.count}
                                                                                        status='LOADING'
                                                                                    />
                                                                                </div>
                                                                                : item.actionType === 'terminate' && this.props.processDataCount.type === 'terminate' ?
                                                                                    <div className={cx(styles.ProgressBarLayout)}>
                                                                                        <span className={styles.ProgressBarMessage}> terminating <label style={{ width: '1.8rem', textAlign: "center" }}>{this.props.processDataCount.count}</label>/ {this.props.processDataCount.total} &nbsp; employees </span>
                                                                                        <ProgressSlider
                                                                                            min={0}
                                                                                            max={this.props.processDataCount.total}
                                                                                            value={this.props.processDataCount.count}
                                                                                            status='LOADING'
                                                                                        />
                                                                                    </div>
                                                                                    : null)
                                                                        : item.actionStatus === 'ERROR' ?
                                                                            <div>
                                                                                <label className={styles.ProgressBarMessageError}>
                                                                                    {item.actionType === 'onboard' ?
                                                                                        (this.props.checkExcelStatus.processedDetails ? (onboardTotalCount - onboardProcessedCount) + ' /' + onboardTotalCount :
                                                                                            this.props.processDataCount.onboardErrorCount + '/' + (this.props.processDataCount.onboardCount + this.props.processDataCount.onboardErrorCount))
                                                                                        : item.actionType === 'update' ?
                                                                                            (this.props.checkExcelStatus.processedDetails ? (updateTotalCount - updateProcessedCount) + '/' + updateTotalCount :
                                                                                                this.props.processDataCount.updateErrorCount + '/' + (this.props.processDataCount.updateCount + this.props.processDataCount.updateErrorCount))
                                                                                            : item.actionType === 'terminate' ?
                                                                                                (this.props.checkExcelStatus.processedDetails ? (terminateTotalCount - terminateProcessedCount) + '/' + terminateTotalCount :
                                                                                                    this.props.processDataCount.terminateErrorCount + '/' + (this.props.processDataCount.terminateCount + this.props.processDataCount.terminateErrorCount))
                                                                                                : null} employees {item.actionType} failed
                                                                                    </label>
                                                                            </div>
                                                                            : item.actionStatus === 'SUCCESS' ?
                                                                                <div>
                                                                                    <label className={styles.ProgressBarMessage}>
                                                                                        {item.actionType === 'onboard' ?
                                                                                            (this.props.checkExcelStatus.processedDetails ? onboardProcessedCount + '/' + onboardTotalCount :
                                                                                                this.props.processDataCount.onboardCount + '/' + (this.props.processDataCount.onboardCount + this.props.processDataCount.onboardErrorCount))
                                                                                            : item.actionType === 'update' ?
                                                                                                (this.props.checkExcelStatus.processedDetails ? updateProcessedCount + '/' + updateTotalCount :
                                                                                                    this.props.processDataCount.updateCount + '/' + (this.props.processDataCount.updateCount + this.props.processDataCount.updateErrorCount))
                                                                                                : item.actionType === 'terminate' ?
                                                                                                    (this.props.checkExcelStatus.processedDetails ? terminateProcessedCount + '/' + terminateTotalCount :
                                                                                                        this.props.processDataCount.terminateCount + '/' + (this.props.processDataCount.terminateCount + this.props.processDataCount.terminateErrorCount))
                                                                                                    : null} employees {item.actionType} successful
                                                                                    </label>
                                                                                </div>
                                                                                :
                                                                                <div>
                                                                                    <label className={styles.ProcessSubheading}>{item.actionType} {item.count} employees</label>
                                                                                </div>}
                                                                </div>
                                                                {item.actionStatus === 'LOADING' ?
                                                                    <Loader type='stepLoader' />
                                                                    : item.actionStatus === 'SUCCESS' ?
                                                                        <img src={excelSuccess} alt='' className={styles.SuccessImage} />
                                                                        // : item.actionStatus === 'ERROR' ?
                                                                        //     <img src={reloadExcel} alt='' style={{ cursor: 'pointer' }} onClick={this.handleProcess} />
                                                                        : null}
                                                            </div>
                                                        </div>
                                                        <hr className={styles.HorizontalLine} />
                                                    </React.Fragment>
                                                )
                                            })}
                                        </div>
                                        : null}

                                    {!_.isEmpty(this.props.checkExcelStatus) && this.props.checkExcelStatus.processedDetails ?
                                        <VerificationExcel
                                            initiateCount={this.props.checkExcelStatus.processedDetails.initiateCount}
                                            reinitiateCount={this.props.checkExcelStatus.processedDetails.reInitiateCount}
                                            checkExcelStatus={this.props.checkExcelStatus}
                                            verificationStatus={this.handleVerification}
                                            onboardCount={onboardProcessedCount}
                                            updateCount={updateProcessedCount}
                                            terminateCount={terminateProcessedCount}
                                            disabled={this.props.checkExcelStatus.userId !== this.props.authUser.userId ? true : false}
                                        />
                                        :
                                        <VerificationExcel
                                            initiateCount={this.props.processDataCount.initiateCount}
                                            reinitiateCount={this.props.processDataCount.reInitiateCount}
                                            uploadResponse={this.props.uploadResponse}
                                            verificationStatus={this.handleVerification}
                                            onboardCount={this.props.processDataCount.onboardCount}
                                            updateCount={this.props.processDataCount.updateCount}
                                            terminateCount={this.props.processDataCount.terminateCount}
                                            disabled={!_.isEmpty(this.props.uploadResponse) && this.props.uploadResponse.data.userId !== this.props.authUser.userId ? true : false}
                                        />
                                    }
                                </div>

                                {(!_.isEmpty(this.props.checkExcelStatus) && this.props.checkExcelStatus.userId === this.props.authUser.userId)
                                    || (!_.isEmpty(this.props.uploadResponse) && !_.isEmpty(this.props.uploadResponse.data) && this.props.uploadResponse.data.userId === this.props.authUser.userId) ?

                                    //no error file excel generated
                                    errorCount > 0 && (_.isEmpty(this.props.error) && _.isEmpty(this.state.errorExcel)) ?
                                        <ResultCard noErrorExcelDownload
                                            type='error'
                                            errorCount={errorCount}
                                            handleRedirect={() => this.handleNextUpload('later', 'done')}
                                        />
                                        //show excel file download
                                        : errorCount > 0 && (!_.isEmpty(this.props.error) || !_.isEmpty(this.state.errorExcel)) ?
                                            <ResultCard
                                                type='error'
                                                errorCount={errorCount}
                                                downloadExcelState={this.state.downloadExcel}
                                                handleDownload={this.state.downloadExcel !== 'download excel' ? null : this.handleDownload}
                                            />
                                            //show success card
                                            : this.state.showSuccessCard &&
                                                errorCount === 0 && (_.isEmpty(this.props.error) || _.isEmpty(this.state.errorExcel)) ?
                                                <ResultCard
                                                    type='success'
                                                    successCount={!_.isEmpty(this.props.checkExcelStatus) && this.props.checkExcelStatus.processedDetails ? onboardProcessedCount + updateProcessedCount + terminateProcessedCount : this.props.processDataCount.onboardCount + this.props.processDataCount.updateCount + this.props.processDataCount.terminateCount}
                                                    handleRedirect={() => this.handleNextUpload('later', 'done')}
                                                    initiateCount={!_.isEmpty(this.props.checkExcelStatus) && this.props.checkExcelStatus.processedDetails ? this.props.checkExcelStatus.processedDetails.initiateCount : this.props.processDataCount.initiateCount}
                                                    reinitiateCount={!_.isEmpty(this.props.checkExcelStatus) && this.props.checkExcelStatus.processedDetails ? this.props.checkExcelStatus.processedDetails.reInitiateCount : this.props.processDataCount.reInitiateCount}
                                                />
                                                : null
                                    : null}

                                {this.state.showExcelConfirmationPopup ?
                                    <WarningPopUp
                                        centerAlignButton
                                        text='excel downloaded successfully'
                                        para={'excel with ' + errorCount + ' errors downloaded successfully. how do you want to proceed?'}
                                        paraStyle={styles.WarningFont}
                                        confirmText='restart excel onboarding'
                                        cancelText='will do it later'
                                        icon={excelConfirmed}
                                        warningPopUp={() => this.handleNextUpload('later', 'done')}
                                        warningPopUpStyle={styles.WarningButton1}
                                        closePopup={() => this.handleNextUpload('later')}
                                        closePopUpStyle={styles.WarningButtonExcel}
                                    />
                                    : null}
                                {this.state.showStopPopUp && this.state.processCompleted === 'INIT' ?
                                    <WarningPopUp
                                        text='are you sure?'
                                        para='are you sure you want to stop the process of excel onboarding?'
                                        paraStyle={styles.WarningFont}
                                        confirmText='stop process'
                                        cancelText='cancel'
                                        icon={stopBg}
                                        warningPopUp={() => this.handleStopProcessing('yes')}
                                        warningPopUpStyle={styles.WarningButton1}
                                        closePopup={() => this.handleStopProcessing('no')}
                                        closePopUpStyle={styles.WarningButton2}
                                    />
                                    : null}
                            </div>
                        </React.Fragment>
                    }
                </div>

            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        uploadFileState: state.empMgmt.excelOnboard.uploadFileState,
        percentCompleted: state.empMgmt.excelOnboard.percentCompleted,
        uploadResponse: state.empMgmt.excelOnboard.uploadResponse,

        scannedRowCount: state.empMgmt.excelOnboard.scannedRowCount,
        totalRows: state.empMgmt.excelOnboard.totalRows,
        socketConnectionState: state.empMgmt.excelOnboard.socketConnectionState,
        dataCount: state.empMgmt.excelOnboard.dataCount,
        scannedErrorMsg: state.empMgmt.excelOnboard.scannedError,

        stopProcessData: state.empMgmt.excelOnboard.stopProcessData,
        processData: state.empMgmt.excelOnboard.processData,

        checkExcelStatusState: state.empMgmt.excelOnboard.checkExcelStatusState,
        checkExcelStatus: state.empMgmt.excelOnboard.checkExcelStatus,

        processDataStatusState: state.empMgmt.excelOnboard.processDataStatusState,
        processDataStatus: state.empMgmt.excelOnboard.processDataStatus,

        processSocketConnectionState: state.empMgmt.excelOnboard.processSocketConnectionState,
        error: state.empMgmt.excelOnboard.error,
        processError: state.empMgmt.excelOnboard.processError,
        processDataCount: state.empMgmt.excelOnboard.processDataCount,

        scanSocket: state.empMgmt.excelOnboard.scanSocket,
        processSocket: state.empMgmt.excelOnboard.processSocket,

        downloadErrorFileState: state.empMgmt.excelOnboard.downloadErrorFileState,
        downloadExcelStatus: state.empMgmt.excelOnboard.downloadExcelStatus,

        authUser: state.auth.user,
        userDetailsState: state.empMgmt.excelOnboard.getUserDetailsState,
        userDetails: state.empMgmt.excelOnboard.userDetails,

        downloadExcelTemplateState: state.empMgmt.empAddNew.downloadExcelTemplateState,

        bgvInitiateExcelState: state.empMgmt.excelOnboard.bgvInitiateState,
        reinitiateExcelState: state.empMgmt.excelOnboard.bgvReinitiateState,

        changeStatusState: state.empMgmt.excelOnboard.changeStatusState
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onGetInitState: () => dispatch(actions.initState()),
        onCheckFile: (orgId) => dispatch(actions.checkExcel(orgId)),
        onUploadFile: (file, orgId, fileName) => dispatch(actions.uploadFile(file, orgId, fileName)),
        onGetSocketData: (connectionId) => dispatch(actions.getSocketData(connectionId)),
        onStopProcess: (orgId, fileId) => dispatch(actions.stopProcess(orgId, fileId)),
        onProcessDataStatus: (orgId, fileId) => dispatch(actions.processDataStatus(orgId, fileId)),
        onProcessData: (orgId, fileId) => dispatch(actions.processData(orgId, fileId)),
        onGetUserDetails: (orgId, userId) => dispatch(actions.getUserDetails(orgId, userId)),
        // onDownloadExcelStatus: (orgId, fileId) => dispatch(actions.downloadExcelStatus(orgId, fileId)),
        onDownloadErrorExcel: (orgId, fileName) => dispatch(actions.downloadErrorExcel(orgId, fileName)),
        onDownloadExcelTemplate: () => dispatch(onboardingActions.downloadExcelTemplate()),
        onGetProfilePic: (empId, filePath) => dispatch(imageStoreActions.getProfilePic(empId, filePath)),
        onChangeStatus: (orgId, fileId) => dispatch(actions.changeStatus(orgId, fileId))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ExcelOnboarding));