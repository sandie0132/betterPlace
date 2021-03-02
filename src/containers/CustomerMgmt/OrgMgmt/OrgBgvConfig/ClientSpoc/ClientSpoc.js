import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import _ from 'lodash';
import cx from 'classnames';
import styles from './ClientSpoc.module.scss';
import queryString from 'query-string';

import basic_details from '../../../../../assets/icons/bgvConfMap.svg';

import SpocCard from './SpocCard/SpocCard';
import ArrowLink from '../../../../../components/Atom/ArrowLink/ArrowLink';
import CardHeader from '../../../../../components/Atom/PageTitle/PageTitle';
import { Button } from 'react-crux';
import Loader from '../../../../../components/Organism/Loader/SpocLoader/SpocLoader';
import ErrorNotification from '../../../../../components/Organism/Notifications/ErrorNotification/ErrorNotification';
import VendorDropdown from '../../../../VendorSearch/VendorDropdown/VendorDropdown';

import * as actions from './Store/action';
import * as actionTypes from './Store/actionTypes';
import * as actionsOrgMgmt from '../../OrgMgmtStore/action';
import HasAccess from '../../../../../services/HasAccess/HasAccess';

let hasEditAccess = false;

class ClientSpoc extends Component {
    state = {
        enableSave: true,
        orgId: null,
        selectedUids: [],
        checkAccess: true
    }

    componentDidMount = () => {
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

        if (orgId) {
            this.setState({ orgId: orgId })
            this.props.onGetContactsListById(orgId);
            this.props.onGetSelectedSpocs(orgId, from, to, viaUrl);
        }
        if (_.isEmpty(this.props.orgData) && orgId) {
            this.props.onGetOrgData(orgId)
        }
        if (orgId !== this.props.rightnavOrgId) {
            this.props.onGetOrgData(orgId)
        }
    }

    componentDidUpdate = (prevProps) => {
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
            this.props.onGetSelectedSpocs(orgId, from, to, viaUrl);
        }

        if(prevProps.getPostedSpocs !== this.props.getPostedSpocs && this.props.getPostedSpocs === 'SUCCESS'){
            if(_.isEmpty(this.props.configuredData.servicesEnabled)){
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
    }

    componentWillUnmount() {
        this.props.initState();
    }

    radioChangeHandler = (Uid) => {
        let updatedSpocs = this.props.postedSpocs;
        if (this.props.postedSpocs.includes(Uid)) {
            updatedSpocs = this.props.postedSpocs.filter(spoc => {
                if (spoc !== Uid)
                    return spoc;
                else return null;
            })
        }
        else {
            updatedSpocs = [].concat(this.props.postedSpocs, Uid)
        }
        this.props.onUpdatePostedSpocs(updatedSpocs);
        this.setState({ enableSave: true })
    }

    nextHandler = () => {
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
        if (this.props.configuredData && this.props.configuredData.status) {
            status = this.props.configuredData.status === 'done' ? 'done' : status;
        }
        let payloadData = {
            clientSpocs: this.props.postedSpocs,
            status: status
        }
        this.props.onPostSelectedSpocs(payloadData, orgId, from, to, viaUrl);
        this.setState({ enableSave: false })
    }

    errorClickedHandler = () => {
        this.props.onResetError();
    }

    handleSetEditAccess = () => {
        // this.setState({ hasEditAccess: true })
        hasEditAccess = true;
        return true
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
        let { match, location } = this.props;

        let orgId = match.params.uuid;
        let params = queryString.parse(location.search);
        let url = "/customer-mgmt/org/" + orgId + "/config/bgv-status/check-level";
        if(!_.isEmpty(params)){
            url += location.search;
        }
        const showVendorDropDown = this.handleShowVendorDropDown();
        let NotificationPan =
            (this.props && this.props.error) ?
                <div className={this.props.error ? cx(styles.ShowErrorNotificationCard, 'flex align-items-center') : cx(styles.HideErrorNotificationCard)}>
                    <ErrorNotification error={this.props.errors} clicked={this.errorClickedHandler} />
                </div>
                : <div className={styles.emptyNotification}></div>


        let spocCards = this.props.orgContacts.map((contact, index) => {
            if ((this.props.postedSpocs.length === 0) ||
                (this.props.postedSpocs.length !== 0 && !this.props.postedSpocs.includes(contact.uuid))) {
                return (
                    <SpocCard key={contact.uuid ? contact.uuid : null}
                        name={contact.fullName ? contact.fullName : null}
                        designation={contact.designation ? contact.designation : null}
                        phoneNumber={contact.phoneNumber ? contact.phoneNumber : null}
                        emailId={contact.emailAddress ? contact.emailAddress : null}
                        id={contact.uuid ? contact.uuid : null}
                        isChecked={false}
                        changed={(event) => this.radioChangeHandler(contact.uuid)}
                        isDisabled={!hasEditAccess}
                    />
                );
            }
            else return '';
        })
        let selectedSpocCards = this.props.orgContacts.map(contact => {
            if (this.props.postedSpocs.length !== 0 && this.props.postedSpocs.includes(contact.uuid)) {
                return (
                    <SpocCard key={contact.uuid ? contact.uuid : null}
                        name={contact.fullName ? contact.fullName : null}
                        designation={contact.designation ? contact.designation : null}
                        phoneNumber={contact.phoneNumber ? contact.phoneNumber : null}
                        emailId={contact.emailAddress ? contact.emailAddress : null}
                        id={contact.uuid ? contact.uuid : null}
                        isChecked={true}
                        changed={(event) => this.radioChangeHandler(contact.uuid)}
                        isDisabled={!hasEditAccess}
                    />
                );
            }
            else return '';
        })

        selectedSpocCards = selectedSpocCards.filter(spoc => spoc !== '')
        return (
            <React.Fragment>
                {
                    this.props.postSelectedSpocsState === 'SUCCESS' ?
                        <Redirect to={url} /> : null
                }
                {this.state.checkAccess ?
                    <HasAccess
                        permission={["BGV_CONFIG:CREATE"]}
                        orgId={orgId}
                        yes={() => this.handleSetEditAccess()}
                    />
                    : null}

                {this.props.getContactList === 'LOADING' || this.props.getPostedSpocs === 'LOADING' ?
                    <div className={styles.alignCenter} style={{ marginTop: '3.2rem' }}>
                        <Loader />
                    </div> :
                    <div className={styles.alignCenter}>
                        <ArrowLink
                            label={_.isEmpty(this.props.orgData) ? " " : this.props.orgData.name.toLowerCase()}
                            url={`/customer-mgmt/org/` + orgId + `/profile`}
                        />  
                        <div className="d-flex">
                            <CardHeader label={t('translation_orgClientSpoc:cardHeader')} iconSrc={basic_details} />
                            <div className={cx("ml-auto mr-3",styles.paddingY)}>
                                {showVendorDropDown && <VendorDropdown type="primary"/>}
                            </div>
                            <div className={cx(styles.paddingY)}>
                                {showVendorDropDown && <VendorDropdown type="secondary"/>}
                            </div>
                        </div>
                        
                        <div className={cx(styles.CardLayout, 'card ')}>
                            {NotificationPan}
                            <div className={cx(styles.CardPadding, 'card-body')} disabled={!_.isEmpty(params.vendorId)}>
                                <div>
                                    <span className={cx(styles.TextSelect)}>{t('translation_orgClientSpoc:span.s1')}</span>
                                    <div className='row no-gutters mt-4 d-flex justify-content-between'>{spocCards}</div>
                                </div>
                                <div>
                                    <HasAccess
                                        permission={["ORG_CONTACT:CREATE"]}
                                        orgId={orgId}
                                        yes={() => (
                                            <div className={styles.subHeading}>
                                                <i>{t('translation_orgClientSpoc:span.s3')}</i>
                                                <NavLink to={`/customer-mgmt/org/${orgId}/contact`} className={styles.NavLink}><i className={styles.activeText}>{t('translation_orgClientSpoc:span.s5')}</i></NavLink>
                                            </div>
                                        )}
                                    />
                                    <hr className={styles.HorizontalLine} />
                                    <span className={cx(styles.TextSelect)}>{t('translation_orgClientSpoc:span.s2')}</span>

                                    {selectedSpocCards.length === 0 ?
                                        <div className={cx('row d-flex no-gutters justify-content-between mt-4', styles.subHeading)}><i>{t('translation_orgClientSpoc:span.s4')}</i></div>
                                        :
                                        <div className={cx('row d-flex no-gutters justify-content-between mt-4')}>{selectedSpocCards}</div>
                                    }
                                </div>
                                <hr className={styles.HorizontalLine} />
                                <span className='row no-gutters justify-content-end'>
                                    <Button
                                        label={t('translation_orgClientSpoc:button_orgClientSpoc.next')}
                                        type='medium'
                                        isDisabled={!this.state.enableSave}
                                        clickHandler={() => this.nextHandler()}
                                    />
                                </span>
                            </div>
                        </div>
                    </div>}

            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        orgContacts: state.orgMgmt.orgBgvConfig.clientSpoc.orgContacts,
        getContactList: state.orgMgmt.orgBgvConfig.clientSpoc.getContactList,
        getPostedSpocs: state.orgMgmt.orgBgvConfig.clientSpoc.getPostedSpocs,
        postedSpocs: state.orgMgmt.orgBgvConfig.clientSpoc.postedContacts,
        error: state.orgMgmt.orgBgvConfig.clientSpoc.error,
        postSelectedSpocsState: state.orgMgmt.orgBgvConfig.clientSpoc.postSelectedSpocs,
        rightnavOrgId: state.orgMgmt.staticData.rightnavOrgId,
        orgData: state.orgMgmt.staticData.orgData,
        configuredData: state.orgMgmt.orgBgvConfig.clientSpoc.configuredData,
        enabledServices: state.orgMgmt.staticData.servicesEnabled,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        initState: () => dispatch(actions.getInitState()),
        onGetContactsListById: (orgId) => dispatch(actions.getContactsListById(orgId)),
        onPostSelectedSpocs: (selectedUids, orgId, from, to) => dispatch(actions.postSelectedSpocs(selectedUids, orgId, from, to)),
        onGetSelectedSpocs: (orgId, from, to) => dispatch(actions.getSelectedSpocs(orgId, from, to)),
        onUpdatePostedSpocs: (updatedSpocs) => dispatch(actions.updatePostedSpocs(updatedSpocs)),
        onResetError: () => dispatch({ type: actionTypes.RESET_ERROR }),
        onGetOrgData: (orgId) => dispatch(actionsOrgMgmt.getDataById(orgId))
    }
}
export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(ClientSpoc)));