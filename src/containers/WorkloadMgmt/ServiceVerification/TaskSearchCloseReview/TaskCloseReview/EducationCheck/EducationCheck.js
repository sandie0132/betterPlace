import React,{ Component } from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';
import cx from 'classnames';
import styles from './EducationCheck.module.scss';

// import emailIcon from '../../../../../../assets/icons/sendEmailIcon.svg';
import profile from '../../../../../../assets/icons/defaultPic.svg';
import loader from '../../../../../../assets/icons/profilepicLoader.svg';

import CommentsSection from '../CommentsSection/CommentsSection';
import EmptyState from '../../../../../../components/Atom/EmptyState/EmptyState';

import * as imageStoreActions from '../../../../../Home/Store/action';
import { withTranslation } from 'react-i18next';

class EducationCheck extends Component{

    componentDidMount(){
        if(this.props.taskData.profilePicUrl){
            this.props.onGetProfilePic(this.props.taskData.empId, this.props.taskData.profilePicUrl);
        }
    }
    
    render(){
    const { t } = this.props;
    const empId = this.props.taskData.empId;

    let from = "";
    if(!_.isEmpty(this.props.taskData.education) && !_.isEmpty(this.props.taskData.education.from)){
        
        if((typeof this.props.taskData.education.from) === "string"){
            from = this.props.taskData.education.from.split("-").reverse().join(".");
        } else if ((typeof this.props.taskData.education.from) === "object") {
            from = this.props.taskData.education.from.$date.split("T")[0].split("-").reverse().join(".");
        }
    } 

    let to = "";
    if(!_.isEmpty(this.props.taskData.education) && !_.isEmpty(this.props.taskData.education.to)){
        
        if((typeof this.props.taskData.education.to) === "string"){
            to = this.props.taskData.education.to.split("-").reverse().join(".");
        } else if ((typeof this.props.taskData.education.to) === "object") {
            to = this.props.taskData.education.to.$date.split("T")[0].split("-").reverse().join(".");
        }
    } 

    return (
        !_.isEmpty(this.props.taskData) ?
            !_.isEmpty(this.props.taskData.education) ?
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
                                    <label className={this.props.disabled ? styles.fullNameInactive : styles.fullNameActive}>
                                        {this.props.taskData.fullName}
                                    </label>
                                : null }<br />
                                <label className={this.props.disabled ? styles.OptionWithHeadingInactive : styles.OptionWithHeading}>
                                    {!_.isEmpty(this.props.taskData.current_employeeId) ? this.props.taskData.current_employeeId : ''}
                                    {!_.isEmpty(this.props.taskData.current_employeeId) && !_.isEmpty(this.props.defaultRole) ? " | " : ''} 
                                    {!_.isEmpty(this.props.defaultRole) ? this.props.defaultRole : ''}
                                </label>
                            </div>
                        </div>
                        <div style={{ marginTop: "2rem" }}>
                            <div className="d-flex flex-column">
                                <span className={this.props.disabled ? styles.ValueInactive : styles.Value}>{this.props.taskData.education.board_university}</span>
                                <span className={this.props.disabled ? styles.SubHeadingInactive : styles.SubHeading}>{t('translation_docVerification:education.board')}</span>
                            </div>
                            {/* <div className="row no-gutters" style={{ marginTop: "2rem" }}>
                                <div className="d-flex flex-column col-4">
                                    <span className={this.props.disabled ? styles.ValueInactive : styles.Value}>7382960923</span>
                                    <span className={this.props.disabled ? styles.SubHeadingInactive : styles.SubHeading}>{t('translation_docVerification:education.verifier')}</span>
                                </div>
                                <div className="d-flex flex-column col-7">
                                    <span className="d-flex">
                                        <span className={this.props.disabled ? styles.ValueInactive : styles.Value}>sowmya.chippa@betterplace.co.in</span>
                                        <img className="ml-2" src={emailIcon} alt="img" />
                                    </span>
                                    <span className={this.props.disabled ? styles.SubHeadingInactive : styles.SubHeading}>{t('translation_docVerification:education.verifierMail')}</span>
                                </div>
                            </div> */}
                        </div>
                        <hr className={styles.HorizontalLine} />
                        <div>
                            <div className="row no-gutters">
                                {this.props.taskData.education.educationType ? 
                                    <div className="d-flex flex-column col-4">
                                        <span className={this.props.disabled ? styles.ValueInactive : styles.Value}>{this.props.taskData.education.educationType}</span>
                                        <span className={this.props.disabled ? styles.SubHeadingInactive : styles.SubHeading}>{t('translation_docVerification:education.qualification')}</span>
                                    </div> : null}
                                {this.props.taskData.education.course ? 
                                    <div className="d-flex flex-column col-4">
                                        <span className={this.props.disabled ? styles.ValueInactive : styles.Value}>{this.props.taskData.education.course}</span>
                                        <span className={this.props.disabled ? styles.SubHeadingInactive : styles.SubHeading}>{t('translation_docVerification:education.course')}</span>
                                    </div> : null}
                                {this.props.taskData.education.passedYear ? 
                                    <div className="d-flex flex-column col-4 pl-4">
                                        <span className={this.props.disabled ? styles.ValueInactive : styles.Value}>{this.props.taskData.education.passedYear}</span>
                                        <span className={this.props.disabled ? styles.SubHeadingInactive : styles.SubHeading}>{t('translation_docVerification:education.year')}</span>
                                    </div> : null}
                            </div>
                            <div className="row no-gutters" style={{ marginTop: "2rem" }}>
                                {!_.isEmpty(from) ?
                                    <div className="d-flex flex-column col-4">
                                        <span className={this.props.disabled ? styles.ValueInactive : styles.Value}>{from}</span>
                                        <span className={this.props.disabled ? styles.SubHeadingInactive : styles.SubHeading}>{t('translation_docVerification:education.start')}</span>
                                    </div> : null}
                                {!_.isEmpty(to) ? 
                                    <div className="d-flex flex-column col-4">
                                        <span className={this.props.disabled ? styles.ValueInactive : styles.Value}>{to}</span>
                                        <span className={this.props.disabled ? styles.SubHeadingInactive : styles.SubHeading}>{t('translation_docVerification:education.end')}</span>
                                    </div> : null}
                                {this.props.taskData.education.cgpa_percentage ? 
                                    <div className="d-flex flex-column col-4 pl-4">
                                        <span className={this.props.disabled ? styles.ValueInactive : styles.Value}>{this.props.taskData.education.cgpa_percentage}</span>
                                        <span className={this.props.disabled ? styles.SubHeadingInactive : styles.SubHeading}>{t('translation_docVerification:education.percent')}</span>
                                    </div> : null }
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
    }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(EducationCheck));