import React, {Component} from 'react';
import { withRouter } from 'react-router';
import { connect } from "react-redux";


import cx from 'classnames';
import _ from 'lodash';
import styles from './AgencyTaskClosure.module.scss';

import * as initData from '../PhysicalAddressInitData';
import ReferenceDetails from './ReferenceDetails/ReferenceDetails';
import VerificationDetails from './VerificationDetails/VerificationDetails';
import HasAccess from "../../../../../services/HasAccess/HasAccess";
import CommentsSection from '../CommentsSection/CommentsSection';

import greyTimer from '../../../../../assets/icons/timerGreyBackground.svg';

import * as actions from '../Store/action';
import { withTranslation } from 'react-i18next';

class AgencyTaskClosure extends Component {

    state = {
        checkMandatory : true
    }

    handleSubmit(comments, verificationResult, taskData) {
        let attachments = [], data = {};
        let verificationDetails = {}, referenceDetails = {};
        Object.keys(this.props.formData).forEach(field => {
            if(initData.referenceFields.includes(field)) referenceDetails[field] = this.props.formData[field];
            else if(initData.verificationFields.includes(field)) verificationDetails[field] = this.props.formData[field];
        })
        this.props.imagesData.forEach(img => {
            if(!_.isEmpty(img.imgUrl)){
                let data = {
                    url : img.imgUrl,
                    action : img.action,
                    type : img.type,
                    label : img.label
                }
                attachments.push(data);
            }
        })
        let isQc = ['PENDING_OPS_REVIEW','CLOSED'].includes(taskData.caseStatus);
        if(!this.handleHide() && ['UNASSIGNED'].includes(taskData.caseStatus)) {
            isQc =  true;
        }
        let agencyResult = !_.isEmpty(this.props.phyAddress.result) ? this.props.phyAddress.result[0] : '';
        if(isQc){
            let result = {
                type: taskData.service,
                verificationResult: verificationResult,
                comments: comments,
                addressObject : attachments,
                referenceDetails : referenceDetails,
                verificationDetails : verificationDetails
            }
            if(!_.isEmpty(taskData.agency)) {
                result = {
                    ...result,
                    agency : taskData.agency.agency,
                    agencyType : !_.isEmpty(taskData.agency.type) ? taskData.agency.type : taskData.verificationPreference.toLowerCase(),
                    agencyVerificationResult : agencyResult.agencyVerificationResult
                }
            } else {
                result = {
                    ...result,
                    closedBy : 'BPSS_USER'
                }
            }
            data = {
                empId: taskData.empId,
                orgId: taskData.orgId,
                requestId: taskData.requestId,
                serviceRequestId: taskData.serviceRequestId,
                addressId : taskData._id,
                isReAssigned : taskData.isReAssigned,
                service: taskData.service,
                taskKey: taskData.taskKey,
                agency : taskData.agency,
                type: ['UNASSIGNED','PENDING_OPS_REVIEW'].includes(taskData.caseStatus)? "inProgress" : "review",
                status: ['GREEN','RED','YELLOW'].includes(verificationResult) ? "done" : "inProgress",
                verificationPreference : taskData.verificationPreference,
                result: result,
            }
            if (taskData.org_from) { data = { ...data, org_from: taskData.org_from }; }
            if (taskData.org_to) { data = { ...data, org_to: taskData.org_to }; }
            if (taskData.org_via) { data = { ...data, org_via: taskData.org_via }; }
            this.props.onPostDocumentTasks(data, taskData.serviceRequestId, isQc);
        } else {
            data = {
                currentCaseStatus : taskData.caseStatus.toLowerCase(),
                agencyName : !_.isEmpty(taskData.agency) ? taskData.agency.agency : '',
                assigneeEmpId : taskData.agencyExecutive.assigneeEmpId,
                isReAssigned : taskData.isReAssigned,
                referenceDetails : referenceDetails,
                verificationDetails: verificationDetails,
                verificationResult: verificationResult,
                comments: comments,
                addressObject : attachments
            }
            if (taskData.org_from) { data = { ...data, org_from: taskData.org_from }; }
            if (taskData.org_to) { data = { ...data, org_to: taskData.org_to }; }
            if (taskData.org_via) { data = { ...data, org_via: taskData.org_via }; }
            this.props.onPostDocumentTasks(data, taskData._id, isQc);
        }
        this.props.handleSubmitColor(verificationResult.includes("REASSIGN") ? "REASSIGN" : verificationResult );
    }

    getStatus = () => {
        let resultArray = this.props.phyAddress.result;
         if(_.isEmpty(resultArray)){
             return "inProgress";
         } else {
             let result = this.props.phyAddress.result[this.props.phyAddress.result.length -1].verificationResult
             if(result === "GREEN") return "green case";
             else if(result === "RED") return "red case";
             else if(result === "YELLOW") return "yellow case";
         }
    }

    handleReadOnly = () => {
        let policies = this.props.policies;
        let caseStatus = this.props.phyAddress.caseStatus;
        let readOnly = false;
        _.forEach(policies, function (policy) {
            if (_.includes(policy.businessFunctions, "AGENCY_DASHBOARD:CLOSE")) {
                readOnly =  (initData.agencyReadOnly.includes(caseStatus))
            }  
        })
        return readOnly;
    }

    handleHide = () => {
        let policies = this.props.policies;
        let caseStatus = this.props.phyAddress.caseStatus;
        let hide = false;
        let thisRef = this;
        if(this.props.user.userGroup === 'SUPER_ADMIN'){
            hide =  (initData.superAdminHideStatus.includes(caseStatus))
        } else {
            _.forEach(policies, function (policy) {
                if (_.includes(policy.businessFunctions, "PHYSICAL_ADDRESS:CLOSE")) {
                    hide =  (initData.opsHideStatus.includes(caseStatus)
                            && !_.isEmpty(thisRef.props.phyAddress.agency))
                }
                if (_.includes(policy.businessFunctions, "AGENCY_DASHBOARD:CLOSE")) {
                    hide = (initData.agencyHideStatus.includes(caseStatus))
                    if(!_.isEmpty(thisRef.props.phyAddress.agencyExecutive) &&  !_.isEmpty(thisRef.props.userProfile.empId)) {
                        if(thisRef.props.phyAddress.agencyExecutive.assigneeEmpId !== thisRef.props.userProfile.empId) {
                            hide = true;
                        }
                    }
                }  
            })
        }
        return hide;
    }

    handleEnableSubmit = () => {
        let enableSubmit = true;
        if(this.state.checkMandatory){
            if(['UNASSIGNED', 'PICKED'].includes(this.props.phyAddress.caseStatus)){
                let { formData, imagesData } = _.cloneDeep(this.props);
                let requiredFields =  initData.requiredFields;
                let requiredPhotos = initData.requiredPhotos;
                Object.keys(formData).forEach(key => {
                    if(requiredFields.includes(key) && _.isEmpty(formData[key])) { 
                        enableSubmit = false;
                    }
                })
                
                if(!enableSubmit) return false;
                imagesData.forEach(img => {
                    if(requiredPhotos.includes(img.label) && _.isEmpty(img.imgUrl)) {
                        enableSubmit = false;
                    }
                })  
                if(!_.isEmpty(this.props.errors)) {
                    enableSubmit = false;
                }  
            } else if(this.props.phyAddress.caseStatus === 'PENDING_OPS_REVIEW'){
                let actionCount = 0;
                this.props.imagesData.forEach(img => {
                    if(!_.isEmpty(img.action)) actionCount++;
                })
                if(actionCount < this.props.imagesData.length) {
                    enableSubmit = false;
                }
            }
        }
        return enableSubmit;
    }

    handleShowModal = () => {
        let showModal = true;
        if (this.props.phyAddress.caseStatus === 'PENDING_OPS_REVIEW'){
            if(this.props.phyAddress.agency.agency === 'eds') {
                showModal = false;
            }
        }
        return showModal
    }

    handleMandatory = (caseColor) => {
        let { checkMandatory } = this.state;
        checkMandatory = ["green case"].includes(caseColor) ;
        this.setState({ checkMandatory })
    }

    render () {
        const { t } = this.props;
        return(
            <div className={styles.padding}>
                <HasAccess 
                    permission={["AGENCY_DASHBOARD:CLOSE", "PHYSICAL_ADDRESS:CLOSE"]}
                    yes = {() => 
                        this.handleHide() ?
                            <div className={cx(styles.GreyText, "mb-4 mt-4")}>
                                <label>{t('translation_addressTaskClosure:verificationStatus')}</label>
                                <span className={"row no-gutters mt-2"}>
                                    <img src={greyTimer} alt="" />
                                    <span className="ml-1 mt-1">
                                    {this.props.phyAddress.caseStatus === "UNASSIGNED" 
                                    ? "to be closed" :this.props.phyAddress.caseStatus.toLowerCase().replace(/_/g, " ")}
                                    </span>
                                </span>
                            </div> 
                        :
                            <React.Fragment>
                                <ReferenceDetails 
                                    formData = {this.props.formData} 
                                    onChange = {(value, inputField) => this.props.handleInputChange(value, inputField)}
                                    imagesData = {this.props.imagesData}
                                    phyAddress = {this.props.phyAddress}
                                    file={(file, label, action) => this.props.getAndUploadImage(file, label, action)}
                                    delete={(label, action) => this.props.deleteImage(label, action)}
                                    errors={_.isEmpty(this.props.errors) ? {} : this.props.errors}
                                    isDisabled={this.handleReadOnly()}
                                    isFormReadOnly={this.props.phyAddress.caseStatus === 'PENDING_OPS_REVIEW'}
                                    onError={(error, inputField) => this.props.handleError(error, inputField)}
                                    handleAdressAction = {this.props.handleAdressAction}
                                    handleImages = {this.props.handleImages}
                                    // referenceImagesData = {this.props.referenceImagesData.filter(img =>{return !_.isEmpty(img.imgUrl)})}
                                    referenceImagesData = {this.props.imagesData.filter(refImg => {
                                                                return refImg.type === "reference"
                                                            })}
                                    showUpdateAction = {true}
                                    checkMandatory = {this.state.checkMandatory}
                                />
            
                                <VerificationDetails 
                                    formData = {this.props.formData} 
                                    onChange = {(value, inputField) => this.props.handleInputChange(value, inputField)}
                                    imagesData = {this.props.imagesData}
                                    phyAddress = {this.props.phyAddress}
                                    file={(file, label, action) => this.props.getAndUploadImage(file, label, action)}
                                    delete={(label, action) => this.props.deleteImage(label, action)}
                                    errors={_.isEmpty(this.props.errors) ? {} : this.props.errors}
                                    isDisabled={this.handleReadOnly()}
                                    isFormReadOnly={this.props.phyAddress.caseStatus === 'PENDING_OPS_REVIEW'}
                                    onError={(error, inputField) => this.props.handleError(error, inputField)}
                                    handleAdressAction = {this.props.handleAdressAction}
                                    handleImages = {this.props.handleImages}
                                    verificationImagesData={this.props.imagesData.filter(verImg => {
                                                                return verImg.type === "verification";
                                                            })}
                                    showUpdateAction = {true}
                                    checkMandatory = {this.state.checkMandatory}
                                />
                                <CommentsSection
                                    taskData={this.props.phyAddress}
                                    handleSubmitColor={this.props.handleSubmitColor}
                                    showModal = {this.handleShowModal()}
                                    disabled={this.handleReadOnly()}
                                    enableSubmit={this.handleEnableSubmit()}
                                    handleSubmit = {(comments, verificationResult) => 
                                        this.handleSubmit(comments, verificationResult, this.props.phyAddress)}
                                    handleMandatory = {this.handleMandatory}
                                />
                            </React.Fragment>
                    }
                    no = {() => 
                        this.getStatus() === "inProgress" 
                        ?   <div className={cx(styles.GreyText, "mb-4 mt-4")}>
                                <label>{t('translation_addressTaskClosure:verificationStatus')}</label>
                                <span className={"row no-gutters mt-2"}>
                                    <img src={greyTimer} alt="" />
                                    <span className="ml-1 mt-1">{this.props.phyAddress.caseStatus.toLowerCase().replace(/_/g," ")}</span>
                                </span>
                            </div>  
                        :  <React.Fragment>
                                <ReferenceDetails 
                                    formData = {this.state.formData} 
                                    // images = {referenceImagesData}
                                    isDisabled={true}
                                    referenceImagesData = {this.state.referenceImagesData}
                                />

                                <VerificationDetails 
                                    formData = {this.state.formData} 
                                    // images = {verificationImagesData}
                                    isDisabled={true}
                                    verificationImagesData = {this.state.verificationImagesData}
                                />

                                <CommentsSection
                                    taskData={this.props.phyAddress}
                                    disabled={true}
                                />
                            </React.Fragment>
                    }
                /> 
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.auth.user,
        policies: state.auth.policies,
        userProfile: state.user.userProfile.profile
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onPostDocumentTasks: (data, servicerequestId, isQc) => dispatch(actions.postAgencyPhysicalAddress(data, servicerequestId, isQc)),
    }
}

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(AgencyTaskClosure)));