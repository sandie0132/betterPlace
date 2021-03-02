import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router';
import { withTranslation } from 'react-i18next';

import _ from 'lodash';
import cx from 'classnames';
import styles from './sectionLevel.module.scss';
import queryString from 'query-string';

import * as actions from '../Store/action';
import * as actionTypes from '../Store/actionTypes';
import * as actionsOrgMgmt from '../../../OrgMgmtStore/action';

import redCase from '../../../../../../assets/icons/verifyRed.svg';
import yellowCase from '../../../../../../assets/icons/yellow.svg';
import greenCaseLarge from '../../../../../../assets/icons/verifyGreen.svg';

import CustomSelect from '../../../../../../components/Atom/CustomSelect/CustomSelect';
import CustomSelectSmall from '../CustomSelectSmall/CustomSelectSmall';
import { Button } from 'react-crux';
import ErrorNotification from '../../../../../../components/Organism/Notifications/ErrorNotification/ErrorNotification';
import Loader from '../../../../../../components/Organism/Loader/Loader';
import initData from './sectionLevelInitData';

import HasAccess from '../../../../../../services/HasAccess/HasAccess';

const options = [
    { value: 'GREEN', label: 'green' },
    { value: 'YELLOW', label: 'yellow' },
    { value: 'RED', label: 'red' }
]

let hasEditAccess = false;

class SectionLevel extends Component {

    state = {
        selectedValues: [
            ...initData
        ],
        enableNext: true,
        services: [],
        servicesAdded: false,
        count: 0,
        checkAccess: true,
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

        if (this.state.selectedValues !== prevState.selectedValues || this.state.services !== prevState.services) {
            this.handleCheckError();
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
            this.props.getPostedData(orgId, from, to, viaUrl);
        }
    }

    handleSetEditAccess = () => {
        hasEditAccess = true;
        return true
    }

    handleSelectedServices = () => {
        let selectedServices = [];
        let count = 0;
        let section = '';
        if(_.isEmpty(this.props.statusData.servicesEnabled)){
            const { match, location } = this.props;
            let params = queryString.parse(location.search);
            const orgId = match.params.uuid;
            let url = '/customer-mgmt/org/' + orgId + '/config/bgv-select';
            if(!_.isEmpty(params)){
                url += location.search;
            }
            this.props.history.push(url);
        } else {
            _.forEach(this.props.statusData.servicesEnabled, function (service) {
                if (service.type !== section) {
                    section = service.type;
                    count = count + 1
                }
                let data;
                if (service.type === "DOCUMENT") {
                    data = {
                        service: service.service,
                        section: "IDCARDS",
                        statusFrom: "GREEN",
                        statusTo: "GREEN"
                    }
                }
                else {
                    data = {
                        service: service.service,
                        section: service.type,
                        statusFrom: "GREEN",
                        statusTo: "GREEN"
                    }
                }
                selectedServices.push(data);
            })
            selectedServices.push({ service: "ANY", section: "IDCARDS", statusFrom: "GREEN", statusTo: "GREEN" });
            selectedServices.push({ service: "ALL_IDS", section: "IDCARDS", statusFrom: "GREEN", statusTo: "GREEN" });

            selectedServices.push({ service: "ANY", section: "ADDRESS", statusFrom: "GREEN", statusTo: "GREEN" });
            selectedServices.push({ service: "ALL_VERIFICATIONS", section: "ADDRESS", statusFrom: "GREEN", statusTo: "GREEN" });

            selectedServices.push({ service: "ANY", section: "LEGAL", statusFrom: "GREEN", statusTo: "GREEN" });
            selectedServices.push({ service: "ALL_VERIFICATIONS", section: "LEGAL", statusFrom: "GREEN", statusTo: "GREEN" });

            selectedServices.push({ service: "ANY", section: "CAREER", statusFrom: "GREEN", statusTo: "GREEN" });
            selectedServices.push({ service: "ALL_VERIFICATIONS", section: "CAREER", statusFrom: "GREEN", statusTo: "GREEN" });

            this.setState({ services: selectedServices, servicesAdded: true, count: count })
        }
    }

    addPostedServices = () => {
        if (this.props.statusData.statusManagement && this.props.statusData.statusManagement.sectionLevelRules) {
            let postedServices = _.cloneDeep(this.props.statusData.statusManagement.sectionLevelRules);
            let selectedServices = _.cloneDeep(this.state.services);
            let updatedSelectedValues = _.cloneDeep(this.state.selectedValues);
            _.forEach(selectedServices, function (selectedService) {
                if (selectedService !== null) {
                    _.forEach(postedServices, function (postedService) {
                        if (postedService !== null) {
                            if (selectedService.service === postedService.service && selectedService.section === postedService.section) {
                                if (postedService.section === "IDCARDS")
                                    updatedSelectedValues[0] = postedService
                                else if (postedService.section === "ADDRESS")
                                    updatedSelectedValues[1] = postedService;
                                else if (postedService.section === "LEGAL")
                                    updatedSelectedValues[2] = postedService;
                                else if (postedService.section === 'CAREER')
                                    updatedSelectedValues[3] = postedService;
                            }
                        }
                    })
                }
            })

            this.setState({ selectedValues: updatedSelectedValues });
        }
    }

    handleInputChange = (value, DOCtype, statusFrom, statusTo) => {
        let updatedSelectedValues = _.cloneDeep(this.state.selectedValues);
        let data = {
            service: value,
            section: DOCtype,
            statusFrom: statusFrom,
            statusTo: statusTo
        }
        if (DOCtype === "IDCARDS")
            updatedSelectedValues[0] = data;
        else if (DOCtype === "ADDRESS")
            updatedSelectedValues[1] = data;
        else if (DOCtype === "LEGAL")
            updatedSelectedValues[2] = data;
        else if (DOCtype === "CAREER")
            updatedSelectedValues[3] = data;

        this.setState({ selectedValues: updatedSelectedValues });
    }

    handleChange = (value, type, service, section, status) => {
        let updatedSelectedValues = _.cloneDeep(this.state.selectedValues);
        let data = null

        if (type === 'FROM') {
            data = {
                service: service,
                section: section,
                statusFrom: value.value,
                statusTo: status
            }
        }
        else {
            data = {
                service: service,
                section: section,
                statusFrom: status,
                statusTo: value
            }
        }

        if (section === "IDCARDS")
            updatedSelectedValues[0] = data;
        else if (section === "ADDRESS")
            updatedSelectedValues[1] = data;
        else if (section === "LEGAL")
            updatedSelectedValues[2] = data;
        else if (section === 'CAREER')
            updatedSelectedValues[3] = data;

        this.setState({ selectedValues: updatedSelectedValues })
    }

    handleNext = () => {
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
        let postData = _.cloneDeep(this.state.selectedValues);

        let status = 'inProgress';
        if (this.props.statusData && this.props.statusData.status) {
            status = this.props.statusData.status === 'done' ? 'done' : status;
        }

        let level = 'section_level'
        postData = {
            statusManagement: {
                sectionLevelRules: postData
            },
            status: status
        }

        this.props.postData(postData, orgId, from, to, level, viaUrl);
        this.setState({ enableNext: false })
    }

    handleCheckError = () => {
        let updatedEnabledNext = true;
        let selectedValues = _.cloneDeep(this.state.selectedValues);

        if (selectedValues.length === 0 && selectedValues.length !== this.state.count) {
            updatedEnabledNext = false;
        }
        this.setState({ enableNext: updatedEnabledNext })
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
        let orgId = match.params.uuid;
        let params = queryString.parse(location.search);
        let url = "/customer-mgmt/org/" + orgId + "/config/bgv-status/profile-level";
        if(!_.isEmpty(params)){
            url += location.search;
        }
        let IdCards = [], addressVerificationCards = [], legalVerificationCards = [], careerVerification = []

        _.forEach(this.state.services, function (service) {
            let data = {
                value: service.service,
                label: service.service.replace(/_/g, ' ').toLowerCase(),
                section: service.section,
                statusFrom: service.statusFrom,
                statusTo: service.statusTo
            }
            if (service.section === 'IDCARDS')
                IdCards.push(data)
            else if (service.section === 'ADDRESS')
                addressVerificationCards.push(data)
            else if (service.section === 'LEGAL')
                legalVerificationCards.push(data)
            else if (service.section === 'CAREER')
                careerVerification.push(data)
        })

        let NotificationPan = (this.props.error) ?
            <div className={this.props.error ? cx(styles.ShowErrorNotificationCard, 'flex align-items-center') : cx(styles.HideErrorNotificationCard)}>
                <ErrorNotification error={this.props.error} />
            </div> : null

        return (

            this.props.getSelectedDataState === 'LOADING' || this.props.getStatusDataState === 'LOADING' ?
                <div className={cx('col-12 px-0')}>
                    <Loader type='statusMgmt' />
                </div>
                :
                <React.Fragment>
                    {(this.props.postSectionLevelDataState === 'SUCCESS') ?
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
                        {IdCards.length > 2 ?
                            <div>
                                <label className={styles.sectionName}>
                                    {t('translation_orgStatusMgmtSectionLevel:label_orgStatusMgmtSectionLevel.IDsection')}
                                </label>
                                <div className='row mt-3 mb-3 no-gutters'>
                                    <span className={styles.Text}>
                                        {t('translation_orgStatusMgmtSectionLevel:text_orgStatusMgmtSectionLevel.if')}
                                    </span>
                                    <CustomSelect
                                        name='document'
                                        className='col-3 mx-3'
                                        label=""
                                        required={true}
                                        disabled={!hasEditAccess}
                                        options={IdCards}
                                        value={this.state.selectedValues[0] ? this.state.selectedValues[0].service : ""}
                                        onChange={(value) => this.handleInputChange(value, 'IDCARDS', this.state.selectedValues[0].statusFrom, this.state.selectedValues[0].statusTo)}
                                    />

                                    <span className={styles.Text}>
                                        {t('translation_orgStatusMgmtSectionLevel:text_orgStatusMgmtSectionLevel.is')}
                                    </span>
                                    {/* <span className={styles.GreenCard}>
                                        <img src={greenCase} alt='img' />
                                        <span className={cx('ml-1', styles.Text)}>
                                            {t('translation_orgStatusMgmtSectionLevel:text_orgStatusMgmtSectionLevel.green')}
                                        </span>
                                    </span> */}
                                    <CustomSelectSmall
                                        name='document'
                                        className='mx-3 col-2'
                                        required
                                        disabled={!hasEditAccess}
                                        options={options}
                                        type={'section'}
                                        value={this.state.selectedValues[0] ? this.state.selectedValues[0].statusFrom : ""}
                                        changed={(event) => this.handleChange(event, 'FROM', this.state.selectedValues[0].service, this.state.selectedValues[0].section, this.state.selectedValues[0].statusTo)}
                                    />
                                    <span className={styles.Text} style={{ width: "23%" }}>
                                        {t('translation_orgStatusMgmtSectionLevel:text_orgStatusMgmtSectionLevel.thenId')}
                                        {/* <span className={styles.TextBold}>&nbsp;"{t('translation_orgStatusMgmtSectionLevel:text_orgStatusMgmtSectionLevel.Green')}"</span> */}
                                    </span>

                                    <CustomSelect
                                        name='document'
                                        className='col-2 mx-3'
                                        label=""
                                        required={true}
                                        disabled={!hasEditAccess}
                                        options={options}
                                        value={this.state.selectedValues[0] ? this.state.selectedValues[0].statusTo : ""}
                                        onChange={(event) => this.handleChange(event, 'TO', this.state.selectedValues[0].service, this.state.selectedValues[0].section, this.state.selectedValues[0].statusFrom)}
                                    />
                                </div>
                                <hr className={styles.HorizontalLine} />
                            </div>
                            : null}
                        {addressVerificationCards.length > 2 ?
                            <div>
                                <label className={styles.sectionName}>
                                    {t('translation_orgStatusMgmtSectionLevel:label_orgStatusMgmtSectionLevel.addressSection')}
                                </label>
                                <div className='row mt-3 mb-3 no-gutters'>
                                    <span className={styles.Text}>
                                        {t('translation_orgStatusMgmtSectionLevel:text_orgStatusMgmtSectionLevel.if')}
                                    </span>

                                    <CustomSelect
                                        name='address'
                                        className='mx-3 col-3'
                                        required
                                        disabled={!hasEditAccess}
                                        options={addressVerificationCards}
                                        value={this.state.selectedValues[1] ? this.state.selectedValues[1].service : ""}
                                        onChange={(value) => this.handleInputChange(value, 'ADDRESS', this.state.selectedValues[1].statusFrom, this.state.selectedValues[1].statusTo)}
                                    />

                                    <span className={styles.Text}>
                                        {t('translation_orgStatusMgmtSectionLevel:text_orgStatusMgmtSectionLevel.is')}
                                    </span>

                                    {/* <span className={styles.GreenCard}>
                                    <img src={greenCase} alt='img'/>
                                    <span className={cx('ml-1',styles.Text)}>
                                        {t('translation_orgStatusMgmtSectionLevel:text_orgStatusMgmtSectionLevel.green')}
                                    </span>
                                </span> */}
                                    <CustomSelectSmall
                                        name='address'
                                        className='mx-3 col-2'
                                        required
                                        disabled={!hasEditAccess}
                                        options={options}
                                        type={'section'}
                                        value={this.state.selectedValues[1] ? this.state.selectedValues[1].statusFrom : ""}
                                        changed={(event) => this.handleChange(event, 'FROM', this.state.selectedValues[1].service, this.state.selectedValues[1].section, this.state.selectedValues[1].statusTo)}
                                    />
                                    <span className={styles.Text} style={{ width: "23%" }}>
                                        {t('translation_orgStatusMgmtSectionLevel:text_orgStatusMgmtSectionLevel.thenAddress')}
                                        {/* <span className={styles.TextBold}>&nbsp;"{t('translation_orgStatusMgmtSectionLevel:text_orgStatusMgmtSectionLevel.Green')}"</span> */}
                                    </span>
                                    <CustomSelect
                                        name='address'
                                        className='col-2 mx-3'
                                        label=""
                                        required={true}
                                        disabled={!hasEditAccess}
                                        options={options}
                                        value={this.state.selectedValues[1] ? this.state.selectedValues[1].statusTo : ""}
                                        onChange={(event) => this.handleChange(event, 'TO', this.state.selectedValues[1].service, this.state.selectedValues[1].section, this.state.selectedValues[1].statusFrom)}
                                    />
                                </div>
                                <hr className={styles.HorizontalLine} />
                            </div>
                            : null}
                        {legalVerificationCards.length > 2 ?
                            <div>
                                <label className={styles.sectionName}>
                                    {t('translation_orgStatusMgmtSectionLevel:label_orgStatusMgmtSectionLevel.criminalSection')}
                                </label>
                                <div className='row mt-3 mb-3 no-gutters'>
                                    <span className={styles.Text}>
                                        {t('translation_orgStatusMgmtSectionLevel:text_orgStatusMgmtSectionLevel.if')}
                                    </span>

                                    <CustomSelect
                                        name='legal'
                                        className='mx-3 col-3'
                                        required
                                        disabled={!hasEditAccess}
                                        options={legalVerificationCards}
                                        value={this.state.selectedValues[2] ? this.state.selectedValues[2].service : ""}
                                        onChange={(value) => this.handleInputChange(value, 'LEGAL', this.state.selectedValues[2].statusFrom, this.state.selectedValues[2].statusTo)}
                                    />

                                    <span className={styles.Text}>
                                        {t('translation_orgStatusMgmtSectionLevel:text_orgStatusMgmtSectionLevel.is')}
                                    </span>
                                    {/* <span className={styles.GreenCard}>
                                        <img src={greenCase} alt='img' />
                                        <span className={cx('ml-1', styles.Text)}>
                                            {t('translation_orgStatusMgmtSectionLevel:text_orgStatusMgmtSectionLevel.green')}
                                        </span>
                                    </span> */}
                                    <CustomSelectSmall
                                        name='legal'
                                        className='mx-3 col-2'
                                        required
                                        disabled={!hasEditAccess}
                                        options={options}
                                        type={'section'}
                                        value={this.state.selectedValues[2] ? this.state.selectedValues[2].statusFrom : ""}
                                        changed={(event) => this.handleChange(event, 'FROM', this.state.selectedValues[2].service, this.state.selectedValues[2].section, this.state.selectedValues[2].statusTo)}
                                    />
                                    <span className={styles.Text} style={{ width: "23%" }}>
                                        {t('translation_orgStatusMgmtSectionLevel:text_orgStatusMgmtSectionLevel.thenCriminal')}
                                        {/* <span className={styles.TextBold}>&nbsp;"{t('translation_orgStatusMgmtSectionLevel:text_orgStatusMgmtSectionLevel.Green')}"</span> */}

                                    </span>
                                    <CustomSelect
                                        name='legal'
                                        className='col-2 mx-3'
                                        label=""
                                        required={true}
                                        disabled={!hasEditAccess}
                                        options={options}
                                        value={this.state.selectedValues[2] ? this.state.selectedValues[2].statusTo : ""}
                                        onChange={(event) => this.handleChange(event, 'TO', this.state.selectedValues[2].service, this.state.selectedValues[2].section, this.state.selectedValues[2].statusFrom)}
                                    />
                                </div>
                                <hr className={styles.HorizontalLine} />
                            </div>
                            : null}

                        {careerVerification.length > 2 ?
                            <div>
                                <label className={styles.sectionName}>
                                    {t('translation_orgStatusMgmtSectionLevel:label_orgStatusMgmtSectionLevel.careerSection')}
                                </label>
                                <div className='row mt-3 mb-3 no-gutters'>
                                    <span className={styles.Text}>
                                        {t('translation_orgStatusMgmtSectionLevel:text_orgStatusMgmtSectionLevel.if')}
                                    </span>

                                    <CustomSelect
                                        name='career'
                                        className='mx-3 col-3'
                                        required
                                        disabled={!hasEditAccess}
                                        options={careerVerification}
                                        value={this.state.selectedValues[3] ? this.state.selectedValues[3].service : ""}
                                        onChange={(value) => this.handleInputChange(value, 'CAREER', this.state.selectedValues[3].statusFrom, this.state.selectedValues[3].statusTo)}
                                    />

                                    <span className={styles.Text}>
                                        {t('translation_orgStatusMgmtSectionLevel:text_orgStatusMgmtSectionLevel.is')}
                                    </span>
                                    {/* <span className={styles.GreenCard}>
                                        <img src={greenCase} alt='img' />
                                        <span className={cx('ml-1', styles.Text)}>
                                            {t('translation_orgStatusMgmtSectionLevel:text_orgStatusMgmtSectionLevel.green')}
                                        </span>
                                    </span> */}
                                    <CustomSelectSmall
                                        name='career'
                                        className='mx-3 col-2'
                                        required
                                        disabled={!hasEditAccess}
                                        options={options}
                                        type={'section'}
                                        value={this.state.selectedValues[3] ? this.state.selectedValues[3].statusFrom : ""}
                                        changed={(event) => this.handleChange(event, 'FROM', this.state.selectedValues[3].service, this.state.selectedValues[3].section, this.state.selectedValues[3].statusTo)}
                                    />
                                    <span className={styles.Text} style={{ width: "23%" }}>
                                        {t('translation_orgStatusMgmtSectionLevel:text_orgStatusMgmtSectionLevel.thenCareer')}
                                        {/* <span className={styles.TextBold}>&nbsp;"{t('translation_orgStatusMgmtSectionLevel:text_orgStatusMgmtSectionLevel.Green')}"</span> */}
                                    </span>
                                    <CustomSelect
                                        name='career'
                                        className='col-2 mx-3'
                                        label=""
                                        required={true}
                                        disabled={!hasEditAccess}
                                        options={options}
                                        value={this.state.selectedValues[3] ? this.state.selectedValues[3].statusTo : ""}
                                        onChange={(event) => this.handleChange(event, 'TO', this.state.selectedValues[3].service, this.state.selectedValues[3].section, this.state.selectedValues[3].statusFrom)}
                                    />
                                </div>
                                <hr className={styles.HorizontalLine} />
                            </div>
                            : null}


                        <div className={cx(styles.warning)}>{t('translation_orgStatusMgmtProfileLevel:bottomHeading')}</div>
                        <div className={cx('row no-gutters')}>

                            <div className='d-flex flex-column'>
                                <label className={styles.smallText}>
                                    <img className={cx('mr-2')} src={redCase} alt={t('translation_orgStatusMgmtProfileLevel:image_alt_orgStatusMgmtProfileLevel.red')} />
                                    {t('translation_orgStatusMgmtSectionLevel:text_orgStatusMgmtSectionLevel.redInfo')}
                                </label>
                                <label className={styles.smallText}>
                                    <img className={cx('mr-2')} src={greenCaseLarge} alt={t('translation_orgStatusMgmtProfileLevel:image_alt_orgStatusMgmtProfileLevel.green')} />
                                    {t('translation_orgStatusMgmtSectionLevel:text_orgStatusMgmtSectionLevel.greenInfo')}
                                </label>
                                <label className={styles.smallText}>
                                    <img className={cx('mr-2')} src={yellowCase} alt={t('translation_orgStatusMgmtProfileLevel:image_alt_orgStatusMgmtProfileLevel.yellow')} />
                                    {t('translation_orgStatusMgmtSectionLevel:text_orgStatusMgmtSectionLevel.yellowInfo')}
                                </label>
                            </div>
                            <span className={cx('ml-auto', styles.MarginTop)}>
                                <Button
                                    label={t('translation_orgStatusMgmtSectionLevel:text_orgStatusMgmtSectionLevel.next')}
                                    type='save'
                                    isDisabled={!this.state.enableNext}
                                    clickHandler={this.handleNext}
                                />
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
        postSectionLevelDataState: state.orgMgmt.orgBgvConfig.statusMgmt.postSectionLevelDataState,
        selectedServices: state.orgMgmt.orgBgvConfig.statusMgmt.selectedServiceData,
        getStatusDataState: state.orgMgmt.orgBgvConfig.statusMgmt.getStatusDataState,
        statusData: state.orgMgmt.orgBgvConfig.statusMgmt.statusData,
        error: state.orgMgmt.orgBgvConfig.statusMgmt.error,
        rightnavOrgId: state.orgMgmt.staticData.rightnavOrgId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        // getSelectedServices: (orgId) => dispatch(actions.getSelectedServiceData(orgId))
        initState: () => dispatch(actions.getInitState()),
        getPostedData: (orgId, from, to, viaUrl) => dispatch(actions.getStatusData(orgId, from, to, viaUrl)),
        postData: (data, orgId, from, to, level, viaUrl) => dispatch(actions.postData(data, orgId, from, to, level, viaUrl)),
        onResetError: () => dispatch({ type: actionTypes.RESET_ERROR }),
        getOrgData: (orgId) => dispatch(actionsOrgMgmt.getDataById(orgId))
    };
};

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(SectionLevel)));