import React, { Component } from 'react';
import {Input, Datepicker} from 'react-crux';
import styles from './VehicleRegistration.module.scss';
import { connect } from 'react-redux';
import cx from 'classnames';
import { initData, requiredFields } from './VehicleRegistrationInitData';
import BGVLabel from '../../BGVLabel/BGVLabel';

import Upload from '../../../../../../../components/Molecule/UploadDoc/UploadDoc';
import FileView from '../../../../../../../components/Molecule/FileView/FileView';
import WarningPopUp from '../../../../../../../components/Molecule/WarningPopUp/WarningPopUp';
import * as actions from '../Store/action';
import _ from 'lodash';
import { validation, message } from './VehicleRegistrationValidations';

///Icons
import upload from '../../../../../../../assets/icons/upload.svg';
import warn from '../../../../../../../assets/icons/warning.svg';


class VehicleRegistration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            formData: {
                ...initData
            },
            errors: {},
            isEdited: false,
            editMode: true
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(prevProps.data, this.props.data) & !this.state.isEdited) {
            this.handlePropsToState();
        }

        if (!_.isEqual(prevProps.errors, this.props.errors)) {
            if (!_.isEqual(this.props.errors, this.state.errors)) {
                let updatedErrors = {};
                if (!_.isEmpty(this.props.errors)) {
                    updatedErrors = _.cloneDeep(this.props.errors);
                }
                this.setState({
                    errors: updatedErrors
                });
            }
        }

        if (prevProps.isEdited !== this.props.isEdited) {
            if (!this.props.isEdited) {
                this.handlePropsToState();
            }
        }

        // if (!_.isEqual(prevState.formData, this.state.formData) & this.state.isEdited) {
        //     this.props.onChange(this.state.formData, "RC")
        // }

        if (!_.isEqual(prevState.errors, this.state.errors)) {
            this.props.onError("RC", this.state.errors)
        }

        if (this.props.uploadFileState !== prevProps.uploadFileState && this.props.uploadFileState === 'SUCCESS') {
            let updatedFormData = _.cloneDeep(this.state.formData);
            const rcFile = this.props.rcFile;
            // let enableSubmit = this.state.enableSubmit;

            updatedFormData.downloadURL = !_.isEmpty(updatedFormData.downloadURL) ? updatedFormData.downloadURL : [];

            if (updatedFormData.uuid === undefined) {
                updatedFormData.downloadURL = [...updatedFormData.downloadURL, ...rcFile]
            }
            else {
                updatedFormData.downloadURL = [...updatedFormData.downloadURL, ...rcFile]
                // enableSubmit = true;
            }

            this.setState({
                formData: updatedFormData,
                isEdited: true
            },()=> this.debouncedDataToParent(this.state.formData, 'RC'));
            this.props.onResetDownloadUrl();
        }
        if (this.props.deleteFileState !== prevProps.deleteFileState && this.props.deleteFileState === 'SUCCESS' && this.props.docType==='rcData') {
            let updatedFormData = _.cloneDeep(this.state.formData);
            const deleteUrl = this.props.deleteUrl;
            // let enableSubmit = this.state.enableSubmit;
            if (!_.isEmpty(updatedFormData.downloadURL)) {
                if (updatedFormData.uuid === undefined) {
                    updatedFormData.downloadURL = updatedFormData.downloadURL.filter(url => {
                        if (url === deleteUrl) return null;
                        else return url;
                    })
                }
                else {
                    updatedFormData.downloadURL = updatedFormData.downloadURL.filter(url => {
                        if (url === deleteUrl) return null;
                        else return url;
                    })
                    // enableSubmit = true;
                }
            }
            this.setState({
                formData: updatedFormData,
                isEdited: true
            },()=> this.debouncedDataToParent(this.state.formData, 'RC'));
            this.props.onResetDeleteUrl();
        }
    }

    handlePropsToState = () => {
        let updatedFormData = {};
        if (!_.isEmpty(this.props.data)) {
            updatedFormData = _.cloneDeep(this.props.data)
            updatedFormData['documentNumber'] = updatedFormData['documentNumber'].toUpperCase();
        } else {
            updatedFormData = {
                ...initData
            }
        }

        this.setState({ formData: updatedFormData, isEdited: false })
    }

    debouncedDataToParent = _.debounce(this.props.onChange, 700, {leading:true})

    handleInputChange = (value, inputIdentifier) => {
        let updatedFormData = {
            ...this.state.formData,
        }
        let oldFormData = updatedFormData[inputIdentifier];
        if (inputIdentifier === 'documentNumber') {
            updatedFormData[inputIdentifier] = value
            updatedFormData[inputIdentifier] = updatedFormData[inputIdentifier].toUpperCase()
        }
        else {
            updatedFormData[inputIdentifier] = value;
        }
        if (oldFormData !== updatedFormData[inputIdentifier]) {
            this.setState({
                noEdit: false
            })
        }
        this.setState({ formData: updatedFormData, isEdited: true }, ()=> this.debouncedDataToParent(this.state.formData, "RC"));
    }

    handleError = (error, inputField) => {
        const currentErrors = _.cloneDeep(this.state.errors);
        let updatedErrors = _.cloneDeep(currentErrors);
        if (!_.isEmpty(error)) {
            updatedErrors[inputField] = error;
        } else {
            delete updatedErrors[inputField]
        }
        if (!_.isEqual(updatedErrors, currentErrors)) {
            this.setState({
                errors: updatedErrors
            });
        }
    };

    uploadFile = (file, dataId) => {

        let formData = new FormData();
        var i
        for (i = 0; i < file.length; i++) {
            formData.append('file', file[i]);
        }
        this.props.onUploadFile('employee_documents', formData, 'rcData');

    }

    handleFileDownload = (url) => {
        this.props.onDownloadFile('employee_documents', url, 'rcData');
    }

    showDeleteFileWarning = (e, dataId, url) => {

        e.stopPropagation();
        if (this.state.editMode) {
            const deleteObject = {
                dataId: dataId,
                url: url
            };
            this.setState({
                confirmDelete: true,
                deleteObject: deleteObject
            });
        }
    }

    deleteFile = () => {
        const dataId = this.state.deleteObject.dataId;
        const url = this.state.deleteObject.url;
        let fileName = (url === null || url === '' || url === undefined) ? '' :
            url.split('/');
        fileName = fileName[fileName.length - 1];
        this.props.onDeleteFile(dataId, 'employee_documents', fileName, url, 'rcData');

        this.setState({
            confirmDelete: false,
            deleteObject: {}
        })
    }

    render() {
        return (
            <div className="d-flex flex-column mt-4 pt-2">
                <div className="d-flex">
                    <div className={styles.formSubHead}>
                        registration certificate
                    </div>
                    {
                        !_.isEmpty(this.props.bgvMissingInfo) ?
                            <div className={"ml-auto mr-2"}>
                                <BGVLabel
                                    missingInfoData={this.props.bgvMissingInfo}
                                    type="missingInfo"
                                />
                            </div>
                            :
                            !_.isEmpty(this.props.bgvData) ?
                                <div className="ml-auto">
                                    <BGVLabel
                                        bgvData={this.props.bgvData}
                                        type="bgvStatus" />
                                </div>
                                :
                                null
                    }
                </div>

                <div className={cx('d-flex flex-column', this.props.isDisabled ? styles.showOpacity : null)} >
                    <div className="col-12 px-0">
                        <div className="row no-gutters">
                            <Input
                                name='documentNumber'
                                className='col-4 pr-3'
                                required={_.includes(requiredFields, 'documentNumber')}
                                label={'vehicle number'}
                                type='text'
                                placeholder={'vehicle number'}
                                disabled={this.props.isDisabled}
                                value={this.state.formData.documentNumber}
                                onChange={(value) => this.handleInputChange(value, 'documentNumber')}
                                onError={(error) => this.handleError(error, 'documentNumber')}
                                validation={validation['documentNumber']}
                                message={message['documentNumber']}
                                errors={this.state.errors['documentNumber']}

                            />
                        </div>
                        <div className="row no-gutters">
                            <Input
                                name='name'
                                className='col-4 pr-3'
                                required={_.includes(requiredFields, 'name')}
                                label={'owner name'}
                                type='text'
                                placeholder={'owner name'}
                                disabled={this.props.isDisabled}
                                value={this.state.formData.name}
                                onChange={(value) => this.handleInputChange(value, 'name')}
                                onError={(error) => this.handleError(error, 'name')}
                                validation={validation['name']}
                                message={message['name']}
                                errors={this.state.errors['name']}

                            />

                            <Input
                                name='chassisNumber'
                                className='col-4 pr-3'
                                label={'chassis number'}
                                type='text'
                                required={_.includes(requiredFields, 'chassisNumber')}
                                placeholder={'chassis number'}
                                disabled={this.props.isDisabled}
                                value={this.state.formData.chassisNumber}
                                onChange={(value) => this.handleInputChange(value, 'chassisNumber')}
                                onError={(error) => this.handleError(error, 'chassisNumber')}
                                validation={validation['chassisNumber']}
                                message={message['chassisNumber']}
                                errors={this.state.errors['chassisNumber']}

                            />
                            <Datepicker
                                name='validity'
                                className='col-4 pr-3'
                                label={'validity'}
                                required={_.includes(requiredFields, 'validUpto')}
                                disabled={this.props.isDisabled}
                                value={this.state.formData.validUpto}
                                onChange={(value) => this.handleInputChange(value, 'validUpto')}
                                onError={(error) => this.handleError(error, 'validUpto')}
                                validation={validation['validUpto']}
                                message={message['validUpto']}
                                errors={this.state.errors['validUpto']}
                            />
                        </div>

                        <div className='row no-gutters'>
                            <Input
                                name="engineNumber"
                                className='col-4 pr-3'
                                required={_.includes(requiredFields, 'engineNumber')}
                                label={'engine number'}
                                type='text'
                                placeholder={'engine number'}
                                disabled={this.props.isDisabled}
                                value={this.state.formData.engineNumber}
                                onChange={(value) => this.handleInputChange(value, "engineNumber")}
                                onError={(error) => this.handleError(error, 'engineNumber')}
                                validation={validation['engineNumber']}
                                message={message['engineNumber']}
                                errors={this.state.errors['engineNumber']}

                            />
                            <Datepicker
                                name='insuranceUpto'
                                className='col-4 pr-3'
                                label={'insurance upto'}
                                required={_.includes(requiredFields, 'insuranceUpto')}
                                disabled={this.props.isDisabled}
                                value={this.state.formData.insuranceUpto}
                                onChange={(value) => this.handleInputChange(value, 'insuranceUpto')}
                                onError={(error) => this.handleError(error, 'insuranceUpto')}
                                validation={validation['insuranceUpto']}
                                message={message['insuranceUpto']}
                                errors={this.state.errors['insuranceUpto']}
                            />
                        </div>

                        <div className='row no-gutters'>
                            <Input
                                name="addressLine1"
                                className='col-8 pr-3'
                                label={'address line 1'}
                                type='text'
                                required={_.includes(requiredFields, 'addressLine1')}
                                placeholder={'address line 1'}
                                disabled={this.props.isDisabled}
                                value={this.state.formData.addressLine1}
                                onChange={(value) => this.handleInputChange(value, "addressLine1")}
                                onError={(error) => this.handleError(error, 'addressLine1')}
                                validation={validation['addressLine1']}
                                message={message['addressLine1']}
                                errors={this.state.errors['addressLine1']}


                            />
                        </div>
                        <div className='row no-gutters'>
                            <Input
                                name="addressLine2"
                                className='col-8 pr-3'
                                label={'address line 2'}
                                type='text'
                                required={_.includes(requiredFields, 'addressLine2')}
                                placeholder={'address line 2'}
                                disabled={this.props.isDisabled}
                                value={this.state.formData.addressLine2}
                                onChange={(value) => this.handleInputChange(value, "addressLine2")}
                                onError={(error) => this.handleError(error, 'addressLine2')}
                                validation={validation['addressLine2']}
                                message={message['addressLine2']}
                                errors={this.state.errors['addressLine2']}


                            />

                            <Input
                                name="pincode"
                                className='col-4'
                                label={'pincode'}
                                type='text'
                                required={_.includes(requiredFields, 'pincode')}
                                placeholder={'pincode'}
                                disabled={this.props.isDisabled}
                                value={this.state.formData.pincode}
                                onChange={(value) => this.handleInputChange(value, "pincode")}
                                onError={(error) => this.handleError(error, 'pincode')}
                                validation={validation['pincode']}
                                message={message['pincode']}
                                errors={this.state.errors['pincode']}

                            />
                        </div>
                    </div>


                    <div className='row no-gutters mt-1'>
                        <div>
                            <Upload
                                upload={upload}
                                disabled={this.props.isDisabled}
                                id='uploadRc'
                                fileUpload={(file) => this.uploadFile(file, this.state.formData.uuid)}
                                addState={this.props.uploadFileState}
                                className={this.props.empData.isActive && this.state.editMode ? styles.Cursor : null}
                            // url={item.data.downloadURL[0]}
                            />
                        </div>
                        {!_.isEmpty(this.state.formData.downloadURL) ? this.state.formData.downloadURL.map((url, index) => {
                            return (
                                <FileView
                                    key={index}
                                    className={cx(styles.Preview, 'ml-2 mb-2')}
                                    url={url}
                                    fileClicked={this.props.downloadDlFileState === 'LOADING' ? null : () => this.handleFileDownload(url)}
                                    downloadFileState={this.props.downloadDlFileState}
                                    clicked={this.state.editMode ? (e) => this.showDeleteFileWarning(e, this.state.formData.uuid, url) : null}
                                    disabled={this.props.isDisabled}
                                />
                            )
                        }) : ""}

                        {this.state.confirmDelete ?
                            <WarningPopUp
                                text={'delete?'}
                                para={"Warning: this cannot be undone"}
                                confirmText={"yes, delete"}
                                cancelText={"keep"}
                                icon={warn}
                                warningPopUp={() => this.deleteFile()}
                                closePopup={() => this.setState({ confirmDelete: false, deleteObject: {} })}
                            />
                            : null
                        }


                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        // empId: state.empMgmt.empDocuments.empId,
        // postPutDataState: state.empMgmt.empDocuments.postPutDlState,
        // deleteDataState: state.empMgmt.empDocuments.deleteDlState,
        // dlData: state.empMgmt.empDocuments.dlData,
        // error: state.empMgmt.empDocuments.dlError,
        uploadFileState: state.empMgmt.empOnboard.additionalDetails.empDocuments.uploadRcState,
        deleteFileState: state.empMgmt.empOnboard.additionalDetails.empDocuments.deleteFileState,
        deleteUrl: state.empMgmt.empOnboard.additionalDetails.empDocuments.deleteUrl,
        rcFile: state.empMgmt.empOnboard.additionalDetails.empDocuments.rcFile,
        docType: state.empMgmt.empOnboard.additionalDetails.empDocuments.docType,
        // entityData: state.empMgmt.staticData.entityData,
        // isActive: state.empMgmt.staticData.isActive,
        // documentStatus: state.empMgmt.staticData.serviceStatus,
        // serviceStatusState: state.empMgmt.staticData.serviceStatusState,
        // downloadDlFileState: state.empMgmt.empDocuments.downloadDlFileState
        empData: state.empMgmt.empOnboard.onboard.empData
    };
};



const mapDispatchToProps = dispatch => {
    return {
        onResetDownloadUrl: () => dispatch(actions.resetDownloadUrl()),
        onResetDeleteUrl: () => dispatch(actions.resetDeleteUrl()),
        // onPostData: (empId, data, docType, orgId) => dispatch(actions.postData(empId, data, docType, orgId)),
        // onPutData: (empId, dataId, data, docType, orgId) => dispatch(actions.putData(empId, dataId, data, docType, orgId)),
        // onDeleteData: (empId, dataId, docType, orgId) => dispatch(actions.deleteData(empId, dataId, docType, orgId)),
        // onResetError: () => dispatch({ type: actionTypes.RESET_ERROR }),
        onUploadFile: (type, formData, docType) => dispatch(actions.uploadFile(type, formData, docType)),
        onDeleteFile: (dataId, type, fileName, url, docType) => dispatch(actions.deleteFile(dataId, type, fileName, url, docType)),
        onDownloadFile: (type, url, docType) => dispatch(actions.downloadFile(type, url, docType))
    };
};


export default (connect(mapStateToProps, mapDispatchToProps)(VehicleRegistration));