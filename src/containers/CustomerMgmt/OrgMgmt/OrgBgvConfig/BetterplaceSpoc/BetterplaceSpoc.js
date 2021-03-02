import React, { Component } from 'react';
import { Redirect } from 'react-router'
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import * as actions from './Store/action';
import * as actionsOrgMgmt from '../../OrgMgmtStore/action';
import cx from 'classnames';
import _ from 'lodash';
import queryString from 'query-string';
import styles from './BetterplaceSpoc.module.scss';
import SpocCard from '../ClientSpoc/SpocCard/SpocCard';
import CardHeader from '../../../../../components/Atom/PageTitle/PageTitle';
import bgvConfMap from '../../../../../assets/icons/bgvConfMap.svg';
import plus from '../../../../../assets/icons/search.svg';
import { Button } from 'react-crux';
import { withTranslation } from 'react-i18next';
import ArrowLink from '../../../../../components/Atom/ArrowLink/ArrowLink';
import ErrorNotification from '../../../../../components/Organism/Notifications/ErrorNotification/ErrorNotification';
import HasAccess from '../../../../../services/HasAccess/HasAccess';
import Loader from '../../../../../components/Organism/Loader/SpocLoader/SpocLoader';
import scrollStyle from '../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import VendorDropdown from '../../../../VendorSearch/VendorDropdown/VendorDropdown';

let mobileRegex = /^([+][9][1]|[9][1]|[0]){0,1}([ ]{0,1})([0-9]{1})([0-9]{9})$/
let emailRegex = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/

let hasEditAccess = false;

class BetterplaceSpoc extends Component {

    state = {
        enableSave: true,

        inputManagerValue: '',
        selectedManagerList: [],
        managerIdArray: [],
        tagManager: [],

        inputAnalystValue: '',
        selectedAnalystList: [],
        analystIdArray: [],
        tagAnalyst: [],
        // hasEditAccess: false,
        checkAccess: true,
        betterplaceOrgId: null
    }

    componentDidMount = () => {
        this.props.initState();

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

        this.props.onGetSelectedSpocs(orgId, from, to, viaUrl); //to get selected spocs, if any
        if (_.isEmpty(this.props.orgData) && orgId) {
            this.props.getOrgData(orgId)
        }
        if (orgId !== this.props.rightnavOrgId) {
            this.props.getOrgData(orgId)
        }
        document.addEventListener('click', this.handleClick, false);
    }

    componentDidUpdate = (prevProps, prevState) => {
        const { match } = this.props;
        let orgId = match.params.uuid;
        if (prevState.inputManagerValue !== this.state.inputManagerValue) {
            if (this.state.inputManagerValue.length !== 0) {
                this.props.onSearchEmployee(orgId, this.state.inputManagerValue); //search api
            }
            else {
                this.props.initState();
            }
        }

        if (prevState.inputAnalystValue !== this.state.inputAnalystValue) {
            if (this.state.inputAnalystValue.length !== 0) {
                this.props.onSearchEmployee(orgId, this.state.inputAnalystValue);
            }
            else {
                this.props.initState();
            }
        }

        if (this.props.allSelectedSpocsState !== prevProps.allSelectedSpocsState && this.props.allSelectedSpocsState === 'SUCCESS') {
            this.handleSelectedSpocs(); //matching the uuid to contact and updating contact array of uuids
        }

        if (this.props.getEmpDetailsById !== prevProps.getEmpDetailsById && this.props.getEmpDetailsState === 'SUCCESS') {
            this.handleGetSelectedSpocs(); // update state of selectedcards
        }

        if (this.props.getSingleEmpDataState !== prevProps.getSingleEmpDataState && this.props.getSingleEmpDataState === 'SUCCESS') {
            this.handleDesignation();
        }

        // if (this.state.hasEditAccess !== prevState.hasEditAccess) {
        //     this.setState({ checkAccess: false })
        // }

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
            this.setState({selectedManagerList: [],
                selectedAnalystList: [],
                managerIdArray: [],
                tagManager: [],
                analystIdArray: [],
                tagAnalyst: [],
            })
        }
    }

    handleDesignation = () => {
        let singleEmpData = _.cloneDeep(this.props.singleEmpData);
        let updatedSelectedManagerList = _.cloneDeep(this.state.selectedManagerList);
        let updatedSelectedAnalystList = _.cloneDeep(this.state.selectedAnalystList);

        // primary contact for each employee
        if (!_.isEmpty(singleEmpData)) {
            _.forEach(updatedSelectedManagerList, function (eachMg) {
                _.forEach(singleEmpData, function (empData) {
                    if (eachMg.uuid === empData.uuid) {
                        eachMg.designation = empData.defaultRole;
                        if (!_.isEmpty(empData.contacts)) {
                            _.forEach(empData.contacts, function (empContact) {
                                _.forEach(eachMg.contacts, function (mgContact) {
                                    if (empContact.uuid === mgContact.uuid) {
                                        if (mgContact.isPrimary && mgContact.type === 'MOBILE') {
                                            mgContact.contact = empContact.contact;
                                        }
                                        if (mgContact.isPrimary && mgContact.type === 'EMAIL') {
                                            mgContact.contact = empContact.contact;
                                        }
                                    }
                                })
                            })
                        }
                    }
                })
            })

            _.forEach(updatedSelectedAnalystList, function (eachAnalyst) {
                _.forEach(singleEmpData, function (empData) {
                    if (eachAnalyst.uuid === empData.uuid) {
                        eachAnalyst.designation = empData.defaultRole;
                        if (!_.isEmpty(empData.contacts)) {
                            _.forEach(empData.contacts, function (empContact) {
                                _.forEach(eachAnalyst.contacts, function (analystContact) {
                                    if (empContact.uuid === analystContact.uuid) {
                                        if (analystContact.isPrimary && analystContact.type === 'MOBILE') {
                                            analystContact.contact = empContact.contact;
                                        }
                                        if (analystContact.isPrimary && analystContact.type === 'EMAIL') {
                                            analystContact.contact = empContact.contact;
                                        }
                                    }
                                })
                            })
                        }
                    }
                })
            })
        }
        this.setState({ selectedManagerList: updatedSelectedManagerList, selectedAnalystList: updatedSelectedAnalystList })
    }

    handleSelectedSpocs = () => {
        if(!_.isEmpty(this.props.configuredData.servicesEnabled)){
            if (!_.isEmpty(this.props.allSelectedSpocs)) {
                let getSelectedManager = _.cloneDeep(this.props.allSelectedSpocs.OpsManager);
                let updatedManagerArray = _.cloneDeep(this.state.managerIdArray);

                let getSelectedAnalyst = _.cloneDeep(this.props.allSelectedSpocs.OpsAnalyst);
                let updatedAnalystArray = _.cloneDeep(this.state.analystIdArray);

                if (updatedManagerArray !== undefined || updatedManagerArray !== null) {
                    getSelectedManager.map(id => {
                        if (!_.includes(updatedManagerArray, id)) {
                            updatedManagerArray.push(id);
                        }
                        return updatedManagerArray;
                    })
                }

                if (updatedAnalystArray !== undefined || updatedAnalystArray !== null) {
                    getSelectedAnalyst.map(id => {
                        if (!_.includes(updatedAnalystArray, id)) {
                            updatedAnalystArray.push(id);
                        }
                        return updatedAnalystArray;
                    })
                }
                let empArray = updatedManagerArray.concat(updatedAnalystArray);
                if (empArray.length > 0) this.props.onGetEmployeeById(this.props.allSelectedSpocs.orgId, empArray);
                this.setState({ managerIdArray: updatedManagerArray, analystIdArray: updatedAnalystArray, betterplaceOrgId: this.props.allSelectedSpocs.orgId })
            }
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

    handleGetSelectedSpocs = () => {
        let empDetails = !_.isEmpty(this.props.getEmpDetailsById) ? _.cloneDeep(this.props.getEmpDetailsById) : '';

        let updatedSelectedManagerList = _.cloneDeep(this.state.selectedManagerList);
        let updatedSelectedAnalystList = _.cloneDeep(this.state.selectedAnalystList);

        let updatedManagerArray = _.cloneDeep(this.state.managerIdArray);
        let updatedAnalystArray = _.cloneDeep(this.state.analystIdArray);

        if (!_.isEmpty(empDetails)) {
            _.forEach(empDetails, function (employee) {
                if (updatedManagerArray.includes(employee.uuid)) {
                    let updatedEmployee = { ...employee, designation: employee.defaultRole };
                    updatedSelectedManagerList.push(updatedEmployee);

                } else if (updatedAnalystArray.includes(employee.uuid)) {
                    let updatedEmployee = { ...employee, designation: employee.defaultRole };
                    updatedSelectedAnalystList.push(updatedEmployee);
                }
            })
        }

        this.setState({
            selectedManagerList: updatedSelectedManagerList,
            selectedAnalystList: updatedSelectedAnalystList
        });
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
        

        let status = 'inProgress'
        if (this.props.configuredData && this.props.configuredData.status) {
            status = this.props.configuredData.status === 'done' ? 'done' : status;
        }

        let payload = {
            betterplaceSpocs: [
                {
                    OpsManager: this.state.managerIdArray,
                    OpsAnalyst: this.state.analystIdArray,
                    orgId: this.state.betterplaceOrgId,
                }
            ],
            status: status
        }
        this.props.onPostSelectedCards(payload, orgId, from, to, viaUrl);

        this.setState({ enableSave: false })
    }

    handleInputChange = (event, type) => { //value is entered
        let updatedInput = event.target.value;
        if (type === 'manager') {
            this.setState({ inputManagerValue: updatedInput, inputAnalystValue: '' });
        }
        else {
            this.setState({ inputManagerValue: '', inputAnalystValue: updatedInput });
        }
    };

    handleSelectedValue = (targetUuid, typeOfOps) => { //called when contact selected from dropdown
        let orgContactList = !_.isEmpty(this.props.orgContactList) ? this.props.orgContactList : ''; //selected from dropdown option
        let updatedTagManager = _.cloneDeep(this.state.tagManager);
        let updatedTagAnalyst = _.cloneDeep(this.state.tagAnalyst);

        if (typeOfOps === 'manager') {
            let selectedCards = _.cloneDeep(this.state.selectedManagerList);
            let updatedContactList = _.cloneDeep(this.state.managerIdArray);

            _.forEach(orgContactList, function (contact) {
                if (contact.uuid === targetUuid) {
                    selectedCards.push(contact);
                    updatedContactList.push(contact.uuid);
                }
            })

            selectedCards = selectedCards.map(manager => { //creating additional designation field inside state
                return ({
                    ...manager,
                    designation: ''
                })
            })

            this.setState({
                inputManagerValue: '',
                selectedManagerList: selectedCards,
                managerIdArray: updatedContactList
            })

            if (!_.isEmpty(selectedCards)) {
                _.forEach(selectedCards, function (mg) {
                    if (!_.isEmpty(mg.defaultRole)) {
                        updatedTagManager.push(mg.defaultRole);
                    }
                })
            }
            this.props.onGetSingleEmpById(updatedContactList, orgContactList[0].orgId);
        }

        else if (typeOfOps === 'analyst') {
            let selectedCards = _.cloneDeep(this.state.selectedAnalystList);
            let updatedContactList = _.cloneDeep(this.state.analystIdArray);

            _.forEach(orgContactList, function (contact) {
                if (contact.uuid === targetUuid) {
                    selectedCards.push(contact);
                    updatedContactList.push(contact.uuid);
                }
            })

            selectedCards = selectedCards.map(analyst => {
                return ({
                    ...analyst,
                    designation: ''
                })
            })
            this.setState({
                inputAnalystValue: '',
                selectedAnalystList: selectedCards,
                analystIdArray: updatedContactList
            })

            if (!_.isEmpty(selectedCards)) {
                _.forEach(selectedCards, function (analyst) {
                    if (!_.isEmpty(analyst.defaultRole)) {
                        updatedTagAnalyst.push(analyst.defaultRole)
                    }
                })
            }
            this.props.onGetSingleEmpById(updatedContactList, orgContactList[0].orgId);
        }
        this.setState({ betterplaceOrgId: orgContactList[0].orgId })
    }

    handleCloseSpocCard = (uuid, typeOfOps) => {
        if (typeOfOps === 'manager') {
            let selectedContacts = _.cloneDeep(this.state.selectedManagerList);
            let updatedContactList = _.cloneDeep(this.state.managerIdArray);

            if (!_.isEmpty(selectedContacts)) { //unselect a spoc card
                selectedContacts = selectedContacts.filter(spoc => {
                    if (spoc.uuid === uuid) return null;
                    return selectedContacts;
                })
            }

            if (!_.isEmpty(this.state.managerIdArray)) { //removing the same from uuidarray
                updatedContactList = this.state.managerIdArray.filter(selectedUuid => {
                    if (selectedUuid === uuid) return null;
                    return selectedUuid;
                })
            }
            this.setState({
                selectedManagerList: selectedContacts,
                managerIdArray: updatedContactList
            })
        }
        else if (typeOfOps === 'analyst') {
            let selectedContacts = _.cloneDeep(this.state.selectedAnalystList);
            let updatedContactList = _.cloneDeep(this.state.analystIdArray);

            if (!_.isEmpty(selectedContacts)) { //unselect a spoc card
                selectedContacts = selectedContacts.filter(spoc => {
                    if (spoc.uuid === uuid) return null;
                    return selectedContacts;
                })
            }

            if (!_.isEmpty(this.state.analystIdArray)) { //removing the same from uuidarray
                updatedContactList = this.state.analystIdArray.filter(selectedUuid => {
                    if (selectedUuid === uuid) return null;
                    return selectedUuid;
                })
            }
            this.setState({
                selectedAnalystList: selectedContacts,
                analystIdArray: updatedContactList
            })
        }
    }

    handleClick = () => {
        if (this.dropDownDiv) {
            this.props.initState();
        }
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClick, false);
        this.props.initState();
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

        let newContactList = this.props.orgContactList;

        const { t } = this.props;
        const { match, location } = this.props;
        let params = queryString.parse(location.search);
        let orgId = match.params.uuid;
        let url = "/customer-mgmt/org/" + orgId + "/config/bgv-clientspoc";
        if(!_.isEmpty(params)){
            url += location.search;
        }
        const showVendorDropDown = this.handleShowVendorDropDown();
        let NotificationPan = (this.props.error) ?
            <div className={this.props.error ? cx(styles.ShowErrorNotificationCard, 'flex align-items-center') : cx(styles.HideErrorNotificationCard)}>
                <ErrorNotification error={this.props.error} />
            </div> :
            null

        return (
            <React.Fragment>
                {
                    (this.props.postContactListState === 'SUCCESS') ?
                        <Redirect to={url} /> : null
                }
                {this.state.checkAccess ?
                    <HasAccess
                        permission={["BGV_CONFIG:CREATE"]}
                        orgId={orgId}
                        yes={() => this.handleSetEditAccess()}
                    />
                    : null}
                {this.props.allSelectedSpocsState === 'LOADING' || this.props.getEmpDetailsState === 'LOADING' ?
                    <div className={styles.alignCenter} style={{ marginTop: '3.2rem' }}>
                        <Loader />
                    </div>
                    :
                    <div className={styles.alignCenter}>
                        <ArrowLink
                            label={_.isEmpty(this.props.orgData) ? " " : this.props.orgData.name.toLowerCase()}
                            url={`/customer-mgmt/org/` + orgId + `/profile`}
                        />
                        <div className="d-flex">
                            <CardHeader label={t('translation_orgBgvBetterplaceSpoc:cardHeader')} iconSrc={bgvConfMap} />
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
                                    <label className={cx(styles.TextSelect)}>{t('translation_orgBgvBetterplaceSpoc:OpsManager')}</label>
                                </div>

                                <div className={cx('mt-2 col-8', styles.addSpoc)}>
                                    <img className='pr-2 mt-0' src={plus} alt={t('translation_orgBgvBetterplaceSpoc:image_alt.plus')} />
                                    <input
                                        name='manager'
                                        className={cx("pl-1 pr-2 ", styles.searchBar)}
                                        type='text'
                                        value={this.state.inputManagerValue}
                                        placeholder={t('translation_orgBgvBetterplaceSpoc:add')}
                                        onChange={(event) => this.handleInputChange(event, 'manager')}
                                        disabled={!hasEditAccess}
                                        autoComplete={'off'}
                                    />
                                </div>

                                {!_.isEmpty(this.state.inputManagerValue) ?
                                    <div className={cx(styles.dropdownMenu, scrollStyle.scrollbar)}>
                                        {!_.isEmpty(newContactList) ?
                                            newContactList.map((result, index) => {
                                                if (_.includes(this.state.managerIdArray, result.uuid) || _.includes(this.state.analystIdArray, result.uuid)) return null;
                                                else return (
                                                    <div key={index} ref={dropDownDiv => this.dropDownDiv = dropDownDiv}>
                                                        <div className={cx(styles.tagDropDown)}
                                                            onClick={() => this.handleSelectedValue(result.uuid, 'manager')}>
                                                            {result.firstName + " " + result.lastName}
                                                        </div>
                                                    </div>
                                                )

                                            })
                                            : ''}
                                    </div>
                                    : ''}

                                <div className='d-flex justify-content-between flex-wrap mt-3'>
                                    {!_.isEmpty(this.state.selectedManagerList) ?
                                        this.state.selectedManagerList.map((spoc, index) => {
                                            let primaryMobile, primaryEmail;
                                            if (spoc.contacts) {
                                                _.forEach(spoc.contacts, function (contact) {
                                                    if (contact.type === 'MOBILE' && contact.isPrimary && mobileRegex.test(contact.contact)) primaryMobile = contact.contact;
                                                    if (contact.type === 'EMAIL' && contact.isPrimary && emailRegex.test(contact.contact)) primaryEmail = contact.contact;
                                                })
                                            }
                                            return (
                                                <SpocCard
                                                    key={index}
                                                    name={spoc.firstName ? spoc.firstName + (spoc.lastName ? ' ' + spoc.lastName : '') : '--'}
                                                    designation={spoc.designation ? spoc.designation : '--'}
                                                    phoneNumber={primaryMobile}
                                                    emailId={primaryEmail}
                                                    profilePicUrl={spoc.profilePicUrl}
                                                    empId={spoc.uuid}
                                                    isChecked={true}
                                                    changed={() => this.handleCloseSpocCard(spoc.uuid, 'manager')}
                                                />
                                            )
                                        }) :
                                        <div className={styles.subHeading}><i>{t('translation_orgBgvBetterplaceSpoc:search')}</i></div>
                                    }
                                </div>

                                <hr className={styles.HorizontalLine} />

                                <div>
                                    <label className={cx(styles.TextSelect)}>{t('translation_orgBgvBetterplaceSpoc:OpsAnalyst')}</label>
                                </div>

                                <div className={cx('mt-2 col-8', styles.addSpoc)}>
                                    <img className='pr-2' src={plus} alt={t('translation_orgBgvBetterplaceSpoc:image_alt.plus')} />
                                    <input
                                        name='analyst'
                                        className={cx("pl-1 pr-2", styles.searchBar)}
                                        type='text'
                                        value={this.state.inputAnalystValue}
                                        placeholder={t('translation_orgBgvBetterplaceSpoc:add')}
                                        onChange={(event) => this.handleInputChange(event, 'analyst')}
                                        disabled={!hasEditAccess}
                                        autoComplete={'off'}
                                    />
                                </div>


                                {!_.isEmpty(this.state.inputAnalystValue) ?
                                    <div className={cx(styles.dropdownMenu, scrollStyle.scrollbar)}>
                                        {!_.isEmpty(newContactList) ?
                                            newContactList.map((result, index) => {
                                                if (_.includes(this.state.analystIdArray, result.uuid) || _.includes(this.state.managerIdArray, result.uuid)) return null;
                                                else return (
                                                    <div key={index} ref={dropDownDiv => this.dropDownDiv = dropDownDiv}>
                                                        <div className={cx(styles.tagDropDown)}
                                                            onClick={() => this.handleSelectedValue(result.uuid, 'analyst')}>
                                                            {result.firstName + " " + result.lastName}
                                                        </div>
                                                    </div>
                                                )

                                            })
                                            : ''}
                                    </div> : ''
                                }

                                <div className='d-flex justify-content-between flex-wrap mt-3'>
                                    {!_.isEmpty(this.state.selectedAnalystList) ?
                                        this.state.selectedAnalystList.map((spoc, index) => {
                                            let primaryMobile, primaryEmail;
                                            if (spoc.contacts) {
                                                _.forEach(spoc.contacts, function (contact) {
                                                    if (contact.type === 'MOBILE' && contact.isPrimary && mobileRegex.test(contact.contact)) primaryMobile = contact.contact;
                                                    if (contact.type === 'EMAIL' && contact.isPrimary && emailRegex.test(contact.contact)) primaryEmail = contact.contact;
                                                })
                                            }
                                            return (
                                                <SpocCard
                                                    key={index}
                                                    name={spoc.firstName ? spoc.firstName + (spoc.lastName ? ' ' + spoc.lastName : '') : '--'}
                                                    designation={spoc.designation ? spoc.designation : '--'}
                                                    phoneNumber={primaryMobile}
                                                    emailId={primaryEmail}
                                                    profilePicUrl={spoc.profilePicUrl}
                                                    empId={spoc.uuid}
                                                    isChecked={true}
                                                    changed={() => this.handleCloseSpocCard(spoc.uuid, 'analyst')}
                                                />
                                            )
                                        })
                                        :
                                        <div className={styles.subHeading}><i>{t('translation_orgBgvBetterplaceSpoc:search')}</i></div>
                                    }
                                </div>

                                <hr className={styles.HorizontalLine} />

                                <span>
                                    <Button
                                        className={cx("float-right mt-2", styles.ButtonMargin)}
                                        label={t('translation_orgBgvBetterplaceSpoc:button_bpspoc:next')}
                                        type='medium'
                                        isDisabled={!this.state.enableSave}
                                        clickHandler={() => this.nextHandler()}
                                    />
                                </span>
                            </div>
                        </div>
                    </div>}

            </React.Fragment >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        error: state.orgMgmt.orgBgvConfig.bpSpoc.error,
        orgContactList: state.orgMgmt.orgBgvConfig.bpSpoc.getContactList,
        orgContactListState: state.orgMgmt.orgBgvConfig.bpSpoc.getContactListState,
        postContactListState: state.orgMgmt.orgBgvConfig.bpSpoc.postSelectedSpocs,
        allSelectedSpocs: state.orgMgmt.orgBgvConfig.bpSpoc.postedContacts,
        allSelectedSpocsState: state.orgMgmt.orgBgvConfig.bpSpoc.getPostedSpocs,
        getEmpDetailsById: state.orgMgmt.orgBgvConfig.bpSpoc.empDetails,
        getEmpDetailsState: state.orgMgmt.orgBgvConfig.bpSpoc.empDetailsState,
        getTagDataState: state.orgMgmt.orgBgvConfig.bpSpoc.tagDataState,
        getTagData: state.orgMgmt.orgBgvConfig.bpSpoc.tagData,
        rightnavOrgId: state.orgMgmt.staticData.rightnavOrgId,
        singleEmpData: state.orgMgmt.orgBgvConfig.bpSpoc.singleEmpData,
        getSingleEmpDataState: state.orgMgmt.orgBgvConfig.bpSpoc.singleEmpDataState,
        configuredData: state.orgMgmt.orgBgvConfig.bpSpoc.configuredData,
        orgData: state.orgMgmt.staticData.orgData,
        enabledServices: state.orgMgmt.staticData.servicesEnabled,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        initState: () => dispatch(actions.getInitState()),
        onSearchEmployee: (orgId, input) => dispatch(actions.getContactList(orgId, input)),
        onPostSelectedCards: (data, orgId, from, to, viaUrl) => dispatch(actions.postSelectedSpocs(data, orgId, from, to, viaUrl)),
        onGetSelectedSpocs: (orgId, from, to, viaUrl) => dispatch(actions.getSelectedSpocs(orgId, from, to, viaUrl)),
        onGetEmployeeById: (betterplaceOrgId, id) => dispatch(actions.getEmployeeById(betterplaceOrgId, id)),
        onGetTagName: (tagId) => dispatch(actions.getTagName(tagId)),
        getOrgData: (orgId) => dispatch(actionsOrgMgmt.getDataById(orgId)),
        onGetSingleEmpById: (empId, betterplaceOrgId) => dispatch(actions.getOneEmpById(empId, betterplaceOrgId)),
    }
}

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(BetterplaceSpoc)));