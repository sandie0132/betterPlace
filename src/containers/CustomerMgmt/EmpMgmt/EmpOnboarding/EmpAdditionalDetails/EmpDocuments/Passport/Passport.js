import React, { Component } from 'react';
import {Input, Datepicker} from 'react-crux';
import styles from './Passport.module.scss';
import { connect } from 'react-redux';
import cx from 'classnames';
import { initData, requiredFields } from './PassportInitData';
import BGVLabel from '../../BGVLabel/BGVLabel';

import Upload from '../../../../../../../components/Molecule/UploadDoc/UploadDoc';
import FileView from '../../../../../../../components/Molecule/FileView/FileView';
import WarningPopUp from '../../../../../../../components/Molecule/WarningPopUp/WarningPopUp';
import * as actions from '../Store/action';
import _ from 'lodash';
import { validation, message } from './PassportValidations';

///Icons
import upload from '../../../../../../../assets/icons/upload.svg';
import warn from '../../../../../../../assets/icons/warning.svg';

class Passport extends Component {

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
        //     this.props.onChange(this.state.formData, "PASSPORT")
        // }

        if (!_.isEqual(prevState.errors, this.state.errors)) {
            this.props.onError("PASSPORT", this.state.errors)
        }


        if (this.props.uploadFileState !== prevProps.uploadFileState && this.props.uploadFileState === 'SUCCESS') {
            let updatedFormData = _.cloneDeep(this.state.formData);
            const passportFile = this.props.passportFile;
            // let enableSubmit = this.state.enableSubmit;

            updatedFormData.downloadURL = !_.isEmpty(updatedFormData.downloadURL) ? updatedFormData.downloadURL : [];

            if (updatedFormData.uuid === undefined) {
                updatedFormData.downloadURL = [...updatedFormData.downloadURL, ...passportFile]
            }
            else {
                updatedFormData.downloadURL = [...updatedFormData.downloadURL, ...passportFile]
                // enableSubmit = true;
            }

            this.setState({
                formData: updatedFormData,
                isEdited: true
            }, ()=> this.debouncedDataToParent(this.state.formData, 'PASSPORT'));
            this.props.onResetDownloadUrl();
        }
        if (this.props.deleteFileState !== prevProps.deleteFileState && this.props.deleteFileState === 'SUCCESS' && this.props.docType==='passportData') {
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

            }, ()=> this.debouncedDataToParent(this.state.formData, 'PASSPORT'));
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
        this.setState({ formData: updatedFormData, isEdited: true },()=> this.debouncedDataToParent(this.state.formData,'PASSPORT'));
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
        this.props.onUploadFile('employee_documents', formData, 'passportData');

    }

    handleFileDownload = (url) => {
        this.props.onDownloadFile('employee_documents', url, 'passportData');
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
        this.props.onDeleteFile(dataId, 'employee_documents', fileName, url, 'passportData');

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
                        passport
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

                <div className={cx('d-flex flex-column', this.props.isDisabled ? styles.showOpacity : null)}>
                    <div className="col-12 px-0">
                        <div className="row no-gutters">
                            <Input
                                name='documentNumber'
                                className='col-4 pr-3'
                                required={_.includes(requiredFields, 'documentNumber')}
                                label={'passport number'}
                                type='text'
                                placeholder={'passport number'}
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
                                label={'name'}
                                type='text'
                                placeholder={'name'}
                                disabled={this.props.isDisabled}
                                value={this.state.formData.name}
                                onChange={(value) => this.handleInputChange(value, 'name')}
                                onError={(error) => this.handleError(error, 'name')}
                                validation={validation['name']}
                                message={message['name']}
                                errors={this.state.errors['name']}

                            />
                            <Datepicker
                                name='dob'
                                className='col-4 pr-3'
                                required={_.includes(requiredFields, 'dob')}
                                label={'date of birth'}
                                disabled={this.props.isDisabled}
                                value={this.state.formData.dob}
                                onChange={(value) => this.handleInputChange(value, 'dob')}
                                onError={(error) => this.handleError(error, 'dob')}
                                validation={validation['dob']}
                                message={message['dob']}
                                errors={this.state.errors['dob']}
                            />
                        </div>

                        <div className='row no-gutters'>
                            <Input
                                name="fatherName"
                                className='col-4 pr-3'
                                required={_.includes(requiredFields, 'fatherName')}
                                label={'father name'}
                                type='text'
                                placeholder={'father name'}
                                disabled={this.props.isDisabled}
                                value={this.state.formData.fatherName}
                                onChange={(value) => this.handleInputChange(value, "fatherName")}
                                onError={(error) => this.handleError(error, 'fatherName')}
                                validation={validation['fatherName']}
                                message={message['fatherName']}
                                errors={this.state.errors['fatherName']}

                            />
                            <Datepicker
                                name='issuedOn'
                                className='col-4 pr-3'
                                label={'issued on'}
                                required={_.includes(requiredFields, 'issuedOn')}
                                disabled={this.props.isDisabled}
                                value={this.state.formData.issuedOn}
                                onChange={(value) => this.handleInputChange(value, 'issuedOn')}
                                onError={(error) => this.handleError(error, 'issuedOn')}
                                validation={validation['issuedOn']}
                                message={message['issuedOn']}
                                errors={this.state.errors['issuedOn']}
                            />
                        </div>
                        <div className='row no-gutters'>
                            <Datepicker
                                name="validFrom"
                                className='col-4 pr-3'
                                label={'valid from'}
                                required={_.includes(requiredFields, 'validFrom')}
                                disabled={this.props.isDisabled}
                                value={this.state.formData.validFrom}
                                onChange={(value) => this.handleInputChange(value, "validFrom")}
                                onError={(error) => this.handleError(error, 'validFrom')}
                                validation={validation['validFrom']}
                                message={message['validFrom']}
                                errors={this.state.errors['validFrom']}
                            />
                            <Datepicker
                                name='validUpto'
                                className='col-4 pr-3'
                                label={'valid upto'}
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
                                id='uploadPassport'
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
        uploadFileState: state.empMgmt.empOnboard.additionalDetails.empDocuments.uploadPassportState,
        deleteFileState: state.empMgmt.empOnboard.additionalDetails.empDocuments.deleteFileState,
        deleteUrl: state.empMgmt.empOnboard.additionalDetails.empDocuments.deleteUrl,
        passportFile: state.empMgmt.empOnboard.additionalDetails.empDocuments.passportFile,
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


export default (connect(mapStateToProps, mapDispatchToProps)(Passport));