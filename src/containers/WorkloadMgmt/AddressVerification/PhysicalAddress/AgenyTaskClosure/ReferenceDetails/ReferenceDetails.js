import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from "react-redux";

import cx from "classnames";
import styles from './ReferenceDetails.module.scss';
import _ from 'lodash';

import referenceIdThumbnail from '../../../../../../assets/icons/idCardIcon.svg';
import referencePhotoThumbnail from '../../../../../../assets/icons/referencePhotoThumbnail.svg';
import defaultIcon from '../../../../../../assets/icons/defaultPhysicalImage.svg';

import * as initData from '../../PhysicalAddressInitData';
import CustomSelect from '../../../../../../components/Atom/CustomSelect/CustomSelect';
import {Input} from 'react-crux';
import UploadPicture from '../../../../../../components/Molecule/UploadPicture/UploadPicture';
import UploadPictureMultiple from '../UploadPictureMultiple/UploadPictureMultiple';
import { validation, message } from './ReferenceDetailsValidation';

import * as phyAddresActions from '../../Store/action';
import * as otherActions from '../UploadPictureMultiple/Store/action';
import { withTranslation } from 'react-i18next';

class ReferenceDetails extends Component {

    handleIcons = (label) => {
        switch (label) {
            case "reference ID photo" : return referenceIdThumbnail;
            case "reference photo" : return referencePhotoThumbnail;

            default: return defaultIcon
        }
    }

    getAndUploadImage = (file, type, action) => {
        let formData = new FormData();
        formData.append('file', file);
        this.props.onUploadImage("PHYSICAL_ADDRESS", formData, type, action, this.props.phyAddress.serviceRequestId);
    }

    handleAdressAction = (action, imageType) => {
        let imagesData = _.cloneDeep(this.props.imagesData);
        imagesData.forEach((img,ind) => {
            if(img.label === imageType){
                this.props.handleAdressAction(action, imageType, ind);
            }
        });
    }

    deleteImage = (type, action) => {
        let fileName = this.props.otherAddressUrl[type];
        if(_.isEmpty(fileName)){
            this.state.otherImages.forEach(img => {
                if(img.label === type){
                    fileName = img.imgUrl;
                }
            })
        }
        if(!_.isEmpty(fileName))
            this.props.onDeleteOtherImage('PHYSICAL_ADDRESS', fileName, type, action, this.props.phyAddress.serviceRequestId);
    }

    render () {
        const errors = this.props.errors;
        const { t } = this.props;
        let otherImages = [];
        let images = [];
        let uploadedOtherImages = [];
        let otherPercentage = this.props.otherPercentCompleted === 'undefined' ? 0 : this.props.otherPercentCompleted;

        this.props.referenceImagesData.forEach( (imgData, index) => {
            if(imgData.isOther) {
                if(initData.otherPhotos.includes(imgData.label)) {
                    otherImages.push(    
                        <UploadPictureMultiple
                            key={index}
                            addressLine={imgData.label}
                            file={(file) => this.props.file(file, imgData.label, imgData.label + "Action", true)}
                            // delete={() => this.props.delete(imgData.label, imgData.label + "Action")}
                            addressLineIcon={this.handleIcons(imgData.label)}
                            serviceRequestId = {this.props.phyAddress.serviceRequestId}
                            type={"reference"}
                            images = {uploadedOtherImages}
                            showUpload = {this.props.referenceImagesData.length < 4}
                            index={this.props.refIndex}
                            
                        />
                    )
                } else {
                    uploadedOtherImages.push(
                        <UploadPicture
                            key={index}
                            addressLine={imgData.label}
                            index={index}
                            delete={() => this.deleteImage(imgData.label, imgData.label + "Action")}
                            addressLineIcon={referenceIdThumbnail}
                            showLoader = {this.props.otherAddressLoadingQueue.includes(imgData.label) }
                            showUploading = {this.props.otherAddAddressUrlState === "LOADING" &&  this.props.uploadUrlType === imgData.label}
                            imgUrl={imgData.image}
                            disabled={this.props.isDisabled}
                            percentCompleted = {otherPercentage}
                            className = {uploadedOtherImages.length === 0 ? "mr-3" : ''}
                        />
                    )
                }
            } else {
                images.push(
                    <UploadPicture
                        key={index}
                        index={index}
                        addressLine={imgData.label}
                        file={(file) => this.props.file(file, imgData.label, imgData.label + "Action")}
                        delete={() => this.props.delete(imgData.label, imgData.label + "Action")}
                        addressLineIcon={this.handleIcons(imgData.label)}
                        showLoader = {['PICKED', 'UNASSIGNED', 'AWAITING_TO_SEND'].includes(this.props.phyAddress.caseStatus) ? this.props.addressLoadingQueue.includes(imgData.label) : _.isEmpty(this.props.addressLoadingQueue)}
                        showUploading = {this.props.addAddressUrlState === "LOADING" &&  this.props.uploadUrlType === imgData.label}
                        imgUrl={imgData.image}
                        handleAction={this.handleAdressAction}
                        actionTaken={imgData.action}
                        shouldShowAddMore={imgData.showActionInfo}
                        disabled={this.props.isDisabled}
                        required = {this.props.checkMandatory && initData.requiredPhotos.includes(imgData.label)}
                        showUpdateAction = {this.props.showUpdateAction}
                        percentCompleted = {this.props.percentCompleted}
                        className = {(index+1)%3 !== 0 ? "mr-3" : ''}
                    />
                )
            }
        })

        return (
            <React.Fragment>
                <label className={styles.formHead}>{t('translation_addressTaskClosure:physicalAddress.refDetails')}</label>
                <div>
                    <div className="row no-gutters mt-2">
                        <CustomSelect
                            name='referenceType'
                            className="col-4 pl-0 py-0 pr-3 mt-3"
                            required={this.props.checkMandatory && _.includes(initData.requiredFields, 'referenceType')}
                            label={t('translation_addressTaskClosure:physicalAddress.refType')}
                            options={!_.isEmpty(this.props.referenceOptions) ? this.props.referenceOptions : [{label : "select relationship", value : ""}]}
                            value={this.props.formData.referenceType}
                            errors={errors['referenceType']}
                            onChange={(value) => this.props.onChange(value, 'referenceType')}
                            onError={(error) => this.props.onError(error, 'referenceType')}
                            disabled={this.props.isDisabled || this.props.isFormReadOnly}
                        />

                        <Input
                            name='name'
                            className='col-4 pr-3'
                            label={t('translation_addressTaskClosure:physicalAddress.name')}
                            type='text'
                            placeholder={t('translation_addressTaskClosure:physicalAddress.namePlaceholder')}
                            required={this.props.checkMandatory && _.includes(initData.requiredFields, 'name')}
                            value={this.props.formData.name}
                            errors={errors['name']}
                            onChange={(value) => this.props.onChange(value, 'name')}
                            onError={(error) => this.props.onError(error, 'name')}
                            validation={validation['name']}
                            message={message['name']}
                            disabled={this.props.isDisabled || this.props.isFormReadOnly}
                        />

                        <Input
                            name='mobile'
                            className='col-4 pr-3'
                            label={t('translation_addressTaskClosure:physicalAddress.mobile')}
                            type='text'
                            placeholder={t('translation_addressTaskClosure:physicalAddress.mobilePlaceholder')}
                            required={this.props.checkMandatory && _.includes(initData.requiredFields, 'mobile')}
                            value={this.props.formData.mobile}
                            errors={errors['mobile']}
                            onChange={(value) => this.props.onChange(value, 'mobile')}
                            onError={(error) => this.props.onError(error, 'mobile')}
                            validation={validation['mobile']}
                            message={message['mobile']}
                            disabled={this.props.isDisabled || this.props.isFormReadOnly}
                        />

                        <CustomSelect
                            name='ID type'
                            className="col-4 pl-0 py-0 pr-3 mt-3"
                            required={this.props.checkMandatory && _.includes(initData.requiredFields, 'idType')}
                            label={t('translation_addressTaskClosure:physicalAddress.idType')}
                            options={!_.isEmpty(this.props.idCardOptions) ? this.props.idCardOptions : [{label : "select ID type", value : ""}]}
                            value={this.props.formData.idType}
                            errors={errors['idType']}
                            onChange={(value) => this.props.onChange(value, 'idType')}
                            onError={(error) => this.props.onError(error, 'idType')}
                            disabled={this.props.isDisabled || this.props.isFormReadOnly}
                        />
                    </div>
                </div>
                {!_.isEmpty(this.props.referenceImagesData) ?
                <hr className={cx("mt-4", styles.HorizontalLine)} /> : null}
                <div className={"row no-gutters"}>
                    {images}
                    {uploadedOtherImages}
                    {otherImages}
                </div>
                <hr className={cx("mt-4", styles.HorizontalLine)} />
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        referenceOptions : state.workloadMgmt.addressVerification.physicalAddress.taskClosureStaticData['WORKLOAD_MGMT_AGENCY_TASK_CLOSURE_REFERENCE_TYPE'],
        idCardOptions : state.workloadMgmt.addressVerification.physicalAddress.taskClosureStaticData['WORKLOAD_MGMT_AGENCY_TASK_CLOSURE_ID_CARD_TYPE'],

        otherPercentCompleted : state.workloadMgmt.addressVerification.multipleUploadReducer.percentCompleted,
        otherAddAddressUrlState: state.workloadMgmt.addressVerification.multipleUploadReducer.addAddressUrlState,
        otherAddressLoadingQueue: state.workloadMgmt.addressVerification.multipleUploadReducer.addressLoadingQueue,

        percentCompleted : state.workloadMgmt.addressVerification.physicalAddress.percentCompleted,
        addressLoadingQueue: state.workloadMgmt.addressVerification.physicalAddress.addressLoadingQueue,
        addAddressUrlState: state.workloadMgmt.addressVerification.physicalAddress.addAddressUrlState,
        uploadUrlType: state.workloadMgmt.addressVerification.physicalAddress.uploadUrlType,

        otherAddressUrl: state.workloadMgmt.addressVerification.multipleUploadReducer.addressUrl
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onGetAddressPic: (type, filePath, otherType) => dispatch(phyAddresActions.getAddressPic(type, filePath, otherType)),
        onUploadImage: (type, file, urlType, action, serviceRequestId) => dispatch(phyAddresActions.uploadPhysicalAddressUrl(type, file, urlType, action, serviceRequestId)),
        onDeleteImage: (type, fileName, urlType, action, url) => dispatch(phyAddresActions.deletePhysicalAddressUrl(type, fileName, urlType, action, url)),

        onDeleteOtherImage: (type, fileName, urlType, action, url) => dispatch(otherActions.deletePhysicalAddressUrl(type, fileName, urlType, action, url)),
    }
}
export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(ReferenceDetails)));