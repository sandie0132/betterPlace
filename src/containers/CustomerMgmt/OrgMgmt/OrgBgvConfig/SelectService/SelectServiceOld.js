import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';

import cx from 'classnames';
import styles from './SelectService.module.scss';

import * as actions from './Store/action.js';
import * as actionsOrgMgmt from '../../OrgMgmtStore/action';

import panConfigIcon from '../../../../../assets/icons/panSmallIcon.svg';
import aadhaarConfigIcon from '../../../../../assets/icons/aadharSmallIcon.svg';
import voterConfigIcon from '../../../../../assets/icons/voterSmallIcon.svg';
import currentAddressConfigIcon from '../../../../../assets/icons/mapSmallIcon.svg';
import permanentaddressConfigIcon from '../../../../../assets/icons/addressSmallIcon.svg';
import drivingLicenseConfigIcon from '../../../../../assets/icons/dlSmallIcon.svg';
import vehicleregistrationConfigIcon from '../../../../../assets/icons/rcSmallIcon.svg';
import globalDb from '../../../../../assets/icons/globalDbSmallIcon.svg';
import educationConfigIcon from '../../../../../assets/icons/educationSmallIcon.svg';
import employmentConfigIcon from '../../../../../assets/icons/employmentSmallIcon.svg';
import healthConfigIcon from '../../../../../assets/icons/healthSmallIcon.svg';
import refConfigIcon from '../../../../../assets/icons/refSmallIcon.svg';
import courtSmallIcon from '../../../../../assets/icons/courtSmallIcon.svg';
import policeVerificationConfigIcon from '../../../../../assets/icons/policeSmallIcon.svg';
import greyDropdown from '../../../../../assets/icons/greyDropdown.svg';
import bgv_service from '../../../../../assets/icons/bgvService.svg';

import ArrowLink from '../../../../../components/Atom/ArrowLink/ArrowLink';
import { Button, Input } from 'react-crux';
import CardHeader from '../../../../../components/Atom/PageTitle/PageTitle';
import { validation, message } from './SelectServiceValidation';
import CheckBox from '../../../../../components/Atom/CheckBox/CheckBox';
import ErrorNotification from '../../../../../components/Organism/Notifications/ErrorNotification/ErrorNotification';
import CustomRadioButton from '../../../../../components/Molecule/CustomRadioButton/CustomRadioButton';
import Loader from '../../../../../components/Organism/Loader/BGVConfigServiceLoader/BGVConfigServiceLoader';

import HasAccess from '../../../../../services/HasAccess/HasAccess';

const serviceCards = {
    "PAN": { icon: panConfigIcon, label: "pan card" },
    "AADHAAR": { icon: aadhaarConfigIcon, label: "aadhaar card" },
    "VOTER": { icon: voterConfigIcon, label: "voter card" },
    "DL": { icon: drivingLicenseConfigIcon, label: "driving license" },
    "RC": { icon: vehicleregistrationConfigIcon, label: "vehicle registration" },

    "CURRENT_ADDRESS": { icon: currentAddressConfigIcon, label: "current address" },
    "PERMANENT_ADDRESS": { icon: permanentaddressConfigIcon, label: "permanent address" },
    "ADDRESS_AGENCY_VERIFICATION": { icon: permanentaddressConfigIcon, label: "address agency" },

    "CRC_CURRENT_ADDRESS": { icon: courtSmallIcon, label: "court verification - current address" },
    "CRC_PERMANENT_ADDRESS": { icon: courtSmallIcon, label: "court verification - permanent address" },
    "POLICE_VERIFICATION": { icon: policeVerificationConfigIcon, label: "police verification" },
    "GLOBALDB": { icon: globalDb, label: "database verification" },

    "EDUCATION": { icon: educationConfigIcon, label: "education verification" },
    "EMPLOYMENT": { icon: employmentConfigIcon, label: "employment verification" },

    "HEALTH": { icon: healthConfigIcon, label: "health check verification" },
    "REFERENCE": { icon: refConfigIcon, label: "reference verification" }
}

let hasEditAccess = false;

class SelectService extends Component {
    state = {
        dropDown: false,
        enableNext: false,
        selectedServiceData: [],
        services: [],
        // courtFieldsPermanent: { 'includeCivilCases': false, "searchScope": '', 'DISTRICT': false, 'HIGH': false, 'SUPREME': false, },
        // courtFieldsCurrent: { 'includeCivilCases': false, "searchScope": '', 'DISTRICT': false, 'HIGH': false, 'SUPREME': false, },
        // applyCurrentToPermanent: false,
        // applyPermanentToCurrent: false,
        checkAccess: true,
        errors: {}
    }

    componentDidMount = () => {
        this.props.getServices();  //getting all the services.
        const { match } = this.props;
        const orgId = match.params.uuid;
        if (_.isEmpty(this.props.orgData) && orgId) {
            this.props.getOrgData(orgId)
        }
        if (orgId !== this.props.rightnavOrgId) {
            this.props.getOrgData(orgId)
        }
    }

    componentDidUpdate = (prevProps, prevState) => {

        if (prevState.services !== this.state.services) {// || prevState.courtFieldsCurrent !== this.state.courtFieldsCurrent || prevState.courtFieldsPermanent !== this.state.courtFieldsPermanent) {
            this.handleAddServicesFunction(); //adding the selected services in the array
        }
        if (prevProps.getDataServiceState !== this.props.getDataServiceState && this.props.getDataServiceState === 'SUCCESS') {
            const { match } = this.props;
            let orgId = match.params.uuid;
            this.handleAllServicesToState(); //adding isSelected value to services.
            this.props.getSelectedServiceData(orgId); //getting the selected services.
        }

        if (this.state.selectedServiceData !== prevState.selectedServiceData) {
            let updatedSelectedServiceData = _.cloneDeep(this.state.selectedServiceData);
            let enableNext = true;
            if (this.state.selectedServiceData.length === 0) {
                enableNext = false;
            }
            else {
                _.forEach(updatedSelectedServiceData, function (service) {
                    if (service.verificationType === '' || _.isEmpty(service.validity)) {
                        enableNext = false;
                    }
                    if (!_.isEmpty(service.validity) && isNaN(service.validity)) {
                        enableNext = false;
                    }
                })
            }
            this.setState({ enableNext: enableNext })
        }

        if (prevProps.getSelectedDataState !== this.props.getSelectedDataState && this.props.getSelectedDataState === 'SUCCESS') {
            this.handleSelectedService(); //showing the selected services
        }
    }

    componentWillUnmount() {
        this.props.initState();
    }

    handleAddServicesFunction = () => {
        let data;
        let updatedServices = this.state.selectedServiceData;
        // let courtFields;
        // let courtFieldsPermanent = _.cloneDeep(this.state.courtFieldsPermanent);
        // let courtFieldsCurrent = _.cloneDeep(this.state.courtFieldsCurrent);
        // _.forEach(this.state.services, function (service) {
        //     if (service.type === 'LEGAL') {
        // if (service.service === "CRC_PERMANENT_ADDRESS") { courtFields = courtFieldsPermanent }
        // else if (service.service === "CRC_CURRENT_ADDRESS") { courtFields = courtFieldsCurrent }
        // let courtList = [];
        // _.forEach(courtFields, function (value, key) {
        //     if (value === true && key !== 'includeCivilCases' && key !== 'addressManualReview') { courtList.push(key) }
        // })
        // 'addressManualReview' in courtFields &&
        //     (service.service === "CRC_PERMANENT_ADDRESS" || service.service === "CRC_CURRENT_ADDRESS") ?
        //     data = {
        //         'service': service.service,
        //         'type': service.type,
        // 'includeCivilCases': courtFields.includeCivilCases,
        // 'courts': courtList,
        // 'searchScope': courtFields.searchScope,
        //         'validity': service.validity,
        //         'verificationType': service.verificationType,
        //         'addressManualReview': courtFields.addressManualReview
        //     }
        //     :
        _.forEach(this.state.services, function (service) {
            if (service.type === 'LEGAL') {
                if (service.service === "CRC_CURRENT_ADDRESS" || service.service === "CRC_PERMANENT_ADDRESS") {
                    data = {
                        'service': service.service,
                        'type': service.type,
                        'validity': service.validity,
                        'addressManualReview': service.addressManualReview,
                        'verificationType': service.verificationType,
                    }
                }
                else {
                    data = {
                        'service': service.service,
                        'type': service.type,
                        'validity': service.validity,
                        'verificationType': service.verificationType,
                    }
                }
            }
            else if (service.type === "ADDRESS") {
                data = {
                    'service': service.service,
                    'type': service.type,
                    'validity': service.validity,
                    'verificationType': service.verificationType,
                    'showDetails': service.showDetails,
                    'addressManualReview': service.addressManualReview,
                    'verificationPreference': service.verificationPreference
                }
            }
            else {
                data = {
                    'service': service.service,
                    'type': service.type,
                    'validity': service.validity,
                    'verificationType': service.verificationType
                }
            }

            if (service.isSelected === true) {

                let existInService = false
                _.forEach(updatedServices, function (serviceData) {
                    if (serviceData.service === data.service && serviceData.type === data.type) {
                        if (serviceData.type === 'LEGAL') {
                            // serviceData.includeCivilCases = data.includeCivilCases
                            // serviceData.courts = data.courts
                            // serviceData.searchScope = data.searchScope
                            serviceData.validity = data.validity
                            serviceData.verificationType = data.verificationType
                            serviceData.addressManualReview = data.addressManualReview
                        }
                        else if (serviceData.type === "ADDRESS") {
                            serviceData.addressManualReview = data.addressManualReview
                            serviceData.verificationPreference = data.verificationPreference
                        }
                        existInService = true
                    }
                })
                if (!existInService) {
                    updatedServices.push(data);
                }


            } else {
                let existInService = false
                _.forEach(updatedServices, function (serviceData) {
                    if (serviceData.service === service.service && serviceData.type === service.type) {
                        existInService = true
                    }
                })
                if (existInService) {
                    updatedServices = updatedServices.filter(serviceData => {
                        if (serviceData.service === service.service && serviceData.type === service.type) return null;
                        return serviceData;
                    })
                }
            }
        })

        this.setState({
            selectedServiceData: updatedServices
        })
    }

    handleSelectedService = () => {
        let selectedServices = this.props.selectedServiceData.servicesEnabled;
        // let courtFieldsCurrent = _.cloneDeep(this.state.courtFieldsCurrent);
        // let courtFieldsPermanent = _.cloneDeep(this.state.courtFieldsPermanent);
        let updatedServices = _.cloneDeep(this.state.services);
        _.forEach(updatedServices, function (service) {
            _.forEach(selectedServices, function (selectedService) {
                if (service.service === selectedService.service && service.type === selectedService.type) {
                    service.isSelected = true;
                    service.validity = selectedService.validity;
                    service.verificationType = selectedService.verificationType
                    // if ('addressManualReview' in selectedService) {
                    //     service['addressManualReview'] = selectedService.addressManualReview

                    // if (service.service === "CRC_CURRENT_ADDRESS")
                    //     courtFieldsCurrent['addressManualReview'] = selectedService.addressManualReview
                    // else if (service.service === "CRC_PERMANENT_ADDRESS")
                    //     courtFieldsPermanent['addressManualReview'] = selectedService.addressManualReview
                    // }
                    if (service.type === "LEGAL") {
                        if (service.service === "CRC_CURRENT_ADDRESS" || service.service === "CRC_PERMANENT_ADDRESS") {
                            service.addressManualReview = selectedService.addressManualReview
                        }
                    }
                    if (service.type === "ADDRESS") {
                        service.showDetails = true
                        service.addressManualReview = selectedService.addressManualReview
                        service.verificationPreference = selectedService.verificationPreference
                    }
                }
            })
        })
        if (!_.isEmpty(selectedServices) && selectedServices.length !== 0) {
            this.setState({ enableNext: true })
        }
        this.setState({ services: updatedServices }); //courtFieldsCurrent: courtFieldsCurrent, courtFieldsPermanent: courtFieldsPermanent })
    }

    handleAllServicesToState = () => {
        let getServices = _.cloneDeep(this.props.servicesData)
        getServices = getServices.map(service => {
            if (service.type === 'LEGAL')
                return ({
                    ...service,
                    isSelected: false,
                    // includeCivilCases: false,
                    // searchScope: '',
                    // courts: [],
                    validity: "",
                    verificationType: ""
                })
            else if (service.type === "ADDRESS") {
                return ({
                    ...service,
                    showDetails: false,
                    addressManualReview: false,
                    verificationPreference: "POSTAL"
                })
            }
            else
                return ({
                    ...service,
                    isSelected: false,
                    validity: "",
                    verificationType: ""
                })
        })
        this.setState({ services: getServices })
    }

    handleNext = () => {
        const { match } = this.props;
        let orgId = match.params.uuid;
        let status = 'inProgress';
        if (this.props.selectedServiceData && this.props.selectedServiceData.status) {
            status = this.props.selectedServiceData.status === 'done' ? 'done' : status;
        }
        let payload = {
            servicesEnabled: this.state.selectedServiceData,
            status: status
        }
        this.props.onPostData(payload, orgId);
    };

    handleToggleCheckBox = (service, index) => { //selected services toggle
        let enableNext = this.state.enableNext;
        let updatedErrors = _.cloneDeep(this.state.errors);
        let updatedServices = _.cloneDeep(this.state.services);
        updatedServices[index].isSelected = !updatedServices[index].isSelected;

        if (updatedServices[index].isSelected === false) {
            updatedServices[index].validity = '';
            updatedServices[index].verificationType = '';
            updatedErrors[service.service] = null;
            if (service.type === "ADDRESS") {
                updatedServices[index].showDetails = false
            }
        }
        else {
            updatedServices[index].verificationType = 'AUTO_TRIGGER';
            if (service.type === "ADDRESS") {
                updatedServices[index].showDetails = true
            }
        }

        if ((_.isEmpty(updatedServices[index].verificationType)) || (_.isEmpty(updatedServices[index].validity)) || (!_.isEmpty(service.validity) && isNaN(service.validity))) {
            enableNext = false;
        }

        this.setState({ services: updatedServices, enableNext: enableNext, viewDetails: service.label, errors: updatedErrors })
    }

    handleInputChange = (value, targetService, index) => {
        let enableNext = this.state.enableNext;
        let updatedServices = _.cloneDeep(this.state.services);
        let updatedSelectedServiceData = _.cloneDeep(this.state.selectedServiceData);
        updatedServices[index].validity = value;

        _.forEach(updatedSelectedServiceData, function (service) {
            if (service.service === targetService.service && service.type === targetService.type) {
                service.validity = value;
            }

            if (_.isEmpty(service.validity) || (isNaN(service.validity) && _.isEmpty(service.verificationType))) {
                enableNext = false;
            }
        })
        this.setState({ services: updatedServices, selectedServiceData: updatedSelectedServiceData, enableNext: enableNext })
    }

    handleError = (error, inputField) => {
        const currentErrors = _.cloneDeep(this.state.errors);
        let updatedErrors = _.cloneDeep(currentErrors);
        if (!_.isEmpty(error)) {
            updatedErrors[inputField] = error;
        }
        else {
            delete updatedErrors[inputField];
        }
        if (!_.isEqual(updatedErrors, currentErrors)) {
            this.setState({ errors: updatedErrors });
        }
    };

    handleCheckbox = (targetService, event, index, type) => {
        let updatedServices = _.cloneDeep(this.state.services);
        let enableNext = this.state.enableNext;
        let updatedSelectedServiceData = _.cloneDeep(this.state.selectedServiceData);
        if (type === "verificationType") {
            updatedServices[index].verificationType = event.target.value;
        } else if (type === "addressManualReview") {
            updatedServices[index].addressManualReview = event.target.value === "YES" ? true : false;
        } else if (type === "verificationPreference") {
            updatedServices[index].verificationPreference = event.target.value;
        }
        _.forEach(updatedSelectedServiceData, function (service) {
            if (service.type === targetService.type && service.service === targetService.service) {
                if (type === "verificationType") {
                    service.verificationType = event.target.value;
                } else if (type === "addressManualReview") {
                    service.addressManualReview = event.target.value === "YES" ? true : false;
                } else if (type === "verificationPreference") {
                    service.verificationPreference = event.target.value;
                }
            }
            if (_.isEmpty(service.validity) || (isNaN(service.validity) && service.verificationType)) {
                enableNext = false;
            }
        })
        this.setState({ services: updatedServices, selectedServiceData: updatedSelectedServiceData, enableNext: enableNext })
    }

    handleToggle = (service, value, inputIdentifier) => {
        inputIdentifier = inputIdentifier.split(' ')[1];
        let updatedCourt;
        if (service === "CRC_PERMANENT_ADDRESS") {
            updatedCourt = _.cloneDeep(this.state.courtFieldsPermanent);
            updatedCourt[inputIdentifier] = !updatedCourt[inputIdentifier]
        }
        else {
            updatedCourt = _.cloneDeep(this.state.courtFieldsCurrent);
            updatedCourt[inputIdentifier] = !updatedCourt[inputIdentifier]
        }

        if (service === "CRC_PERMANENT_ADDRESS") {
            this.setState({ courtFieldsPermanent: updatedCourt });
        }
        else {
            this.setState({ courtFieldsCurrent: updatedCourt });
        }
    }

    // handleScopeChecked = (service, value) => {
    //     let courtFields;
    //     if (service === 'CRC_PERMANENT_ADDRESS') {
    //         courtFields = this.state.courtFieldsPermanent;
    //     }
    //     else {
    //         courtFields = this.state.courtFieldsCurrent;
    //     }
    //     if (courtFields.searchScope === value) { return true; }
    //     else { return false; }
    // }

    // handleCopyCourtData = (service) => {
    //     let courtFieldsCurrent = this.state.courtFieldsCurrent;
    //     let courtFieldsPermanent = this.state.courtFieldsPermanent;
    //     let applyCurrentToPermanent = this.state.applyCurrentToPermanent;
    //     let applyPermanentToCurrent = this.state.applyPermanentToCurrent;
    //     let applyNext = this.state.services;

    //     if (service.service === "CRC_PERMANENT_ADDRESS") {
    //         if (applyPermanentToCurrent === false) {
    //             courtFieldsCurrent = courtFieldsPermanent;
    //         }
    //         applyPermanentToCurrent = !applyPermanentToCurrent;

    //         _.forEach(applyNext, function (service) {
    //             if (service.service === 'CRC_CURRENT_ADDRESS' && service.type === 'LEGAL') {
    //                 service.isSelected = true;
    //             }
    //         }
    //         )
    //     }
    //     else {
    //         if (applyCurrentToPermanent === false) {
    //             courtFieldsPermanent = courtFieldsCurrent;
    //         }
    //         applyCurrentToPermanent = !applyCurrentToPermanent;
    //         _.forEach(applyNext, function (service) {
    //             if (service.service === 'CRC_PERMANENT_ADDRESS' && service.type === 'LEGAL') {
    //                 service.isSelected = true;
    //             }
    //         }
    //         )
    //     }
    //     this.setState({
    //         courtFieldsCurrent: courtFieldsCurrent,
    //         courtFieldsPermanent: courtFieldsPermanent,
    //         services: applyNext,
    //         applyCurrentToPermanent: applyCurrentToPermanent,
    //         applyPermanentToCurrent: applyPermanentToCurrent
    //     });
    // }

    handleSetEditAccess = () => {
        hasEditAccess = true;
        return true;
    }

    handleShowManualReviewDetails = (index) => {
        let updatedServices = this.state.services;
        updatedServices[index].showDetails = !updatedServices[index].showDetails;
        this.setState({ services: updatedServices })
    }


    render() {
        const { t } = this.props;
        const { match } = this.props;
        let orgId = match.params.uuid;
        const url = "/customer-mgmt/org/" + orgId + "/config/bgv-map"
        let NotificationPan = (this.props.error) ?
            <div className={this.props.error ? cx(styles.ShowErrorNotificationCard, 'flex align-items-center') : cx(styles.HideErrorNotificationCard)}>
                <ErrorNotification error={this.props.error} />
            </div> :
            null

        let idCard = [], legalVerification = [], addressVerification = [],
            careerVerification = [], healthVerification = [], referenceVerification = [];

        this.state.services.map((service, serviceIndex) => {
            if (service.type === 'DOCUMENT') {
                return (
                    idCard = idCard.concat(
                        <div key={serviceIndex} className='row no-gutters mt-1 mb-2' >
                            <div style={{ width: "50%" }} className='d-flex align-self-center'>
                                <CustomRadioButton
                                    key={serviceIndex}
                                    label={service.label}
                                    icon={serviceCards[service.service].icon}
                                    className={cx('mx-2 mb-2', styles.tabs)}
                                    changed={() => this.handleToggleCheckBox(service, serviceIndex)}
                                    isSelected={service.isSelected}
                                    hasEditAccess={hasEditAccess}
                                />
                            </div>
                            <div className='d-flex' style={{ width: "50%", justifyContent: "flex-end" }}>
                                <div style={{ width: "10.5rem" }} className='px-0'>
                                    <div className='d-flex flex-row'>
                                        <div className={service.isSelected ? cx(styles.expiryDaysText, "text-nowrap mr-2") : cx(styles.expiryDisabledText, "text-nowrap mr-2")}>expiry days *</div>
                                        <Input
                                            name={service.service}
                                            className='p-2'
                                            label=""
                                            type='text'
                                            placeholder={service.isSelected ? null : '   --'}
                                            required={true}
                                            disabled={hasEditAccess ? (service.isSelected ? false : true) : true}
                                            value={service.isSelected ? service.validity : null}
                                            onChange={(value) => this.handleInputChange(value, service, serviceIndex)}
                                            validation={validation[service.service]}
                                            message={message[service.service]}
                                            errors={this.state.errors[service.service]}
                                            onError={(error) => this.handleError(error, service.service)}
                                        />
                                    </div>
                                </div>
                                <div className={cx('ml-4 px-0', styles.expiryText)}>
                                    <label className={service.isSelected ? service.verificationType === 'AUTO_TRIGGER' ? cx(styles.textColor, "text-nowrap") : null : cx(styles.disabledText, "text-nowrap")}>auto trigger</label>
                                    <input
                                        type='radio'
                                        className={styles.RadioButton}
                                        name={service.label}
                                        value="AUTO_TRIGGER"
                                        onChange={(event) => this.handleCheckbox(service, event, serviceIndex, "verificationType")}
                                        checked={service.verificationType === 'AUTO_TRIGGER' && service.isSelected}
                                    />
                                </div>
                                <div className={cx('ml-4 px-0 d-flex justify-content-end', styles.expiryText)}>
                                    <label className={service.isSelected ? service.verificationType === 'APPROVAL' ? cx(styles.textColor, "text-nowrap") : null : cx(styles.disabledText, "text-nowrap")}>approval</label>
                                    <input
                                        type='radio'
                                        className={styles.RadioButton}
                                        name={service.label}
                                        value="APPROVAL"
                                        onChange={(event) => this.handleCheckbox(service, event, serviceIndex, "verificationType")}
                                        checked={service.verificationType === 'APPROVAL' && service.isSelected}
                                    />
                                </div>
                            </div>
                        </div>
                    )
                )
            }
            else if (service.type === 'ADDRESS') {
                return (
                    addressVerification = addressVerification.concat(
                        <div key={serviceIndex} className='row no-gutters mt-1 mb-2' >
                            <div style={{ width: "50%" }} className='d-flex align-self-center'>
                                <CustomRadioButton
                                    key={serviceIndex}
                                    label={service.label}
                                    icon={serviceCards[service.service].icon}
                                    className={cx('mx-2 mb-2', styles.tabs)}
                                    changed={() => this.handleToggleCheckBox(service, serviceIndex)}
                                    isSelected={service.isSelected ? true : false}
                                    hasEditAccess={hasEditAccess}
                                />
                                {service.showDetails ?
                                    <span className={styles.viewDetails} onClick={() => this.handleShowManualReviewDetails(serviceIndex)}>
                                        <span className={styles.MediumSecondaryText}>hide details</span>
                                        <img className={cx(styles.invertDropdown, styles.marginLeft)} src={greyDropdown} alt="" />
                                    </span>
                                    :
                                    <span className={styles.viewDetails} onClick={service.isSelected ? () => this.handleShowManualReviewDetails(serviceIndex) : null}>
                                        <span className={service.isSelected ? styles.MediumSecondaryText : styles.MediumSecondaryDisabledText}>view details</span>
                                        <img className={service.isSelected ? styles.marginLeft : cx(styles.greyImage, styles.marginLeft)} src={greyDropdown} alt="" />
                                    </span>
                                }
                            </div>
                            <div className='d-flex' style={{ width: "50%", justifyContent: "flex-end" }}>
                                <div style={{ width: "10.5rem" }} className='px-0'>
                                    <div className='d-flex flex-row'>
                                        <div className={service.isSelected ? cx(styles.expiryDaysText, "text-nowrap mr-2") : cx(styles.expiryDisabledText, "text-nowrap mr-2")}>expiry days *</div>
                                        <Input
                                            name={service.service}
                                            className='p-2'
                                            label=""
                                            type='text'
                                            placeholder={service.isSelected ? null : '   --'}
                                            required={true}
                                            disabled={hasEditAccess ? (service.isSelected ? false : true) : true}
                                            value={service.isSelected ? service.validity : null}
                                            onChange={(value) => this.handleInputChange(value, service, serviceIndex)}
                                            validation={validation[service.service]}
                                            message={message[service.service]}
                                            errors={this.state.errors[service.service]}
                                            onError={(error) => this.handleError(error, service.service)}
                                        />
                                    </div>
                                </div>
                                <div className={cx('ml-4 px-0', styles.expiryText)}>
                                    <label className={service.isSelected ? service.verificationType === 'AUTO_TRIGGER' ? cx("text-nowrap", styles.textColor) : null : cx("text-nowrap", styles.disabledText)}>auto trigger</label>
                                    <input
                                        type='radio'
                                        className={styles.RadioButton}
                                        name={service.label}
                                        value="AUTO_TRIGGER"
                                        onChange={(event) => this.handleCheckbox(service, event, serviceIndex, "verificationType")}
                                        checked={service.verificationType === 'AUTO_TRIGGER' && service.isSelected}
                                    />
                                </div>
                                <div className={cx('ml-4 px-0 d-flex justify-content-end', styles.expiryText)}>
                                    <label className={service.isSelected ? service.verificationType === 'APPROVAL' ? cx("text-nowrap", styles.textColor) : null : cx("text-nowrap", styles.disabledText)}>approval</label>
                                    <input
                                        type='radio'
                                        className={styles.RadioButton}
                                        name={service.label}
                                        value="APPROVAL"
                                        onChange={(event) => this.handleCheckbox(service, event, serviceIndex, "verificationType")}
                                        checked={service.verificationType === 'APPROVAL' && service.isSelected}
                                    />
                                </div>
                            </div>
                            {service.showDetails ?
                                <div className={cx("d-flex", styles.box)}>
                                    <div>
                                        <div className={styles.expiryDaysText} >is manual address review needed ? </div>
                                        <div className="d-flex mt-3">
                                            <span className={cx('px-0', styles.expiryText)}>
                                                <input
                                                    type='radio'
                                                    className={styles.RadioButton}
                                                    name={service.label + "manualReview"}
                                                    value="YES"
                                                    disabled={!hasEditAccess}
                                                    onChange={(event) => this.handleCheckbox(service, event, serviceIndex, "addressManualReview")}
                                                    checked={service.addressManualReview === true}
                                                />
                                                <span className="ml-2">yes</span>
                                            </span>
                                            <span className={cx('ml-3 px-0', styles.expiryText)}>
                                                <input
                                                    type='radio'
                                                    className={styles.RadioButton}
                                                    name={service.label + "manualReview"}
                                                    value="NO"
                                                    disabled={!hasEditAccess}
                                                    onChange={(event) => this.handleCheckbox(service, event, serviceIndex, "addressManualReview")}
                                                    checked={service.addressManualReview === false}
                                                />
                                                <span className="ml-2">no</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ marginLeft: "3.5rem" }}>
                                        <div className={styles.expiryDaysText}>verification preference</div>
                                        <div className="d-flex mt-3">
                                            <span className={cx('px-0', styles.expiryText)}>
                                                <input
                                                    type='radio'
                                                    className={styles.RadioButton}
                                                    name={service.label + "verification_preference"}
                                                    value="POSTAL"
                                                    disabled={!hasEditAccess}
                                                    onChange={(event) => this.handleCheckbox(service, event, serviceIndex, "verificationPreference")}
                                                    checked={service.verificationPreference === "POSTAL"}
                                                />
                                                <span className="ml-2">postal</span>
                                            </span>
                                            <span className={cx('ml-3 px-0', styles.expiryText)}>
                                                <input
                                                    type='radio'
                                                    className={styles.RadioButton}
                                                    name={service.label + "verification_preference"}
                                                    value="PHYSICAL"
                                                    disabled={!hasEditAccess}
                                                    onChange={(event) => this.handleCheckbox(service, event, serviceIndex, "verificationPreference")}
                                                    checked={service.verificationPreference === "PHYSICAL"}
                                                />
                                                <span className="ml-2">physical</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                : null}
                        </div>
                    )
                )
            }
            else if (service.type === 'CAREER') {
                return (
                    careerVerification = careerVerification.concat(

                        <div key={serviceIndex} className='row no-gutters mt-1 mb-2' >
                            <div style={{ width: "50%" }} className='d-flex align-self-center'>
                                <CustomRadioButton
                                    key={serviceIndex}
                                    label={service.label}
                                    icon={serviceCards[service.service].icon}
                                    iconClassname={service.service === 'EMPLOYMENT' ? null : styles.legalIcon}
                                    className={cx('mx-2 mb-2', styles.address)}
                                    changed={() => this.handleToggleCheckBox(service, serviceIndex)}
                                    isSelected={service.isSelected}
                                    hasEditAccess={hasEditAccess}
                                />
                            </div>
                            <div className='d-flex' style={{ width: "50%", justifyContent: "flex-end" }}>
                                <div style={{ width: "10.5rem" }} className='px-0'>
                                    <div className='d-flex flex-row'>
                                        <div className={service.isSelected ? cx(styles.expiryDaysText, "text-nowrap mr-2") : cx(styles.expiryDisabledText, "text-nowrap mr-2")}>expiry days *</div>
                                        <Input
                                            name={service.service}
                                            className='p-2'
                                            label=""
                                            type='text'
                                            placeholder={service.isSelected ? null : '   --'}
                                            required={true}
                                            disabled={hasEditAccess ? (service.isSelected ? false : true) : true}
                                            value={service.isSelected ? service.validity : null}
                                            onChange={(value) => this.handleInputChange(value, service, serviceIndex)}
                                            validation={validation[service.service]}
                                            message={message[service.service]}
                                            errors={this.state.errors[service.service]}
                                            onError={(error) => this.handleError(error, service.service)}
                                        />
                                    </div>
                                </div>
                                <div className={cx('ml-4 px-0', styles.expiryText)}>
                                    <label className={service.isSelected ? service.verificationType === 'AUTO_TRIGGER' ? cx("text-nowrap", styles.textColor) : null : cx("text-nowrap", styles.disabledText)}>auto trigger</label>
                                    <input
                                        type='radio'
                                        className={styles.RadioButton}
                                        name={service.label}
                                        value="AUTO_TRIGGER"
                                        onChange={(event) => this.handleCheckbox(service, event, serviceIndex, "verificationType")}
                                        checked={service.verificationType === 'AUTO_TRIGGER' && service.isSelected}
                                    />
                                </div>
                                <div className={cx('ml-4 px-0 d-flex justify-content-end', styles.expiryText)}>
                                    <label className={service.isSelected ? service.verificationType === 'APPROVAL' ? cx("text-nowrap", styles.textColor) : null : cx("text-nowrap", styles.disabledText)}>approval</label>
                                    <input
                                        type='radio'
                                        className={styles.RadioButton}
                                        name={service.label}
                                        value="APPROVAL"
                                        onChange={(event) => this.handleCheckbox(service, event, serviceIndex, "verificationType")}
                                        checked={service.verificationType === 'APPROVAL' && service.isSelected}
                                    />
                                </div>
                            </div>
                        </div>
                    )
                )
            }
            else if (service.type === 'HEALTH') {
                return (
                    healthVerification = healthVerification.concat(

                        <div key={serviceIndex} className='row no-gutters mt-1 mb-2' >
                            <div style={{ width: "50%" }} className='d-flex align-self-center'>
                                <CustomRadioButton
                                    key={serviceIndex}
                                    label={service.label}
                                    icon={serviceCards[service.service].icon}
                                    iconClassname={styles.legalIcon}
                                    className={cx('mx-2 mb-2', styles.address)}
                                    changed={() => this.handleToggleCheckBox(service, serviceIndex)}
                                    isSelected={service.isSelected}
                                    hasEditAccess={hasEditAccess}
                                />
                            </div>
                            <div className='d-flex' style={{ width: "50%", justifyContent: "flex-end" }}>
                                <div style={{ width: "10.5rem" }} className='px-0'>
                                    <div className='d-flex flex-row'>
                                        <div className={service.isSelected ? cx(styles.expiryDaysText, "text-nowrap mr-2") : cx(styles.expiryDisabledText, "text-nowrap mr-2")}>expiry days *</div>
                                        <Input
                                            name={service.service}
                                            className='p-2'
                                            label=""
                                            type='text'
                                            placeholder={service.isSelected ? null : '   --'}
                                            required={true}
                                            disabled={hasEditAccess ? (service.isSelected ? false : true) : true}
                                            value={service.isSelected ? service.validity : null}
                                            onChange={(value) => this.handleInputChange(value, service, serviceIndex)}
                                            validation={validation[service.service]}
                                            message={message[service.service]}
                                            errors={this.state.errors[service.service]}
                                            onError={(error) => this.handleError(error, service.service)}
                                        />
                                    </div>
                                </div>
                                <div className={cx('ml-4 px-0', styles.expiryText)}>
                                    <label className={service.isSelected ? service.verificationType === 'AUTO_TRIGGER' ? cx("text-nowrap", styles.textColor) : null : cx("text-nowrap", styles.disabledText)}>auto trigger</label>
                                    <input
                                        type='radio'
                                        className={styles.RadioButton}
                                        name={service.label}
                                        value="AUTO_TRIGGER"
                                        onChange={(event) => this.handleCheckbox(service, event, serviceIndex, "verificationType")}
                                        checked={service.verificationType === 'AUTO_TRIGGER' && service.isSelected}
                                    />
                                </div>
                                <div className={cx('ml-4 px-0 d-flex justify-content-end', styles.expiryText)}>
                                    <label className={service.isSelected ? service.verificationType === 'APPROVAL' ? cx("text-nowrap", styles.textColor) : null : cx("text-nowrap", styles.disabledText)}>approval</label>
                                    <input
                                        type='radio'
                                        className={styles.RadioButton}
                                        name={service.label}
                                        value="APPROVAL"
                                        onChange={(event) => this.handleCheckbox(service, event, serviceIndex, "verificationType")}
                                        checked={service.verificationType === 'APPROVAL' && service.isSelected}
                                    />
                                </div>
                            </div>
                        </div>
                    )
                )
            }
            else if (service.type === 'REFERENCE') {
                return (
                    referenceVerification = referenceVerification.concat(
                        <div key={serviceIndex} className='row no-gutters mb-2' >
                            <div style={{ width: "50%" }} className='d-flex align-self-center'>
                                <CustomRadioButton
                                    key={serviceIndex}
                                    label={service.label}
                                    icon={serviceCards[service.service].icon}
                                    iconClassname={styles.legalIcon}
                                    className={cx('mx-2 mb-2', styles.address)}
                                    changed={() => this.handleToggleCheckBox(service, serviceIndex)}
                                    isSelected={service.isSelected}
                                    hasEditAccess={hasEditAccess}
                                />
                            </div>
                            <div className='d-flex' style={{ width: "50%", justifyContent: "flex-end" }}>
                                <div style={{ width: "10.5rem" }} className='px-0'>
                                    <div className='d-flex flex-row'>
                                        <div className={service.isSelected ? cx(styles.expiryDaysText, "text-nowrap mr-2") : cx(styles.expiryDisabledText, "text-nowrap mr-2")}>expiry days *</div>
                                        <Input
                                            name={service.service}
                                            className='p-2'
                                            label=""
                                            type='text'
                                            placeholder={service.isSelected ? null : '   --'}
                                            required={true}
                                            disabled={hasEditAccess ? (service.isSelected ? false : true) : true}
                                            value={service.isSelected ? service.validity : null}
                                            onChange={(value) => this.handleInputChange(value, service, serviceIndex)}
                                            validation={validation[service.service]}
                                            message={message[service.service]}
                                            errors={this.state.errors[service.service]}
                                            onError={(error) => this.handleError(error, service.service)}
                                        />
                                    </div>
                                </div>
                                <div className={cx('ml-4 px-0', styles.expiryText)}>
                                    <label className={service.isSelected ? service.verificationType === 'AUTO_TRIGGER' ? cx("text-nowrap", styles.textColor) : null : cx("text-nowrap", styles.disabledText)}>auto trigger</label>
                                    <input
                                        type='radio'
                                        className={styles.RadioButton}
                                        name={service.label}
                                        value="AUTO_TRIGGER"
                                        onChange={(event) => this.handleCheckbox(service, event, serviceIndex, "verificationType")}
                                        checked={service.verificationType === 'AUTO_TRIGGER' && service.isSelected}
                                    />
                                </div>
                                <div className={cx('ml-4 px-0 d-flex justify-content-end', styles.expiryText)}>
                                    <label className={service.isSelected ? service.verificationType === 'APPROVAL' ? cx("text-nowrap", styles.textColor) : null : cx("text-nowrap", styles.disabledText)}>approval</label>
                                    <input
                                        type='radio'
                                        className={styles.RadioButton}
                                        name={service.label}
                                        value="APPROVAL"
                                        onChange={(event) => this.handleCheckbox(service, event, serviceIndex, "verificationType")}
                                        checked={service.verificationType === 'APPROVAL' && service.isSelected}
                                    />
                                </div>
                            </div>
                        </div>
                    )
                )
            }
            else if (service.type === 'LEGAL') {
                return (
                    legalVerification = legalVerification.concat(
                        <div key={serviceIndex} className='row no-gutters mt-1 mb-2' >
                            <div style={{ width: "50%" }} className='d-flex align-self-center'>
                                <CustomRadioButton
                                    label={service.service === 'CRC_CURRENT_ADDRESS' || service.service === 'CRC_PERMANENT_ADDRESS' ? ('court verification - ' + service.label) : service.label}
                                    icon={serviceCards[service.service].icon}
                                    iconClassname={service.service === 'CRC_CURRENT_ADDRESS' || service.service === 'CRC_PERMANENT_ADDRESS' ? styles.legalIcon : null}
                                    className={service.service === 'CRC_CURRENT_ADDRESS' || service.service === 'CRC_PERMANENT_ADDRESS' ? cx('mx-2 mb-2', styles.legalVerifyWidth) : cx('mx-2 mb-2', styles.address)}
                                    changed={() => this.handleToggleCheckBox(service, serviceIndex)}
                                    isSelected={service.isSelected}
                                    hasEditAccess={hasEditAccess}
                                />
                            </div>
                            <div className='d-flex' style={{ width: "50%", justifyContent: "flex-end" }}>
                                <div style={{ width: "10.5rem" }} className='px-0'>
                                    <div className='d-flex flex-row'>
                                        <div className={service.isSelected ? cx(styles.expiryDaysText, "text-nowrap mr-2") : cx(styles.expiryDisabledText, "text-nowrap mr-2")}>expiry days *</div>
                                        <Input
                                            name={service.service}
                                            className='p-2'
                                            label=""
                                            type='text'
                                            placeholder={service.isSelected ? null : '   --'}
                                            required={true}
                                            disabled={hasEditAccess ? (service.isSelected ? false : true) : true}
                                            value={service.isSelected ? service.validity : null}
                                            onChange={(value) => this.handleInputChange(value, service, serviceIndex)}
                                            validation={validation[service.service]}
                                            message={message[service.service]}
                                            errors={this.state.errors[service.service]}
                                            onError={(error) => this.handleError(error, service.service)}
                                        />
                                    </div>
                                </div>
                                <div className={cx('ml-4 px-0', styles.expiryText)}>
                                    <label className={service.isSelected ? service.verificationType === 'AUTO_TRIGGER' ? cx("text-nowrap", styles.textColor) : null : cx("text-nowrap", styles.disabledText)}>auto trigger</label>
                                    <input
                                        type='radio'
                                        className={styles.RadioButton}
                                        name={service.service !== 'GLOBALDB' ? ('court verification - ' + service.label) : service.label}
                                        value="AUTO_TRIGGER"
                                        onChange={(event) => this.handleCheckbox(service, event, serviceIndex, "verificationType")}
                                        checked={service.verificationType === 'AUTO_TRIGGER' && service.isSelected}
                                    />
                                </div>
                                <div className={cx('ml-4 px-0 d-flex justify-content-end', styles.expiryText)}>
                                    <label className={service.isSelected ? service.verificationType === 'APPROVAL' ? cx("text-nowrap", styles.textColor) : null : cx("text-nowrap", styles.disabledText)}>approval</label>
                                    <input
                                        type='radio'
                                        className={styles.RadioButton}
                                        name={service.service !== 'GLOBALDB' ? ('court verification - ' + service.label) : service.label}
                                        value="APPROVAL"
                                        onChange={(event) => this.handleCheckbox(service, event, serviceIndex, "verificationType")}
                                        checked={service.verificationType === 'APPROVAL' && service.isSelected}
                                    />
                                </div>
                            </div>
                            {(_.isEqual(service.service, "CRC_PERMANENT_ADDRESS") && service.isSelected) ||
                                (_.isEqual(service.service, "CRC_CURRENT_ADDRESS") && service.isSelected) ?
                                <div className={cx("ml-3", styles.addressCheckBox)}>
                                    <CheckBox
                                        type="small"
                                        name={service.service + ' addressManualReview'}
                                        label={t('translation_orgBgvSelectService:label.l17')}
                                        value={service.addressManualReview}
                                        onChange={() => this.handleToggle(service.service, service.addressManualReview, 'addressManualReview')}
                                        disabled={!hasEditAccess}
                                        checkMarkStyle={styles.checkMarkStyle}
                                    />

                                </div> : null}

                        </div>
                        //                     {service.isSelected ?
                        //                         <React.Fragment>
                        //                             <div className='mr-2'>
                        //                                 <div className={cx(styles.DropDownContainer, 'd-flex flex-column')}>

                        //                                     <hr className={styles.dropdownHorizontalLine} />
                        //                                     <div className='flex-row pl-3'>
                        //                                         <CheckBox
                        //                                             small
                        //                                             name={service.service + service.type + 'civilCase'}
                        //                                             checked={service.service === "CRC_PERMANENT_ADDRESS" ? this.state.courtFieldsPermanent.includeCivilCases : this.state.courtFieldsCurrent.includeCivilCases}
                        //                                             changed={() => this.handleToggle(service.service, 'includeCivilCases')}
                        //                                             disabled={!this.state.hasEditAccess}
                        //                                         />
                        //                                         <label className={cx(styles.smallLabel, 'pl-3')}>{t('translation_orgBgvSelectService:label.l1')}</label>
                        //                                     </div>
                        //                                     <hr className={styles.dropdownHorizontalLine} />
                        //                                     <div className='flex-column pl-3'>
                        //                                         <label className={cx(styles.smallLabel, 'ml-0')}>{t('translation_orgBgvSelectService:label.l2')}</label>
                        //                                         <div className='d-flex flex-row'>
                        //                                             <input type='radio' className={styles.RadioButton} name={service.service === "CRC_PERMANENT_ADDRESS" ? 'permanentScope' : 'currentScope'}
                        //                                                 id={service.service === "CRC_PERMANENT_ADDRESS" ? 'permanentScope' : 'currentScope'} value='STATE_LEVEL'
                        //                                                 onChange={this.state.hasEditAccess ? () => this.handleToggle(service.service, 'searchScope') : null}
                        //                                                 checked={this.handleScopeChecked(service.service, 'STATE_LEVEL')}></input>
                        //                                             <label className={cx(styles.smallLabel, 'pl-2 pr-3')}>{t('translation_orgBgvSelectService:label.l3')}</label>

                        //                                             <input type='radio' className={styles.RadioButton} name={service.service === "CRC_PERMANENT_ADDRESS" ? 'permanentScope' : 'currentScope'}
                        //                                                 id={service.service === "CRC_PERMANENT_ADDRESS" ? 'permanentScope' : 'currentScope'} value='INDIA_LEVEL'
                        //                                                 onChange={this.state.hasEditAccess ? () => this.handleToggle(service.service, 'searchScope') : null}
                        //                                                 checked={this.handleScopeChecked(service.service, 'INDIA_LEVEL')}></input>
                        //                                             <label className={cx(styles.smallLabel, 'pl-2 pr-3')}>{t('translation_orgBgvSelectService:label.l4')}</label>
                        //                                         </div>
                        //                                     </div>
                        //                                     <hr className={styles.dropdownHorizontalLine} />
                        //                                     <div className='flex-row pl-3'>
                        //                                         <label className={styles.smallLabel}>{t('translation_orgBgvSelectService:label.l5')}</label><br />
                        //                                         <CheckBox
                        //                                             small
                        //                                             name={service.service + service.type + 'districtCourt'}
                        //                                             checked={service.service === "CRC_PERMANENT_ADDRESS" ? this.state.courtFieldsPermanent.DISTRICT : this.state.courtFieldsCurrent.DISTRICT}
                        //                                             changed={() => this.handleToggle(service.service, 'DISTRICT')}
                        //                                             disabled={!this.state.hasEditAccess}
                        //                                         />
                        //                                         <label className={cx(styles.smallLabel, 'pl-3')}>{t('translation_orgBgvSelectService:label.l6')}</label><br />
                        //                                         <CheckBox
                        //                                             small
                        //                                             name={service.service + service.type + 'highCourt'}
                        //                                             checked={service.service === "CRC_PERMANENT_ADDRESS" ? this.state.courtFieldsPermanent.HIGH : this.state.courtFieldsCurrent.HIGH}
                        //                                             changed={() => this.handleToggle(service.service, 'HIGH')}
                        //                                             disabled={!this.state.hasEditAccess}
                        //                                         />
                        //                                         <label className={cx(styles.smallLabel, 'pl-3')}>{t('translation_orgBgvSelectService:label.l7')}</label><br />
                        //                                         <CheckBox
                        //                                             small
                        //                                             name={service.service + service.type + 'supremeCourt'}
                        //                                             checked={service.service === "CRC_PERMANENT_ADDRESS" ? this.state.courtFieldsPermanent.SUPREME : this.state.courtFieldsCurrent.SUPREME}
                        //                                             changed={() => this.handleToggle(service.service, 'SUPREME')}
                        //                                             disabled={!this.state.hasEditAccess}
                        //                                         />
                        //                                         <label className={cx(styles.smallLabel, 'pl-3')}>{t('translation_orgBgvSelectService:label.l8')}</label><br />
                        //                                     </div>
                        //                                 </div>

                        //                             </div>

                        //                         </React.Fragment>
                        //                         : null}
                        //                 </div>
                        //                 <div className={service.isSelected ? 'flex-column' : styles.Hide}>
                        //                     <CheckBox
                        //                         small
                        //                         name={service.service + service.type + 'applySame'}
                        //                         checked={service.service === "CRC_PERMANENT_ADDRESS" ? this.state.applyPermanentToCurrent : this.state.applyCurrentToPermanent}
                        //                         changed={() => this.handleCopyCourtData(service)}
                        //                         disabled={!this.state.hasEditAccess}
                        //                     />
                        //                     <label className={cx(styles.smallLabel, 'pl-3')}>{t('translation_orgBgvSelectService:label.l9')}{service.service === 'CRC_PERMANENT_ADDRESS' ? 'current' : 'permanent'} {t('translation_orgBgvSelectService:label.l10')}</label><br />
                        //                 </div>
                        //             </div>

                    )
                )
            }
            else return null
        })
        return (
            <React.Fragment>
                {(this.props.postDataState === 'SUCCESS' || this.props.putDataState === 'SUCCESS') ?
                    <Redirect to={url} /> : null
                }
                {this.state.checkAccess ?
                    <HasAccess
                        permission={["BGV_CONFIG:CREATE"]}
                        orgId={orgId}
                        yes={() => this.handleSetEditAccess()}
                    />
                    : null}

                {this.props.getSelectedDataState === 'LOADING' || this.props.getDataServiceState === 'LOADING' ?
                    <div className={styles.alignCenter} style={{ marginTop: '3.2rem' }}>
                        <Loader />
                    </div> :


                    <div className={styles.alignCenter}>
                        <ArrowLink
                            label={_.isEmpty(this.props.orgData) ? " " : this.props.orgData.name}
                            url={`/customer-mgmt/org/` + orgId + `/profile`}
                        />
                        <CardHeader label={t('translation_orgBgvSelectService:cardheading')} iconSrc={bgv_service} />
                        <div className={cx(styles.CardLayout, 'card')}>
                            {NotificationPan}
                            <div className={cx(styles.CardPadding, 'card-body')}>
                                <div className="d-flex flex-column">
                                    {idCard.length !== 0 ?
                                        <label className={cx('ml-2 mb-3', styles.Label)}>{t('translation_orgBgvSelectService:label.l12')}</label> : null}
                                    <div className='flex-column mt-1' style={{ width: '100%' }}>
                                        {idCard}
                                    </div>
                                    <span className={styles.HorizontalLine} />
                                </div>

                                <div className="d-flex flex-column mt-4 pt-2">
                                    {addressVerification.length !== 0 ?
                                        <label className={cx('ml-2 mb-3', styles.Label)}>{t('translation_orgBgvSelectService:label.l13')}</label> : null}
                                    <div className='flex-column mt-1' style={{ width: '100%' }}>
                                        {addressVerification}
                                    </div>
                                    <span className={styles.HorizontalLine} />
                                </div>

                                <div className="d-flex flex-column mt-4 pt-2">
                                    {legalVerification.length !== 0 ?
                                        <label className={cx('ml-2 mb-3', styles.Label)}>{t('translation_orgBgvSelectService:label.l14')}</label> : null}
                                    <div className='flex-column mt-1' style={{ width: '100%' }}>
                                        {legalVerification}
                                    </div>

                                    <span className={styles.HorizontalLine} />

                                    <div className="d-flex flex-column mt-4 pt-2">
                                        {careerVerification.length !== 0 ?
                                            <label className={cx('ml-2 mb-3', styles.Label)}>{t('translation_orgBgvSelectService:label.l15')}</label> : null}
                                        <div className='flex-column mt-1'>
                                            {careerVerification}
                                        </div>
                                    </div>

                                    <span className={styles.HorizontalLine} />

                                    <div className="d-flex flex-column mt-4 pt-2">
                                        {healthVerification.length !== 0 ?
                                            <label className={cx('ml-2 mb-3', styles.Label)}>{t('translation_orgBgvSelectService:label.l16')}</label> : null}
                                        <div>
                                            <div className='flex-column mt-1' style={{ width: '100%' }}>
                                                {healthVerification}
                                            </div>

                                            <div className='flex-column mt-1' style={{ width: '100%' }}>
                                                {referenceVerification}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <hr className={styles.HorizontalLine} />

                                <Button
                                    label={t('translation_orgBgvSelectService:button_orgBgvSelectService.next')}
                                    className='float-right mt-2'
                                    type='save'
                                    isDisabled={!this.state.enableNext}
                                    clickHandler={this.handleNext}
                                />
                            </div>

                        </div>
                    </div >}
            </React.Fragment >

        );
    }
}

const mapStateToProps = state => {
    return {
        servicesId: state.orgMgmt.orgBgvConfig.selectService.servicesId,
        servicesData: state.orgMgmt.orgBgvConfig.configStatus.servicesData,
        data: state.orgMgmt.orgBgvConfig.selectService.data,
        selectedServiceData: state.orgMgmt.orgBgvConfig.selectService.selectedServiceData,
        getSelectedDataState: state.orgMgmt.orgBgvConfig.selectService.getSelectedDataState,
        postDataState: state.orgMgmt.orgBgvConfig.selectService.postDataState,
        getDataServiceState: state.orgMgmt.orgBgvConfig.selectService.getDataServiceState,
        putDataState: state.orgMgmt.orgBgvConfig.selectService.putDataState,
        error: state.orgMgmt.orgBgvConfig.selectService.error,
        rightnavOrgId: state.orgMgmt.staticData.rightnavOrgId,
        orgData: state.orgMgmt.staticData.orgData
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getSelectedServiceData: (orgId) => dispatch(actions.getSelectedServiceData(orgId)),
        initState: () => dispatch(actions.getInitState()),
        getServices: () => dispatch(actions.getServices()),
        onPutData: (data, orgId) => dispatch(actions.putData(data, orgId)),
        onPostData: (data, orgId) => dispatch(actions.postData(data, orgId)),
        getOrgData: (orgId) => dispatch(actionsOrgMgmt.getDataById(orgId))
    };
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(SelectService));