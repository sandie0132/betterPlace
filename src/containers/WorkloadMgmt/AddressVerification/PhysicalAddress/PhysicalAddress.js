import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from "react-redux";

import _ from 'lodash';
import cx from 'classnames';
import styles from './PhysicalAddress.module.scss';

import * as actions from './Store/action';
import * as otherActions from './AgenyTaskClosure/UploadPictureMultiple/Store/action';
import * as imageStoreActions from '../../../Home/Store/action';
import * as docVerificationActions from '../../ServiceVerification/Store/action';

import * as initData from './PhysicalAddressInitData';
import ArrowLink from '../../../../components/Atom/ArrowLink/ArrowLink';
import SuccessNotification from '../../../../components/Organism/Notifications/SuccessNotification/SuccessNotification';
import Loader from '../../../../components/Organism/Loader/Loader';
import AddressBasicInfo from './AddressBasicInfo/AddressBasicInfo';
import AgencyTaskClosure from './AgenyTaskClosure/AgencyTaskClosure';
import { withTranslation } from 'react-i18next';

class PhysicalAddress extends Component {

    state = {
        imagesData: [],
        referenceDetails : {},
        verificationDetails : {},
        formData : {...initData.detailsInitData.formData},
        errors : {},
        verificationResult : '',
        isAgencyManual : false,
        showSuccessNotification: false
    }

    componentDidMount = () => {
        const { match } = this.props;
        let _id = match.params._id;// let { imagesData } = this.state;
        this.props.onGetIndividualTask(_id);
        this.props.onGetStaticData();
        this.props.onGetInitState();
    }

    componentWillUnmount = () => {
        this.props.onGetInitState();
    }

    componentDidUpdate = (prevProps) => {

        const thisRef = this;
        if (prevProps.reassignDataState !== this.props.reassignDataState && this.props.reassignDataState === 'SUCCESS') {
            this.setState({ showSuccessNotification: true });
            setTimeout(() => {
                this.setState({ showSuccessNotification: false })
            }, 4000);
            if (!_.isEmpty(this.props.reassignData.payload)) {
                if (thisRef.props.reassignData.payload.agencyFromAgencyType === thisRef.props.reassignData.payload.agencyToAgencyType) {
                    const { match } = thisRef.props;
                    let _id = match.params._id;// let { imagesData } = thisRef.state;
                    thisRef.props.onGetIndividualTask(_id);
                }
                else {
                    let redirectUrl = !_.isEmpty(thisRef.props.location.prevPath)
                        ? thisRef.props.location.prevPath
                        : '/workload-mgmt/address/physical?dateRange=LAST_MONTH'
                    thisRef.props.history.push(redirectUrl);
                }
            }
            
        }

        if (prevProps.phyAddressState !== this.props.phyAddressState && this.props.phyAddressState === 'SUCCESS') {
            this.props.onGetTagName(this.props.phyAddress.defaultRole);
            if (this.props.phyAddress.profilePicUrl) {
                this.props.onGetProfilePic(this.props.phyAddress.empId, this.props.phyAddress.profilePicUrl);
            }
            this.props.onGetComments(this.props.phyAddress.orgId, 'physical_address');
                let isAgencyManual = false;
                let thisRef = this;
                if(!_.isEmpty(this.props.phyAddress.result)) {
                    let result = this.props.phyAddress.result[this.props.phyAddress.result.length -1];
                    let { formData} = _.cloneDeep(this.state);
                    let imagesData = [];
                    
                    let referenceDetails = result.referenceDetails;
                    let verificationDetails = result.verificationDetails;
                    if(!_.isEmpty(referenceDetails)) {
                        Object.keys(referenceDetails).forEach(key => {
                            if(key !== "referenceObject") {
                                formData[key] = referenceDetails[key];
                            }
                        })
                    }
                    if(!_.isEmpty(verificationDetails)){
                        Object.keys(verificationDetails).forEach(key => {
                            if(key !== "verificationObject") {
                                formData[key] = verificationDetails[key];
                            }
                        })
                    }
                    let attachments = [];
                    if(!_.isEmpty(result.addressObject)) {
                        attachments = result.addressObject;
                        _.forEach(attachments, function(attachment){
                            let data = {
                                imgUrl : attachment.url,
                                showActionInfo : false,
                                action : !_.isEmpty(attachment.action) ? attachment.action : '',
                                label : attachment.label,
                                type : attachment.type
                            };
                            thisRef.props.onGetAddressPic(attachment.label, attachment.url);
                            imagesData.push(data);     
                        })
                    }
                    this.setState({formData : formData, 
                        referenceDetails : referenceDetails,
                        verificationDetails : verificationDetails,
                        isAgencyManual : isAgencyManual,
                        imagesData : imagesData
                    })
                } else {
                    let imagesData = [];
                    let inititalData = _.cloneDeep(initData.imageInitData);
                    inititalData.data.forEach(element => {
                        let data = {
                            imgUrl: '',
                            image : '',
                            label: element.label,
                            type : element.type,
                            isOther : element.isOther
                        }    
                        imagesData.push(data);        
                    });
                    this.setState({ imagesData : imagesData, isAgencyManual : isAgencyManual});
                }
            
        }

        if (prevProps.addAddressUrlState !== this.props.addAddressUrlState && this.props.addAddressUrlState === "SUCCESS") {
            let imagesData = _.cloneDeep(this.state.imagesData);
            let thisRef = this;
            let addressObj = { ...this.props.addressUrl };
            _.forEach(addressObj, function (key, value) {
                if (!value.includes("Action")) {
                    imagesData = imagesData.map( (img, index) => {
                        if (img.label === value && img.label === thisRef.props.uploadUrlType) {
                            let data = {
                                ...img,
                                imgUrl: key,
                                type: img.type,
                            }
                            if(thisRef.props.user.userGroup === 'SUPER_ADMIN') {
                                data = {
                                    ...data,
                                    action : 'approved'
                                }
                            }
                            thisRef.props.onGetAddressPic(img.label, key);
                            return data;
                        } else {
                           return img;
                        }
                    })
                }
            })
            
            this.setState({imagesData : imagesData})
        }

        if (prevProps.multipledAdAddressUrlState !== this.props.multipledAdAddressUrlState && this.props.multipledAdAddressUrlState === "SUCCESS") {
            let imagesData = _.cloneDeep(this.state.imagesData);
            let thisRef = this;
            let addressObj = { ...this.props.multipleAddressUrl };
            _.forEach(addressObj, function (key, value) {
                if (!value.includes("Action")) {
                    if (value === thisRef.props.multipleUploadUrlType ) {
                        thisRef.props.onGetMultipleAddressPic(value, key);
                        let data = {
                            label : value,
                            imgUrl: key,
                            type: thisRef.props.multipleOtherType,
                            isOther : true
                        }
                        imagesData.push(data);
                    } 
                }
            })
            this.setState({imagesData : imagesData})
        }

        if (this.props.getAddressPictureState === "SUCCESS" && this.props.imageType !== prevProps.imageType) {
            let imagesData = _.cloneDeep(this.state.imagesData);
            let showActionInfo = false;
            if(this.props.addAddressUrlState === "SUCCESS"){
                if(this.props.uploadUrlType === this.props.imageType){
                    showActionInfo = false;
                }
            }
            else if(this.checkActionPermission()) showActionInfo = true;
            imagesData = imagesData.map((img) => {
                if (img.label === this.props.imageType) {
                    img['image'] = this.props.addressImages[this.props.imageType]['image'];
                    img['showActionInfo'] = showActionInfo;
                    return img;
                } 
                else return img;
            })
            this.setState({ imagesData: imagesData })
        }

        if (this.props.multipleGetAddressPictureState === "SUCCESS" && this.props.multipleImageType !== prevProps.multipleImageType) {
            let imagesData = _.cloneDeep(this.state.imagesData);
            imagesData = imagesData.map((img) => {
                if (img.label === this.props.multipleImageType) {
                    return {
                        ...img,
                        image: this.props.multipleAddressImages[this.props.multipleImageType]['image'],
                        type: thisRef.props.multipleOtherType,
                        isOther : true
                    }
                } 
                else return img;
            })
            this.setState({ imagesData: imagesData })
        }

        if(prevProps.getAddressPictureState !== this.props.getAddressPictureState && this.props.getAddressPictureState === "SUCCESS") {
            if(this.props.deleteAddressUrlState === "SUCCESS"){
                if(this.props.deleteUrlType === this.props.imageType && this.props.deleteUrlType === this.props.uploadUrlType){
                    let imagesData = _.cloneDeep(this.state.imagesData);
                    imagesData = imagesData.map((img) => {
                        if (img.label === this.props.imageType) {
                            img['image'] = this.props.addressImages[this.props.imageType]['image'];
                            return img;
                        } 
                        else return img;
                    })
                    this.setState({imagesData : imagesData})
                }
            }
        }

        if(prevProps.multipleGetAddressPictureState !== this.props.multipleGetAddressPictureState && this.props.multipleGetAddressPictureState === "SUCCESS") {
            if(this.props.multipleGeleteAddressUrlState === "SUCCESS"){
                if(this.props.multipleDeleteUrlType === this.props.multipleImageType && this.props.multipleDeleteUrlType === this.props.multipleUploadUrlType){
                    let imagesData = _.cloneDeep(this.state.imagesData);
                    imagesData = imagesData.map((img) => {
                        if (img.label === this.props.multipleDeleteUrlType) {
                            return {
                                ...img,
                                image: this.props.addressImages[this.props.multipleImageType]['image'],
                                type: thisRef.props.multipleOtherType,
                                isOther : true
                            }
                        } 
                        else return img;
                    })
                    this.setState({ imagesData: imagesData })
                }
            }
        }

        //to redirect back to dashboard screen
        if(prevProps.postTaskState !== this.props.postTaskState && this.props.postTaskState === 'SUCCESS') {
            let redirectUrl = !_.isEmpty(this.props.location.prevPath) 
                                ? this.props.location.prevPath 
                                : '/workload-mgmt/address/physical?dateRange=LAST_MONTH'
            this.props.history.push(redirectUrl);
            this.props.onSendNotificationData(this.state.verificationResult, this.props.phyAddress.fullName);
            this.props.onGetInitState();
        }
        
        if (prevProps.deleteAddressUrlState !== this.props.deleteAddressUrlState && this.props.deleteAddressUrlState === "SUCCESS") {
            let imagesData = _.cloneDeep(this.state.imagesData);
            imagesData = imagesData.map(img => {
                if (img.label === this.props.deleteUrlType) {
                    return {
                        ...img,
                        image: "",
                        imgUrl : "",
                        type: img.type
                    }
                } else return img;
            })
            this.setState({ imagesData: imagesData })
        }

        if (prevProps.multipleDeleteAddressUrlState !== this.props.multipleDeleteAddressUrlState && this.props.multipleDeleteAddressUrlState === "SUCCESS") {
            let imagesData = _.cloneDeep(this.state.imagesData);
            imagesData = imagesData.filter(img => {
                return img.label !== this.props.multipleDeleteUrlType;
            })
            this.setState({ imagesData: imagesData })
        }
    }

    checkActionPermission = () => {
        let policies = this.props.policies;
        let permission = false;
        if(this.props.user.userGroup === 'SUPER_ADMIN'){
            permission = true;
        } else {
            _.forEach(policies, function (policy) {
                if (_.includes(policy.businessFunctions, "PHYSICAL_ADDRESS:CLOSE")) {
                    permission = true;
                }
            })
        }
        return permission;
    }

    deleteImage = (type, action) => {
        let fileName = this.props.addressUrl[type];
        if(_.isEmpty(fileName)){
            this.state.imagesData.forEach(img => {
                if(img.label === type){
                    fileName = img.imgUrl;
                }
            })
        }
        if(!_.isEmpty(fileName))
            this.props.onDeleteImage('PHYSICAL_ADDRESS', fileName, type, action, this.props.phyAddress.serviceRequestId);
    }

    handleInputChange = (value, inputField) => {
        let updatedFormData = _.cloneDeep(this.state.formData);
        // if(!_.isEmpty(value)) {
        updatedFormData[inputField] = value;
        this.setState({ formData: updatedFormData});
        // }
    };

    handleError = (error, inputField) => {
        const currentErrors = _.cloneDeep(this.state.errors);
        let updatedErrors = _.cloneDeep(currentErrors);
        let targetError = _.isEmpty(updatedErrors) ? {} : updatedErrors;
        if (!_.isEmpty(error)) {
            targetError[inputField] = error;
        } else {
            delete targetError[inputField]
        }
        if (!_.isEmpty(targetError)) {
            updatedErrors = targetError
        } else {
            updatedErrors = {};
        }
        if (!_.isEqual(updatedErrors, currentErrors)) {
            this.setState({
                errors: updatedErrors
            });
        }
    };

    handleSubmitColor = (color) => {
        this.setState({verificationResult : color });
    }

    getAndUploadImage = (file, type, action) => {
        let formData = new FormData();
        formData.append('file', file);
        this.props.onUploadImage("PHYSICAL_ADDRESS", formData, type, action, this.props.phyAddress.serviceRequestId);
    }

    handleAdressAction = (action, imageType, index) => {
        let imagesData = _.cloneDeep(this.state.imagesData);
        imagesData[index].action = action;
        this.setState({ imagesData : imagesData })
    }

    closeSuccessNotification = () => {
        this.setState({ showSuccessNotification: false })
    }

    render() {
        const { t } = this.props;
        return (
            <div className={cx(styles.WorkloadSection)}>
                <div className="d-flex flex-row">
                    <ArrowLink
                        label={t('translation_addressTaskClosure:dashboard')}
                        url={!_.isEmpty(this.props.location.prevPath) ? this.props.location.prevPath : '/workload-mgmt/address/physical?dateRange=LAST_MONTH'}
                    />
                </div>

                {this.state.showSuccessNotification && !_.isEmpty(this.props.reassignData) && !_.isEmpty(this.props.reassignData.agencyName) ?
                    <SuccessNotification
                        type='agencyNotification'
                        message={t('translation_addressTaskClosure:successNotif')}
                        boldText={this.props.reassignData.agencyName}
                        closeNotification={this.closeSuccessNotification}
                    />
                    : null}

                {this.props.getTaskClosureStaticDataState === 'LOADING' || this.props.phyAddressState === 'LOADING' || this.props.getCommentsState === 'LOADING' ?
                    <Loader />
                    : this.props.phyAddressState === 'SUCCESS' ?
                        <div className={cx('mt-3 mb-5', styles.CardLayout)}>
                            <AddressBasicInfo 
                                phyAddress = {this.props.phyAddress}
                                verificationResult = {this.state.verificationResult}
                            />

                            <AgencyTaskClosure 
                                formData = {this.state.formData}
                                imagesData = {this.state.imagesData}
                                handleInputChange = {this.handleInputChange}
                                getAndUploadImage = {this.getAndUploadImage}
                                deleteImage = {this.deleteImage}
                                phyAddress = {this.props.phyAddress}
                                errors = {this.state.errors}
                                handleError = {this.handleError}
                                handleAdressAction = {this.handleAdressAction}
                                handleSubmitColor={this.handleSubmitColor}
                            />
                        </div>
                    : null
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.auth.user,

        phyAddressState: state.workloadMgmt.addressVerification.physicalAddress.getIndividualTaskState,
        phyAddress: state.workloadMgmt.addressVerification.physicalAddress.getIndividualTask,
        postTaskState: state.workloadMgmt.addressVerification.physicalAddress.postIndividualTaskState,
        getTaskClosureStaticDataState: state.workloadMgmt.addressVerification.physicalAddress.getTaskClosureStaticDataState,

        images: state.imageStore.images,
        comments: state.workloadMgmt.DocVerification.Comments,
        getCommentsState: state.workloadMgmt.DocVerification.getCommentsState,

        tagDataState: state.workloadMgmt.addressVerification.physicalAddress.tagDataState,
        tagData: state.workloadMgmt.addressVerification.physicalAddress.tagData,

        addressUrl: state.workloadMgmt.addressVerification.physicalAddress.addressUrl,
        addAddressUrlState: state.workloadMgmt.addressVerification.physicalAddress.addAddressUrlState,
        deleteAddressUrlState: state.workloadMgmt.addressVerification.physicalAddress.deleteAddressUrlState,
        uploadUrlType: state.workloadMgmt.addressVerification.physicalAddress.uploadUrlType,
        deleteUrlType: state.workloadMgmt.addressVerification.physicalAddress.deleteUrlType,

        getAddressPictureState: state.workloadMgmt.addressVerification.physicalAddress.getAddressPictureState,
        addressImages: state.workloadMgmt.addressVerification.physicalAddress.addressImages,
        addressLoadingQueue: state.workloadMgmt.addressVerification.physicalAddress.addressLoadingQueue,
        imageType: state.workloadMgmt.addressVerification.physicalAddress.imageType,

        multipleAddressUrl: state.workloadMgmt.addressVerification.multipleUploadReducer.addressUrl,
        multipledAdAddressUrlState: state.workloadMgmt.addressVerification.multipleUploadReducer.addAddressUrlState,
        multipleDeleteAddressUrlState: state.workloadMgmt.addressVerification.multipleUploadReducer.deleteAddressUrlState,
        multipleUploadUrlType: state.workloadMgmt.addressVerification.multipleUploadReducer.uploadUrlType,
        multipleDeleteUrlType: state.workloadMgmt.addressVerification.multipleUploadReducer.deleteUrlType,
        multipleOtherType: state.workloadMgmt.addressVerification.multipleUploadReducer.otherType,

        multipleGetAddressPictureState: state.workloadMgmt.addressVerification.multipleUploadReducer.getAddressPictureState,
        multipleAddressImages: state.workloadMgmt.addressVerification.multipleUploadReducer.addressImages,
        multipleAddressLoadingQueue: state.workloadMgmt.addressVerification.multipleUploadReducer.addressLoadingQueue,
        multipleImageType: state.workloadMgmt.addressVerification.multipleUploadReducer.imageType,

        reassignDataState: state.workloadMgmt.addressVerification.address.reassignDataState,
        reassignData: state.workloadMgmt.addressVerification.address.reassignData,

        userProfile: state.user.userProfile.profile,
        policies: state.auth.policies,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onGetProfilePic: (empId, filePath) => dispatch(imageStoreActions.getProfilePic(empId, filePath)),
        onGetIndividualTask: (serviceRequestId) => dispatch(actions.getIndividualTask(serviceRequestId)),
        onGetTagName: (tagId) => dispatch(actions.getTagName(tagId)),
        onGetAddressPic: (type, filePath, otherType) => dispatch(actions.getAddressPic(type, filePath, otherType)),
        onUploadImage: (type, file, urlType, action, serviceRequestId) => dispatch(actions.uploadPhysicalAddressUrl(type, file, urlType, action, serviceRequestId)),
        onDeleteImage: (type, fileName, urlType, action, url) => dispatch(actions.deletePhysicalAddressUrl(type, fileName, urlType, action, url)),
        onGetComments: (orgId, cardType) => dispatch(docVerificationActions.getComments(orgId, cardType)),
        onGetStaticData: () => dispatch(actions.getTaskClosureStaticData()),
        onSendNotificationData: (color, name) => dispatch(actions.sendNotificationData(color, name)),
        onGetInitState: () => dispatch(actions.ImagesInitState()),

        onGetMultipleAddressPic: (type, filePath, otherType) => dispatch(otherActions.getAddressPic(type, filePath, otherType)),
        onUploadMultipleImage: (type, file, urlType, action, serviceRequestId, otherType) => dispatch(otherActions.uploadPhysicalAddressUrl(type, file, urlType, action, serviceRequestId, otherType)),
        onDeleteMultipleImage: (type, fileName, urlType, action, url) => dispatch(otherActions.deletePhysicalAddressUrl(type, fileName, urlType, action, url)),
    }
}

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(PhysicalAddress)));