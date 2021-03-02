import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import _ from 'lodash';
import cx from 'classnames';
import styles from './profileLevel.module.scss';
import queryString from 'query-string';

import * as actions from '../Store/action';
import * as actionTypes from '../Store/actionTypes';
import * as actionsOrgMgmt from '../../../OrgMgmtStore/action';

import greenCase from '../../../../../../assets/icons/greenOption.svg';
import { Button } from 'react-crux';
import redCase from '../../../../../../assets/icons/verifyRed.svg';
import yellowCase from '../../../../../../assets/icons/yellow.svg';
import greenCaseLarge from '../../../../../../assets/icons/verifyGreen.svg';

import CustomSelect from '../../../../../../components/Atom/CustomSelect/CustomSelect';
import Spinnerload from '../../../../../../components/Atom/Spinner/Spinner';
import SuccessNotification from '../../../../../../components/Organism/Notifications/SuccessNotification/SuccessNotification';
import ErrorNotification from '../../../../../../components/Organism/Notifications/ErrorNotification/ErrorNotification';
import Loader from '../../../../../../components/Organism/Loader/Loader';
import profileLevelInitData from './profileLevelInitData';

import HasAccess from '../../../../../../services/HasAccess/HasAccess';

let hasEditAccess = false;

class ProfileLevel extends Component {

    state = {
        enableNext: true,
        services: [
            ...profileLevelInitData
        ],
        selectedValue: 'ALL_SECTIONS',
        showSaveButton: false,
        checkAccess: true,
        submitSuccess: false
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
            if(_.isEmpty(this.props.statusData.servicesEnabled)){
                const { match, location } = this.props;
                let params = queryString.parse(location.search);
                const orgId = match.params.uuid;
                let url = '/customer-mgmt/org/' + orgId + '/config/bgv-select';
                if(!_.isEmpty(params)){
                    url += location.search;
                }
                this.props.history.push(url);
            } else if (this.props.statusData.statusManagement !== undefined && this.props.statusData.statusManagement.profileLevelRules !== undefined) {
                let postedService = this.props.statusData.statusManagement.profileLevelRules;
                this.setState({ selectedValue: postedService[0] ? postedService[0].section : '', enableNext: false })
            }
        }

        if (prevProps.postProfileLevelDataState !== this.props.postProfileLevelDataState && this.props.postProfileLevelDataState === 'SUCCESS') {
            this.setState({ submitSuccess: true })
            setTimeout(() => {
                this.setState({ submitSuccess: false })
            }, 5000);
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
        let postData = _.cloneDeep(this.state.services);
        postData = postData.filter(each => {
            if (each.section === this.state.selectedValue)
                return each;
            return null
        })

        let level = 'profile_level';
        postData = {
            statusManagement: {
                profileLevelRules: postData,
            },
            status: 'done'
        }
        this.props.postData(postData, orgId, from, to, level, viaUrl)
        this.setState({ enableNext: false, showSaveButton: true })

        setTimeout(() => {
            this.setState({ showSaveButton: false })
        }, 2000);
    }

    handleInputChange = (value) => {
        let updatedService = {
            section: value,
            statusFrom: 'GREEN',
            statusTo: 'GREEN'
        }
        this.setState({
            services: [updatedService],
            selectedValue: value,
            enableNext: true
        })
    }

    successClickedHandler = () => {
        this.setState({ submitSuccess: false })
    }

    errorClickedHandler = () => {
        this.props.onResetError();
    }

    componentWillUnmount = () => {
        this.props.initState();
    }

    render() {
        const { match, location } = this.props;
        let orgId = match.params.uuid;
        let params = queryString.parse(location.search);
        const { t } = this.props;

        let options = [
            { value: 'ANY', label: 'any' },
            { value: 'ALL_SECTIONS', label: 'all sections' }
        ]

        if (!_.isEmpty(this.props.statusData.servicesEnabled)) {
            let updatedOption, docConfigured = false, legalConfigured = false,
                careerConfigured = false, addressConfigured = false;
            this.props.statusData.servicesEnabled.map(item => {
                if (item.type === 'DOCUMENT') {
                    updatedOption = { value: 'IDCARDS', label: 'id cards' }
                    if (!docConfigured) {
                        options = options.concat(updatedOption);
                    }
                    docConfigured = true;
                }
                else if (item.type === 'ADDRESS') {
                    updatedOption = { value: 'ADDRESS', label: 'address' }
                    if (!addressConfigured) {
                        options = options.concat(updatedOption);
                    }
                    addressConfigured = true;
                }
                else if (item.type === 'LEGAL') {
                    updatedOption = { value: 'LEGAL', label: 'legal' }
                    if (!legalConfigured) {
                        options = options.concat(updatedOption);
                    }
                    legalConfigured = true;
                }
                else if (item.type === 'CAREER') {
                    updatedOption = { value: 'CAREER', label: 'career' }
                    if (!careerConfigured) {
                        options = options.concat(updatedOption);
                    }
                    careerConfigured = true;
                }
                return null;
            })
        }

        let NotificationPan =
            (this.props && this.props.error) ?

                <div className={this.props.error ? cx(styles.ShowErrorNotificationCard, 'flex align-items-center') : cx(styles.HideErrorNotificationCard)}>
                    <ErrorNotification error={this.props.error} clicked={this.errorClickedHandler} />
                </div>
                :
                (this.state.submitSuccess) ?
                    <div className={this.state.submitSuccess ? cx(styles.ShowSuccessNotificationCard, 'flex align-items-center') : cx(styles.HideSuccessNotificationCard)}>
                        <SuccessNotification clicked={this.successClickedHandler} />
                    </div>
                    :
                    <div className={styles.emptyNotification}></div>

        return (
            this.props.getSelectedDataState === 'LOADING' || this.props.getStatusDataState === 'LOADING' ?
                <div className={cx('col-12 px-0')}>
                    <Loader type='statusMgmt' />
                </div>
                :
                <React.Fragment>

                    {this.state.checkAccess ?
                        <HasAccess
                            permission={["BGV_CONFIG:CREATE"]}
                            orgId={orgId}
                            yes={() => this.handleSetEditAccess()}
                        />
                        : null}

                    <div className={cx(styles.cardLayout, 'row no-gutters card col-12 px-0')}>
                    <div disabled={!_.isEmpty(params.vendorId)}>
                        {NotificationPan}
                        <div className={styles.paddingX}>
                            <label className={styles.sectionName}>
                                {t('translation_orgStatusMgmtProfileLevel:label_orgStatusMgmtProfileLevel.profile')}
                            </label>
                            <div className='row mt-3 mb-3 no-gutters'>
                                <span className={styles.Text}>
                                    {t('translation_orgStatusMgmtProfileLevel:text_orgStatusMgmtProfileLevel.if')}
                                </span>

                                <CustomSelect
                                    name='status'
                                    className='mx-3 col-3'
                                    required
                                    disabled={!hasEditAccess}
                                    options={options}
                                    value={this.state.selectedValue}
                                    onChange={(value) => this.handleInputChange(value)}
                                />

                                <span className={styles.Text}>
                                    {t('translation_orgStatusMgmtProfileLevel:text_orgStatusMgmtProfileLevel.is')}
                                </span>
                                <span className={styles.GreenCard}>
                                    <img src={greenCase} alt={t('translation_orgStatusMgmtCheckLevel:image_alt_orgStatusMgmtCheckLevel.green')} />
                                    <span className={cx('ml-1', styles.Text)}>
                                        {t('translation_orgStatusMgmtProfileLevel:text_orgStatusMgmtProfileLevel.green')}
                                    </span>
                                </span>
                                <span className={styles.Text}>
                                    {t('translation_orgStatusMgmtProfileLevel:text_orgStatusMgmtProfileLevel.thenProfile')}
                                    <span className={styles.TextBold}>&nbsp;"{t('translation_orgStatusMgmtProfileLevel:text_orgStatusMgmtProfileLevel.Green')}"</span>
                                </span>
                            </div>
                        </div>
                        <div className={styles.paddingX}>
                            <hr className={cx(styles.HorizontalLine)} />

                            <div className={cx(styles.warning)}>{t('translation_orgStatusMgmtProfileLevel:bottomHeading')}</div>
                            <div className='row no-gutters'>

                                <div className='d-flex flex-column'>
                                    <label className={styles.smallText}>
                                        <img className={cx('mr-2')} src={redCase} alt={t('translation_orgStatusMgmtProfileLevel:image_alt_orgStatusMgmtProfileLevel.red')} />
                                        {t('translation_orgStatusMgmtProfileLevel:text_orgStatusMgmtProfileLevel.redInfo')}
                                    </label>
                                    <label className={styles.smallText}>
                                        <img className={cx('mr-2')} src={greenCaseLarge} alt={t('translation_orgStatusMgmtProfileLevel:image_alt_orgStatusMgmtProfileLevel.green')} />
                                        {t('translation_orgStatusMgmtProfileLevel:text_orgStatusMgmtProfileLevel.greenInfo')}
                                    </label>
                                    <label className={styles.smallText}>
                                        <img className={cx('mr-2')} src={yellowCase} alt={t('translation_orgStatusMgmtProfileLevel:image_alt_orgStatusMgmtProfileLevel.yellow')} />
                                        {t('translation_orgStatusMgmtProfileLevel:text_orgStatusMgmtProfileLevel.yellowInfo')}
                                    </label>
                                </div>


                                <span className={cx('ml-auto', styles.MarginTop)}>
                                    {this.props.postProfileLevelDataState === 'LOADING' ?
                                        <Spinnerload type='loading' />
                                        :
                                        this.state.showSaveButton ?
                                            this.props.error ? <Spinnerload /> :
                                                <Spinnerload type='success' />
                                            :
                                            <HasAccess
                                                permission={["BGV_CONFIG:CREATE"]}
                                                orgId={orgId}
                                                yes={() =>
                                                    <Button label={t('translation_orgStatusMgmtProfileLevel:text_orgStatusMgmtProfileLevel.save')}
                                                        type='save'
                                                        isDisabled={!this.state.enableNext}
                                                        clickHandler={this.handleNext}>
                                                    </Button>
                                                }
                                                no={() =>
                                                    <Button label={t('translation_orgStatusMgmtProfileLevel:text_orgStatusMgmtProfileLevel.save')}
                                                        type='save'
                                                        isDisabled={!this.state.enableNext}
                                                        clickHandler={this.handleNext}>
                                                    </Button>
                                                }
                                            />
                                    }
                                </span>
                            </div>
                            </div>
                        </div>
                    </div>

                </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        getStatusDataState: state.orgMgmt.orgBgvConfig.statusMgmt.getStatusDataState,
        statusData: state.orgMgmt.orgBgvConfig.statusMgmt.statusData,
        postProfileLevelDataState: state.orgMgmt.orgBgvConfig.statusMgmt.postProfileLevelDataState,
        error: state.orgMgmt.orgBgvConfig.statusMgmt.error,
        rightnavOrgId: state.orgMgmt.staticData.rightnavOrgId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        initState: () => dispatch(actions.getInitState()),
        postData: (data, orgId, from, to, level, viaUrl) => dispatch(actions.postData(data, orgId, from, to, level, viaUrl)),
        getPostedData: (orgId, from, to, viaUrl) => dispatch(actions.getStatusData(orgId, from, to, viaUrl)),
        onResetError: () => dispatch({ type: actionTypes.RESET_ERROR }),
        getOrgData: (orgId) => dispatch(actionsOrgMgmt.getDataById(orgId))
    };
};

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(ProfileLevel)));