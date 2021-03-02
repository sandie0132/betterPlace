import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';

import cx from 'classnames';
import styles from './SelectService.module.scss';
import queryString from 'query-string';

import * as actions from './Store/action';
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
import bgvService from '../../../../../assets/icons/bgvService.svg';

import ArrowLink from '../../../../../components/Atom/ArrowLink/ArrowLink';
import { Button, Input } from 'react-crux';
import CardHeader from '../../../../../components/Atom/PageTitle/PageTitle';
import { validation, message } from './SelectServiceValidation';
import CheckBox from '../../../../../components/Atom/CheckBox/CheckBox';
import ErrorNotification from '../../../../../components/Organism/Notifications/ErrorNotification/ErrorNotification';
import CustomRadioButton from '../../../../../components/Molecule/CustomRadioButton/CustomRadioButton';
import Loader from '../../../../../components/Organism/Loader/BGVConfigServiceLoader/BGVConfigServiceLoader';
import VendorDropdown from '../../../../VendorSearch/VendorDropdown/VendorDropdown';
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

        if (prevState.services !== this.state.services) {
            this.handleAddServicesFunction(); //adding the selected services in the array
        }
        if (prevProps.getDataServiceState !== this.props.getDataServiceState && this.props.getDataServiceState === 'SUCCESS') {
            const { match, location } = this.props;
            
            let orgId = match.params.uuid;
            let params = queryString.parse(location.search);
            let from = '', to ='', viaUrl = '';
            if(!_.isEmpty(params.vendorId)) {
                if(!_.isEmpty(params.subVendorId)){
                    from = params.subVendorId;
                    to = orgId;
                    viaUrl = `vendorId=${params.vendorId}`;
                } else {
                    from = params.vendorId;
                    to = orgId;
                }
            } else if(!_.isEmpty(params.clientId)){
                if(!_.isEmpty(params.superClientId)){
                    from = orgId;
                    to = params.superClientId;
                    viaUrl = `clientId=${params.clientId}`;
                } else {
                    from = orgId;
                    to = params.clientId;
                }
                
            }
            this.handleAllServicesToState(); //adding isSelected value to services.
            this.props.getSelectedServiceData(orgId, from, to, viaUrl); //getting the selected services.
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

        if(this.props.location.search !== prevProps.location.search) {
            const { match, location } = this.props;
            let orgId = match.params.uuid;
            let params = queryString.parse(location.search);
            let from = '', to ='', viaUrl = '';
            if(!_.isEmpty(params.vendorId)) {
                if(!_.isEmpty(params.subVendorId)){
                    from = params.subVendorId;
                    to = orgId;
                    viaUrl = 'vendorId='+params.vendorId;
                } else {
                    from = params.vendorId;
                    to = orgId;
                }
            } else if(!_.isEmpty(params.clientId)){
                if(!_.isEmpty(params.superClientId)){
                    from = orgId;
                    to = params.superClientId;
                    viaUrl = `clientId=${params.clientId}`;
                } else {
                    from = orgId;
                    to = params.clientId;
                }
            }
            this.handleAllServicesToState();
            this.props.getSelectedServiceData(orgId, from, to, viaUrl); //getting the selected services.
        }
    }

    componentWillUnmount() {
        this.props.initState();
    }

    handleAddServicesFunction = () => {
        let data;
        let updatedServices = this.state.selectedServiceData;
        _.forEach(this.state.services, function (service) {
            if (service.type === 'LEGAL') {
                if (service.service === "CRC_CURRENT_ADDRESS" || service.service === "CRC_PERMANENT_ADDRESS") {
                    data = {
                        'service': service.service,
                        'type': service.type,
                        'validity': service.validity,
                        'verificationType': service.verificationType,
                        'addressManualReview': service.addressManualReview
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
                            serviceData.validity = data.validity
                            serviceData.verificationType = data.verificationType
                            if (serviceData.service === "CRC_CURRENT_ADDRESS" || serviceData.service === "CCR_PERMANENT_ADDRESS") {
                                serviceData.addressManualReview = data.addressManualReview
                            }
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
        let updatedServices = _.cloneDeep(this.state.services);
        
        if(!_.isEmpty(this.props.selectedServiceData)){
            let selectedServices = this.props.selectedServiceData.servicesEnabled;
            
            _.forEach(updatedServices, function (service) {
                service.isSelected = false;
                if (service.type === "LEGAL") {
                    if (service.service === "CRC_CURRENT_ADDRESS" || service.service === "CRC_PERMANENT_ADDRESS") {
                        service.addressManualReview = false;
                    }
                }
                if (service.type === "ADDRESS") {
                    service.showDetails = false;
                    service.addressManualReview = false;
                }
                _.forEach(selectedServices, function (selectedService) {
                    if (service.service === selectedService.service && service.type === selectedService.type) {
                        service.isSelected = true;
                        service.validity = selectedService.validity;
                        service.verificationType = selectedService.verificationType

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
            if (!_.isEmpty(selectedServices)) {
                this.setState({ enableNext: true })
            }
           
        } else {
            _.forEach(updatedServices, function (service) {
                service.isSelected = false;
                if (service.type === "LEGAL") {
                    if (service.service === "CRC_CURRENT_ADDRESS" || service.service === "CRC_PERMANENT_ADDRESS") {
                        service.addressManualReview = false;
                    }
                }
                if (service.type === "ADDRESS") {
                    service.showDetails = false;
                    service.addressManualReview = false;
                }
            });
        }
         this.setState({ services: updatedServices });
    }

    handleAllServicesToState = () => {
        let getServices = _.cloneDeep(this.props.servicesData)
        getServices = getServices.map(service => {
            if (service.type === 'LEGAL')
                return ({
                    ...service,
                    isSelected: false,
                    validity: "",
                    verificationType: "",
                    addressManualReview: false
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
        const { match, location } = this.props;
        let orgId = match.params.uuid;
        let params = queryString.parse(location.search);
        let from = '', to ='', viaUrl = '';
        if(!_.isEmpty(params.vendorId)) {
            if(!_.isEmpty(params.subVendorId)){
                from = params.subVendorId;
                to = orgId;
                viaUrl = 'vendorId='+params.vendorId;
            } else {
                from = params.vendorId;
                to = orgId;
            }
        } else if(!_.isEmpty(params.clientId)){
            if(!_.isEmpty(params.superClientId)){
                from = orgId;
                to = params.superClientId;
                viaUrl = `clientId=${params.clientId}`;
            } else {
                from = orgId;
                to = params.clientId;
            }
        }

        let status = 'inProgress';
        if (this.props.selectedServiceData && this.props.selectedServiceData.status) {
            status = this.props.selectedServiceData.status === 'done' ? 'done' : status;
        }
        let payload = {
            servicesEnabled: this.state.selectedServiceData,
            status: status
        }
        this.props.onPostData(payload, orgId, from, to, viaUrl);
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
        }
        else if (type === "addressManualReview") {
            updatedServices[index].addressManualReview = event.target.value === "YES" ? true : false;
        }
        else if (type === "verificationPreference") {
            updatedServices[index].verificationPreference = event.target.value;
        }
        _.forEach(updatedSelectedServiceData, function (service) {
            if (service.type === targetService.type && service.service === targetService.service) {
                if (type === "verificationType") {
                    service.verificationType = event.target.value;
                }
                else if (type === "addressManualReview") {
                    service.addressManualReview = event.target.value === "YES" ? true : false;
                }
                else if (type === "verificationPreference") {
                    service.verificationPreference = event.target.value;
                }
            }
            if (_.isEmpty(service.validity) || (isNaN(service.validity) && service.verificationType)) {
                enableNext = false;
            }
        })
        this.setState({ services: updatedServices, selectedServiceData: updatedSelectedServiceData, enableNext: enableNext })
    }

    handleCRCToggle = (targetService, index, inputIdentifier) => {
        let updatedServices = _.cloneDeep(this.state.services);
        let updatedSelectedServiceData = _.cloneDeep(this.state.selectedServiceData);

        updatedServices[index][inputIdentifier] = !updatedServices[index][inputIdentifier];

        _.forEach(updatedSelectedServiceData, function (service) {
            if (service.type === targetService.type && service.service === targetService.service) {
                service[inputIdentifier] = !service[inputIdentifier];
            }
        });
        this.setState({ services: updatedServices, selectedServiceData: updatedSelectedServiceData })
    }

    handleSetEditAccess = () => {
        hasEditAccess = true;
        return true;
    }

    handleShowManualReviewDetails = (index) => {
        let updatedServices = this.state.services;
        updatedServices[index].showDetails = !updatedServices[index].showDetails;
        this.setState({ services: updatedServices })
    }

    handleShowVendorDropDown = () => {
        let showVendorDropDown = false;
        if(!_.isEmpty(this.props.enabledServices) && !_.isEmpty(this.props.enabledServices.platformServices)){
            _.forEach(this.props.enabledServices.platformServices, function(service){
                if(service.platformService === 'VENDOR') showVendorDropDown = true;
            })
        }
        return showVendorDropDown;
    }


    render() {
        const { t } = this.props;
        const { match, location} = this.props;
        let params = queryString.parse(location.search);
        let orgId = match.params.uuid;
        let url = "/customer-mgmt/org/" + orgId + "/config/bgv-map";
        if(!_.isEmpty(params)){
            url += location.search;
        }
        const showVendorDropDown = this.handleShowVendorDropDown();
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
                                        <div className={service.isSelected ? cx(styles.expiryDaysText, "text-nowrap mr-2") : cx(styles.expiryDisabledText, "text-nowrap mr-2")}>
                                            {t('translation_orgBgvSelectService:label.expiryDays')}</div>
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
                                    <label className={service.isSelected ? service.verificationType === 'AUTO_TRIGGER' ? cx(styles.textColor, "text-nowrap") : "text-nowrap" : cx(styles.disabledText, "text-nowrap")}>
                                        {t('translation_orgBgvSelectService:label.autoTrigger')}</label>
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
                                    <label className={service.isSelected ? service.verificationType === 'APPROVAL' ? cx(styles.textColor, "text-nowrap") : "text-nowrap" : cx(styles.disabledText, "text-nowrap")}>
                                        {t('translation_orgBgvSelectService:label.approval')}</label>
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
                                        <span className={styles.MediumSecondaryText}>{t('translation_orgBgvSelectService:label.hideDetails')}</span>
                                        <img className={cx(styles.invertDropdown, styles.marginLeft)} src={greyDropdown} alt="" />
                                    </span>
                                    :
                                    <span className={styles.viewDetails} onClick={service.isSelected ? () => this.handleShowManualReviewDetails(serviceIndex) : null}>
                                        <span className={service.isSelected ? styles.MediumSecondaryText : styles.MediumSecondaryDisabledText}>{t('translation_orgBgvSelectService:label.viewDetails')}</span>
                                        <img className={service.isSelected ? styles.marginLeft : cx(styles.greyImage, styles.marginLeft)} src={greyDropdown} alt="" />
                                    </span>
                                }
                            </div>
                            <div className='d-flex' style={{ width: "50%", justifyContent: "flex-end" }}>
                                <div style={{ width: "10.5rem" }} className='px-0'>
                                    <div className='d-flex flex-row'>
                                        <div className={service.isSelected ? cx(styles.expiryDaysText, "text-nowrap mr-2") : cx(styles.expiryDisabledText, "text-nowrap mr-2")}>
                                            {t('translation_orgBgvSelectService:label.expiryDays')}</div>
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
                                    <label className={service.isSelected ? service.verificationType === 'AUTO_TRIGGER' ? cx("text-nowrap", styles.textColor) : "text-nowrap" : cx("text-nowrap", styles.disabledText)}>
                                        {t('translation_orgBgvSelectService:label.autoTrigger')}</label>
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
                                    <label className={service.isSelected ? service.verificationType === 'APPROVAL' ? cx("text-nowrap", styles.textColor) : "text-nowrap" : cx("text-nowrap", styles.disabledText)}>
                                        {t('translation_orgBgvSelectService:label.approval')}</label>
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
                                        <div className={styles.expiryDaysText} >{t('translation_orgBgvSelectService:label.manualReview')}</div>
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
                                                <span className="ml-2">{t('translation_orgBgvSelectService:label.yes')}</span>
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
                                                <span className="ml-2">{t('translation_orgBgvSelectService:label.no')}</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ marginLeft: "3.5rem" }}>
                                        <div className={styles.expiryDaysText}>{t('translation_orgBgvSelectService:label.verificationPref')}</div>
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
                                                <span className="ml-2">{t('translation_orgBgvSelectService:label.postal')}</span>
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
                                                <span className="ml-2">{t('translation_orgBgvSelectService:label.physical')}</span>
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
                                        <div className={service.isSelected ? cx(styles.expiryDaysText, "text-nowrap mr-2") : cx(styles.expiryDisabledText, "text-nowrap mr-2")}>
                                            {t('translation_orgBgvSelectService:label.expiryDays')}</div>
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
                                    <label className={service.isSelected ? service.verificationType === 'AUTO_TRIGGER' ? cx("text-nowrap", styles.textColor) : "text-nowrap" : cx("text-nowrap", styles.disabledText)}>
                                        {t('translation_orgBgvSelectService:label.autoTrigger')}</label>
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
                                    <label className={service.isSelected ? service.verificationType === 'APPROVAL' ? cx("text-nowrap", styles.textColor) : "text-nowrap" : cx("text-nowrap", styles.disabledText)}>
                                        {t('translation_orgBgvSelectService:label.approval')}</label>
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
                                        <div className={service.isSelected ? cx(styles.expiryDaysText, "text-nowrap mr-2") : cx(styles.expiryDisabledText, "text-nowrap mr-2")}>
                                            {t('translation_orgBgvSelectService:label.expiryDays')}</div>
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
                                    <label className={service.isSelected ? service.verificationType === 'AUTO_TRIGGER' ? cx("text-nowrap", styles.textColor) : "text-nowrap" : cx("text-nowrap", styles.disabledText)}>
                                        {t('translation_orgBgvSelectService:label.autoTrigger')}</label>
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
                                    <label className={service.isSelected ? service.verificationType === 'APPROVAL' ? cx("text-nowrap", styles.textColor) : "text-nowrap" : cx("text-nowrap", styles.disabledText)}>
                                        {t('translation_orgBgvSelectService:label.approval')}</label>
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
                                        <div className={service.isSelected ? cx(styles.expiryDaysText, "text-nowrap mr-2") : cx(styles.expiryDisabledText, "text-nowrap mr-2")}>
                                            {t('translation_orgBgvSelectService:label.expiryDays')}</div>
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
                                    <label className={service.isSelected ? service.verificationType === 'AUTO_TRIGGER' ? cx("text-nowrap", styles.textColor) : "text-nowrap" : cx("text-nowrap", styles.disabledText)}>
                                        {t('translation_orgBgvSelectService:label.autoTrigger')}</label>
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
                                    <label className={service.isSelected ? service.verificationType === 'APPROVAL' ? cx("text-nowrap", styles.textColor) : "text-nowrap" : cx("text-nowrap", styles.disabledText)}>
                                        {t('translation_orgBgvSelectService:label.approval')}</label>
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
                                    label={serviceCards[service.service].label}
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
                                        <div className={service.isSelected ? cx(styles.expiryDaysText, "text-nowrap mr-2") : cx(styles.expiryDisabledText, "text-nowrap mr-2")}>
                                            {t('translation_orgBgvSelectService:label.expiryDays')}</div>
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
                                    <label className={service.isSelected ? service.verificationType === 'AUTO_TRIGGER' ? cx("text-nowrap", styles.textColor) : "text-nowrap" : cx("text-nowrap", styles.disabledText)}>
                                        {t('translation_orgBgvSelectService:label.autoTrigger')}</label>
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
                                    <label className={service.isSelected ? service.verificationType === 'APPROVAL' ? cx("text-nowrap", styles.textColor) : "text-nowrap" : cx("text-nowrap", styles.disabledText)}>
                                        {t('translation_orgBgvSelectService:label.approval')}</label>
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
                                        name={service.service}
                                        label={t('translation_orgBgvSelectService:label.l17')}
                                        value={service.addressManualReview}
                                        onChange={() => this.handleCRCToggle(service, serviceIndex, 'addressManualReview')}
                                        disabled={!hasEditAccess}
                                        checkMarkStyle={styles.checkMarkStyle}
                                    />
                                </div>
                                : null}
                        </div>
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
                            label={_.isEmpty(this.props.orgData) ? " " : this.props.orgData.name.toLowerCase()}
                            url={`/customer-mgmt/org/` + orgId + `/profile`}
                        />
                        <div className="d-flex">
                            <CardHeader label={t('translation_orgBgvSelectService:cardheading')} iconSrc={bgvService} />
                            <div className={cx("ml-auto mr-3",styles.paddingY)}>
                                {showVendorDropDown && <VendorDropdown type="primary"/>}
                            </div>
                            <div className={cx(styles.paddingY)}>
                                {showVendorDropDown && <VendorDropdown type="secondary"/>}
                            </div>
                        </div>
                        <div className={cx(styles.CardLayout, 'card')}>
                            {NotificationPan}
                            <div className={cx(styles.CardPadding, 'card-body')} disabled={!_.isEmpty(params.vendorId)}>
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
                    </div>}
            </React.Fragment>

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
        orgData: state.orgMgmt.staticData.orgData,
        enabledServices: state.orgMgmt.staticData.servicesEnabled,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getSelectedServiceData: (orgId, from, to, viaUrl) => dispatch(actions.getSelectedServiceData(orgId, from, to, viaUrl)),
        initState: () => dispatch(actions.getInitState()),
        getServices: () => dispatch(actions.getServices()),
        // onPutData: (data, orgId) => dispatch(actions.putData(data, orgId)),
        onPostData: (data, orgId, from, to, viaUrl) => dispatch(actions.postData(data, orgId, from, to, viaUrl)),
        getOrgData: (orgId) => dispatch(actionsOrgMgmt.getDataById(orgId))
    };
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(SelectService));