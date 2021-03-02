import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import cx from 'classnames';

import styles from './EmpBasicRegistration.module.scss';

import * as actions from './Store/action';
import * as EmpAddNewModalActions from '../../EmpAddNewModal/Store/action';
import * as onboardActions from '../Store/action';
import * as fieldData from './EmpBasicRegistrationInitData';
import FormConfig from './EmpBasicRegistrationFormConfigData';
import { validation, message } from './EmpBasicRegistrationValidation';
import themes from '../../../../../theme.scss';

// Components
import ProfilePicture from '../../../../../components/Molecule/ProfilePicture/ProfilePicture';
import RadioButtonGroup from '../../../../../components/Organism/RadioButtonGroup/RadioButtonGroup';
import { Button, Input, Datepicker } from 'react-crux';
import CardHeader from '../../../../../components/Atom/PageTitle/PageTitle';
import ArrowLink from '../../../../../components/Atom/ArrowLink/ArrowLink';
import Loader from '../../../../../components/Organism/Loader/Loader';
import Spinnerload from '../../../../../components/Atom/Spinner/Spinner';
import { withTranslation } from 'react-i18next';
import CancelButton from '../../../../../components/Molecule/CancelButton/CancelButton';
import WarningPopUp from '../../../../../components/Molecule/WarningPopUp/WarningPopUp';
import Prompt from '../../../../../components/Organism/Prompt/Prompt';
import scrollStyle from '../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import Upload from '../../../../../components/Molecule/UploadDoc/UploadDoc';
import FileView from '../../../../../components/Molecule/FileView/FileView';
import CheckBox from '../../../../../components/Atom/CheckBox/CheckBox';
import Notification from '../../../../../components/Molecule/Notification/Notification';

// SVGs
import warn from '../../../../../assets/icons/warning.svg';
import editEmp from '../../../../../assets/icons/editEmp.svg';
import upload from '../../../../../assets/icons/uploadEmpConsent.svg';
import downloadConsent from '../../../../../assets/icons/downloadIcon.svg';
import basic_details from '../../../../../assets/icons/empDetailsIcon.svg';

class EmpBasicRegistration extends Component {

    state = {
        formData: {
            ...fieldData.InitData
        },
        empId: null,
        enableSubmit: false,
        editMode: true,
        submitSuccess: false,
        profileIcon: true,
        showCancelPopUp: false,
        isEdited: false,
        noEdit: true,
        showDeletePopUp: false,
        showSaveButton: false,
        orgId: null,
        warningMsg: 'either name, gender or dob is missing for global db',
        isWarningReuired: false,
        consentUrl: [],
        showNotification: false,
        profilePicSource: null,
        editBack: false,
        errors: {}
    }
    _isMounted = false;

    constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }

    componentDidMount() {
        this._isMounted = true;
        this.setState({ _isMounted: true });
        const { match } = this.props;
        const orgId = match.params.uuid;


        if (this.props.match.path === '/customer-mgmt/org/:uuid/employee/onboard/:empId/basic-details') {
            const empId = match.params.empId;
            if (_.isEmpty(this.props.data)) {
                this.props.onGetData(orgId, empId);
            } else {
                this.handlePropsToState();
                this.setState({ profilePicSource: this.props.profilePicFromOnboard })
            }
        } else {
            if (_.isEmpty(this.props.idCardType)) {
                this.props.history.push('/customer-mgmt/org/' + orgId + '/employee?isActive=true');
            }
        }

        if (!_.isEmpty(this.props.entityData)) {
            this.handlePreFill(this.props.entityData);
            // this.setState({enableSubmit: false})
        }


    }

    componentDidUpdate(prevProps, prevState) {


        if (this.state.formData !== prevState.formData && this.state.isEdited) {
            // this.handleCheckError(true)
            // this.setState({ enableSubmit: this.handleEnableSubmit(this.state.formData)});
        }

        // if (!_.isEqual(this.state.errors, prevState.errors)) {
        //     let enableSubmit = true;
        //     if (!_.isEmpty(this.state.errors)) {
        //         enableSubmit = false;
        //     } else {
        //         console.log("c1");
        //         enableSubmit = this.handleEnableSubmit(this.state.formData);
        //     }

        //     this.setState({ enableSubmit: enableSubmit })
        // }

        // profile pic
        if (this.props.profilePicUrl !== prevProps.profilePicUrl) {
            let updatedFormData = {
                ...this.state.formData,
            }
            updatedFormData['profilePicUrl'] = this.props.profilePicUrl;
            const enableSubmit = this.handleEnableSubmit(updatedFormData);
            this.setState({ formData: updatedFormData, enableSubmit: enableSubmit });
        }
        if (prevProps.getProfilePicState !== this.props.getProfilePicState) {
            if (this.props.getProfilePicState === 'SUCCESS') {
                if (this.props.profilePicUrl) {
                    this.props.onGetProfilePic(this.props.profilePicUrl)
                }

            }
        }



        //consent
        if (this.props.consentUrl !== prevProps.consentUrl && this.props.getConsentState !== prevProps.getConsentState && this.props.getConsentState === "SUCCESS") {
            let updatedFormData = {
                ...this.state.formData,
            }
            let consentUrls = [];

            if (!_.isEmpty(this.state.consentUrl)) {
                consentUrls = this.state.consentUrl;
            }

            consentUrls.push(this.props.consentUrl)
            const enableSubmit = this.handleEnableSubmit(updatedFormData);

            this.setState({ enableSubmit: enableSubmit, consentUrl: consentUrls });
        }

        //url change
        if (prevProps.postDataState !== this.props.postDataState) {
            if (this.props.postDataState === 'SUCCESS') {
                this.props.empAddNewModalReset();
                const { match } = this.props;

                const orgId = match.params.uuid;
                const empId = this.props.newEmpId;



                let redirectPath = '/customer-mgmt/org/' + orgId + '/employee/onboard/' + empId + '/basic-details';
                this.props.history.push(redirectPath);
                this.setState({ viewMode: true, enableSubmit: false, isEdited: false });
            }
        }
        if (prevProps.getDataState !== this.props.getDataState && this.props.getDataState === "SUCCESS") {
            this.handlePropsToState();
            if (!this.props.data.isActive) {
                this.setState({ editMode: false })
            }
        }

        if (this.props.downloadProfilePicFromOnboardState !== prevProps.downloadProfilePicFromOnboardState && this.props.downloadProfilePicFromOnboardState === "SUCCESS") {
            this.setState({ profilePicSource: this.props.profilePicFromOnboard })
        }

        if (this.props.downloadProfilePicFromBasicState !== prevProps.downloadProfilePicFromBasicState && this.props.downloadProfilePicFromBasicState === "SUCCESS") {
            this.setState({ profilePicSource: this.props.profilePicFromBasic, isEdited: true })
        }


        ////Show Notification for Success/Error for post call
        if (this.props.postDataState !== prevProps.postDataState && (this.props.postDataState === "SUCCESS" || this.props.postDataState === "ERROR")) {
            this.setState({ showNotification: true });
            setTimeout(() => {
                if (this._isMounted && this.props.postDataState === "SUCCESS") {
                    this.setState({ showNotification: false });
                }
            }, 5000);
        }

        ////Show Notification for Success/Error for PUT call
        if (this.props.putDataState !== prevProps.putDataState && (this.props.putDataState === "SUCCESS" || this.props.putDataState === "ERROR")) {
            this.setState({ showNotification: true });
            setTimeout(() => {
                if (this._isMounted && this.props.putDataState === "SUCCESS") {
                    this.setState({ showNotification: false });
                }
            }, 5000);
        }

        if (prevProps.putDataState !== this.props.putDataState && this.props.putDataState === "SUCCESS") {
            this.setState({ viewMode: true, isEdited: false, enableSubmit: false })
        }

        if (this.state.editBack !== prevState.editBack && this.state.editBack) {
            let orgId = this.props.match.params.uuid;
            let redirectPath = '/customer-mgmt/org/' + orgId + '/employee?isActive=true';
            this.props.history.push(redirectPath);

            if (this.props.showModal) {
                this.props.initState();
            }
        }

    }

    componentWillUnmount() {
        this._isMounted = false;
        this.props.initState();

    }

    handlePropsToState = () => {
        let updatedFormData = {};
        let editMode = null;

        const { match } = this.props;
        const empId = match.params.empId || this.props.data.uuid;

        let consentUrls = [];

        if (empId || this.props.data.uuid) {
            updatedFormData = _.cloneDeep(this.props.data)

            let onboardingEntity = {};
            onboardingEntity.isConsentAccepted = updatedFormData.isConsentAccepted ? updatedFormData.isConsentAccepted : false;
            onboardingEntity.consentUrl = [];
            if (!_.isEmpty(updatedFormData.documents)) {
                _.forEach(updatedFormData.documents, function (doc) {
                    if (doc.type === "CONSENT") {
                        onboardingEntity.consentUrl = doc.downloadURL;
                        consentUrls = doc.downloadURL;
                    }
                })
            }
            updatedFormData['onboardingEntity'] = onboardingEntity;
            editMode = true;
        }
        else {
            updatedFormData = {
                ...fieldData.InitData
            }
            editMode = true;
        }

        this.setState({
            empId: empId,
            formData: updatedFormData,
            showCancelPopUp: false,
            editMode: editMode,
            profileIcon: true,
            isEdited: false,
            enableSubmit: false,
            consentUrl: consentUrls
        })
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

    handlePreFill = (data) => {
        let empData = _.cloneDeep(data);

        let empInitData = { ...fieldData.InitData };

        _.forEach(empInitData, function (value, key) {
            if (!_.isEmpty(empData[key])) { empInitData[key] = empData[key] }
        })

        this.setState({ formData: empInitData });
    }

    handleEnableSubmit = (formData) => {
        let enableSubmit = true;
        let fieldExist = true;
        const requiredFields = fieldData.RequiredFields;
        _.forEach(formData, function (value, key) {
            if (requiredFields.includes(key)) {
                if (value === '' || value === null) {
                    fieldExist = false;
                }
            }
            enableSubmit = fieldExist && enableSubmit;
        })

        if (enableSubmit) {
            enableSubmit = enableSubmit && formData['onboardingEntity']['isConsentAccepted'] && _.isEmpty(this.state.errors);
        }

        return (enableSubmit);
    }

    handleEditBack = () => {

        this.setState({ editBack: true })
    }

    handleEditBackFalse = () => {
        this.setState({ editBack: false })
    }

    handleConsentDownload = () => {
        this.props.onDownloadConsent();
    }


    getAndUploadImage = (section, files) => {
        let formData = new FormData();
        let folder;
        if (section === 'profilePic') {
            formData.append('file', files);
            folder = 'employee_profile_pictures';
            this.props.profilePicUpload(folder, formData);
        }
        else if (section === 'onboardingConsent') {
            folder = 'employee_documents';
            formData.append('file', files[0]);
            this.props.consentUpload(folder, formData);
        }
    }

    consentCheckboxChange = () => {
        let updatedFormData = { ...this.state.formData };
        updatedFormData.onboardingEntity['isConsentAccepted'] = !updatedFormData.onboardingEntity['isConsentAccepted'];

        let enableSubmit = this.handleEnableSubmit(updatedFormData);
        this.setState({ formData: updatedFormData, enableSubmit: enableSubmit, noEdit: false, isEdited: true })
    }

    handleFileDownload = (url) => {
        this.props.onDownloadFile('employee_documents', url);
    }

    showDeleteFileWarning = (e, url) => {
        e.stopPropagation();
        const deleteObject = {
            url: url,
        };
        this.setState({
            confirmDelete: true,
            deleteObject: deleteObject
        });
    }

    deleteFile = (e, section, deleteFileName, files) => {
        e.stopPropagation();
        let fileName;

        if (section === 'onboardingConsent') {
            let enableSubmit = this.handleEnableSubmit(this.state.formData);
            this.setState({ consentUrl: [], confirmDelete: false, deleteObject: {}, enableSubmit: enableSubmit, isEdited: true });
        }

        else {
            fileName = _.isEmpty(deleteFileName) ? '' : deleteFileName.split('/');
            fileName = fileName[fileName.length - 1];

            this.props.profilePicDelete('employee_profile_pictures', fileName)
        }
    }

    handleFormSubmit = () => {
        const { match } = this.props;
        const orgId = match.params.uuid;

        let updatedFormData = _.cloneDeep(this.state.formData);
        if (!_.isEmpty(updatedFormData['onboardingEntity'])) {
            _.forEach(updatedFormData.onboardingEntity, function (value, key) {
                updatedFormData[key] = value
            })
        }

        delete updatedFormData.onboardingEntity;
        let documentArray = [];
        if (!_.isEmpty(this.props.data)) {
            if (!_.isEmpty(this.props.data.documents)) {
                documentArray = this.props.data.documents;
            }
        }


        if (!_.isEmpty(this.props.idCardType)) {
            if (this.props.idCardType === "Mobile") {
                const contacts = [
                    {
                        type: "MOBILE",
                        contact: this.props.idNo,
                        isPrimary: true
                    }
                ];
                updatedFormData['contacts'] = contacts;

            } else {

                let document = {};
                if (this.props.idCardType === 'Voter ID') { document.type = 'VOTER' }
                else if (this.props.idCardType === 'Aadhaar Card') { document.type = 'AADHAAR' }
                else if (this.props.idCardType === 'Pan Card') { document.type = 'PAN' }
                else if (this.props.idCardType === 'DL') { document.type = 'DL' }
                document.documentNumber = this.props.idNo;
                if (updatedFormData.middleName) {
                    document.name = updatedFormData.firstName + ' ' + updatedFormData.middleName + (!_.isEmpty(updatedFormData.lastName) ? ' ' + updatedFormData.lastName : '')
                }
                else {
                    document.name = updatedFormData.firstName + (!_.isEmpty(updatedFormData.lastName) ? ' ' + updatedFormData.lastName : '');
                }
                document.dob = updatedFormData.dob;
                documentArray.push(document);
            }
        }


        let consentDoc = {};
        consentDoc.type = 'CONSENT';
        consentDoc.downloadURL = [];
        if (!_.isEmpty(this.state.consentUrl)) {
            consentDoc.downloadURL = consentDoc.downloadURL.concat(this.state.consentUrl);
        }

        let isConsentExists = false;

        _.forEach(documentArray, function (value) {
            if (value.type === "CONSENT") {
                value.downloadURL = consentDoc.downloadURL;
                isConsentExists = true;
            }
        })

        if (!isConsentExists) {
            documentArray.push(consentDoc);
        }

        if (!_.isEmpty(documentArray)) {
            updatedFormData['documents'] = documentArray;
        }

        delete updatedFormData.consentUrl;

        updatedFormData.orgId = orgId;

        if (this.props.match.path === '/customer-mgmt/org/:uuid/employee/onboard/addnew') {
            this.props.onPostData(updatedFormData, orgId);
            this.setState({ isEdited: false });
        }
        else {
            let empId = this.props.data.uuid;
            this.props.onPutData(orgId, empId, updatedFormData);
        }

    };

    handleCancel = () => {
        this.handlePropsToState();
        this.setState({ profilePicSource: this.props.profilePicFromOnboard, errors: {} })
    }

    handleCancelPopUp = () => {
        if (!this.state.isEdited) {
            this.handleCancel();
        }
        else {
            this.setState({
                showCancelPopUp: !this.state.showCancelPopUp
            });
        }
    }

    profilePicDelete = () => {
        let updatedFormData = _.cloneDeep(this.state.formData);
        updatedFormData['profilePicUrl'] = '';
        const enableSubmit = this.handleEnableSubmit(updatedFormData);


        this.setState({ formData: updatedFormData, enableSubmit: enableSubmit, profilePicSource: null, isEdited: true });
    }

    handleBack = () => {
        if (this.props.showModal) {
            this.props.empAddNewModalReset();
        }
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



    render() {
        const { t } = this.props;

        const orgId = this.props.match.params.uuid;
        const empId = this.props.match.params.empId ? this.props.match.params.empId : '';

        let mandatoryFieldsFilled = this.state.enableSubmit;
        mandatoryFieldsFilled = this.handleEnableSubmit(_.cloneDeep(this.state.formData))

        let empName = !_.isEmpty(this.props.data) ?
            !_.isEmpty(this.props.data.firstName) && !_.isEmpty(this.props.data.lastName) ? this.props.data.firstName.toLowerCase() + ' ' + this.props.data.lastName.toLowerCase()
                : !_.isEmpty(this.props.data.firstName) && _.isEmpty(this.props.data.lastName) ? this.props.data.firstName.toLowerCase()
                    : 'person' : ''

        return (
            <React.Fragment>
                <Prompt
                    when={this.state.isEdited}
                    takeActionOnCancel={this.state.editBack ? null : this.handleBack}
                    takeActionOnKeep={this.state.editBack ? this.handleEditBackFalse : null}
                />
                {this.props.getDataState === "LOADING" ?
                    <div className={cx(styles.alignCenter, scrollStyle.scrollbar, "pt-4")}>
                        <Loader type='onboardForm' />
                    </div>
                    :
                    <React.Fragment>
                        <div className={cx(styles.alignCenter, scrollStyle.scrollbar)}>

                            {empId !== '' ?
                                <ArrowLink
                                    label={empName + "'s profile"}
                                    url={`/customer-mgmt/org/` + orgId + `/employee/` + empId + `/profile`}
                                />
                                :
                                <ArrowLink
                                    label={"all employee"}
                                    url={`/customer-mgmt/org/` + orgId + `/employee?isActive=true`}
                                />
                            }
                            <CardHeader label={"employee basic details"} iconSrc={basic_details} />

                            <div className={cx(styles.CardLayout, ' card p-relative')}>
                                <div className={styles.fixedHeader}>
                                    <div className={cx(styles.formHeader, "row mx-0")} style={{ height: "3.5rem" }}>
                                        <div className={cx(styles.timeHeading, "col-8 mx-0 px-0")}>
                                            {this.props.putDataState === "SUCCESS" && this.state.showNotification ?
                                                <Notification
                                                    type="success"
                                                    message="employee updated successfully"
                                                />
                                                : this.props.putDataState === "ERROR" && this.state.showNotification ?
                                                    <Notification
                                                        type="warning"
                                                        message={this.props.error}
                                                    /> : this.props.postDataState === "SUCCESS" && this.state.showNotification ?
                                                        <Notification
                                                            type="success"
                                                            message="employee created successfully"
                                                        />
                                                        : this.props.postDataState === "ERROR" && this.state.showNotification ?
                                                            <Notification
                                                                type="warning"
                                                                message={this.props.error}
                                                            />

                                                            : !mandatoryFieldsFilled ?
                                                                <Notification
                                                                    type="basic"
                                                                    message="please fill all the mandatory fields to enable save"
                                                                />
                                                                : ""
                                            }
                                        </div>

                                        <div className="ml-auto d-flex my-auto" >
                                            <div className={cx("row no-gutters justify-content-end")}>
                                                <CancelButton isDisabled={false} clickHandler={this.handleCancelPopUp} className={styles.cancelButton}>{t('translation_empBasicRegistration:button_empBasicDetails.cancel')}</CancelButton>
                                                {this.state.showCancelPopUp ?
                                                    <WarningPopUp
                                                        text={t('translation_empBasicRegistration:warning_empBasicDetails_cancel.text')}
                                                        para={t('translation_empBasicRegistration:warning_empBasicDetails_cancel.para')}
                                                        confirmText={t('translation_empBasicRegistration:warning_empBasicDetails_cancel.confirmText')}
                                                        cancelText={t('translation_empBasicRegistration:warning_empBasicDetails_cancel.cancelText')}
                                                        icon={warn}
                                                        warningPopUp={this.handleCancel}
                                                        closePopup={this.handleCancelPopUp}
                                                    />
                                                    : null
                                                }

                                                {this.props.postDataState === 'LOADING' || this.props.putDataState === 'LOADING' ? <Spinnerload type='loading' /> :
                                                    <Button label={t('translation_empBasicRegistration:button_empBasicDetails.save')} isDisabled={!this.state.enableSubmit} clickHandler={this.handleFormSubmit} type='save' />}
                                            </div>

                                        </div>


                                    </div>
                                </div>

                                <div className={cx(styles.CardPadding, 'card-body')}>

                                    {this._isMounted ?
                                        <form>

                                            {!_.isEmpty(this.props.idCardType) ?
                                                <div>
                                                    <div className="row no-gutters">
                                                        <div className={cx(styles.Input, 'col-4 pr-3 d-flex flex-column-reverse my-1')}>
                                                            <input
                                                                className={styles.InputElement}
                                                                type='text'
                                                                disabled={true}
                                                                value={this.props.idNo}
                                                                style={this.props.fixed ? { backgroundColor: themes.primaryBackground } : {}}
                                                            />
                                                            <label className={cx(styles.LabelWithValue)}>
                                                                {this.props.idCardType.toLowerCase() + ' ' + t('translation_empAddNew:texts_empAddNew.number')}&nbsp;
                                                               <span className={styles.requiredStar}>{'*'}</span>
                                                            </label>
                                                        </div>
                                                        <img className={styles.image} src={editEmp} alt={t('translation_empAddNew:image_alt_empAddNew.editId')} onClick={() => this.handleEditBack()} />
                                                    </div>

                                                    <hr className={styles.HorizotalLine} />
                                                </div>
                                                : <div></div>}

                                            <div className="row no-gutters" >
                                                <Input
                                                    name='firstName'
                                                    className="col-4 pr-3"
                                                    label={'first name'}
                                                    type='text'
                                                    placeholder={t('translation_empBasicRegistration:input_empBasicDetails.placeholder.firstName')}
                                                    required={_.includes(fieldData.RequiredFields, 'firstName')}
                                                    disabled={!this.state.editMode}
                                                    value={this.state.formData.firstName}
                                                    onChange={(value) => this.handleInputChange(value, 'firstName')}
                                                    onError={(error) => this.handleError(error, 'firstName')}
                                                    validation={validation['firstName']}
                                                    message={message['firstName']}
                                                    errors={this.state.errors['firstName']}
                                                />
                                                <Input
                                                    name='middleName'
                                                    className="col-4 pr-3"
                                                    label={'middle name'}
                                                    type='text'
                                                    placeholder={t('translation_empBasicRegistration:input_empBasicDetails.placeholder.middleName')}
                                                    disabled={!this.state.editMode}
                                                    value={this.state.formData.middleName}
                                                    onChange={(value) => this.handleInputChange(value, 'middleName')}
                                                    onError={(error) => this.handleError(error, 'middleName')}
                                                    validation={validation['middleName']}
                                                    message={message['middleName']}
                                                    errors={this.state.errors['middleName']}
                                                />
                                                <Input
                                                    name='lastName'
                                                    className="col-4"
                                                    label={'last name'}
                                                    type='text'
                                                    placeholder={t('translation_empBasicRegistration:input_empBasicDetails.placeholder.lastName')}
                                                    required={_.includes(fieldData.RequiredFields, 'lastName')}
                                                    disabled={!this.state.editMode}
                                                    value={this.state.formData.lastName}
                                                    onChange={(value) => this.handleInputChange(value, 'lastName')}
                                                    onError={(error) => this.handleError(error, 'lastName')}
                                                    validation={validation['lastName']}
                                                    message={message['lastName']}
                                                    errors={this.state.errors['lastName']}
                                                />
                                            </div>
                                            <div className="row no-gutters">
                                                <Datepicker
                                                    name='dob'
                                                    className="col-4 pr-3"
                                                    label={'date of birth'}
                                                    required={_.includes(fieldData.RequiredFields, 'dob')}
                                                    disabled={!this.state.editMode}
                                                    value={this.state.formData.dob}
                                                    onChange={(value) => this.handleInputChange(value, 'dob')}
                                                    onError={(error) => this.handleError(error, 'dob')}
                                                    validation={validation['dob']}
                                                    message={message['dob']}
                                                    errors={this.state.errors['dob']}
                                                />
                                                <div className='col-8 mt-3'>
                                                    <RadioButtonGroup
                                                        className="col-12 pl-2"
                                                        label={'gender'}
                                                        required={_.includes(fieldData.RequiredFields, 'gender')}
                                                        selectItems={FormConfig.gender.options}
                                                        value={this.state.formData.gender}
                                                        disabled={!this.state.editMode}
                                                        onSelectOption={(value) => this.handleInputChange(value, 'gender')}
                                                    />
                                                </div>


                                            </div>
                                            <div className='row no-gutters'>
                                                {this.state.profileIcon === true ?
                                                    <div className="col-6 mt-4">

                                                        <ProfilePicture
                                                            disabled={!this.state.editMode}
                                                            file={(file) => this.getAndUploadImage("profilePic", file)}
                                                            src={this.state.profilePicSource}
                                                            state={this.props.getProfilePicState}
                                                            delete={this.profilePicDelete}
                                                        />
                                                    </div>
                                                    : ''}
                                            </div>

                                            <hr className={styles.HorizotalLine} />

                                            <div className='row ml-0 mb-1'>
                                                <CheckBox
                                                    type="medium"
                                                    className="mt-1"
                                                    name="isConsentAccepted"
                                                    value={this.state.formData.onboardingEntity.isConsentAccepted}
                                                    onChange={this.consentCheckboxChange}
                                                    disabled={!this.state.editMode}
                                                />
                                                <div className='ml-3 pl-2' onClick={this.props.downloadConsentState === 'LOADING' ? null : this.handleConsentDownload}>
                                                    <label className={styles.ConsentFont}> {t('translation_empAddNew:texts_empAddNew.Indicate')} </label>
                                                    <span style={this.props.downloadConsentState === 'LOADING' ? { cursor: 'progress' } : { cursor: 'pointer' }} >
                                                        <label className={this.props.downloadConsentState === 'LOADING' ? cx('mx-1', styles.ConsentLinkLoading) : cx('mx-1', styles.ConsentLink)}>{t('translation_empAddNew:texts_empAddNew.consentPolicy')}</label>
                                                        <img src={downloadConsent} alt={t('translation_empAddNew:image_alt_empAddNew.downloadIcon')} />
                                                        <span className={styles.requiredStar}> *</span>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className='d-flex flex-wrap'>

                                                {this.state.consentUrl && this.state.consentUrl[0] ?
                                                    <FileView
                                                        className={cx(styles.Preview)}
                                                        url={this.state.consentUrl[0]}
                                                        fileClicked={this.props.downloadFileState === 'LOADING' ? null : () => this.handleFileDownload(this.state.consentUrl[0])}
                                                        downloadFileState={this.props.downloadFileState}
                                                        clicked={(e) => this.showDeleteFileWarning(e, this.state.consentUrl[0])}
                                                        disabled={!this.state.editMode}
                                                    />
                                                    :
                                                    <div className="d-flex flex-column">
                                                        <Upload
                                                            className={styles.Cursor}
                                                            upload={upload}
                                                            single
                                                            disabled={!this.state.editMode}
                                                            fileUpload={(file) => this.getAndUploadImage("onboardingConsent", file)}
                                                            //  url={this.state.formData.onboardingEntity.consentURL}
                                                            addState={this.props.getConsentState}
                                                        />
                                                    </div>
                                                }
                                            </div>
                                        </form>
                                        : null}

                                    {this.state.consentUrl && this.state.consentUrl[0]
                                        && this.state.confirmDelete && this.state.consentUrl[0] === this.state.deleteObject.url ?
                                        <WarningPopUp
                                            text={t('translation_empEducation:warning_empEducation_delete.text')}
                                            para={t('translation_empEducation:warning_empEducation_delete.para')}
                                            confirmText={t('translation_empEducation:warning_empEducation_delete.confirmText')}
                                            cancelText={t('translation_empEducation:warning_empEducation_delete.cancelText')}
                                            icon={warn}
                                            warningPopUp={(e) => this.deleteFile(e, 'onboardingConsent', this.state.consentUrl[0], this.state.consentUrl)}
                                            closePopup={() => this.setState({ confirmDelete: false, deleteObject: {} })}
                                        />
                                        : null
                                    }
                                </div>
                            </div>
                        </div>
                    </React.Fragment>

                }

            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        idCardType: state.empMgmt.empAddNew.cardtype,
        idNo: state.empMgmt.empAddNew.idNo,
        showModal: state.empMgmt.empAddNew.showModal,
        data: state.empMgmt.empOnboard.onboard.empData,
        getDataState: state.empMgmt.empOnboard.onboard.getEmpDataState,
        postDataState: state.empMgmt.empOnboard.basicRegistration.postDataState,
        putDataState: state.empMgmt.empOnboard.onboard.putEmpDataState,
        error: state.empMgmt.empOnboard.basicRegistration.error,
        profilePicUrl: state.empMgmt.empOnboard.basicRegistration.profilePicUrl,
        getProfilePicState: state.empMgmt.empOnboard.basicRegistration.getProfilePicUrlState,
        deleteProfilePicState: state.empMgmt.empOnboard.basicRegistration.deleteProfilePicState,
        consentUrl: state.empMgmt.empOnboard.basicRegistration.consentUrl,
        getConsentState: state.empMgmt.empOnboard.basicRegistration.getConsentState,
        deleteConsentState: state.empMgmt.empOnboard.basicRegistration.deleteConsentState,
        entityData: state.empMgmt.empTermination.entityData,
        downloadConsentState: state.empMgmt.empOnboard.basicRegistration.downloadConsentState,
        downloadFileState: state.empMgmt.empOnboard.basicRegistration.downloadFileState,
        downloadProfilePicFromOnboardState: state.empMgmt.empOnboard.onboard.getEmpProfilePicState,
        profilePicFromOnboard: state.empMgmt.empOnboard.onboard.empProfilePic,
        downloadProfilePicFromBasicState: state.empMgmt.empOnboard.basicRegistration.getEmpProfilePicState,
        profilePicFromBasic: state.empMgmt.empOnboard.basicRegistration.empProfilePic,
        newEmpId: state.empMgmt.empOnboard.basicRegistration.newCreatedEmpId,

    }
};

const mapDispatchToProps = dispatch => {
    return {
        initState: () => dispatch(actions.initState()),
        onPostData: (data, orgId) => dispatch(actions.postEmpData(data, orgId)),
        onGetData: (orgId, empId) => dispatch(onboardActions.getEmpData(orgId, empId)),
        onPutData: (orgId, empId, data) => dispatch(onboardActions.putEmpData(orgId, empId, data, true, true)),
        onDownloadConsent: () => dispatch(actions.downloadConsentPolicy()),
        onDownloadFile: (folder, url) => dispatch(actions.downloadFile(folder, url)),
        onGetProfilePic: (filePath) => dispatch(actions.getEmpProfilePic(filePath)),
        profilePicUpload: (folder, imageData) => dispatch(actions.profilePicUpload(folder, imageData)),
        profilePicDelete: (folder, fileName) => dispatch(actions.profilePicDelete(folder, fileName)),
        consentUpload: (folder, data) => dispatch(actions.FileUpload(folder, data)),
        consentDelete: (folder, fileName, files) => dispatch(actions.FileDelete(folder, fileName, files)),
        empAddNewModalReset: () => dispatch(EmpAddNewModalActions.initState())
    }
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(EmpBasicRegistration));