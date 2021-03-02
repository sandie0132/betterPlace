import React, { Component } from 'react';
import styles from "./EmpEmployment.module.scss";
import _ from 'lodash';
import cx from "classnames";
import { connect } from 'react-redux';

import addButton from "../../../../../../assets/icons/addMore.svg";

import { initData } from './Employment/EmploymentInitData';
import Employment from './Employment/Employment';
import * as actions from './Store/action';

class EmpEmployment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            formData: [],
            errors: {},
            isEdited: false,
            disableSectionAddDelete: false
        };
        this._isMounted = false;
    }

    componentDidMount() {
        this.handlePropsToState()
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
        //     this.handleSendDataToParent();
        // }

        if (!_.isEqual(prevState.errors, this.state.errors)) {
            this.props.onError(this.state.errors)
        }

        if (prevProps.uploadFileState !== this.props.uploadFileState) {
            if (this.props.uploadFileState === 'LOADING') {
                this.setState({
                    disableSectionAddDelete: true,
                    isEdited: true
                })
            }
            if (this.props.uploadFileState === 'SUCCESS') {
                let updatedFormData = _.cloneDeep(this.state.formData);
                const targetIndex = this.props.fileUploadIndex;
                const uploadedFileUrl = this.props.uploadedFileUrl;
                updatedFormData[targetIndex]['downloadURL'] = [
                    ...updatedFormData[targetIndex]['downloadURL'],
                    ...uploadedFileUrl
                ]
                this.setState({
                    disableSectionAddDelete: false,
                    formData: updatedFormData
                }, ()=> this.debouncedDataToParent())
            }
            if (this.props.uploadFileState === 'ERROR') {
                this.setState({
                    disableSectionAddDelete: false
                })
            }
        }
    }

    handlePropsToState = () => {
        let updatedFormData = [];
        if (!_.isEmpty(this.props.data)) {
            _.forEach(this.props.data, function (obj) {
                updatedFormData.push(obj);
            })
        }
        if (_.isEmpty(updatedFormData)) updatedFormData.push({ ...initData })
        this.setState({
            formData: updatedFormData,
            isEdited: false
        })
    }

    handleSendDataToParent = () => {
        let payload = [];
        _.forEach(this.state.formData, function (data) {
            if (!_.isEmpty(data)) {
                payload.push(data);
            }
        });
        if (_.isEmpty(payload)) {
            this.props.onChange(null);
        } else {
            this.props.onChange(payload);
        }
    }

    handleUpdateError = (errors) => {
        let updatedErrors = {};
        _.forEach(errors, function (error, index) {
            updatedErrors[Number(index) + 1] = error
        })
        return updatedErrors;
    }

    handleAddNewData = () => {
        const newData = { ...initData };
        let updatedFormData = _.cloneDeep(this.state.formData);
        let updatedErrors = _.cloneDeep(this.handleUpdateError(this.state.errors));
        updatedFormData = [
            newData,
            ...updatedFormData.slice(0)
        ]
        this.setState({
            formData: updatedFormData,
            errors: updatedErrors,
            isEdited: true
        }, ()=> this.debouncedDataToParent())
    }

    handleDeleteError = (errors, targetIndex) => {
        let updatedErrors = {};
        _.forEach(errors, function (error, index) {
            if (index > targetIndex) {
                updatedErrors[index - 1] = error
            } else if (index < targetIndex) {
                updatedErrors[index] = error
            }
        })
        return updatedErrors;
    }

    handleDeleteData = (targetIndex) => {
        let updatedFormData = _.cloneDeep(this.state.formData);
        let updatedErrors = _.cloneDeep(this.handleDeleteError(this.state.errors, targetIndex));
        updatedFormData = updatedFormData.filter((data, index) => {
            if (index === targetIndex) return null;
            else return data
        })
        this.setState({
            formData: updatedFormData,
            errors: updatedErrors,
            isEdited: true
        }, ()=> this.debouncedDataToParent())
    }

    debouncedDataToParent = _.debounce(this.handleSendDataToParent, 700, {leading:true})

    handleInputChange = (value, inputField, targetIndex) => {
        let updatedFormData = _.cloneDeep(this.state.formData);
        updatedFormData[targetIndex][inputField] = value;
        this.setState({
            formData: updatedFormData,
            isEdited: true
        }, ()=> this.debouncedDataToParent());
    };

    handleError = (error, inputField, targetIndex) => {
        const currentErrors = _.cloneDeep(this.state.errors);
        let updatedErrors = _.cloneDeep(currentErrors);
        let targetError = _.isEmpty(updatedErrors[targetIndex]) ? {} : updatedErrors[targetIndex];
        if (!_.isEmpty(error)) {
            targetError[inputField] = error;
        } else {
            delete targetError[inputField]
        }
        if (!_.isEmpty(targetError)) {
            updatedErrors[targetIndex] = targetError
        } else {
            delete updatedErrors[targetIndex]
        }
        if (!_.isEqual(updatedErrors, currentErrors)) {
            this.setState({
                errors: updatedErrors
            });
        }
    };

    handleFileUpload = (file, targetIndex) => {
        let formData = new FormData();
        var i
        for (i = 0; i < file.length; i++) {
            formData.append('file', file[i]);
        }
        this.props.onUploadFile(formData, targetIndex);
    }

    handleFileDownload = (url) => {
        this.props.onDownloadFile(url);
    }

    handleFileDelete = (e, fileUrl, targetIndex) => {
        e.stopPropagation();
        let updatedFormData = _.cloneDeep(this.state.formData);
        let updatedDownloadUrl = updatedFormData[targetIndex]['downloadURL'];
        _.remove(updatedDownloadUrl, function (url) {
            return url === fileUrl;
        });
        updatedFormData[targetIndex]['downloadURL'] = updatedDownloadUrl;
        this.setState({
            formData: updatedFormData,
            isEdited: true
        }, ()=> this.debouncedDataToParent())
    }

    getBGVData = (uuid) => {
        let BgvData = null;
        if (!_.isEmpty(this.props.bgvData)) {
            if (!_.isEmpty(this.props.bgvData[0])) {
                if (!_.isEmpty(this.props.bgvData[0].bgv)) {
                    if (!_.isEmpty(this.props.bgvData[0].bgv.career)) {
                        let BgvArray = this.props.bgvData[0].bgv.career.checks.filter(({ employment }) => employment);
                        if (!_.isEmpty(BgvArray)) {
                            BgvData = BgvArray.find(data => data.employment.uuid === uuid)
                        }
                    }
                }
            }
        }
        return BgvData;
    }

    getInProgressStatus = (uuid) => {
        let progressCheck = false;
        let BgvArray;
        let BgvData;

        if (!_.isEmpty(this.props.bgvData)) {
            if (!_.isEmpty(this.props.bgvData[0])) {
                if (!_.isEmpty(this.props.bgvData[0].bgv)) {
                    if (!_.isEmpty(this.props.bgvData[0].bgv.career)) {
                        BgvArray = this.props.bgvData[0].bgv.career.checks.filter(({ employment }) => employment);
                        if (!_.isEmpty(BgvArray)) {
                            BgvData = BgvArray.find(data => data.employment.uuid === uuid)
                        }
                        if (!_.isEmpty(BgvData)) {
                            if (BgvData.status === "inProgress") {
                                progressCheck = true
                            }
                        }
                    }
                }
            }
        }
        return progressCheck;
    }

    getBGVMissingInfo = (uuid) => {
        const missingInfo = this.props.bgvMissingInfo;
        let missingData = null
        if (!_.isEmpty(missingInfo)) {
            if (!_.isEmpty(missingInfo["EMPLOYMENT"])) {
                if (_.isEmpty(this.props.data)) {
                    missingData = missingInfo["EMPLOYMENT"][0]
                } else {
                    let missingDataUuid = missingInfo["EMPLOYMENT"].find(data => data.uuid === uuid)
                    if (!_.isEmpty(missingDataUuid)) {    
                        missingData = missingDataUuid
                    }
                }
            }
        }
        return missingData
    }

    render() {

        return (
            <div className={styles.formLayout}>
                <div className={cx("mb-4", this.props.isActive ? styles.opacityHeadIn : styles.opacityHeadOut)}>
                    <div className={styles.horizontalLineInactive}></div>
                    <span className={styles.formHead}>employment history</span>
                </div>

                <div>
                    <span className={styles.addHeading} onClick={this.handleAddNewData}>add employment<img src={addButton} alt="add" className="ml-2" /></span>
                </div>
                {
                    this.state.formData.map((data, index) => {
                        return (
                            <Employment
                                key={index}
                                index={index}
                                serialNumber={this.state.formData.length - index}
                                uploadFileState={this.props.fileUploadIndex === index ? this.props.uploadFileState : null}
                                downloadFileState={this.props.downloadFileState}
                                downloadingURLs={this.props.downloadURL}
                                disableSectionAddDelete={this.state.disableSectionAddDelete}
                                data={data}
                                errors={_.isEmpty(this.state.errors[index]) ? {} : this.state.errors[index]}
                                options={this.props.staticData["EMP_MGMT_WORK_TYPE"]}
                                onChange={(value, inputField) => this.handleInputChange(value, inputField, index)}
                                onError={((error, inputField) => this.handleError(error, inputField, index))}
                                onDelete={() => this.handleDeleteData(index)}
                                onFileUpload={(file) => this.handleFileUpload(file, index)}
                                onFileDownload={(url) => this.handleFileDownload(url, index)}
                                onDeleteFile={(e, url) => this.handleFileDelete(e, url, index)}
                                bgvData={this.getBGVData(data.uuid)}
                                isDisabled={this.getInProgressStatus(data.uuid)}
                                bgvMissingInfo={this.getBGVMissingInfo(data.uuid)}
                            />
                        )
                    })
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        error: state.empMgmt.empOnboard.additionalDetails.empEmployment.error,
        uploadFileState: state.empMgmt.empOnboard.additionalDetails.empEmployment.uploadFileState,
        fileUploadIndex: state.empMgmt.empOnboard.additionalDetails.empEmployment.fileUploadIndex,
        uploadedFileUrl: state.empMgmt.empOnboard.additionalDetails.empEmployment.uploadedFileUrl,
        downloadFileState: state.empMgmt.empOnboard.additionalDetails.empEmployment.downloadFileState,
        downloadURL: state.empMgmt.empOnboard.additionalDetails.empEmployment.downloadURL
    };
};

const mapDispatchToProps = dispatch => {
    return {
        initState: () => dispatch(actions.initState()),
        onUploadFile: (file, fileUploadIndex) => dispatch(actions.uploadFile(file, fileUploadIndex)),
        onDownloadFile: (url) => dispatch(actions.downloadFile(url))
    };
};


export default (connect(mapStateToProps, mapDispatchToProps)(EmpEmployment));