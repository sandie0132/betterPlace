import React, {Component} from 'react';
import { withRouter } from 'react-router';
import { connect } from "react-redux";

import styles from './AddressBasicInfo.module.scss';
import cx from 'classnames';
import _ from 'lodash';

import * as actions from '../Store/action';
import * as imageStoreActions from '../../../../Home/Store/action';

import defaultPic from '../../../../../assets/icons/defaultPic.svg';
import whiteTimer from '../../../../../assets/icons/whiteTimer.svg';
import greenCase from '../../../../../assets/icons/greenCase.svg';
import redCase from '../../../../../assets/icons/profile_red.svg';
import yellowCase from '../../../../../assets/icons/yellow.svg';
import agencyIcon from '../../../../../assets/icons/agencyIcon.svg';
import unassignedPic from '../../../../../assets/icons/unassignedPic.svg';
import reassign from '../../../../../assets/icons/reassign.svg';

import ReAssignModal from "../../ReAssignModal/ReAssignModal";
import * as initData from '../PhysicalAddressInitData';

import HasAccess from "../../../../../services/HasAccess/HasAccess";
import { withTranslation } from 'react-i18next';

class AddressBasicInfo extends Component {

    state = {
        showReassignModal: false
    }

    componentDidMount = () => {
        if (!_.isEmpty(this.props.phyAddress) && !_.isEmpty(this.props.phyAddress.agencyExecutive) && !_.isEmpty(this.props.phyAddress.agencyExecutive.profilePicUrl)) {
            this.props.onGetProfilePic(this.props.phyAddress.agencyExecutive.agencyEmpId, this.props.phyAddress.agencyExecutive.profilePicUrl);
        }
    }

    getIcon = () => {
        let result = "";
        let resultArray = this.props.phyAddress.result;
        if(_.isEmpty(resultArray)){
            return whiteTimer;
        } else {
            result = this.props.phyAddress.result[this.props.phyAddress.result.length -1].verificationResult;
            if(result === "GREEN") return greenCase;
            else if(result === "RED") return redCase;
            else if(result === "YELLOW") return yellowCase;
            else return whiteTimer;
        }
    }

    getStatus = () => {
       let resultArray = this.props.phyAddress.result;
        if(_.isEmpty(resultArray)){
            let status = !_.isEmpty(this.props.phyAddress.caseStatus) && this.props.phyAddress.caseStatus !== "UNASSIGNED" 
                            ? this.props.phyAddress.caseStatus.toLowerCase().replace(/_/g," ") : "to be closed";
            return status;
        } else {
            let result = this.props.phyAddress.result[this.props.phyAddress.result.length -1].verificationResult;
            if(result === "GREEN") return "green case";
            else if(result === "RED") return "red case";
            else if(result === "YELLOW") return "yellow case";
            else return result.toLowerCase().replace(/_/g, " ");
        }
    }

    getStyles() {
        let resultArray = this.props.phyAddress.result;
        if(_.isEmpty(resultArray)) {
            return styles.defaultBackground;
        } else {
            let result = this.props.phyAddress.result[this.props.phyAddress.result.length -1].verificationResult;
            if(result === "GREEN") return styles.greenBackground;
            else if(result === "RED") return styles.redBackground;
            else if(result === "YELLOW") return styles.yellowBackground;
            else return styles.defaultBackground;
        }
        
     }

    getMessage = () => {
        let resultArray = this.props.phyAddress.result;
        if(_.isEmpty(resultArray)){
            let tat = this.props.phyAddress.tat;
            tat = tat - new Date().getTime();
            tat = tat/(1000*60*60*24)
            if(tat > 0 ) return Math.round(tat) + " days left";
            else return "tat exceeded";
        } else {
            let completedOnTat = "";
            if(!_.isEmpty(resultArray[resultArray.length -1])){
                completedOnTat = resultArray[resultArray.length -1].timeStamp;
            }
            return ![null, undefined, ''].includes(completedOnTat) ? "verified on " + this.dateConversion(completedOnTat) : '';
        }
    }

    dateConversion = (tat) => {
        let date = new Date(tat);
        let year = date.getFullYear();
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        let day = ("0" + date.getDate()).slice(-2);
        return [day, month, year].join('.');
    }

    toggleModal = () => {
        this.setState({ showReassignModal: !this.state.showReassignModal })
    }

    render () {
        const { t } = this.props;
        return (
            <div>
                {/* candidate info */}
                <div className = {cx(styles.basicInfoCard, this.getStyles())}>
                    <div style={{width:"30%"}}>
                        <label className={styles.smallBoldText}>{t('translation_addressTaskClosure:candidate')}</label>
                        <div className='d-flex flex-row mt-2'>
                            <span>
                                <img src={this.props.phyAddress ?
                                    (this.props.images[this.props.phyAddress.empId] ? this.props.images[this.props.phyAddress.empId]['image'] : defaultPic)
                                    : defaultPic}
                                    className={styles.Profile} alt='' />
                            </span>

                            <span className='d-flex flex-column'>
                                <span className={styles.PrimaryLabel}>{this.props.phyAddress.fullName}</span> 
                                <span className={styles.GreyText}>
                                    {this.props.phyAddress.current_employeeId ? this.props.phyAddress.current_employeeId : ''}
                                    {this.props.phyAddress.current_employeeId && this.props.phyAddress.orgName ? " | " : ''}
                                    {this.props.phyAddress.orgName ? this.props.phyAddress.orgName : ''}
                                </span>
                            </span>
                        </div>
                    </div>

                    <div className={styles.verticalLine} />
                    
                    {/* agency info according to permission */}
                    <div style={{ width: "35%", marginLeft: "1rem" }}> 
                        <React.Fragment>
                            <HasAccess
                                denySuperAdminAccess
                                permission={["AGENCY_DASHBOARD:VIEW_ALL"]}
                                yes={() =>
                                    !_.isEmpty(this.props.phyAddress.agencyExecutive) && !_.isEmpty(this.props.phyAddress.agencyExecutive.assignedTo)
                                    ?   <React.Fragment>
                                            <label className={styles.smallBoldText}>{t('translation_addressTaskClosure:physicalAddress.verifier')}</label>
                                            <div className='d-flex flex-row mt-2'>
                                                <span>
                                                    <img src={this.props.images[this.props.phyAddress.agencyExecutive.agencyEmpId]
                                                        ? this.props.images[this.props.phyAddress.agencyExecutive.agencyEmpId]['image'] : defaultPic}
                                                        className={styles.Profile} alt='' />
                                                </span>

                                                <span className='d-flex flex-column'>
                                                    <span className={styles.PrimaryLabel}>{this.props.phyAddress.agencyExecutive.assignedTo}</span>
                                                    <span className={styles.GreyText}>
                                                        {this.props.phyAddress.agencyExecutive.mobile ? this.props.phyAddress.agencyExecutive.mobile : ''}
                                                        {this.props.phyAddress.agencyExecutive.mobile && this.props.phyAddress.agencyExecutive.email ? " | " : ''}
                                                        {this.props.phyAddress.agencyExecutive.email ? this.props.phyAddress.agencyExecutive.email : ''}
                                                    </span>
                                                </span>
                                            </div>
                                        </React.Fragment>
                                    : ''
                                }
                            />
                            <HasAccess
                                permission={["PHYSICAL_ADDRESS:CLOSE"]}
                                yes={() =>
                                    <React.Fragment>
                                        {!_.isEmpty(this.props.phyAddress.agency) 
                                        ?   <div>
                                                <div className='d-flex flex-row justify-content-between'>
                                                    <label className={cx(styles.smallBoldText, "mt-1")}>{t('translation_addressTaskClosure:assignedTo')}</label>
                                                    {initData.showReAssignButtonStatus.includes(this.props.phyAddress.caseStatus)
                                                    ?   <HasAccess
                                                            permission={["PHYSICAL_ADDRESS:REASSIGN"]}
                                                            yes={() =>
                                                                <React.Fragment>
                                                                    <div className={cx(styles.Cursor, styles.ReAssignButton)} onClick={this.toggleModal}>
                                                                        <img src={reassign} alt='' />
                                                                        <span className='pl-2'>
                                                                            {this.props.phyAddress.caseStatus === "UNASSIGNED" ?
                                                                                t('translation_addressTaskClosure:assign')
                                                                                : t('translation_addressTaskClosure:reassign')
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </React.Fragment>
                                                            }
                                                        />
                                                    : null}
                                                </div>
                                                <div className='d-flex flex-row mt-1'>
                                                    <img className={styles.Profile} src={agencyIcon} alt='' />
                                                    <span className={cx('ml-2 d-flex flex-column')}>
                                                        <span className={styles.PrimaryLabel}>
                                                            {!_.isEmpty(this.props.reassignData) ?
                                                                this.props.reassignData.agencyName
                                                                : this.props.phyAddress.agency.agency}
                                                        </span>
                                                        <span className={styles.GreyText}>
                                                            {!_.isEmpty(this.props.reassignData) ?
                                                                "on " + this.dateConversion(new Date())
                                                                : this.props.phyAddress.agency && this.props.phyAddress.agency.assignedOn ?
                                                                    "on " + this.dateConversion(this.props.phyAddress.agency.assignedOn)
                                                                    : "on " + this.dateConversion(this.props.phyAddress.createdOn)
                                                            }
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                        :   
                                            <div>
                                                <div className='d-flex flex-row justify-content-between'>
                                                    <label className={cx(styles.smallBoldText, "mt-1")}>{t('translation_addressTaskClosure:assignedTo')}</label>
                                                    {initData.showReAssignButtonStatus.includes(this.props.phyAddress.caseStatus)
                                                    ?   <HasAccess
                                                            permission={["PHYSICAL_ADDRESS:REASSIGN"]}
                                                            yes={() =>
                                                                <React.Fragment>
                                                                    <div className={cx(styles.Cursor, styles.ReAssignButton)} onClick={this.toggleModal}>
                                                                        <img src={reassign} alt='' />
                                                                        <span className='pl-2'>
                                                                            {this.props.phyAddress.caseStatus === "UNASSIGNED" ?
                                                                                t('translation_addressTaskClosure:assign')
                                                                                : t('translation_addressTaskClosure:reassign')
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </React.Fragment>
                                                            }
                                                        />
                                                    : null}
                                                </div>
                                                {!_.isEmpty(this.props.reassignData) ?
                                                    <div className='d-flex flex-row mt-1'>
                                                        <img className={styles.Profile} src={agencyIcon} alt='' />
                                                        <span className={cx('ml-2 d-flex flex-column')}>
                                                            <span className={styles.PrimaryLabel}>
                                                                {this.props.reassignData.agencyName}
                                                            </span>
                                                            <span className={styles.GreyText}>
                                                                {!_.isEmpty(this.props.reassignData) ?
                                                                    "on " + this.dateConversion(new Date()) : null
                                                                }
                                                            </span>
                                                        </span>
                                                    </div>
                                                    :
                                                    <div className='d-flex flex-row mt-2'>
                                                        <img src={unassignedPic} alt='' />
                                                        <span className={cx('my-auto ml-2', styles.PrimaryLabel)}>{t('translation_addressTaskClosure:notAssigned')}</span>
                                                    </div>
                                                }
                                            </div>
                                        }
                                        {this.state.showReassignModal ?
                                            <ReAssignModal
                                                caseStatus={this.props.phyAddress.caseStatus}
                                                closeModal={this.toggleModal}
                                                cardType='physical'
                                            />
                                        : null}
                                    </React.Fragment>
                                }
                            /> 
                        </React.Fragment>
                        
                    </div>

                    <div className={styles.verticalLine} />

                    {/* verification status info */}
                    <div style={{marginLeft : "1rem"}}>
                        <label className={styles.smallBoldText}>{t('translation_addressTaskClosure:verificationStatus')}</label>
                        <span className={"row no-gutters mt-2"}>
                            <img className={styles.verificationStatusIcon} src={this.getIcon()} alt="" />
                            <span className={"d-flex flex-column ml-2"}>
                                <span className={styles.PrimaryLabel}>{this.getStatus()}</span>
                                <span className={styles.GreyText}>{this.getMessage()}</span>
                            </span>
                        </span>
                    </div>
                </div>

                <div className={styles.padding}>
                    <div className='d-flex flex-row'>
                        <div className='d-flex flex-column'>
                            <span className={styles.MainText}>
                                {!_.isEmpty(this.props.phyAddress.address.addressLine1) ? this.props.phyAddress.address.addressLine1 + ',' : ''}
                                {!_.isEmpty(this.props.phyAddress.address.addressLine2) ? this.props.phyAddress.address.addressLine2 + ',' : ''}
                                {!_.isEmpty(this.props.phyAddress.address.landmark) ? this.props.phyAddress.address.landmark + ', ' : ''}
                                {!_.isEmpty(this.props.phyAddress.address.city) ? this.props.phyAddress.address.city + ', ' : ''}
                                {!_.isEmpty(this.props.phyAddress.address.district) ? this.props.phyAddress.address.district + ', ' : ''}
                                {!_.isEmpty(this.props.phyAddress.address.state) ? this.props.phyAddress.address.state + ', ': ''}
                                {!_.isEmpty(this.props.phyAddress.address.pincode) ? this.props.phyAddress.address.pincode : ''}
                            </span>
                            <span className={styles.GreyText}>{this.props.phyAddress.address.addressType.toLowerCase().replace(/_/g, " ")}</span>
                        </div>
                    </div>

                    <div className='row no-gutters' style={{ marginTop: '2rem' }}>
                        <div className='col-4 px-0'>
                            <div className='d-flex flex-column'>
                                <span className={styles.MainText}>{this.props.phyAddress.address.state}</span>
                                <span className={styles.GreyText}>{t('translation_addressTaskClosure:physicalAddress.state')}</span>
                            </div>
                        </div>

                        <div className='col-4 px-0'>
                            <div className='d-flex flex-column'>
                                <span className={styles.MainText}>{this.props.phyAddress.address.city}</span>
                                <span className={styles.GreyText}>{t('translation_addressTaskClosure:physicalAddress.city')}</span>
                            </div>
                        </div>

                        <div className='col-4 px-0'>
                            <div className='d-flex flex-column'>
                                <span className={styles.MainText}>{this.props.phyAddress.address.pincode}</span>
                                <span className={styles.GreyText}>{t('translation_addressTaskClosure:physicalAddress.pincode')}</span>
                            </div>
                        </div>
                    </div>
                    
                    <hr className={styles.HorizontalLine} />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.auth.user,
        images: state.imageStore.images,
        tagDataState: state.workloadMgmt.addressVerification.physicalAddress.tagDataState,
        tagData: state.workloadMgmt.addressVerification.physicalAddress.tagData,

        reassignDataState: state.workloadMgmt.addressVerification.address.reassignDataState,
        reassignData: state.workloadMgmt.addressVerification.address.reassignData
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onGetProfilePic: (empId, filePath) => dispatch(imageStoreActions.getProfilePic(empId, filePath)),
        onGetTagName: (tagId) => dispatch(actions.getTagName(tagId)),
    }
}

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(AddressBasicInfo)));