import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';

import cx from 'classnames';
import styles from './TatMapping.module.scss';

import * as actions from './Store/action';
import * as actionsOrgMgmt from '../../OrgMgmtStore/action';

import CardHeader from '../../../../../components/Atom/PageTitle/PageTitle';
import { Button, Input } from 'react-crux';
import CustomSelect from '../../../../../components/Atom/CustomSelect/CustomSelect';
import { validation, message } from './TatValidation';
import ArrowLink from '../../../../../components/Atom/ArrowLink/ArrowLink';
import ErrorNotification from '../../../../../components/Organism/Notifications/ErrorNotification/ErrorNotification';
import Loader from '../../../../../components/Organism/Loader/BGVConfigServiceLoader/BGVConfigServiceLoader';

import bgvConfMap from '../../../../../assets/icons/bgvConfMap.svg';
import panConfigIcon from '../../../../../assets/icons/panConfigIcon.svg';
import voterConfigIcon from '../../../../../assets/icons/voterConfigIcon.svg';
import aadhaarConfigIcon from '../../../../../assets/icons/aadhaarConfigIcon.svg';
import permanentaddressConfigIcon from '../../../../../assets/icons/permanentaddressConfigIcon.svg';
import globalDb from '../../../../../assets/icons/databaseWithBackground.svg';
import currentAddressConfigIcon from '../../../../../assets/icons/currentAddressConfigIcon.svg';
import drivingLicenseConfigIcon from '../../../../../assets/icons/drivingLicenseConfigIcon.svg';
import educationConfigIcon from '../../../../../assets/icons/educationConfigIcon.svg';
import employmentConfigIcon from '../../../../../assets/icons/employmentConfigIcon.svg';
import healthConfigIcon from '../../../../../assets/icons/healthConfigIcon.svg';
import refConfigIcon from '../../../../../assets/icons/refConfigIcon.svg';
import courtSmallIcon from '../../../../../assets/icons/courtConfigIcon.svg';
import policeVerificationConfigIcon from '../../../../../assets/icons/policeConfigIcon.svg';
import vehicleregistrationConfigIcon from '../../../../../assets/icons/rcConfigIcon.svg';

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

    "EDUCATION": { icon: educationConfigIcon, label: "education verification" },
    "EMPLOYMENT": { icon: employmentConfigIcon, label: "employment verification" },

    "HEALTH": { icon: healthConfigIcon, label: "health check verification" },
    "REFERENCE": { icon: refConfigIcon, label: "reference verification" }
}

let hasEditAccess = false;

class TatMapping extends Component {

    state = {
        enableNext: false,
        checkAccess: true,
        TatArray: [],
        errors: {}
    }

    componentDidMount = () => {
        const { match } = this.props;
        let orgId = match.params.uuid;
        this.setState({ enableNext: true });
        this.props.getServiceData(orgId);
        if (orgId) {
            if (_.isEmpty(this.props.orgData)) {
                this.props.getOrgData(orgId)
            }
            this.props.getEnabledPlatformServices(orgId);
        }
        if (orgId !== this.props.rightnavOrgId) {
            this.props.getOrgData(orgId)
        }
    }

    componentWillUnmount = () => {
        this.props.initState();
    }

    componentDidUpdate(prevProps, prevState) {
        const { match } = this.props;
        let orgId = match.params.uuid;
        if (prevProps.getDataState !== this.props.getDataState && this.props.getDataState === 'SUCCESS') {
            this.handlePropsToState();
        }

        if (!_.isEqual(this.state.errors, prevState.errors)) {
            let enableNext = true;
            if (!_.isEmpty(this.state.errors)) {
                enableNext = false;
            }
            else {
                enableNext = this.handleEnableNext(this.state.TatArray);
            }
            this.setState({ enableNext: enableNext });
        }

        if (prevProps.getEnabledPlatformServicesState !== this.props.getEnabledPlatformServicesState) {
            if (this.props.getEnabledPlatformServicesState === "SUCCESS") {

                let products = this.props.EnabledPlatformServices.products ? this.props.EnabledPlatformServices.products : [];
                let services = this.props.EnabledPlatformServices.services ? this.props.EnabledPlatformServices.services : [];
                let isPlatformOpsEnabled = false;

                if (this.props.enabledID && this.props.EnabledPlatformServices.services) {
                    _.forEach(services, function (service) {
                        if (service.service === "OPS")
                            isPlatformOpsEnabled = true
                    })

                }
                if (!isPlatformOpsEnabled) {
                    services.push({ service: "OPS" })
                    if (this.props.enabledID) {
                        let putData = { products: products, services: services, _id: this.props.enabledID }
                        this.props.onPutEnabledServices(putData, orgId)
                    }
                    else {
                        let postData = { products: products, services: services }
                        this.props.onPostEnabledServices(postData, orgId)
                    }
                }
            }
        }
    }

    handleEnableNext = (tatArray) => {
        let enableNext = true;
        if (enableNext) {
            enableNext = enableNext && _.isEmpty(this.state.errors);
        }
        return (enableNext);
    }

    handlePropsToState = () => {
        let getSelectedServices = [];
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
    }

    handleInputChange = (value, inputIdentifier, index) => {
        let updatedTatArray = _.cloneDeep(this.state.TatArray)

        if (inputIdentifier === 'tat') {
            updatedTatArray[index].tat = value;
        }
        else if (inputIdentifier === 'tatUnit') {
            updatedTatArray[index].tatUnit = value;
        }
        let enableNext = this.handleEnableNext(updatedTatArray);
        this.setState({ TatArray: updatedTatArray, enableNext: enableNext });
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
        const { match } = this.props;
        let orgId = match.params.uuid;

        let status = 'inProgress';
        if (this.props.selectedServices && this.props.selectedServices.status) {
            status = this.props.selectedServices.status === 'done' ? 'done' : status;
        }
        let postData = {
            tatMappedServices: this.state.TatArray,
            status: status
        }
        this.props.onPostData(postData, orgId);
        this.setState({ enableNext: false })
    }

    handleSetEditAccess = () => {
        hasEditAccess = true;
        return true
    }

    render() {
        const { t } = this.props;
        const { match } = this.props;
        let orgId = match.params.uuid;

        let NotificationPan = (this.props.error) ?
            <div className={this.props.error ? cx(styles.ShowErrorNotificationCard, 'flex align-items-center') : cx(styles.HideErrorNotificationCard)}>
                <ErrorNotification error={this.props.error} />
            </div> : null

        let idCards = [], addressVerification = [], legalVerification = [], healthVerification = [], careerVerification = [], referenceVerification = [];

        if (this.props.data.length !== 0) {
            this.state.TatArray.map((item, index) => {
                if (item.type === 'DOCUMENT') {
                    return (
                        idCards = idCards.concat(
                            <div key={index} className='row'>
                                <div className="col-6 ml-3 d-flex flex-row">
                                    <img alt={t('translation_orgTatMapping:image_alt_orgTatMapping.IdIcon')} src={serviceCards[item.service].icon} className={cx('my-auto', styles.serviceIcon)} />
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
                                <div className="col-6 ml-3 d-flex flex-row">
                                    <img alt={t('translation_orgTatMapping:image_alt_orgTatMapping.IdIcon')} src={serviceCards[item.service].icon} className={cx('my-auto', styles.serviceIcon)} />
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
                    )
                }
                else if (item.type === 'LEGAL') {
                    return (
                        legalVerification = legalVerification.concat(
                            <div key={index} className='row'>
                                <div className="col-6 ml-3 d-flex flex-row">
                                    <img alt={t('translation_orgTatMapping:image_alt_orgTatMapping.IdIcon')} src={serviceCards[item.service].icon} className={cx('my-auto', styles.serviceIcon)} />
                                    {item.service === 'CRC_CURRENT_ADDRESS' || item.service === 'CRC_PERMANENT_ADDRESS' ?
                                        <div className={cx(styles.PaddingLeft)}>
                                            <div className='d-flex flex-column'>
                                                <label className={styles.SubHeading}>{t('translation_orgTatMapping:label.l9')}</label>
                                                <span className={styles.OptionWithHeading}>{serviceCards[item.service].label}</span>
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
                                <div className="col-6 ml-3 d-flex flex-row">
                                    <img alt={t('translation_orgTatMapping:image_alt_orgTatMapping.IdIcon')} src={serviceCards[item.service].icon} className={cx('my-auto', styles.serviceIcon)} />
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
                                <div className="col-6 ml-3 d-flex flex-row">
                                    <img alt={t('translation_orgTatMapping:image_alt_orgTatMapping.IdIcon')} src={serviceCards[item.service].icon} className={cx('my-auto', styles.serviceIcon)} />
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
                                <div className="col-6 ml-3 d-flex flex-row">
                                    <img alt={t('translation_orgTatMapping:image_alt_orgTatMapping.IdIcon')} src={serviceCards[item.service].icon} className={cx('my-auto', styles.serviceIcon)} />
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
                else return null
            })
        }
        return (
            <React.Fragment>
                {(this.props.postDataState === 'SUCCESS' || this.props.putDataState === 'SUCCESS') ?
                    <Redirect to={"/customer-mgmt/org/" + orgId + "/opsconfig/ops-price"} /> : null
                }
                {this.state.checkAccess ?
                    <HasAccess
                        permission={["OPS_CONFIG:CREATE"]}
                        orgId={orgId}
                        yes={() => this.handleSetEditAccess()}
                    />
                    : null}

                {this.props.getSelectedDataState === 'LOADING' || this.props.getEnabledPlatformServicesState === 'LOADING' ?
                    <div className={styles.alignCenter} style={{ marginTop: '3.2rem' }}>
                        <Loader />
                    </div> :
                    <div className={styles.alignCenter}>
                        <ArrowLink
                            label={t('translation_orgTatMapping:label.l1')}
                            url={`/customer-mgmt/org/` + orgId + `/profile`}
                        />

                        <CardHeader label={t('translation_orgTatMapping:cardHeader')} iconSrc={bgvConfMap} />
                        <div className={cx(styles.CardLayout, 'card')}>
                            {NotificationPan}
                            <div className={cx(styles.CardPadding, 'card-body')}>

                                <div className="row">
                                    <label className={styles.Heading1}>{t('translation_orgTatMapping:label.l2')}</label>
                                    <label className={styles.Heading2}>{t('translation_orgTatMapping:label.l3')}</label>
                                </div>
                                <hr className={styles.HorizontalLine} />

                                <div className="d-flex flex-column">
                                    {idCards.length !== 0 ?
                                        <label className={cx('ml-3 mb-0', styles.Label)}>{t('translation_orgTatMapping:label.l4')}</label> : null}
                                    <div className='flex-column'>
                                        {idCards}
                                    </div>
                                </div>

                                {idCards.length !== 0 ? <hr className={styles.HorizontalLine} /> : null}

                                <div className="d-flex flex-column">
                                    {addressVerification.length !== 0 ?
                                        <label className={cx('ml-3 mb-0', styles.Label)}>{t('translation_orgTatMapping:label.l5')}</label> : null}
                                    <div className='flex-column'>
                                        {addressVerification}
                                    </div>
                                </div>

                                {addressVerification.length !== 0 ? <hr className={styles.HorizontalLine} /> : null}

                                <div className="d-flex flex-column">
                                    {legalVerification.length !== 0 ?
                                        <label className={cx('ml-3 mb-0', styles.Label)}>{t('translation_orgTatMapping:label.l6')}</label> : null}
                                    <div className='flex-column'>
                                        {legalVerification}
                                    </div>
                                </div>

                                {legalVerification.length !== 0 ? <hr className={styles.HorizontalLine} /> : null}

                                <div className="d-flex flex-column">
                                    {careerVerification.length !== 0 ?
                                        <label className={cx('ml-3 mb-0', styles.Label)}>{t('translation_orgTatMapping:label.l7')}</label> : null}
                                    <div className='flex-column'>
                                        {careerVerification}
                                    </div>
                                </div>

                                {careerVerification.length !== 0 ? <hr className={styles.HorizontalLine} /> : null}


                                <div className="d-flex flex-column">
                                    {healthVerification.length !== 0 || referenceVerification.length !== 0 ?
                                        <label className={cx('ml-3 mb-0', styles.Label)}>{t('translation_orgTatMapping:label.l8')}</label> : null}
                                    <div className='flex-row'>
                                        <div className='flex-column'>
                                            {healthVerification}
                                        </div>

                                        <div className='flex-column'>
                                            {referenceVerification}
                                        </div>
                                    </div>
                                </div>

                                {(healthVerification.length !== 0 || referenceVerification.length !== 0) ? <hr className={styles.HorizontalLine} /> : null}
                                <Button label={t('translation_orgTatMapping:button_orgTatMapping.next')} type='save' className="float-right mt-2" isDisabled={!this.state.enableNext} clickHandler={this.handleNext} />
                            </div>
                        </div>
                    </div>}

            </React.Fragment >

        );
    }
}

const mapStateToProps = state => {
    return {
        servicesData: state.orgMgmt.orgOpsConfigReducer.configStatus.servicesData,
        getSelectedDataState: state.orgMgmt.orgOpsConfigReducer.opsTat.getSelectedDataState,
        selectedServices: state.orgMgmt.orgOpsConfigReducer.opsTat.selectedServiceData,
        data: state.orgMgmt.orgOpsConfigReducer.opsTat.data,
        getDataState: state.orgMgmt.orgOpsConfigReducer.opsTat.getDataState,
        postDataState: state.orgMgmt.orgOpsConfigReducer.opsTat.postDataState,
        putDataState: state.orgMgmt.orgOpsConfigReducer.opsTat.putDataState,
        servicesId: state.orgMgmt.orgOpsConfigReducer.opsTat.servicesId,
        error: state.orgMgmt.orgOpsConfigReducer.opsTat.error,
        tatUnit: state.orgMgmt.staticData.orgMgmtStaticData["ORG_MGMT_TAT"],
        rightnavOrgId: state.orgMgmt.staticData.rightnavOrgId,
        getEnabledPlatformServicesState: state.orgMgmt.orgOpsConfigReducer.opsTat.getEnabledPlatformServicesState,
        EnabledPlatformServices: state.orgMgmt.orgOpsConfigReducer.opsTat.EnabledPlatformServices,
        enabledID: state.orgMgmt.orgOpsConfigReducer.opsTat.enabledID
    };
};

const mapDispatchToProps = dispatch => {
    return {
        initState: () => dispatch(actions.getInitState()),
        // getSelectedServices: (orgId) => dispatch(actions.getSelectedServices(orgId)),
        getServiceData: (orgId) => dispatch(actions.getServiceData(orgId)),
        onPostData: (TatMapping, orgId) => dispatch(actions.postTatData(TatMapping, orgId)),
        // onPutData: (TatMapping, orgId) => dispatch(actions.putTatData(TatMapping, orgId)),
        getOrgData: (orgId) => dispatch(actionsOrgMgmt.getDataById(orgId)),
        getEnabledPlatformServices: (orgId) => dispatch(actions.getEnabledPlatformServices(orgId)),
        onPostEnabledServices: (data, Id) => dispatch(actions.postEnabledPlatformServices(data, Id)),
        onPutEnabledServices: (data, Id) => dispatch(actions.putEnabledPlatformServices(data, Id))
    };
};

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(TatMapping)));