import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import * as actions from './Store/action';
import * as actionTypes from './Store/actionTypes';
import * as actionsOrgMgmt from '../OrgMgmtStore/action';

import _ from 'lodash';
import cx from 'classnames';
import styles from './OrgContact.module.scss';

import * as fieldData from './OrgContactInitData';
import { requiredFields } from './OrgContactInitData';
import { validation, message } from './OrgContactValidation';

import {Input, Button} from 'react-crux';
import CustomSelect from '../../../../components/Atom/CustomSelect/CustomSelect';
import SuccessNotification from '../../../../components/Organism/Notifications/SuccessNotification/SuccessNotification';
import CardHeader from '../../../../components/Atom/PageTitle/PageTitle';
import ErrorNotification from '../../../../components/Organism/Notifications/ErrorNotification/ErrorNotification';
import CancelButton from '../../../../components/Molecule/CancelButton/CancelButton';
import WarningPopUp from '../../../../components/Molecule/WarningPopUp/WarningPopUp';
import Spinner from '../../../../components/Organism/Loader/Loader';
import DeleteButton from '../../../../components/Molecule/DeleteButton/DeleteButton';
import Prompt from '../../../../components/Organism/Prompt/Prompt';
import Spinnerload from '../../../../components/Atom/Spinner/Spinner';
import ArrowLink from '../../../../components/Atom/ArrowLink/ArrowLink';

import add_enabled from '../../../../assets/icons/addButton.svg';
import contact from '../../../../assets/icons/orgContactIcon.svg';
import warn from '../../../../assets/icons/warning.svg';

import HasAccess from '../../../../services/HasAccess/HasAccess';

class ContactPerson extends Component {
    state = {
        dataList: [{
            data: {
                ...fieldData.InitData,
            },
            editMode: true,
            noEdit: true
        }],
        tempDataList: [],
        orgId: null,
        enableSubmit: false,
        showPopUp: false,
        showSuccessNotification: false,
        showEditButtonGroup: false,
        showCancelPopUp: false,
        showSaveButton: false,
        errors: {}
    }
    _isMounted = false;


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
                        noEdit: true
                    });
                })
            }
            this.setState({
                dataList: [],
                tempDataList: updatedDataList
            })
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
                enableAddMore = true;
            }
        });
        return enableAddMore;
    }

    handleAddNewData = () => {
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
        });
    }

    handleDeleteData = (targetIndex) => {
        this.props.onDeleteData(this.state.orgId, this.state.dataList[targetIndex].data.uuid);
        this.setState({ showDeletePopUp: false })
    }

    handleEnableEdit = (targetIndex) => {
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
        this.setState({ dataList: updatedDataList });
    }

    handleFormSubmit = (targetIndex, dataId) => {
        if (dataId) {
            this.props.onPutData(this.state.orgId, dataId, this.state.dataList[targetIndex].data);
        }
        else {
            this.props.onPostData(this.state.orgId, this.state.dataList[targetIndex].data);
        }
        this.setState({ enableSubmit: false })
    };

    handleCancel = (targetIndex, dataId) => {
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
        if (noEdit) {
            this.handleCancel(index, uuid);
        }
        else {
            let showCancelPopUpFlag = (this.state.showCancelPopUp ? false : true)
            this.setState({
                showCancelPopUp: showCancelPopUpFlag
            });
        }
    }

    togglePopUp = () => {
        let showDeletePopUpFlag = (this.state.showDeletePopUp ? false : true)
        this.setState({
            showDeletePopUp: showDeletePopUpFlag
        });
    }

    addFormRef = (form) => {
        if (form) {
            this.formsEvery = [...this.formsEvery, form];
        }
    }

    successClickedHandler = () => {
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
                <div key={index} className={!item.editMode ? cx(styles.CardLayout) : cx(styles.DisabledCardLayout)}
                    onMouseEnter={() => thisRef.setState({ showEditButtonGroup: true, index: index })}
                    onMouseLeave={() => thisRef.setState({ showEditButtonGroup: false, index: null })}
                >
                    <Prompt
                        when={!item.noEdit}
                        navigate={path => thisRef.props.history.push(path)}
                    />
                    {(item.data.uuid ? (thisRef.state.showSuccessNotification && item.data.uuid === thisRef.props.currentDataId) : false) ?
                        <div className={cx(styles.ShowSuccessNotificationCard, 'flex align-items-center')}>
                            <SuccessNotification clicked={thisRef.successClickedHandler} />
                        </div>
                        :
                        thisRef.props.error !== null && (item.data.uuid === thisRef.props.currentDataId) ?
                            <div className={cx(styles.ShowErrorNotificationCard, 'flex align-items-center')}>
                                <ErrorNotification error={thisRef.props.error} clicked={thisRef.errorClickedHandler} />
                            </div>
                            :
                            <div className={styles.emptyNotification}></div>
                    }

                    <div className={cx(styles.CardPadding, 'card-body')}>
                        {thisRef._isMounted ?
                            <div key={index}>
                                <div className='row no-gutters'>
                                    <CustomSelect
                                        name='contactType'
                                        className="col-4 mt-2 pr-3"
                                        required={_.includes(requiredFields, 'contactType')}
                                        label={t('translation_orgContact:input_orgContact.label.contactType')}
                                        disabled={!item.editMode}
                                        options={thisRef.props.ORG_MGMT_CONTACT_TYPE}
                                        value={item.data.contactType}
                                        onChange={(value) => thisRef.handleInputChange(value, 'contactType', index)}
                                    />

                                    <Input
                                        name='designation'
                                        className="col-4 pr-3"
                                        label={t('translation_orgContact:input_orgContact.label.designation')}
                                        disabled={!item.editMode}
                                        type='text'
                                        required={_.includes(requiredFields, 'designation')}
                                        placeholder={t('translation_orgContact:input_orgContact.placeholder.designation')}
                                        value={item.data.designation}
                                        onChange={(value) => thisRef.handleInputChange(value, 'designation', index)}
                                        validation={validation['designation']}
                                        message={message['designation']}
                                        errors={item.editMode ? thisRef.state.errors['designation'] : null}
                                        onError={(error) => thisRef.handleError(error, 'designation')}
                                    />
                                </div>
                                <div className='row no-gutters'>
                                    <Input
                                        name='fullName'
                                        className="col-4 pr-3"
                                        label={t('translation_orgContact:input_orgContact.label.fullName')}
                                        disabled={!item.editMode}
                                        type='text'
                                        required={_.includes(requiredFields, 'fullName')}
                                        placeholder={t('translation_orgContact:input_orgContact.placeholder.fullName')}
                                        value={item.data.fullName}
                                        onChange={(value) => thisRef.handleInputChange(value, 'fullName', index)}
                                        validation={validation['fullName']}
                                        message={message['fullName']}
                                        errors={item.editMode ? thisRef.state.errors['fullName'] : null}
                                        onError={(error) => thisRef.handleError(error, 'fullName')}
                                    />
                                    <Input
                                        name='phoneNumber'
                                        className="col-4 pr-3"
                                        label={t('translation_orgContact:input_orgContact.label.phoneNumber')}
                                        disabled={!item.editMode}
                                        type='text'
                                        required={_.includes(requiredFields, 'phoneNumber')}
                                        placeholder={t('translation_orgContact:input_orgContact.placeholder.phoneNumber')}
                                        value={item.data.phoneNumber}
                                        onChange={(value) => thisRef.handleInputChange(value, 'phoneNumber', index)}
                                        validation={validation['phoneNumber']}
                                        message={message['phoneNumber']}
                                        errors={item.editMode ? thisRef.state.errors['phoneNumber'] : null}
                                        onError={(error) => thisRef.handleError(error, 'phoneNumber')}
                                    />
                                    <Input
                                        name='emailAddress'
                                        className="col-4"
                                        label={t('translation_orgContact:input_orgContact.label.email')}
                                        disabled={!item.editMode}
                                        type='text'
                                        placeholder={t('translation_orgContact:input_orgContact.placeholder.email')}
                                        value={item.data.emailAddress}
                                        required={_.includes(requiredFields, 'emailAddress')}
                                        onChange={(value) => thisRef.handleInputChange(value, 'emailAddress', index)}
                                        validation={validation['emailAddress']}
                                        message={message['emailAddress']}
                                        errors={item.editMode ? thisRef.state.errors['emailAddress'] : null}
                                        onError={(error) => thisRef.handleError(error, 'emailAddress')}
                                    />
                                </div>

                                {item.editMode ?
                                    <div className="row no-gutters d-flex justify-content-end mt-2">
                                        <CancelButton clickHandler={() => thisRef.removePopUp(item.noEdit, index, item.data.uuid)} />
                                        {thisRef.state.showCancelPopUp ?
                                            <WarningPopUp
                                                text={t('translation_orgContact:warning_orgContact_cancel.text')}
                                                para={t('translation_orgContact:warning_orgContact_cancel.para')}
                                                confirmText={t('translation_orgContact:warning_orgContact_cancel.confirmText')}
                                                cancelText={t('translation_orgContact:warning_orgContact_cancel.cancelText')}
                                                icon={warn}
                                                warningPopUp={() => thisRef.handleCancel(index, item.data.uuid)}
                                                closePopup={() => thisRef.removePopUp(item.noEdit)}

                                            />
                                            : null
                                        }
                                        {thisRef.props.postDataState === 'LOADING' || thisRef.props.putDataState === 'LOADING' ? <Spinnerload type='loading' /> :
                                            <HasAccess
                                                permission={item.data.uuid ? ["ORG_CONTACT:EDIT"] : ["ORG_CONTACT:CREATE"]}
                                                orgId={orgId}
                                                yes={() => (
                                                    <Button label={t('translation_orgContact:button_orgContact.Save')} isDisabled={!thisRef.state.enableSubmit} clickHandler={() => thisRef.handleFormSubmit(index, item.data.uuid)} />
                                                )}
                                            />
                                        }
                                    </div> :

                                    <div>
                                        {thisRef.state.showEditButtonGroup && index === thisRef.state.index ?
                                            <div className="row no-gutters d-flex justify-content-end mt-2">
                                                <HasAccess
                                                    permission={["ORG_CONTACT:DELETE"]}
                                                    orgId={orgId}
                                                    yes={() => (
                                                        <DeleteButton isDeleteIconRequired={true} isDisabled={false} label={t('translation_orgContact:button_orgContact.delete')} clickHandler={() => thisRef.togglePopUp()} />
                                                    )}
                                                />
                                                {thisRef.state.showDeletePopUp ?
                                                    <WarningPopUp
                                                        text={t('translation_orgContact:warning_orgContact_delete.text')}
                                                        para={t('translation_orgContact:warning_orgContact_delete.para')}
                                                        confirmText={t('translation_orgContact:warning_orgContact_delete.confirmText')}
                                                        cancelText={t('translation_orgContact:warning_orgContact_delete.cancelText')}
                                                        icon={warn}
                                                        warningPopUp={() => thisRef.handleDeleteData(index)}
                                                        closePopup={() => thisRef.togglePopUp()}
                                                    />
                                                    : null
                                                }
                                                {thisRef.state.showSaveButton === true && item.data.uuid === thisRef.props.currentDataId ?
                                                    thisRef.props.error ? <span className='ml-2'><Spinnerload /></span> :
                                                        <span className='ml-2'><Spinnerload type='success' /></span>
                                                    :

                                                    <HasAccess
                                                        permission={["ORG_CONTACT:EDIT"]}
                                                        orgId={orgId}
                                                        yes={() => (
                                                            <Button label={t('translation_orgContact:button_orgContact.edit')} isDisabled={thisRef.handleAddMoreEnable()} clickHandler={() => thisRef.handleEnableEdit(index)} type="edit" />
                                                        )}
                                                    />
                                                }
                                            </div>
                                            :
                                            ''}
                                    </div>
                                }
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
                            : null}
                        <div className='row no-gutters'>
                            <CardHeader label={t('translation_orgContact:cardHeader')} iconSrc={contact} />

                            {!_.isEmpty(this.props.dataList) ? this.props.dataList.length > 0 ?
                                <HasAccess
                                    permission={["ORG_CONTACT:CREATE"]}
                                    orgId={orgId}
                                    yes={() => (
                                        <div className="d-flex ml-auto">
                                            <div className={cx(styles.AddMoreButton, 'd-flex mr-1')} disabled={this.handleAddMoreEnable()} onClick={this.handleAddNewData}>
                                                <label className="pl-2 ml-2 my-2 align-self-center">{t('translation_orgContact:button_orgContact.addMore')}</label>
                                                <img className={cx("pl-2 my-auto", styles.addStyle)} src={add_enabled} alt={t('translation_orgContact:image_alt_orgContact.add')} />
                                            </div>
                                        </div>
                                    )}
                                />
                                : null
                                : ''}
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
        currentDataId: state.orgMgmt.orgContact.currentDataId,
        getDataState: state.orgMgmt.orgContact.getDataState,
        postDataState: state.orgMgmt.orgContact.postDataState,
        putDataState: state.orgMgmt.orgContact.putDataState,
        deleteDataState: state.orgMgmt.orgContact.deleteDataState,
        dataList: state.orgMgmt.orgContact.dataList,
        error: state.orgMgmt.orgContact.error,
        orgData: state.orgMgmt.staticData.orgData,
        rightnavOrgId: state.orgMgmt.staticData.rightnavOrgId,
        ORG_MGMT_CONTACT_TYPE: state.orgMgmt.staticData.orgMgmtStaticData['ORG_MGMT_CONTACT_TYPE']
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

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(ContactPerson));