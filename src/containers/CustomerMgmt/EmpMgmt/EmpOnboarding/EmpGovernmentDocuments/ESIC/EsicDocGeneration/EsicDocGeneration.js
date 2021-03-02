import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import styles from './EsicDocGeneration.module.scss';
import cx from 'classnames';
import _ from 'lodash';
import Notification from '../../../../../../../components/Molecule/Notification/Notification';
import Loader from '../../../../../../../components/Organism/Loader/Loader';
import { Button } from 'react-crux';
import Spinnerload from '../../../../../../../components/Atom/Spinner/Spinner';
import CancelButton from '../../../../../../../components/Molecule/CancelButton/CancelButton';
import WarningPopUp from '../../../../../../../components/Molecule/WarningPopUp/WarningPopUp';
import RadioButtonGroup from '../../../../../../../components/Organism/RadioButtonGroup/RadioButtonGroup';
import {Input, Datepicker} from 'react-crux';
import CustomSelect from '../../../../../../../components/Atom/CustomSelect/CustomSelect';
import CheckBox from '../../../../../../../components/Atom/CheckBox/CheckBox';
// import Upload from '../../../../../../../components/Molecule/UploadDoc/UploadDoc';
// import FileView from '../../../../../../../components/Molecule/FileView/FileView';
import Prompt from '../../../../../../../components/Organism/Prompt/Prompt';
import DeleteButton from '../../../../../../../components/Molecule/DeleteButton/DeleteButton';
import formConfig from './EsicDocGenerationConfig';
import { InitData, requiredFields } from './EsicDocGenerationInitData';
import { validation, message } from './EsicDocGenerationValidations';
import * as actions from '../../../Store/action'


//svgs
import warn from '../../../../../../../assets/icons/warning.svg';
import blueWarn from '../../../../../../../assets/icons/warnBlue.svg';
import info from '../../../../../../../assets/icons/info.svg';
import close from '../../../../../../../assets/icons/closeNotification.svg';
// import upload from '../../../../../../../assets/icons/uploadCardIcon.svg';
// import uploadDisability from '../../../../../../../assets/icons/uploadDisabilityDoc.svg';
import addButton from "../../../../../../../assets/icons/addMore.svg";
import esicIcon from '../../../../../../../assets/icons/esic.svg';
import download from '../../../../../../../assets/icons/downloadWhite.svg';
import infoMid from '../../../../../../../assets/icons/infoMid.svg';

const generationErrorMessage = 'there is an issue with the ESI website, please come back later to complete registration for the employee.'
class EsicDocGeneration extends Component {
    state = {
        formData: _.cloneDeep(InitData),
        isEdited: false,
        enableSubmit: false,
        finalDownloadUrl: "",
        status: "init",
        errors: {},
        currentUploadedDoc: "",
        showCancelPopUp: false,
        showGeneratePopup: false,
        confirmDelete: false,
        deleteObject: null
    }

    _isMounted = false;

    componentDidMount = () => {
        this._isMounted = true;
        if (!this.props.resetForm) {
            this.handlePropsToState();
        } else {
            let formData = this.handlePrefillData();
            this.setState({ formData: formData })
        }
    }

    componentDidUpdate = (prevProps, prevState) => {

        if (!_.isEqual(this.props.empData, prevProps.empData)) {
            this.handlePropsToState();
        }

        if (!_.isEqual(this.state.formData, prevState.formData)) {
            this.props.data(this.state.formData);
        }

        if (!_.isEqual(this.state.status, prevState.status)) {
            this.props.status(this.state.status);
        }

        if (this.state.formData.isCurrentSameAsPermanent !== prevState.formData.isCurrentSameAsPermanent && this.state.formData.isCurrentSameAsPermanent) {
            let updatedErrors = _.cloneDeep(this.state.errors);
            _.forEach(updatedErrors, function (val, key) {
                if (key.includes("_permanentAddress")) {
                    delete updatedErrors[key];
                }
            })
            this.setState({ errors: updatedErrors })
        }

        ////Show Notification for Success/Error for post call
        if (this.props.empDocGenerateState !== prevProps.empDocGenerateState && (this.props.empDocGenerateState === "SUCCESS" || this.props.empDocGenerateState === "ERROR")) {
            this.setState({ showNotification: true });
            setTimeout(() => {
                if (this._isMounted) {
                    this.setState({ showNotification: false });
                }
            }, 5000);
        }

        if (!_.isEqual(this.props.documentURL, prevProps.documentURL) && this.props.docUploadState !== prevProps.docUploadState && this.props.docUploadState === "SUCCESS") {
            let updatedFormData = _.cloneDeep(this.state.formData);
            let enableSubmit = false;
            if (this.state.currentUploadedDoc === "bankAccountFile") {
                let bankUrls = [];
                if (!_.isEmpty(updatedFormData.bankDetails.bankAccountFileURL)) {
                    bankUrls = updatedFormData.bankDetails.bankAccountFileURL;
                }
                _.forEach(this.props.documentURL, function (url) {
                    bankUrls.push(url)
                })
                updatedFormData.bankDetails.bankAccountFileURL = bankUrls;

                enableSubmit = this.handleEnableSubmit(updatedFormData);
            }
            else if (this.state.currentUploadedDoc === "disabilityFile") {
                let disabilityUrls = [];
                if (!_.isEmpty(updatedFormData.disabilityFileURL)) {
                    disabilityUrls = updatedFormData.disabilityFileURL;
                }
                _.forEach(this.props.documentURL, function (url) {
                    disabilityUrls.push(url)
                })

                updatedFormData.disabilityFileURL = disabilityUrls;
                enableSubmit = this.handleEnableSubmit(updatedFormData);
            }

            this.setState({ enableSubmit: enableSubmit, formData: updatedFormData, isEdited: true })
        }
    }

    handlePropsToState = () => {
        let empData = _.cloneDeep(this.props.empData);

        let formData = this.handlePrefillData();
        let status = "init"; let finalDownloadUrl = "";
        let isGenerated = false;

        if (!_.isEmpty(empData)) {
            let govtDocs = [];
            if (!_.isEmpty(empData['government_documents'])) {
                govtDocs = empData['government_documents']
            }

            if (!_.isEmpty(govtDocs)) {
                _.forEach(govtDocs, function (value, index) {
                    if (value.documentType === "ESIC") {
                        formData = value;
                        status = value.status;
                        isGenerated = value.isConfigDocGenerate

                        if (!_.isEmpty(value.downloadURL)) {
                            finalDownloadUrl = value.downloadURL;
                        }

                    }
                })
            }

            // ///prefill
            if (!isGenerated) {
                formData = this.handlePrefillData();
            }
        }
        this.setState({
            formData: formData, status: status, showCancelPopUp: false,
            errors: {}, finalDownloadUrl: finalDownloadUrl,
            isEdited: false, enableSubmit: false
        })
    }

    handlePrefillData = () => {
        let updatedFormData = _.cloneDeep(InitData);
        let empData = _.cloneDeep(this.props.empData);

        if (!_.isEmpty(empData)) {


            ////main fields
            let empName = !_.isEmpty(empData.middleName) ? empData.firstName + " " + empData.middleName + " " + empData.lastName : empData.firstName + " " + empData.lastName;
            updatedFormData.name = empName.toLowerCase();

            updatedFormData.dob = empData.dob;

            updatedFormData.gender = !_.isEmpty(empData.gender) ? empData.gender : null;

            let employeePhoneNumber = null;
            if (!_.isEmpty(empData.contacts)) {
                _.forEach(empData.contacts, function (contact) {
                    if (contact.type === "MOBILE" && contact.isPrimary) {
                        employeePhoneNumber = contact.contact;
                        if (!_.isEmpty(employeePhoneNumber)) {
                            if (!_.isEmpty(validation['mobileNumber'])) {
                                _.forEach(validation['mobileNumber'], function (validationFunction, rule) {
                                    if (!validationFunction(contact.contact)) {
                                        employeePhoneNumber = null
                                    }
                                })
                            }
                        }
                    }
                })
            }

            if (!_.isEmpty(employeePhoneNumber)) {
                updatedFormData.employeePhoneNumber = employeePhoneNumber;
            }





            let maritalStatus = '';
            if (empData.maritalStatus === 'SINGLE') maritalStatus = "1"
            else if (empData.maritalStatus === 'MARRIED') maritalStatus = "2"
            else maritalStatus = null;

            updatedFormData.maritalStatus = maritalStatus;


            let joiningDate = empData.joiningDate;
            if (!_.isEmpty(joiningDate)) {
                if (!_.isEmpty(validation['joiningDate'])) {
                    _.forEach(validation['joiningDate'], function (validationFunction, rule) {
                        if (!validationFunction(empData.joiningDate)) {
                            joiningDate = null
                        }
                    })
                }
            }

            if (!_.isEmpty(joiningDate)) {
                updatedFormData.joiningDate = joiningDate
            }


            if (!_.isEmpty(empData.fatherName)) {
                updatedFormData.fatherOrHusbandName = empData.fatherName;
                updatedFormData.relation = "FATHER";
            }

            ////address
            let empAddresses = _.cloneDeep(empData.addresses)
            let isCurrentSameAsPermanent = empData.isCurrAndPerAddrSame;
            let updatedFormAddress = updatedFormData.addresses;

            _.forEach(updatedFormAddress, function (address, index) {
                if (address.addressType === "CURRENT_ADDRESS") {
                    let empCurrentAddress = {};
                    _.forEach(empAddresses, function (addr, indx) {
                        if (addr.addressType === "CURRENT_ADDRESS") {
                            empCurrentAddress = addr;
                        }
                    })

                    _.forEach(empCurrentAddress, function (value, field) {
                        if (address.hasOwnProperty(field)) {
                            if (!_.isEmpty(value)) {
                                updatedFormAddress[index][field] = value;
                            }
                        }
                    })



                    ////Adddress line 2, 3 pending
                }

                else if (address.addressType === "PERMANENT_ADDRESS" && !isCurrentSameAsPermanent) {
                    let empCurrentAddress = {};
                    _.forEach(empAddresses, function (addr, indx) {
                        if (addr.addressType === "PERMANENT_ADDRESS") {
                            empCurrentAddress = addr;
                        }
                    })

                    _.forEach(empCurrentAddress, function (value, field) {
                        if (address.hasOwnProperty(field)) {
                            if (!_.isEmpty(value)) {
                                updatedFormAddress[index][field] = value;
                            }
                        }
                    })

                    ////Adddress line 2, 3 pending

                }
            })

            updatedFormData.addresses = updatedFormAddress;
            updatedFormData.isCurrentSameAsPermanent = isCurrentSameAsPermanent;

            ///family
            if (!_.isEmpty(empData.familyRefs)) {
                let familyInitData = updatedFormData.familyMembers[0];
                let updatedFamilyMembers = [];
                _.forEach(empData.familyRefs, function (val, key) {
                    let familyObj = {};
                    if (!_.isEmpty(val.name)) familyObj.name = val.name;
                    if (!_.isEmpty(val.dob)) familyObj.dob = val.dob;

                    let initData = familyInitData;

                    _.forEach(initData, function (value, field) {
                        if (!familyObj.hasOwnProperty(field)) {
                            familyObj[field] = value;
                        }
                    })
                    updatedFamilyMembers.push(familyObj);
                })
                updatedFormData.familyMembers = updatedFamilyMembers;
            }

            ///bank
            if (!_.isEmpty(empData.bankDetails) && !_.isEmpty(empData.bankDetails[0])) {
                let formBankDetails = updatedFormData.bankDetails;
                _.forEach(empData.bankDetails[0], function (val, key) {
                    if (formBankDetails.hasOwnProperty(key)) {
                        if (!_.isEmpty(val)) { formBankDetails[key] = val; }
                    }
                })

                updatedFormData.bankDetails = formBankDetails;
            }
        }

        return updatedFormData;

    }

    handleCheckBox = (field, section, targetIndex) => {
        let updatedFormData = _.cloneDeep(this.state.formData);
        if (_.isEmpty(section) && _.isEmpty(targetIndex)) {
            updatedFormData[field] = !updatedFormData[field];
        } else {
            let sectionData = updatedFormData[section];
            _.forEach(sectionData, function (data, index) {
                if (index === targetIndex) {
                    sectionData[index][field] = !sectionData[index][field]
                }
            })
            updatedFormData[section] = sectionData;
        }
        let enableSubmit = this.handleEnableSubmit(updatedFormData);
        this.setState({ formData: updatedFormData, isEdited: true, enableSubmit: enableSubmit })
    }

    handleInputChange = (value, inputField, section, targetIndex) => {
        let updatedFormData = _.cloneDeep(this.state.formData);
        if (targetIndex !== null) {
            let sectionData = updatedFormData[section];
            _.forEach(sectionData, function (data, index) {
                if (index === targetIndex) {
                    sectionData[index][inputField] = value;
                    if (inputField === "state") {
                        if (sectionData[index].hasOwnProperty('district')) {
                            sectionData[index]['district'] = null
                        }
                    }
                    if (inputField === "relationship" && section === 'familyMembers') {
                        if (sectionData[index].hasOwnProperty('gender')) {
                            sectionData[index]['gender'] = null
                        }

                        if (sectionData[index].hasOwnProperty('incomeShouldNotExceed')) {
                            sectionData[index]['incomeShouldNotExceed'] = false
                        }
                    }
                }
            })
            updatedFormData[section] = sectionData;
        }
        else if (!_.isEmpty(section)) {
            let sectionData = updatedFormData[section];
            sectionData[inputField] = value;
            if (inputField === "state") {
                if (sectionData.hasOwnProperty('district')) {
                    sectionData['district'] = null
                }
            }
            updatedFormData[section] = sectionData
        }
        else {
            updatedFormData[inputField] = value;
            if (inputField === "employeePhoneNumber" && value.length === 10) {
                updatedFormData['addresses'][0]['mobileNumber'] = value;
            }
        }

        let enableSubmit = this.handleEnableSubmit(updatedFormData);

        this.setState({ formData: updatedFormData, isEdited: true, enableSubmit: enableSubmit })
    }

    handleAddNewFamilyData = () => {
        let initData = _.cloneDeep(InitData);
        let newData = initData.familyMembers[0];

        let formData = _.cloneDeep(this.state.formData);
        let updatedFamily = formData.familyMembers;

        updatedFamily = [
            newData,
            ...updatedFamily.slice(0)
        ]
        formData.familyMembers = updatedFamily;

        let errors = _.cloneDeep(this.state.errors);
        let updatedErrors = {}
        _.forEach(errors, function (err, key) {
            if (key.includes("familyMembers_")) {
                let errIndx = parseInt(key.split('_').pop()) + 1;
                let errKey = key.split('_');
                errKey = errKey[0] + '_' + errKey[1] + '_' + errIndx;
                updatedErrors[errKey] = err;
            } else {
                updatedErrors[key] = err;
            }
        });

        let enableSubmit = this.handleEnableSubmit(formData)

        this.setState({ formData: formData, isEdited: true, errors: updatedErrors, enableSubmit: enableSubmit })
    }

    handleDeteleFamilyData = (e, targetIndex) => {
        let formData = _.cloneDeep(this.state.formData);
        let updatedFamily = formData.familyMembers;

        updatedFamily = updatedFamily.filter((data, index) => {
            if (index === targetIndex) return null;
            else return data
        })
        e.preventDefault();
        ///updatedError
        let updatedErrors = _.cloneDeep(this.state.errors);
        _.forEach(updatedErrors, function (err, key) {
            if (key.includes("familyMembers_" + targetIndex)) {
                delete updatedErrors[key];
            }
        });

        let newUpdatedErrors = {}

        _.forEach(updatedErrors, function (err, key) {
            if (key.includes("familyMembers_")) {
                let errIndx = parseInt(key.split('_').pop());
                if (errIndx !== 0) { errIndx = errIndx - 1; }
                let errKey = key.split('_');
                errKey = errKey[0] + '_' + errKey[1] + '_' + errIndx;
                //  delete updatedErrors[key];
                newUpdatedErrors[errKey] = err;
            } else {
                newUpdatedErrors[key] = err;
            }
        })

        formData.familyMembers = updatedFamily;

        let enableSubmit = this.handleEnableSubmit(formData)

        this.setState({
            formData: formData,
            isEdited: true,
            errors: newUpdatedErrors,
            enableSubmit: enableSubmit
        })
    }

    isRequiredField = (inputField, section) => {
        let formRequiredFields = _.cloneDeep(requiredFields);
        let required = false;
        if (_.isEmpty(section)) {
            if (formRequiredFields.root.includes(inputField)) {
                required = true
            }
        } else {
            let sectionFields = formRequiredFields[section];
            if (sectionFields.includes(inputField)) {
                required = true
            }
        }
        return required;
    }

    handleSubmit = () => {
        let formData = _.cloneDeep(this.state.formData);

        if (formData.isCurrentSameAsPermanent) {
            let addressData = [];
            _.forEach(formData.addresses, function (value, key) {
                if (value.addressType === "CURRENT_ADDRESS") {
                    addressData.push(value)
                }
            })

            formData.addresses = addressData;
        }

        let orgId = this.props.match.params.uuid;
        let empId = this.props.match.params.empId;

        this.props.generateDoc(orgId, empId, "GOVERNMENT", "ESIC", formData);

        this.handleToggleGeneratePopup();
    }

    handleError = (error, inputField, section) => {
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

    handleEnableSubmit = (formData) => {
        let formRequiredFields = _.cloneDeep(requiredFields);
        let enableSubmit = true;
        ///////////Root->Addresses->DispensaryIp->DispensaryFamily->Nominee->Family->BankDetails
        // //// root level
        _.forEach(formRequiredFields.root, function (value, index) {
            if (value === "disabilityType") {
                if (formData.isIpDisabled) {
                    if (_.isEmpty(formData[value])) {
                        enableSubmit = false;
                    }
                }
            } else {
                if (_.isEmpty(formData[value])) {
                    enableSubmit = false;
                }
            }
        })

        // console.log("\nenableSubmit root level: ", enableSubmit);
        ////////Address
        if (enableSubmit) {
            _.forEach(formData.addresses, function (address) {
                if (address.addressType === "CURRENT_ADDRESS" || (!formData.isCurrentSameAsPermanent && address.addressType === "PERMANENT_ADDRESS")) {
                    _.forEach(formRequiredFields.addresses, function (value, index) {
                        if (_.isEmpty(address[value])) {
                            enableSubmit = false;
                        }
                    })

                    if ((!_.isEmpty(address['phoneNumberStdCode']) && _.isEmpty(address['phoneNumber'])) || (_.isEmpty(address['phoneNumberStdCode']) && !_.isEmpty(address['phoneNumber']))) {
                        enableSubmit = false
                    }
                }
            })
        }
        // console.log("enableSubmit address level: ", enableSubmit);
        // ////DispensaryIp 
        if (enableSubmit) {
            _.forEach(formRequiredFields.medicalInstIp, function (value, index) {
                if (_.isEmpty(formData.medicalInstIp[value])) {
                    enableSubmit = false;
                }
            })
        }
        // console.log("enableSubmit dispensary ip level: ", enableSubmit);
        // ////DispensaryFamily 
        if (enableSubmit) {
            _.forEach(formRequiredFields.medicalInstFamily, function (value, index) {
                if (_.isEmpty(formData.medicalInstFamily[value])) {
                    enableSubmit = false;
                }
            })
        }
        // console.log("enableSubmit dispensary family level: ", enableSubmit);
        // // ////Nominee
        if (enableSubmit) {
            _.forEach(formRequiredFields.nominee, function (value, index) {
                if (value !== "isFamilyMember") {
                    if (_.isEmpty(formData.nominee[value])) {
                        // console.log("key: ", value);
                        enableSubmit = false;

                    }
                }
            })

            if ((!_.isEmpty(formData.nominee['phoneNumberStdCode']) && _.isEmpty(formData.nominee['phoneNumber'])) || (_.isEmpty(formData.nominee['phoneNumberStdCode']) && !_.isEmpty(formData.nominee['phoneNumber']))) {
                enableSubmit = false
            }
        }
        // console.log("enableSubmit nominee level: ", enableSubmit);
        // /////Family
        if (enableSubmit) {
            _.forEach(formData.familyMembers, function (family) {
                let familyData = family;
                _.forEach(requiredFields.familyMembers, function (val) {
                    if (val !== "isResidingWithEmployee") {
                        if (val === 'state' || val === "district") {
                            if (!familyData.isResidingWithEmployee) {
                                if (_.isEmpty(familyData[val])) {
                                    enableSubmit = false;
                                }
                            }
                        }
                        else if (val === "gender") {
                            let genderNotRequiredList = ['1', '99']   //value of spouse and others
                            if (!_.isEmpty(familyData['relationship']) && genderNotRequiredList.includes(familyData['relationship'])) {
                                // no change
                            } else {
                                if (_.isEmpty(familyData[val])) {
                                    enableSubmit = false
                                }
                            }
                        }
                        else if (val === "incomeShouldNotExceed") {
                            let dependentParents = ["7", "8"]
                            if (!_.isEmpty(familyData['relationship']) && dependentParents.includes(familyData['relationship'])) {
                                if (!familyData['incomeShouldNotExceed']) enableSubmit = false
                            }

                        }
                        else if (_.isEmpty(familyData[val])) {
                            enableSubmit = false;
                        }
                    }
                })
            })
        }
        // console.log("enableSubmit family level: ", enableSubmit);
        // // ////BankDetails
        if (enableSubmit) {
            _.forEach(formRequiredFields.bankDetails, function (value, index) {
                if (_.isEmpty(formData.bankDetails[value])) {
                    enableSubmit = false;
                }
            })
        }
        // console.log("enableSubmit bank level: ", enableSubmit);

        return enableSubmit;
    }

    handleGeneratedFileDownload = () => {
        let url = this.state.finalDownloadUrl;
        this.props.fileDownload(url);
    }

    getAndUploadImage = (section, files) => {
        let formData = new FormData();
        let folder = "employee_government_documents";
        for (let i = 0; i < files.length; i++) {
            formData.append('file', files[i]);
        }
        let currentUploadedDoc = section;
        this.setState({ currentUploadedDoc: currentUploadedDoc })
        this.props.fileUpload(folder, formData)
    }

    handleFileDownload = (url) => {
        this.props.fileDownload(url);
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

    deleteFile = (e, type, deleteFileName, files) => {
        e.stopPropagation();
        let fileName;
        let enableSubmit = false;
        let updatedFormData = _.cloneDeep(this.state.formData);

        fileName = _.isEmpty(this.state.deleteObject) ? '' : this.state.deleteObject.url.split('/');
        fileName = fileName[fileName.length - 1];

        let filteredFiles = files.filter((f, i) => {
            let fName = f.split('/');
            fName = fName[fName.length - 1];
            if (fName === fileName) return null;
            else return f;
        })

        if (type === "disabilityFile") {
            updatedFormData.disabilityFileURL = filteredFiles;
            enableSubmit = this.handleEnableSubmit(updatedFormData);
        }
        else if (type === "bankAccountFile") {
            updatedFormData.bankDetails.bankAccountFileURL = filteredFiles;
            enableSubmit = this.handleEnableSubmit(updatedFormData);
        }

        this.setState({ formData: updatedFormData, enableSubmit: enableSubmit })
    }

    handleCancel = () => {
        this.handlePropsToState();
    }

    handleToggleGeneratePopup = () => {
        this.setState({
            showGeneratePopup: !this.state.showGeneratePopup
        });
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


    basicDistrictFilter(state) {
        let obj = {}
        if (!_.isEmpty(state)) {
            obj.state = [state]
        }
        return obj;
    }

    dispImpListStaticSelector = (type) => {
        if (type === 'DISPENSARY') return this.props.EMP_MGMT_ESIC_DISPENSARY_LIST
        else if (type === "IMP") return this.props.EMP_MGMT_ESIC_IMP_LIST
        else return this.props.EMP_MGMT_ESIC_MEUD_LIST
    }

    dispImpListFilter(state, district) {
        let obj = {}
        if (!_.isEmpty(state) && !_.isEmpty(district)) {
            obj.state = [state]
            obj.district = [district]
        }
        return obj;
    }

    disableDispFamily = () => {
        let updatedFormData = _.cloneDeep(this.state.formData);
        let dispIP = updatedFormData.medicalInstIp
        let dispIPFamily = updatedFormData.medicalInstFamily

        if (dispIP.type === dispIPFamily.type && (dispIP.type === "IMP" || dispIP.type === "MEUD")) {
            return true
        }
        else {
            return false
        }
    }

    handleInputDispImpSection = (value, inputField, section) => {
        let updatedFormData = _.cloneDeep(this.state.formData);
        let sectionData = updatedFormData[section];
        sectionData[inputField] = value;
        if (inputField === "state") {
            if (sectionData.hasOwnProperty('district')) {
                sectionData['district'] = null
            }

            if (sectionData.hasOwnProperty('area')) {
                sectionData['area'] = null
            }

            if (sectionData.hasOwnProperty('address')) {
                sectionData['address'] = ''
            }
        }
        else if (inputField === "district") {
            if (sectionData.hasOwnProperty('area')) {
                sectionData['area'] = null
            }

            if (sectionData.hasOwnProperty('address')) {
                sectionData['address'] = ''
            }
        }
        else if (inputField === "type") {


            if (sectionData.hasOwnProperty('area')) {
                sectionData['area'] = null
            }

            if (sectionData.hasOwnProperty('address')) {
                sectionData['address'] = ''
            }

            ////compare type functionality
            if (section === "medicalInstIp") {
                let dispIPtype = sectionData['type']
                let dispIPFamily = updatedFormData['medicalInstFamily']
                let familyReset = false
                if (dispIPtype === "DISPENSARY") {
                    if (dispIPFamily.type === "IMP" || dispIPFamily.type === "MEUD") {
                        dispIPFamily.type = "DISPENSARY";
                        familyReset = true
                    }
                } else if (dispIPtype === "IMP") {
                    if (dispIPFamily.type === "MEUD") {
                        dispIPFamily.type = "DISPENSARY";
                        familyReset = true
                    }
                } else if (dispIPtype === "MEUD") {
                    if (dispIPFamily.type === "IMP") {
                        dispIPFamily.type = "DISPENSARY";
                        familyReset = true
                    }
                }

                if (familyReset) {
                    dispIPFamily.state = null; dispIPFamily.district = null; dispIPFamily.area = null; dispIPFamily.address = ""
                    updatedFormData.medicalInstFamily = dispIPFamily
                }
            } else {
                let dispIPtype = updatedFormData['medicalInstIp']['type']
                let dispIpFamilyType = sectionData['type']
                let familyReset = false

                if (dispIpFamilyType === "IMP") {
                    if (dispIPtype === "DISPENSARY" || dispIPtype === "MEUD") {
                        sectionData.type = "DISPENSARY"
                        familyReset = true
                    }
                }
                else if (dispIpFamilyType === "MEUD") {
                    if (dispIPtype === "DISPENSARY" || dispIPtype === "IMP") {
                        sectionData.type = "DISPENSARY"
                        familyReset = true
                    }
                }

                if (familyReset) {
                    sectionData.state = null; sectionData.district = null; sectionData.area = null; sectionData.address = ""
                }
            }
        }
        else if (inputField === "area") {
            let areaStaticData = this.dispImpListStaticSelector(sectionData['type'])
            _.forEach(areaStaticData, function (list) {
                if (list.state === sectionData['state'] && list.district === sectionData['district'] && list.value === value) {
                    sectionData['address'] = list.address;
                    return false
                }
            })
        }
        updatedFormData[section] = sectionData

        let dispIP = updatedFormData.medicalInstIp
        let dispIPFamily = updatedFormData.medicalInstFamily
        if (dispIP.type === dispIPFamily.type && (dispIP.type === "IMP" || dispIP.type === "MEUD")) {
            _.forEach(dispIPFamily, function (value, key) {
                if (key !== "type") {
                    dispIPFamily[key] = dispIP[key]
                }
            })
            updatedFormData.medicalInstFamily = dispIPFamily;
        }

        let enableSubmit = this.handleEnableSubmit(updatedFormData);

        this.setState({ formData: updatedFormData, isEdited: true, enableSubmit: enableSubmit })
    }

    familyGenderStaticSelector = (val) => {
        let maleOptions = ["2", "4", "5", "7", "39", "41"]
        if (maleOptions.includes(val)) return this.props.EMP_MGMT_ESIC_FAMILY_GENDER_MALE_OPTIONS
        else return this.props.EMP_MGMT_ESIC_FAMILY_GENDER_FEMALE_OPTIONS
    }


    render() {
        let { formData } = this.state;
        return (
            <React.Fragment>
                <Prompt
                    when={this.state.isEdited}
                />

                <div className={cx(styles.alignCenter)}>
                    <div className={cx(styles.CardLayout, ' card p-relative')}>
                        <div className={styles.fixedHeader}>
                            <div className={cx(styles.formHeader, "row mx-0")} style={{ height: "3.5rem" }}>
                                <div className={styles.timeHeading}>
                                    {/* ///////////////////// NOTIFICCATION COMPONENT ////////////////// */}
                                    {this.props.empDocGenerateState === "SUCCESS" && this.state.showNotification ?
                                        <Notification
                                            type="success"
                                            message="employee updated successfully"
                                        />
                                        : this.props.empDocGenerateState === "ERROR" && this.state.showNotification ?
                                            <Notification
                                                type="warning"
                                                message={this.props.error}
                                            />
                                            : this.state.status === "inProgress" ?
                                                <Notification
                                                    type="inprogress"
                                                    message={"ESI document generation is in progress. come back in some time "}
                                                />
                                                :
                                                this.state.status === 'error' ?
                                                    <Notification
                                                        type="warning"
                                                        message={_.isEmpty(this.state.formData.comment) ? generationErrorMessage : this.state.formData.comment}
                                                    /> :
                                                    this.state.status === "done" ?
                                                        <Notification
                                                            type="done"
                                                            message={"ESIC document has been successfully generated"}
                                                        />
                                                        :
                                                        null}
                                </div>
                                {this.state.status === "init" ?
                                    <div className="ml-auto d-flex" >
                                        <div className={cx("row no-gutters justify-content-end")}>
                                            <CancelButton isDisabled={false} clickHandler={this.handleCancelPopUp} className={styles.cancelButton}>{'cancel'}</CancelButton>
                                            {this.state.showCancelPopUp ?
                                                <WarningPopUp
                                                    text={'cancel?'}
                                                    para={'WARNING: it can not be undone'}
                                                    confirmText={'yes, cancel'}
                                                    cancelText={'keep'}
                                                    icon={warn}
                                                    warningPopUp={this.handleCancel}
                                                    closePopup={this.handleCancelPopUp}
                                                />
                                                : null
                                            }

                                            {this.props.empDocGenerateState === "LOADING" ? <Spinnerload type='loading' /> :
                                                <Button label={"save and preview"} isDisabled={!(this.state.enableSubmit && _.isEmpty(this.state.errors))} clickHandler={this.handleToggleGeneratePopup} type='save' />}
                                            {
                                                this.state.showGeneratePopup ?
                                                    <WarningPopUp
                                                        text='are you sure you want to start the ESIC generation process?'
                                                        para="Warning: please check all the details. once the generation is started, you can't stop the process, and can't edit the details after generation."
                                                        confirmText={'yes generate'}
                                                        cancelText={'cancel'}
                                                        icon={blueWarn}
                                                        warningPopUp={() => this.handleSubmit()}
                                                        closePopup={() => this.handleToggleGeneratePopup()}
                                                        isAlert
                                                    />
                                                    :
                                                    null
                                            }
                                        </div>


                                    </div>
                                    : null}

                            </div>
                        </div>


                        <div className={this.state.status === 'done' ? cx(styles.CardPaddingDone, 'card-body') : cx(styles.CardPaddingForm, 'card-body')} style={this.state.status === 'inProgress' ? { opacity: "0.5" } : { opacity: "1" }}>
                            {this.state.status === "done" ?

                                //////////DESIGN FOR GENERATION COMPLETE START ///////////////
                                <div className="d-flex flex-column">
                                    <img src={esicIcon} alt="esic icon" style={{ paddingTop: "2.5rem", paddingBottom: "1.5rem" }} />
                                    <label className={styles.redHeading}>ESIC document successfully generated</label>
                                    <label className={styles.text} style={{ paddingTop: "0.5rem" }}>document generated and downloaded successfully. You can <br />download more copies from below</label>

                                    {/* //////DOWNLOAD BUTTON /////////// */}
                                    <div style={{ marginTop: "1.5rem" }}>
                                        <div onClick={this.handleGeneratedFileDownload} className={cx(styles.downloadButtonContainer, styles.pointer, "position-relative d-flex flex-row mx-auto")}>
                                            {this.props.docDownloadState === "LOADING" ?
                                                <div style={{ position: "absolute", left: "16px", top: "8px", width: "16px" }}><Loader type='stepLoaderWhite' /></div>
                                                :
                                                <img src={download} alt="icon" style={{ height: "16px", width: "16px", marginLeft: "6px", marginTop: "4px" }} />}
                                            <label className={cx(styles.text, styles.pointer)} style={this.props.docDownloadState === "LOADING" ? { paddingLeft: "30px", paddingTop: "4px", paddingRight: "4px", color: "#FFFFFF" } : { paddingLeft: "8px", paddingTop: "4px", paddingRight: "4px", color: "#FFFFFF" }}>download ESIC document</label>
                                        </div>
                                    </div>

                                    <hr className={styles.HorizotalLine} style={{ marginTop: "2.5rem", width: "100%" }} />

                                    <div className="d-flex flex-row position-relative">
                                        <img src={infoMid} alt="info" />
                                        <label className={cx(styles.infoText, "px-3")} style={{ fontSize: "14px", lineHeight: "18px" }}>if there is need of change in any details in document. you can get details corrected online and add document using upload option above</label>

                                    </div>
                                </div>
                                //////////DESIGN FOR GENERATION COMPLETE END /////////////////
                                :

                                //////////DESIGN FORM GENERATION FORM START /////////////////
                                <form>
                                    <div className="d-flex flex-column position-relative">
                                        <label className={styles.Heading} style={{ paddingTop: "10px" }}>data fields for ESIC</label>
                                        <label className={styles.SubHeading} style={{ paddingTop: "2rem" }}>personal details</label>

                                        {/* <div className={cx(styles.generationInfoContainer)}>
                                        <label className={cx(styles.generationInfoText)}> 10 days left for generation</label>
                                    </div> */}
                                    </div>
                                    <div className="row no-gutters" >
                                        <Input
                                            name='name'
                                            className="col-4 pr-3"
                                            label={'name'}
                                            type='text'
                                            placeholder={'name'}
                                            value={formData.name}
                                            onChange={(value) => this.handleInputChange(value, 'name', null, null)}
                                            required={this.isRequiredField('name', null)}
                                            disabled={this.state.status === "inProgress" ? true : false}

                                            onError={(error) => this.handleError(error, 'name')}
                                            validation={validation['maxLength']}
                                            message={message['maxLength']}
                                            errors={this.state.errors['name']}
                                        />
                                        <Datepicker
                                            name='dob'
                                            className="col-4 pr-3"
                                            label={'date of birth'}
                                            type='text'
                                            placeholder={"DD-MM-YYYY"}
                                            value={formData.dob}
                                            onChange={(value) => this.handleInputChange(value, 'dob', null, null)}
                                            required={this.isRequiredField('dob', null)}
                                            disabled={this.state.status === "inProgress" ? true : false}

                                            onError={(error) => this.handleError(error, 'dob')}
                                            validation={validation['dob']}
                                            message={message['dob']}
                                            errors={this.state.errors['dob']}
                                        />
                                        <CustomSelect
                                            name='gender'
                                            className="my-1 col-4 py-2"
                                            required={this.isRequiredField('gender', null)}
                                            label={'gender'}
                                            disabled={this.state.status === "inProgress" ? true : false}
                                            options={this.props.EMP_GENDER}
                                            value={formData.gender}
                                            onChange={(value) => this.handleInputChange(value, 'gender', null, null)}
                                        />
                                    </div>

                                    <div className="row no-gutters" >
                                        <CustomSelect
                                            name='maritalStatus'
                                            className="col-4 pr-3 pt-3"
                                            required={this.isRequiredField('maritalStatus', null)}
                                            label={'marital status'}
                                            disabled={this.state.status === "inProgress" ? true : false}
                                            options={this.props.EMP_MARITAL_STATUS}
                                            value={formData.maritalStatus}
                                            onChange={(value) => this.handleInputChange(value, 'maritalStatus', null, null)}
                                        />
                                        <Input
                                            name='employeePhoneNumber'
                                            className="col-4 pr-3"
                                            label={'mobile number'}
                                            type='text'
                                            placeholder={'mobile number'}
                                            value={formData.employeePhoneNumber}
                                            onChange={(value) => this.handleInputChange(value, 'employeePhoneNumber', null, null)}
                                            required={this.isRequiredField('employeePhoneNumber', null)}
                                            disabled={this.state.status === "inProgress" ? true : false}
                                            onError={(error) => this.handleError(error, 'employeePhoneNumber')}
                                            validation={validation['mobileNumber']}
                                            message={message['mobileNumber']}
                                            errors={this.state.errors['employeePhoneNumber']}
                                        />
                                    </div>

                                    <div className="row no-gutters" >
                                        <div className='col-6 mt-3'>
                                            <RadioButtonGroup
                                                className="col-12 pl-2 pr-0"
                                                label={'relation'}
                                                required={this.isRequiredField('relation', null)}
                                                selectItems={formConfig.relation.options}
                                                value={formData.relation}
                                                onSelectOption={(value) => this.handleInputChange(value, 'relation', null, null)}
                                                disabled={this.state.status === "inProgress" ? true : false}
                                            />
                                        </div>
                                        <Input
                                            name='fatherOrHusbandName'
                                            className="col-4 pr-3"
                                            label={'father/husband name'}
                                            type='text'
                                            required={this.isRequiredField('fatherOrHusbandName', null)}
                                            placeholder={'father/husband name'}
                                            value={formData.fatherOrHusbandName}
                                            onChange={(value) => this.handleInputChange(value, 'fatherOrHusbandName', null, null)}
                                            disabled={this.state.status === "inProgress" ? true : false}

                                            onError={(error) => this.handleError(error, 'fatherOrHusbandName')}
                                            validation={validation['maxLength']}
                                            message={message['maxLength']}
                                            errors={this.state.errors['fatherOrHusbandName']}
                                        />
                                    </div>

                                    <div className="row no-gutters" >
                                        <Datepicker
                                            name='joiningDate'
                                            className="col-4 pr-3"
                                            label={'date of appointment'}
                                            type='text'
                                            required={this.isRequiredField('joiningDate', null)}
                                            placeholder={'date of joining'}
                                            value={formData.joiningDate}
                                            onChange={(value) => this.handleInputChange(value, 'joiningDate', null, null)}
                                            onError={(error) => this.handleError(error, 'joiningDate')}
                                            validation={validation['joiningDate']}
                                            message={message['joiningDate']}
                                            errors={this.state.errors['joiningDate']}
                                            disabled={this.state.status === "inProgress" ? true : false}
                                        />
                                    </div>
                                    <hr className={styles.HorizotalLine} />

                                    {/* //////////////// ESIC SECTION ////////////////// */}
                                    <label className={styles.SubHeading}>ESIC Details</label>

                                    <div className={cx(styles.infoContainer, 'd-flex flex-row position-relative')} style={{ marginTop: "1rem", marginBottom: "0.6rem" }}>
                                        <img src={info} alt="info" className="position-absolute" style={{ top: "7px" }} />
                                        <label className={styles.infoText}>if the employee has an ESI number and we do not mention it here. All the benefits for the earlier ESI number would lapse.</label>
                                        <img src={close} className={styles.infoCloseIcon} alt="close" />
                                    </div>

                                    <div className="row no-gutters" >
                                        <Input
                                            name='esiNumber'
                                            className="col-4 pr-3"
                                            label={'ESI number'}
                                            type='text'
                                            placeholder={'"ESI number"'}
                                            value={formData.esiNumber}
                                            onChange={(value) => this.handleInputChange(value, 'esiNumber', null, null)}
                                            disabled={this.state.status === "inProgress" ? true : false}
                                        />
                                    </div>

                                    <div className='row no-gutters d-inline-block ml-0'>
                                        <CheckBox
                                            type="medium"
                                            // className="mt-1"
                                            name="isIpDisabled"
                                            value={formData.isIpDisabled}
                                            onChange={() => this.handleCheckBox("isIpDisabled", null, null)}
                                            disabled={this.state.status === "inProgress" ? true : false}
                                            checkMarkStyle={styles.checkMarkStyle}

                                        />

                                        <div className='ml-3 pl-2'>
                                            <label className={styles.checkBoxText}>{"is IP disabled?"}</label>
                                        </div>

                                    </div>

                                    {formData.isIpDisabled ?

                                        <div className="row no-gutters" >
                                            <CustomSelect
                                                name='disabilityType'
                                                className="col-4 pr-3 pt-3"
                                                required={this.isRequiredField('disabilityType', null)}
                                                label={'disability type'}
                                                disabled={this.state.status === "inProgress" ? true : false}
                                                options={this.props.EMP_DISABILITY_TYPE}
                                                value={formData.disabilityType}
                                                onChange={(value) => this.handleInputChange(value, 'disabilityType', null, null)}

                                            />
                                        </div> : null}

                                    {/* <div className='d-flex flex-wrap pt-4'>
                                    <div className="d-flex flex-column">
                                        <Upload
                                            className={styles.Cursor}
                                            upload={uploadDisability}
                                            id={"disabilityDoc"}
                                            disabled={this.state.status === "inProgress" ? true : false}
                                            fileUpload={(file) => this.getAndUploadImage("disabilityFile", file)}
                                            addState={this.props.docUploadState}

                                        />
                                    </div>
                                    {!_.isEmpty(this.state.formData.disabilityFileURL) && this.state.formData.disabilityFileURL.map((file, index) => {
                                        return (
                                            <FileView
                                                className={cx(styles.Preview, 'ml-2')}
                                                url={file}
                                                fileClicked={this.props.downloadFileState === 'LOADING' || this.state.status === "inProgress" ? null : () => this.handleFileDownload(file)}
                                                downloadFileState={this.props.downloadFileState}
                                                clicked={(e) => this.showDeleteFileWarning(e, file)}
                                                disabled={this.state.status === "inProgress" ? true : false}
                                                key={index}
                                            />
                                        )
                                    })
                                    }

                                    {!_.isEmpty(this.state.formData.disabilityFileURL) && this.state.formData.disabilityFileURL.map((file, index) => {
                                        if (this.state.confirmDelete && file === this.state.deleteObject.url)
                                            return <WarningPopUp
                                                text={"delete ?"}
                                                para={"WARNING: it can not be undone"}
                                                confirmText={"yes, delete"}
                                                cancelText={"keep"}
                                                icon={warn}
                                                warningPopUp={(e) => this.deleteFile(e, 'disabilityFile', file, this.state.formData.disabilityFileURL)}
                                                closePopup={() => this.setState({ confirmDelete: false, deleteObject: {} })}
                                                key={index}
                                            />
                                        else return null
                                    })}

                                </div> */}

                                    <hr className={styles.HorizotalLine} />
                                    {/* ////////////// ADDRESS SECTION ////////////// */}

                                    <label className={styles.Heading} style={{ paddingTop: "10px" }}>address details</label>

                                    {/* ////////// Current Address //////////// */}

                                    <div className="d-flex flex-column">
                                        <label className={styles.SubHeading} style={{ paddingTop: "2rem" }}>current details</label>
                                        <div className="row no-gutters">
                                            <Input
                                                name='addressLine1'
                                                className="col-6 pr-3"
                                                label={'address line 1'}
                                                type='text'
                                                disabled={this.state.status === "inProgress" ? true : false}
                                                required={this.isRequiredField('addressLine1', "addresses")}
                                                placeholder={'"address"'}
                                                value={formData.addresses[0].addressLine1}
                                                onChange={(value) => this.handleInputChange(value, 'addressLine1', "addresses", 0)}

                                                onError={(error) => this.handleError(error, 'addressLine1_currentAddress')}
                                                validation={validation['addressMaxLength:']}
                                                message={message['addressMaxLength']}
                                                errors={this.state.errors['addressLine1_currentAddress']}
                                            />
                                        </div>
                                        <div className="row no-gutters">
                                            <Input
                                                name='addressLine2'
                                                className="col-6 pr-3"
                                                label={'address line 2'}
                                                type='text'
                                                disabled={this.state.status === "inProgress" ? true : false}
                                                required={this.isRequiredField('addressLine2', "addresses")}
                                                placeholder={'"address"'}
                                                value={formData.addresses[0].addressLine2}
                                                onChange={(value) => this.handleInputChange(value, 'addressLine2', "addresses", 0)}

                                                onError={(error) => this.handleError(error, 'addressLine2_currentAddress')}
                                                validation={validation['addressMaxLength']}
                                                message={message['addressMaxLength']}
                                                errors={this.state.errors['addressLine2_currentAddress']}
                                            />
                                        </div>
                                        <div className="row no-gutters">
                                            <Input
                                                name='addressLine3'
                                                className="col-6 pr-3"
                                                label={'address line 3'}
                                                type='text'
                                                disabled={this.state.status === "inProgress" ? true : false}
                                                required={this.isRequiredField('addressLine3', "addresses")}
                                                placeholder={'"address"'}
                                                value={formData.addresses[0].addressLine3}
                                                onChange={(value) => this.handleInputChange(value, 'addressLine3', "addresses", 0)}

                                                onError={(error) => this.handleError(error, 'addressLine3_currentAddress')}
                                                validation={validation['addressMaxLength']}
                                                message={message['addressMaxLength']}
                                                errors={this.state.errors['addressLine3_currentAddress']}
                                            />
                                        </div>

                                        <div className="row no-gutters">

                                            <CustomSelect
                                                name='state'
                                                className="col-4 pr-3 pt-3"
                                                required={this.isRequiredField('state', "addresses")}
                                                label={'state'}
                                                disabled={this.state.status === "inProgress" ? true : false}
                                                options={this.props.EMP_MGMT_ESIC_STATE}
                                                value={formData.addresses[0].state}
                                                onChange={(value) => this.handleInputChange(value, 'state', "addresses", 0)}

                                            />

                                            <CustomSelect
                                                name='district'
                                                className="col-4 pr-3 pt-3"
                                                required={this.isRequiredField('district', "addresses")}
                                                label={'district'}
                                                disabled={this.state.status === "inProgress" || _.isEmpty(formData.addresses[0].state)}
                                                options={this.props.EMP_MGMT_ESIC_DISTRICT}
                                                value={formData.addresses[0].district}
                                                filterOptionsBy={this.basicDistrictFilter(formData.addresses[0].state)}
                                                onChange={(value) => this.handleInputChange(value, 'district', "addresses", 0)}

                                            />


                                            <Input
                                                name='pincode'
                                                className="col-4 pr-3"
                                                label={'pincode'}
                                                type='text'
                                                disabled={this.state.status === "inProgress" ? true : false}
                                                required={this.isRequiredField('pincode', "addresses")}
                                                placeholder={'pincode'}
                                                value={formData.addresses[0].pincode}
                                                onChange={(value) => this.handleInputChange(value, 'pincode', "addresses", 0)}

                                                onError={(error) => this.handleError(error, 'pincode_currentAddress')}
                                                validation={validation['pincode']}
                                                message={message['pincode']}
                                                errors={this.state.errors['pincode_currentAddress']}
                                            />
                                        </div>

                                        <div className="row no-gutters">
                                            <div className="d-flex flex-row col-6">
                                                <Input
                                                    name='phoneNumberStdCode'
                                                    className="col-4 pr-2 pl-0"
                                                    label={'phone number'}
                                                    type='text'
                                                    disabled={this.state.status === "inProgress" ? true : false}
                                                    required={this.isRequiredField('phoneNumberStdCode', "addresses")}
                                                    placeholder={'std code'}
                                                    value={formData.addresses[0].phoneNumberStdCode}
                                                    onChange={(value) => this.handleInputChange(value, 'phoneNumberStdCode', "addresses", 0)}

                                                    onError={(error) => this.handleError(error, 'phoneNumberStdCode_currentAddress')}
                                                    validation={validation['stdCode']}
                                                    message={message['stdCode']}
                                                    errors={this.state.errors['phoneNumberStdCode_currentAddress']}
                                                />
                                                <div className="position-relative">
                                                    <span className="position-absolute" style={{ top: "3rem" }}>-</span>
                                                </div>

                                                <Input
                                                    name='phoneNumber'
                                                    className="col-6 pr-3 pl-3"
                                                    label={' '}
                                                    type='text'
                                                    disabled={this.state.status === "inProgress" ? true : false}
                                                    required={this.isRequiredField('phoneNumber', "addresses")}
                                                    placeholder={'phone number'}
                                                    value={formData.addresses[0].phoneNumber}
                                                    onChange={(value) => this.handleInputChange(value, 'phoneNumber', "addresses", 0)}

                                                    onError={(error) => this.handleError(error, 'phoneNumber_currentAddress')}
                                                    validation={validation['phoneNumber']}
                                                    message={message['phoneNumber']}
                                                    errors={this.state.errors['phoneNumber_currentAddress']}
                                                />


                                            </div>


                                            <Input
                                                name='mobileNumber'
                                                className="col-4 pr-3"
                                                label={'mobile number'}
                                                type='text'
                                                disabled={this.state.status === "inProgress" ? true : false}
                                                required={this.isRequiredField('mobileNumber', "addresses")}
                                                placeholder={'mobile number'}
                                                value={formData.addresses[0].mobileNumber}
                                                onChange={(value) => this.handleInputChange(value, 'mobileNumber', "addresses", 0)}

                                                onError={(error) => this.handleError(error, 'mobileNumber_currentAddress')}
                                                validation={validation['mobileNumber']}
                                                message={message['mobileNumber']}
                                                errors={this.state.errors['mobileNumber_currentAddress']}
                                            />

                                            <Input
                                                name='email'
                                                className="col-4 pr-3"
                                                label={'email'}
                                                type='text'
                                                disabled={this.state.status === "inProgress" ? true : false}
                                                required={this.isRequiredField('email', "addresses")}
                                                placeholder={'abc@xyz.com'}
                                                value={formData.addresses[0].email}
                                                onChange={(value) => this.handleInputChange(value, 'email', "addresses", 0)}
                                                onError={(error) => this.handleError(error, 'email_currentAddress')}
                                                validation={validation['email']}
                                                message={message['email']}
                                                errors={this.state.errors['email_currentAddress']}
                                            />

                                        </div>


                                    </div>

                                    <div className='row no-gutters d-inline-block ml-0'>
                                        <CheckBox
                                            type="medium"
                                            // className="mt-1"
                                            name="isCurrentSameAsPermanent"
                                            disabled={this.state.status === "inProgress" ? true : false}
                                            value={formData.isCurrentSameAsPermanent}
                                            onChange={() => this.handleCheckBox("isCurrentSameAsPermanent", null, null)}
                                            checkMarkStyle={styles.checkMarkStyle}

                                        />

                                        <div className='ml-3 pl-2'>
                                            <label className={styles.checkBoxText}>{"is permanent address same as current address"}</label>
                                        </div>

                                    </div>


                                    {/* ////////// Permanent Address //////////// */}
                                    {!formData.isCurrentSameAsPermanent ?
                                        < div className="d-flex flex-column">
                                            <label className={styles.SubHeading} style={{ paddingTop: "1.5rem" }}>permanent details</label>
                                            <div className="row no-gutters">
                                                <Input
                                                    name='addressLine1'
                                                    className="col-6 pr-3"
                                                    label={'address line 1'}
                                                    type='text'
                                                    disabled={this.state.status === "inProgress" ? true : false}
                                                    required={this.isRequiredField('addressLine1', "addresses")}
                                                    placeholder={'"address"'}
                                                    value={formData.addresses[1].addressLine1}
                                                    onChange={(value) => this.handleInputChange(value, 'addressLine1', "addresses", 1)}

                                                    onError={(error) => this.handleError(error, 'addressLine1_permanentAddress')}
                                                    validation={validation['addressMaxLength']}
                                                    message={message['addressMaxLength']}
                                                    errors={this.state.errors['addressLine1_permanentAddress']}
                                                />
                                            </div>
                                            <div className="row no-gutters">
                                                <Input
                                                    name='addressLine2'
                                                    className="col-6 pr-3"
                                                    label={'address line 2'}
                                                    type='text'
                                                    disabled={this.state.status === "inProgress" ? true : false}
                                                    required={this.isRequiredField('addressLine2', "addresses")}
                                                    placeholder={'"address"'}
                                                    value={formData.addresses[1].addressLine2}
                                                    onChange={(value) => this.handleInputChange(value, 'addressLine2', "addresses", 1)}
                                                    onError={(error) => this.handleError(error, 'addressLine2_permanentAddress')}
                                                    validation={validation['addressMaxLength']}
                                                    message={message['addressMaxLength']}
                                                    errors={this.state.errors['addressLine2_permanentAddress']}
                                                />
                                            </div>
                                            <div className="row no-gutters">
                                                <Input
                                                    name='addressLine3'
                                                    className="col-6 pr-3"
                                                    label={'address line 3'}
                                                    type='text'
                                                    disabled={this.state.status === "inProgress" ? true : false}
                                                    required={this.isRequiredField('addressLine3', "addresses")}
                                                    placeholder={'"address"'}
                                                    value={formData.addresses[1].addressLine3}
                                                    onChange={(value) => this.handleInputChange(value, 'addressLine3', "addresses", 1)}
                                                    onError={(error) => this.handleError(error, 'addressLine3_permanentAddress')}
                                                    validation={validation['addressMaxLength']}
                                                    message={message['addressMaxLength']}
                                                    errors={this.state.errors['addressLine3_permanentAddress']}
                                                />
                                            </div>
                                            <div className="row no-gutters">
                                                <CustomSelect
                                                    name='state'
                                                    className="col-4 pr-3 pt-3"
                                                    required={this.isRequiredField('state', "addresses")}
                                                    label={'state'}
                                                    disabled={this.state.status === "inProgress" ? true : false}
                                                    options={this.props.EMP_MGMT_ESIC_STATE}
                                                    value={formData.addresses[1].state}
                                                    onChange={(value) => this.handleInputChange(value, 'state', "addresses", 1)}

                                                />

                                                <CustomSelect
                                                    name='district'
                                                    className="col-4 pr-3 pt-3"
                                                    required={this.isRequiredField('district', "addresses")}
                                                    label={'district'}
                                                    disabled={this.state.status === "inProgress" || _.isEmpty(formData.addresses[1].state)}
                                                    options={this.props.EMP_MGMT_ESIC_DISTRICT}
                                                    value={formData.addresses[1].district}
                                                    filterOptionsBy={this.basicDistrictFilter(formData.addresses[1].state)}
                                                    onChange={(value) => this.handleInputChange(value, 'district', "addresses", 1)}

                                                />


                                                <Input
                                                    name='pincode'
                                                    className="col-4 pr-3"
                                                    label={'pincode'}
                                                    type='text'
                                                    disabled={this.state.status === "inProgress" ? true : false}
                                                    required={this.isRequiredField('pincode', "addresses")}
                                                    placeholder={'pincode'}
                                                    value={formData.addresses[1].pincode}
                                                    onChange={(value) => this.handleInputChange(value, 'pincode', "addresses", 1)}

                                                    onError={(error) => this.handleError(error, 'pincode_permanentAddress')}
                                                    validation={validation['pincode']}
                                                    message={message['pincode']}
                                                    errors={this.state.errors['pincode_permanentAddress']}
                                                />

                                            </div>
                                            <div className="row no-gutters">

                                                <div className="d-flex flex-row col-6">
                                                    <Input
                                                        name='phoneNumberStdCode'
                                                        className="col-4 pr-2 pl-0"
                                                        label={'phone number'}
                                                        type='text'
                                                        disabled={this.state.status === "inProgress" ? true : false}
                                                        required={this.isRequiredField('phoneNumberStdCode', "addresses")}
                                                        placeholder={'std code'}
                                                        value={formData.addresses[1].phoneNumberStdCode}
                                                        onChange={(value) => this.handleInputChange(value, 'phoneNumberStdCode', "addresses", 1)}

                                                        onError={(error) => this.handleError(error, 'phoneNumberStdCode_permanentAddress')}
                                                        validation={validation['stdCode']}
                                                        message={message['stdCode']}
                                                        errors={this.state.errors['phoneNumberStdCode_permanentAddress']}
                                                    />
                                                    <div className="position-relative">
                                                        <span className="position-absolute" style={{ top: "3rem" }}>-</span>
                                                    </div>

                                                    <Input
                                                        name='phoneNumber'
                                                        className="col-6 pr-3 pl-3"
                                                        label={' '}
                                                        type='text'
                                                        disabled={this.state.status === "inProgress" ? true : false}
                                                        required={this.isRequiredField('phoneNumber', "addresses")}
                                                        placeholder={'phone number'}
                                                        value={formData.addresses[1].phoneNumber}
                                                        onChange={(value) => this.handleInputChange(value, 'phoneNumber', "addresses", 1)}

                                                        onError={(error) => this.handleError(error, 'phoneNumber_permanentAddress')}
                                                        validation={validation['phoneNumber']}
                                                        message={message['phoneNumber']}
                                                        errors={this.state.errors['phoneNumber_permanentAddress']}
                                                    />


                                                </div>

                                                <Input
                                                    name='mobileNumber'
                                                    className="col-4 pr-3"
                                                    label={'mobile number'}
                                                    type='text'
                                                    disabled={this.state.status === "inProgress" ? true : false}
                                                    required={this.isRequiredField('mobileNumber', "addresses")}
                                                    placeholder={'mobile number'}
                                                    value={formData.addresses[1].mobileNumber}
                                                    onChange={(value) => this.handleInputChange(value, 'mobileNumber', "addresses", 1)}
                                                    onError={(error) => this.handleError(error, 'mobileNumber_permanentAddress')}
                                                    validation={validation['mobileNumber']}
                                                    message={message['mobileNumber']}
                                                    errors={this.state.errors['mobileNumber_permanentAddress']}
                                                />

                                                <Input
                                                    name='email'
                                                    className="col-4 pr-3"
                                                    label={'email'}
                                                    type='text'
                                                    disabled={this.state.status === "inProgress" ? true : false}
                                                    required={this.isRequiredField('email', "addresses")}
                                                    placeholder={'abc@xyz.com'}
                                                    value={formData.addresses[1].email}
                                                    onChange={(value) => this.handleInputChange(value, 'email', "addresses", 1)}
                                                    onError={(error) => this.handleError(error, 'email_permanentAddress')}
                                                    validation={validation['email']}
                                                    message={message['email']}
                                                    errors={this.state.errors['email_permanentAddress']}
                                                />

                                            </div>


                                        </div> : null}
                                    <hr className={styles.HorizotalLine} />
                                    {/* ///////////////////// Dispensary/IMP/mEUD For IP/////////////////// */}
                                    <div className="d-flex flex-column">
                                        <label className={styles.SubHeading} style={{ paddingTop: "1rem" }}>dispensary Or IMP or mEUD For IP</label>
                                        <div className="row no-gutters">

                                            <CustomSelect
                                                name='state'
                                                className="col-4 pr-3 pt-3"
                                                required={this.isRequiredField('state', "medicalInstIp")}
                                                label={'state'}
                                                disabled={this.state.status === "inProgress" ? true : false}
                                                options={this.props.EMP_MGMT_ESIC_DISP_IMP_STATE}
                                                value={formData.medicalInstIp.state}
                                                onChange={(value) => this.handleInputDispImpSection(value, 'state', "medicalInstIp")}

                                            />

                                            <CustomSelect
                                                name='district'
                                                className="col-4 pr-3 pt-3"
                                                required={this.isRequiredField('district', "medicalInstIp")}
                                                label={'district'}
                                                disabled={this.state.status === "inProgress" || _.isEmpty(formData.medicalInstIp.state)}
                                                options={this.props.EMP_MGMT_ESIC_DISP_IMP_DISTRICT}
                                                value={formData.medicalInstIp.district}
                                                filterOptionsBy={this.basicDistrictFilter(formData.medicalInstIp.state)}
                                                onChange={(value) => this.handleInputDispImpSection(value, 'district', "medicalInstIp")}

                                            />

                                        </div>

                                        <div className="row no-gutters">
                                            <div className='col-6 mt-3'>
                                                <RadioButtonGroup
                                                    className="col-12 pl-2 pr-0"
                                                    label={'type'}
                                                    disabled={this.state.status === "inProgress" ? true : false}
                                                    required={this.isRequiredField('type', "medicalInstIp")}
                                                    selectItems={formConfig.esicType.options}
                                                    value={formData.medicalInstIp.type}
                                                    onSelectOption={(value) => this.handleInputDispImpSection(value, 'type', "medicalInstIp")}
                                                />
                                            </div>


                                        </div>
                                        <div className="row no-gutters">

                                            <CustomSelect
                                                name='area'
                                                className="col-6 pr-3 pt-3"
                                                required={this.isRequiredField('area', "medicalInstIp")}
                                                label={'list'}
                                                disabled={this.state.status === "inProgress" || _.isEmpty(formData.medicalInstIp.state) || _.isEmpty(formData.medicalInstIp.district)}
                                                options={this.dispImpListStaticSelector(formData.medicalInstIp.type)}
                                                value={formData.medicalInstIp.area}
                                                filterOptionsBy={this.dispImpListFilter(formData.medicalInstIp.state, formData.medicalInstIp.district)}
                                                onChange={(value) => this.handleInputDispImpSection(value, 'area', "medicalInstIp")}
                                            />
                                        </div>

                                        <div className="row no-gutters">
                                            <Input
                                                name='address'
                                                className="col-8 pr-3"
                                                label={'address'}
                                                type='text'
                                                disabled={true}
                                                required={this.isRequiredField('address', "medicalInstIp")}
                                                placeholder={'address'}
                                                value={formData.medicalInstIp.address}
                                            />
                                        </div>

                                    </div>


                                    <hr className={styles.HorizotalLine} />
                                    {/* ///////////////////// Dispensary/IMP/mEUD For Family Member/////////////////// */}
                                    <div className="d-flex flex-column">
                                        <label className={styles.SubHeading} style={{ paddingTop: "1rem" }}>dispensary Or IMP or mEUD For Family Members</label>
                                        <div className="row no-gutters">

                                            <CustomSelect
                                                name='state'
                                                className="col-4 pr-3 pt-3"
                                                required={this.isRequiredField('state', "medicalInstFamily")}
                                                label={'state'}
                                                disabled={this.state.status === "inProgress" || this.disableDispFamily()}
                                                options={this.props.EMP_MGMT_ESIC_DISP_IMP_STATE}
                                                value={formData.medicalInstFamily.state}
                                                onChange={(value) => this.handleInputDispImpSection(value, 'state', "medicalInstFamily")}

                                            />

                                            <CustomSelect
                                                name='district'
                                                className="col-4 pr-3 pt-3"
                                                required={this.isRequiredField('district', "medicalInstFamily")}
                                                label={'district'}
                                                disabled={this.state.status === "inProgress" || _.isEmpty(formData.medicalInstFamily.state) || this.disableDispFamily()}
                                                options={this.props.EMP_MGMT_ESIC_DISP_IMP_DISTRICT}
                                                value={formData.medicalInstFamily.district}
                                                filterOptionsBy={this.basicDistrictFilter(formData.medicalInstFamily.state)}
                                                onChange={(value) => this.handleInputDispImpSection(value, 'district', "medicalInstFamily")}

                                            />

                                        </div>

                                        <div className="row no-gutters">
                                            <div className='col-6 mt-3'>
                                                <RadioButtonGroup
                                                    className="col-12 pl-2 pr-0"
                                                    label={'type'}
                                                    disabled={this.state.status === "inProgress"}
                                                    required={this.isRequiredField('type', "medicalInstFamily")}
                                                    selectItems={formConfig.esicType.options}
                                                    value={formData.medicalInstFamily.type}
                                                    onSelectOption={(value) => this.handleInputDispImpSection(value, 'type', "medicalInstFamily")}
                                                />
                                            </div>


                                        </div>
                                        <div className="row no-gutters">

                                            <CustomSelect
                                                name='area'
                                                className="col-6 pr-3 pt-3"
                                                required={this.isRequiredField('area', "medicalInstFamily")}
                                                label={'list'}
                                                disabled={this.state.status === "inProgress" || _.isEmpty(formData.medicalInstFamily.state) || _.isEmpty(formData.medicalInstFamily.district) || this.disableDispFamily()}
                                                options={this.dispImpListStaticSelector(formData.medicalInstFamily.type)}
                                                value={formData.medicalInstFamily.area}
                                                filterOptionsBy={this.dispImpListFilter(formData.medicalInstFamily.state, formData.medicalInstFamily.district)}
                                                onChange={(value) => this.handleInputDispImpSection(value, 'area', "medicalInstFamily")}
                                            />
                                        </div>

                                        <div className="row no-gutters">
                                            <Input
                                                name='address'
                                                className="col-8 pr-3"
                                                label={'address'}
                                                type='text'
                                                disabled={true}
                                                required={this.isRequiredField('address', "medicalInstFamily")}
                                                placeholder={'address'}
                                                value={formData.medicalInstFamily.address}
                                            />
                                        </div>

                                    </div>


                                    <hr className={styles.HorizotalLine} />

                                    {/* ///////////////// NOMINEE DETAILS ////////////// */}
                                    <div className="d-flex flex-column">
                                        <label className={styles.SubHeading} style={{ paddingTop: "1rem" }}>details of nominee</label>
                                        <div className="row no-gutters">
                                            <Input
                                                name='name'
                                                className="col-4 pr-3"
                                                label={'name'}
                                                type='text'
                                                disabled={this.state.status === "inProgress" ? true : false}
                                                required={this.isRequiredField('name', "nominee")}
                                                placeholder={'name'}
                                                value={formData.nominee.name}
                                                onChange={(value) => this.handleInputChange(value, 'name', "nominee", null)}

                                                onError={(error) => this.handleError(error, 'name_nominee')}
                                                validation={validation['maxLength']}
                                                message={message['maxLength']}
                                                errors={this.state.errors['name_nominee']}
                                            />

                                            <CustomSelect
                                                name='relationshipWithIp'
                                                className="col-6 pr-3 pt-3"
                                                required={this.isRequiredField('relationshipWithIp', "nominee")}
                                                label={'relationship with IP'}

                                                disabled={this.state.status === "inProgress" ? true : false}
                                                options={this.props.EMP_RELATION_TYPE}
                                                value={formData.nominee.relationshipWithIp}
                                                onChange={(value) => this.handleInputChange(value, 'relationshipWithIp', "nominee", null)}

                                            />
                                        </div>

                                        <div className="row no-gutters">
                                            <Input
                                                name='addressLine1'
                                                className="col-6 pr-3"
                                                label={'address line 1'}
                                                type='text'
                                                disabled={this.state.status === "inProgress" ? true : false}
                                                required={this.isRequiredField('addressLine1', "nominee")}
                                                placeholder={'addressLine1'}
                                                value={formData.nominee.addressLine1}
                                                onChange={(value) => this.handleInputChange(value, 'addressLine1', "nominee", null)}

                                                onError={(error) => this.handleError(error, 'addressline1_nominee')}
                                                validation={validation['addressMaxLength']}
                                                message={message['addressMaxLength']}
                                                errors={this.state.errors['addressline1_nominee']}
                                            />
                                        </div>
                                        <div className="row no-gutters">
                                            <Input
                                                name='addressLine2'
                                                className="col-6 pr-3"
                                                label={'address line 2'}
                                                type='text'
                                                disabled={this.state.status === "inProgress" ? true : false}
                                                required={this.isRequiredField('addressLine2', "nominee")}
                                                placeholder={'address line 2'}
                                                value={formData.nominee.addressLine2}
                                                onChange={(value) => this.handleInputChange(value, 'addressLine2', "nominee", null)}

                                                onError={(error) => this.handleError(error, 'addressline2_nominee')}
                                                validation={validation['addressMaxLength']}
                                                message={message['addressMaxLength']}
                                                errors={this.state.errors['addressline2_nominee']}
                                            />
                                        </div>
                                        <div className="row no-gutters">
                                            <Input
                                                name='addressLine3'
                                                className="col-6 pr-3"
                                                label={'address line 3'}
                                                type='text'
                                                disabled={this.state.status === "inProgress" ? true : false}
                                                required={this.isRequiredField('addressLine3', "nominee")}
                                                placeholder={'address line 3'}
                                                value={formData.nominee.addressLine3}
                                                onChange={(value) => this.handleInputChange(value, 'addressLine3', "nominee", null)}

                                                onError={(error) => this.handleError(error, 'addressline3_nominee')}
                                                validation={validation['addressMaxLength']}
                                                message={message['addressMaxLength']}
                                                errors={this.state.errors['addressline3_nominee']}
                                            />
                                        </div>

                                        <div className="row no-gutters">

                                            <CustomSelect
                                                name='state'
                                                className="col-4 pr-3 pt-3"
                                                required={this.isRequiredField('state', "nominee")}
                                                label={'state'}
                                                disabled={this.state.status === "inProgress" ? true : false}
                                                options={this.props.EMP_MGMT_ESIC_STATE}
                                                value={formData.nominee.state}
                                                onChange={(value) => this.handleInputChange(value, 'state', "nominee", null)}

                                            />

                                            <CustomSelect
                                                name='district'
                                                className="col-4 pr-3 pt-3"
                                                required={this.isRequiredField('district', "nominee")}
                                                label={'district'}
                                                disabled={this.state.status === "inProgress" || _.isEmpty(formData.nominee.state)}
                                                options={this.props.EMP_MGMT_ESIC_DISTRICT}
                                                value={formData.nominee.district}
                                                filterOptionsBy={this.basicDistrictFilter(formData.nominee.state)}
                                                onChange={(value) => this.handleInputChange(value, 'district', "nominee", null)}

                                            />
                                            <Input
                                                name='pincode'
                                                className="col-4 pr-3"
                                                label={'pincode'}
                                                type='text'
                                                disabled={this.state.status === "inProgress" ? true : false}
                                                required={this.isRequiredField('pincode', "nominee")}
                                                placeholder={'pincode'}
                                                value={formData.nominee.pincode}
                                                onChange={(value) => this.handleInputChange(value, 'pincode', "nominee", null)}

                                                onError={(error) => this.handleError(error, 'pincode_nominee')}
                                                validation={validation['pincode']}
                                                message={message['pincode']}
                                                errors={this.state.errors['pincode_nominee']}
                                            />
                                        </div>

                                        <div className="row no-gutters">
                                            <div className="d-flex flex-row col-6">
                                                <Input
                                                    name='phoneNumberStdCode'
                                                    className="col-4 pr-2 pl-0"
                                                    label={'phone number'}
                                                    type='text'
                                                    disabled={this.state.status === "inProgress" ? true : false}
                                                    required={this.isRequiredField('phoneNumberStdCode', "addresses")}
                                                    placeholder={'std code'}
                                                    value={formData.nominee.phoneNumberStdCode}
                                                    onChange={(value) => this.handleInputChange(value, 'phoneNumberStdCode', "nominee", null)}

                                                    onError={(error) => this.handleError(error, 'phoneNumberStdCode_nominee')}
                                                    validation={validation['stdCode']}
                                                    message={message['stdCode']}
                                                    errors={this.state.errors['phoneNumberStdCode_nominee']}
                                                />
                                                <div className="position-relative">
                                                    <span className="position-absolute" style={{ top: "3rem" }}>-</span>
                                                </div>

                                                <Input
                                                    name='phoneNumber'
                                                    className="col-6 pr-3 pl-3"
                                                    label={' '}
                                                    type='text'
                                                    disabled={this.state.status === "inProgress" ? true : false}
                                                    required={this.isRequiredField('phoneNumber', "addresses")}
                                                    placeholder={'phone number'}
                                                    value={formData.nominee.phoneNumber}
                                                    onChange={(value) => this.handleInputChange(value, 'phoneNumber', "nominee", null)}

                                                    onError={(error) => this.handleError(error, 'phoneNumber_nominee')}
                                                    validation={validation['phoneNumber']}
                                                    message={message['phoneNumber']}
                                                    errors={this.state.errors['phoneNumber_nominee']}
                                                />


                                            </div>

                                            <Input
                                                name='mobileNumber'
                                                className="col-4 pr-3"
                                                label={'mobile number'}
                                                type='text'
                                                disabled={this.state.status === "inProgress" ? true : false}
                                                required={this.isRequiredField('mobileNumber', "nominee")}
                                                placeholder={'mobile number'}
                                                value={formData.nominee.mobileNumber}
                                                onChange={(value) => this.handleInputChange(value, 'mobileNumber', "nominee", null)}
                                                onError={(error) => this.handleError(error, 'mobileNumber_nominee')}
                                                validation={validation['mobileNumber']}
                                                message={message['mobileNumber']}
                                                errors={this.state.errors['mobileNumber_nominee']}
                                            />
                                            <CustomSelect
                                                name='isFamilyMember'
                                                className="col-4 pr-3 pt-3"
                                                required={this.isRequiredField('isFamilyMember', "nominee")}
                                                label={'is family member'}
                                                disabled={this.state.status === "inProgress" ? true : false}
                                                options={formConfig.booleanChoice.options}
                                                value={formData.nominee.isFamilyMember}
                                                onChange={(value) => this.handleInputChange(value, 'isFamilyMember', "nominee", null)}
                                            />
                                        </div>

                                    </div>

                                    <hr className={styles.HorizotalLine} />
                                    {/* ///////////////// FAMILY DETAILS ////////////// */}
                                    <div className="py-2">
                                        <span className={cx(styles.SubHeading, styles.blueText)} style={{ fontFamily: "Gilroy" }} onClick={this.state.status === "init" ? this.handleAddNewFamilyData : null}>
                                            <img src={addButton} alt="add" className="mr-2" style={{ cursor: "pointer" }} />add family member</span>
                                    </div>

                                    {formData.familyMembers.map((data, index) => {
                                        return (
                                            <div className="d-flex flex-column pb-4" key={index}>
                                                <div className="d-flex flex-row justify-content-between">
                                                    <label className={styles.SubHeading} style={{ paddingTop: "1rem" }}>family details  {formData.familyMembers.length - index}</label>
                                                    {formData.familyMembers.length > 1 ?
                                                        <DeleteButton
                                                            label={'delete'}
                                                            isDisabled={this.state.status === "inProgress" ? true : false}
                                                            isDeleteIconRequired={true}
                                                            clickHandler={(e) => this.handleDeteleFamilyData(e, index)}
                                                        /> : null}
                                                </div>


                                                <div className="row no-gutters">
                                                    <Input
                                                        name='name'
                                                        className="col-4 pr-3"
                                                        label={'name'}
                                                        type='text'
                                                        placeholder={'name'}
                                                        value={data.name}
                                                        disabled={this.state.status === "inProgress" ? true : false}
                                                        required={this.isRequiredField('name', "familyMembers")}
                                                        onChange={(value) => this.handleInputChange(value, 'name', "familyMembers", index)}

                                                        onError={(error) => this.handleError(error, 'name_familyMembers_' + index)}
                                                        validation={validation['maxLength']}
                                                        message={message['maxLength']}
                                                        errors={this.state.errors['name_familyMembers_' + index]}

                                                    />

                                                    <Datepicker
                                                        name='dob'
                                                        className="col-4 pr-3"
                                                        label={'date of birth'}
                                                        type='text'
                                                        placeholder={'dd-mm-yyyy'}
                                                        value={data.dob}
                                                        disabled={this.state.status === "inProgress" ? true : false}
                                                        required={this.isRequiredField('dob', "familyMembers")}
                                                        onChange={(value) => this.handleInputChange(value, 'dob', "familyMembers", index)}

                                                        onError={(error) => this.handleError(error, 'dob_familyMembers_' + index)}
                                                        validation={validation['dob']}
                                                        message={message['dob']}
                                                        errors={this.state.errors['dob_familyMembers_' + index]}
                                                    />


                                                </div>
                                                <div className="row no-gutters">
                                                    <CustomSelect
                                                        name='relationship'
                                                        className="col-6 pr-3 pt-3"
                                                        required={this.isRequiredField('relationship', "familyMembers")}
                                                        label={'relationship with employee'}
                                                        options={this.props.EMP_RELATION_TYPE}
                                                        value={data.relationship}
                                                        disabled={this.state.status === "inProgress" ? true : false}
                                                        onChange={(value) => this.handleInputChange(value, 'relationship', "familyMembers", index)}

                                                    />
                                                    {
                                                        (data.relationship !== null && data.relationship !== '1' && data.relationship !== '99') ?
                                                            <CustomSelect
                                                                name='gender'
                                                                className="col-4 pr-3 pt-3"
                                                                required={this.isRequiredField('gender', "familyMembers")}
                                                                label={'gender'}
                                                                options={this.familyGenderStaticSelector(data.relationship)}
                                                                value={data.gender}
                                                                disabled={this.state.status === "inProgress" ? true : false}
                                                                onChange={(value) => this.handleInputChange(value, 'gender', "familyMembers", index)}

                                                            />

                                                            : null

                                                    }
                                                </div>
                                                {(data.relationship === "7" || data.relationship === "8") ?
                                                    <div className='row no-gutters d-inline-block ml-0' style={{ paddingTop: "1rem" }}>
                                                        <CheckBox
                                                            type="medium"
                                                            // className="mt-1"
                                                            name="incomeShouldNotExceed"
                                                            value={data.incomeShouldNotExceed}
                                                            onChange={() => this.handleCheckBox("incomeShouldNotExceed", "familyMembers", index)}
                                                            disabled={this.state.status === "inProgress" ? true : false}
                                                            checkMarkStyle={{ marginTop: '2px' }}
                                                        />

                                                        <div className='ml-3 pl-2'>
                                                            <label className={styles.checkBoxText} style={{ lineHeight: "18px" }}>be sure that the income of the parents from all sources do not exceed Rs5000/-
                                                            per month at present and that any time income of parent(s) exceeded Rs5000/- changes would be incorporated accordingly
                                                        <span className={styles.requiredStar}> *</span></label>
                                                        </div>

                                                    </div> : null}

                                                <div className="row no-gutters">
                                                    <CustomSelect
                                                        name='isResidingWithEmployee'
                                                        className="col-4 pr-3 pt-3"
                                                        required={this.isRequiredField('isResidingWithEmployee', "familyMembers")}
                                                        label={'residing with employee'}
                                                        disabled={this.state.status === "inProgress" ? true : false}
                                                        options={formConfig.booleanChoice.options}
                                                        value={data.isResidingWithEmployee}

                                                        onChange={(value) => this.handleInputChange(value, 'isResidingWithEmployee', "familyMembers", index)}

                                                    />
                                                    {!data.isResidingWithEmployee ?
                                                        <React.Fragment>

                                                            <CustomSelect
                                                                name='state'
                                                                className="col-4 pr-3 pt-3"
                                                                required={this.isRequiredField('state', "familyMembers")}
                                                                label={'state'}
                                                                disabled={this.state.status === "inProgress" ? true : false}
                                                                options={this.props.EMP_MGMT_ESIC_STATE}
                                                                value={data.state}
                                                                onChange={(value) => this.handleInputChange(value, 'state', "familyMembers", index)}

                                                            />

                                                            <CustomSelect
                                                                name='district'
                                                                className="col-4 pr-3 pt-3"
                                                                required={this.isRequiredField('district', "familyMembers")}
                                                                label={'district'}
                                                                disabled={this.state.status === "inProgress" || _.isEmpty(data.state)}
                                                                options={this.props.EMP_MGMT_ESIC_DISTRICT}
                                                                value={data.district}
                                                                filterOptionsBy={this.basicDistrictFilter(data.state)}
                                                                onChange={(value) => this.handleInputChange(value, 'district', "familyMembers", index)}

                                                            />

                                                        </React.Fragment>
                                                        : null}
                                                </div>
                                            </div>
                                        )
                                    })}

                                    <hr className={styles.HorizotalLine} />

                                    {/* /////////////////BANK DETAILS //////////////// */}

                                    <div className="d-flex flex-column">
                                        <label className={styles.SubHeading} style={{ paddingTop: "1rem" }}>bank details</label>
                                        <div className="row no-gutters">
                                            <Input
                                                name='bankName'
                                                className="col-4 pr-3"
                                                label={'bank name'}
                                                type='text'
                                                disabled={this.state.status === "inProgress" ? true : false}
                                                required={this.isRequiredField("bankName", "bankDetails")}
                                                placeholder={'bank name'}
                                                value={formData.bankDetails.bankName}
                                                onChange={(value) => this.handleInputChange(value, 'bankName', "bankDetails", null)}

                                                onError={(error) => this.handleError(error, 'bankName')}
                                                validation={validation['maxLength']}
                                                message={message['maxLength']}
                                                errors={this.state.errors['bankName']}
                                            />

                                            <Input
                                                name='accountNumber'
                                                className="col-4 pr-3"
                                                label={'account number'}
                                                type='text'
                                                disabled={this.state.status === "inProgress" ? true : false}
                                                required={this.isRequiredField("accountNumber", "bankDetails")}
                                                placeholder={'account number'}
                                                value={formData.bankDetails.accountNumber}
                                                onChange={(value) => this.handleInputChange(value, 'accountNumber', "bankDetails", null)}

                                                onError={(error) => this.handleError(error, 'accountNumber')}
                                                validation={validation['accountNumber']}
                                                message={message['accountNumber']}
                                                errors={this.state.errors['accountNumber']}
                                            />

                                            <Input
                                                name='ifscCode'
                                                className="col-4 pr-3"
                                                label={'IFSC code'}
                                                type='text'
                                                disabled={this.state.status === "inProgress" ? true : false}
                                                required={this.isRequiredField("ifscCode", "bankDetails")}
                                                placeholder={'IFSC code'}
                                                value={formData.bankDetails.ifscCode}
                                                onChange={(value) => this.handleInputChange(value, 'ifscCode', "bankDetails", null)}

                                                onError={(error) => this.handleError(error, 'ifscCode')}
                                                validation={validation['ifscCode']}
                                                message={message['ifscCode']}
                                                errors={this.state.errors['ifscCode']}
                                            />
                                        </div>
                                        <div className="row no-gutters">
                                            <Input
                                                name='micrCode'
                                                className="col-4 pr-3"
                                                label={'MICR code'}
                                                type='text'
                                                disabled={this.state.status === "inProgress" ? true : false}
                                                required={this.isRequiredField("micrCode", "bankDetails")}
                                                placeholder={'state'}
                                                value={formData.bankDetails.micrCode}
                                                onChange={(value) => this.handleInputChange(value, 'micrCode', "bankDetails", null)}
                                            />

                                            <CustomSelect
                                                name='accountType'
                                                className="col-4 pr-3 pt-3"
                                                required={this.isRequiredField("accountType", "bankDetails")}
                                                label={'account type'}
                                                disabled={this.state.status === "inProgress" ? true : false}
                                                options={this.props.EMP_BANK_ACCOUNT_TYPE}
                                                value={formData.bankDetails.accountType}
                                                onChange={(value) => this.handleInputChange(value, 'accountType', "bankDetails", null)}

                                            />

                                        </div>
                                        {/* <div className={cx(styles.infoContainer, 'd-flex flex-row position-relative')} style={{ marginTop: "1rem", marginBottom: "0.6rem" }}>
                                        <img src={info} alt="info" className="position-absolute" style={{ top: "12px" }} />
                                        <label className={styles.infoText} style={{ lineHeight: "22px" }}>attested and signed by employer copy of the front page of cheque leaflet issued by bank or the 1st 2 pages
                                     of passbook showing the name of the account holder, account number, bank name, bank beanch, IFSC number, bank branch, IFSC number should be uploaded here.<br />
                                        it shall be the responsibility of the employer to provide the correct bank credentials of the employee to prevent legal and administrative consequences
                                        in case of wrong of fraudulent entry. it is recommended that each insured person should have unique bank account number.</label>
                                        <img src={close} className={styles.infoCloseIcon} style={{ top: "12px" }} alt="close" />
                                    </div> */}

                                        {/* <div className='d-flex flex-wrap pt-4'>
                                        <div className="d-flex flex-column">
                                            <Upload
                                                className={styles.Cursor}
                                                upload={upload}
                                                id={"bankDetails"}
                                                disabled={this.state.status === "inProgress" ? true : false}
                                                fileUpload={(file) => this.getAndUploadImage("bankAccountFile", file)}
                                                addState={this.props.docUploadState}
                                            />
                                        </div>
                                        {!_.isEmpty(this.state.formData.bankDetails.bankAccountFileURL) && this.state.formData.bankDetails.bankAccountFileURL.map((file, index) => {
                                            return (
                                                <FileView
                                                    className={cx(styles.Preview, 'ml-2')}
                                                    url={file}
                                                    fileClicked={this.props.downloadFileState === 'LOADING' || this.state.status === "inProgress" ? null : () => this.handleFileDownload(file)}
                                                    downloadFileState={this.props.downloadFileState}
                                                    clicked={(e) => this.showDeleteFileWarning(e, file)}
                                                    disabled={this.state.status === "inProgress" ? true : false}
                                                    key={index}
                                                />
                                            )
                                        })
                                        }

                                        {!_.isEmpty(this.state.formData.bankDetails.bankAccountFileURL) && this.state.formData.bankDetails.bankAccountFileURL.map((file, index) => {
                                            if (this.state.confirmDelete && file === this.state.deleteObject.url)
                                                return <WarningPopUp
                                                    text={"delete ?"}
                                                    para={"WARNING: it can not be undone"}
                                                    confirmText={"yes, delete"}
                                                    cancelText={"keep"}
                                                    icon={warn}
                                                    warningPopUp={(e) => this.deleteFile(e, 'bankAccountFile', file, this.state.formData.bankDetails.bankAccountFileURL)}
                                                    closePopup={() => this.setState({ confirmDelete: false, deleteObject: {} })}
                                                    key={index}
                                                />
                                            else return null
                                        })}

                                    </div> */}

                                        {/* <label className={cx(styles.infoText, "px-0 pt-2")} style={{ width: "120px" }}>only pdf, jpg, jpeg is allowed with max size of 200 kb</label> */}

                                    </div>



                                </form>
                            }


                        </div>
                    </div>

                </div >
            </React.Fragment >
        )
    }
}

const mapStateToProps = state => {
    return {
        empData: state.empMgmt.empOnboard.onboard.empData,
        error: state.empMgmt.empOnboard.onboard.error,
        getEmpDataState: state.empMgmt.empOnboard.onboard.getEmpDataState,
        empDocGenerateState: state.empMgmt.empOnboard.onboard.empDocGenerateState,
        docUploadState: state.empMgmt.empOnboard.onboard.uploadDocumentState,
        documentURL: state.empMgmt.empOnboard.onboard.documentURL,
        docDownloadState: state.empMgmt.empOnboard.onboard.downloadDocumentState,
        EMP_MARITAL_STATUS: state.empMgmt.empOnboard.onboard.staticData["EMP_MGMT_ESIC_MARITAL_STATUS"],
        EMP_GENDER: state.empMgmt.empOnboard.onboard.staticData["EMP_MGMT_ESIC_GENDER"],
        EMP_DISABILITY_TYPE: state.empMgmt.empOnboard.onboard.staticData["EMP_MGMT_ESIC_DISABILITY_TYPE"],
        EMP_RELATION_TYPE: state.empMgmt.empOnboard.onboard.staticData["EMP_MGMT_ESIC_RELATIONSHIP_TYPE"],
        EMP_BANK_ACCOUNT_TYPE: state.empMgmt.empOnboard.onboard.staticData["EMP_MGMT_ESIC_BANK_ACCOUNT_TYPE"],
        EMP_MGMT_ESIC_STATE: state.empMgmt.empOnboard.onboard.staticData['EMP_MGMT_ESIC_STATE'],
        EMP_MGMT_ESIC_DISTRICT: state.empMgmt.empOnboard.onboard.staticData['EMP_MGMT_ESIC_DISTRICT'],
        EMP_MGMT_ESIC_DISP_IMP_STATE: state.empMgmt.empOnboard.onboard.staticData['EMP_MGMT_ESIC_DISP_IMP_STATE'],
        EMP_MGMT_ESIC_DISP_IMP_DISTRICT: state.empMgmt.empOnboard.onboard.staticData['EMP_MGMT_ESIC_DISP_IMP_DISTRICT'],
        EMP_MGMT_ESIC_DISPENSARY_LIST: state.empMgmt.empOnboard.onboard.staticData['EMP_MGMT_ESIC_DISPENSARY_LIST'],
        EMP_MGMT_ESIC_IMP_LIST: state.empMgmt.empOnboard.onboard.staticData['EMP_MGMT_ESIC_IMP_LIST'],
        EMP_MGMT_ESIC_MEUD_LIST: state.empMgmt.empOnboard.onboard.staticData['EMP_MGMT_ESIC_MEUD_LIST'],
        EMP_MGMT_ESIC_FAMILY_GENDER_MALE_OPTIONS: state.empMgmt.empOnboard.onboard.staticData['EMP_MGMT_ESIC_FAMILY_GENDER_MALE_OPTIONS'],
        EMP_MGMT_ESIC_FAMILY_GENDER_FEMALE_OPTIONS: state.empMgmt.empOnboard.onboard.staticData['EMP_MGMT_ESIC_FAMILY_GENDER_FEMALE_OPTIONS']

    }
}


const mapDispatchToProps = dispatch => {
    return {
        // putEmpData: (orgId, empId, data) => dispatch(actions.putEmpData(orgId, empId, data, false, false)),
        generateDoc: (orgId, empId, category, docType, data) => dispatch(actions.generateDocument(orgId, empId, category, docType, data)),
        fileUpload: (folder, imageData) => dispatch(actions.documentUpload(folder, imageData)),
        fileDownload: (url) => dispatch(actions.documentDownload(url))

    }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EsicDocGeneration));