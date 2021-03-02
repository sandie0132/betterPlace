import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';

import cx from 'classnames';
import styles from './PriceMapping.module.scss';

import * as actions from './Store/action';
import * as actionTypes from './Store/actionTypes';
import * as actionsOrgMgmt from '../../OrgMgmtStore/action';

import CardHeader from '../../../../../components/Atom/PageTitle/PageTitle';
import { validation, message } from './PriceValidation';
import { Button, Input } from 'react-crux';
import Spinnerload from '../../../../../components/Atom/Spinner/Spinner';
import ArrowLink from '../../../../../components/Atom/ArrowLink/ArrowLink';
import ErrorNotification from '../../../../../components/Organism/Notifications/ErrorNotification/ErrorNotification';
import SuccessNotification from '../../../../../components/Organism/Notifications/SuccessNotification/SuccessNotification';
import Loader from '../../../../../components/Organism/Loader/BGVConfigServiceLoader/BGVConfigServiceLoader';

import bgvConfMap from '../../../../../assets/icons/bgvConfMap.svg';
import panConfigIcon from '../../../../../assets/icons/panConfigIcon.svg';
import voterConfigIcon from '../../../../../assets/icons/voterConfigIcon.svg';
import aadhaarConfigIcon from '../../../../../assets/icons/aadhaarConfigIcon.svg';
import permanentaddressConfigIcon from '../../../../../assets/icons/permanentaddressConfigIcon.svg';
import currentAddressConfigIcon from '../../../../../assets/icons/currentAddressConfigIcon.svg';
import drivingLicenseConfigIcon from '../../../../../assets/icons/drivingLicenseConfigIcon.svg';
import globalDb from '../../../../../assets/icons/databaseWithBackground.svg';
import vehicleregistrationConfigIcon from '../../../../../assets/icons/rcConfigIcon.svg';
import educationConfigIcon from '../../../../../assets/icons/educationConfigIcon.svg';
import employmentConfigIcon from '../../../../../assets/icons/employmentConfigIcon.svg';
import healthConfigIcon from '../../../../../assets/icons/healthConfigIcon.svg';
import refConfigIcon from '../../../../../assets/icons/refConfigIcon.svg';
import courtSmallIcon from '../../../../../assets/icons/courtConfigIcon.svg';
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

    "EDUCATION": { icon: educationConfigIcon, label: "education verification" },
    "EMPLOYMENT": { icon: employmentConfigIcon, label: "employment verification" },

    "HEALTH": { icon: healthConfigIcon, label: "health check verification" },
    "REFERENCE": { icon: refConfigIcon, label: "reference verification" }
}

let hasEditAccess = false;

class PriceMapping extends Component {

    state = {
        enableNext: false,
        PriceArray: [],
        showSaveButton: false,
        checkAccess: true,
        submitSuccess: false,
        errors: {}
    }

    componentDidMount = () => {
        const { match } = this.props;
        let orgId = match.params.uuid;
        this.props.getServiceData(orgId);
        if (_.isEmpty(this.props.orgData) && orgId) {
            this.props.getOrgData(orgId)
        }
        if (orgId !== this.props.rightnavOrgId) {
            this.props.getOrgData(orgId)
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.getDataState !== this.props.getDataState && this.props.getDataState === 'SUCCESS') {
            this.handlePropsToState();
        }

        if (prevProps.postDataState !== this.props.postDataState && this.props.postDataState === 'SUCCESS') {
            this.setState({ submitSuccess: true })
            setTimeout(() => {
                this.setState({ submitSuccess: false })
            }, 2000);
        }

        if (!_.isEqual(this.state.errors, prevState.errors)) {
            let enableNext = true;
            if (!_.isEmpty(this.state.errors)) {
                enableNext = false;
            }
            else {
                enableNext = this.handleEnableNext(this.state.PriceArray);
            }
            this.setState({ enableNext: enableNext });
        }
    }

    handleEnableNext = (priceArray) => {
        let enableNext = true;
        if (enableNext) {
            enableNext = enableNext && _.isEmpty(this.state.errors);
        }
        return (enableNext);
    }

    handlePropsToState = () => {
        let getSelectedServices = [];
        if (this.props.data.priceMappedServices === undefined) {
            getSelectedServices = _.cloneDeep(this.props.data.servicesEnabled)
            getSelectedServices = getSelectedServices.map(service => {
                return ({
                    ...service,
                    price: ''
                })
            })
        }
        else {
            getSelectedServices = _.cloneDeep(this.props.data.servicesEnabled);
            let getPostedServices = _.cloneDeep(this.props.data.priceMappedServices)
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
                        price: '',
                    })
                }
            })
        }
        this.setState({ PriceArray: getSelectedServices })
    }

    componentWillUnmount() {
        this.props.initState();
    }

    handleInputChange = (value, item, index) => {
        let updatedPriceArray = _.cloneDeep(this.state.PriceArray);
        updatedPriceArray[index].price = value;

        let enableNext = this.handleEnableNext(updatedPriceArray);
        this.setState({ PriceArray: updatedPriceArray, enableNext: enableNext })
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

        let postData = {
            priceMappedServices: this.state.PriceArray,
            status: 'done'
        }
        this.props.onPostData(postData, orgId);
        this.setState({ enableNext: false, showSaveButton: true })

        setTimeout(() => {
            this.setState({ showSaveButton: false })
        }, 2000);
    }

    handleSetEditAccess = () => {
        // this.setState({ hasEditAccess: true })
        hasEditAccess = true;
        return true
    }

    successClickedHandler = () => {
        this.setState({ submitSuccess: false })
    }

    errorClickedHandler = () => {
        this.props.onResetError();
    }

    render() {
        const { t } = this.props;
        // let rupee = <p>&#8377;</p>;
        const { match } = this.props;
        let orgId = match.params.uuid;
        let NotificationPan = (this.props.error) ?
            <div className={this.props.error ? cx(styles.ShowErrorNotificationCard, 'flex align-items-center') : cx(styles.HideErrorNotificationCard)}>
                <ErrorNotification error={this.props.error} clicked={this.errorClickedHandler} />
            </div> :
            (this.state.submitSuccess) ?
                <div className={this.state.submitSuccess ? cx(styles.ShowSuccessNotificationCard, 'flex align-items-center') : cx(styles.HideSuccessNotificationCard)}>
                    <SuccessNotification clicked={this.successClickedHandler} />
                </div>
                : <div className={styles.emptyNotification}></div>

        let idCards = [], addressVerification = [], legalVerification = [], healthVerification = [], careerVerification = [], referenceVerification = [];

        if (this.props.data.length !== 0) {
            this.state.PriceArray.map((item, index) => {
                if (item.type === 'DOCUMENT')
                    return (
                        idCards = idCards.concat(
                            <div key={index} className='row'>
                                <div className="col-6 ml-3 d-flex flex-row">
                                    <img alt={t('translation_orgPriceMap:image_alt_orgPriceMap.IdIcon')} src={serviceCards[item.service].icon} className={cx('my-auto', styles.serviceIcon)} />
                                    <div className={cx('d-flex flex-column')}>
                                        <label className={styles.Options}>{serviceCards[item.service].label} </label>
                                    </div>
                                </div>
                                <div className='row'>
                                    <Input
                                        name={item.service + "_" + item.type + "_Price"}
                                        className='col-5'
                                        label=""
                                        type='text'
                                        placeholder=""
                                        required={true}
                                        disabled={!hasEditAccess}
                                        value={item.price}
                                        onChange={(event) => this.handleInputChange(event, item, index)}
                                        validation={validation[item.service + "_" + item.type + "_Price"]}
                                        message={message[item.service + "_" + item.type + "_Price"]}
                                        errors={this.state.errors[item.service + "_" + item.type + "_Price"]}
                                        onError={(error) => this.handleError(error, item.service + "_" + item.type + "_Price")}
                                    />
                                    <label className={styles.TATLabel}>{t('translation_orgPriceMap:label.l7')}</label>
                                    {/* <div className={styles.Rupee}>{rupee}</div> */}
                                </div>
                            </div>)
                    );

                else if (item.type === 'ADDRESS') {
                    return (
                        addressVerification = addressVerification.concat(
                            <div key={index} className='row'>
                                <div className="col-6 ml-3 d-flex flex-row">
                                    <img alt={t('translation_orgPriceMap:image_alt_orgPriceMap.IdIcon')} src={serviceCards[item.service].icon} className={cx('my-auto', styles.serviceIcon)} />
                                    <div className={cx('d-flex flex-column')}>
                                        <label className={styles.Options}>{serviceCards[item.service].label} </label>
                                    </div>
                                </div>
                                <div className='row'>
                                    <Input
                                        name={item.service + "_" + item.type + "_Price"}
                                        className='col-5'
                                        label=""
                                        type='text'
                                        placeholder=""
                                        required={true}
                                        disabled={!hasEditAccess}
                                        value={item.price}
                                        onChange={(event) => this.handleInputChange(event, item, index)}
                                        validation={validation[item.service + "_" + item.type + "_Price"]}
                                        message={message[item.service + "_" + item.type + "_Price"]}
                                        errors={this.state.errors[item.service + "_" + item.type + "_Price"]}
                                        onError={(error) => this.handleError(error, item.service + "_" + item.type + "_Price")}
                                    />
                                    <label className={styles.TATLabel}>{t('translation_orgPriceMap:label.l7')}</label>
                                    {/* <div className={styles.Rupee}>{rupee}</div> */}
                                </div>
                            </div>
                        )
                    )
                }
                else if (item.type === 'LEGAL')
                    return (
                        legalVerification = legalVerification.concat(
                            <div key={index} className='row'>
                                <div className="col-6 ml-3 d-flex flex-row">
                                    <img alt={t('translation_orgPriceMap:image_alt_orgPriceMap.IdIcon')} src={serviceCards[item.service].icon} className={cx('my-auto', styles.serviceIcon)} />
                                    {item.service !== 'GLOBALDB' ?
                                        <div className={cx(styles.PaddingLeft)}>
                                            <div className='d-flex flex-column'>
                                                <label className={styles.SubHeading}>{t('translation_orgPriceMap:label.l13')}</label>
                                                <span className={styles.OptionWithHeading}>{serviceCards[item.service].label}</span>
                                            </div>
                                        </div>
                                        :
                                        <div className='d-flex flex-column'>
                                            <span className={styles.Options}>{serviceCards[item.service].label}</span>
                                        </div>}
                                </div>
                                <div className='row'>
                                    <Input
                                        name={item.service + "_" + item.type + "_Price"}
                                        className='col-5'
                                        label=""
                                        type='text'
                                        placeholder=""
                                        required={true}
                                        disabled={!hasEditAccess}
                                        value={item.price}
                                        onChange={(event) => this.handleInputChange(event, item, index)}
                                        validation={validation[item.service + "_" + item.type + "_Price"]}
                                        message={message[item.service + "_" + item.type + "_Price"]}
                                        errors={this.state.errors[item.service + "_" + item.type + "_Price"]}
                                        onError={(error) => this.handleError(error, item.service + "_" + item.type + "_Price")}
                                    />
                                    <label className={styles.TATLabel}>{t('translation_orgPriceMap:label.l7')}</label>
                                    {/* <div className={styles.Rupee}>{rupee}</div> */}
                                </div>


                            </div>)

                    );
                else if (item.type === 'CAREER')
                    return (
                        careerVerification = careerVerification.concat(
                            <div key={index} className='row'>
                                <div className="col-6 ml-3 d-flex flex-row">
                                    <img alt={t('translation_orgPriceMap:image_alt_orgPriceMap.IdIcon')} src={serviceCards[item.service].icon} className={cx('my-auto', styles.serviceIcon)} />
                                    <div className={cx('d-flex flex-column')}>
                                        <label className={styles.Options}>{serviceCards[item.service].label} </label>
                                    </div>
                                </div>
                                <div className='row'>
                                    <Input
                                        name={item.service + "_" + item.type + "_Price"}
                                        className='col-5'
                                        label=""
                                        type='text'
                                        placeholder=""
                                        required={true}
                                        disabled={!hasEditAccess}
                                        value={item.price}
                                        onChange={(event) => this.handleInputChange(event, item, index)}
                                        validation={validation[item.service + "_" + item.type + "_Price"]}
                                        message={message[item.service + "_" + item.type + "_Price"]}
                                        errors={this.state.errors[item.service + "_" + item.type + "_Price"]}
                                        onError={(error) => this.handleError(error, item.service + "_" + item.type + "_Price")}
                                    />
                                    <label className={styles.TATLabel}>{t('translation_orgPriceMap:label.l7')}</label>
                                    {/* <div className={styles.Rupee}>{rupee}</div> */}
                                </div>
                            </div>)
                    );
                else if (item.type === 'HEALTH')
                    return (
                        healthVerification = healthVerification.concat(
                            <div key={index} className='row'>
                                <div className="col-6 ml-3 d-flex flex-row">
                                    <img alt={t('translation_orgPriceMap:image_alt_orgPriceMap.IdIcon')} src={serviceCards[item.service].icon} className={cx('my-auto', styles.serviceIcon)} />
                                    <div className={cx('d-flex flex-column')}>
                                        <label className={styles.Options}>{serviceCards[item.service].label} </label>
                                    </div>
                                </div>
                                <div className='row'>
                                    <Input
                                        name={item.service + "_Price"}
                                        className='col-5'
                                        label=""
                                        type='text'
                                        placeholder=""
                                        required={true}
                                        disabled={!hasEditAccess}
                                        value={item.price}
                                        onChange={(event) => this.handleInputChange(event, item, index)}
                                        validation={validation[item.service + "_Price"]}
                                        message={message[item.service + "_Price"]}
                                        errors={this.state.errors[item.service + "_Price"]}
                                        onError={(error) => this.handleError(error, item.service + "_Price")}
                                    />
                                    <label className={styles.TATLabel}>{t('translation_orgPriceMap:label.l7')}</label>
                                    {/* <div className={styles.Rupee}>{rupee}</div> */}
                                </div>


                            </div>)

                    );
                else if (item.type === 'REFERENCE')
                    return (
                        referenceVerification = referenceVerification.concat(
                            <div key={index} className='row'>
                                <div className="col-6 ml-3 d-flex flex-row">
                                    <img alt={t('translation_orgPriceMap:image_alt_orgPriceMap.IdIcon')} src={serviceCards[item.service].icon} className={cx('my-auto', styles.serviceIcon)} />
                                    <div className={cx('d-flex flex-column')}>
                                        <label className={styles.Options}>{serviceCards[item.service].label} </label>
                                    </div>
                                </div>
                                <div className='row'>
                                    <Input
                                        name={item.service + "_Price"}
                                        className='col-5'
                                        label=""
                                        type='text'
                                        placeholder=""
                                        required={true}
                                        disabled={!hasEditAccess}
                                        value={item.price}
                                        onChange={(event) => this.handleInputChange(event, item, index)}
                                        validation={validation[item.service + "_Price"]}
                                        message={message[item.service + "_Price"]}
                                        errors={this.state.errors[item.service + "_Price"]}
                                        onError={(error) => this.handleError(error, item.service + "_Price")}
                                    />
                                    <label className={styles.TATLabel}>{t('translation_orgPriceMap:label.l7')}</label>
                                    {/* <div className={styles.Rupee}>{rupee}</div> */}
                                </div>


                            </div>)

                    );
                else return null;
            })
        }
        return (
            <React.Fragment>
                {this.state.checkAccess ?
                    <HasAccess
                        permission={["OPS_CONFIG:CREATE"]}
                        orgId={orgId}
                        yes={() => this.handleSetEditAccess()}
                    />
                    : null}

                {this.props.getSelectedDataState === 'LOADING' || this.props.getDataState === 'LOADING' ?
                    <div className={styles.alignCenter} style={{ marginTop: '3.2rem' }}>
                        <Loader />
                    </div> :
                    <div className={styles.alignCenter}>
                        <ArrowLink
                            label={t('translation_orgPriceMap:label.l1')}
                            url={`/customer-mgmt/org/` + orgId + `/profile`}
                        />

                        <CardHeader label={t('translation_orgPriceMap:cardheading')} iconSrc={bgvConfMap} />

                        <div className={cx(styles.CardLayout, 'card')}>
                            {NotificationPan}
                            <div className={cx(styles.CardPadding, 'card-body')}>

                                <div className="row">
                                    <label className={styles.Heading1}>{t('translation_orgPriceMap:label.l2')}</label>
                                    <label className={styles.Heading2}>{t('translation_orgPriceMap:label.l3')}</label>
                                </div>
                                <hr className={cx(styles.HorizontalLine, "mt-2")} />


                                <div className="d-flex flex-column">
                                    {idCards.length !== 0 ?
                                        <label className={cx('ml-3 mb-0', styles.Label)}>{t('translation_orgPriceMap:label.l8')}</label> : null}
                                    <div className='flex-column'>
                                        {idCards}
                                    </div>
                                </div>

                                {idCards.length !== 0 ? <hr className={styles.HorizontalLine} /> : null}

                                <div className="d-flex flex-column">
                                    {addressVerification.length !== 0 ?
                                        <label className={cx('ml-3 mb-0', styles.Label)}>{t('translation_orgPriceMap:label.l9')}</label> : null}
                                    <div className='flex-column'>
                                        {addressVerification}
                                    </div>
                                </div>

                                {addressVerification.length !== 0 ? <hr className={styles.HorizontalLine} /> : null}

                                <div className="d-flex flex-column">
                                    {legalVerification.length !== 0 ?
                                        <label className={cx('ml-3 mb-0', styles.Label)}>{t('translation_orgPriceMap:label.l10')}</label> : null}
                                    <div className='flex-column'>
                                        {legalVerification}
                                    </div>
                                </div>

                                {legalVerification.length !== 0 ? <hr className={styles.HorizontalLine} /> : null}

                                <div className="d-flex flex-column">
                                    {careerVerification.length !== 0 ?
                                        <label className={cx('ml-3 mb-0', styles.Label)}>{t('translation_orgPriceMap:label.l11')}</label> : null}
                                    <div className='flex-column'>
                                        {careerVerification}
                                    </div>
                                </div>

                                {careerVerification.length !== 0 ? <hr className={styles.HorizontalLine} /> : null}


                                <div className="d-flex flex-column">
                                    {healthVerification.length !== 0 || referenceVerification.length !== 0 ?
                                        <label className={cx('ml-3 mb-0', styles.Label)}>{t('translation_orgPriceMap:label.l12')}</label> : null}
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

                                {this.props.postDataState === 'LOADING' || this.props.putDataState === 'LOADING' ?
                                    <div className="float-right mt-2">
                                        <Spinnerload type='loading' />
                                    </div> :
                                    this.state.showSaveButton === true ?
                                        this.props.error ?
                                            <div className="float-right mt-2"><Spinnerload /></div>
                                            :
                                            <div className="float-right mt-2"><Spinnerload type='success' /></div>
                                        :
                                        <HasAccess
                                            permission={["OPS_CONFIG:CREATE"]}
                                            orgId={orgId}
                                            yes={() =>
                                                <Button label={t('translation_orgPriceMap:button_orgPriceMap.save')} type='save' className="float-right mt-2" isDisabled={!this.state.enableNext} clickHandler={this.handleNext} />
                                            }
                                            no={() =>
                                                <Button label={t('translation_orgPriceMap:button_orgPriceMap.save')} type='save' className="float-right mt-2" isDisabled={true} clickHandler={this.handleNext} />
                                            }
                                        />
                                }
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
        getSelectedDataState: state.orgMgmt.orgOpsConfigReducer.opsPricing.getSelectedDataState,
        selectedServices: state.orgMgmt.orgOpsConfigReducer.opsPricing.selectedServiceData,
        data: state.orgMgmt.orgOpsConfigReducer.opsPricing.data,
        getDataState: state.orgMgmt.orgOpsConfigReducer.opsPricing.getDataState,
        postDataState: state.orgMgmt.orgOpsConfigReducer.opsPricing.postDataState,
        putDataState: state.orgMgmt.orgOpsConfigReducer.opsPricing.putDataState,
        servicesId: state.orgMgmt.orgOpsConfigReducer.opsPricing.servicesId,
        error: state.orgMgmt.orgOpsConfigReducer.opsPricing.error,
        rightnavOrgId: state.orgMgmt.staticData.rightnavOrgId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        initState: () => dispatch(actions.getInitState()),
        // getSelectedServices : (orgId) => dispatch(actions.getSelectedServices(orgId)),
        getServiceData: (orgId) => dispatch(actions.getServiceData(orgId)),
        onPostData: (TatMapping, orgId) => dispatch(actions.postTatData(TatMapping, orgId)),
        // onPutData: (TatMapping, orgId) => dispatch(actions.putTatData(TatMapping, orgId)),
        onResetError: () => dispatch({ type: actionTypes.RESET_ERROR }),
        getOrgData: (orgId) => dispatch(actionsOrgMgmt.getDataById(orgId))
    };
};

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(PriceMapping)));