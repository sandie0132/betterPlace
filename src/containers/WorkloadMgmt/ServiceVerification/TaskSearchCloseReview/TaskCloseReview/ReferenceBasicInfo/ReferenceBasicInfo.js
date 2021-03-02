import React,{Component} from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import styles from './ReferenceBasicInfo.module.scss';
// import emailIcon from '../../../../../../assets/icons/sendEmailIcon.svg';
import cx from 'classnames';
import profile from '../../../../../../assets/icons/defaultPic.svg';
import loader from '../../../../../../assets/icons/profilepicLoader.svg';

import CommentsSection from '../CommentsSection/CommentsSection';
import EmptyState from '../../../../../../components/Atom/EmptyState/EmptyState';

import * as actions from '../../../Store/action';
import * as imageStoreActions from '../../../../../Home/Store/action';
import { withTranslation } from 'react-i18next';


class ReferenceBasicInfo extends Component {

    componentDidMount(){
        if(this.props.taskData.profilePicUrl){
            this.props.onGetProfilePic(this.props.taskData.empId, this.props.taskData.profilePicUrl);
        }
    }

    sentSmsHandler = (mobile) => {
        let postData = {
            mobile : mobile
        }
        this.props.onPutSmsEmail(postData,"reference",this.props.taskData.refId)
    }

    render () {
        const { t } = this.props;
        const empId = this.props.taskData.empId;
        return (
            !_.isEmpty(this.props.taskData) ?
                !_.isEmpty(this.props.taskData.reference) ?
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
                                    { !_.isEmpty(this.props.taskData.fullName) ?  
                                        <label className={styles.SubHeading}>{this.props.taskData.fullName}</label> 
                                    : null }<br />
                                    <label className={styles.OptionWithHeading}>
                                        {!_.isEmpty(this.props.taskData.current_employeeId) ? this.props.taskData.current_employeeId : ''} 
                                        {!_.isEmpty(this.props.taskData.current_employeeId) && !_.isEmpty(this.props.defaultRole) ? " | " : ''}
                                        {!_.isEmpty(this.props.defaultRole) ? (this.props.defaultRole) : ''}
                                    </label>
                                </div>
                            </div>
                            <div className="d-flex flex-column">
                                <div className="row no-gutters" style={{ marginTop: "2rem" }}>
                                    { this.props.taskData.reference.name ? 
                                        <div className="d-flex flex-column col-6">
                                            <span className={this.props.disabled ? styles.mainLabelInactive : styles.mainLabel}>{this.props.taskData.reference.name}</span>
                                            <span className={styles.subTextLabel}>{t('translation_docVerification:reference.name')}</span>
                                        </div>
                                    : null }
                                    { this.props.taskData.reference.relationship ? 
                                        <div className="d-flex flex-column col-6">
                                            <span className={this.props.disabled ? styles.mainLabelInactive : styles.mainLabel}>{this.props.taskData.reference.relationship}</span>
                                            <span className={styles.subTextLabel}>{t('translation_docVerification:reference.relation')}</span>
                                        </div>
                                    : null }
                                </div>
                                <div className="row no-gutters" style={{ marginTop: "2rem" }}>
                                    {this.props.taskData.reference.dob ? 
                                        <div className="d-flex flex-column col-6">
                                            <span className={this.props.disabled ? styles.mainLabelInactive : styles.mainLabel}>{this.props.taskData.reference.dob.split("-").reverse().join(".")}</span>
                                            <span className={styles.subTextLabel}>{t('translation_docVerification:reference.dob')}</span>
                                        </div> 
                                    : null }
                                    <div className="d-flex flex-column col-6">
                                        <span className={cx(this.props.disabled ? styles.mainLabelInactive : styles.mainLabel, "d-flex")}>
                                            <span>{this.props.taskData.reference.mobile}</span>
                                            {/* <img onClick={() => this.sentSmsHandler(this.props.taskData.reference.mobile)} className="ml-2" src={emailIcon} alt="img" /> */}
                                        </span>
                                        <span className={styles.subTextLabel}>{t('translation_docVerification:reference.mobile')}</span>
                                    </div>
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
        )
    }
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

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(ReferenceBasicInfo));