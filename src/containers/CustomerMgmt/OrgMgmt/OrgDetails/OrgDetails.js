import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';

import _ from 'lodash';
import cx from 'classnames';
import styles from './OrgDetails.module.scss';
import theme from "../../../../theme.scss";

import * as actions from './Store/action';
import { orgResetId } from '../OrgOnboarding/Store/action';
import * as actionsOnBoarding from '../OrgOnboarding/Store/action';
import * as actionsOrgMgmt from '../OrgMgmtStore/action';
import * as actionTypes from './Store/actionTypes';
import handleNullOrBlank from '../../../../utility/HandleNullOrBlank';

import { OrgDetailsInitData, requiredFields } from './OrgDetailsInitData';
import { validation, message } from "./OrgDetailsValidation";

import warn from '../../../../assets/icons/warning.svg';
import container from '../../../../assets/icons/orgDetailsIcon.svg';
import editEmp from '../../../../assets/icons/editEmp.svg';

import CustomSelect from '../../../../components/Atom/CustomSelect/CustomSelect';
import SuccessNotification from '../../../../components/Organism/Notifications/SuccessNotification/SuccessNotification';
import ErrorNotification from '../../../../components/Organism/Notifications/ErrorNotification/ErrorNotification';
import WarningPopUp from '../../../../components/Molecule/WarningPopUp/WarningPopUp';
import CardHeader from '../../../../components/Atom/PageTitle/PageTitle';
import { Button, Input } from 'react-crux';
import CancelButton from '../../../../components/Molecule/CancelButton/CancelButton';
import Loader from '../../../../components/Organism/Loader/Loader';
import Spinnerload from '../../../../components/Atom/Spinner/Spinner';
import BrandColor from '../../../../components/Molecule/BrandColor/BrandColor';
import ArrowLink from '../../../../components/Atom/ArrowLink/ArrowLink';
import Prompt from '../../../../components/Organism/Prompt/Prompt';

import HasAccess from "../../../../services/HasAccess/HasAccess";


class OrgDetails extends Component {
    state = {
        orgData: {
            ...OrgDetailsInitData
        },
        enableSubmit: false,
        submitSuccess: false,
        loading: true,
        viewMode: false,
        showCancelPopUp: false,
        noEdit: true,
        close: false,
        showSaveButton: false,
        editBack: false,
        errors: {}
    };
    _isMounted = false;

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
        if (window.innerWidth > 1024) {
            this.setState({
                showPanel: true
            })
        }

        this._isMounted = true;
        const { match } = this.props;
        const orgId = match.params.uuid;
        this.setState({ viewMode: orgId ? true : false });
        if (orgId) {
            this.props.onGetOrgDetailsById(orgId);
        }

        if (_.isEmpty(this.props.data) && orgId) {
            this.props.getOrgData(orgId)
        }

        if (_.isEmpty(this.props.idNo) && match.path === '/customer-mgmt/org/add') {
            let redirectUrl = '/customer-mgmt/org';
            this.props.history.push(redirectUrl);
        }
    }

    componentDidUpdate(prevProps, prevState) {

        if (prevProps.getDataState !== this.props.getDataState) {
            if (this.props.getDataState === 'SUCCESS') {
                this.handlePropsToState();
            }
        }

        if (prevProps.postPutDataState !== this.props.postPutDataState) {
            if (this.props.match.path === '/customer-mgmt/org/add' && this.props.postPutDataState === 'SUCCESS') {
                const orgId = this.props.orgData.uuid;
                this.props.getOrgData(orgId)
                let redirectPath = '/customer-mgmt/org/' + orgId;
                this.props.history.push(redirectPath);
                this.setState({ viewMode: true });
            }
            else if (this.props.match.path === '/customer-mgmt/org/:uuid' && this.props.postPutDataState === 'SUCCESS') {
                this.setState({ submitSuccess: true, showSaveButton: true, viewMode: true });
                const orgId = this.props.orgData.uuid;
                this.props.getOrgData(orgId)

                setTimeout(() => {
                    if (this._isMounted) {
                        this.setState({ submitSuccess: false, showSaveButton: false });
                    }
                }, 2000);
            }
        }

        // if (this.state.orgData !== prevState.orgData) {
        //     this.handleCheckError(true)
        // }

        if (!_.isEqual(this.state.errors, prevState.errors)) {
            let enableSubmit = true;
            if (!_.isEmpty(this.state.errors)) {
                enableSubmit = false;
            }
            else {
                enableSubmit = this.handleEnableSubmit(this.state.orgData);
            }
            this.setState({ enableSubmit: enableSubmit })
        }

        if (this.state.editBack !== prevState.editBack && this.state.editBack) {
            this.props.history.push('/customer-mgmt/org');

            if (this.props.showModal) {
                this.props.initOrgDetails();
            }
        }
    }

    handleEnableSubmit = (formData) => {
        let enableSubmit = true, fieldExist = true;
        const reqFields = requiredFields;

        _.forEach(formData, function (value, key) {
            if (key === 'address' || key === 'contactPerson') {
                _.forEach(value, function (val, index) {
                    if (reqFields.includes(index)) {
                        if (val === '' || val === null) {
                            fieldExist = false;
                        }
                    }
                })
            }
            else if (reqFields.includes(key)) {
                if (value === '' || value === null) {
                    fieldExist = false;
                }
            }
            enableSubmit = fieldExist && enableSubmit;
        });

        if (enableSubmit) {
            enableSubmit = enableSubmit && _.isEmpty(this.state.errors);
        }
        return (enableSubmit);
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.props.initOrgDetails();
        window.removeEventListener("resize", this.handleResize);
    }

    handlePropsToState = () => {
        let updatedOrgData = _.cloneDeep(this.props.orgData);
        updatedOrgData = {
            uuid: updatedOrgData.uuid ? updatedOrgData.uuid : '',
            name: updatedOrgData.name ? updatedOrgData.name : '',
            legalName: updatedOrgData.legalName ? updatedOrgData.legalName : '',
            organisationType: updatedOrgData.organisationType ? updatedOrgData.organisationType : null,
            industry: updatedOrgData.industry ? updatedOrgData.industry : null,
            website: updatedOrgData.website ? updatedOrgData.website : null,
            contactPerson: updatedOrgData.contactPerson ? handleNullOrBlank(updatedOrgData.contactPerson) : this.state.orgData.contactPerson,
            address: updatedOrgData.address ? handleNullOrBlank(updatedOrgData.address) : this.state.orgData.address,
            brandColor: updatedOrgData.brandColor ? updatedOrgData.brandColor : ''
        };
        this.setState({
            orgData: updatedOrgData,
            showCancelPopUp: false,
            noEdit: true,
            viewMode: true
        });
    }

    clickHandler = (event) => {
        this.setState({ submitSuccess: false });
    };

    errorClickedHandler = (event) => {
        this.props.onResetError();
    }

    formSubmitHandler = () => {
        let document = {};
        if (!_.isEmpty(this.props.idCardType)) {
            if (this.props.idCardType === 'PAN') { document.type = 'PAN' }
            else if (this.props.idCardType === 'GST') { document.type = 'GST' }
            else if (this.props.idCardType === 'CIN') { document.type = 'CIN' }
            else if (this.props.idCardType === 'LLPIN') { document.type = 'LLPIN' }
            else if (this.props.idCardType === 'TAN') { document.type = 'TAN' }
            document.documentNumber = this.props.idNo;
        }

        if (_.isEmpty(document)) {
            const orgDetails = {
                uuid: this.state.orgData.uuid,
                name: this.state.orgData.name,
                legalName: this.state.orgData.legalName,
                organisationType: this.state.orgData.organisationType,
                industry: this.state.orgData.industry,
                website: this.state.orgData.website === '' ? null : this.state.orgData.website,
                address: this.state.orgData.address,
                contactPerson: this.state.orgData.contactPerson,
                downloadURL: this.state.orgData.downloadURL,
                brandColor: this.state.orgData.brandColor
            }
            if (this.state.orgData.uuid) {
                this.props.onPutOrgDetails(orgDetails);
            }
            else {
                this.props.onPostOrgDetails(orgDetails);
            }
        }
        else {
            const orgDetails = {
                uuid: this.state.orgData.uuid,
                name: this.state.orgData.name,
                legalName: this.state.orgData.legalName,
                organisationType: this.state.orgData.organisationType,
                industry: this.state.orgData.industry,
                website: this.state.orgData.website === '' ? null : this.state.orgData.website,
                address: this.state.orgData.address,
                contactPerson: this.state.orgData.contactPerson,
                downloadURL: this.state.orgData.downloadURL,
                brandColor: this.state.orgData.brandColor,
                document: document
            }
            if (this.state.orgData.uuid) {
                this.props.onPutOrgDetails(orgDetails);
            }
            else {
                this.props.onPostOrgDetails(orgDetails);
            }
        }
        this.setState({
            noEdit: true,
            enableSubmit: false
        })
    };

    removePopUp = () => {
        if (this.state.noEdit) {
            this.cancelHandler();
        }
        else {
            let showCancelPopUpFlag = (this.state.showCancelPopUp ? false : true)
            this.setState({ showCancelPopUp: showCancelPopUpFlag });
        }
    }

    cancelHandler = () => {
        if (this.props.match.path === '/customer-mgmt/org/:uuid') {
            this.handlePropsToState();
        }
        else if (this.props.match.path === '/customer-mgmt/org/add') {
            let redirectPath = '/customer-mgmt/org';
            this.props.history.push(redirectPath);
        }
    }

    handleInputChange = (value, inputIdentifier, inputClass = null) => {
        let updatedOrgDetails = _.cloneDeep(this.state.orgData);
        let enableSubmit = false;
        let oldData, newData;
        if (inputClass) {
            oldData = updatedOrgDetails[inputClass][inputIdentifier];
            updatedOrgDetails[inputClass][inputIdentifier] = value;
            newData = updatedOrgDetails[inputClass][inputIdentifier];
        }
        else {
            oldData = updatedOrgDetails[inputIdentifier];
            updatedOrgDetails[inputIdentifier] = (value.target !== undefined ? value.target.value : value.value) || value;
            newData = updatedOrgDetails[inputIdentifier];
        }

        if (oldData !== newData) {
            this.setState({ noEdit: false })
        }

        if (_.isEmpty(updatedOrgDetails.brandColor)) {
            updatedOrgDetails.brandColor = theme.secondaryLabel;
        }
        enableSubmit = this.handleEnableSubmit(updatedOrgDetails);
        this.setState({ orgData: updatedOrgDetails, enableSubmit: enableSubmit });
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

    handleEnableEdit = () => {
        this.setState({
            viewMode: false
        })
    }

    handleEditBack = () => {
        this.setState({ editBack: true })
    }

    handleEditBackFalse = () => {
        this.setState({ editBack: false })
    }

    // handleEditBack = () => {
    //     if (this.props.showModal) {
    //         this.props.initOrgDetails();
    //     }
    // }

    handleBack = () => {
        if (this.props.showModal) {
            this.props.initStateonBoard();
        }
    }

    render() {
        const { t } = this.props;
        const { match } = this.props;
        const orgId = match.params.uuid;

        let NotificationPan =
            this.state.submitSuccess ?
                <div className={this.state.submitSuccess ? cx(styles.ShowSuccessNotificationCard, 'flex align-items-center') : cx(styles.HideSuccessNotificationCard)}>
                    <SuccessNotification clicked={this.clickHandler} />
                </div>
                : (this.props.errors) ?
                    <div className={(this.props.errors) ? cx(styles.ShowErrorNotificationCard, 'flex align-items-center') : cx(styles.HideErrorNotificationCard)}>
                        <ErrorNotification error={this.props.errors} clicked={this.errorClickedHandler} />
                    </div>
                    :
                    <div className={styles.emptyNotification}></div>

        return (

            <React.Fragment>
                {/* <Prompt
                    when={!this.state.noEdit}
                    navigate={path => this.props.history.push(path)}
                    takeActionOnCancel={this.props.onResetId}
                /> */}
                <Prompt
                    when={!this.state.noEdit}
                    takeActionOnCancel={this.state.editBack ? null : this.handleBack}
                    takeActionOnKeep={this.state.editBack ? this.handleEditBackFalse : null}
                />
                {this.props.getDataState === 'LOADING' ?
                    <div className={cx(styles.alignCenter, "pt-4")}>
                        <Loader />
                    </div>
                    :
                    <React.Fragment>
                        <div className={styles.alignCenter}>
                            <div onClick={() => this.handleBack()} >
                                {_.isEmpty(this.props.orgData) ?
                                    <ArrowLink
                                        label={t('translation_orgDetails:allClients')}
                                        url={`/customer-mgmt/org`}
                                    /> :
                                    <ArrowLink
                                        label={this.props.orgData.name.toLowerCase()}
                                        url={`/customer-mgmt/org/${this.props.orgData.uuid}/profile`}
                                    />
                                }
                            </div>

                            <CardHeader label={t('translation_orgDetails:cardHeader')} iconSrc={container} />

                            <div className={cx(styles.CardLayout, 'card')}>
                                {NotificationPan}
                                <div className={cx(styles.CardPadding, 'card-body')}>
                                    {this._isMounted ?
                                        <React.Fragment>
                                            {(match.path === '/customer-mgmt/org/:uuid') ? '' :
                                                !_.isEmpty(this.props.idCardType) ?
                                                    <div>
                                                        <div className="row no-gutters">
                                                            <div className={cx(styles.Input, 'col-4 pr-3 d-flex flex-column-reverse my-1')}>
                                                                <input
                                                                    className={styles.InputElement}
                                                                    type='text'
                                                                    disabled={true}
                                                                    value={this.props.idNo}
                                                                    style={this.props.fixed ? { backgroundColor: theme.primaryBackground } : {}}
                                                                />
                                                                <label className={cx(styles.LabelWithValue)}>
                                                                    {this.props.idCardType.toLowerCase() + ' number'}&nbsp;
                                                               <span className={styles.requiredStar}>{'*'}</span>
                                                                </label>
                                                            </div>
                                                            <img className={styles.image} src={editEmp} alt={t('translation_orgDetails:image_alt_orgDetails.editId')} onClick={() => this.handleEditBack()} />
                                                        </div>
                                                        <hr className={styles.HorizotalLine} />
                                                    </div>
                                                    : ''}

                                            <div className="row no-gutters">
                                                <Input
                                                    name='name'
                                                    className='col-4'
                                                    label={t('translation_orgDetails:input_orgDetails.label.orgName')}
                                                    type='text'
                                                    placeholder={t('translation_orgDetails:input_orgDetails.placeholder.orgName')}
                                                    required={_.includes(requiredFields, 'name')}
                                                    disabled={this.state.viewMode ? true : false}
                                                    value={this.state.orgData['name']}
                                                    onChange={(value) => this.handleInputChange(value, 'name')}
                                                    validation={validation['name']}
                                                    message={message['name']}
                                                    errors={this.state.errors['name']}
                                                    onError={(error) => this.handleError(error, 'name')}
                                                />
                                                <BrandColor
                                                    name='brandColor'
                                                    label={t('translation_orgDetails:input_orgDetails.label.brandColor')}
                                                    disabled={this.state.viewMode ? true : false}
                                                    value={this.state.orgData['brandColor']}
                                                    changed={(event) => this.handleInputChange(event, 'brandColor')}
                                                />
                                            </div>

                                            <div className="row no-gutters">
                                                <Input
                                                    name='legalName'
                                                    className='col-8'
                                                    label={t('translation_orgDetails:input_orgDetails.label.legalName')}
                                                    type='text'
                                                    placeholder={t('translation_orgDetails:input_orgDetails.placeholder.legalName')}
                                                    required={_.includes(requiredFields, 'legalName')}
                                                    disabled={this.state.viewMode ? true : false}
                                                    value={this.state.orgData['legalName']}
                                                    onChange={(value) => this.handleInputChange(value, 'legalName')}
                                                    validation={validation['legalName']}
                                                    message={message['legalName']}
                                                    errors={this.state.errors['legalName']}
                                                    onError={(error) => this.handleError(error, 'legalName')}
                                                />
                                            </div>

                                            <div className="row no-gutters">
                                                <Input
                                                    name='website'
                                                    className='col-4 mx-0 pr-3'
                                                    label={t('translation_orgDetails:input_orgDetails.label.website')}
                                                    type='text'
                                                    placeholder={t('translation_orgDetails:input_orgDetails.placeholder.website')}
                                                    required={_.includes(requiredFields, 'website')}
                                                    disabled={this.state.viewMode ? true : false}
                                                    value={this.state.orgData['website']}
                                                    onChange={(value) => this.handleInputChange(value, 'website')}
                                                    validation={validation['website']}
                                                    message={message['website']}
                                                    errors={this.state.errors['website']}
                                                    onError={(error) => this.handleError(error, 'website')}
                                                />
                                                <CustomSelect
                                                    name='organisationType'
                                                    className="col-4 mt-3 pr-3"
                                                    label={t('translation_orgDetails:input_orgDetails.label.orgType')}
                                                    required={true}
                                                    disabled={this.state.viewMode ? true : false}
                                                    options={this.props.ORG_MGMT_ORGANISATION_TYPE}
                                                    value={this.state.orgData.organisationType}
                                                    onChange={(value) => this.handleInputChange(value, 'organisationType')}
                                                // errors={this.state.errors['organisationType']}
                                                // onError={(error) => this.handleError(error, 'organisationType')}
                                                />
                                                <CustomSelect
                                                    name='industry'
                                                    className="col-4 mt-3"
                                                    label={t('translation_orgDetails:input_orgDetails.label.industry')}
                                                    required={true}
                                                    disabled={this.state.viewMode ? true : false}
                                                    options={this.props.ORG_MGMT_INDUSTRY}
                                                    value={this.state.orgData.industry}
                                                    onChange={(value) => this.handleInputChange(value, 'industry')}
                                                // errors={this.state.errors['industry']}
                                                // onError={(error) => this.handleError(error, 'industry')}
                                                />
                                            </div>

                                            <hr className={styles.HorizontalLine} />

                                            <div className="row no-gutters">
                                                <Input
                                                    name='addressLine1'
                                                    className='col-6 pr-3'
                                                    label={t('translation_orgDetails:input_orgDetails.label.addressLine1')}
                                                    type='text'
                                                    placeholder={t('translation_orgDetails:input_orgDetails.placeholder.addressLine1')}
                                                    required={_.includes(requiredFields, 'addressLine1')}
                                                    disabled={this.state.viewMode ? true : false}
                                                    value={this.state.orgData.address['addressLine1']}
                                                    onChange={(value) => this.handleInputChange(value, 'addressLine1', 'address')}
                                                    validation={validation['addressLine1']}
                                                    message={message['addressLine1']}
                                                    errors={this.state.errors['addressLine1']}
                                                    onError={(error) => this.handleError(error, 'addressLine1')}
                                                />
                                                <Input
                                                    name='addressLine2'
                                                    className='col-6 mt-auto'
                                                    label=""
                                                    type='text'
                                                    placeholder={t('translation_orgDetails:input_orgDetails.placeholder.addressLine2')}
                                                    required={_.includes(requiredFields, 'addressLine2')}
                                                    disabled={this.state.viewMode ? true : false}
                                                    value={this.state.orgData.address['addressLine2']}
                                                    onChange={(value) => this.handleInputChange(value, 'addressLine2', 'address')}
                                                    validation={validation['addressLine2']}
                                                    message={message['addressLine2']}
                                                    errors={this.state.errors['addressLine2']}
                                                    onError={(error) => this.handleError(error, 'addressLine2')}
                                                />
                                            </div>

                                            <div className={cx('row no-gutters')}>
                                                <Input
                                                    name='city'
                                                    className='col-3 pr-3'
                                                    label={t('translation_orgDetails:input_orgDetails.label.city')}
                                                    type='text'
                                                    placeholder={t('translation_orgDetails:input_orgDetails.placeholder.city')}
                                                    required={_.includes(requiredFields, 'city')}
                                                    disabled={this.state.viewMode ? true : false}
                                                    value={this.state.orgData.address['city']}
                                                    onChange={(value) => this.handleInputChange(value, 'city', 'address')}
                                                    validation={validation['city']}
                                                    message={message['city']}
                                                    errors={this.state.errors['city']}
                                                    onError={(error) => this.handleError(error, 'city')}
                                                />
                                                <Input
                                                    name='pincode'
                                                    className='col-3 pr-3'
                                                    label={t('translation_orgDetails:input_orgDetails.label.pincode')}
                                                    type='text'
                                                    placeholder={t('translation_orgDetails:input_orgDetails.placeholder.pincode')}
                                                    required={_.includes(requiredFields, 'pincode')}
                                                    disabled={this.state.viewMode ? true : false}
                                                    value={this.state.orgData.address['pincode']}
                                                    onChange={(value) => this.handleInputChange(value, 'pincode', 'address')}
                                                    validation={validation['pincode']}
                                                    message={message['pincode']}
                                                    errors={this.state.errors['pincode']}
                                                    onError={(error) => this.handleError(error, 'pincode')}
                                                />
                                                <Input
                                                    name='state'
                                                    className='col-3 pr-3'
                                                    label={t('translation_orgDetails:input_orgDetails.label.state')}
                                                    type='text'
                                                    placeholder={t('translation_orgDetails:input_orgDetails.placeholder.state')}
                                                    required={_.includes(requiredFields, 'state')}
                                                    disabled={this.state.viewMode ? true : false}
                                                    value={this.state.orgData.address['state']}
                                                    onChange={(value) => this.handleInputChange(value, 'state', 'address')}
                                                    validation={validation['state']}
                                                    message={message['state']}
                                                    errors={this.state.errors['state']}
                                                    onError={(error) => this.handleError(error, 'state')}
                                                />
                                                <Input
                                                    name='country'
                                                    className='col-3'
                                                    label={t('translation_orgDetails:input_orgDetails.label.country')}
                                                    type='text'
                                                    placeholder={t('translation_orgDetails:input_orgDetails.placeholder.country')}
                                                    required={_.includes(requiredFields, 'country')}
                                                    disabled={this.state.viewMode ? true : false}
                                                    value={this.state.orgData.address['country']}
                                                    onChange={(value) => this.handleInputChange(value, 'country', 'address')}
                                                    validation={validation['country']}
                                                    message={message['country']}
                                                    errors={this.state.errors['country']}
                                                    onError={(error) => this.handleError(error, 'country')}
                                                />
                                            </div>

                                            <hr className={styles.HorizontalLine} />

                                            <div className="row no-gutters">
                                                <CustomSelect
                                                    name='contactType'
                                                    className="col-4 mt-3 pr-3"
                                                    required={true}
                                                    label={t('translation_orgDetails:input_orgDetails.label.contactType')}
                                                    disabled={this.state.viewMode ? true : false}
                                                    options={this.props.ORG_MGMT_CONTACT_TYPE}
                                                    value={this.state.orgData.contactPerson['contactType']}
                                                    onChange={(value) => this.handleInputChange(value, 'contactType', 'contactPerson')}
                                                />
                                                <Input
                                                    name='designation'
                                                    className='col-4 mt-2'
                                                    label={t('translation_orgDetails:input_orgDetails.label.designation')}
                                                    type='text'
                                                    placeholder={t('translation_orgDetails:input_orgDetails.placeholder.designation')}
                                                    required={_.includes(requiredFields, 'designation')}
                                                    disabled={this.state.viewMode ? true : false}
                                                    value={this.state.orgData.contactPerson['designation']}
                                                    onChange={(value) => this.handleInputChange(value, 'designation', 'contactPerson')}
                                                    validation={validation['designation']}
                                                    message={message['designation']}
                                                    errors={this.state.errors['designation']}
                                                    onError={(error) => this.handleError(error, 'designation')}
                                                />
                                            </div>

                                            <div className='row no-gutters'>
                                                <Input
                                                    name='fullName'
                                                    className='col-4 pr-3'
                                                    label={t('translation_orgDetails:input_orgDetails.label.fullName')}
                                                    type='text'
                                                    placeholder={t('translation_orgDetails:input_orgDetails.placeholder.fullName')}
                                                    required={_.includes(requiredFields, 'fullName')}
                                                    disabled={this.state.viewMode ? true : false}
                                                    value={this.state.orgData.contactPerson['fullName']}
                                                    onChange={(value) => this.handleInputChange(value, 'fullName', 'contactPerson')}
                                                    validation={validation['fullName']}
                                                    message={message['fullName']}
                                                    errors={this.state.errors['fullName']}
                                                    onError={(error) => this.handleError(error, 'fullName')}
                                                />
                                                <Input
                                                    name='phoneNumber'
                                                    className='col-4 pr-3'
                                                    label={t('translation_orgDetails:input_orgDetails.label.phoneNumber')}
                                                    type='text'
                                                    placeholder={t('translation_orgDetails:input_orgDetails.placeholder.phoneNumber')}
                                                    required={_.includes(requiredFields, 'phoneNumber')}
                                                    disabled={this.state.viewMode ? true : false}
                                                    value={this.state.orgData.contactPerson['phoneNumber']}
                                                    onChange={(value) => this.handleInputChange(value, 'phoneNumber', 'contactPerson')}
                                                    validation={validation['phoneNumber']}
                                                    message={message['phoneNumber']}
                                                    errors={this.state.errors['phoneNumber']}
                                                    onError={(error) => this.handleError(error, 'phoneNumber')}
                                                />
                                                <Input
                                                    name='emailAddress'
                                                    className='col-4'
                                                    label={t('translation_orgDetails:input_orgDetails.label.email')}
                                                    type='text'
                                                    placeholder={t('translation_orgDetails:input_orgDetails.label.email')}
                                                    required={_.includes(requiredFields, 'emailAddress')}
                                                    disabled={this.state.viewMode ? true : false}
                                                    value={this.state.orgData.contactPerson['emailAddress']}
                                                    onChange={(value) => this.handleInputChange(value, 'emailAddress', 'contactPerson')}
                                                    validation={validation['emailAddress']}
                                                    message={message['emailAddress']}
                                                    errors={this.state.errors['emailAddress']}
                                                    onError={(error) => this.handleError(error, 'emailAddress')}
                                                />
                                            </div>

                                            {!this.state.viewMode ?
                                                <div className="row no-gutters justify-content-end mt-2">
                                                    <CancelButton label={t('translation_orgDetails:button_orgDetails.cancel')} clickHandler={this.removePopUp} />
                                                    {this.state.showCancelPopUp ?
                                                        <WarningPopUp
                                                            text={t('translation_orgDetails:warning_orgDetails_cancel.text')}
                                                            para={t('translation_orgDetails:warning_orgDetails_cancel.para')}
                                                            confirmText={t('translation_orgDetails:warning_orgDetails_cancel.confirmText')}
                                                            cancelText={t('translation_orgDetails:warning_orgDetails_cancel.cancelText')}
                                                            icon={warn}
                                                            warningPopUp={this.cancelHandler}
                                                            closePopup={this.removePopUp.bind(this)}
                                                        />
                                                        : null
                                                    }
                                                    {this.props.postPutDataState === 'LOADING' ? <Spinnerload type='loading' /> :
                                                        <Button
                                                            label={t('translation_orgDetails:button_orgDetails.Save')}
                                                            isDisabled={!this.state.enableSubmit}
                                                            clickHandler={this.formSubmitHandler}
                                                            type='save'
                                                        />
                                                    }
                                                </div> :

                                                <div className="row no-gutters justify-content-end mt-2">
                                                    <HasAccess
                                                        permission={["ORG_PROFILE:EDIT"]}
                                                        orgId={orgId}
                                                        yes={() => (
                                                            <React.Fragment>
                                                                {this.state.showSaveButton === true ?
                                                                    this.props.errors ? <Spinnerload /> : <Spinnerload type='success' />
                                                                    :
                                                                    <Button
                                                                        label={t('translation_orgDetails:button_orgDetails.edit')}
                                                                        type='edit'
                                                                        clickHandler={this.handleEnableEdit}>
                                                                    </Button>
                                                                }
                                                            </React.Fragment>
                                                        )}
                                                    />
                                                </div>
                                            }
                                        </React.Fragment>
                                        : null}
                                </div>
                            </div>
                        </div>


                    </React.Fragment>


                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        orgData: state.orgMgmt.orgDetails.data,
        data: state.orgMgmt.staticData.orgData,
        idCardType: state.orgMgmt.orgOnboard.cardtype,
        idNo: state.orgMgmt.orgOnboard.idNo,
        showModal: state.orgMgmt.orgOnboard.showModal,
        postPutDataState: state.orgMgmt.orgDetails.postPutDataState,
        getDataState: state.orgMgmt.orgDetails.getDataState,
        errors: state.orgMgmt.orgDetails.error,
        ORG_MGMT_ORGANISATION_TYPE: state.orgMgmt.staticData.orgMgmtStaticData["ORG_MGMT_ORGANISATION_TYPE"],
        ORG_MGMT_INDUSTRY: state.orgMgmt.staticData.orgMgmtStaticData["ORG_MGMT_INDUSTRY"],
        ORG_MGMT_CONTACT_TYPE: state.orgMgmt.staticData.orgMgmtStaticData['ORG_MGMT_CONTACT_TYPE']
    };
};

const mapDispatchToProps = dispatch => {
    return {
        initOrgDetails: () => dispatch(actions.initState()),
        onResetId: () => dispatch(orgResetId()),
        onPostOrgDetails: orgDetails => dispatch(actions.postData(orgDetails)),
        onPutOrgDetails: currentOrgDetails => dispatch(actions.putData(currentOrgDetails)),
        onGetOrgDetailsById: orgId => dispatch(actions.getDataById(orgId)),
        onDeactivateOrg: orgId => dispatch(actions.deleteData(orgId)),
        updateCurrentOrg: (updatedOrgData) => dispatch({ type: actionTypes.GET_DATA_SUCCESS, data: updatedOrgData }),
        onResetError: () => dispatch({ type: actionTypes.RESET_ERROR }),
        initStateonBoard: () => dispatch(actionsOnBoarding.initState()),
        getOrgData: (orgId) => dispatch(actionsOrgMgmt.getDataById(orgId))
    };
};

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(OrgDetails)));