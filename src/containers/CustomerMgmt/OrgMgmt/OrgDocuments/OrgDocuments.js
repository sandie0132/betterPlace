import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import _ from 'lodash';
import cx from 'classnames';
import styles from './OrgDocuments.module.scss';

import * as actions from './Store/action';
import * as actionTypes from './Store/actionTypes';
import * as actionsOrgMgmt from '../OrgMgmtStore/action';

import * as fieldData from './OrgDocumentsInitData';
import { requiredFields, documentTypeOptions } from './OrgDocumentsInitData';
import OrgDocumentsFields from './OrgDocumentFields';

import CustomSelect from '../../../../components/Atom/CustomSelect/CustomSelect';
import { Button } from 'react-crux';
import SuccessNotification from '../../../../components/Organism/Notifications/SuccessNotification/SuccessNotification';
import Prompt from '../../../../components/Organism/Prompt/Prompt';
import ErrorNotification from '../../../../components/Organism/Notifications/ErrorNotification/ErrorNotification';
import WarningPopUp from '../../../../components/Molecule/WarningPopUp/WarningPopUp';
import DeleteButton from '../../../../components/Molecule/DeleteButton/DeleteButton';
import CancelButton from '../../../../components/Molecule/CancelButton/CancelButton';
import CardHeader from '../../../../components/Atom/PageTitle/PageTitle';
import Spinner from '../../../../components/Organism/Loader/Loader';
import Spinnerload from '../../../../components/Atom/Spinner/Spinner';
import Upload from '../../../../components/Molecule/UploadDoc/UploadDoc';
import FileView from '../../../../components/Molecule/FileView/FileView';
import ArrowLink from '../../../../components/Atom/ArrowLink/ArrowLink';

import add_enabled from '../../../../assets/icons/addButton.svg';
import warn from '../../../../assets/icons/warning.svg';
import upload from '../../../../assets/icons/upload.svg';
import cardHeaderIcon from '../../../../assets/icons/orgDocs.svg';

import HasAccess from '../../../../services/HasAccess/HasAccess';

class Documents extends Component {
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
        showSuccessNotification: false,
        showEditButtonGroup: false,
        showCancelPopUp: false,
        confirmDelete: false,
        deleteObject: {},
        tempDataList: [],
        showSaveButton: false,
        postId: '',
        errors: {}
    }
    _isMounted = false;
    renderChild = false;

    componentDidMount() {
        this.renderChild = true;
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
            let updatedDataList = [];
            let enableSubmit = false;
            if (this.props.dataList.length === 0) {
                updatedDataList = [{
                    data: {
                        ...fieldData.InitData,
                    },
                    editMode: true,
                    noEdit: true,
                }]
            }
            else {
                updatedDataList = this.props.dataList.map((item) => {
                    let updatedObject = { ...item };
                    _.forEach(updatedObject, function (value, key) {
                        if (key in fieldData.InitData && value === null) {

                            updatedObject = {
                                ...updatedObject,
                                [key]: fieldData.InitData[key]
                            }
                        }
                    })
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
                enableSubmit: enableSubmit
            })
        }

        if (prevState.tempDataList !== this.state.tempDataList) {
            if (this.state.tempDataList.length > 0) {
                this.setState({
                    dataList: this.state.tempDataList,
                    tempDataList: []
                })
            }
        }

        if ((this.props.postDataState !== prevProps.postDataState && this.props.postDataState === 'SUCCESS')
            || (this.props.putDataState !== prevProps.putDataState && this.props.putDataState === 'SUCCESS')) {
            this.setState({ showSuccessNotification: true, showSaveButton: true });
            setTimeout(() => {
                if (this._isMounted) {
                    this.setState({ showSuccessNotification: false, showSaveButton: false });
                }
            }, 2000);
        }

        if (this.props.uploadFileState !== prevProps.uploadFileState && this.props.uploadFileState === 'SUCCESS') {
            let updatedDataList = _.cloneDeep(this.state.dataList);
            const currentDataId = this.props.currentDataId;
            const downloadURL = this.props.downloadURL;
            // let enableSubmit = this.state.enableSubmit;
            _.forEach(updatedDataList, function (item) {
                if (item.data.uuid === undefined && currentDataId === null) {
                    item.data.downloadURL = [...item.data.downloadURL, ...downloadURL]
                }
                else if (item.data.uuid === currentDataId) {
                    if (item.data.downloadURL != null) {
                        item.data.downloadURL = [...item.data.downloadURL, ...downloadURL];
                    } else {
                        item.data.downloadURL = [...downloadURL];
                    }
                    // enableSubmit = true;
                }
            })
            this.setState({
                dataList: updatedDataList,
                // enableSubmit: enableSubmit
            });
            this.props.onResetDownloadUrl();
        }

        if (this.props.deleteFileState !== prevProps.deleteFileState && this.props.deleteFileState === 'SUCCESS') {
            let updatedDataList = _.cloneDeep(this.state.dataList);
            const currentDataId = this.props.currentDataId;
            const deleteUrl = this.props.deleteUrl;
            let enableSubmit = this.state.enableSubmit;
            let noEdit;
            _.forEach(updatedDataList, function (item) {
                if (item.data.uuid === undefined && currentDataId === null) {
                    noEdit = item.noEdit;
                    if (enableSubmit === false && noEdit)
                        item.editMode = false;
                    item.data.downloadURL = item.data.downloadURL.filter(url => {
                        if (url === deleteUrl) return null;
                        else return url;
                    })
                }
                else if (item.data.uuid === currentDataId) {
                    noEdit = item.noEdit;
                    if (enableSubmit === false && noEdit)
                        item.editMode = false;
                    item.data.downloadURL = item.data.downloadURL.filter(url => {
                        if (url === deleteUrl) return null;
                        else return url;
                    })
                }
            })

            this.setState({ dataList: updatedDataList });
            this.props.onResetDeleteUrl();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.props.initState();
    }

    handleInputChange = (value, inputIdentifier, targetIndex) => {
        // let enableSubmit = false;
        let updatedFormArray = [...this.state.dataList];

        updatedFormArray = updatedFormArray.map((item, index) => {
            if (index === targetIndex) {
                return {
                    ...item,
                    data: {
                        ...fieldData.InitData,
                        [inputIdentifier]: value
                    },
                    noEdit: false
                }
            }
            return (item);
        });

        if (inputIdentifier === 'type') {
            this.setState({
                dataList: [],
                tempDataList: updatedFormArray
            });
        }
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

    handleAddMoreEnable = () => {
        let enableAddMore = false;
        _.forEach(this.state.dataList, function (data) {
            if (data.editMode === true) {
                enableAddMore = true;
            }
        })
        return enableAddMore;
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
        this.setState({ enableSubmit: false, postId: this.state.dataList[targetIndex].data.uuid })
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
            showCancelPopUp: false,
            enableSubmit: false
        });
    }

    removePopUp = (noEdit, index, uuid) => {
        if (noEdit) {
            this.handleCancel(index, uuid);
        }
        else {
            let showCancelPopUpFlag = (this.state.showCancelPopUp ? false : true)
            this.setState({ showCancelPopUp: showCancelPopUpFlag });
        }
    }

    uploadFile = (file, dataId) => {
        var i;
        let formData = new FormData();
        for (i = 0; i < file.length; i++) {
            formData.append('file', file[i]);
        }
        this.props.onUploadFile('organisation_documents', formData, dataId);
    }

    showDeleteFileWarning = (e, dataId, url, type) => {
        e.stopPropagation();
        const deleteObject = {
            dataId: dataId,
            url: url,
            type: type
        };
        this.setState({
            confirmDelete: true,
            deleteObject: deleteObject
        });
    }

    deleteFile = () => {

        const dataId = this.state.deleteObject.dataId;
        const url = this.state.deleteObject.url;
        const type = this.state.deleteObject.type;

        let fileName = url === null || url === '' || url === undefined ? '' :
            url.split('/');
        fileName = fileName[fileName.length - 1];

        let updatedDataList = _.cloneDeep(this.state.dataList);
        updatedDataList = updatedDataList.map((eachData, dataIndex) => {

            if (eachData.data.type === type) {
                let updatedDownloadURL = _.cloneDeep(eachData.data.downloadURL);
                updatedDownloadURL = updatedDownloadURL.filter((url) => {

                    let fileInData = (url === null || url === '' || url === undefined) ? '' :
                        url.split('/');
                    fileInData = fileInData[fileInData.length - 1];
                    if (fileInData === fileName) return null;
                    else return url;
                })
                return ({
                    ...eachData,
                    downloadURL: updatedDownloadURL
                })
            }
            return eachData
        })

        let updatedStoreDataList = this.state.dataList;

        updatedStoreDataList = updatedStoreDataList.map((eachData, eachIndex) => {
            if (eachData.data.uuid === dataId) {
                let updatedDownloadURL = _.cloneDeep(eachData.data.downloadURL);
                updatedDownloadURL = updatedDownloadURL.filter((url) => {
                    let fileInData = url === null || url === '' || url === undefined ? '' :
                        url.split('/');
                    fileInData = fileInData[fileInData.length - 1];
                    if (fileInData === fileName) return null
                    else return url;
                })
                return ({
                    ...eachData.data,
                    downloadURL: updatedDownloadURL
                })
            }
            return eachData.data;
        })
        this.props.onDeleteFile('organisation_documents', dataId, fileName, url, updatedStoreDataList);

        this.setState({
            confirmDelete: false,
            dataList: updatedDataList,
            deleteObject: {}
        })
    }

    togglePopUp = () => {
        let showDeletePopUpFlag = (this.state.showDeletePopUp ? false : true)
        this.setState({ showDeletePopUp: showDeletePopUpFlag });
    }

    addFormRef = (form) => {
        if (form) {
            this.formsEvery = [...this.formsEvery, form];
        }
    }

    handleCloseWarningPopUp = () => {
        this.setState({ confirmDelete: false, deleteObject: {} })
    }

    handleEditButtonGroup = (showEditButtonGroup, index) => {
        this.setState({ showEditButtonGroup: showEditButtonGroup, index: index })
    }

    getFormData = (formData, targetIndex, enableSubmit) => {
        let updatedDataList = _.cloneDeep(this.state.dataList);
        updatedDataList = updatedDataList.map((item, index) => {
            if (index === targetIndex) {
                return {
                    ...item,
                    data: {
                        ...formData
                    },
                    noEdit: false
                }
            }
            return (item);
        });
        this.setState({ dataList: updatedDataList, enableSubmit: enableSubmit })
    }

    successClickedHandler = () => {
        this.setState({ showSuccessNotification: false });
    };

    errorClickedHandler = () => {
        this.props.onResetError();
    }

    handleFileDownload = (url) => {
        this.props.onDownloadFile('organisation_documents', url);
    }

    render() {
        const { t } = this.props;
        this.formsEvery = [];
        let thisRef = this;
        let everyform = [];
        const { match } = this.props;
        const orgId = match.params.uuid;

        _.forEach(this.state.dataList, function (item, index) {
            everyform.push(
                <div key={index} className={!item.editMode ? cx(styles.CardLayout) : cx(styles.DisabledCardLayout)}
                    onMouseEnter={() => thisRef.handleEditButtonGroup(true, index)} onMouseLeave={() => thisRef.handleEditButtonGroup(false, null)}
                >
                    <Prompt
                        when={!item.noEdit}
                        navigate={path => thisRef.props.history.push(path)}
                    />
                    {(item.data.uuid ? (thisRef.state.showSuccessNotification && item.data.uuid === thisRef.props.currentDataId) : false) ?
                        <div className={(item.data.uuid ? (thisRef.state.showSuccessNotification && item.data.uuid === thisRef.props.currentDataId) : false) ? cx(styles.ShowSuccessNotificationCard, 'flex align-items-center') : cx(styles.HideSuccessNotificationCard)}>
                            <SuccessNotification clicked={() => thisRef.successClickedHandler()} />
                        </div>
                        :
                        (thisRef.props.error !== null && item.editMode) ?
                            <div className={thisRef.props.error ? cx(styles.ShowErrorNotificationCard, 'flex align-items-center') : cx(styles.HideSuccessNotificationCard)}>
                                <ErrorNotification error={thisRef.props.error} clicked={thisRef.errorClickedHandler} />
                            </div>
                            :
                            <div className={styles.emptyNotification}></div>
                    }

                    <div className={cx(styles.CardPadding, 'card-body')}>
                        {thisRef._isMounted ?
                            <div>
                                <div className="row" key={index}>
                                    <CustomSelect
                                        name='type'
                                        className="my-1 col-5 py-2"
                                        label={t('translation_orgDoc:input_orgDocuments.label.docType')}
                                        required={_.includes(requiredFields, 'type')}
                                        disabled={!_.isEmpty(item.data.uuid) ? true : false}
                                        options={documentTypeOptions}
                                        value={item.data.type}
                                        onChange={(value) => thisRef.handleInputChange(value, 'type', index)}
                                    />
                                </div>
                                {thisRef.renderChild ?
                                    <OrgDocumentsFields
                                        type={item.data.type}
                                        changed={thisRef.getFormData}
                                        index={index}
                                        editMode={item.editMode}
                                        docList={item}
                                        onErrorCheck={(errorCheck) => thisRef.handleCheckError(errorCheck)}
                                    />
                                    : null}
                                <div className='row no-gutters mt-1'>
                                    <Upload
                                        upload={upload}
                                        disabled={!item.editMode}
                                        fileUpload={(file) => thisRef.uploadFile(file, item.data.uuid)}
                                        className={item.editMode ? styles.Cursor : null}
                                        // url={item.data.downloadURL.length > 1 ? item.data.downloadURL[1] : item.data.downloadURL[0]}
                                        addState={item.editMode ? thisRef.props.uploadFileState : null}
                                    />
                                    {!_.isEmpty(item.data.downloadURL) ? item.data.downloadURL.map((url, index) => {
                                        return (
                                            <FileView
                                                key={index}
                                                className={cx(styles.Preview, 'ml-2 mb-2')}
                                                url={url}
                                                disabled={!item.editMode}
                                                fileClicked={thisRef.props.downloadFileState === 'LOADING' ? null : () => thisRef.handleFileDownload(url)}
                                                downloadFileState={thisRef.props.downloadFileState}
                                                clicked={item.editMode ? (e) => thisRef.showDeleteFileWarning(e, item.data.uuid, url) : null}
                                            />
                                        )
                                    }) : ''}
                                </div>
                            </div>
                            : null}
                        {thisRef.state.confirmDelete ?
                            <WarningPopUp
                                key={index}
                                text={t('translation_orgDoc:warning_orgDocuments_delete.text')}
                                para={t('translation_orgDoc:warning_orgDocuments_delete.para')}
                                confirmText={t('translation_orgDoc:warning_orgDocuments_delete.confirmText')}
                                cancelText={t('translation_orgDoc:warning_orgDocuments_delete.cancelText')}
                                icon={warn}
                                warningPopUp={() => thisRef.deleteFile()}
                                closePopup={() => thisRef.handleCloseWarningPopUp()}
                            />
                            : null
                        }

                        {item.editMode ?
                            <div className="row no-gutters justify-content-end">
                                <CancelButton clickHandler={() => thisRef.removePopUp(item.noEdit, index, item.data.uuid)}>{t('translation_orgDoc:button_orgDocuments.cancel')}</CancelButton>
                                {thisRef.state.showCancelPopUp ?
                                    <WarningPopUp
                                        text={t('translation_orgDoc:warning_orgDocuments_cancel.text')}
                                        para={t('translation_orgDoc:warning_orgDocuments_cancel.para')}
                                        confirmText={t('translation_orgDoc:warning_orgDocuments_cancel.confirmText')}
                                        cancelText={t('translation_orgDoc:warning_orgDocuments_cancel.cancelText')}
                                        icon={warn}
                                        warningPopUp={() => { thisRef.handleCancel(index, item.data.uuid) }}
                                        closePopup={thisRef.removePopUp.bind(thisRef, item.noEdit, index, item.data.uuid)}
                                    />
                                    : null
                                }

                                {thisRef.props.postDataState === 'LOADING' || thisRef.props.putDataState === 'LOADING' ? <Spinnerload type='loading' /> :
                                    <HasAccess
                                        permission={item.data.uuid ? ["ORG_DOCUMENTS:EDIT"] : ["ORG_DOCUMENTS:CREATE"]}
                                        orgId={orgId}
                                        yes={() => (
                                            <Button label={t('translation_orgDoc:button_orgDocuments.Save')} isDisabled={!thisRef.state.enableSubmit} clickHandler={() => thisRef.handleFormSubmit(index, item.data.uuid)} />
                                        )}
                                    />
                                }
                            </div>
                            :
                            <div>
                                {(thisRef.state.showEditButtonGroup && index === thisRef.state.index) ?
                                    <div className="row no-gutters justify-content-end">
                                        <HasAccess
                                            permission={["ORG_DOCUMENTS:DELETE"]}
                                            orgId={orgId}
                                            yes={() => (
                                                <DeleteButton className='px-3' isDeleteIconRequired={true} isDisabled={false} label={t('translation_orgDoc:button_orgDocuments.delete')} clickHandler={() => thisRef.togglePopUp()} />
                                            )}
                                        />
                                        {thisRef.state.showDeletePopUp ?
                                            <WarningPopUp
                                                text={t('translation_orgDoc:warning_orgDocuments_delete.text')}
                                                para={t('translation_orgDoc:warning_orgDocuments_delete.para')}
                                                confirmText={t('translation_orgDoc:warning_orgDocuments_delete.confirmText')}
                                                cancelText={t('translation_orgDoc:warning_orgDocuments_delete.cancelText')}
                                                icon={warn}
                                                warningPopUp={() => thisRef.handleDeleteData(index)}
                                                closePopup={thisRef.togglePopUp.bind(thisRef)}
                                            />
                                            : null}
                                        {thisRef.state.showSaveButton === true && item.data.uuid === thisRef.props.currentDataId ?
                                            thisRef.props.error ? <span className='ml-2'><Spinnerload /></span> :
                                                <span className='ml-2'><Spinnerload type='success' /></span>
                                            :
                                            <HasAccess
                                                permission={["ORG_DOCUMENTS:EDIT"]}
                                                orgId={orgId}
                                                yes={() => (
                                                    <Button label={t('translation_orgDoc:button_orgDocuments.edit')} isDisabled={thisRef.handleAddMoreEnable()} clickHandler={() => thisRef.handleEnableEdit(index)} type='edit'></Button>
                                                )}
                                            />
                                        }
                                    </div>
                                    : ''}
                            </div>
                        }
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
                            <CardHeader label={t('translation_orgDoc:cardHeader')} iconSrc={cardHeaderIcon} />

                            {this.props.dataList.length > 0 ?
                                <HasAccess
                                    permission={["ORG_DOCUMENTS:CREATE"]}
                                    orgId={orgId}
                                    yes={() => (
                                        <div className="d-flex ml-auto">
                                            <div className={cx(styles.AddMoreButton, 'd-flex mr-1')} disabled={this.handleAddMoreEnable()} onClick={() => this.handleAddNewData()}>
                                                <label className="pl-2 ml-2 my-2 align-self-center">{t('translation_orgDoc:label.l1')}</label>
                                                <img className={cx("pl-2 my-auto", styles.addStyle)} src={add_enabled} alt={t('translation_orgDoc:image_alt_orgDocuments.add')} />
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
        currentDataId: state.orgMgmt.orgDocuments.currentDataId,
        getDataState: state.orgMgmt.orgDocuments.getDataState,
        postDataState: state.orgMgmt.orgDocuments.postDataState,
        putDataState: state.orgMgmt.orgDocuments.putDataState,
        deleteDataState: state.orgMgmt.orgDocuments.deleteDataState,
        dataList: state.orgMgmt.orgDocuments.dataList,
        error: state.orgMgmt.orgDocuments.error,
        uploadFileState: state.orgMgmt.orgDocuments.uploadFileState,
        downloadURL: state.orgMgmt.orgDocuments.downloadURL,
        deleteUrl: state.orgMgmt.orgDocuments.deleteUrl,
        orgData: state.orgMgmt.staticData.orgData,
        deleteFileState: state.orgMgmt.orgDocuments.deleteFileState,
        rightnavOrgId: state.orgMgmt.staticData.rightnavOrgId,
        downloadFileState: state.orgMgmt.orgDocuments.downloadFileState,
        downloadFileId: state.orgMgmt.orgDocuments.fileId,
    };
};


const mapDispatchToProps = dispatch => {
    return {
        initState: () => dispatch(actions.initState()),
        onResetDownloadUrl: () => dispatch(actions.resetDownloadUrl()),
        onResetDeleteUrl: () => dispatch(actions.resetDeleteUrl()),
        onGetDataList: (orgId) => dispatch(actions.getDataList(orgId)),
        onPostData: (orgId, data) => dispatch(actions.postData(orgId, data)),
        onPutData: (orgId, dataId, data) => dispatch(actions.putData(orgId, dataId, data)),
        onDeleteData: (orgId, dataId) => dispatch(actions.deleteData(orgId, dataId)),
        onUploadFile: (type, formData, dataId) => dispatch(actions.uploadFile(type, formData, dataId)),
        onDeleteFile: (type, dataId, fileName, url, data) => dispatch(actions.deleteFile(type, dataId, fileName, url, data)),
        onResetError: () => dispatch({ type: actionTypes.RESET_ERROR }),
        getOrgData: (orgId) => dispatch(actionsOrgMgmt.getDataById(orgId)),
        onDownloadFile: (type, url) => dispatch(actions.downloadFile(type, url))
    };
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Documents));