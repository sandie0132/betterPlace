import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';

import cx from 'classnames';
import styles from './SelectService.module.scss';

import * as actions from './Store/action.js';
import * as actionsOrgMgmt from '../../OrgMgmtStore/action';

import CardHeader from '../../../../../components/Atom/PageTitle/PageTitle';
import ArrowLink from '../../../../../components/Atom/ArrowLink/ArrowLink';
import CustomRadioButton from '../../../../../components/Molecule/CustomRadioButton/CustomRadioButton';
import ErrorNotification from '../../../../../components/Organism/Notifications/ErrorNotification/ErrorNotification';
import { Button } from 'react-crux';
import Loader from '../../../../../components/Organism/Loader/BGVConfigServiceLoader/BGVConfigServiceLoader';
import CustomDropdown from '../../../../../components/Molecule/CustomDropdown/CustomDropdown';
import AlertPopUp from '../../../../../components/Molecule/AlertPopUp/AlertPopUp';

import panConfigIcon from '../../../../../assets/icons/panSmallIcon.svg';
import aadhaarConfigIcon from '../../../../../assets/icons/aadharSmallIcon.svg';
import voterConfigIcon from '../../../../../assets/icons/voterSmallIcon.svg';
import currentAddressConfigIcon from '../../../../../assets/icons/mapSmallIcon.svg';
import permanentaddressConfigIcon from '../../../../../assets/icons/addressSmallIcon.svg';
import drivingLicenseConfigIcon from '../../../../../assets/icons/dlSmallIcon.svg';
import bgv_service from '../../../../../assets/icons/bgvService.svg';
import globalDb from '../../../../../assets/icons/globalDbSmallIcon.svg';
import vehicleregistrationConfigIcon from '../../../../../assets/icons/rcSmallIcon.svg';
import educationConfigIcon from '../../../../../assets/icons/educationSmallIcon.svg';
import employmentConfigIcon from '../../../../../assets/icons/employmentSmallIcon.svg';
import healthConfigIcon from '../../../../../assets/icons/healthSmallIcon.svg';
import refConfigIcon from '../../../../../assets/icons/refSmallIcon.svg';
import courtSmallIcon from '../../../../../assets/icons/courtSmallIcon.svg';
import policeVerificationConfigIcon from '../../../../../assets/icons/policeSmallIcon.svg';
import greyBuilding from '../../../../../assets/icons/greyBuilding.svg';
import warn from '../../../../../assets/icons/warning.svg';

import { options } from './SelectServiceInitData';

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
        enableNext: null,
        selectedServiceData: [],
        services: [],
        selectedServiceDataExist: false,
        // courtFieldsPermanent: { 'includeCivilCases': false, "searchScope": '', 'DISTRICT': false, 'HIGH': false, 'SUPREME': false, },
        // courtFieldsCurrent: { 'includeCivilCases': false, "searchScope": '', 'DISTRICT': false, 'HIGH': false, 'SUPREME': false, },
        // applyCurrentToPermanent: false,
        // applyPermanentToCurrent: false,
        checkAccess: true,
        showAlertPopUp: false
    }

    componentDidMount = () => {
        const { match } = this.props;
        let orgId = match.params.uuid;
        this.props.getServices();  //getting all the services.
        if (_.isEmpty(this.props.orgData) && orgId) {
            this.props.getOrgData(orgId)
        }
        if (orgId !== this.props.rightnavOrgId) {
            this.props.getOrgData(orgId)
        }
        this.props.getAgencyList();
    }

    componentDidUpdate = (prevProps, prevState) => {
        // if (prevState.services !== this.state.services || prevState.courtFieldsCurrent !== this.state.courtFieldsCurrent || prevState.courtFieldsPermanent !== this.state.courtFieldsPermanent) {
        if (prevState.services !== this.state.services) {
            this.handleAddServicesFunction(); //adding the selected services in the array
        }
        if (prevProps.getAgencyListState !== this.props.getAgencyListState && this.props.getAgencyListState === "SUCCESS") {

        }
        if (prevProps.getDataServiceState !== this.props.getDataServiceState && this.props.getDataServiceState === 'SUCCESS') {
            const { match } = this.props;
            let orgId = match.params.uuid;
            this.handleAllServicesToState(); //adding isSelected value to services.
            this.props.getSelectedServiceData(orgId); //getting the selected services.
        }

        if (this.state.selectedServiceData !== prevState.selectedServiceData) {

            let enableNext = true;
            if (this.state.selectedServiceData.length === 0) {
                enableNext = false
            }
            // else {
            //     _.forEach(this.state.selectedServiceData, function (field) {
            //         if (field.service === 'CRC_CURRENT_ADDRESS' || field.service === 'CRC_PERMANENT_ADDRESS') {
            //             if (_.isEmpty(field.searchScope)) {
            //                 enableNext = false;
            //             }
            //         }
            //     })
            // }
            this.setState({
                enableNext: enableNext
            })
        }
        if (prevProps.getSelectedDataState !== this.props.getSelectedDataState && this.props.getSelectedDataState === 'SUCCESS') {
            this.handleSelectedService(); //showing the selected services
        }
        // if (this.state.hasEditAccess !== prevState.hasEditAccess) {
        //     this.setState({ checkAccess: false })
        // }
    }

    componentWillUnmount = () => {
        this.props.initState()
    }
    handleAddServicesFunction = () => {

        // let radioValue = document.getElementsByName('scope');
        // let selectedRadioButton;

        // for (let i = 0; i < radioValue.length; i++) {
        //     if (radioValue[i].checked) {
        //         selectedRadioButton = radioValue[i].value;
        //     }
        // }

        let data;
        let updatedServices = _.cloneDeep(this.state.selectedServiceData);
        // let courtFields;
        // let courtFieldsPermanent = _.cloneDeep(this.state.courtFieldsPermanent);
        // let courtFieldsCurrent = _.cloneDeep(this.state.courtFieldsCurrent);
        _.forEach(this.state.services, function (service) {
            // if (service.type === 'LEGAL') {
            //     if (service.service === "CRC_PERMANENT_ADDRESS") { courtFields = courtFieldsPermanent }
            //     else { courtFields = courtFieldsCurrent }
            //     let courtList = [];
            //     _.forEach(courtFields, function (value, key) {
            //         if (value === true && key !== 'includeCivilCases') { courtList.push(key) }
            //     })
            //     data = {
            //         'service': service.service,
            //         'type': service.type,
            //         'includeCivilCases': courtFields.includeCivilCases,
            //         'courts': courtList,
            //         'searchScope': courtFields.searchScope
            //     }
            // }
            // else {
            data = {
                'service': service.service,
                'type': service.type
            }
            if (!_.isEmpty(service.agency)) {
                data = { ...data, agency: service.agency }
            }
            // }

            if (service.isSelected === true) {
                let existInService = false
                _.forEach(updatedServices, function (serviceData) {
                    if (serviceData.service === data.service && serviceData.type === data.type) {
                        // if (serviceData.type === 'LEGAL') {
                        //     serviceData.includeCivilCases = data.includeCivilCases
                        //     serviceData.courts = data.courts
                        //     serviceData.searchScope = data.searchScope
                        // }
                        if (!_.isEmpty(serviceData.agency)) {
                            serviceData.agency = service.agency;
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
                    // if (selectedService.type === 'LEGAL') {
                    //     if (selectedService.service === 'CRC_PERMANENT_ADDRESS') {
                    //         service.includeCivilCases = selectedService.includeCivilCases;
                    //         service.searchScope = selectedService.searchScope;
                    //         service.courts = selectedService.courts;
                    //         courtFieldsPermanent.includeCivilCases = selectedService.includeCivilCases;
                    //         courtFieldsPermanent.searchScope = selectedService.searchScope;
                    //         for (let i = 0; i < selectedService.courts.length; i++) {
                    //             courtFieldsPermanent[selectedService.courts[i]] = true
                    //         }
                    //     }
                    //     else {
                    //         service.includeCivilCases = selectedService.includeCivilCases;
                    //         service.searchScope = selectedService.searchScope;
                    //         service.courts = selectedService.courts;
                    //         courtFieldsCurrent.includeCivilCases = selectedService.includeCivilCases;
                    //         courtFieldsCurrent.searchScope = selectedService.searchScope;
                    //         for (let i = 0; i < selectedService.courts.length; i++) {
                    //             courtFieldsCurrent[selectedService.courts[i]] = true
                    //         }
                    //     }
                    // }
                    service.isSelected = true;
                    if (!_.isEmpty(selectedService.agency)) {
                        service.agency = selectedService.agency;
                    }
                }
            })
        })

        this.setState({ services: updatedServices })
        // courtFieldsCurrent: courtFieldsCurrent, courtFieldsPermanent: courtFieldsPermanent })
    }

    handleAllServicesToState = () => {
        let getServices = _.cloneDeep(this.props.servicesData)
        getServices = getServices.map(service => {
            // if (service.type === 'LEGAL')
            //     return ({
            //         ...service,
            //         isSelected: false,
            //         includeCivilCases: false,
            //         searchScope: '',
            //         courts: []
            //     })
            // else
            return ({
                ...service,
                isSelected: false
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

    handleToggleCheckBox = (service, index) => {
        let updatedServices = _.cloneDeep(this.state.services)
        updatedServices[index].isSelected = !updatedServices[index].isSelected
        this.setState({ services: updatedServices })
    }

    handleAgency = (vendor, index) => {
        let updatedServices = _.cloneDeep(this.state.services)
        if (updatedServices[index].isSelected && vendor === "select a vendor") {
            this.setState({ showAlertPopUp: true })
        } else {
            this.props.agencyList.forEach(agency => {
                updatedServices[index].isSelected = true;
                if (agency.label === vendor) {
                    updatedServices[index]['agency'] = agency;
                }
            })
            this.setState({ services: updatedServices })
        }
    }

    // handleToggle = (service, inputIdentifier) => { //court values
    //     let updatedCourt;
    //     if (service === "CRC_PERMANENT_ADDRESS") { updatedCourt = _.cloneDeep(this.state.courtFieldsPermanent); }
    //     else { updatedCourt = _.cloneDeep(this.state.courtFieldsCurrent); }

    //     if (inputIdentifier !== 'searchScope') { updatedCourt[inputIdentifier] = !updatedCourt[inputIdentifier]; }
    //     else {
    //         let scopeName = (service === "CRC_PERMANENT_ADDRESS") ? 'permanentScope' : 'currentScope';
    //         let radioValue = document.getElementsByName(scopeName);
    //         let selectedRadioButton;
    //         for (let i = 0; i < radioValue.length; i++) {
    //             if (radioValue[i].checked) {
    //                 selectedRadioButton = radioValue[i].value;
    //             }
    //             updatedCourt[inputIdentifier] = selectedRadioButton;
    //         }

    //     }

    //     if (service === "CRC_PERMANENT_ADDRESS") { this.setState({ courtFieldsPermanent: updatedCourt }); }
    //     else { this.setState({ courtFieldsCurrent: updatedCourt }); }

    // }

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
    //             if (service.service === 'CURRENT_ADDRESS' && service.type === 'LEGAL') {
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
        return true
    }

    render() {

        const { t } = this.props;
        const { match } = this.props;
        let orgId = match.params.uuid;
        const url = "/customer-mgmt/org/" + orgId + "/opsconfig/ops-tat";
        let NotificationPan = (this.props.error) ?
            <div className={this.props.error ? cx(styles.ShowErrorNotificationCard, 'flex align-items-center') : cx(styles.HideErrorNotificationCard)}>
                <ErrorNotification error={this.props.error} />
            </div> :
            null
        let IdCards = [], AddressCards = [], vendorDropdowns = [],
            CourtCards = [], healthCards = [], referenceCards = [], careerCards = [];
        this.state.services.map((service, serviceIndex) => {
            if (service.type === 'DOCUMENT') {
                return (
                    IdCards = IdCards.concat(
                        <CustomRadioButton
                            name={service.service + service.type}
                            key={serviceIndex}
                            label={serviceCards[service.service].label}
                            icon={serviceCards[service.service].icon}
                            className={cx('mx-2 mb-1', styles.Idcard)}
                            changed={() => this.handleToggleCheckBox(service, serviceIndex)}
                            isSelected={service.isSelected}
                            hasEditAccess={hasEditAccess}
                        />
                    )
                )
            }
            else if (service.type === 'ADDRESS') {
                return (
                    service.service === "ADDRESS_AGENCY_VERIFICATION"
                        ? vendorDropdowns = vendorDropdowns.concat(
                            <CustomDropdown
                                key={serviceIndex}
                                options={!_.isEmpty(this.props.agencyList)
                                    ? [...options, ...this.props.agencyList.map(agency => {
                                        return { "optionLabel": agency.label }
                                    }
                                    )]
                                    : []}
                                changed={(value) => this.handleAgency(value, serviceIndex)}
                                className={cx("mx-2", styles.customWidth)}
                                value={!_.isEmpty(service.agency) ? service.agency.label : "select a vendor"}
                                icon={greyBuilding}
                            />
                        )
                        : AddressCards = AddressCards.concat(
                            <CustomRadioButton
                                name={service.service + service.type}
                                key={serviceIndex}
                                label={serviceCards[service.service].label}
                                icon={serviceCards[service.service].icon}
                                className={cx('mx-2 mb-1', styles.address)}
                                changed={() => this.handleToggleCheckBox(service, serviceIndex)}
                                isSelected={service.isSelected}
                                hasEditAccess={hasEditAccess}

                            />
                        )
                )
            }
            else if (service.type === 'CAREER') {
                return (
                    careerCards = careerCards.concat(
                        <CustomRadioButton
                            name={service.service + service.type}
                            key={serviceIndex}
                            label={serviceCards[service.service].label}
                            icon={serviceCards[service.service].icon}
                            iconClassname={service.service === 'EMPLOYMENT' ? null : styles.legalIcon}
                            className={cx('mx-2', styles.address)}
                            changed={() => this.handleToggleCheckBox(service, serviceIndex)}
                            isSelected={service.isSelected}
                            hasEditAccess={hasEditAccess}

                        />
                    )
                )
            }
            else if (service.type === 'HEALTH') {
                return (
                    healthCards = healthCards.concat(
                        <CustomRadioButton
                            name={service.service + service.type}
                            key={serviceIndex}
                            label={serviceCards[service.service].label}
                            icon={serviceCards[service.service].icon}
                            iconClassname={styles.legalIcon}
                            className={cx('mx-2', styles.address)}
                            changed={() => this.handleToggleCheckBox(service, serviceIndex)}
                            isSelected={service.isSelected}
                            hasEditAccess={hasEditAccess}

                        />
                    )
                )
            }
            else if (service.type === 'REFERENCE') {
                return (
                    referenceCards = referenceCards.concat(
                        <CustomRadioButton
                            name={service.service + service.type}
                            key={serviceIndex}
                            label={serviceCards[service.service].label}
                            icon={serviceCards[service.service].icon}
                            className={cx('mx-2', styles.address)}
                            changed={() => this.handleToggleCheckBox(service, serviceIndex)}
                            isSelected={service.isSelected}
                            hasEditAccess={hasEditAccess}

                        />
                    )
                )
            }
            else {
                return (
                    CourtCards = CourtCards.concat(
                        <CustomRadioButton
                            key={serviceIndex}
                            label={serviceCards[service.service].label}
                            icon={serviceCards[service.service].icon}
                            iconClassname={service.service === 'CRC_CURRENT_ADDRESS' || service.service === 'CRC_PERMANENT_ADDRESS' ? styles.legalIcon : null}
                            className={service.service === 'CRC_CURRENT_ADDRESS' || service.service === 'CRC_PERMANENT_ADDRESS' ? cx('mx-2 mb-2', styles.legalVerifyWidth) : cx('mx-2 mb-2', styles.address)}
                            changed={() => this.handleToggleCheckBox(service, serviceIndex)}
                            isSelected={service.isSelected}
                            hasEditAccess={hasEditAccess}
                        />
                    )

                )
            }
        })

        return (
            <React.Fragment>
                {
                    (!_.isEmpty(this.state.selectedServiceData)
                        && (this.props.postDataState === 'SUCCESS' || this.props.putDataState === 'SUCCESS')) ?
                        <Redirect to={url} /> : null
                }
                {this.state.checkAccess ?
                    <HasAccess
                        permission={["OPS_CONFIG:CREATE"]}
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
                            label={t('translation_orgSelectService:label.l11')}
                            url={`/customer-mgmt/org/` + orgId + `/profile`}
                        />

                        <CardHeader label={t('translation_orgSelectService:cardheading')} iconSrc={bgv_service} />

                        <div className={cx(styles.CardLayout, 'card')}>
                            {NotificationPan}
                            <div className={cx(styles.CardPadding, 'card-body')}>
                                <div>
                                    <div className="d-flex flex-column">
                                        {IdCards.length !== 0 ?
                                            <label className={styles.Label}>{t('translation_orgSelectService:label.l12')}</label> : null}
                                        <div className='flex-column mt-1'>
                                            {IdCards}
                                        </div>
                                    </div>

                                    <hr className={styles.HorizontalLine} />

                                    <div className="d-flex flex-column mt-4 pt-2">
                                        {AddressCards.length !== 0 ?
                                            <label className={styles.Label}>{t('translation_orgSelectService:label.l13')}</label> : null}
                                        <div className='flex-column mt-1'>
                                            {AddressCards}
                                        </div>
                                        <label className={styles.primaryLabel}>{t('translation_orgSelectService:label.l17')}</label>
                                        {vendorDropdowns}
                                        {this.state.showAlertPopUp ?
                                            <AlertPopUp
                                                text={t('translation_orgSelectService:alertPopUp.l1')}
                                                para={t('translation_orgSelectService:alertPopUp.l2')}
                                                okText={t('translation_orgSelectService:alertPopUp.l3')}
                                                icon={warn}
                                                closePopup={() => this.setState({ showAlertPopUp: false })}
                                            />
                                            : null}
                                    </div>

                                    <hr className={styles.HorizontalLine} />

                                    <div className="d-flex flex-column mt-4 pt-2">
                                        {CourtCards.length !== 0 ?
                                            <label className={cx('ml-2 mb-3', styles.Label)}>{t('translation_orgBgvSelectService:label.l14')}</label> : null}
                                        <div className='d-flex flex-wrap mt-1'>
                                            {CourtCards}
                                        </div>

                                    </div>
                                    <hr className={styles.HorizontalLine} />


                                    <div className="d-flex flex-column mt-4 pt-2">
                                        {careerCards.length !== 0 ?
                                            <label className={cx('ml-2 mb-3', styles.Label)}>{t('translation_orgBgvSelectService:label.l15')}</label> : null}
                                        <div className='flex-column mt-1'>
                                            {careerCards}
                                        </div>
                                    </div>

                                    <hr className={styles.HorizontalLine} />

                                    <div className="d-flex flex-column mt-4 pt-2">
                                        {healthCards.length !== 0 || referenceCards.length !== 0 ?
                                            <label className={cx('ml-2 mb-3', styles.Label)}>{t('translation_orgBgvSelectService:label.l16')}</label> : null}
                                        <div className='row ml-0'>
                                            <div className='flex-column mt-1'>
                                                {healthCards}
                                            </div>

                                            <div className='flex-column mt-1'>
                                                {referenceCards}
                                            </div>
                                        </div>
                                    </div>

                                    <hr className={styles.HorizontalLine} />

                                    <Button label={t('translation_orgSelectService:button_orgSelectService.next')} type='save' className="float-right mt-2"
                                        isDisabled={!this.state.enableNext} clickHandler={this.handleNext} />
                                </div>
                            </div>

                        </div>
                    </div>}
            </React.Fragment >

        );
    }
}

const mapStateToProps = state => {
    return {
        servicesId: state.orgMgmt.orgOpsConfigReducer.opsServices.servicesId,
        servicesData: state.orgMgmt.orgOpsConfigReducer.opsServices.servicesData,
        data: state.orgMgmt.orgOpsConfigReducer.opsServices.data,
        selectedServiceData: state.orgMgmt.orgOpsConfigReducer.opsServices.selectedServiceData,
        getSelectedDataState: state.orgMgmt.orgOpsConfigReducer.opsServices.getSelectedDataState,
        postDataState: state.orgMgmt.orgOpsConfigReducer.opsServices.postDataState,
        getDataServiceState: state.orgMgmt.orgOpsConfigReducer.opsServices.getDataServiceState,
        putDataState: state.orgMgmt.orgOpsConfigReducer.opsServices.putDataState,
        getAgencyListState: state.orgMgmt.orgOpsConfigReducer.opsServices.getAgencyListState,
        agencyList: state.orgMgmt.orgOpsConfigReducer.opsServices.AgencyList,
        rightnavOrgId: state.orgMgmt.staticData.rightnavOrgId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        initState: () => dispatch(actions.getInitState()),
        getSelectedServiceData: (orgId) => dispatch(actions.getSelectedServiceData(orgId)),
        getServices: () => dispatch(actions.getServices()),
        // onPutData: (data, orgId) => dispatch(actions.putData(data, orgId)),
        onPostData: (data, orgId) => dispatch(actions.postData(data, orgId)),
        getOrgData: (orgId) => dispatch(actionsOrgMgmt.getDataById(orgId)),
        getAgencyList: () => dispatch(actions.getAgencyList())
    };
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(SelectService));