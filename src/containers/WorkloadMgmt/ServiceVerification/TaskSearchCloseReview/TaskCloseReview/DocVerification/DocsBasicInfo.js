import React,{Component} from 'react';
import { connect } from 'react-redux';
import styles from './DocsBasicInfo.module.scss';
import cx from 'classnames';
import  _ from 'lodash';

import CopyCard from '../../../../../../components/Molecule/CopyText/CopyText';
import CommentsSection from '../CommentsSection/CommentsSection';
import EmptyState from '../../../../../../components/Atom/EmptyState/EmptyState';

import checkId from '../../../../../../assets/icons/checkId.svg';
import inactiveCheck from '../../../../../../assets/icons/inactiveCheck.svg';
import profile from '../../../../../../assets/icons/defaultPic.svg';
import loader from '../../../../../../assets/icons/profilepicLoader.svg';

import * as imageStoreActions from '../../../../../Home/Store/action';
import { withTranslation } from 'react-i18next';

class DocsBasicInfo extends Component{
    
    componentDidMount(){
        if(!_.isEmpty(this.props.taskData) && this.props.taskData.profilePicUrl){
            this.props.onGetProfilePic(this.props.taskData.empId, this.props.taskData.profilePicUrl);
        }
    }

    date = (dateInput) => {
        if (!_.isEmpty(dateInput)) {
            let dateIn = dateInput.split("-");
            let outputDate = dateIn[2] + "." + dateIn[1] + "." + dateIn[0];
            return outputDate;
        }
        else return null;
    }

    openNewTab = (url, check) => {
        if (!_.isEmpty(url) && this.props.seconds !== 0 && !check) {
            window.open(url)
        }
        if (!_.isEmpty(url) && check) {
            window.open(url)
        }
    }

    render () {
    const { t } = this.props;
        return(
            !_.isEmpty(this.props.taskData) ?
                <div className={this.props.seconds === 0 || this.props.disabled ? cx(styles.CardPadding, styles.LowerCardInactive) : cx(styles.CardPadding, styles.CardLayout)}>
                    <div>
                        <div className="d-flex">
                            {_.includes(this.props.loadingQueue, this.props.taskData.empId) ?
                                <span className={styles.loaderBackground}>
                                    <img className={styles.loader} src={loader} alt='' />
                                </span>
                            :    <span>
                                    <img alt="" className={styles.Profile}
                                        src={this.props.taskData.profilePicUrl ? 
                                            (this.props.images[this.props.taskData.empId] ? 
                                                this.props.images[this.props.taskData.empId]['image'] 
                                            : profile)
                                        : profile}
                                    />
                                </span>
                            }
                            <div className="d-flex flex-column">
                                {!_.isEmpty(this.props.taskData.fullName) ? 
                                    <label className={cx(this.props.disabled ? styles.fullNameInactive : styles.fullNameActive,"mb-1")}>
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

                        <div className="d-flex justify-content-between" style={{marginTop:"2rem"}}>
                            <div>
                                <div className={cx('row no-gutters', styles.idValuePosition)} >
                                    <label className={(this.props.seconds !== 0 && !this.props.disabled)? styles.idValue : styles.idValueInactive}>{this.props.taskData.doc ? this.props.taskData.doc.documentNumber : '--'}</label>
                                    &emsp; <div style={{marginTop: '0.5rem'}}>
                                        <CopyCard textToCopy={this.props.taskData.doc.documentNumber} disabled={this.props.seconds === 0}/>
                                    </div>

                                </div>
                                <label className={(this.props.seconds !== 0 && !this.props.disabled)? styles.smallLabel : styles.smallLabelInactive}>{this.props.cardType} {t('translation_docVerification:documents.number')}</label>
                            </div>
                            <span><img className={cx("ml-auto",styles.hover)} src={(this.props.seconds !== 0 && !this.props.disabled)? checkId : inactiveCheck} alt='' onClick={() => this.openNewTab(!_.isEmpty(this.props.taskData.checkUrl) ? this.props.taskData.checkUrl : null, false)} /></span>
                        </div>

                        
                        {!_.isEmpty(this.props.taskData.result) ? 
                            this.props.taskData.result.nameMatched ?
                                <small className={cx((this.props.seconds !== 0 && !this.props.disabled)? styles.VerifiedLabel : styles.VerifiedLabelInactive)}>
                                    {this.props.taskData.result.nameMatched} {!_.isEmpty(this.props.taskData.result.nameMatchPercent) ?
                                        <span className={(this.props.seconds !== 0 && !this.props.disabled)? styles.boldText : styles.boldTextInactive}>{"(" + this.props.taskData.result.nameMatchPercent + "% match)"}</span> : null}
                                </small> 
                            : null 
                        : null}
                        {this.props.cardType !== 'rc' ?
                            <div style={{width:"100%",marginTop:"2rem"}}>
                                <div className='row no-gutters'>
                                    <label className={cx('col-5', (this.props.seconds !== 0 && !this.props.disabled)? styles.NameFont : styles.NameFontInactive)}>{this.props.taskData.doc ? this.props.taskData.doc.name : ""}</label>
                                    <label className={cx('col-5', (this.props.seconds !== 0 && !this.props.disabled)? styles.NameFont : styles.NameFontInactive)}>{this.props.taskData.doc ? this.date(this.props.taskData.doc.dob) : "--"}</label>
                                </div>
                                <div className='row no-gutters'>
                                    {this.props.taskData.doc && this.props.taskData.doc.name ? 
                                        <label className={cx('col-5', (this.props.seconds !== 0 && !this.props.disabled)? styles.commentSmallLabel : styles.commentSmallLabelInactive)}>{t('translation_docVerification:documents.name')}</label>
                                    : null}
                                    {this.props.taskData.doc && this.props.taskData.doc.dob ? 
                                        <label className={cx('col-5', (this.props.seconds !== 0 && !this.props.disabled)? styles.commentSmallLabel : styles.commentSmallLabelInactive)}>{t('translation_docVerification:documents.dob')}</label>
                                    : null}
                                </div>
                            </div> : null
                        }
                    </div>
                    <hr className={styles.horizontalCardLine} />
                    <CommentsSection 
                        seconds={this.props.seconds}
                        taskData={this.props.taskData}
                        cardType={this.props.cardType}
                        searchType={this.props.searchType}
                        successNotificationHandler={this.props.successNotificationHandler}
                    />
                </div>
            :   <EmptyState cardType={this.props.cardType} />
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
    }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(DocsBasicInfo));