import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';
import cx from 'classnames';
import styles from './TatMapping.module.scss';
import queryString from 'query-string';

import * as actions from './Store/action';
import * as actionsOrgMgmt from '../../OrgMgmtStore/action';

import CardHeader from '../../../../../components/Atom/PageTitle/PageTitle';
import CustomSelect from '../../../../../components/Atom/CustomSelect/CustomSelect';
import {Input, Button} from 'react-crux';
import { validation, message } from './TatValidation';
import ArrowLink from '../../../../../components/Atom/ArrowLink/ArrowLink';
import ErrorNotification from '../../../../../components/Organism/Notifications/ErrorNotification/ErrorNotification';
import Loader from '../../../../../components/Organism/Loader/BGVConfigServiceLoader/BGVConfigServiceLoader';
import VendorDropdown from '../../../../VendorSearch/VendorDropdown/VendorDropdown';

import bgvConfMap from '../../../../../assets/icons/bgvConfMap.svg';
import panConfigIcon from '../../../../../assets/icons/panConfigIcon.svg';
import voterConfigIcon from '../../../../../assets/icons/voterConfigIcon.svg';
import aadhaarConfigIcon from '../../../../../assets/icons/aadhaarConfigIcon.svg';
import permanentaddressConfigIcon from '../../../../../assets/icons/permanentaddressConfigIcon.svg';
import currentAddressConfigIcon from '../../../../../assets/icons/currentAddressConfigIcon.svg';
import drivingLicenseConfigIcon from '../../../../../assets/icons/drivingLicenseConfigIcon.svg';
import globalDb from '../../../../../assets/icons/databaseWithBackground.svg';
import educationConfigIcon from '../../../../../assets/icons/educationConfigIcon.svg';
import employmentConfigIcon from '../../../../../assets/icons/employmentConfigIcon.svg';
import healthConfigIcon from '../../../../../assets/icons/healthConfigIcon.svg';
import refConfigIcon from '../../../../../assets/icons/refConfigIcon.svg';
import courtSmallIcon from '../../../../../assets/icons/courtConfigIcon.svg';
import vehicleregistrationConfigIcon from '../../../../../assets/icons/rcConfigIcon.svg';
import policeVerificationConfigIcon from '../../../../../assets/icons/policeConfigIcon.svg';

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

    "CRC_CURRENT_ADDRESS": { icon: courtSmallIcon, label: "current address" },
    "CRC_PERMANENT_ADDRESS": { icon: courtSmallIcon, label: "permanent address" },
    "POLICE_VERIFICATION": { icon: policeVerificationConfigIcon, label: "police verification" },
    "GLOBALDB": { icon: globalDb, label: "database verification" },
    "PHYSICAL": {icon: globalDb, label: "physical verification"},
    "POSTAL": {icon: globalDb, label: "postal verification"},

    "EDUCATION": { icon: educationConfigIcon, label: "education verification" },
    "EMPLOYMENT": { icon: employmentConfigIcon, label: "employment verification" },

    "HEALTH": { icon: healthConfigIcon, label: "health check verification" },
    "REFERENCE": { icon: refConfigIcon, label: "reference verification" }
}

let hasEditAccess = false;

class TatMapping extends Component {
    state = {
        enableNext: false,
        TatArray: [],
        checkAccess: true,
        errors: {}
    }

    componentDidMount = () => {
        const { match, location } = this.props;
        
        const orgId = match.params.uuid;
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
        this.setState({ enableNext: true })
        this.props.getServiceData(orgId, from, to, viaUrl);
        if (_.isEmpty(this.props.orgData) && orgId) {
            this.props.getOrgData(orgId)
        }
        if (orgId !== this.props.rightnavOrgId) {
            this.props.getOrgData(orgId)
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.getDataState !== this.props.getDataState) {
            if (this.props.getDataState === 'SUCCESS') {
                this.handlePropsToState();
            }
        }
        if (!_.isEqual(this.state.TatArray, prevState.TatArray)) {
            this.handleCheckError()
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
            this.props.getServiceData(orgId, from, to, viaUrl);
        }
    }

    componentWillUnmount() {
        this.props.initState();
    }

    handlePropsToState = () => {
        let getSelectedServices = [];
        let servicesEnabled = this.props.data.servicesEnabled;
        if(!_.isEmpty(servicesEnabled)) {
            if (this.props.data.tatMappedServices === undefined) {
                getSelectedServices = _.cloneDeep(this.props.data.servicesEnabled)
                getSelectedServices = getSelectedServices.map(service => {
                    return ({
                        ...service,
                        tat: '',
                        tatUnit: 'DAYS'
                    })
                })
            }
            else {
                getSelectedServices = _.cloneDeep(this.props.data.servicesEnabled);
                let getPostedServices = _.cloneDeep(this.props.data.tatMappedServices)
                getSelectedServices = getSelectedServices.map(service => {
                    let isServicePosted = false;
                    let data;
                    _.forEach(getPostedServices, function (postedService) {
                        if (postedService.service === service.service && postedService.type === service.type) {
                            isServicePosted = true;
                            data = postedService
                        }
                    })
                    if (isServicePosted)
                        return data;
                    else {
                        return ({
                            ...service,
                            tat: '',
                            tatUnit: 'DAYS'
                        })
                    }
                })
            }
            this.setState({ TatArray: getSelectedServices })
        } else {
            const { match, location } = this.props;
            let params = queryString.parse(location.search);
            const orgId = match.params.uuid;
            let url = '/customer-mgmt/org/' + orgId + '/config/bgv-select';
            if(!_.isEmpty(params)){
                url += location.search;
            }
            this.props.history.push(url);
        }
    }

    handleCheckError = () => {
        let thisRef = this;
        let emptyCheck = false
        _.forEach(this.state.TatArray, function (tat) {
            let numbers = /^[0-9]+$/;
            if (_.isEmpty(tat.tat) || _.isEmpty(tat.tatUnit) || !(tat.tat.match(numbers))) {
                thisRef.setState({ enableNext: false })
                emptyCheck = true;
            }
        })

        if (!emptyCheck) {

            let updatedEnableSubmit = true;
            if (this.state.enableNext !== updatedEnableSubmit) {
                this.setState({ enableNext: updatedEnableSubmit })
            }

        }
    }

    handleInputChange = (value, inputIdentifier, index) => {

        let updatedTatArray = _.cloneDeep(this.state.TatArray)
        if (inputIdentifier === 'tat') {
            updatedTatArray[index].tat = value;
        }
        else if (inputIdentifier === 'tatUnit') {
            updatedTatArray[index].tatUnit = value;
        }
        this.setState({ TatArray: updatedTatArray });
    };

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

        let status = 'inProgress'
        if (this.props.data && this.props.data.status) {
            status = this.props.data.status === 'done' ? 'done' : status;
        }
        let postData = { tatMappedServices: this.state.TatArray, status: status }
        this.props.onPostData(postData, orgId, from, to, viaUrl);
    }

    handleLabel = (type) => {
        let label = null;
        _.forEach(this.props.servicesData, function (data) {
            if (data.service === type) label = data.label;
        })
        return label;
    }

    handleSetEditAccess = () => {
        hasEditAccess = true;
        return true
    }

    checkManualReview = (service, form) => {
        let data = _.cloneDeep(this.props.data.servicesEnabled);
        if(!_.isEmpty(data)){
            let selected = data.filter(function (serviceEnable) {
                return serviceEnable.service === service
            })
            if(!_.isEmpty(selected)){
                if (form.type === 'LEGAL' && selected[0].addressManualReview) {
                    return "address review + ";
                }
                else if (form.type === 'ADDRESS' && selected[0].addressManualReview) {
                    return "address review + " + serviceCards[selected[0].verificationPreference]['label'];
                }
                else if (form.type === 'ADDRESS' && !selected[0].addressManualReview) {
                    return serviceCards[selected[0].verificationPreference]['label'];
                }
                else return null
            } else return '';
        }
        return '';
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
        const { match, location } = this.props;
        let params = queryString.parse(location.search);
        let orgId = match.params.uuid;
        let url = "/customer-mgmt/org/" + orgId + "/config/bgv-bpspoc"
        if(!_.isEmpty(params)){
            url += location.search;
        }
        const showVendorDropDown = this.handleShowVendorDropDown();
        let NotificationPan = (this.props.error) ?
            <div className={this.props.error ? cx(styles.ShowErrorNotificationCard, 'flex align-items-center') : cx(styles.HideErrorNotificationCard)}>
                <ErrorNotification error={this.props.error} />
            </div> :
            null

        let idCards = [], addressVerification = [], legalVerification = [], healthVerification = [], careerVerification = [], referenceVerification = [];
        if (this.props.data.length !== 0) {
            this.state.TatArray.map((item, index) => {
                if (item.type === 'DOCUMENT') {
                    return (
                        idCards = idCards.concat(
                            <div key={index} className='row'>
                                <div className="col-6 mt-0 ml-3 d-flex flex-row">
                                    <img alt={t('translation_orgBgvTatMapping:image_alt_orgBgvTatMapping.IdIcon')} src={serviceCards[item.service].icon} className={cx(styles.serviceIcon, 'my-auto')} />
                                    <label className={styles.Options}>{serviceCards[item.service].label} </label>
                                </div>
                                <div className='row col-6'>
                                    <Input
                                        name={item.service + "_" + item.type + "_TAT"}
                                        className='col-3 mr-5 pr-4'
                                        label=""
                                        type='text'
                                        placeholder=""
                                        required={true}
                                        disabled={!hasEditAccess}
                                        value={item.tat}
                                        onChange={(value) => this.handleInputChange(value, "tat", index)}
                                        validation={validation[item.service + "_" + item.type + "_TAT"]}
                                        message={message[item.service + "_" + item.type + "_TAT"]}
                                        errors={this.state.errors[item.service + "_" + item.type + "_TAT"]}
                                        onError={(error) => this.handleError(error, item.service + "_" + item.type + "_TAT")}
                                    />
                                    <CustomSelect
                                        name={item.service + item.type + 'tatUnit'}
                                        className={cx('col-6', styles.TatUnit)}
                                        label=""
                                        required={true}
                                        disabled={!hasEditAccess}
                                        options={this.props.tatUnit}
                                        value={item.tatUnit}
                                        onChange={(value) => this.handleInputChange(value, "tatUnit", index)}
                                    />
                                </div>
                            </div>)
                    );
                }
                else if (item.type === 'ADDRESS') {
                    return (
                        addressVerification = addressVerification.concat(
                            <div key={index} className='row'>
                                <div className="col-6 mt-0 ml-3 d-flex flex-row">
                                    <img alt={t('translation_orgBgvTatMapping:image_alt_orgBgvTatMapping.IdIcon')} src={serviceCards[item.service].icon} className={cx(styles.serviceIcon, 'my-auto')} />
                                    <div className={cx(styles.PaddingLeft)}>
                                        <div className='d-flex flex-column'><label className={styles.SubHeading}>{serviceCards[item.service].label}</label>
                                            <span className={styles.OptionWithHeading}>{this.checkManualReview(item.service, item)} </span>
                                        </div>
                                    </div>
                                </div>
                                <div className='row col-6'>
                                    <Input
                                        name={item.service + "_" + item.type + "_TAT"}
                                        className='col-3 mr-5 pr-4'
                                        label=""
                                        type='text'
                                        placeholder=""
                                        required={true}
                                        disabled={!hasEditAccess}
                                        value={item.tat}
                                        onChange={(value) => this.handleInputChange(value, "tat", index)}
                                        validation={validation[item.service + "_" + item.type + "_TAT"]}
                                        message={message[item.service + "_" + item.type + "_TAT"]}
                                        errors={this.state.errors[item.service + "_" + item.type + "_TAT"]}
                                        onError={(error) => this.handleError(error, item.service + "_" + item.type + "_TAT")}
                                    />
                                    <CustomSelect
                                        name={item.service + item.type + 'tatUnit'}
                                        className={cx('col-6', styles.TatUnit)}
                                        label=""
                                        required={true}
                                        disabled={!hasEditAccess}
                                        options={this.props.tatUnit}
                                        value={item.tatUnit}
                                        onChange={(value) => this.handleInputChange(value, "tatUnit", index)}
                                    />
                                </div>
                            </div>
                        )
                    )
                }
                else if (item.type === 'LEGAL') {
                    return (
                        legalVerification = legalVerification.concat(
                            <div key={index} className='row'>
                                <div className="col-6 mt-0 ml-3 d-flex flex-row">
                                    <img alt={t('translation_orgBgvTatMapping:image_alt_orgBgvTatMapping.IdIcon')} src={serviceCards[item.service].icon} className={cx(styles.serviceIcon, 'my-auto')} />
                                    {item.service === 'CRC_CURRENT_ADDRESS' || item.service === 'CRC_PERMANENT_ADDRESS' ?
                                        <div className={cx(styles.PaddingLeft, 'd-flex flex-column')}>
                                            <div>
                                                <label className={styles.SubHeading}>{t('translation_orgBgvTatMapping:label.l9')}</label>
                                                <span className={styles.smallLabel}> - {serviceCards[item.service].label}</span>
                                                <span className={styles.OptionWithHeading}>{this.checkManualReview(item.service, item)} {t('translation_orgBgvTatMapping:label.l10')} </span>
                                            </div>
                                        </div>
                                        :
                                        <div className='d-flex flex-column'>
                                            <span className={styles.Options}>{serviceCards[item.service].label}</span>
                                        </div>}
                                </div>
                                <div className='row col-6'>
                                    <Input
                                        name={item.service + "_" + item.type + "_TAT"}
                                        className='col-3 mr-5 pr-4'
                                        label=""
                                        type='text'
                                        placeholder=""
                                        required={true}
                                        disabled={!hasEditAccess}
                                        value={item.tat}
                                        onChange={(value) => this.handleInputChange(value, "tat", index)}
                                        validation={validation[item.service + "_" + item.type + "_TAT"]}
                                        message={message[item.service + "_" + item.type + "_TAT"]}
                                        errors={this.state.errors[item.service + "_" + item.type + "_TAT"]}
                                        onError={(error) => this.handleError(error, item.service + "_" + item.type + "_TAT")}
                                    />
                                    <CustomSelect
                                        name={item.service + item.type + 'tatUnit'}
                                        className={cx('col-6', styles.TatUnit)}
                                        label=""
                                        required={true}
                                        disabled={!hasEditAccess}
                                        options={this.props.tatUnit}
                                        value={item.tatUnit}
                                        onChange={(value) => this.handleInputChange(value, "tatUnit", index)}
                                    />
                                </div>
                            </div>)
                    );
                }
                else if (item.type === 'CAREER') {
                    return (
                        careerVerification = careerVerification.concat(
                            <div key={index} className='row'>
                                <div className="col-6 mt-0 ml-3 d-flex flex-row">
                                    <img alt={t('translation_orgBgvTatMapping:image_alt_orgBgvTatMapping.IdIcon')} src={serviceCards[item.service].icon} className={cx(styles.serviceIcon, 'my-auto')} />
                                    <div className={cx('d-flex flex-column')}>
                                        <label className={styles.Options}>{serviceCards[item.service].label} </label>
                                    </div>
                                </div>
                                <div className='row col-6'>
                                    <Input
                                        name={item.service + "_" + item.type + "_TAT"}
                                        className='col-3 mr-5 pr-4'
                                        label=""
                                        type='text'
                                        placeholder=""
                                        required={true}
                                        disabled={!hasEditAccess}
                                        value={item.tat}
                                        onChange={(value) => this.handleInputChange(value, "tat", index)}
                                        validation={validation[item.service + "_" + item.type + "_TAT"]}
                                        message={message[item.service + "_" + item.type + "_TAT"]}
                                        errors={this.state.errors[item.service + "_" + item.type + "_TAT"]}
                                        onError={(error) => this.handleError(error, item.service + "_" + item.type + "_TAT")}
                                    />
                                    <CustomSelect
                                        name={item.service + item.type + 'tatUnit'}
                                        className={cx('col-6', styles.TatUnit)}
                                        label=""
                                        required={true}
                                        disabled={!hasEditAccess}
                                        options={this.props.tatUnit}
                                        value={item.tatUnit}
                                        onChange={(value) => this.handleInputChange(value, "tatUnit", index)}
                                    />
                                </div>
                            </div>)
                    );
                }
                else if (item.type === 'HEALTH') {
                    return (
                        healthVerification = healthVerification.concat(
                            <div key={index} className='row'>
                                <div className="col-6 mt-0 ml-3 d-flex flex-row">
                                    <img alt={t('translation_orgBgvTatMapping:image_alt_orgBgvTatMapping.IdIcon')} src={serviceCards[item.service].icon} className={cx(styles.serviceIcon, 'my-auto')} />
                                    <div className={cx('d-flex flex-column')}>
                                        <label className={styles.Options}>{serviceCards[item.service].label} </label>
                                    </div>
                                </div>
                                <div className='row col-6'>
                                    <Input
                                        name={item.service + "_TAT"}
                                        className='col-3 mr-5 pr-4'
                                        label=""
                                        type='text'
                                        placeholder=""
                                        required={true}
                                        disabled={!hasEditAccess}
                                        value={item.tat}
                                        onChange={(value) => this.handleInputChange(value, "tat", index)}
                                        validation={validation[item.service + "_TAT"]}
                                        message={message[item.service + "_TAT"]}
                                        errors={this.state.errors[item.service + "_TAT"]}
                                        onError={(error) => this.handleError(error, item.service + "_TAT")}
                                    />
                                    <CustomSelect
                                        name={item.service + 'tatUnit'}
                                        className={cx('col-6', styles.TatUnit)}
                                        label=""
                                        required={true}
                                        disabled={!hasEditAccess}
                                        options={this.props.tatUnit}
                                        value={item.tatUnit}
                                        onChange={(value) => this.handleInputChange(value, "tatUnit", index)}
                                    />
                                </div>
                            </div>)
                    );
                }
                else if (item.type === 'REFERENCE') {
                    return (
                        referenceVerification = referenceVerification.concat(
                            <div key={index} className='row'>
                                <div className="col-6 mt-0 ml-3 d-flex flex-row">
                                    <img alt={t('translation_orgBgvTatMapping:image_alt_orgBgvTatMapping.IdIcon')} src={serviceCards[item.service].icon} className={cx(styles.serviceIcon, 'my-auto')} />
                                    <div className={cx('d-flex flex-column')}>
                                        <label className={styles.Options}>{serviceCards[item.service].label} </label>
                                    </div>
                                </div>
                                <div className='row col-6'>
                                    <Input
                                        name={item.service + "_TAT"}
                                        className='col-3 mr-5 pr-4'
                                        label=""
                                        type='text'
                                        placeholder=""
                                        required={true}
                                        disabled={!hasEditAccess}
                                        value={item.tat}
                                        onChange={(value) => this.handleInputChange(value, "tat", index)}
                                        validation={validation[item.service + "_TAT"]}
                                        message={message[item.service + "_TAT"]}
                                        errors={this.state.errors[item.service + "_TAT"]}
                                        onError={(error) => this.handleError(error, item.service + "_TAT")}
                                    />
                                    <CustomSelect
                                        name={item.service + 'tatUnit'}
                                        className={cx('col-6', styles.TatUnit)}
                                        label=""
                                        required={true}
                                        disabled={!hasEditAccess}
                                        options={this.props.tatUnit}
                                        value={item.tatUnit}
                                        onChange={(value) => this.handleInputChange(value, "tatUnit", index)}
                                    />
                                </div>
                            </div>)
                    );
                }
                else { return null }
            })
        }

        return (
            <React.Fragment>
                {
                    (this.props.postDataState === 'SUCCESS' || this.props.putDataState === 'SUCCESS') ?
                        <Redirect to={url} /> : null
                }
                {this.state.checkAccess ?
                    <HasAccess
                        permission={["BGV_CONFIG:CREATE"]}
                        orgId={orgId}
                        yes={() => this.handleSetEditAccess()}
                    />
                    : null}

                {this.props.getDataState === 'LOADING' ?
                    <div className={styles.alignCenter} style={{ marginTop: '3.2rem' }}>
                        <Loader />
                    </div> :
                    <div className={styles.alignCenter}>
                        <ArrowLink
                            label={_.isEmpty(this.props.orgData) ? " " : this.props.orgData.name.toLowerCase()}
                            url={`/customer-mgmt/org/` + orgId + `/profile`}

                        />
                        <div className="d-flex">
                            <CardHeader label={t('translation_orgBgvTatMapping:cardHeader')} iconSrc={bgvConfMap} />
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

                                <div className="row">
                                    <label className={styles.Heading1}>{t('translation_orgBgvTatMapping:label.l2')}</label>
                                    <label className={styles.Heading2}>{t('translation_orgBgvTatMapping:label.l3')}</label>
                                </div>
                                <hr className={cx(styles.HorizontalLine, "mt-2")} />
                                <div className="d-flex flex-column">
                                    {idCards.length !== 0 ?
                                        <label className={cx('ml-3 mb-0', styles.Label)}>{t('translation_orgBgvTatMapping:label.l4')}</label> : null}
                                    <div className='flex-column mt-0'>
                                        {idCards}
                                    </div>
                                </div>

                                {idCards.length !== 0 ? <hr className={styles.HorizontalLine} /> : null}

                                <div className="d-flex flex-column">
                                    {addressVerification.length !== 0 ?
                                        <label className={cx('ml-3 mb-0', styles.Label)}>{t('translation_orgBgvTatMapping:label.l5')}</label> : null}
                                    <div className='flex-column mt-0'>
                                        {addressVerification}
                                    </div>
                                </div>

                                {addressVerification.length !== 0 ? <hr className={styles.HorizontalLine} /> : null}

                                <div className="d-flex flex-column">
                                    {legalVerification.length !== 0 ?
                                        <label className={cx('ml-3 mb-0', styles.Label)}>{t('translation_orgBgvTatMapping:label.l6')}</label> : null}
                                    <div className='flex-column mt-0'>
                                        {legalVerification}
                                    </div>
                                </div>

                                {legalVerification.length !== 0 ? <hr className={styles.HorizontalLine} /> : null}

                                <div className="d-flex flex-column">
                                    {careerVerification.length !== 0 ?
                                        <label className={cx('ml-3 mb-0', styles.Label)}>{t('translation_orgBgvTatMapping:label.l7')}</label> : null}
                                    <div className='flex-column mt-0'>
                                        {careerVerification}
                                    </div>
                                </div>

                                {careerVerification.length !== 0 ? <hr className={styles.HorizontalLine} /> : null}


                                <div className="d-flex flex-column">
                                    {healthVerification.length !== 0 || referenceVerification.length !== 0 ?
                                        <label className={cx('ml-3 mb-0', styles.Label)}>{t('translation_orgBgvTatMapping:label.l8')}</label> : null}
                                    <div className='flex-row'>
                                        <div className='flex-column mt-0'>
                                            {healthVerification}
                                        </div>

                                        <div className='flex-column mt-0'>
                                            {referenceVerification}
                                        </div>
                                    </div>
                                </div>

                                {(healthVerification.length !== 0 || referenceVerification.length !== 0) ? <hr className={styles.HorizontalLine} /> : null}

                                <Button
                                    label={t('translation_orgBgvTatMapping:button_orgBgvTatMapping.next')}
                                    type='save'
                                    className="float-right"
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
        servicesData: state.orgMgmt.orgBgvConfig.configStatus.servicesData,
        data: state.orgMgmt.orgBgvConfig.tatMap.data,
        getDataState: state.orgMgmt.orgBgvConfig.tatMap.getDataState,
        postDataState: state.orgMgmt.orgBgvConfig.tatMap.postDataState,
        putDataState: state.orgMgmt.orgBgvConfig.tatMap.putDataState,
        servicesId: state.orgMgmt.orgBgvConfig.tatMap.servicesId,
        error: state.orgMgmt.orgBgvConfig.tatMap.error,
        tatUnit: state.orgMgmt.staticData.orgMgmtStaticData["ORG_MGMT_TAT"],
        rightnavOrgId: state.orgMgmt.staticData.rightnavOrgId,
        orgData: state.orgMgmt.staticData.orgData,
        enabledServices: state.orgMgmt.staticData.servicesEnabled,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        initState: () => dispatch(actions.getInitState()),
        getServiceData: (orgId, from, to, viaUrl) => dispatch(actions.getServiceData(orgId, from, to, viaUrl)),
        onPostData: (TatMapping, orgId, from, to, viaUrl) => dispatch(actions.postTatData(TatMapping, orgId, from, to, viaUrl)),
        onPutData: (TatMapping, orgId) => dispatch(actions.putTatData(TatMapping, orgId)),
        getOrgData: (orgId) => dispatch(actionsOrgMgmt.getDataById(orgId))
    };
};

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(TatMapping)))