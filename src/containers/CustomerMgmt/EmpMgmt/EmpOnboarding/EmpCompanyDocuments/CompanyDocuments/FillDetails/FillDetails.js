import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import cx from "classnames";
import { Button, Input, Datepicker } from 'react-crux';
import Loader from '../../../../../../../components/Organism/Loader/Loader';
import Spinnerload from '../../../../../../../components/Atom/Spinner/Spinner';
import Prompt from '../../../../../../../components/Organism/Prompt/Prompt';
import CancelButton from '../../../../../../../components/Molecule/CancelButton/CancelButton';
import WarningPopUp from '../../../../../../../components/Molecule/WarningPopUp/WarningPopUp';
import Notification from '../../../../../../../components/Molecule/Notification/Notification';
import scrollStyle from '../../../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
// import DownloadButton from '../../../../../../../components/Atom/DownloadButton/DownloadButton';
import CustomSelect from '../../../../../../../components/Atom/CustomSelect/CustomSelect';
import SingleTagSearchField from "../../../../../../TagSearch/SingleTagSearch/SingleTagSearch";
import EmpSearch from '../../../../../../EmpSearch/EmpSearch';
import warn from '../../../../../../../assets/icons/warning.svg';
import skip from '../../../../../../../assets/icons/skipIcon.svg';

import * as actions from '../../../Store/action';
// import * as actionsSignature from '../../DigitalSignature/Store/action';

import { validation, message } from './FieldsValidation';
import styles from './FillDetails.module.scss';

// const generationInProgressMessage = 'document generation in progress. come back in some time :)'
// const generationErrorMessage = 'unable to generate document. something went wrong :('

class FillDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isConfigDocGenerate: true,
            formData: {},
            errors: {},
            showCancelPopUp: false,
            showResetPopup: false,
            showToggleConfigPopup: false,
            isEdited: false,
            enableSubmit: false,
            loading: true,
            status: null,
            showNotification: false,
            captureSign: false
        };
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        this.handlePropsToState()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.location !== this.props.location) {
            this.handlePropsToState()
        }

        if (!_.isEqual(prevProps.orgOnboardConfig, this.props.orgOnboardConfig)) {
            this.handlePropsToState();
        }

        if (!_.isEqual(prevProps.empData, this.props.empData)) {
            this.handlePropsToState();
        }

        if (!_.isEqual(prevProps.empDefaultRole, this.props.empDefaultRole)) {
            if ((_.isEmpty(this.state.formData['employeeRole']) || _.isEmpty(this.state.formData['employeeLocation']))) {
                this.handlePropsToState()
            }
        }

        if (!_.isEqual(prevProps.empReportingManager, this.props.empReportingManager)) {
            if (_.isEmpty(this.state.formData['employeeReportingManager'])) {
                this.handlePropsToState()
            }
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
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleShowFileUplod = () => {
        const { match } = this.props;
        const docType = match.params.docType.toUpperCase();
        let formData = {}
        let enableSubmit = false;
        let isEdited = false;

        if (!_.isEmpty(this.props.empData) && !_.isEmpty(this.props.empData.company_documents)) {
            _.forEach(this.props.empData.company_documents, function (document) {
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
            isEdited: isEdited,
            enableSubmit: enableSubmit,
            errors: {}
        })
    }

    handleShowForm = (createNewForm) => {
        const { match } = this.props;
        const docType = match.params.docType.toUpperCase();
        let formData = {}
        let status = this.state.status;
        let showNotification = false;
        let thisRef = this;
        let enableSubmit = false;
        let isEdited = false;

        if (!createNewForm && !_.isEmpty(this.props.empData) && !_.isEmpty(this.props.empData.company_documents)) {
            _.forEach(this.props.empData.company_documents, function (document) {
                if (docType === document.documentType && document.isConfigDocGenerate) {
                    formData = _.cloneDeep(document);
                    status = document.status;
                    if (status === 'inProgress' || status === 'error') showNotification = true;
                }
            })
        }

        if (_.isEmpty(formData)) {
            if (!_.isEmpty(this.props.orgOnboardConfig) && !_.isEmpty(this.props.orgOnboardConfig.documents)) {
                _.forEach(this.props.orgOnboardConfig.documents, function (document) {
                    if (docType === document.documentType && document.isApproved) {
                        _.forEach(document.variables, function (variable) {
                            formData[variable] = ''
                        })
                        formData = _.cloneDeep(thisRef.handlePreFillData(formData));
                        enableSubmit = thisRef.handleEnableSubmit(formData);
                    }
                })
            }
        }
        if (createNewForm) {
            status = null;
            isEdited = true
        }
        this.setState({
            formData: formData,
            isEdited: isEdited,
            showResetPopup: false,
            status: status,
            showNotification: showNotification,
            errors: {},
            enableSubmit: enableSubmit
        })
    }

    handlePropsToState = () => {
        const { match, empData } = this.props;
        const docType = match.params.docType.toUpperCase();
        let formData = {}
        let isConfigDocGenerate = this.state.isConfigDocGenerate;
        let status = null;
        let showNotification = false;
        let thisRef = this;
        let enableSubmit = false;

        if (!_.isEmpty(empData)) {
            let companyDocuments = _.cloneDeep(empData['company_documents']);
            if (!_.isEmpty(companyDocuments)) {
                companyDocuments.forEach((doc) => {
                    if (doc.documentType === docType) {
                        formData = doc;
                        status = doc.status
                    }
                })
            }
        }

        if (_.isEmpty(formData)) {
            if (!_.isEmpty(this.props.orgOnboardConfig) && !_.isEmpty(this.props.orgOnboardConfig.documents)) {
                _.forEach(this.props.orgOnboardConfig.documents, function (document) {
                    if (docType === document.documentType && document.isApproved) {
                        _.forEach(document.variables, function (variable) {
                            formData[variable] = ''
                        })
                        formData = _.cloneDeep(thisRef.handlePreFillData(formData));
                        enableSubmit = thisRef.handleEnableSubmit(formData);
                        isConfigDocGenerate = true;
                    }
                })
            }
        }
        if (!_.isEmpty(formData)) {
            if (!_.isEmpty(formData.employeeSignature)) delete formData.employeeSignature;
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

    }

    handlePreFillData = (formData) => {
        let updatedFormData = _.cloneDeep(formData);
        let empData = _.cloneDeep(this.props.empData);

        if (!_.isEmpty(empData)) {
            const thisRef = this;
            _.forEach(updatedFormData, function (value, field) {
                switch (field) {
                    case 'organisationName':
                        if (!_.isEmpty(thisRef.props.orgData)) {
                            updatedFormData[field] = thisRef.props.orgData['name'];
                        }
                        break;
                    case 'employeeName':
                        updatedFormData[field] = empData['firstName']
                            + (!_.isEmpty(empData['middleName']) ? (' ' + empData['middleName']) : '')
                            + (!_.isEmpty(empData['lastName']) ? (' ' + empData['lastName']) : '');
                        break;
                    case 'employeePhoneNumber':
                        if (!_.isEmpty(empData.contacts)) {
                            _.forEach(empData.contacts, function (obj) {
                                if (obj.isPrimary && obj.type === 'MOBILE') updatedFormData[field] = obj['contact']
                            })
                        }
                        break;
                    case 'employeeEmail':
                        if (!_.isEmpty(empData.contacts)) {
                            _.forEach(empData.contacts, function (obj) {
                                if (obj.isPrimary && obj.type === 'EMAIL') updatedFormData[field] = obj['contact']
                            })
                        }
                        break;
                    case 'employeeCurrentAddress':
                        if (!_.isEmpty(empData.addresses)) {
                            _.forEach(empData.addresses, function (obj) {
                                if (obj.addressType === 'CURRENT_ADDRESS') {
                                    let address = !_.isEmpty(obj.addressLine1) ? (obj.addressLine1) : '';
                                    address = !_.isEmpty(obj.addressLine2) ? (address + ', ' + obj.addressLine2) : address;
                                    address = !_.isEmpty(obj.landmark) ? (address + ', ' + obj.landmark) : address;
                                    address = !_.isEmpty(obj.city) ? (address + ', ' + obj.city) : address;
                                    address = !_.isEmpty(obj.district) ? (address + ', ' + obj.district) : address;
                                    address = !_.isEmpty(obj.state) ? (address + ', ' + obj.state) : address;
                                    address = !_.isEmpty(obj.country) ? (address + ', ' + obj.country) : address;
                                    address = !_.isEmpty(obj.pincode) ? (address + ', ' + obj.pincode) : address;
                                    updatedFormData[field] = address;
                                }

                            })
                        }
                        break;
                    case 'employeePermanentAddress':
                        if (!_.isEmpty(empData.addresses)) {
                            _.forEach(empData.addresses, function (obj) {
                                if ((empData.isCurrAndPerAddrSame && obj.addressType === 'CURRENT_ADDRESS') || obj.addressType === 'PERMANENT_ADDRESS') {
                                    let address = !_.isEmpty(obj.addressLine1) ? (obj.addressLine1) : '';
                                    address = !_.isEmpty(obj.addressLine2) ? (address + ', ' + obj.addressLine2) : address;
                                    address = !_.isEmpty(obj.landmark) ? (address + ', ' + obj.landmark) : address;
                                    address = !_.isEmpty(obj.city) ? (address + ', ' + obj.city) : address;
                                    address = !_.isEmpty(obj.district) ? (address + ', ' + obj.district) : address;
                                    address = !_.isEmpty(obj.state) ? (address + ', ' + obj.state) : address;
                                    address = !_.isEmpty(obj.country) ? (address + ', ' + obj.country) : address;
                                    address = !_.isEmpty(obj.pincode) ? (address + ', ' + obj.pincode) : address;
                                    updatedFormData[field] = address;
                                }
                            })
                        }
                        break;
                    case 'employeeOtherAddress':
                        if (!_.isEmpty(empData.addresses)) {
                            _.forEach(empData.addresses, function (obj) {
                                if (obj.addressType === 'CUSTOM_ADDRESS') {
                                    let address = !_.isEmpty(obj.addressLine1) ? (obj.addressLine1) : '';
                                    address = !_.isEmpty(obj.addressLine2) ? (address + ', ' + obj.addressLine2) : address;
                                    address = !_.isEmpty(obj.landmark) ? (address + ', ' + obj.landmark) : address;
                                    address = !_.isEmpty(obj.city) ? (address + ', ' + obj.city) : address;
                                    address = !_.isEmpty(obj.district) ? (address + ', ' + obj.district) : address;
                                    address = !_.isEmpty(obj.state) ? (address + ', ' + obj.state) : address;
                                    address = !_.isEmpty(obj.country) ? (address + ', ' + obj.country) : address;
                                    address = !_.isEmpty(obj.pincode) ? (address + ', ' + obj.pincode) : address;
                                    updatedFormData[field] = address;
                                }

                            })
                        }
                        break;
                    case 'employeeFatherName':
                        if (!_.isEmpty(empData.familyRefs)) {
                            _.forEach(empData.familyRefs, function (obj) {
                                if (obj.relationship === 'FATHER') updatedFormData[field] = obj['name']
                            })
                        }
                        break;
                    case 'employeeMotherName':
                        if (!_.isEmpty(empData.familyRefs)) {
                            _.forEach(empData.familyRefs, function (obj) {
                                if (obj.relationship === 'MOTHER') updatedFormData[field] = obj['name']
                            })
                        }
                        break;
                    case 'employeeSpouseName':
                        if (!_.isEmpty(empData.familyRefs)) {
                            _.forEach(empData.familyRefs, function (obj) {
                                if (obj.relationship === 'SPOUSE') updatedFormData[field] = obj['name']
                            })
                        }
                        break;
                    case 'employeeType':
                        if (!_.isEmpty(empData.employeeType)) {
                            updatedFormData[field] = empData.employeeType.split('_').join(' ').toLowerCase();
                        }
                        break;
                    case 'employeeId':
                        if (!_.isEmpty(empData.employeeId)) {
                            updatedFormData[field] = empData.employeeId;
                        }
                        break;
                    case 'employeeDateOfJoining':
                        if (!_.isEmpty(empData.joiningDate)) {
                            updatedFormData[field] = empData.joiningDate;
                        }
                        break;
                    case 'employeeRole':
                        if (!_.isEmpty(thisRef.props.empDefaultRole)) {
                            updatedFormData[field] = thisRef.props.empDefaultRole.name;
                        }
                        break;
                    case 'employeeLocation':
                        if (!_.isEmpty(thisRef.props.empDefaultLocation)) {
                            updatedFormData[field] = thisRef.props.empDefaultLocation.name;
                        }
                        break;
                    case 'employeeReportingManager':
                        if (!_.isEmpty(thisRef.props.empReportingManager)) {
                            updatedFormData[field] = thisRef.props.empReportingManager['firstName']
                                + (!_.isEmpty(thisRef.props.empReportingManager['middleName']) ? (' ' + thisRef.props.empReportingManager['middleName']) : '')
                                + (!_.isEmpty(thisRef.props.empReportingManager['lastName']) ? (' ' + thisRef.props.empReportingManager['lastName']) : '');
                        }
                        break;
                    case 'dateOfIssue':
                        let d = new Date(), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
                        if (month.length < 2) month = '0' + month;
                        if (day.length < 2) day = '0' + day;
                        updatedFormData[field] = [year, month, day].join('-');
                        break;

                    default:
                        break;
                }
            })
        }
        return (updatedFormData)
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

    handleTags = (tag, action, category) => {
        let updatedFormData = _.cloneDeep(this.state.formData);

        if (action === 'add') {
            if (category === 'geographical') {
                updatedFormData['employeeLocation'] = tag.name;
            }
            else {
                updatedFormData['employeeRole'] = tag.name;
            }
        }
        if (action === 'delete') {
            if (category === 'geographical') {
                updatedFormData['employeeLocation'] = null;
            }
            else {
                updatedFormData['employeeRole'] = null;
            }
        }
        let enableSubmit = this.handleEnableSubmit(updatedFormData);
        this.setState({
            formData: updatedFormData,
            isEdited: true,
            enableSubmit: enableSubmit
        });
    }

    handleEmployee = (employee, action) => {
        let updatedFormData = _.cloneDeep(this.state.formData);
        if (action === 'add') {
            const name = employee['firstName']
                + (!_.isEmpty(employee['middleName']) ? (' ' + employee['middleName']) : '')
                + (!_.isEmpty(employee['lastName']) ? (' ' + employee['lastName']) : '');

            updatedFormData['employeeReportingManager'] = name;
        }
        if (action === 'delete') {
            updatedFormData['employeeReportingManager'] = null;
        }
        let enableSubmit = this.handleEnableSubmit(updatedFormData);
        this.setState({
            formData: updatedFormData,
            isEdited: true,
            enableSubmit: enableSubmit
        });
    }

    handleEnableSubmit = (formData) => {
        let enableSubmit = true;
        _.forEach(formData, function (value, key) {
            if (_.isEmpty(value) && value !== true && key !== 'employeeSignature') {
                enableSubmit = false
            }
        })
        return enableSubmit;
    }

    handleShowCancelPopUp = () => {
        this.setState({
            showCancelPopUp: !this.state.showCancelPopUp
        });
    }

    handleShowResetPopup = () => {
        this.setState({
            showResetPopup: !this.state.showResetPopup
        })
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
        const docType = match.params.docType.toUpperCase();

        let payload = _.cloneDeep(this.state.formData);
        // delete payload.empSignature
        // payload['isConfigDocGenerate'] = this.state.isConfigDocGenerate;
        payload['documentType'] = docType;

        this.props.saveCompanyDoc(orgId, empId, docType, payload);
    }

    handleSkipToUpload = () => {
        this.props.changeSection("UPLOAD")
    }

    render() {
        const mandatoryFieldsFilled = this.handleEnableSubmit(this.state.formData);

        const { match } = this.props;
        const orgId = match.params.uuid;

        // const docType = match.params.docType.toUpperCase();

        // let docInitial = '';
        // if (!_.isEmpty(this.props.orgOnboardConfig) && !_.isEmpty(this.props.orgOnboardConfig.documents)) {
        //     _.forEach(this.props.orgOnboardConfig.documents, function (doc) {
        //         if (doc.documentType === docType) docInitial = doc.documentInitial;
        //     })
        // }

        const employeeRole = _.isEmpty(this.state.formData['employeeRole']) ? null : { name: this.state.formData['employeeRole'] }
        const employeeLocation = _.isEmpty(this.state.formData['employeeLocation']) ? null : { name: this.state.formData['employeeLocation'] }

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
                        <div className={cx(styles.alignCenter, scrollStyle.scrollbar)}>
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

                            <div>
                                <div style={{ backgroundColor: 'white', position: "relative" }}>
                                    <div className={cx(styles.formHeader, "row mx-0")}>
                                        <div className={cx(styles.timeHeading, "col-8 mx-0 px-0")} style={{ maxWidth: "fit-content" }}>
                                            {
                                                this.props.putDataState === "SUCCESS" && this.state.showNotification ?
                                                    <Notification
                                                        type="success"
                                                        message="document saved successfully"
                                                    />
                                                    : this.state.showNotification && (this.props.putDataState === "ERROR") ?
                                                        <Notification
                                                            type="warning"
                                                            message={this.props.error}
                                                        />
                                                        :
                                                        !mandatoryFieldsFilled ?
                                                            <Notification
                                                                type="basic"
                                                                message="please fill all the fields to enable save"
                                                            />
                                                            :
                                                            null
                                            }
                                        </div>
                                        <div className="ml-auto d-flex my-auto" style={{ position: "relative" }}>

                                            <React.Fragment>
                                                <div onClick={() => this.props.changeSection("UPLOAD")}>
                                                    <img src={skip} alt="skip" className={cx(styles.pointer, "pr-2")} />
                                                    <label className={cx(styles.blueText, styles.pointer)} style={{ marginTop: '12px' }}>skip and upload</label>
                                                </div>
                                                <CancelButton
                                                    className={styles.cancelButton}
                                                    isDisabled={!this.state.isEdited}
                                                    clickHandler={this.handleShowCancelPopUp}
                                                />
                                                {
                                                    this.props.putDataState === 'LOADING' ?
                                                        <Spinnerload type='loading' />
                                                        :
                                                        <Button
                                                            label={'save'}
                                                            type='save'
                                                            isDisabled={!this.state.enableSubmit || !_.isEmpty(this.state.errors) || this.state.status === 'inProgress'}
                                                            clickHandler={this.handleDocumentGenerate}
                                                        />
                                                }
                                            </React.Fragment>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.CardLayout}>
                                <form>
                                    <div className={this.state.status === "inProgress" ? styles.disable : null}>
                                        <div className="row no-gutters">
                                            {
                                                this.state.formData.hasOwnProperty('employeeName')
                                                    ?
                                                    <Input
                                                        name='employeeName'
                                                        className='col-4 pr-3'
                                                        label={'name'}
                                                        type='text'
                                                        placeholder={'enter name'}
                                                        value={this.state.formData['employeeName']}
                                                        errors={this.state.errors['employeeName']}
                                                        onChange={(value) => this.handleInputChange(value, 'employeeName')}
                                                        onError={(error) => this.handleError(error, 'employeeName')}
                                                        validation={validation['employeeName']}
                                                        message={message['employeeName']}
                                                        disabled={this.state.status === 'inProgress'}
                                                    />
                                                    :
                                                    null
                                            }
                                            {
                                                this.state.formData.hasOwnProperty('employeePhoneNumber')
                                                    ?
                                                    <Input
                                                        name='employeePhoneNumber'
                                                        className='col-4 pr-3'
                                                        label={'phone number'}
                                                        type='text'
                                                        placeholder={'enter phone number'}
                                                        value={this.state.formData['employeePhoneNumber']}
                                                        errors={this.state.errors['employeePhoneNumber']}
                                                        onChange={(value) => this.handleInputChange(value, 'employeePhoneNumber')}
                                                        onError={(error) => this.handleError(error, 'employeePhoneNumber')}
                                                        validation={validation['employeePhoneNumber']}
                                                        message={message['employeePhoneNumber']}
                                                        disabled={this.state.status === 'inProgress'}
                                                    />
                                                    :
                                                    null
                                            }
                                            {
                                                this.state.formData.hasOwnProperty('employeeEmail')
                                                    ?
                                                    <Input
                                                        name='employeeEmail'
                                                        className='col-4 pr-3'
                                                        label={'email id'}
                                                        type='text'
                                                        placeholder={'enter email id'}
                                                        value={this.state.formData['employeeEmail']}
                                                        errors={this.state.errors['employeeEmail']}
                                                        onChange={(value) => this.handleInputChange(value, 'employeeEmail')}
                                                        onError={(error) => this.handleError(error, 'employeeEmail')}
                                                        validation={validation['employeeEmail']}
                                                        message={message['employeeEmail']}
                                                        disabled={this.state.status === 'inProgress'}
                                                    />
                                                    :
                                                    null
                                            }
                                            {
                                                this.state.formData.hasOwnProperty('employeeCurrentAddress')
                                                    ?
                                                    <Input
                                                        name='employeeCurrentAddress'
                                                        className='col-6 pr-3'
                                                        label={'current address'}
                                                        type='text'
                                                        placeholder={'enter current address'}
                                                        value={this.state.formData['employeeCurrentAddress']}
                                                        errors={this.state.errors['employeeCurrentAddress']}
                                                        onChange={(value) => this.handleInputChange(value, 'employeeCurrentAddress')}
                                                        onError={(error) => this.handleError(error, 'employeeCurrentAddress')}
                                                        validation={validation['employeeCurrentAddress']}
                                                        message={message['employeeCurrentAddress']}
                                                        disabled={this.state.status === 'inProgress'}
                                                    />
                                                    :
                                                    null
                                            }
                                            {
                                                this.state.formData.hasOwnProperty('employeePermanentAddress')
                                                    ?
                                                    <Input
                                                        name='employeePermanentAddress'
                                                        className='col-6 pr-3'
                                                        label={'permanent address'}
                                                        type='text'
                                                        placeholder={'enter permanent address'}
                                                        value={this.state.formData['employeePermanentAddress']}
                                                        errors={this.state.errors['employeePermanentAddress']}
                                                        onChange={(value) => this.handleInputChange(value, 'employeePermanentAddress')}
                                                        onError={(error) => this.handleError(error, 'employeePermanentAddress')}
                                                        validation={validation['employeePermanentAddress']}
                                                        message={message['employeePermanentAddress']}
                                                        disabled={this.state.status === 'inProgress'}
                                                    />
                                                    :
                                                    null
                                            }
                                            {
                                                this.state.formData.hasOwnProperty('employeeOtherAddress')
                                                    ?
                                                    <Input
                                                        name='employeeOtherAddress'
                                                        className='col-6 pr-3'
                                                        label={'other address'}
                                                        type='text'
                                                        placeholder={'enter other address'}
                                                        value={this.state.formData['employeeOtherAddress']}
                                                        errors={this.state.errors['employeeOtherAddress']}
                                                        onChange={(value) => this.handleInputChange(value, 'employeeOtherAddress')}
                                                        onError={(error) => this.handleError(error, 'employeeOtherAddress')}
                                                        validation={validation['employeeOtherAddress']}
                                                        message={message['employeeOtherAddress']}
                                                        disabled={this.state.status === 'inProgress'}
                                                    />
                                                    :
                                                    null
                                            }
                                        </div>
                                        <div className="row no-gutters">
                                            {
                                                this.state.formData.hasOwnProperty('employeeFatherName')
                                                    ?
                                                    <Input
                                                        name='employeeFatherName'
                                                        className='col-4 pr-3'
                                                        label={'father\'s name'}
                                                        type='text'
                                                        placeholder={'enter father\'s name'}
                                                        value={this.state.formData['employeeFatherName']}
                                                        errors={this.state.errors['employeeFatherName']}
                                                        onChange={(value) => this.handleInputChange(value, 'employeeFatherName')}
                                                        onError={(error) => this.handleError(error, 'employeeFatherName')}
                                                        validation={validation['employeeFatherName']}
                                                        message={message['employeeFatherName']}
                                                        disabled={this.state.status === 'inProgress'}
                                                    />
                                                    :
                                                    null
                                            }
                                            {
                                                this.state.formData.hasOwnProperty('employeeMotherName')
                                                    ?
                                                    <Input
                                                        name='employeeMotherName'
                                                        className='col-4 pr-3'
                                                        label={'mother\'s name'}
                                                        type='text'
                                                        placeholder={'enter mother\'s name'}
                                                        value={this.state.formData['employeeMotherName']}
                                                        errors={this.state.errors['employeeMotherName']}
                                                        onChange={(value) => this.handleInputChange(value, 'employeeMotherName')}
                                                        onError={(error) => this.handleError(error, 'employeeMotherName')}
                                                        validation={validation['employeeMotherName']}
                                                        message={message['employeeMotherName']}
                                                        disabled={this.state.status === 'inProgress'}
                                                    />
                                                    :
                                                    null
                                            }
                                            {
                                                this.state.formData.hasOwnProperty('employeeSpouseName')
                                                    ?
                                                    <Input
                                                        name='employeeSpouseName'
                                                        className='col-4 pr-3'
                                                        label={'spouse\'s name'}
                                                        type='text'
                                                        placeholder={'enter spouse\'s name'}
                                                        value={this.state.formData['employeeSpouseName']}
                                                        errors={this.state.errors['employeeSpouseName']}
                                                        onChange={(value) => this.handleInputChange(value, 'employeeSpouseName')}
                                                        onError={(error) => this.handleError(error, 'employeeSpouseName')}
                                                        validation={validation['employeeSpouseName']}
                                                        message={message['employeeSpouseName']}
                                                        disabled={this.state.status === 'inProgress'}
                                                    />
                                                    :
                                                    null
                                            }
                                        </div>
                                        <div className="row no-gutters">
                                            {
                                                this.state.formData.hasOwnProperty('employeeType')
                                                    ?
                                                    <CustomSelect
                                                        name="employeeType"
                                                        className="mt-3 col-4 pr-3"
                                                        label={'employee type'}
                                                        options={this.props.EMP_MGMT_COMPANY_DOC_GENERATE_EMP_TYPE}
                                                        value={this.state.formData['employeeType']}
                                                        onChange={value => this.handleInputChange(value, 'employeeType')}
                                                        disabled={this.state.status === 'inProgress'}
                                                    />
                                                    :
                                                    null
                                            }
                                            {
                                                this.state.formData.hasOwnProperty('employeeId')
                                                    ?
                                                    <Input
                                                        name='employeeId'
                                                        className='col-4 pr-3'
                                                        label={'employee id'}
                                                        type='text'
                                                        placeholder={'enter employee id'}
                                                        value={this.state.formData['employeeId']}
                                                        errors={this.state.errors['employeeId']}
                                                        onChange={(value) => this.handleInputChange(value, 'employeeId')}
                                                        onError={(error) => this.handleError(error, 'employeeId')}
                                                        validation={validation['employeeId']}
                                                        message={message['employeeId']}
                                                        disabled={this.state.status === 'inProgress'}
                                                    />
                                                    :
                                                    null
                                            }
                                            {
                                                this.state.formData.hasOwnProperty('employeeDateOfJoining')
                                                    ?
                                                    <Datepicker
                                                        name='employeeDateOfJoining'
                                                        className='col-4 pr-3'
                                                        label={'date of joining'}
                                                        type='text'
                                                        value={this.state.formData['employeeDateOfJoining']}
                                                        errors={this.state.errors['employeeDateOfJoining']}
                                                        onChange={(value) => this.handleInputChange(value, 'employeeDateOfJoining')}
                                                        onError={(error) => this.handleError(error, 'employeeDateOfJoining')}
                                                        validation={validation['employeeDateOfJoining']}
                                                        message={message['employeeDateOfJoining']}
                                                        disabled={this.state.status === 'inProgress'}
                                                    />
                                                    :
                                                    null
                                            }
                                        </div>
                                        <div className="row no-gutters">
                                            {
                                                this.state.formData.hasOwnProperty('employeeRole')
                                                    ?
                                                    <div className=' pr-4 mt-2 mb-4' >
                                                        <label className={styles.defaultLabel}>{'employee role'}
                                                        </label>
                                                        <SingleTagSearchField
                                                            placeholder="search role"
                                                            name="employeeRole"
                                                            orgId={orgId}
                                                            category='functional'
                                                            tags={employeeRole}
                                                            updateTag={(value, action) => this.handleTags(value, action, "functional")}
                                                            searchBar={styles.searchBar}
                                                            type="role"
                                                            position
                                                            dropdownMenu={styles.dropdownMenu}
                                                            disabled={this.state.status === 'inProgress'}
                                                        />
                                                    </div>
                                                    :
                                                    null
                                            }
                                            {
                                                this.state.formData.hasOwnProperty('employeeLocation')
                                                    ?
                                                    <div className=' pr-4 mt-2 mb-4' >
                                                        <label className={styles.defaultLabel}>{'employee location'}
                                                        </label>
                                                        <SingleTagSearchField
                                                            placeholder="search location"
                                                            name="employeeLocation"
                                                            orgId={orgId}
                                                            category='geographical'
                                                            tags={employeeLocation}
                                                            updateTag={(value, action) => this.handleTags(value, action, "geographical")}
                                                            searchBar={styles.searchBar}
                                                            position
                                                            dropdownMenu={styles.dropdownMenu}
                                                            disabled={this.state.status === 'inProgress'}
                                                        />
                                                    </div>
                                                    :
                                                    null
                                            }
                                            {
                                                this.state.formData.hasOwnProperty('employeeReportingManager')
                                                    ?
                                                    <div className=' pr-4 mt-2 mb-4' >
                                                        <label className={styles.defaultLabel}>{'reporting manager'}
                                                        </label>
                                                        <EmpSearch
                                                            placeholder="search employee"
                                                            name="employeeReportingManager"
                                                            orgId={orgId}
                                                            value={this.state.formData['employeeReportingManager']}
                                                            onUpdateSelection={(value, action) => this.handleEmployee(value, action)}
                                                            searchBar={styles.searchBar}
                                                            position
                                                            dropdownMenu={styles.dropdownMenu}
                                                            disabled={this.state.status === 'inProgress'}
                                                        />
                                                    </div>
                                                    :
                                                    null
                                            }
                                        </div>
                                        <div className="row no-gutters">
                                            {
                                                this.state.formData.hasOwnProperty('organisationName')
                                                    ?

                                                    <Input
                                                        name='organisationName'
                                                        className='col-4 pr-3'
                                                        label={'organisation name'}
                                                        type='text'
                                                        placeholder={'enter name'}
                                                        value={this.state.formData['organisationName']}
                                                        errors={this.state.errors['organisationName']}
                                                        onChange={(value) => this.handleInputChange(value, 'organisationName')}
                                                        onError={(error) => this.handleError(error, 'organisationName')}
                                                        validation={validation['organisationName']}
                                                        message={message['organisationName']}
                                                        disabled={this.state.status === 'inProgress'}
                                                    />
                                                    :
                                                    null
                                            }
                                            {
                                                this.state.formData.hasOwnProperty('dateOfIssue')
                                                    ?
                                                    <Datepicker
                                                        name='dateOfIssue'
                                                        className='col-4 pr-3'
                                                        label={'date of issue'}
                                                        type='text'
                                                        value={this.state.formData['dateOfIssue']}
                                                        errors={this.state.errors['dateOfIssue']}
                                                        onChange={(value) => this.handleInputChange(value, 'dateOfIssue')}
                                                        onError={(error) => this.handleError(error, 'dateOfIssue')}
                                                        validation={validation['dateOfIssue']}
                                                        message={message['dateOfIssue']}
                                                        disabled={this.state.status === 'inProgress'}
                                                    />
                                                    :
                                                    null
                                            }
                                        </div>

                                    </div>
                                </form>

                            </div>
                        </div>
                }
            </React.Fragment>
        )
    }

}


const mapStateToProps = state => {
    return {
        EMP_MGMT_COMPANY_DOC_GENERATE_EMP_TYPE: state.empMgmt.staticData.empMgmtStaticData["EMP_MGMT_COMPANY_DOC_GENERATE_EMP_TYPE"],
        orgData: state.empMgmt.staticData.orgData,
        orgOnboardConfig: state.empMgmt.staticData.orgOnboardConfig,
        empData: state.empMgmt.empOnboard.onboard.empData,
        empDefaultRole: state.empMgmt.empOnboard.onboard.empDefaultRole,
        empDefaultLocation: state.empMgmt.empOnboard.onboard.empDefaultLocation,
        empReportingManager: state.empMgmt.empOnboard.onboard.empReportingManager,
        getDataState: state.empMgmt.empOnboard.onboard.getEmpDataState,
        putDataState: state.empMgmt.empOnboard.onboard.empDocSaveState,
        error: state.empMgmt.empOnboard.onboard.error,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        saveCompanyDoc: (orgId, empId, docType, data) => dispatch(actions.saveDocument(orgId, empId, 'COMPANY', docType, data)),
        documentDownload: (url) => dispatch(actions.documentDownload(url)),

    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FillDetails));