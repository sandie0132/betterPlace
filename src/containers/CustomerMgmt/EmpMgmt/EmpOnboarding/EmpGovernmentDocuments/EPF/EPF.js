import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import _ from 'lodash';
import cx from "classnames";

import Loader from '../../../../../../components/Organism/Loader/Loader';
import Spinnerload from '../../../../../../components/Atom/Spinner/Spinner';
import Prompt from '../../../../../../components/Organism/Prompt/Prompt';
import CancelButton from '../../../../../../components/Molecule/CancelButton/CancelButton';
import { Button } from 'react-crux';
import WarningPopUp from '../../../../../../components/Molecule/WarningPopUp/WarningPopUp';
import Notification from '../../../../../../components/Molecule/Notification/Notification';
import scrollStyle from '../../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import DocumentUpload from '../../DocumentUpload/DocumentUpload';
import warn from '../../../../../../assets/icons/warning.svg';
import blueWarn from '../../../../../../assets/icons/warnBlue.svg';
import ToggleDocConfig from '../../ToggleDocConfig/ToggleDocConfig';
import * as actions from '../../Store/action';
import epfIcon from "../../../../../../assets/icons/epf.svg";
import download from '../../../../../../assets/icons/downloadWhite.svg';

import styles from './EPF.module.scss';
import EPFDocGeneration from './EPFDocGeneration/EPFDocGeneration';
import { InitData, requiredFields } from './EPFDocGeneration/EPFDocGenerationInitData';

const generationInProgressMessage = 'document generation in progress. come back in some time :)'
const generationErrorMessage = 'there is an issue with the PF website, please come back later to complete registration for the employee.'

class EPF extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isConfigDocGenerate: true,
            formData: {},
            errors: {},
            showCancelPopUp: false,
            showToggleConfigPopup: false,
            showGeneratePopup: false,
            isEdited: false,
            enableSubmit: false,
            loading: true,
            status: null
        };
        this._isMounted = false;

    }

    componentDidMount() {
        this._isMounted = true;
        this.handlePropsToState()
    }

    componentDidUpdate(prevProps, prevState) {

        if (!_.isEqual(prevProps.empData, this.props.empData)) {
            this.handlePropsToState();
        }

        if (prevState.isConfigDocGenerate !== this.state.isConfigDocGenerate) {
            if (this.state.isConfigDocGenerate) this.handleShowForm(false)
            else this.handleShowFileUplod()
        }

        if (prevProps.putDataState !== this.props.putDataState) {
            if (this.props.putDataState === 'SUCCESS') {
                this.setState({
                    showNotification: true
                });
                setTimeout(() => {
                    if (this._isMounted) {
                        this.setState({ showNotification: false });
                    }
                }, 5000);
            }
            if (this.props.putDataState === "ERROR") {
                this.setState({
                    showNotification: true,
                    isEdited: false,
                    enableSubmit: false,
                    errors: {}
                });
            }
        }

        if (prevProps.generateDataState !== this.props.generateDataState) {
            if (this.props.generateDataState === "ERROR") {
                this.setState({
                    showNotification: true,
                    isEdited: false,
                    enableSubmit: false,
                    errors: {}
                });
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleShowFileUplod = () => {
        const docType = "EPF";
        let formData = {};
        let enableSubmit = false;
        let isEdited = false;

        if (!_.isEmpty(this.props.empData) && !_.isEmpty(this.props.empData.government_documents)) {
            _.forEach(this.props.empData.government_documents, function (document) {
                if (docType === document.documentType && !document.isConfigDocGenerate) {
                    formData = _.cloneDeep(document)
                }
            })
        }
        if (_.isEmpty(formData)) {
            formData['downloadURL'] = '';
            isEdited = true;
        }
        this.setState({
            formData: formData,
            status: null,
            isEdited: isEdited,
            enableSubmit: enableSubmit,
            errors: {}
        })
    }

    handleShowForm = (createNewForm) => {
        const docType = "EPF"
        let formData = {}
        let status = this.state.status;
        let showNotification = false;
        let enableSubmit = false;
        let isEdited = false;

        if (!createNewForm && !_.isEmpty(this.props.empData) && !_.isEmpty(this.props.empData.government_documents)) {
            _.forEach(this.props.empData.government_documents, function (document) {
                if (docType === document.documentType && document.isConfigDocGenerate) {
                    formData = _.cloneDeep(document);
                    status = document.status;
                    if (status === 'inProgress' || status === 'error') showNotification = true;
                }
            })
        }
        if (_.isEmpty(formData)) {
            formData = _.cloneDeep(InitData);
            formData = _.cloneDeep(this.handlePreFillData(formData));
            enableSubmit = this.handleEnableSubmit(formData);
        }
        if (createNewForm) {
            status = null;
            isEdited = true;
        }
        this.setState({
            formData: formData,
            isEdited: isEdited,
            status: status,
            showNotification: showNotification,
            enableSubmit: enableSubmit,
            errors: {}
        })
    }

    handlePropsToState = () => {
        const docType = "EPF";
        let formData = {}
        let isConfigDocGenerate = this.state.isConfigDocGenerate;
        let status = null;
        let showNotification = false;
        let enableSubmit = false;

        if (!_.isEmpty(this.props.empData) && !_.isEmpty(this.props.empData.government_documents)) {
            _.forEach(this.props.empData.government_documents, function (document) {
                if (docType === document.documentType) {
                    formData = _.cloneDeep(document)
                    isConfigDocGenerate = document.isConfigDocGenerate
                    status = document.status
                    if (status === 'inProgress' || status === 'error') showNotification = true;
                }
            })
        }
        if (_.isEmpty(formData)) {
            formData = _.cloneDeep(InitData);
            formData = _.cloneDeep(this.handlePreFillData(formData));
            enableSubmit = this.handleEnableSubmit(formData);
        }

        this.setState({
            formData: formData,
            isConfigDocGenerate: isConfigDocGenerate,
            isEdited: false,
            loading: false,
            errors: {},
            showCancelPopUp: false,
            enableSubmit: enableSubmit,
            status: status,
            showNotification: showNotification
        })

    }

    handlePreFillData = (formData) => {
        let updatedFormData = _.cloneDeep(formData);
        let empData = _.cloneDeep(this.props.empData);

        if (!_.isEmpty(empData)) {
            _.forEach(updatedFormData, function (value, field) {
                switch (field) {
                    case 'name':
                        if (!_.isEmpty(empData.documents)) {
                            _.forEach(empData.documents, function (obj) {
                                if (obj.type === 'AADHAAR' && /^[a-zA-Z][a-zA-Z\s]*$/.test(obj['name'])) {
                                    updatedFormData[field] = obj['name'];
                                }
                            })
                        }
                        break;
                    case 'dob':
                        if (!_.isEmpty(empData.documents)) {
                            _.forEach(empData.documents, function (obj) {
                                if (obj.type === 'AADHAAR') {
                                    updatedFormData[field] = obj['dob'];
                                }
                            })
                        }
                        break;
                    case 'gender':
                        if (!_.isEmpty(empData.gender)) {
                            if (empData.gender === 'MALE') updatedFormData[field] = 'MALE'
                            else if (empData.gender === 'FEMALE') updatedFormData[field] = 'FEMALE'
                        }
                        break;
                    case 'nationality':
                        if (!_.isEmpty(empData.nationality)) {
                            if (empData.nationality === 'INDIAN') updatedFormData[field] = '77'
                        }
                        break;
                    case 'maritalStatus':
                        if (!_.isEmpty(empData.maritalStatus)) {
                            if (empData.maritalStatus === 'SINGLE') updatedFormData[field] = 'U'
                            else if (empData.maritalStatus === 'MARRIED') updatedFormData[field] = 'M'
                            else if (empData.maritalStatus === 'WIDOWED') updatedFormData[field] = 'W'
                            else if (empData.maritalStatus === 'DIVORCED') updatedFormData[field] = 'D'
                        }
                        break;
                    case 'employeePhoneNumber':
                        if (!_.isEmpty(empData.contacts)) {
                            _.forEach(empData.contacts, function (obj) {
                                if (obj.isPrimary && obj.type === 'MOBILE' && /^\d{10}$/.test(obj['contact'])) updatedFormData[field] = obj['contact']
                            })
                        }
                        break;
                    case 'relation':
                        if (!_.isEmpty(empData.familyRefs)) {
                            _.forEach(empData.familyRefs, function (obj) {
                                if (obj.relationship === 'FATHER') {
                                    updatedFormData[field] = 'F';
                                }
                            })
                        }
                        break;
                    case 'fatherOrHusbandName':
                        if (!_.isEmpty(empData.familyRefs)) {
                            _.forEach(empData.familyRefs, function (obj) {
                                if (obj.relationship === 'FATHER' && /^[a-zA-Z][a-zA-Z\s]*$/.test(obj['name'])) {
                                    updatedFormData[field] = obj['name'];
                                }
                            })
                        }
                        break;
                    case 'joiningDate':
                        if (!_.isEmpty(empData.joiningDate)) {
                            updatedFormData[field] = empData.joiningDate;
                        }
                        break;
                    case 'aadhaarNumber':
                        if (!_.isEmpty(empData.documents)) {
                            _.forEach(empData.documents, function (obj) {
                                if (obj.type === 'AADHAAR') {
                                    updatedFormData[field] = obj['documentNumber'];
                                }
                            })
                        }
                        break;
                    case 'passportNumber':
                        if (!_.isEmpty(empData.documents)) {
                            _.forEach(empData.documents, function (obj) {
                                if (obj.type === 'PASSPORT') {
                                    updatedFormData[field] = obj['documentNumber'];
                                }
                            })
                        }
                        break;
                    case 'nameOnPassport':
                        if (!_.isEmpty(empData.documents)) {
                            _.forEach(empData.documents, function (obj) {
                                if (obj.type === 'PASSPORT' && /^[a-zA-Z][a-zA-Z\s]*$/.test(obj['name'])) {
                                    updatedFormData[field] = obj['name'];
                                }
                            })
                        }
                        break;
                    case 'passportValidFrom':
                        if (!_.isEmpty(empData.documents)) {
                            _.forEach(empData.documents, function (obj) {
                                if (obj.type === 'PASSPORT') {
                                    updatedFormData[field] = obj['validFrom'];
                                }
                            })
                        }
                        break;
                    case 'passportValidTill':
                        if (!_.isEmpty(empData.documents)) {
                            _.forEach(empData.documents, function (obj) {
                                if (obj.type === 'PASSPORT') {
                                    updatedFormData[field] = obj['validUpto'];
                                }
                            })
                        }
                        break;
                    default:
                        break;
                }
            })
        }
        return updatedFormData
    }

    toggleDocumentConfiguration = () => {
        let showToggleConfigPopup = !_.isEmpty(this.state.formData.uuid) || this.state.isEdited;
        if (showToggleConfigPopup) {
            this.setState({
                showToggleConfigPopup: showToggleConfigPopup
            })
        } else {
            this.setState({
                isConfigDocGenerate: !this.state.isConfigDocGenerate
            })
        }
    }

    handleInputChange = (value, inputField) => {
        let updatedFormData = _.cloneDeep(this.state.formData);
        updatedFormData[inputField] = value;
        let enableSubmit = this.handleEnableSubmit(updatedFormData);
        this.setState({
            formData: updatedFormData,
            isEdited: true,
            enableSubmit: enableSubmit
        });
    };

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

    handleCheckBox = (inputField) => {
        let updatedFormData = _.cloneDeep(this.state.formData);

        if (inputField === "isInternationalWorker") {
            if (updatedFormData["isInternationalWorker"]) {
                updatedFormData["isInternationalWorker"] = !this.state.formData["isInternationalWorker"];
                updatedFormData["nameOnPassport"] = "";
                updatedFormData["countryOfOrigin"] = null;
                updatedFormData["passportNumber"] = null;
                updatedFormData["passportValidFrom"] = null;
                updatedFormData["passportValidTill"] = null;
            } else {
                updatedFormData["isInternationalWorker"] = !this.state.formData["isInternationalWorker"];
            }
        } else if (inputField === "isDifferentlyAbled") {
            if (updatedFormData["isDifferentlyAbled"]) {
                updatedFormData["isDifferentlyAbled"] = !this.state.formData["isDifferentlyAbled"];
                updatedFormData["disablityType"] = [];
            } else {
                updatedFormData["isDifferentlyAbled"] = !this.state.formData["isDifferentlyAbled"];
            }
        } else {
            updatedFormData[inputField] = !this.state.formData[inputField];
        }
        let enableSubmit = this.handleEnableSubmit(updatedFormData);
        this.setState({
            formData: updatedFormData,
            enableSubmit: enableSubmit,
            isEdited: true
        });
    };

    handleRadioButton = (inputField) => {
        let updatedFormData = _.cloneDeep(this.state.formData);

        if (_.includes(updatedFormData["disablityType"], inputField)) {
            updatedFormData["disablityType"] = updatedFormData["disablityType"].filter(e => e !== inputField);
        } else {
            updatedFormData["disablityType"].push(inputField)
        }
        let enableSubmit = this.handleEnableSubmit(updatedFormData);
        this.setState({
            formData: updatedFormData,
            enableSubmit: enableSubmit,
            isEdited: true
        })
    }

    handleEnableSubmit = (formData) => {
        let enableSubmit = true;
        if(this.state.isConfigDocGenerate){
            _.forEach(formData, function (value, field) {
                if (field === 'countryOfOrigin' || field === 'passportNumber' || field === 'passportValidFrom'
                    || field === 'passportValidTill' || field === 'nameOnPassport'){
                    if (formData['isInternationalWorker'] && _.isEmpty(value)) enableSubmit = false
                }
                else if (field === 'disablityType') {
                    if (formData['isDifferentlyAbled'] && _.isEmpty(value)) enableSubmit = false
                }
                else if (_.includes(requiredFields, field)) {
                    if (_.isEmpty(value)) enableSubmit = false
                }
            })
        }else{
            if(_.isEmpty(formData) || _.isEmpty(formData.downloadURL)) enableSubmit = false
        }
        return enableSubmit;
    }

    handleShowCancelPopUp = () => {
        this.setState({
            showCancelPopUp: !this.state.showCancelPopUp
        });
    }

    handleToggleGeneratePopup = () => {
        this.setState({
            showGeneratePopup: !this.state.showGeneratePopup
        });
    }

    handleShowToggleConfigPopup = (reset) => {
        let isConfigDocGenerate = this.state.isConfigDocGenerate;
        if (reset) isConfigDocGenerate = !isConfigDocGenerate;

        let isEdited = this.state.isEdited;
        if (reset) isEdited = false;

        let enableSubmit = this.state.enableSubmit;
        if (reset) enableSubmit = false;

        this.setState({
            showToggleConfigPopup: !this.state.showToggleConfigPopup,
            isConfigDocGenerate: isConfigDocGenerate,
            isEdited: isEdited,
            enableSubmit: enableSubmit
        })
    }

    handleFileUplod = (url) => {
        let formData = { downloadURL: url }
        this.setState({
            formData: formData,
            isEdited: true,
            enableSubmit: true
        })
    }

    handleDocumentGenerate = () => {
        const { match } = this.props;
        const orgId = match.params.uuid;
        const empId = match.params.empId;
        const docType = "EPF";

        let payload = _.cloneDeep(this.state.formData);
        payload['isConfigDocGenerate'] = this.state.isConfigDocGenerate;
        payload['documentType'] = docType;
        this.props.generateDoc(orgId, empId, docType, payload);
        this.handleToggleGeneratePopup()
    }

    handleFileSave = () => {
        const { match } = this.props;
        const orgId = match.params.uuid;
        const empId = match.params.empId;
        const docType = "EPF";
        let payload = {}

        if (!_.isEmpty(this.state.formData.downloadURL)) {
            payload = _.cloneDeep(this.state.formData);
            payload['isConfigDocGenerate'] = this.state.isConfigDocGenerate;
            payload['documentType'] = docType;
            payload['status'] = 'done';
        }

        let empData = _.cloneDeep(this.props.empData);

        if (!_.isEmpty(empData.government_documents)) {
            let docAlreadyPresent = false;
            _.forEach(empData.government_documents, function (document, index) {
                if (docType === document.documentType) {
                    if (!_.isEmpty(payload)) empData.government_documents[index] = payload;
                    else empData.government_documents.splice(index, 1)
                    docAlreadyPresent = true;
                }
            })
            if (!docAlreadyPresent && !_.isEmpty(payload)) {
                empData['government_documents'] = [
                    ...empData['government_documents'],
                    payload
                ]
            }
        } else if (_.isEmpty(empData.government_documents) && !_.isEmpty(payload)) {
            empData['government_documents'] = [payload]
        }
        this.props.putEmpData(orgId, empId, empData);
    }

    handleGeneratedFileDownload = () => {
        this.props.documentDownload(this.state.formData['downloadURL'])
    }

    render() {
        const mandatoryFieldsFilled = this.handleEnableSubmit(this.state.formData);
        return (
            <React.Fragment>
                <Prompt
                    when={this.state.isEdited}
                />
                {
                    this.state.loading ?
                        <div className={cx(styles.alignCenter, scrollStyle.scrollbar, "pt-2")}>
                            <Loader type='onboardForm' />
                        </div>
                        :
                        <div className={cx(styles.alignCenter)}>
                            <ToggleDocConfig
                                value={this.state.isConfigDocGenerate}
                                changed={() => this.toggleDocumentConfiguration()}
                                docName={"EPF"}
                                disabled={this.state.status === 'inProgress'}
                            />
                            {
                                this.state.showToggleConfigPopup ?
                                    <WarningPopUp
                                        text={this.state.isConfigDocGenerate ? 'upload available?' : 'generate new?'}
                                        para={'Warning: this will delete any unsaved changes or previously ' +
                                            (this.state.isConfigDocGenerate ? 'generated' : 'uploaded') + ' document.'}
                                        confirmText={'yes'}
                                        cancelText={'keep'}
                                        icon={blueWarn}
                                        warningPopUp={() => this.handleShowToggleConfigPopup(true)}
                                        closePopup={() => this.handleShowToggleConfigPopup(false)}
                                        isAlert
                                    />
                                    :
                                    null
                            }
                            {
                                this.state.showGeneratePopup ?
                                    <WarningPopUp
                                        text='are you sure you want to start the EPF generation process?'
                                        para="Warning: please check all the details. once the generation is started, you can't stop the process, and can't edit the details after generation."
                                        confirmText={'yes generate'}
                                        cancelText={'cancel'}
                                        icon={blueWarn}
                                        warningPopUp={() => this.handleDocumentGenerate()}
                                        closePopup={() => this.handleToggleGeneratePopup()}
                                        isAlert
                                    />
                                    :
                                    null
                            }

                            {
                                this.state.showCancelPopUp ?
                                    <WarningPopUp
                                        text={'cancel?'}
                                        para={'Warning: this cannot be undone'}
                                        confirmText={'yes, cancel'}
                                        cancelText={'keep'}
                                        icon={warn}
                                        warningPopUp={this.handlePropsToState}
                                        closePopup={this.handleShowCancelPopUp}
                                    />
                                    : null
                            }

                            <div className={scrollStyle.scrollbar}>
                                <div style={{ backgroundColor: 'white', padding: '8px', position: "relative", marginTop: '8px' }}>
                                    {
                                        this.state.status !== 'done' ?
                                            <React.Fragment>
                                                <div className={cx(styles.formHeader, "row mx-0")}>
                                                    <div className={cx(styles.timeHeading,"col-8 px-0 mx-0")}>
                                                        {
                                                            this.state.showNotification && this.state.status === 'inProgress' ?
                                                                <Notification
                                                                    type="info"
                                                                    message={generationInProgressMessage}
                                                                />
                                                                :
                                                                this.state.showNotification && this.state.status === 'error' ?
                                                                    <Notification
                                                                        type="warning"
                                                                        message={_.isEmpty(this.state.formData.comment) ? generationErrorMessage : this.state.formData.comment}
                                                                    />
                                                                    :
                                                                    this.props.putDataState === "SUCCESS" && this.state.showNotification ?
                                                                        <Notification
                                                                            type="success"
                                                                            message="document updated successfully"
                                                                        />
                                                                        : this.state.showNotification && (this.props.putDataState === "ERROR" || this.props.generateDataState === "ERROR") ?
                                                                            <Notification
                                                                                type="warning"
                                                                                message={this.props.error}
                                                                            />
                                                                            :
                                                                            !mandatoryFieldsFilled && this.state.isConfigDocGenerate?
                                                                                <Notification
                                                                                    type="basic"
                                                                                    message="please fill all the mandatory fields to enable save"
                                                                                />
                                                                                : 
                                                                                null
                                                        }
                                                    </div>
                                                    <div className="ml-auto d-flex my-auto" style={{ position: "relative" }}>
                                                        {
                                                            this.state.isConfigDocGenerate && this.state.status === 'error' && !this.state.isEdited ?
                                                                <React.Fragment>
                                                                    {
                                                                        this.props.generateDataState === 'LOADING' ?
                                                                            <Spinnerload type='loading' />
                                                                            :
                                                                            <Button
                                                                                label={'try again'}
                                                                                type='save'
                                                                                clickHandler={this.handleToggleGeneratePopup}
                                                                            />
                                                                    }
                                                                </React.Fragment>
                                                                :
                                                                <React.Fragment>
                                                                    <CancelButton
                                                                        className={styles.cancelButton}
                                                                        isDisabled={!this.state.isEdited}
                                                                        clickHandler={this.handleShowCancelPopUp}
                                                                    />
                                                                    {
                                                                        this.props.putDataState === 'LOADING' || this.props.generateDataState === 'LOADING' ?
                                                                            <Spinnerload type='loading' />
                                                                            :
                                                                            <Button
                                                                                label={this.state.isConfigDocGenerate ? 'save and generate' : 'save'}
                                                                                type='save'
                                                                                isDisabled={!this.state.enableSubmit || !_.isEmpty(this.state.errors) || this.state.status === 'inProgress'}
                                                                                clickHandler={this.state.isConfigDocGenerate ?
                                                                                    this.handleToggleGeneratePopup : this.handleFileSave
                                                                                }
                                                                            />
                                                                    }
                                                                </React.Fragment>
                                                        }
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                            :
                                            null
                                    }

                                </div>
                            </div>
                            <div className={styles.CardLayout}>
                                {
                                    !this.state.isConfigDocGenerate ?
                                        <div className="d-flex flex-column" style={{ paddingTop: "1.5rem" }}>
                                            <img src={epfIcon} alt="epf icon" style={{width: '110px', height:'91px', alignSelf: 'center'}}/>
                                            <label className={cx(styles.headingBlue)} style={{ paddingTop: "1.5rem" }}>upload EPF document available</label>
                                            <label className={cx(styles.subHeading)} style={{ paddingTop: "0.5rem" }}>please upload EPF document downloaded from EPF website here</label>
                                            <div style={{ paddingTop: "2rem" }}></div>
                                            <DocumentUpload
                                                documentType={"EPF"}
                                                file={(url) => this.handleFileUplod(url)}
                                                url={this.state.formData.downloadURL}
                                                folderName="employee_government_documents"
                                                maxMbSize={5}
                                                
                                            />
                                        </div>
                                        :
                                        <React.Fragment>
                                            {
                                                this.state.status === 'done' ?
                                                    <div className={cx(styles.CardLayout, styles.alignDownloadCard)}>
                                                        <img src={epfIcon} alt="epf icon" class="mx-auto" style={{ paddingBottom: "1.5rem" }} />
                                                        <div className={styles.blueHeading}>EPF document successfully generated</div>
                                                        <div style={{ marginTop: "1.5rem" }}>
                                                            <div onClick={this.handleGeneratedFileDownload} className={cx(styles.downloadButtonContainer, styles.pointer, "position-relative d-flex flex-row mx-auto")}>
                                                                {this.props.docDownloadState === "LOADING" ?
                                                                    <div className="ml-2"><Loader type='stepLoaderWhite' /></div>
                                                                    :
                                                                    <img src={download} alt="icon" style={{ height: "16px", width: "16px", marginLeft: "8px", marginTop: "4px" }} />}
                                                                <label className={cx(styles.text, styles.pointer)} style={this.props.docDownloadState === "LOADING" ?
                                                                    { paddingLeft: "30px", paddingTop: "4px", paddingRight: "4px", color: "#FFFFFF" }
                                                                    :
                                                                    { paddingLeft: "8px", paddingTop: "4px", paddingRight: "4px", color: "#FFFFFF" }}>
                                                                    download EPF document
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    :
                                                    <EPFDocGeneration
                                                        formData={this.state.formData}
                                                        errors={this.state.errors}
                                                        disabled={this.state.status === "inProgress"}
                                                        handleInputChange={this.handleInputChange}
                                                        handleError={this.handleError}
                                                        handleCheckBox={this.handleCheckBox}
                                                        handleRadioButton={this.handleRadioButton}
                                                    />
                                            }
                                        </React.Fragment>
                                }
                            </div>

                        </div>
                }
            </React.Fragment>
        )
    }

}

const mapStateToProps = state => {
    return {
        orgOnboardConfig: state.empMgmt.staticData.orgOnboardConfig,
        empData: state.empMgmt.empOnboard.onboard.empData,
        getDataState: state.empMgmt.empOnboard.onboard.getEmpDataState,
        putDataState: state.empMgmt.empOnboard.onboard.putEmpDataState,
        generateDataState: state.empMgmt.empOnboard.onboard.empDocGenerateState,
        docDownloadState: state.empMgmt.empOnboard.onboard.downloadDocumentState,
        error: state.empMgmt.empOnboard.onboard.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        putEmpData: (orgId, empId, data) => dispatch(actions.putEmpData(orgId, empId, data, false, false)),
        generateDoc: (orgId, empId, docType, data) => dispatch(actions.generateDocument(orgId, empId, 'GOVERNMENT', docType, data)),
        documentDownload: (url) => dispatch(actions.documentDownload(url))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EPF));