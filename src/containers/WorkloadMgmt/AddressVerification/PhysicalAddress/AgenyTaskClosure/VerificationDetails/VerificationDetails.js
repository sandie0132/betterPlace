import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from "react-redux";

import cx from "classnames";
import styles from './VerificationDetails.module.scss';
import _ from 'lodash';

import candidatePhotoThumbnail from '../../../../../../assets/icons/candidatePhotoThumbnail.svg';
import housePhotoThumbnail from '../../../../../../assets/icons/housePhotoThumbnail.svg';
import doorNoPhotoThumbnail from '../../../../../../assets/icons/doorNoIcon.svg';
import streetPhotoThumbnail from '../../../../../../assets/icons/streetIcon.svg'
import landmarkPhotoThumbnail from '../../../../../../assets/icons/landmarkIcon.svg';
import crossDisplayBoardThumbnail from '../../../../../../assets/icons/crossDisplayBoardPhotoThumbnail.svg';
import otherPhotoThumbanail from '../../../../../../assets/icons/otherPhotoThumbnail.svg';
import defaultIcon from '../../../../../../assets/icons/defaultPhysicalImage.svg';

import * as initData from '../../PhysicalAddressInitData';
import CustomSelect from '../../../../../../components/Atom/CustomSelect/CustomSelect';
import {Input, Datepicker} from 'react-crux';
import UploadPicture from '../../../../../../components/Molecule/UploadPicture/UploadPicture';
import UploadPictureMultiple from '../UploadPictureMultiple/UploadPictureMultiple';
import {validation, message} from './VerificationDetailsValidation';

import * as phyAddresActions from '../../Store/action';
import * as otherActions from '../UploadPictureMultiple/Store/action';
import { withTranslation } from 'react-i18next';

class VerificationDetails extends Component {

    handleAdressAction = (action, imageType, index) => {
        let imagesData = _.cloneDeep(this.props.imagesData);
        imagesData.forEach((img,ind) => {
            if(img.label === imageType){
                this.props.handleAdressAction(action, imageType, ind);
            }
        });
    }

    handleIcons = (label) => {
        switch (label) {
            case "id card" : return candidatePhotoThumbnail;
            case "house photo": return housePhotoThumbnail;
            case "door number": return doorNoPhotoThumbnail;
            case "street": return streetPhotoThumbnail;
            case "landmark": return landmarkPhotoThumbnail;
            case "cross display board" : return crossDisplayBoardThumbnail;
            case "others" : return otherPhotoThumbanail;

            default: return defaultIcon
        }
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
        const { t } = this.props;
        const errors = this.props.errors;
        let images = [];
        let uploadedOtherImages = [];
        let otherImages = [];
        let otherPercentage = this.props.otherPercentCompleted === 'undefined' ? 0 : this.props.otherPercentCompleted;
        
        this.props.verificationImagesData.forEach((imgData, index) => {
            if(imgData.isOther){
                if(initData.otherPhotos.includes(imgData.label)){
                    otherImages.push(
                        <UploadPictureMultiple
                            key={index}
                            addressLine={imgData.label}
                            file={(file) => this.props.file(file, imgData.label, imgData.label + "Action", true)}
                            addressLineIcon={this.handleIcons(imgData.label)}
                            serviceRequestId = {this.props.phyAddress.serviceRequestId}
                            type={"verification"}
                            handleOtherImages = {this.handleOtherImages}
                            images = {uploadedOtherImages}
                            showUpload = {true}
                            index={this.props.verIndex}
                            width = {styles.width}
                        />
                    )
                } else {
                    uploadedOtherImages.push(
                        <UploadPicture
                            key={index}
                            addressLine={imgData.label}
                            index={index}
                            delete={() => this.deleteImage(imgData.label, imgData.label + "Action")}
                            addressLineIcon={otherPhotoThumbanail}
                            showLoader = {this.props.otherAddressLoadingQueue.includes(imgData.label) }
                            showUploading = {this.props.otherAddAddressUrlState === "LOADING" &&  this.props.uploadUrlType === imgData.label}
                            imgUrl={imgData.image}
                            disabled={this.props.isDisabled}
                            percentCompleted = {otherPercentage}
                            className = {(uploadedOtherImages.length+1)%3 !== 0 ? "mr-3" : ''}
                        />
                    )
                }
            } else {
                images.push(
                    <UploadPicture
                        key={index}
                        addressLine={imgData.label}
                        index={index}
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
                <label className={styles.formHead}>{t('translation_addressTaskClosure:physicalAddress.verificationDetails')}</label>
                <form>
                    <div className="row no-gutters mt-2">
                        <CustomSelect
                            name='houseType'
                            className="col-4 pl-0 py-0 pr-3 mt-3"
                            required={this.props.checkMandatory && _.includes(initData.requiredFields, 'houseType')}
                            label={t('translation_addressTaskClosure:physicalAddress.houseType')}
                            options={this.props.houseTypeOptions}
                            value={this.props.formData.houseType}
                            errors={errors['houseType']}
                            onChange={(value) => this.props.onChange(value, 'houseType')}
                            onError={(error) => this.props.onError(error, 'houseType')}
                            disabled={this.props.isDisabled || this.props.isFormReadOnly}
                        />

                        <Datepicker
                            name='residenceSince'
                            className="col-4 pr-3"
                            label={t('translation_addressTaskClosure:physicalAddress.residenceSince')}
                            required={this.props.checkMandatory && _.includes(initData.requiredFields, 'residenceSince')}
                            value={this.props.formData.residenceSince}
                            errors={errors['residenceSince']}
                            onChange={(value) => this.props.onChange(value, 'residenceSince')}
                            onError={(error) => this.props.onError(error, 'residenceSince')}
                            validation={validation['residenceSince']}
                            message={message['residenceSince']}
                            disabled={this.props.isDisabled || this.props.isFormReadOnly}
                        />

                        <Datepicker
                            name='residenceTill'
                            className="col-4 pr-3"
                            label={t('translation_addressTaskClosure:physicalAddress.residenceTill')}
                            required={this.props.checkMandatory && _.includes(initData.requiredFields, 'residenceTill')}
                            value={this.props.formData.residenceTill}
                            errors={errors['residenceTill']}
                            onChange={(value) => this.props.onChange(value, 'residenceTill')}
                            onError={(error) => this.props.onError(error, 'residenceTill')}
                            validation={validation['residenceTill']}
                            message={message['residenceTill']}
                            disabled={this.props.isDisabled || this.props.isFormReadOnly}
                        />

                        <Input
                            name='duration'
                            className="col-4 pr-3"
                            label={t('translation_addressTaskClosure:physicalAddress.duration')}
                            type={'text'}
                            placeholder={t('translation_addressTaskClosure:physicalAddress.durationPlaceholder')}
                            required={this.props.checkMandatory && _.includes(initData.requiredFields, 'duration')}
                            value={this.props.formData.duration}
                            // errors={errors['duration']}
                            onChange={(value) => this.props.onChange(value, 'duration')}
                            // onError={(error) => this.props.onError(error, 'duration')}
                            // validation={validation['duration']}
                            // message={message['duration']}
                            disabled={this.props.isDisabled || this.props.isFormReadOnly}
                        />

                        <Input
                            name='latitude'
                            className='col-4 pr-3'
                            label={t('translation_addressTaskClosure:physicalAddress.latitude')}
                            type='text'
                            placeholder={t('translation_addressTaskClosure:physicalAddress.latitudePlaceholder')}
                            required={this.props.checkMandatory && _.includes(initData.requiredFields, 'latitude')}
                            value={this.props.formData.latitude}
                            errors={errors['latitude']}
                            onChange={(value) => this.props.onChange(value, 'latitude')}
                            onError={(error) => this.props.onError(error, 'latitude')}
                            validation={validation['latitude']}
                            message={message['latitude']}
                            disabled={this.props.isDisabled || this.props.isFormReadOnly}
                        />

                        <Input
                            name='longitude'
                            className='col-4 pr-3'
                            label={t('translation_addressTaskClosure:physicalAddress.longitude')}
                            type='text'
                            placeholder={t('translation_addressTaskClosure:physicalAddress.longitudePlaceholder')}
                            required={this.props.checkMandatory && _.includes(initData.requiredFields, 'longitude')}
                            value={this.props.formData.longitude}
                            errors={errors['longitude']}
                            onChange={(value) => this.props.onChange(value, 'longitude')}
                            onError={(error) => this.props.onError(error, 'longitude')}
                            validation={validation['longitude']}
                            message={message['longitude']}
                            disabled={this.props.isDisabled || this.props.isFormReadOnly}
                        />

                    </div>
                </form>
                <div className={"row no-gutters"}>
                    {/* {verificationImages} */}
                    <div className={"d-flex flex-wrap justify-content-between"} style={{width:"100%"}}>
                        {images}
                    </div>
                    {uploadedOtherImages}
                    {otherImages}
                </div>
                <hr className={_.isEmpty(this.props.verificationImagesData) ? styles.HorizontalLine : cx(styles.HorizontalLine, "mt-4")} />
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        houseTypeOptions : state.workloadMgmt.addressVerification.physicalAddress.taskClosureStaticData['EMP_MGMT_HOUSE_TYPE'],

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
        onUploadImage: (type, file, urlType, action, serviceRequestId, sectionType) => dispatch(phyAddresActions.uploadPhysicalAddressUrl(type, file, urlType, action, serviceRequestId, sectionType)),
        onDeleteImage: (type, fileName, urlType, action, url) => dispatch(phyAddresActions.deletePhysicalAddressUrl(type, fileName, urlType, action, url)),

        onDeleteOtherImage: (type, fileName, urlType, action, url) => dispatch(otherActions.deletePhysicalAddressUrl(type, fileName, urlType, action, url))
    }
}
export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(VerificationDetails)));