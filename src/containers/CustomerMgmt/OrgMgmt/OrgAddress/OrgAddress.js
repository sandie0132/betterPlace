import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import _ from 'lodash';
import cx from 'classnames';
import styles from './OrgAddress.module.scss';

import * as actions from './Store/action';
import * as actionTypes from './Store/actionTypes';
import * as actionsOrgMgmt from '../OrgMgmtStore/action';

import add_enabled from '../../../../assets/icons/addButton.svg';
import addressicon from '../../../../assets/icons/address.svg';
import warn from '../../../../assets/icons/warning.svg';

import * as fieldData from './OrgAddressInitData';
import { requiredFields } from "./OrgAddressInitData";
import { validation, message } from './OrgAddressValidation';

import { Button } from 'react-crux';
import {Input} from 'react-crux';
import DeleteButton from '../../../../components/Molecule/DeleteButton/DeleteButton';
import WarningPopUp from '../../../../components/Molecule/WarningPopUp/WarningPopUp';
import Prompt from '../../../../components/Organism/Prompt/Prompt';
import Spinner from '../../../../components/Organism/Loader/Loader';
import Spinnerload from '../../../../components/Atom/Spinner/Spinner';
import CardHeader from '../../../../components/Atom/PageTitle/PageTitle';
import SuccessNotification from '../../../../components/Organism/Notifications/SuccessNotification/SuccessNotification';
import ErrorNotification from '../../../../components/Organism/Notifications/ErrorNotification/ErrorNotification';
import CancelButton from '../../../../components/Molecule/CancelButton/CancelButton';
import ArrowLink from '../../../../components/Atom/ArrowLink/ArrowLink';

import HasAccess from '../../../../services/HasAccess/HasAccess';

class OrgAddress extends Component {
    state = {
        dataList: [{
            data: {
                ...fieldData.InitData,
            },
            editMode: true,
            noEdit: true
        }],
        orgId: null,
        enableSubmit: false,
        showPopUp: false,
        tempDataList: [],
        showSuccessNotification: false,
        showEditButtonGroup: false,
        showCancelPopUp: false,
        cancelindex: null,
        enableAddMore: false,
        showSaveButton: false,
        errors: {}
    }
    _isMounted = false;
    trigger = false;

    componentDidMount() {
        this._isMounted = true;
        const { match } = this.props;
        const orgId = match.params.uuid;
        this.props.onGetDataList(orgId);
        this.setState({ orgId: orgId });
        if (_.isEmpty(this.props.orgData) && orgId) {
            this.props.getOrgData(orgId)
        }
        if (orgId !== this.props.rightnavOrgId) {
            this.props.getOrgData(orgId)
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.dataList !== prevProps.dataList) {
            let updatedDataList = []
            if (this.props.dataList.length === 0) {
                updatedDataList = [{
                    data: {
                        ...fieldData.InitData,
                    },
                    editMode: true,
                    noEdit: true
                }]
            }
            else {
                updatedDataList = this.props.dataList.map((item) => {
                    let updatedObject = { ...item };
                    return ({
                        data: updatedObject,
                        editMode: false,
                        noEdit: true,
                    });
                })
            }
            this.setState({
                dataList: [],
                tempDataList: updatedDataList,
            });
        }

        // if (this.state.dataList !== prevState.dataList) {
        //     this.handleCheckError(true)
        // }
        if ((this.props.postDataState !== prevProps.postDataState && this.props.postDataState === 'SUCCESS')
            || (this.props.putDataState !== prevProps.putDataState && this.props.putDataState === 'SUCCESS')) {
            this.setState({ showSuccessNotification: true, showSaveButton: true });
            setTimeout(() => {
                if (this._isMounted) {
                    this.setState({ showSuccessNotification: false, showSaveButton: false });
                }
            }, 2000);
        }

        if (prevState.tempDataList !== this.state.tempDataList) {
            if (this.state.tempDataList.length > 0) {
                this.setState({
                    dataList: this.state.tempDataList,
                    tempDataList: []
                })
            }
        }

        if (!_.isEqual(this.state.errors, prevState.errors)) {
            let enableSubmit = true;
            if (!_.isEmpty(this.state.errors)) {
                enableSubmit = false;
            }
            else {
                enableSubmit = this.handleEnableSubmit(this.state.dataList);
            }
            this.setState({ enableSubmit: enableSubmit });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.props.initState();
    }

    handleEnableSubmit = (formData) => {
        let enableSubmit = true, fieldExist = true;
        const reqFields = requiredFields;

        _.forEach(formData, function (value) {
            _.forEach(value.data, function (val, key) {
                if (reqFields.includes(key)) {
                    if (val === '' || val === null) {
                        fieldExist = false;
                    }
                }
            })
            enableSubmit = fieldExist && enableSubmit;
        });

        if (enableSubmit) {
            enableSubmit = enableSubmit && _.isEmpty(this.state.errors);
        }
        return (enableSubmit);
    }

    handleInputChange = (value, inputIdentifier, targetIndex) => {
        let enableSubmit = false;
        let updatedFormArray = [...this.state.dataList];
        updatedFormArray = updatedFormArray.map((item, index) => {
            if (index === targetIndex) {
                return {
                    ...item,
                    data: {
                        ...item.data,
                        [inputIdentifier]: value
                    },
                    noEdit: false
                }
            }
            return (item);
        });
        enableSubmit = this.handleEnableSubmit(updatedFormArray);
        this.setState({ dataList: updatedFormArray, enableSubmit: enableSubmit });
    }

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

    handleAddMoreEnable = () => {
        let enableAddMore = false;
        _.forEach(this.state.dataList, function (data) {
            if (data.editMode === true) {
                enableAddMore = true
            }
        })
        return enableAddMore;
    }

    handleAddNewData = () => {
        this.trigger = true
        let newData = {
            data: {
                ...fieldData.InitData
            },
            editMode: true,
            noEdit: true
        }

        let updatedDataList = _.cloneDeep(this.state.dataList);
        updatedDataList.splice(0, 0, newData);
        this.setState({
            dataList: [],
            tempDataList: updatedDataList,
            enableSubmit: false
            //dataList: updatedDataList,
        });
    }

    handleDeleteData = (targetIndex) => {
        this.props.onDeleteData(this.state.orgId, this.state.dataList[targetIndex].data.uuid);
        this.setState({ showDeletePopUp: false })
    }

    handleEnableEdit = (targetIndex) => {
        this.trigger = true
        let updatedDataList = [...this.state.dataList];
        updatedDataList = updatedDataList.map((item, index) => {
            if (index === targetIndex) {
                return ({
                    ...item,
                    editMode: true
                })
            }
            return item;
        })
        this.setState({
            dataList: updatedDataList
        });
    }

    handleFormSubmit = (targetIndex, dataId) => {
        if (dataId) {
            this.props.onPutData(this.state.orgId, dataId, this.state.dataList[targetIndex].data);
        }
        else {
            this.props.onPostData(this.state.orgId, this.state.dataList[targetIndex].data);
        }
        this.setState({ enableAddMore: false, enableSubmit: false })
    };

    handleCancel = (targetIndex, dataId) => {
        this.trigger = true
        let updatedDataList = _.cloneDeep(this.state.dataList);
        if (dataId) {
            let targetObject = this.props.dataList.filter((item) => {
                if (item.uuid !== dataId) return null;
                else return (item)
            })
            targetObject = { ...targetObject[0] };
            updatedDataList = updatedDataList.map((item, index) => {
                if (index === targetIndex) {
                    return ({
                        data: targetObject,
                        editMode: false,
                        noEdit: true
                    })
                }
                return item;
            })
        }
        else {
            if (this.props.dataList.length === 0) {
                updatedDataList = [{
                    data: {
                        ...fieldData.InitData
                    },
                    editMode: true,
                    noEdit: true
                }]
            }
            else {
                updatedDataList = updatedDataList.filter((item, index) => {
                    if (index === targetIndex) return null;
                    else return item;
                })
            }
        }
        this.setState({
            dataList: [],
            tempDataList: updatedDataList,
            enableSubmit: false,
            showCancelPopUp: false
        });
    }

    removePopUp = (noEdit, index, uuid) => {
        this.trigger = true;
        if (noEdit) {
            this.handleCancel(index, uuid);
        }
        else {
            let showCancelPopUpFlag = (this.state.showCancelPopUp ? false : true)
            this.setState({ showCancelPopUp: showCancelPopUpFlag });
        }
    }

    togglePopUp = () => {
        this.trigger = true
        let showDeletePopUpFlag = (this.state.showDeletePopUp ? false : true)
        this.setState({
            showDeletePopUp: showDeletePopUpFlag,
            enableAddMore: false
        });
    }

    addFormRef = (form) => {
        if (form) {
            this.formsEvery = [...this.formsEvery, form];
        }
    }

    successClickedHandler = (event) => {
        this.setState({ showSuccessNotification: false });
    };

    errorClickedHandler = () => {
        this.props.onResetError();
    }

    render() {
        const { t } = this.props;
        const { match } = this.props;
        const orgId = match.params.uuid;
        this.formsEvery = [];
        let thisRef = this;
        let everyform = [];
        this.state.dataList.forEach(function (item, index) {

            everyform.push(

                <div key={index} className={!item.editMode ? cx(styles.CardLayout) : cx(styles.DisabledCardLayout)} onMouseEnter={() => thisRef.setState({ showEditButtonGroup: true, index: index })} onMouseLeave={() => thisRef.setState({ showEditButtonGroup: false, index: null })}>
                    <Prompt
                        when={!item.noEdit}
                        navigate={path => thisRef.props.history.push(path)}
                    />
                    {(item.data.uuid ? (thisRef.state.showSuccessNotification && item.data.uuid === thisRef.props.currentDataId) : false) ?
                        <div className={cx(styles.ShowSuccessNotificationCard, 'flex align-items-center')}>
                            <SuccessNotification clicked={thisRef.successClickedHandler} />
                        </div>
                        :
                        (thisRef.props.error !== null && item.data.uuid === thisRef.props.currentDataId) ?
                            <div className={cx(styles.ShowErrorNotificationCard, 'flex align-items-center')}>
                                <ErrorNotification error={thisRef.props.error} clicked={thisRef.errorClickedHandler} />
                            </div>
                            :
                            <div className={styles.emptyNotification}></div>
                    }

                    <div className={cx(styles.CardPadding, 'card-body')}>
                        {thisRef._isMounted ?
                            <div>
                                <div className="row no-gutters" key={index}>
                                    <Input
                                        name='addressLine1'
                                        className="col-4 pr-3"
                                        label={t('translation_orgAddress:input_orgAddress.label.addressLine1')}
                                        type='text'
                                        placeholder={t('translation_orgAddress:input_orgAddress.placeholder.addressLine1')}
                                        required={_.includes(requiredFields, 'addressLine1')}
                                        disabled={!item.editMode}
                                        value={item.data.addressLine1}
                                        onChange={(value) => thisRef.handleInputChange(value, 'addressLine1', index)}
                                        validation={validation['addressLine1']}
                                        message={message['addressLine1']}
                                        errors={item.editMode ? thisRef.state.errors['addressLine1'] : null}
                                        onError={(error) => thisRef.handleError(error, 'addressLine1')}
                                    />
                                    <Input
                                        name='addressLine2'
                                        className="col-4 pr-3"
                                        label={t('translation_orgAddress:input_orgAddress.label.addressLine2')}
                                        type='text'
                                        placeholder={t('translation_orgAddress:input_orgAddress.placeholder.addressLine2')}
                                        required={_.includes(requiredFields, 'addressLine2')}
                                        disabled={!item.editMode}
                                        value={item.data.addressLine2}
                                        onChange={(value) => thisRef.handleInputChange(value, 'addressLine2', index)}
                                        validation={validation['addressLine2']}
                                        message={message['addressLine2']}
                                        errors={item.editMode ? thisRef.state.errors['addressLine2'] : null}
                                        onError={(error) => thisRef.handleError(error, 'addressLine2')}
                                    />
                                    <Input
                                        name='city'
                                        className="col-4"
                                        label={t('translation_orgAddress:input_orgAddress.label.city')}
                                        type='text'
                                        placeholder={t('translation_orgAddress:input_orgAddress.placeholder.city')}
                                        required={_.includes(requiredFields, 'city')}
                                        disabled={!item.editMode}
                                        value={item.data.city}
                                        onChange={(value) => thisRef.handleInputChange(value, 'city', index)}
                                        validation={validation['city']}
                                        message={message['city']}
                                        errors={item.editMode ? thisRef.state.errors['city'] : null}
                                        onError={(error) => thisRef.handleError(error, 'city')}
                                    />
                                    <Input
                                        name='state'
                                        className="col-4 pr-3"
                                        label={t('translation_orgAddress:input_orgAddress.label.state')}
                                        type='text'
                                        placeholder={t('translation_orgAddress:input_orgAddress.placeholder.state')}
                                        required={_.includes(requiredFields, 'state')}
                                        disabled={!item.editMode}
                                        value={item.data.state}
                                        onChange={(value) => thisRef.handleInputChange(value, 'state', index)}
                                        validation={validation['state']}
                                        message={message['state']}
                                        errors={item.editMode ? thisRef.state.errors['state'] : null}
                                        onError={(error) => thisRef.handleError(error, 'state')}
                                    />
                                    <Input
                                        name='pincode'
                                        className="col-4 pr-3"
                                        label={t('translation_orgAddress:input_orgAddress.label.pincode')}
                                        type='text'
                                        placeholder={t('translation_orgAddress:input_orgAddress.placeholder.pincode')}
                                        required={_.includes(requiredFields, 'pincode')}
                                        disabled={!item.editMode}
                                        value={item.data.pincode}
                                        onChange={(value) => thisRef.handleInputChange(value, 'pincode', index)}
                                        validation={validation['pincode']}
                                        message={message['pincode']}
                                        errors={item.editMode ? thisRef.state.errors['pincode'] : null}
                                        onError={(error) => thisRef.handleError(error, 'pincode')}
                                    />
                                    <Input
                                        name='country'
                                        className="col-4"
                                        label={t('translation_orgAddress:input_orgAddress.label.country')}
                                        type='text'
                                        placeholder={t('translation_orgAddress:input_orgAddress.placeholder.country')}
                                        required={_.includes(requiredFields, 'country')}
                                        disabled={!item.editMode}
                                        value={item.data.country}
                                        onChange={(value) => thisRef.handleInputChange(value, 'country', index)}
                                        validation={validation['country']}
                                        message={message['country']}
                                        errors={item.editMode ? thisRef.state.errors['country'] : null}
                                        onError={(error) => thisRef.handleError(error, 'country')}
                                    />
                                    <Input
                                        name='label'
                                        className="col-4 pr-3"
                                        label={t('translation_orgAddress:input_orgAddress.label.label')}
                                        type='text'
                                        placeholder={t('translation_orgAddress:input_orgAddress.placeholder.label')}
                                        required={_.includes(requiredFields, 'label')}
                                        disabled={!item.editMode}
                                        value={item.data.label}
                                        onChange={(value) => thisRef.handleInputChange(value, 'label', index)}
                                        validation={validation['label']}
                                        message={message['label']}
                                        errors={item.editMode ? thisRef.state.errors['label'] : null}
                                        onError={(error) => thisRef.handleError(error, 'label')}
                                    />
                                    {item.editMode ?
                                        <div className={cx("row d-flex justify-content-end", styles.SubmitPadding)}>

                                            <CancelButton label={t('translation_orgAddress:button_orgAddress.cancel')} clickHandler={() => thisRef.removePopUp(item.noEdit, index, item.data.uuid)} />
                                            {thisRef.state.showCancelPopUp ?
                                                <WarningPopUp
                                                    text={t('translation_orgAddress:warning_orgAddress_cancel.text')}
                                                    para={t('translation_orgAddress:warning_orgAddress_cancel.para')}
                                                    confirmText={t('translation_orgAddress:warning_orgAddress_cancel.confirmText')}
                                                    cancelText={t('translation_orgAddress:warning_orgAddress_cancel.cancelText')}
                                                    icon={warn}
                                                    warningPopUp={() => { thisRef.handleCancel(index, item.data.uuid) }}
                                                    closePopup={() => thisRef.removePopUp(item.noEdit)}
                                                />
                                                : null}
                                            {thisRef.props.postDataState === 'LOADING' || thisRef.props.putDataState === 'LOADING' ? <Spinnerload type='loading' /> :
                                                <HasAccess
                                                    permission={item.data.uuid ? ["ORG_ADDRESS:EDIT"] : ["ORG_ADDRESS:CREATE"]}
                                                    orgId={orgId}
                                                    yes={() => (
                                                        <Button label={t('translation_orgAddress:button_orgAddress.Save')} isDisabled={!thisRef.state.enableSubmit} clickHandler={() => thisRef.handleFormSubmit(index, item.data.uuid)} save>{t('translation_orgAddress:button_orgAddress.Save')}</Button>
                                                    )}
                                                />
                                            }
                                        </div>
                                        :
                                        <div className="row justify-content-end" style={{ width: "68.5%" }}>
                                            {(thisRef.state.showEditButtonGroup && index === thisRef.state.index) ?
                                                <div className={cx("d-flex", styles.SubmitPaddingEdit)}>
                                                    <HasAccess
                                                        permission={["ORG_ADDRESS:DELETE"]}
                                                        orgId={orgId}
                                                        yes={() => (
                                                            <DeleteButton isDeleteIconRequired={true} isDisabled={false} label={t('translation_orgAddress:button_orgAddress.delete')} clickHandler={thisRef.togglePopUp}></DeleteButton>
                                                        )}
                                                    />
                                                    {thisRef.state.showDeletePopUp ?
                                                        <WarningPopUp
                                                            text={t('translation_orgAddress:warning_orgAddress_delete.text')}
                                                            para={t('translation_orgAddress:warning_orgAddress_delete.para')}
                                                            confirmText={t('translation_orgAddress:warning_orgAddress_delete.confirmText')}
                                                            cancelText={t('translation_orgAddress:warning_orgAddress_delete.cancelText')}
                                                            icon={warn}
                                                            warningPopUp={() => thisRef.handleDeleteData(index)}
                                                            closePopup={thisRef.togglePopUp.bind(thisRef)}
                                                        />
                                                        : null
                                                    }
                                                    {thisRef.state.showSaveButton === true && item.data.uuid === thisRef.props.currentDataId ?
                                                        thisRef.props.error ? <Spinnerload /> :
                                                            <Spinnerload type='success' />
                                                        :
                                                        <HasAccess
                                                            permission={["ORG_ADDRESS:EDIT"]}
                                                            orgId={orgId}
                                                            yes={() => (
                                                                <Button label={t('translation_orgAddress:button_orgAddress.edit')} isDisabled={thisRef.handleAddMoreEnable()} clickHandler={() => thisRef.handleEnableEdit(index)} type='edit'></Button>
                                                            )}
                                                        />
                                                    }

                                                </div>
                                                : ''}
                                        </div>
                                    }
                                </div>
                            </div>
                            : null}
                    </div>
                </div>
            )
        })

        return (
            <React.Fragment>

                {this.props.getDataState === 'LOADING' ?
                    <div className={cx(styles.alignCenter, "pt-4")}>
                        <Spinner type='list' />
                    </div> :
                    <div className={styles.alignCenter}>
                        {!_.isEmpty(this.props.orgData) ?
                            <ArrowLink
                                label={this.props.orgData.name.toLowerCase()}
                                url={`/customer-mgmt/org/${this.props.orgData.uuid}/profile`}
                            />
                            : null
                        }
                        <div className='row no-gutters'>
                            <CardHeader label={t('translation_orgAddress:cardHeader')} iconSrc={addressicon} />

                            {this.props.dataList.length > 0 ?
                                <HasAccess
                                    permission={["ORG_ADDRESS:CREATE"]}
                                    orgId={orgId}
                                    yes={() => (
                                        <div className="d-flex ml-auto">
                                            <div className={cx(styles.AddMoreButton, 'd-flex mr-1')} disabled={this.handleAddMoreEnable()} onClick={this.handleAddNewData}>
                                                <label className="pl-2 ml-2 my-2 align-self-center">{t('translation_orgAddress:button_orgAddress.addMore')}</label>
                                                <img className={cx("pl-2 my-auto", styles.addStyle)} src={add_enabled} alt={t('translation_orgAddress:image_alt_orgAddress.add')} />
                                            </div>
                                        </div>
                                    )}
                                />
                                : null}
                        </div>
                        {everyform}
                    </div>
                }
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        currentDataId: state.orgMgmt.orgAddress.currentDataId,
        getDataState: state.orgMgmt.orgAddress.getDataState,
        postDataState: state.orgMgmt.orgAddress.postDataState,
        putDataState: state.orgMgmt.orgAddress.putDataState,
        deleteDataState: state.orgMgmt.orgAddress.deleteDataState,
        dataList: state.orgMgmt.orgAddress.dataList,
        orgData: state.orgMgmt.staticData.orgData,
        error: state.orgMgmt.orgAddress.error,
        rightnavOrgId: state.orgMgmt.staticData.rightnavOrgId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        initState: () => dispatch(actions.initState()),
        onGetDataList: (orgId) => dispatch(actions.getDataList(orgId)),
        onPostData: (orgId, data) => dispatch(actions.postData(orgId, data)),
        onPutData: (orgId, dataId, data) => dispatch(actions.putData(orgId, dataId, data)),
        onDeleteData: (orgId, dataId) => dispatch(actions.deleteData(orgId, dataId)),
        onResetError: () => dispatch({ type: actionTypes.RESET_ERROR }),
        getOrgData: (orgId) => dispatch(actionsOrgMgmt.getDataById(orgId))
    };
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(OrgAddress));