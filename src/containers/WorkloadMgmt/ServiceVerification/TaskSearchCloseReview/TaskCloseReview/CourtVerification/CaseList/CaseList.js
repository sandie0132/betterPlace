import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import cx from 'classnames';
import styles from './CaseList.module.scss';

import report from '../../../../../../../assets/icons/report.svg';
import close from '../../../../../../../assets/icons/closePage.svg';
import inactivePlus from "../../../../../../../assets/icons/inactivePlus.svg";
// import writeComment from '../../../../../../../assets/icons/writeComment.svg';
// import drop from '../../../../../../../assets/icons/greyDropdown.svg';
import chatIcon from '../../../../../../../assets/icons/chat.svg';
import profile from '../../../../../../../assets/icons/defaultPic.svg';
//  import timer from '../../../../../../../assets/icons/timer.svg';

import CaseInfoCard from '../CaseInfoCard/CaseInfoCard';
import scrollStyle from '../../../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import CommentsSection from '../../CommentsSection/CommentsSection';

// import * as docVerificationActions from '../../../../Store/action';
import * as actions from '../../../../../Store/action';
import * as imageStoreActions from '../../../../../../Home/Store/action';
import { withTranslation } from 'react-i18next';

class CaseList extends Component {
    state = {
        apiResponse:{},
        matched_case_details:[],
    }

    componentDidMount() {
        if(!_.isEmpty(this.props.data.apiResponse)){
            this.setState({ apiResponse: this.props.data.apiResponse,
            matched_case_details: !_.isEmpty(this.props.data.apiResponse.matched_case_details) ? this.props.data.apiResponse.matched_case_details : []})
        }
        if(this.props.searchType === "closed")
        {
            this.setState({
                matched_case_details:this.props.data.result[this.props.data.result.length-1].matched_case_details
            })
        }

        if (this.props.data.profilePicUrl) {
            this.props.onGetProfilePic(this.props.data.empId, this.props.data.profilePicUrl);
        }
    }

    handleRelevant = (index, relevant) =>{
        let updated_matched_case_details = _.cloneDeep(this.state.matched_case_details);
        updated_matched_case_details[index].relevant = relevant;
        this.setState({ matched_case_details: updated_matched_case_details })
    }
    handleApiResponseComment = (index, inputComment) => {
        let updated_matched_case_details = _.cloneDeep(this.state.matched_case_details);
        updated_matched_case_details[index].comments = [inputComment];
        this.setState({ matched_case_details: updated_matched_case_details })
    }
    handleMatchedCaseAttachments = (index, inputAttachedFiles) =>{
        let updated_matched_case_details = _.cloneDeep(this.state.matched_case_details);
        if(!_.isEmpty(updated_matched_case_details[index].attachments) ){
            updated_matched_case_details[index].attachments = [...updated_matched_case_details[index].attachments,...inputAttachedFiles]
        } else{
            updated_matched_case_details[index].attachments = [...inputAttachedFiles]
        }
        this.setState({ matched_case_details: updated_matched_case_details })
    }

    handleMatchedCaseDeleteAttachments = (index, inputAttachedFiles) => {
        let updated_matched_case_details = _.cloneDeep(this.state.matched_case_details);
        if(!_.isEmpty(inputAttachedFiles) ){
            updated_matched_case_details[index].attachments = [...inputAttachedFiles]
            this.setState({ matched_case_details: updated_matched_case_details })
        } else{
            updated_matched_case_details[index].attachments = []
            if(updated_matched_case_details[index].attachments.length === 0){
                this.setState({ matched_case_details: updated_matched_case_details })
            }  
        }
    }

    

    shortenDisplayName = (displayName) => {
        if (displayName.length > 12) {
            const updatedDisplayName = displayName.substring(0, 6) + '...';
            return (updatedDisplayName);
        }
        return (displayName);
    }

    enableSubmitHandler = () => {
        if(this.state.verificationStatusIcon[this.props.searchType] === chatIcon)
            return false;
        if(this.props.searchType === "closed" && (this.state.selectedComment["closed"] === "add comment"  || this.state.verificationStatusIcon["in progress"] === this.state.verificationStatusIcon["closed"]) )
            return false;
        else return true;
    }

    render() {
        const { t } = this.props;
        let heading = !_.isEmpty(this.props.data.apiResponse.matched_case_details) ? 'court verification check | ' + this.props.data.apiResponse.matched_case_details.length + ' matches found' : 'court verification check | 0 matches found' ;
        let matchedDetails = this.props.searchType === "in progress" 
                ? !_.isEmpty(this.props.data.apiResponse.matched_case_details) ?  this.props.data.apiResponse.matched_case_details : []
                : !_.isEmpty(this.props.data.result) ?  this.props.data.result[this.props.data.result.length-1].matched_case_details : [];
        return (
            !_.isEmpty(this.props.data) ?
                <div className={cx(styles.FormBackGround, scrollStyle.scrollbar)}>
                    <div className={cx('col-9 mx-0 ', this.props.seconds===0? styles.disable : null)}>
                        <div className={cx(styles.AlignLeft)}>
                            {/* CRC Check Text */}
                            <div className={cx(styles.ContainerPadding64, styles.Sticky, "d-flex flex-row justify-content-between pb-3")}>
                                <div className='d-flex flex-column pt-2'>
                                    <div>
                                        <h4>{heading}</h4>
                                    </div>
                                    <div className="d-flex">
                                        <span>
                                            <img
                                                src={this.props.data.profilePicUrl ?
                                                    (this.props.images[this.props.data.empId] ?
                                                        this.props.images[this.props.data.empId]['image'] : profile)
                                                    : profile}
                                                className={styles.Profile}
                                                alt=""
                                            />
                                        </span>
                                        <div className="d-flex flex-column">
                                            {!_.isEmpty(this.props.data.fullName) ? <label className={cx(this.props.disabled ? styles.fullNameInactive : styles.fullNameActive,"mb-1")}>{this.props.data.fullName}</label> : null}
                                            <label className={this.props.disabled ? styles.commentSmallLabelInactive : styles.commentSmallLabel}>{!_.isEmpty(this.props.data.current_employeeId) ? this.props.data.current_employeeId : ''} 
                                            {!_.isEmpty(this.props.data.current_employeeId) && this.props.defaultRole ? " | " : ''}
                                            {this.props.defaultRole ? this.props.defaultRole : ''}
                                            {this.props.data.orgName ? " | " + this.props.data.orgName : ''}
                                            </label>
                                        </div>
                                    </div>


                                </div>
                                <div className='d-flex flex-column justify-content-between'>
                                    <div>
                                        <img src={close} onClick={this.props.toggle} alt='' className={styles.close} />
                                    </div>
                                  
                                        {/* <div  className={cx('ml-auto', styles.Timer)}>
                                            <img className='py-0' src={timer} alt='timer' />
                                            <span id="caseListTimer" className={styles.TimerValue}></span>
                                        </div> */}
                                  
                                </div>

                            </div>
                            <div style={{ marginTop: '8.6rem' }}>
                                {!_.isEmpty(matchedDetails) ?
                                matchedDetails.map((item, index) => {
                                    return (
                                        <CaseInfoCard
                                            key = {index}
                                            seconds={this.props.seconds}
                                            matchedData={item}
                                            data={this.props.data}
                                            index={index}
                                            handleRelevant={this.handleRelevant}
                                            handleApiResponseComment={this.handleApiResponseComment}
                                            handleMatchedCaseAttachments={this.handleMatchedCaseAttachments}
                                            handleMatchedCaseDeleteAttachments={this.handleMatchedCaseDeleteAttachments}
                                            plus={inactivePlus}
                                            BackgroundAttachment={cx(this.props.seconds!==0 ? styles.BackgroundAttachment : styles.BackgroundAttachmentInactive )}
                                            searchType={this.props.searchType}
                                        />
                                    )

                                }): 
                                <div className={cx('d-flex flex-row justify-content-between', styles.CardHeading)} disabled={(this.props.seconds === 0)}>
                                        <div className='d-inline-block' style={{ padding: '0.6rem' }} >
                                        {t('translation_docVerification:crc.noCases')} 
                                        </div>
                                        <div>
                                            <img src={report} alt='report' style={{ padding: '0.8rem', cursor: 'pointer' }} onClick={() => window.open(this.props.data.apiResponse.report_url)} />
                                        </div>                                    
                                </div>
                            }
                            </div>
                            <div className={cx('row card', styles.CardLayout, styles.CardPadding)}>
                                <CommentsSection 
                                    cardType="crc" 
                                    searchType={this.props.searchType}
                                    seconds={this.props.seconds}
                                    searchResult={this.props.searchResult}
                                    taskData={this.props.data}
                                    matched_case_details={this.state.matched_case_details}
                                    successNotificationHandler={this.props.successNotificationHandler}
                                />
                            </div>
                        </div>
                    </div>
                </div> : ''

        );
    }
}

const mapStateToProps = state => {
    return {
        images: state.imageStore.images
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onImageAdded: (type, formData, serviceRequestId) => dispatch(actions.addImage(type, formData, serviceRequestId)),
        // onPostDocumentTasks: (data, service, requestId) => dispatch(docVerificationActions.postDocumentTasks(data, service,requestId)),
        onImageDeleted: (type, dataId, fileName, url) => dispatch(actions.deleteImage(type, dataId, fileName, url)),
        onGetProfilePic: (empId, filePath) => dispatch(imageStoreActions.getProfilePic(empId, filePath)),
    }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(CaseList));