import React, { Component } from 'react';
import { withRouter, Redirect } from "react-router";
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import _ from 'lodash';
import cx from 'classnames';
import styles from './checkLevel.module.scss';
import queryString from 'query-string';

import * as actions from '../Store/action';
import * as actionTypes from '../Store/actionTypes';
import * as actionsOrgMgmt from '../../../OrgMgmtStore/action';

import yellowCase from '../../../../../../assets/icons/yellow.svg';
import greenCase from '../../../../../../assets/icons/verifyGreen.svg';
import redCase from '../../../../../../assets/icons/verifyRed.svg';
import panConfigIcon from '../../../../../../assets/icons/panConfigIcon.svg';
import aadhaarConfigIcon from '../../../../../../assets/icons/aadhaarConfigIcon.svg';
import voterConfigIcon from '../../../../../../assets/icons/voterConfigIcon.svg';
import drivingLicenseConfigIcon from '../../../../../../assets/icons/drivingLicenseConfigIcon.svg';
import vehicleregistrationConfigIcon from '../../../../../../assets/icons/rcConfigIcon.svg';
import currentAddressConfigIcon from '../../../../../../assets/icons/currentAddressConfigIcon.svg';
import permanentaddressConfigIcon from '../../../../../../assets/icons/permanentaddressConfigIcon.svg';
import globalDb from '../../../../../../assets/icons/databaseWithBackground.svg';
import courtSmallIcon from '../../../../../../assets/icons/courtConfigIcon.svg';
import policeVerificationConfigIcon from '../../../../../../assets/icons/policeConfigIcon.svg';
import educationConfigIcon from '../../../../../../assets/icons/educationConfigIcon.svg';
import employmentConfigIcon from '../../../../../..//assets/icons/employmentConfigIcon.svg';

import CustomSelect from '../../../../../../components/Atom/CustomSelect/CustomSelect';
import CustomSelectSmall from '../CustomSelectSmall/CustomSelectSmall';
import { Button } from 'react-crux';
import ErrorNotification from '../../../../../../components/Organism/Notifications/ErrorNotification/ErrorNotification';
import Loader from '../../../../../../components/Organism/Loader/Loader';

import HasAccess from '../../../../../../services/HasAccess/HasAccess';

const serviceCards = {
    "PAN": { icon: panConfigIcon, label: "pan card" },
    "AADHAAR": { icon: aadhaarConfigIcon, label: "aadhaar card" },
    "VOTER": { icon: voterConfigIcon, label: "voter card" },
    "DL": { icon: drivingLicenseConfigIcon, label: "driving license" },
    "RC": { icon: vehicleregistrationConfigIcon, label: "vehicle registration" },

    "CURRENT_ADDRESS": { icon: currentAddressConfigIcon, label: "current address" },
    "PERMANENT_ADDRESS": { icon: permanentaddressConfigIcon, label: "permanent address" },
    "ADDRESS_AGENCY_VERIFICATION": { icon: permanentaddressConfigIcon, label: "address agency" },

    "LEGAL": { label: "court verification" },

    "CRC_CURRENT_ADDRESS": { icon: courtSmallIcon, label: "current address" },
    "CRC_PERMANENT_ADDRESS": { icon: courtSmallIcon, label: "permanent address" },
    "POLICE_VERIFICATION": { icon: policeVerificationConfigIcon, label: "police verification" },
    "GLOBALDB": { icon: globalDb, label: "database verification" },

    "EDUCATION": { icon: educationConfigIcon, label: "education verification" },
    "EMPLOYMENT": { icon: employmentConfigIcon, label: "employment verification" }
}

const options = [
    { value: 'GREEN', label: 'green' },
    { value: 'YELLOW', label: 'yellow' },
    { value: 'RED', label: 'red' }
]

let hasEditAccess = false;

class checkLevel extends Component {

    state = {
        enableNext: true,
        services: [],
        servicesAdded: false,
        checkAccess: true
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
        this.props.getPostedData(orgId, from, to, viaUrl);
        if (_.isEmpty(this.props.orgData) && orgId) {
            this.props.getOrgData(orgId)
        }
        if (orgId !== this.props.rightnavOrgId) {
            this.props.getOrgData(orgId)
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.getStatusDataState !== this.props.getStatusDataState && this.props.getStatusDataState === 'SUCCESS') {
            this.handleSelectedServices();
        }

        if (this.state.servicesAdded !== prevState.servicesAdded) {
            if (this.state.servicesAdded === true) {
                this.addPostedServices();
            }
        }

        if (this.state.services !== prevState.services)
            this.handleCheckError();

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
            this.props.getPostedData(orgId, from, to, viaUrl);
        }

        if(prevProps.getStatusDataState !== this.props.getStatusDataState && this.props.getStatusDataState === 'SUCCESS') {
            if(_.isEmpty(this.props.statusData.servicesEnabled)){
                
            }
        }
    }

    handleSetEditAccess = () => {
        hasEditAccess = true;
        return true
    }

    handleSelectedServices = () => {
        if (!_.isEmpty(this.props.statusData.servicesEnabled)) {
            let selectedServices = [];
            _.forEach(this.props.statusData.servicesEnabled, function (service) {
                let data = {
                    ...service,
                    statusFrom: "YELLOW",
                    statusTo: "YELLOW"
                }
                selectedServices.push(data);
            })

            this.setState({ services: selectedServices, servicesAdded: true })

            if (this.props.statusData && this.props.statusData.statusManagement && this.props.statusData.statusManagement.checkLevelRules) {
                let services = [];
                selectedServices.forEach(doc => {
                    let matchedService = this.props.statusData.statusManagement.checkLevelRules.find(obj => obj.service === doc.service);
                    if (!_.isEmpty(matchedService)) {
                        let service = {
                            ...doc,
                            statusFrom: matchedService.statusFrom,
                            statusTo: matchedService.statusTo
                        };
                        services.push(service);
                    }
                    else {
                        let service = {
                            ...doc,
                            statusFrom: 'YELLOW',
                            statusTo: 'YELLOW'
                        };
                        services.push(service);
                    }
                });
                if (services.length) this.setState({ services: services })
            }
        } else{
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

    addPostedServices = () => {
        if (this.props.statusData.statusManagement !== undefined) {
            let postedServices = _.cloneDeep(this.props.statusData.statusManagement.checkLevelRules);

            let selectedServices = _.cloneDeep(this.state.services);
            selectedServices = selectedServices.map((selectedService) => {
                let selectedServicePosted = false;
                let statusTo = ""
                _.forEach(postedServices, function (postedService) {
                    if (selectedService.service === postedService.service && selectedService.type === postedService.type) {
                        selectedServicePosted = true;
                        statusTo = postedService.statusTo
                    }
                })

                if (selectedServicePosted === false)
                    return selectedService
                else {
                    return ({
                        ...selectedService,
                        statusTo: statusTo
                    })
                }
            })
            this.setState({ services: selectedServices })
        }
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

        let postData = _.cloneDeep(this.state.services);
        let level = 'check_level';
        let status = 'inProgress';
        if (this.props.statusData && this.props.statusData.status) {
            status = this.props.statusData.status === 'done' ? 'done' : status;
        }
        postData = {
            statusManagement: {
                checkLevelRules: postData
            },
            status: status
        }

        this.props.postData(postData, orgId, from, to, level, viaUrl)
        this.setState({ enableNext: false })
    }

    handleInputChange = (value, targetService, currentStatusSelect = false) => {
        let updatedServices = _.cloneDeep(this.state.services);
        updatedServices = updatedServices.map(service => {
            if (service.service === targetService.service && service.type === targetService.type) {
                return ((currentStatusSelect) ? {
                    ...service,
                    statusFrom: value.value.toUpperCase()
                } : {
                        ...service,
                        statusTo: value.toUpperCase()
                    })
            }
            return service
        })
        this.setState({ services: updatedServices })
    }

    handleCheckError = () => {
        let updatedServices = _.cloneDeep(this.state.services);
        let updatedEnableNext = true;
        _.forEach(updatedServices, function (each) {

            if (_.isEmpty(each.statusTo)) {
                updatedEnableNext = false
            }
        })
        this.setState({ enableNext: updatedEnableNext })
    }

    componentWillUnmount = () => {
        this.props.initState();
    }

    errorClickedHandler = () => {
        this.props.onResetError();
    }

    render() {
        const { t } = this.props;
        const { match, location } = this.props;
        let params = queryString.parse(location.search);
        const orgId = match.params.uuid;
        let IdCardsConfigured = false, addressVerificationConfigured = false,
            legalVerificationConfigured = false, careerVerificationConfigured = false;

        let url = `/customer-mgmt/org/` + orgId + `/config/bgv-status/section-level`;
        if(!_.isEmpty(params)){
            url += location.search;
        }
        let IdCards = [], legalVerification = [], careerVerification = [], addressVerification = [];

        if (this.state.services.length !== 0) {
            this.state.services.map((idCard, index) => {
                if (idCard.type === "DOCUMENT") {
                    IdCardsConfigured = true
                    return (
                        IdCards = IdCards.concat(
                            <div className='row mt-3 mb-3 no-gutters justify-content-between' key={index}>
                                <span style={{ width: "227px" }}>
                                    <img src={serviceCards[idCard.service].icon} className="mr-3" alt={t('translation_orgStatusMgmtCheckLevel:image_alt_orgStatusMgmtCheckLevel.img')} />
                                    <span className={cx(styles.Text, styles.TextWidth)}>
                                        {t('translation_orgStatusMgmtCheckLevel:text_orgStatusMgmtCheckLevel.if')}
                                        {serviceCards[idCard.service].label}
                                        {t('translation_orgStatusMgmtCheckLevel:text_orgStatusMgmtCheckLevel.is')}
                                    </span>
                                </span>

                                <CustomSelectSmall
                                    name='status'
                                    className='col-2'
                                    required
                                    disabled={!hasEditAccess}
                                    options={options}
                                    value={idCard.statusFrom}
                                    changed={(event) => this.handleInputChange(event, idCard, true)}
                                />
                                <span className={styles.Text}>
                                    {t('translation_orgStatusMgmtCheckLevel:text_orgStatusMgmtCheckLevel.thenId')}
                                </span>
                                <CustomSelect
                                    name='status'
                                    className='col-2'
                                    label=""
                                    required={true}
                                    disabled={!hasEditAccess}
                                    options={options}
                                    value={idCard.statusTo}
                                    onChange={(value) => this.handleInputChange(value, idCard)}
                                />
                            </div>)
                    )
                }
                else if (idCard.type === "ADDRESS") {
                    addressVerificationConfigured = true
                    return (
                        addressVerification = addressVerification.concat(
                            <div className='row mt-3 mb-3 no-gutters justify-content-between' key={index}>
                                <span style={{ width: "228px" }}>
                                    <img src={serviceCards[idCard.service].icon} className="mr-3" alt={t('translation_orgStatusMgmtCheckLevel:image_alt_orgStatusMgmtCheckLevel.img')} />
                                    <span className={cx(styles.Text, styles.TextWidth)}>
                                        {t('translation_orgStatusMgmtCheckLevel:text_orgStatusMgmtCheckLevel.if')}
                                        {serviceCards[idCard.service].label}
                                        {t('translation_orgStatusMgmtCheckLevel:text_orgStatusMgmtCheckLevel.is')}
                                    </span></span>

                                <CustomSelectSmall
                                    name='status'
                                    className='col-2'
                                    required
                                    disabled={!hasEditAccess}
                                    options={options}
                                    value={idCard.statusFrom}
                                    changed={(event) => this.handleInputChange(event, idCard, true)}
                                />
                                <span className={styles.Text}>
                                    {t('translation_orgStatusMgmtCheckLevel:text_orgStatusMgmtCheckLevel.thenId')}
                                </span>
                                <CustomSelect
                                    name='status'
                                    className='col-2'
                                    label=""
                                    required={true}
                                    disabled={!hasEditAccess}
                                    options={options}
                                    value={idCard.statusTo}
                                    onChange={(value) => this.handleInputChange(value, idCard)}
                                />
                            </div>)
                    )
                }

                else if (idCard.type === "LEGAL") {
                    legalVerificationConfigured = true;
                    // if (idCard.service === 'GLOBALDB' || idCard.service === "POLICE_VERIFICATION") {
                    return (
                        legalVerification = legalVerification.concat(
                            <div className='row mt-3 mb-3 no-gutters justify-content-between' key={index}>
                                <span style={{ width: "228px" }}>
                                    <img src={serviceCards[idCard.service].icon} className="mr-3" alt={t('translation_orgStatusMgmtCheckLevel:image_alt_orgStatusMgmtCheckLevel.img')} />

                                    <span className={cx(styles.Text, styles.TextWidth)}>
                                        {t('translation_orgStatusMgmtCheckLevel:text_orgStatusMgmtCheckLevel.if')}

                                        {idCard.service === 'CRC_CURRENT_ADDRESS' || idCard.service === 'CRC_PERMANENT_ADDRESS' ?
                                            serviceCards[idCard.type].label : serviceCards[idCard.service].label}
                                            
                                        {t('translation_orgStatusMgmtCheckLevel:text_orgStatusMgmtCheckLevel.is')}
                                    </span>
                                    <span className={styles.LegalAddress}>
                                        {idCard.service === 'CRC_CURRENT_ADDRESS' || idCard.service === 'CRC_PERMANENT_ADDRESS' ?
                                            serviceCards[idCard.service].label : null}
                                    </span>
                                </span>


                                <CustomSelectSmall
                                    name='status'
                                    className='col-2'
                                    required
                                    disabled={!hasEditAccess}
                                    options={options}
                                    value={idCard.statusFrom}
                                    changed={(event) => this.handleInputChange(event, idCard, true)}
                                />

                                <span className={styles.Text}>
                                    {t('translation_orgStatusMgmtCheckLevel:text_orgStatusMgmtCheckLevel.thenId')}
                                </span>
                                <CustomSelect
                                    name='status'
                                    className='col-2'
                                    label=""
                                    required={true}
                                    disabled={!hasEditAccess}
                                    options={options}
                                    value={idCard.statusTo}
                                    onChange={(value) => this.handleInputChange(value, idCard)}
                                />
                            </div>)
                    )
                    // }
                    // else  {
                    //     if (!isAddressAdded) {
                    //         legalVerification = legalVerification.concat(
                    //             <div className='row mt-3 mb-3 no-gutters justify-content-between' key={index}>
                    //                 <span style={{width: "228px"}}>
                    //                 <img src={serviceCards[idCard.service].icon} className="mr-3" alt={t('translation_orgStatusMgmtCheckLevel:image_alt_orgStatusMgmtCheckLevel.img')} />
                    //                 <span className={cx(styles.Text, styles.TextWidth)}>
                    //                     {t('translation_orgStatusMgmtCheckLevel:text_orgStatusMgmtCheckLevel.if')}
                    //                     {serviceCards[idCard.service].label}
                    //                     {t('translation_orgStatusMgmtCheckLevel:text_orgStatusMgmtCheckLevel.is')}
                    //                 </span></span>

                    //                 <CustomSelectSmall
                    //                     name='status'
                    //                     className='col-2'
                    //                     required
                    //                     disabled={!hasEditAccess}
                    //                     options={options}
                    //                     value={idCard.statusFrom}
                    //                     changed={(event) => this.handleInputChange(event, idCard, true)}
                    //                 />
                    //                 <span className={styles.Text}>
                    //                     {t('translation_orgStatusMgmtCheckLevel:text_orgStatusMgmtCheckLevel.thenId')}
                    //                 </span>
                    //                 <CustomSelect
                    //                     name='status'
                    //                     className='col-2'
                    //                     required
                    //                     disabled={!hasEditAccess}
                    //                     options={options}
                    //                     value={idCard.statusTo}
                    //                     changed={(event) => this.handleInputChange(event, idCard)}
                    //                 />
                    //             </div>)
                    //     }
                    //     isAddressAdded = true;
                    // }
                    // return legalVerification;
                }
                else if (idCard.type === "CAREER") {
                    careerVerificationConfigured = true
                    return (
                        careerVerification = careerVerification.concat(
                            <div className='row mt-3 mb-3 no-gutters justify-content-between' key={index}>
                                <span style={{ width: "228px" }}>
                                    <img src={serviceCards[idCard.service].icon} className="mr-3" alt={t('translation_orgStatusMgmtCheckLevel:image_alt_orgStatusMgmtCheckLevel.img')} />
                                    <span className={cx(styles.Text, styles.TextWidth)}>
                                        {t('translation_orgStatusMgmtCheckLevel:text_orgStatusMgmtCheckLevel.if')}  {serviceCards[idCard.service].label}
                                        {t('translation_orgStatusMgmtCheckLevel:text_orgStatusMgmtCheckLevel.is')}
                                    </span></span>

                                <CustomSelectSmall
                                    name='status'
                                    className='col-2'
                                    required
                                    disabled={!hasEditAccess}
                                    options={options}
                                    value={idCard.statusFrom}
                                    changed={(event) => this.handleInputChange(event, idCard, true)}
                                />
                                <span className={styles.Text}>
                                    {t('translation_orgStatusMgmtCheckLevel:text_orgStatusMgmtCheckLevel.thenId')}
                                </span>
                                <CustomSelect
                                    name='status'
                                    className='col-2'
                                    label=""
                                    required={true}
                                    disabled={!hasEditAccess}
                                    options={options}
                                    value={idCard.statusTo}
                                    onChange={(value) => this.handleInputChange(value, idCard)}
                                />
                            </div>)
                    )
                }
                else return null
            })
        }

        let NotificationPan = (this.props.error) ?
            <div className={this.props.error ? cx(styles.ShowErrorNotificationCard, 'flex align-items-center') : cx(styles.HideErrorNotificationCard)}>
                <ErrorNotification error={this.props.error} />
            </div>
            : null

        return (
            this.props.getSelectedDataState === 'LOADING' || this.props.getStatusDataState === 'LOADING' ?
                <div className={cx('col-12 px-0')}>
                    <Loader type='statusMgmt' />
                </div>
                :
                <React.Fragment>
                    {this.props.postCheckLevelDataState === 'SUCCESS' ?
                        <Redirect to={url} /> : null
                    }

                    {this.state.checkAccess ?
                        <HasAccess
                            permission={["BGV_CONFIG:CREATE"]}
                            orgId={orgId}
                            yes={() => this.handleSetEditAccess()}
                        />
                        : null}

                    <div className={cx(styles.cardLayout, 'row no-gutters card col-12')}>
                        <div disabled={!_.isEmpty(params.vendorId)}>
                        {NotificationPan}
                        {IdCardsConfigured ?
                            <div className={styles.paddingX}>
                                <label className={styles.sectionName}>
                                    {t('translation_orgStatusMgmtCheckLevel:label_orgStatusMgmtCheckLevel.IdSection')}
                                </label>
                                {IdCards}
                                <hr className={cx(styles.HorizontalLine)} />
                            </div> : ''
                        }
                        {addressVerificationConfigured ?
                            <div className={styles.paddingX}>
                                <label className={styles.sectionName}>
                                    {t('translation_orgStatusMgmtCheckLevel:label_orgStatusMgmtCheckLevel.addressSection')}
                                </label>
                                {addressVerification}
                                <hr className={cx(styles.HorizontalLine)} />
                            </div> : ''
                        }
                        {legalVerificationConfigured ?
                            <div className={styles.paddingX}>
                                <label className={styles.sectionName}>
                                    {t('translation_orgStatusMgmtCheckLevel:label_orgStatusMgmtCheckLevel.criminalSection')}
                                </label>
                                {legalVerification}
                                <hr className={cx(styles.HorizontalLine)} />
                            </div> : ''
                        }
                        {careerVerificationConfigured ?
                            <div className={styles.paddingX}>
                                <label className={styles.sectionName}>
                                    {t('translation_orgStatusMgmtCheckLevel:label_orgStatusMgmtCheckLevel.careerSection')}
                                </label>
                                {careerVerification}
                                <hr className={cx(styles.HorizontalLine)} />
                            </div> : ''
                        }


                        <div className={cx(styles.warning)}>{t('translation_orgStatusMgmtSectionLevel:bottomHeading')}</div>
                        <div className={cx('row no-gutters', styles.marginLeft)}>

                            <div className='d-flex flex-column'>
                                <label className={styles.smallText}>
                                    <img className={cx('mr-2')} src={redCase} alt={t('translation_orgStatusMgmtSectionLevel:image_alt_orgStatusMgmtSectionLevel.red')} />
                                    {t('translation_orgStatusMgmtCheckLevel:text_orgStatusMgmtCheckLevel.redInfo')}
                                </label>
                                <label className={styles.smallText}>
                                    <img className={cx('mr-2')} src={greenCase} alt={t('translation_orgStatusMgmtSectionLevel:image_alt_orgStatusMgmtSectionLevel.green')} />
                                    {t('translation_orgStatusMgmtCheckLevel:text_orgStatusMgmtCheckLevel.greenInfo')}
                                </label>
                                <label className={styles.smallText}>
                                    <img className={cx('mr-2')} src={yellowCase} alt={t('translation_orgStatusMgmtSectionLevel:image_alt_orgStatusMgmtSectionLevel.yellow')} />
                                    {t('translation_orgStatusMgmtCheckLevel:text_orgStatusMgmtCheckLevel.yellowInfo')}
                                </label>
                            </div>
                            <span className={cx('ml-auto', styles.MarginTop)}>
                                <Button label={t('translation_orgStatusMgmtSectionLevel:text_orgStatusMgmtSectionLevel.next')}
                                    type='save'
                                    isDisabled={!this.state.enableNext}
                                    clickHandler={this.handleNext}>
                                </Button>
                            </span>
                        </div>
                        </div>
                    </div>

                </React.Fragment>
        );
    }
}
const mapStateToProps = state => {
    return {
        getSelectedDataState: state.orgMgmt.orgBgvConfig.statusMgmt.getSelectedDataState,
        getStatusDataState: state.orgMgmt.orgBgvConfig.statusMgmt.getStatusDataState,
        selectedServices: state.orgMgmt.orgBgvConfig.statusMgmt.selectedServiceData,
        statusData: state.orgMgmt.orgBgvConfig.statusMgmt.statusData,
        statusId: state.orgMgmt.orgBgvConfig.statusMgmt.statusId,
        postCheckLevelDataState: state.orgMgmt.orgBgvConfig.statusMgmt.postCheckLevelDataState,
        error: state.orgMgmt.orgBgvConfig.statusMgmt.error,
        rightnavOrgId: state.orgMgmt.staticData.rightnavOrgId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        initState: () => dispatch(actions.getInitState()),
        // getSelectedServices: (orgId) => dispatch(actions.getSelectedServiceData(orgId)),
        postData: (data, orgId, from, to, level, viaUrl) => dispatch(actions.postData(data, orgId, from, to, level, viaUrl)),
        // putData : (data,orgId) => dispatch(actions.putCheckLevelData(data,orgId)),
        getPostedData: (orgId, from, to, viaUrl) => dispatch(actions.getStatusData(orgId, from, to, viaUrl)),
        onResetError: () => dispatch({ type: actionTypes.RESET_ERROR }),
        getOrgData: (orgId) => dispatch(actionsOrgMgmt.getDataById(orgId))
    };
};

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(checkLevel)));