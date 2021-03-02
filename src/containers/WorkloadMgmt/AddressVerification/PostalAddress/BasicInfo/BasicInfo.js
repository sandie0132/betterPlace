import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from "react-redux";

import styles from './BasicInfo.module.scss';
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
import checkId from '../../../../../assets/icons/checkId.svg';
// import inactiveCheck from '../../../../../assets/icons/inactiveCheck.svg';

import { hideReAssignButtonStatus } from '../PostalAddressInitData';
import ReAssignModal from "../../ReAssignModal/ReAssignModal";
import CopyCard from '../../../../../components/Molecule/CopyText/CopyText';
import HasAccess from "../../../../../services/HasAccess/HasAccess";
import { withTranslation } from 'react-i18next';

class BasicInfo extends Component {

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
        let resultArray = this.props.postalTaskDetails.result;
        if (_.isEmpty(resultArray)) {
            return whiteTimer;
        }
        else {
            result = this.props.postalTaskDetails.result[this.props.postalTaskDetails.result.length - 1].verificationResult;
            if (result === "GREEN") return greenCase;
            else if (result === "RED") return redCase;
            else if (result === "YELLOW") return yellowCase;
            else return whiteTimer;
        }
    }

    getStatus = () => {
        let resultArray = this.props.postalTaskDetails.result;
        if (_.isEmpty(resultArray)) {
            return !_.isEmpty(this.props.postalTaskDetails.caseStatus) 
                        ? this.props.postalTaskDetails.caseStatus.toLowerCase().replace(/_/g," ") 
                        : "to be closed";
        }
        else {
            let result = this.props.postalTaskDetails.result[this.props.postalTaskDetails.result.length - 1].verificationResult;
            if (result === "GREEN") return "green case";
            else if (result === "RED") return "red case";
            else if (result === "YELLOW") return "yellow case";
            else return result.toLowerCase().replace(/_/g, " ");
        }
    }

    getStyles() {
        let resultArray = this.props.postalTaskDetails.result;
        if (_.isEmpty(resultArray)) {
            return styles.DefaultBackground;
        }
        else {
            let result = this.props.postalTaskDetails.result[this.props.postalTaskDetails.result.length - 1].verificationResult;
            if (result === "GREEN") return styles.GreenBackground;
            else if (result === "RED") return styles.RedBackground;
            else if (result === "YELLOW") return styles.YellowBackground;
            else return styles.DefaultBackground;
        }

    }

    getMessage = () => {
        let resultArray = this.props.postalTaskDetails.result;
        if (_.isEmpty(resultArray)) {
            let tat = this.props.postalTaskDetails.tat;
            tat = tat - new Date().getTime();
            tat = tat/(1000*60*60*24)
            if(tat > 0 ) return Math.round(tat) + " days left";
            else return "tat exceeded";
        }
        else {
            let completedOnTat = this.props.postalTaskDetails.completedOn;
            return "verified on " + this.dateConversion(completedOnTat);
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

    openGoogleLinkHandler = () => {
        let agency = this.props.postalTaskDetails.agency.agency
        if (!_.isEmpty(agency)) {
            if (agency === 'fedex') {
                window.open("https://www.fedex.com/apps/fedextrack/?tracknumbers=" + this.props.postalTaskDetails.trackingNumber + ">&cntry_code=in")
            }
            else if (agency === 'indiapost') {
                window.open("https://www.indiapost.gov.in/_layouts/15/DOP.Portal.Tracking/TrackConsignment.aspx")
            } else if ( agency === 'dtdc') {
                window.open("https://www.dtdc.in/tracking/tracking_results.asp");
            }
        }
    }

    render() {
        const { t } = this.props;
        return (
            <React.Fragment>
                <div>
                    <div className={cx(styles.BasicInfoCard, this.getStyles())}>
                        <div style={{ width: "30%" }}>
                            <label className={styles.SmallBoldText}>{t('translation_addressTaskClosure:candidate')}</label>
                            <div className='d-flex flex-row mt-2'>
                                <span>
                                    <img src={this.props.postalTaskDetails ?
                                        (this.props.images[this.props.postalTaskDetails.empId] ? this.props.images[this.props.postalTaskDetails.empId]['image'] : defaultPic)
                                        : defaultPic}
                                        className={styles.Profile} alt='' />
                                </span>

                                <span className='d-flex flex-column'>
                                    <span className={styles.PrimaryLabel}>{this.props.postalTaskDetails.fullName}</span>
                                    <span className={styles.GreyText}>
                                        {this.props.postalTaskDetails.current_employeeId ? this.props.postalTaskDetails.current_employeeId : ''}
                                        {this.props.postalTaskDetails.current_employeeId && this.props.postalTaskDetails.orgName ? " | " : ''}
                                        {this.props.postalTaskDetails.orgName ? this.props.postalTaskDetails.orgName : ''}
                                    </span>
                                </span>
                            </div>
                        </div>

                        <div className={styles.VerticalLine} />

                        <div style={{ width: "30%", marginLeft: "1rem" }}>
                            {!_.isEmpty(this.props.postalTaskDetails.agency) 
                            ?   <div>
                                    <div className='d-flex flex-row justify-content-between'>
                                        <label className={cx(styles.smallBoldText, "mt-1")}>{t('translation_addressTaskClosure:assignedTo')}</label>
                                        {!hideReAssignButtonStatus.includes(this.props.postalTaskDetails.caseStatus)
                                        ?   <HasAccess
                                                permission={["POSTAL_ADDRESS:REASSIGN"]}
                                                yes={() =>
                                                    <React.Fragment>
                                                        <div className={cx(styles.Cursor, styles.ReAssignButton)} onClick={this.toggleModal}>
                                                            <img src={reassign} alt='' />
                                                            <span className='pl-2'>
                                                                {this.props.postalTaskDetails.caseStatus === "UNASSIGNED" ?
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
                                                    : this.props.postalTaskDetails.agency.agency}
                                            </span>
                                            <span className={styles.GreyText}>
                                                {!_.isEmpty(this.props.reassignData) ?
                                                    "on " + this.dateConversion(new Date())
                                                    : this.props.postalTaskDetails.agency && this.props.postalTaskDetails.agency.assignedOn ?
                                                        "on " + this.dateConversion(this.props.postalTaskDetails.agency.assignedOn)
                                                        : "on " + this.dateConversion(this.props.postalTaskDetails.createdOn)
                                                }
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            :   
                                <div>
                                    <div className='d-flex flex-row justify-content-between'>
                                        <label className={cx(styles.smallBoldText, "mt-1")}>{t('translation_addressTaskClosure:assignedTo')}</label>
                                        <HasAccess
                                            permission={["POSTAL_ADDRESS:REASSIGN"]}
                                            yes={() =>
                                                <React.Fragment>
                                                    <div className={cx(styles.Cursor, styles.ReAssignButton)} onClick={this.toggleModal}>
                                                        <img src={reassign} alt='' />
                                                        <span className='pl-2'>
                                                        {this.props.postalTaskDetails.caseStatus === "UNASSIGNED" ?
                                                                                t('translation_addressTaskClosure:assign')
                                                                                : t('translation_addressTaskClosure:reassign')
                                                                            }
                                                        </span>
                                                    </div>
                                                </React.Fragment>
                                            }
                                        />
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
                                    caseStatus={this.props.postalTaskDetails.caseStatus}
                                    closeModal={this.toggleModal}
                                    cardType='postal'
                                />
                            : null}
                        </div>

                        <div className={styles.VerticalLine} />

                        <div style={{ marginLeft: "1rem" }}>
                            <label className={styles.SmallBoldText}>{t('translation_addressTaskClosure:verificationStatus')}</label>
                            <span className={"row no-gutters mt-2"}>
                                <img src={this.getIcon()} alt="" />
                                <span className={"d-flex flex-column ml-2"}>
                                    <span className={styles.PrimaryLabel}>{this.getStatus()}</span>
                                    <span className={styles.GreyText}>{this.getMessage()}</span>
                                </span>
                            </span>
                        </div>
                    </div>

                    <div className={styles.Padding}>
                        <div className={"d-flex flex-row"}>
                            {this.props.postalTaskDetails.trackingNumber ? 
                                    <div className="d-flex flex-column">
                                        <div className={cx('row no-gutters')}>
                                            <span className={styles.MainText}>
                                                {this.props.postalTaskDetails.trackingNumber}
                                            </span>
                                            &emsp;<div style={{ marginTop: '0.5rem' }}>
                                                <CopyCard textToCopy={this.props.postalTaskDetails.trackingNumber} />
                                            </div>
                                        </div>
                                        <span className={styles.GreyText}>{t('translation_addressTaskClosure:trackingNo')}</span>
                                    </div>
                            : null}
                            {this.props.postalTaskDetails && this.props.postalTaskDetails.agency && this.props.postalTaskDetails.agency.agency && this.props.postalTaskDetails.trackingNumber ?
                                <div className={ "ml-auto"}>
                                    <img
                                        className={cx(styles.Cursor)} src={checkId}
                                        alt=''
                                        onClick={() => this.openGoogleLinkHandler()}
                                    />
                                </div>
                             : null}
                        </div>  
                        <div className='d-flex flex-row'>
                            <div className='d-flex flex-column'>
                                <span className={styles.MainText}>
                                {!_.isEmpty(this.props.postalTaskDetails.address.addressLine1) ? this.props.postalTaskDetails.address.addressLine1 + ',' : ''}
                                {!_.isEmpty(this.props.postalTaskDetails.address.addressLine2) ? this.props.postalTaskDetails.address.addressLine2 + ',' : ''}
                                {!_.isEmpty(this.props.postalTaskDetails.address.landmark) ? this.props.postalTaskDetails.address.landmark + ', ' : ''}
                                {!_.isEmpty(this.props.postalTaskDetails.address.city) ? this.props.postalTaskDetails.address.city + ', ' : ''}
                                {!_.isEmpty(this.props.postalTaskDetails.address.district) ? this.props.postalTaskDetails.address.district + ', ' : ''}
                                {!_.isEmpty(this.props.postalTaskDetails.address.state) ? this.props.postalTaskDetails.address.state + ', ': ''}
                                {!_.isEmpty(this.props.postalTaskDetails.address.pincode) ? this.props.postalTaskDetails.address.pincode : ''}
                            </span>
                                <span className={styles.GreyText}>{this.props.postalTaskDetails.address.addressType.toLowerCase().replace(/_/g, " ")}</span>
                            </div>
                        </div>

                        <div className='row no-gutters' style={{ marginTop: '2rem' }}>
                            <div className='col-4 px-0'>
                                <div className='d-flex flex-column'>
                                    <span className={styles.MainText}>{this.props.postalTaskDetails.address.state}</span>
                                    {/* <span className={styles.MainText}>karnataka</span> */}
                                    <span className={styles.GreyText}>{t('translation_addressTaskClosure:postalAddress.state')}</span>
                                </div>
                            </div>

                            <div className='col-4 px-0'>
                                <div className='d-flex flex-column'>
                                    <span className={styles.MainText}>{this.props.postalTaskDetails.address.city}</span>
                                    <span className={styles.GreyText}>{t('translation_addressTaskClosure:postalAddress.city')}</span>
                                </div>
                            </div>

                            <div className='col-4 px-0'>
                                <div className='d-flex flex-column'>
                                    <span className={styles.MainText}>{this.props.postalTaskDetails.address.pincode}</span>
                                    <span className={styles.GreyText}>{t('translation_addressTaskClosure:postalAddress.pincode')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className={styles.HorizontalLine} />
                    
                </div>

                
            </React.Fragment>
        )

    }
}

const mapStateToProps = state => {
    return {
        images: state.imageStore.images,
        tagDataState: state.workloadMgmt.addressVerification.postalAddress.tagDataState,
        tagData: state.workloadMgmt.addressVerification.postalAddress.tagData,

        postalTaskDetailsState: state.workloadMgmt.addressVerification.postalAddress.postalTaskDetailsState,
        postalTaskDetails: state.workloadMgmt.addressVerification.postalAddress.postalTaskDetails,

        reassignDataState: state.workloadMgmt.addressVerification.address.reassignDataState,
        reassignData: state.workloadMgmt.addressVerification.address.reassignData
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onGetProfilePic: (empId, filePath) => dispatch(imageStoreActions.getProfilePic(empId, filePath)),
        onGetTagName: (tagId) => dispatch(actions.getTagName(tagId))
    }
}

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(BasicInfo)));