import React,{Component} from 'react';
import _ from 'lodash';
import styles from './EmploymentCheck.module.scss';
// import emailIcon from '../../../../../../assets/icons/sendEmailIcon.svg';
import cx from 'classnames';
import profile from '../../../../../../assets/icons/defaultPic.svg';
import { connect } from 'react-redux';
import * as actions from '../../../Store/action';
import redCase from '../../../../../../assets/icons/verifyRed.svg';
import yellowCase from '../../../../../../assets/icons/yellow.svg';
import greenCase from '../../../../../../assets/icons/verifyGreen.svg';
import onhold from '../../../../../../assets/icons/onholdGrey.svg';
import themes from '../../../../../../theme.scss';
import loader from '../../../../../../assets/icons/profilepicLoader.svg';

import CommentsSection from '../CommentsSection/CommentsSection';
import EmptyState from '../../../../../../components/Atom/EmptyState/EmptyState';

import * as imageStoreActions from '../../../../../Home/Store/action';
import { withTranslation } from 'react-i18next';


class EmploymentCheck extends Component{

    state={
        hrVerifyStatus: null,
        reportingManagerVerifyStatus: null
    }


    componentDidMount=()=>{
        let hrVerifyStatus =  !_.isEmpty(this.props.taskData.result) ? 
                                        this.props.taskData.result.find(obj => {return obj.verifiedBy === 'hr'})
                                    : null;
        let reportingManagerVerifyStatus = !_.isEmpty(this.props.taskData.result) ?
                                                this.props.taskData.result.find(obj => {return obj.verifiedBy === 'reportingManager'}) 
                                                : null ;
        this.setState({reportingManagerVerifyStatus:reportingManagerVerifyStatus,hrVerifyStatus:hrVerifyStatus});
        if(this.props.taskData.profilePicUrl) this.props.onGetProfilePic(this.props.taskData.empId, this.props.taskData.profilePicUrl);
    }

    componentDidUpdate = (prevProps) => {
        if(!_.isEmpty(this.props.taskData) && this.props.taskData.result !== prevProps.taskData.result)
        {
            let hrVerifyStatus =  !_.isEmpty(this.props.taskData.result) ? 
                                        this.props.taskData.result.find(obj => {return obj.verifiedBy === 'hr'})
                                    : null;
            let reportingManagerVerifyStatus = !_.isEmpty(this.props.taskData.result) ?
                                                    this.props.taskData.result.find(obj => {return obj.verifiedBy === 'reportingManager'}) 
                                                    : null ;
            this.setState({reportingManagerVerifyStatus:reportingManagerVerifyStatus,hrVerifyStatus:hrVerifyStatus});
        }
    }

    sendSmsEmailHandler = (Email) => {
        let postData = {
            hrEmail : Email
        }
        let refId = Email === "hr"
        this.props.onPutSmsEmail(postData,"employment",refId)
    }

    render () {
    const { t } = this.props;
    const empId = this.props.taskData.empId;
    let hrCaseStatus = {};
    let managerCaseStatus = {};
    const statusProperties = {
        'YELLOW' : { bgColor: themes.warningBackground, img: yellowCase, label: 'yellow'},
        'RED' : { bgColor: themes.errorNotification, img: redCase, label: 'red'},
        'GREEN' : { bgColor: themes.successNotification, img: greenCase, label: 'green'} 
    };
    const getColor = (status) => {
        return (status.verificationResult === 'RED') ? styles.redCase :  (status.verificationResult === 'YELLOW') ? styles.yellowCase : styles.greenCase;
    };
    hrCaseStatus = !_.isEmpty(this.state.hrVerifyStatus ) ? getColor(this.state.hrVerifyStatus) : "";
    managerCaseStatus = !_.isEmpty(this.state.reportingManagerVerifyStatus) ? getColor(this.state.reportingManagerVerifyStatus) : "";

    let joinedFrom = "";
    if(!_.isEmpty(this.props.taskData.employment) && !_.isEmpty(this.props.taskData.employment.joinedFrom)){
        
        if((typeof this.props.taskData.employment.joinedFrom) === "string"){
            joinedFrom = this.props.taskData.employment.joinedFrom.split("-").reverse().join(".");
        } else if ((typeof this.props.taskData.employment.joinedFrom) === "object") {
            joinedFrom = this.props.taskData.employment.joinedFrom.$date.split("T")[0].split("-").reverse().join(".");
        }
    } 

    let workedUntil = "";
    if(!_.isEmpty(this.props.taskData.employment) && !_.isEmpty(this.props.taskData.employment.workedUntil)){
        
        if((typeof this.props.taskData.employment.workedUntil) === "string"){
            workedUntil = this.props.taskData.employment.workedUntil.split("-").reverse().join(".");
        } else if ((typeof this.props.taskData.employment.workedUntil) === "object") {
            workedUntil = this.props.taskData.employment.workedUntil.$date.split("T")[0].split("-").reverse().join(".");
        }
    } 

     return (
        !_.isEmpty(this.props.taskData) ?
            !_.isEmpty(this.props.taskData.employment) ?
                <div className={this.props.disabled ? cx(styles.CardPadding, styles.LowerCardInactive) : cx(styles.CardPadding, styles.CardLayout)}>
                    <div>
                        <div className="d-flex">
                            {_.includes(this.props.loadingQueue, empId) ?
                                <span className={styles.loaderBackground}>
                                    <img className={styles.loader} src={loader} alt='' />
                                </span>
                            :    <span>
                                    <img
                                        src={this.props.taskData.profilePicUrl ? 
                                                (this.props.images[empId] ? 
                                                    this.props.images[empId]['image'] 
                                                : profile)
                                            : profile}
                                        className={styles.Profile}
                                        alt=""
                                    />
                                </span>
                            }
                            <div>
                                {!_.isEmpty(this.props.taskData.fullName) ?  
                                    <label className={styles.SubHeading}>{this.props.taskData.fullName}</label> 
                                : null}<br />
                                <label className={styles.OptionWithHeading}>
                                    {!_.isEmpty(this.props.taskData.current_employeeId) ? this.props.taskData.current_employeeId : ''}
                                    {!_.isEmpty(this.props.taskData.current_employeeId) && !_.isEmpty(this.props.defaultRole) ? " | " : ''} 
                                    {!_.isEmpty(this.props.defaultRole) ? this.props.defaultRole : ''}
                                </label>
                            </div>
                        </div>
                        <div className="d-flex flex-column">
                            <div className="row no-gutters" style={{ marginTop: "2rem" }}>
                                <div className="d-flex flex-column">
                                    <span className={this.props.disabled ? styles.mainLabelInactive : styles.mainLabel}>{this.props.taskData.employment.organisation}</span>
                                    <span className={styles.subTextLabel}>{t('translation_docVerification:employment.company')}</span>
                                </div>
                            </div>

                            <span className={cx(styles.HorizontalLine, "my-3")} />

                            <div className="row no-gutters" >
                                {this.props.taskData.employment.hrName ? 
                                    <div className="d-flex flex-column col-8">
                                        <span className={this.props.disabled ? styles.mainLabelInactive : styles.mainLabel}>{this.props.taskData.employment.hrName}</span>
                                        <span className={styles.subTextLabel}>{t('translation_docVerification:employment.hrName')}</span>
                                    </div>
                                : null}
                                {this.props.taskData.employment.hrMobile ? 
                                    <div className="d-flex flex-column col-4">
                                        <span className={this.props.disabled ? styles.mainLabelInactive : styles.mainLabel}>{this.props.taskData.employment.hrMobile}</span>
                                        <span className={styles.subTextLabel}>{t('translation_docVerification:employment.hrMobile')}</span>
                                    </div>
                                : null}
                            </div>

                            {this.props.taskData.employment.hrEmail ?
                                <div className="row no-gutters" style={{ marginTop: "2rem" }}>
                                    <div className="d-flex flex-column">
                                        <span className="d-flex">
                                            <span className={this.props.disabled ? styles.mainLabelInactive : styles.mainLabel}>{this.props.taskData.employment.hrEmail}</span>
                                            {/* <img onClick={() => this.sendSmsEmailHandler(this.props.taskData.employment.hrEmail,this.props.taskData.hrRefId)} className="ml-2" src={emailIcon} alt="img" /> */}
                                        </span>
                                        <span className={styles.subTextLabel}>{t('translation_docVerification:employment.hrMail')}</span>
                                    </div>
                                </div>
                            : null}
                            {(this.props.taskData.employment.hrName || this.props.taskData.employment.hrMobile || this.props.taskData.employment.hrEmail) ?
                                this.state.hrVerifyStatus ? 
                                    <React.Fragment>                            
                                        <div className={cx(styles.CommentBackground,"mt-4",hrCaseStatus)}  >
                                            <span>
                                                <img alt="img" src = {statusProperties[(this.state.hrVerifyStatus.verificationResult)].img} />
                                            </span>
                                            <span className="pl-2">
                                            {t('translation_docVerification:employment.empVerified')} {statusProperties[(this.state.hrVerifyStatus.verificationResult)].label} {t('translation_docVerification:employment.hrCase')}
                                            </span>
                                            {/* <button className={cx(styles.responseButton,"btn-xs")}> response 
                                                <div className={styles.rotate}>&uarr;</div>
                                            </button> */}
                                        </div> 
                                        <span className={cx(styles.HorizontalLine, "my-3")} />
                                    </React.Fragment>

                                :  
                                    <React.Fragment>
                                        <div className={cx(styles.CommentBackground,"mt-4",styles.noResponse)}  >
                                            <span>
                                                <img alt="img" src = {onhold} />
                                            </span>
                                            <span className="pl-2">
                                                {t('translation_docVerification:employment.hrNoResponse')}
                                            </span>
                                        </div>
                                        <span className={cx(styles.HorizontalLine, "my-3")} />
                                    </React.Fragment>
                            : null}

                            {/* {this.props.taskData.employment.reportingManagerName || this.props.taskData.employment.reportingManagerMobile ? */}
                                <div className="row no-gutters" >
                                    {this.props.taskData.employment.reportingManagerName ?
                                        <div className="d-flex flex-column col-8">
                                            <span className={this.props.disabled ? styles.mainLabelInactive : styles.mainLabel}>{this.props.taskData.employment.reportingManagerName}</span>
                                            <span className={styles.subTextLabel}>{t('translation_docVerification:employment.reportName')}</span>
                                        </div> : null}
                                    {this.props.taskData.employment.reportingManagerMobile ?
                                        <div className="d-flex flex-column col-4">
                                            <span className={this.props.disabled ? styles.mainLabelInactive : styles.mainLabel}>{this.props.taskData.employment.reportingManagerMobile}</span>
                                            <span className={styles.subTextLabel}>{t('translation_docVerification:employment.reportMobile')}</span>
                                        </div> : null}
                                </div> 
                            {/* : null} */}

                            {this.props.taskData.employment.reportingManagerEmail ?
                                <div className="row no-gutters" style={{ marginTop: "2rem" }}>
                                    <div className="d-flex flex-column">
                                        <span className="d-flex">
                                            <span className={this.props.disabled ? styles.mainLabelInactive : styles.mainLabel}>{this.props.taskData.employment.reportingManagerEmail}</span>
                                            {/* <img onClick={() => this.sendSmsEmailHandler(this.props.taskData.employment.reportingManagerEmail,this.props.taskData.managerRefId)} className="ml-2" src={emailIcon} alt="img" /> */}
                                        </span>
                                        <span className={styles.subTextLabel}>{t('translation_docVerification:employment.reportMail')}</span>
                                    </div>
                                </div> : null}
                            { (this.props.taskData.employment.reportingManagerName || this.props.taskData.employment.reportingManagerMobile || this.props.taskData.employment.reportingManagerEmail) ?
                                this.state.reportingManagerVerifyStatus ? 
                                    <React.Fragment>
                                        <div className={cx(styles.CommentBackground,"mt-4",managerCaseStatus,styles.managerStatus)}  >
                                            <span>
                                                <img alt="img" src = {statusProperties[(this.state.reportingManagerVerifyStatus.verificationResult)].img} />
                                            </span>
                                            <span className="pl-2">
                                            {t('translation_docVerification:employment.empVerified')} {statusProperties[(this.state.reportingManagerVerifyStatus.verificationResult)].label} {t('translation_docVerification:employment.reportCase')}
                                            </span>
                                            {/* <button className={cx(styles.responseButton,"btn-xs")}> response 
                                            <div className={styles.rotate}>&uarr;</div>
                                            </button> */}
                                        </div>
                                        <span className={cx(styles.HorizontalLine, "my-3")} />
                                    </React.Fragment> 
                                : 
                                    <React.Fragment>
                                        <div className={cx(styles.CommentBackground,"mt-4",styles.noResponse)}  >
                                            <span>
                                                <img alt="img" src = {onhold} />
                                            </span>
                                            <span className="pl-2">
                                                {t('translation_docVerification:employment.reportNoResponse')}
                                            </span>
                                        </div>
                                        <span className={cx(styles.HorizontalLine, "my-3")} />
                                    </React.Fragment>
                        : null    
                        }
                            
                            <div className="row no-gutters" >
                                {this.props.taskData.employment.employeeId ?
                                    <div className="d-flex flex-column col-4">
                                        <span className={this.props.disabled ? styles.mainLabelInactive : styles.mainLabel}>{this.props.taskData.employment.employeeId}</span>
                                        <span className={styles.subTextLabel}>{t('translation_docVerification:employment.empId')}</span>
                                    </div> : null}
                                {this.props.taskData.employment.designation ? <div className="d-flex flex-column col-4">
                                    <span className={this.props.disabled ? styles.mainLabelInactive : styles.mainLabel}>{this.props.taskData.employment.designation}</span>
                                    <span className={styles.subTextLabel}>{t('translation_docVerification:employment.designation')}</span>
                                </div>:null}
                            </div>

                            <div className="row no-gutters" style={{ marginTop: "2rem" }}>
                                {!_.isEmpty(joinedFrom) ? 
                                    <div className="d-flex flex-column col-4">
                                        <span className={this.props.disabled ? styles.mainLabelInactive : styles.mainLabel}>{joinedFrom}</span>
                                        <span className={styles.subTextLabel}>{t('translation_docVerification:employment.joining')}</span>
                                    </div>
                                : null}
                                {!_.isEmpty(workedUntil) ? 
                                    <div className="d-flex flex-column col-4">
                                        <span className={this.props.disabled ? styles.mainLabelInactive : styles.mainLabel}>{workedUntil}</span>
                                        <span className={styles.subTextLabel}>{t('translation_docVerification:employment.relieving')}</span>
                                    </div>
                                : null }
                                {this.props.taskData.employment.salary ?
                                    <div className="d-flex flex-column col-4">
                                        <span className={this.props.disabled ? styles.mainLabelInactive : styles.mainLabel}>{this.props.taskData.employment.salary}</span>
                                        <span className={styles.subTextLabel}>{t('translation_docVerification:employment.salary')}</span>
                                    </div> 
                                : null}
                            </div>
                        </div>
                    </div>
                    <hr className={styles.horizontalCardLine} />
                    <CommentsSection 
                        seconds={this.props.seconds}
                        taskData={this.props.taskData}
                        cardType={this.props.cardType}
                        searchType={this.props.searchType}
                        searchResult={this.props.searchResult}
                        successNotificationHandler={this.props.successNotificationHandler}
                    />
                </div>
            : null
        : <EmptyState cardType={this.props.cardType}/>
    )}
}

const mapStateToProps = state => {
    return {
        images: state.imageStore.images,
        loadingQueue:  state.imageStore.loadingQueue
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onGetProfilePic: (empId, filePath) => dispatch(imageStoreActions.getProfilePic(empId, filePath)),
        onPutSmsEmail: (data,verificationType,refId) => dispatch(actions.putSmsOrEmail(data,verificationType,refId))
    }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(EmploymentCheck));