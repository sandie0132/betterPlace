import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './PoliceVerification.module.scss';
import cx from 'classnames';
import _ from 'lodash';
import checkId from '../../../../../../assets/icons/checkId.svg';
import inactiveCheck from '../../../../../../assets/icons/inactiveCheck.svg';
import profile from '../../../../../../assets/icons/defaultPic.svg';
import loader from '../../../../../../assets/icons/profilepicLoader.svg';

import CopyCard from '../../../../../../components/Molecule/CopyText/CopyText';
import CommentsSection from '../CommentsSection/CommentsSection';
import EmptyState from '../../../../../../components/Atom/EmptyState/EmptyState';
import PvcUploadDownload from './PvcUploadDownload/PvcUploadDownload';

import * as imageStoreActions from '../../../../../Home/Store/action';
import { withTranslation } from 'react-i18next';

class PoliceVerification extends Component {

    componentDidMount(){
        if(this.props.taskData.profilePicUrl){
            this.props.onGetProfilePic(this.props.taskData.empId, this.props.taskData.profilePicUrl);
        }
    }

    openNewTab = () => {
        let url = "https://bengaluruurban.nic.in/en/department/police-department/"
        window.open(url);
    }

    render() {
        const { t } = this.props;
        const empId = this.props.taskData.empId;
        return (
            this.props.viewType === "single task view" ?
                !_.isEmpty(this.props.taskData) ? 
                    <div className={this.props.disabled ? cx(styles.CardPadding, styles.LowerCardInactive) : cx(styles.CardPadding, styles.CardLayout)}>
                        <div className={cx("d-flex justify-content-between")}>
                            {/* profilePic data */}
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
                                <div className="d-flex flex-column">
                                    {!_.isEmpty(this.props.taskData.fullName) ?
                                        <label className={cx(this.props.disabled ? styles.VerifiedLabelInactive : styles.VerifiedLabel, "mb-1")}>
                                            {this.props.taskData.fullName}
                                        </label>
                                        : null}
                                    <label className={this.props.disabled ? styles.commentSmallLabelInactive : styles.commentSmallLabel}>
                                        {!_.isEmpty(this.props.taskData.current_employeeId) ? this.props.taskData.current_employeeId : ''}
                                        {!_.isEmpty(this.props.taskData.current_employeeId) && !_.isEmpty(this.props.defaultRole) ? " | " : ''}
                                        {!_.isEmpty(this.props.defaultRole) ? this.props.defaultRole : ''}
                                    </label>
                                </div>
                            </div>
                            {/* checkUrl */}
                            <span>
                                <img className={cx("ml-auto", styles.hover)}
                                    src={!this.props.disabled ? checkId : inactiveCheck}
                                    onClick={() => this.openNewTab()}
                                    alt=''
                                />
                            </span>
                        </div>
                        <div className="d-flex" style={{ marginTop: "1.65rem" }}>
                            {this.props.taskData.address && this.props.taskData.address.fullName ?
                                <div className="col-8 px-0 d-flex">
                                    <div className="d-flex flex-column">
                                        <span className={cx(this.props.disabled ? styles.idValueInactive : styles.idValue)}>{this.props.taskData.address.fullName}</span>
                                        <span className={cx(!this.props.disabled ? styles.commentSmallLabel : styles.commentSmallLabelInactive)}>{t('translation_docVerification:police.name')}</span>
                                    </div>
                                    <div style={{ marginTop: '0.5rem' }}><CopyCard textToCopy={this.props.taskData.address.fullName} /></div>
                                </div>
                                : null}
                            {this.props.taskData.address && this.props.taskData.address.city ?
                                <div className="d-flex flex-column">
                                    <span className={cx(this.props.disabled ? styles.idValueInactive : styles.idValue)}>{this.props.taskData.address.city}</span>
                                    <span className={!this.props.disabled ? styles.commentSmallLabel : styles.commentSmallLabelInactive}>{t('translation_docVerification:police.city')}</span>
                                </div>
                                : null}
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
                :   <EmptyState cardType={this.props.cardType}/>
            : this.props.viewType === "excel upload/download" ? 
                <PvcUploadDownload />
            :   this.props.viewType === "select viewType" ?
                    <EmptyState cardType={this.props.cardType} type='pvc' />
                : null
        );
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
    }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(PoliceVerification));