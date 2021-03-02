import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router";
import { withTranslation } from "react-i18next";
import _ from 'lodash';
import styles from './TaskCloseReview.module.scss';
import cx from 'classnames';

import profileIcon from '../../../../../assets/icons/defaultProfileBigIcon.svg';
import lockIcon from '../../../../../assets/icons/lockIcon.svg';
import reload from '../../../../../assets/icons/reload.svg';
import timer from '../../../../../assets/icons/timer.svg';

import * as OpsHomePageAction from '../../../../Home/OpsHome/Store/action';
import * as docVerificationActions from '../../Store/action';

import { sectionType, documents } from './initData';
import CrcBasicInfo from './CourtVerification/CrcBasicInfo/CrcBasicInfo';
import DocsBasicInfo from './DocVerification/DocsBasicInfo';
import ReferenceBasicInfo from './ReferenceBasicInfo/ReferenceBasicInfo';
import EducationCheck from './EducationCheck/EducationCheck';
import EmploymentCheck from './EmploymentCheck/EmploymentCheck';
import HealthCheck from './HealthCheck/HealthCheck';
import GlobalDb from "./GlobalDb/GlobalDb";
import ManualReview from './ManualAddressVerification/ManualAddressVerification';
import PoliceVerification from './PoliceVerification/PoliceVerification';


import SuccessNotification from '../../../../../components/Organism/Notifications/SuccessNotification/SuccessNotification';
import Loader from '../../../../../components/Organism/Loader/Loader';
import EmptyState from '../../../../../components/Atom/EmptyState/EmptyState';
import loader from '../../../../../assets/icons/profilepicLoader.svg';

let countDown = '';

var interval;

class LowerCard extends Component {
    constructor(props) {
        super(props);
        this.checkIsDisabled = this.checkIsDisabled.bind(this);
        this.successNotificationHandler = this.successNotificationHandler.bind(this)
    }
    state = {
        colorName: '',
        seconds: '',
        submitColorName: '',
        showNotification: false,
        submitSucess: false,
        sucessName: '',
        changedColor: '',
        taskData: {},
        showUserInfo : false,
        prevColor : '',
    }

    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.getDocumentState !== this.props.getDocumentState && this.props.getDocumentState === "SUCCESS") {
            let cardType = this.props.cardType;
            this.props.onGetDocumentTasks( sectionType[cardType], cardType);
        }

        if (prevProps.getDocumentTasksState !== this.props.getDocumentTasksState && this.props.getDocumentTasksState === "SUCCESS") {
            if(!_.isEmpty(this.props.documentTasksList)) {
                let updatedSeconds = this.state.seconds
            
                if (this.props.documentsList[this.props.cardType] === '0') {
                    countDown = '';
                    updatedSeconds = '';
                }

                if(!_.isEmpty(this.props.documentTasksList.doc)){
                    updatedSeconds = (this.props.documentTasksList.timer)*60;
                    countDown = (this.props.documentTasksList.timer)*60;
                    this.tick();
                } 
                
                this.setState({
                    seconds: updatedSeconds,
                    taskData : this.props.documentTasksList,
                    showNotification: false,
                    showUserInfo : false ,
                });

                this.props.onGetComments(this.props.documentTasksList.orgId,this.props.cardType);

                if (this.props.documentTasksList.defaultRole !== null && !_.isEmpty(this.props.documentTasksList.defaultRole)) {
                    this.props.onGetTagInfo(this.props.documentTasksList.defaultRole);
                } 
                if(this.props.documentTasksList.userId){
                    this.props.onGetUserInfo(this.props.documentTasksList.userId);
                }
            }
            else {
                this.setState({ taskData: {} });
                countDown = '';
                clearInterval(interval);
            }
        }

        if (prevProps.postDocumentTasksState !== this.props.postDocumentTasksState && this.props.postDocumentTasksState === "SUCCESS") {
            this.setState({ sucessName: this.state.taskData.fullName, 
                submitSucess:  true,
                seconds: ''
            })
            setTimeout(() => {
                this.setState({ submitSucess:  false});
            },3000);

            countDown='';
            clearInterval(interval);
        }
        
        if(this.props.searchType !== prevProps.searchType){
            if(this.props.searchType === "closed"){
                this.setState({seconds:'', taskData: {} });
                countDown = '';
                clearInterval(interval);
            } 
            else {
                this.props.onGetDocuments();
            }
        }
        if(prevProps.searchResult !== this.props.searchResult)
        {
            if(!_.isEmpty(this.props.searchResult))
            {
                let updatedSeconds = this.state.seconds;
                clearInterval(interval);
                if(documents.includes(this.props.cardType)){
                    countDown = (this.props.searchResult.timer)*60;
                    updatedSeconds = (this.props.searchResult.timer)*60;
                    this.tick();
                }
                
                this.setState({
                    taskData: this.props.searchResult,
                    seconds: updatedSeconds,
                })
                this.props.onGetComments(this.props.searchResult.orgId,this.props.cardType);
                
                if (!_.isEmpty(this.props.searchResult.defaultRole)) {
                    this.props.onGetTagInfo(this.props.searchResult.defaultRole);
                }
            } else {
                this.setState({taskData : {} });
            }
        } 
    }

    componentWillUnmount = () => {
        this._isMounted = false;
        countDown = ''
        clearInterval(interval);
    }

    tick = () => {
        if(countDown > 0){
            let thisRef = this;
            interval = setInterval(function() {
                if(countDown > 0)
                {
                    countDown = countDown -1;
                    let leftSeconds =  Math.floor(countDown / 60) < 10 ? "0" + Math.floor(countDown / 60) : Math.floor(countDown / 60);
                    let rightSeconds = countDown % 60 < 10 ? "0" + countDown % 60 : countDown % 60;
                    let showTime =  leftSeconds+ ":" + rightSeconds
                    if(document.getElementById('timerValue')){
                        document.getElementById('timerValue').innerText = showTime;
                    }
                    
                }
                if(countDown === 0){
                    thisRef.setState({seconds:0})
                    
                    clearInterval(interval);
                }   
            },1000)
        }
    }

    handleTimerReload = () => {
        if(this.props.searchType === "in progress"){
            this.props.onGetDocuments();
        } else {
            this.props.clearSelectedData();
        }
        clearInterval(interval);
        this.setState({seconds:""})
    }

    handleClose = () => {
        this.setState({ showNotification: false, submitSucess: false })
    }

    successNotificationHandler = (prevColor, submitColor) => {
        this.setState({ prevColor : prevColor, changedColor:submitColor , submitColorName : submitColor});
    }

    userInfoHandler = () => {
        this.setState({ showUserInfo: true });
    }

    checkIsDisabled = () => {
        if (!_.isEmpty(this.state.taskData) && !_.isEmpty(this.state.taskData.userId)
            && this.state.taskData.userId !== this.props.currentUser.userId) {
            return true;
        }
        else return false;
    }

    render() {
        const { t } = this.props;
        let lowerCard;  

        let displayDefaultRole = '';
        if(!_.isEmpty(this.state.taskData) && !_.isEmpty(this.state.taskData.defaultRole) && this.props.tagInfoState === 'SUCCESS' && !_.isEmpty(this.props.tagList)) {
            if(this.props.tagList[0] && this.props.tagList[0].uuid === this.state.taskData.defaultRole) {
                displayDefaultRole = this.props.tagList[0].name;
            }
        }

        lowerCard = <React.Fragment>
                        {this.props.cardType === "crc"  ? 
                            <CrcBasicInfo 
                                taskData={this.state.taskData} 
                                searchType={this.props.searchType}
                                disabled={this.checkIsDisabled()}
                                seconds = {this.state.seconds}
                                colorName={this.state.colorName}
                                successNotificationHandler={this.successNotificationHandler}
                                defaultRole={displayDefaultRole}
                                searchResult={this.props.searchResult}
                            /> 
                    
                        : this.props.cardType === "education" ?
                            <EducationCheck 
                                taskData={this.state.taskData} 
                                seconds={this.state.seconds}
                                cardType={this.props.cardType}
                                searchType={this.props.searchType}
                                searchResult={this.props.searchResult}
                                disabled={this.checkIsDisabled()}
                                defaultRole={displayDefaultRole}
                                successNotificationHandler={this.successNotificationHandler}
                            />

                        : (this.props.cardType === "reference") ?
                            <ReferenceBasicInfo 
                                taskData={this.state.taskData} 
                                seconds={this.state.seconds}
                                cardType={this.props.cardType}
                                searchType={this.props.searchType}
                                searchResult={this.props.searchResult}
                                disabled={this.checkIsDisabled()}
                                defaultRole={displayDefaultRole}
                                successNotificationHandler={this.successNotificationHandler}
                            />

                        :this.props.cardType === 'employment' ?
                            <EmploymentCheck 
                                taskData={this.state.taskData} 
                                seconds={this.state.seconds}
                                cardType={this.props.cardType}
                                searchType={this.props.searchType}
                                searchResult={this.props.searchResult}
                                disabled={this.checkIsDisabled()}
                                defaultRole={displayDefaultRole}
                                successNotificationHandler={this.successNotificationHandler}
                            />
                        :this.props.cardType === 'health' ?
                            <HealthCheck 
                                taskData={this.state.taskData}  
                                seconds={this.state.seconds}
                                cardType={this.props.cardType}
                                searchType={this.props.searchType}
                                searchResult={this.props.searchResult}
                                disabled={this.checkIsDisabled()}
                                defaultRole={displayDefaultRole}
                                successNotificationHandler={this.successNotificationHandler}
                            />
                        :this.props.cardType === 'address_review' ? 
                            <ManualReview 
                                taskData={this.state.taskData}
                                seconds={this.state.seconds}
                                cardType={this.props.cardType}
                                searchType={this.props.searchType}
                                searchResult={this.props.searchResult}
                                disabled={this.checkIsDisabled()}
                                defaultRole={displayDefaultRole}
                                successNotificationHandler={this.successNotificationHandler}
                            />
                        :this.props.cardType === "pvc" ?
                            <PoliceVerification  
                                taskData = {this.state.taskData}
                                viewType = {this.props.viewType}
                                cardType={this.props.cardType}
                                searchType={this.props.searchType}
                                searchResult={this.props.searchResult}
                                disabled={this.checkIsDisabled()}
                                defaultRole={displayDefaultRole}
                                successNotificationHandler={this.successNotificationHandler}
                            />
                                        : this.props.cardType === "globaldb" ?
                                            <GlobalDb
                                                taskData={this.state.taskData}
                                                viewType={this.props.viewType}
                                                cardType={this.props.cardType}
                                                searchType={this.props.searchType}
                                                searchResult={this.props.searchResult}
                                                disabled={this.checkIsDisabled()}
                                                defaultRole={displayDefaultRole}
                                                successNotificationHandler={this.successNotificationHandler}
                                            />
                        :
                            <DocsBasicInfo  
                                taskData={this.state.taskData}
                                seconds={this.state.seconds}
                                cardType={this.props.cardType}
                                searchType={this.props.searchType}
                                disabled={this.checkIsDisabled()}
                                defaultRole={displayDefaultRole}
                                successNotificationHandler={this.successNotificationHandler}
                            />
                        }
                    </React.Fragment> 

        if (this.props.searchType === "closed" && _.isEmpty(this.props.searchResult)) {
            lowerCard = <EmptyState cardType={this.props.cardType} type='emptySearchResult' />
        }
        
        return (
             this._isMounted ? 
                 this.props.getDocumentTasksState === 'LOADING' || this.props.getDocumentsState === 'LOADING' ?
                     <Loader type='opsTaskLower' />
                 :
                    <React.Fragment>
                        {this.state.submitSucess ?
                            this.props.searchType === "in progress" ?
                                <SuccessNotification type='bgvNotification' msgDataName={this.state.sucessName} msgDataColorName={this.state.submitColorName} msgDataColor={this.fontColorHandler} clicked={this.handleClose} />
                            :  <SuccessNotification type='taskReview' msgDataName={this.state.sucessName} msgDataColorName={this.state.prevColor} changedColorName={this.state.changedColor} clicked={this.handleClose} />
                        : ''}
                        {this.checkIsDisabled() ? null
                                            : !_.isEmpty(this.state.taskData.doc) ? 
                                                this.state.seconds === '' ? 
                                                null : this.state.seconds === 0  
                                                        ?    <span className={cx('ml-auto px-3', styles.Reload)} onClick={() => this.handleTimerReload()}>{t('translation_docVerification:reload')} &ensp;
                                                                <img className='' src={reload} alt={t('translation_docVerification:image_alt_docVerification.reload')} />
                                                            </span>
                                                        :   
                                                            <div className={cx('ml-auto', styles.Timer)}>
                                                                <img className='py-0' src={timer} alt={t('translation_docVerification:image_alt_docVerification.timer')} />
                                                                <div id ="timerValue" className={styles.TimerValue}></div>
                                                            </div>
                                                        :  ''
                        }
                        {lowerCard}

                        {(this.checkIsDisabled()) && (_.isEmpty(this.state.taskData.doc) || 
                            (!_.isEmpty(this.state.taskData.doc) && this.props.seconds !== '' ))? 
                            <div className={cx(styles.LockPadding,"d-flex")}>
                                {this.state.showUserInfo ? 
                                    <span className={cx("d-flex flex-column align-self-center",styles.userInfoText)}>
                                        <span className={cx(styles.smallLabel,"mb-2")}>{t('translation_docVerification:taskPicked')}</span>
                                        <span className={styles.MediumLabel}>{this.props.userInfo && this.props.userInfo.nameInLowerCase ? this.props.userInfo.nameInLowerCase : ""}</span>
                                    </span>
                                : null } 
                                {_.includes(this.props.loadingQueue, this.props.userInfo.empId) ?
                                    <span className={styles.loaderBackground}>
                                        <img className={styles.loader} src={loader} alt='' />
                                    </span>
                                :  <img onMouseEnter={() => this.userInfoHandler()} 
                                        onMouseLeave={() => this.setState({ showUserInfo: false })}
                                        className={cx(styles.profilePic)} 
                                        src={this.props.userInfo.profilePicUrl  
                                                ? (this.props.images[this.props.userInfo.empId] 
                                                    ? this.props.images[this.props.userInfo.empId]['image'] 
                                                    : profileIcon)
                                                : profileIcon} alt="{t('translation_docVerification:image_alt_docVerification.profile')}"/>
                                }
                                <img className={styles.lockIcon} src={lockIcon} alt={t('translation_docVerification:image_alt_docVerification.lock')}/>
                            </div> 
                        : null}
                    </React.Fragment> 
             : null
        )
    }
}

const mapStateToProps = state => {
    return {
        documentsList: state.opsHome.DocumentsList,
        getDocumentState: state.opsHome.getDocumentsState,
        
        documentTasksList: state.workloadMgmt.DocVerification.documentTasksList,
        getDocumentTasksState: state.workloadMgmt.DocVerification.getDocumentTasksState,
        postDocumentTasksState: state.workloadMgmt.DocVerification.postDocumentTasksState,
        tagList: state.workloadMgmt.DocVerification.tagList,
        tagInfoState: state.workloadMgmt.DocVerification.getTagInfoState,

        currentUser: state.auth.user,
        
        images: state.imageStore.images,
        loadingQueue:  state.imageStore.loadingQueue,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onGetDocuments: () => dispatch(OpsHomePageAction.getDocuments()),
        onGetDocumentTasks: (tasktype, servicetype, agencyType) => dispatch(docVerificationActions.getDocumentTasks(tasktype, servicetype, agencyType)),
        onGetComments: (orgId,serviceType) => dispatch(docVerificationActions.getComments(orgId,serviceType)),
        onGetTagInfo: (tags) => dispatch(docVerificationActions.getTagInfo(tags)),
        onGetUserInfo: (userId) => dispatch(docVerificationActions.getUserInfo(userId)),
    }
}

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(LowerCard)));