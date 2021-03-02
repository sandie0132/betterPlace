import React, { Component } from 'react';

import cx from 'classnames';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import _ from 'lodash';

import styles from './DocumentManagement.module.scss';
import scrollStyle from '../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import * as actionsDocument from './Store/action';
import DownloadButton from '../../../../../components/Atom/DownloadButton/DownloadButton';
import Loader from '../../../../../components/Organism/Loader/Loader';
import Prompt from '../../../../../components/Organism/Prompt/Prompt';
import LargeFileUpload from '../../../../../components/Molecule/LargeFileUpload/LargeFileUpload';

/////SVGs
import fileUpload from '../../../../../assets/icons/excelUpload.svg';
import success from '../../../../../assets/icons/excelSuccess.svg';
import error from '../../../../../assets/icons/excelError.svg';
import download from '../../../../../assets/icons/downloadIcon.svg';
import warn from '../../../../../assets/icons/warning.svg';

import WarningPopUp from '../../../../../components/Molecule/WarningPopUp/WarningPopUp';
import container from '../../../../../assets/icons/selectDocument.svg';
import ArrowLink from '../../../../../components/Atom/ArrowLink/ArrowLink';
import CardHeader from '../../../../../components/Atom/PageTitle/PageTitle';




class DocumentManagement extends Component {

    state = {
        fileName: '',
        documentType: '',
        showDownloadSample: false,
        showTryAgain: false,
        currentDocData: {},
        resetDoc: false,
        completedDoc: false,
        processedDoc: false,
        showGenerateText: false,
        isEdited: false,
        currentTemplateType: '',
        showResetPopup: false,
        currentDownloadType: ''


    }

    componentDidMount = () => {
        if (this.props.match.path !== "/customer-mgmt/org/:uuid/onboardconfig/document-mgmt") {
            let documentType = this.props.match.url.split('/').pop();
            documentType = documentType.toUpperCase();
            this.setState({ documentType: documentType })
            ///// Handle SELECT DOC to DOCUMENT-MGMT Route
            if (!_.isEmpty(this.props.orgOnboardConfigData)) {
                let docSectionData = this.handleCurrentSectionData(this.props.orgOnboardConfigData, documentType);
                let completedDoc = false, processedDoc = false; let showDownloadSample = false;
                if (!_.isEmpty(docSectionData.downloadURL) && !_.isEmpty(docSectionData.sampleDownloadURL)) {
                    if (docSectionData.isApproved) { completedDoc = true; }
                    else if (!docSectionData.isApproved) { processedDoc = true; showDownloadSample = true };
                }
                this.props.setCurrentDocType(documentType, docSectionData.documentLabel);
                this.setState({ currentDocData: docSectionData, completedDoc: completedDoc, processedDoc: processedDoc, showDownloadSample: showDownloadSample })

            }
        }

    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.fileUploadState !== prevProps.fileUploadState && this.props.fileUploadState === "SUCCESS") {
            let orgId = this.props.match.params.uuid;
            this.props.fileProcess(orgId, this.props.downloadURL[0], this.state.documentType)
            this.setState({ isEdited: true })
        }

        if (this.props.fileProcessState !== prevProps.fileProcessState && this.props.fileProcessState === "SUCCESS") {
            let processedData = _.cloneDeep(this.props.fileProcessedData);
            let showDownloadSample = false; let thisRef = this;
            _.forEach(processedData.documents, function (value) {
                if (value.documentType === thisRef.state.documentType) {
                    if (!_.isEmpty(value.downloadURL) && !_.isEmpty(value.sampleDownloadURL) && value.isApproved !== undefined) {
                        showDownloadSample = true
                    }
                }
            })
            this.setState({ showDownloadSample: showDownloadSample });
        }

        if (this.props.fileProcessState !== prevProps.fileProcessState && this.props.fileProcessState === "ERROR") {
            this.setState({ showTryAgain: true })
        }

        if (this.props.fileDownloadState !== prevProps.fileDownloadState && this.props.fileDownloadState === "SUCCESS") {
            this.setState({ showGenerateText: true });
        }


        if (this.props.match.url !== prevProps.match.url) {   ////////State reset on url change//////
            this.handleResetDocument();
        }

        if (!_.isEqual(this.props.orgOnboardConfigData, prevProps.orgOnboardConfigData) && !_.isEmpty(this.props.orgOnboardConfigData)) {

            let docSectionData = this.handleCurrentSectionData(this.props.orgOnboardConfigData, this.state.documentType);
            let completedDoc = false, processedDoc = false; let showDownloadSample = false;
            if (!_.isEmpty(docSectionData.downloadURL) && !_.isEmpty(docSectionData.sampleDownloadURL)) {
                if (docSectionData.isApproved) { completedDoc = true; }
                else if (!docSectionData.isApproved) { processedDoc = true; showDownloadSample = true };
            }
            this.props.setCurrentDocType(this.state.documentType, docSectionData.documentLabel);
            this.setState({
                showGenerateText: false, showTryAgain: false,
                currentDocData: docSectionData, completedDoc: completedDoc,
                processedDoc: processedDoc, showDownloadSample: showDownloadSample
            })
        }

        if (this.props.postOrgOnboardConfigState !== prevProps.postOrgOnboardConfigState && this.props.postOrgOnboardConfigState === "SUCCESS") {
            this.setState({ isEdited: false }); /////RESET isEdited on POST success
            if (this.state.resetDoc) {
                this.handleResetDocument();
            }
        }
    }

    componentWillUnmount = () => {
        this.handleResetDocument();
    }

    handleResetDocument = () => {    /////////////STATE AND PROPS RESET FUNCTION ///////////
        this.props.initState();
        let documentType = this.props.match.url.split('/').pop();
        documentType = documentType.toUpperCase();
        let docSectionData = this.handleCurrentSectionData(this.props.orgOnboardConfigData, documentType);
        let showDownloadSample = false;
        let completedDoc = false, processedDoc = false;
        if (!_.isEmpty(docSectionData.downloadURL) && !_.isEmpty(docSectionData.sampleDownloadURL)) {
            if (docSectionData.isApproved) { completedDoc = true; }
            else if (!docSectionData.isApproved) { processedDoc = true; showDownloadSample = true };
        }

        this.setState({
            documentType: documentType, fileName: '', showDownloadSample: showDownloadSample, currentDownloadType: '',
            currentDocData: docSectionData, resetDoc: false, showTryAgain: false, currentTemplateType: '',
            completedDoc: completedDoc, processedDoc: processedDoc, showGenerateText: false, isEdited: false
        });

        this.props.setCurrentDocType(documentType, docSectionData.documentLabel);
    }

    resetWarningToggle = () => {
        this.setState({
            showResetPopup: !this.state.showResetPopup
        })
    }

    handleResetConfig = () => {
        let config = _.cloneDeep(this.props.orgOnboardConfigData);
        let thisRef = this;

        _.forEach(config.documents, function (value, index) {
            if (value.documentType === thisRef.state.documentType) {
                delete config.documents[index].downloadURL;
                delete config.documents[index].sampleDownloadURL;
                delete config.documents[index].isApproved;
                delete config.documents[index].variables;
            }
        })

        // this.handleResetDocument();
        this.setState({ resetDoc: true, showResetPopup: false })
        let orgId = this.props.match.params.uuid;
        this.props.onPostOnboardConfig(orgId, config);


    }

    handleCurrentSectionData = (config, type) => {
        let docData = {};
        if (!_.isEmpty(config)) {
            if (!_.isEmpty(config.documents)) {
                _.forEach(config.documents, function (value) {
                    if (value.documentType === type) {
                        docData = value;
                    }
                })
            }
        }
        return docData;
    }

    handleDocumentTypeText = (type) => {
        let docType = type.toLowerCase();
        docType = docType.split('_').join(" ");
        return docType;
    }

    getDocTypeLabel = (type) => {
        let returnValue = "";
        let onboardConfig = _.cloneDeep(this.props.orgOnboardConfigData);
        if (!_.isEmpty(onboardConfig)) {
            if (!_.isEmpty(onboardConfig.documents)) {
                _.forEach(onboardConfig.documents, function (value) {
                    if (value.documentType === type) {
                        returnValue = value.documentValue;
                    }
                })
            }
        }

        return returnValue;
    }

    uploadFile = (file) => {
        let formData = new FormData();
        formData.append('file', file);
        this.setState({ fileName: file.name });
        this.props.fileUpload("organisation_documents", formData);
    }

    sampleFileDownload = (section) => {

        let configDocuments = {};
        if (!_.isEmpty(this.props.fileProcessedData)) {
            let config = _.cloneDeep(this.props.fileProcessedData);
            configDocuments = _.cloneDeep(config.documents)
        } else {
            let config = _.cloneDeep(this.props.orgOnboardConfigData);
            configDocuments = _.cloneDeep(config.documents)
        }

        let thisRef = this;
        if (!_.isEmpty(configDocuments)) {
            _.forEach(configDocuments, function (value) {
                if (value.documentType === thisRef.state.documentType) {
                    if (section === "DOCUMENT_TEMPLATE") {
                        thisRef.props.fileDownload("organisation_documents", value.downloadURL)
                    }
                    else thisRef.props.fileDownload("organisation_documents", value.sampleDownloadURL)
                }
            })
        }

        if (section === "DOCUMENT_PROCESS") { this.setState({ currentDownloadType: "sample" }) }
        else if (section === "DOCUMENT_TEMPLATE") { this.setState({ currentDownloadType: "template" }) }
        else if (section === "DOCUMENT_CONFIRMATION") { this.setState({ currentDownloadType: "sample" }) }
    }

    uploadDocLabelHandler = (status, errorMsg) => {


        if (status === "SUCCESS") return this.state.fileName + " has been successfully uploaded";
        else if (status === "LOADING") return "please wait while the document is being uploaded"
        else if (status === "ERROR") return errorMsg;
        else if (status === "INIT") {
            let config = _.cloneDeep(this.props.orgOnboardConfigData);
            let thisRef = this;
            let fileName = '';
            if (!_.isEmpty(config)) {
                if (!_.isEmpty(config.documents)) {
                    _.forEach(config.documents, function (value) {
                        if (value.documentType === thisRef.state.documentType) {
                            if (!_.isEmpty(value.downloadURL)) {
                                fileName = value.downloadURL;
                                fileName = fileName.split("/").pop();
                            }
                        }
                    })
                }
            }

            if (!_.isEmpty(fileName)) { return fileName + " has been successfully uploaded"; }
            else return "drag and drop or upload " + this.handleDocumentTypeText(this.state.documentType) + " template for configuration";
        }
        else return "drag and drop or upload " + this.handleDocumentTypeText(this.state.documentType) + " template for configuration"
    }

    processDocLabelHandler = (status, errorMsg) => {
        if (this.state.completedDoc) return "document has been successfully processed."
        else if (status === "SUCCESS" || (status === "INIT" && this.state.processedDoc)) return "document has been successfully processed. download the sample preview below to proceed";
        else if (status === "LOADING") return "please wait while the document is being processed";
        else if (status === "ERROR") return errorMsg;
        else return "";
    }

    handleDisableUploader = () => {
        let returnValue = false;
        if (this.state.completedDoc || this.state.processedDoc || this.state.isEdited) {
            returnValue = true
        }
        return returnValue;
    }

    handleConfirmDocument = () => {
        let configDocuments = {};
        if (!_.isEmpty(this.props.fileProcessedData)) {
            let config = _.cloneDeep(this.props.fileProcessedData);
            configDocuments = _.cloneDeep(config.documents)
        } else {
            let config = _.cloneDeep(this.props.orgOnboardConfigData);
            configDocuments = _.cloneDeep(config.documents)
        }

        let thisRef = this;

        _.forEach(configDocuments, function (config, index) {
            if (config.documentType === thisRef.state.documentType) {
                configDocuments[index].isApproved = true
            }
        })
        let orgId = this.props.match.params.uuid;

        this.props.onPostOnboardConfig(orgId, { documents: configDocuments })
    }

    handleTemplateDownload = (type) => {
        this.setState({ currentTemplateType: type });

        this.props.templateDownload(type)

    }

    render() {
        const { match } = this.props;
        let orgId = match.params.uuid;
        return (
            <React.Fragment>
                <Prompt
                    when={this.state.isEdited}
                />
                <div className={cx(styles.alignCenter, scrollStyle.scrollbar, "pt-4")}>
                    <ArrowLink
                        label={!_.isEmpty(this.props.orgData) ? this.props.orgData.name.toLowerCase() : null}
                        url={`/customer-mgmt/org/` + orgId + `/profile`}
                    />
                    <CardHeader label={"document management - " + this.props.currentDocumentLabel} iconSrc={container} />
                    <div className={cx(styles.CardLayout, 'row no-gutters')}>
                        <div className='d-flex flex-column col-3 pr-0 pl-3'>
                            <form>
                                <div style={{ minHeight: "10rem", maxHeight: "13rem" }}>
                                    <LargeFileUpload
                                        className={this.props.fileUploadState === "SUCCESS" ? null : styles.Preview}
                                        upload={fileUpload}
                                        disabled={this.handleDisableUploader()}
                                        fileUpload={(file) => this.uploadFile(file)}
                                        fileLoadingState={(this.state.processedDoc || this.state.completedDoc) ? "SUCCESS" : this.props.fileUploadState}     //"SUCCESS"//{this.props.fileUploadState}
                                        percentCompleted={(this.state.processedDoc || this.state.completedDoc) ? 100 : this.props.percentCompleted} //{this.props.percentCompleted}
                                        accept={"application/vnd.openxmlformats-officedocument.wordprocessingml.document"}
                                        maxMbSize={2}
                                        supportedExtensions={['.docx', '.DOCX']}
                                    />
                                </div>
                            </form>

                            <div className="mt-3" style={{ textAlign: "center" }}>
                                <label className={styles.smallText}>don't have document template ?<br />please download from below</label>

                                {/* /////////TEMPLATE DOWNLOAD BUTTON //////////// */}
                                <div style={{ marginLeft: "0rem" }}>
                                    <div onClick={() => this.handleTemplateDownload(this.state.documentType)} className={cx(styles.downloadTemplateButtonContainer, styles.Preview, "d-flex flex-row mx-auto")}>
                                        {this.props.templateDownloadState === "LOADING" && this.state.currentTemplateType === this.state.documentType ?
                                            <div style={{ marginLeft: "10px", paddingRight: "12px" }}><Loader type='stepLoaderBlue' /></div>
                                            :
                                            <img src={download} alt="icon" style={{ height: "16px", width: "16px", minWidth: "16px", marginLeft: "6px", marginTop: "4px" }} />}
                                        <label className={cx(styles.sectionText, styles.blueText, styles.Preview, styles.templateDownloadText)} style={{ paddingLeft: "8px", paddingTop: "4px", paddingRight: "4px" }}>{this.state.documentType.toLowerCase().split('_').join(" ") + " template"}</label>
                                    </div>
                                </div>

                                <hr className={styles.horizontalLine}></hr>
                                <div style={{ textAlign: "center" }}><label className={styles.smallText}>please follow these guideline<br /> after downloading</label></div>

                                {/* //////////////GUIDELINES TEMPLATE DOWNLOAD/////////////// */}
                                <div className="d-flex flex-row mx-auto" style={{ width: "10.5rem", cursor: "pointer" }}>
                                    <label onClick={() => this.handleTemplateDownload("GUIDELINES")} className={cx(styles.sectionText, styles.blueText, styles.underline, styles.Preview)} style={{ textAlign: "center" }}>guidelines &#38; datafields</label>
                                    {this.props.templateDownloadState === "LOADING" && this.state.currentTemplateType === "GUIDELINES" ?
                                        <div style={{ marginTop: "-4px", marginLeft: "10px" }}><Loader type='stepLoaderBlue' /></div>
                                        :
                                        <img src={download} alt="icon" style={{ height: "16px", width: "16px", marginLeft: "6px" }} />}
                                </div>
                            </div>
                        </div>

                        <div className="col-9 no-gutters d-flex flex-column">


                            {/* ///////////////////////UPLOAD DOCUMENT SECTION///////////// */}
                            <div className="d-flex flex-row" style={{ paddingLeft: "2.4rem", height: "6rem" }}>
                                <div className="col-1 pl-0 flex-column justify-content-center">
                                    {this.props.fileUploadState === 'ERROR' ?
                                        <React.Fragment>
                                            <img className={cx(styles.whiteBackground, styles.iconMarginLeft, 'mr-2')} src={error} alt='activeCircle' />
                                            <div className={styles.verticleLineDisabledError} />
                                        </React.Fragment> :
                                        this.props.fileUploadState === 'SUCCESS' || this.state.completedDoc || this.state.processedDoc ?
                                            <React.Fragment>
                                                <img className={cx('mr-2', styles.iconMarginLeft, styles.whiteBackground)} src={success} alt='tick' />
                                                <div className={styles.verticleLineActive} />
                                            </React.Fragment> :
                                            this.props.fileUploadState === 'LOADING' ?
                                                <React.Fragment>
                                                    <Loader type='stepLoaderSmall' />
                                                    <div className={cx(styles.verticleLineDisabled, 'mt-4')} />
                                                </React.Fragment>
                                                :
                                                <div>
                                                    <div className={cx(styles.inactiveCircle)}>
                                                        <div className={styles.stepNumber}>
                                                            <div className={styles.numberFont}>
                                                                {'1'}
                                                            </div>
                                                        </div> <div className={styles.verticleLineDisabled} />
                                                    </div>
                                                </div>}

                                </div>
                                <div className="d-flex flex-column">
                                    <label className={(this.state.completedDoc || this.state.processedDoc || this.props.fileUploadState !== "INIT") ? cx(styles.sectionHeading) : cx(styles.sectionHeading, styles.greyText)}>upload document</label>
                                    <div className={this.state.completedDoc ? cx(styles.opacContainer) : ""}>
                                        <label className={this.props.fileUploadState === 'SUCCESS' || this.state.processedDoc || this.state.completedDoc ? cx(styles.sectionText, styles.greenText) : this.props.fileUploadState === "ERROR" ? cx(styles.sectionText, styles.redText) : cx(styles.sectionText, styles.greyText)}>
                                            {this.uploadDocLabelHandler(this.props.fileUploadState, this.props.error)}</label> </div>
                                </div>
                            </div>
                            {/* //////////END OF UPLOAD DOCUMENT SECTION//////////////// */}


                            {/* //////////////// DOCUMENT PROCESS SECTION ///////////// */}
                            <div className={this.state.processedDoc || this.state.completedDoc || this.state.showTryAgain ? cx("d-flex flex-row", styles.documentSectionHeightLarge) : cx("d-flex flex-row", styles.documentSectionHeightMid)} style={{ paddingLeft: "2.4rem" }}>
                                <div className="col-1 pl-0 flex-column justify-content-center">
                                    {this.props.fileProcessState === 'ERROR' ?
                                        <React.Fragment>
                                            <img className={cx(styles.iconMarginLeft, styles.whiteBackground, 'mr-2')} src={error} alt='activeCircle' />
                                            <div className={cx(styles.verticleLineDisabledError, styles.verticleLineHeightLarge)} />
                                        </React.Fragment> :
                                        this.props.fileProcessState === 'SUCCESS' || this.state.completedDoc || this.state.processedDoc ?
                                            <React.Fragment>
                                                <img className={cx('mr-2', styles.iconMarginLeft, styles.whiteBackground)} src={success} alt='tick' />
                                                <div className={cx(styles.verticleLineActive, styles.verticleLineHeightLarge)} />
                                            </React.Fragment> :
                                            this.props.fileProcessState === 'LOADING' ?
                                                <React.Fragment>
                                                    <Loader type='stepLoaderSmall' />
                                                    <div className={cx(styles.verticleLineDisabled, 'mt-4')} />
                                                </React.Fragment>
                                                :
                                                <div>
                                                    <div className={cx(styles.inactiveCircle)}>
                                                        <div className={styles.stepNumber}>
                                                            <div className={styles.numberFont}>
                                                                {'2'}
                                                            </div>
                                                        </div> <div className={styles.verticleLineDisabled} />
                                                    </div>
                                                </div>}

                                </div>
                                <div className="d-flex flex-column">
                                    <label className={(this.state.completedDoc || this.state.processedDoc || this.props.fileProcessState !== "INIT") ? cx(styles.sectionHeading) : cx(styles.sectionHeading, styles.greyText)}>document process</label>
                                    <div className={this.state.completedDoc ? cx(styles.opacContainer) : ""}>
                                        <label className={(this.props.fileProcessState === 'SUCCESS' || (this.props.fileProcessState === "INIT" && (this.state.processedDoc || this.state.completedDoc))) ? cx(styles.sectionText, styles.greenText) : this.props.fileProcessState === "ERROR" ? cx(styles.sectionText, styles.redText, styles.twoLineEllipsis) : cx(styles.sectionText, styles.greyText)}>
                                            {this.processDocLabelHandler(this.props.fileProcessState, this.props.error)}</label> </div>

                                    {/* ////////////  DOWNLOAD SAMPLE BUTTON     //////////// */}
                                    {/* {this.state.showDownloadSample ?

                                        <div style={{ marginTop: "1rem" }}>
                                            <DownloadButton
                                                type='orgOnboardSample'
                                                label={'download sample preview'}
                                                className={styles.sampleDownloadLarge}
                                                downloadState={this.props.fileDownloadState}
                                                clickHandler={() => this.sampleFileDownload("DOCUMENT_PROCESS")}
                                                disabled={false}
                                            />
                                        </div>
                                        : this.state.showTryAgain ?
                                            ////////////// TRY AGAIN BUTTON ON ERROR ///////////////
                                            <div style={{ marginTop: "1rem" }}>
                                                <div className={cx(styles.confirmContainer, styles.Preview)} onClick={this.handleResetDocument}>
                                                    <label className={cx(styles.sectionText, styles.blueText, styles.Preview)}>try again</label>
                                                </div>
                                            </div>
                                            : null} */}

                                    {this.state.showTryAgain ?
                                        ////////////// TRY AGAIN BUTTON ON ERROR ///////////////
                                        <div style={{ marginTop: "1rem" }}>
                                            <div className={cx(styles.confirmContainer, styles.Preview)} onClick={this.handleResetDocument}>
                                                <label className={cx(styles.sectionText, styles.blueText, styles.Preview)}>try again</label>
                                            </div>
                                        </div> :
                                        this.state.processedDoc || this.state.completedDoc ?
                                            <div style={{ marginTop: "1rem" }}>
                                                {this.state.processedDoc && ( this.props.fileDownloadState !== "SUCCESS" ) ?
                                                    <DownloadButton
                                                        type='orgOnboardConfigBlue'
                                                        label={'sample preview'}
                                                        className={styles.sampleDownloadActiveLarge}
                                                        downloadState={this.state.currentDownloadType === "sample" ? this.props.fileDownloadState : "INIT"}
                                                        clickHandler={() => this.sampleFileDownload("DOCUMENT_PROCESS")}
                                                        disabled={false}
                                                    /> :
                                                    <DownloadButton
                                                        type='orgOnboardConfig'
                                                        label={'sample preview'}
                                                        className={styles.sampleDownloadLarge}
                                                        downloadState={this.state.currentDownloadType === "sample" ? this.props.fileDownloadState : "INIT"}
                                                        clickHandler={() => this.sampleFileDownload("DOCUMENT_PROCESS")}
                                                        disabled={false}
                                                    />
                                                }
                                            </div> : null}


                                </div>
                            </div>
                            {/* ////////////////////// END OF DOCUMENT PROCESS SECTION /////////// */}

                            {/* ///////////////////////CONFIRMATION DOCUMENT SECTION///////////// */}
                            <div className="d-flex flex-row" style={{ paddingLeft: "2.4rem", height: "6rem" }}>
                                <div className="col-1 pl-0 flex-column justify-content-center">
                                    {this.props.postOrgOnboardConfigState === 'ERROR' ?
                                        <React.Fragment>
                                            <img className={cx(styles.whiteBackground, styles.iconMarginLeft, 'mr-2')} src={error} alt='activeCircle' />

                                        </React.Fragment> :
                                        this.props.postOrgOnboardConfigState === 'SUCCESS' || this.state.completedDoc ?
                                            <React.Fragment>
                                                <img className={cx('mr-2', styles.iconMarginLeft, styles.whiteBackground)} src={success} alt='tick' />

                                            </React.Fragment> :
                                            this.props.postOrgOnboardConfigState === 'LOADING' && !this.state.resetDoc ?
                                                <React.Fragment>
                                                    <Loader type='stepLoaderSmall' />

                                                </React.Fragment>
                                                :
                                                <div>
                                                    <div className={cx(styles.inactiveCircle)}>
                                                        <div className={styles.stepNumber}>
                                                            <div className={styles.numberFont}>
                                                                {'3'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>}

                                </div>
                                <div className="d-flex flex-column">
                                    <label className={this.state.completedDoc || this.state.showGenerateText ? cx(styles.sectionHeading) : cx(styles.sectionHeading, styles.greyText)}>confirmation of generated document</label>

                                    {this.props.postOrgOnboardConfigState === "ERROR" ?
                                        <React.Fragment>
                                            <label className={cx(styles.sectionText, styles.redText)}>{this.props.error}</label>
                                            <div className="d-flex flex-row" style={{ marginTop: "1rem" }}>
                                                <div className={cx(styles.confirmContainer)} onClick={this.handleConfirmDocument}>
                                                    <label className={cx(styles.sectionText, styles.blueText)}>confirm</label>
                                                </div>
                                                <label onClick={this.resetWarningToggle} className={cx(styles.sectionText, styles.greyText, styles.underline)} style={{ marginLeft: "1rem", padding: "0.5rem" }}>cancel and restart</label>
                                            </div>
                                        </React.Fragment> :

                                        this.props.postOrgOnboardConfigState === "SUCCESS" || this.state.completedDoc ?
                                            <React.Fragment>
                                                <div className={this.state.completedDoc ? cx(styles.opacContainer) : ""}>
                                                    <label className={cx(styles.sectionText, styles.greenText)} >{this.handleDocumentTypeText(this.state.documentType) + " document has been successfully configured"}</label>
                                                </div>
                                                <div className="d-flex flex-row justify-content-between" style={{ marginTop: "1rem" }}>
                                                    <DownloadButton
                                                        type='orgOnboardConfig'
                                                        label={'uploaded template'}
                                                        className={styles.templateDownloadMid}
                                                        downloadState={this.state.currentDownloadType === "template" ? this.props.fileDownloadState : "INIT"}
                                                        clickHandler={() => this.sampleFileDownload("DOCUMENT_TEMPLATE")}
                                                        disabled={false}
                                                    />

                                                    {/* <DownloadButton
                                                        type='orgOnboardConfig'
                                                        label={'download sample'}
                                                        className={styles.sampleDownloadMid}
                                                        downloadState={this.state.currentDownloadType === "sample" ? this.props.fileDownloadState : "INIT"}
                                                        clickHandler={() => this.sampleFileDownload("DOCUMENT_CONFIRMATION")}
                                                        disabled={false}
                                                    /> */}

                                                    <label onClick={this.resetWarningToggle} className={cx(styles.sectionText, styles.greyText, styles.underline, styles.Preview)} style={{ marginLeft: "1rem", padding: "0.5rem", marginTop: "0.1rem" }}>{"reset and upload " + this.handleDocumentTypeText(this.state.documentType) + " again"}</label>


                                                </div>

                                                {/* <div style={{ textAlign: "center", paddingTop: "8px" }}>
                                                    <label onClick={this.resetWarningToggle} className={cx(styles.sectionText, styles.greyText, styles.underline, styles.Preview)} style={{ marginLeft: "1rem", padding: "0.5rem", marginTop: "0.1rem" }}>{"reset and upload " + this.handleDocumentTypeText(this.state.documentType) + " again"}</label>
                                                </div> */}
                                            </React.Fragment> :

                                            this.props.fileDownloadState === "SUCCESS" || this.state.showGenerateText || this.state.resetDoc ?
                                                <React.Fragment>
                                                    <label className={cx(styles.sectionText, styles.greenText)}>click 'confirm' if the preview template has all the variables mapped</label>
                                                    <label className={cx(styles.sectionText, styles.greyText)}>click 'cancel and restart' to edit and reupload the template</label>
                                                    <div className="d-flex flex-row" style={{ marginTop: "1rem" }}>
                                                        <div className={cx(styles.confirmContainer, styles.Preview)} onClick={this.handleConfirmDocument}>
                                                            <label className={cx(styles.sectionText, styles.blueText, styles.Preview)}>confirm</label>
                                                        </div>
                                                        <label onClick={this.resetWarningToggle} className={cx(styles.sectionText, styles.greyText, styles.underline, styles.Preview)} style={{ marginLeft: "1rem", padding: "0.5rem" }}>cancel and restart</label>
                                                    </div>
                                                </React.Fragment> :
                                                null}

                                    {this.state.showResetPopup ?
                                        <WarningPopUp
                                            text={"are you sure you want to reset the configuration?"}
                                            para={'WARNING: if you reset configuration, document generation of ' + this.handleDocumentTypeText(this.state.documentType) + ' will not be possible until it is configured again'}
                                            confirmText={"confirm"}
                                            cancelText={"cancel"}
                                            icon={warn}
                                            warningPopUp={this.handleResetConfig}
                                            closePopup={this.resetWarningToggle}
                                        />
                                        : null}
                                </div>
                            </div>
                            {/* //////////END OF CONFORMATION DOCUMENT SECTION//////////////// */}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        orgData: state.orgMgmt.staticData.orgData,
        percentCompleted: state.orgMgmt.orgOnboardConfig.documents.percentCompleted,
        fileUploadState: state.orgMgmt.orgOnboardConfig.documents.uploadOrgOnboardDocumentState,
        downloadURL: state.orgMgmt.orgOnboardConfig.documents.downloadURL,
        fileDownloadState: state.orgMgmt.orgOnboardConfig.documents.downloadFileState,
        templateDownloadState: state.orgMgmt.orgOnboardConfig.documents.downloadTemplateFileState,
        orgOnboardConfigData: state.orgMgmt.orgOnboardConfig.onboardConfig.orgOnboardConfig,
        fileProcessState: state.orgMgmt.orgOnboardConfig.documents.fileProcessState,
        fileProcessedData: state.orgMgmt.orgOnboardConfig.documents.fileProcessedData,
        error: state.orgMgmt.orgOnboardConfig.documents.error,
        postOrgOnboardConfigState: state.orgMgmt.orgOnboardConfig.documents.postOrgOnboardConfigState,
        currentDocumentLabel: state.orgMgmt.orgOnboardConfig.documents.currentDocumentLabel

    }
}

const mapDispatchToProps = dispatch => {
    return {
        fileUpload: (folder, imageData) => dispatch(actionsDocument.FileUpload(folder, imageData)),
        fileProcess: (orgId, url, documentType) => dispatch(actionsDocument.fileProcess(orgId, url, documentType)),
        setCurrentDocType: (type, label) => dispatch(actionsDocument.setCurrentDocument(type, label)),
        initState: () => dispatch(actionsDocument.initState()),
        fileDownload: (folder, url) => dispatch(actionsDocument.downloadFile(folder, url)),
        templateDownload: (type) => dispatch(actionsDocument.downloadTemplate(type)),
        onPostOnboardConfig: (orgId, config) => dispatch(actionsDocument.postOnboardConfig(orgId, config))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DocumentManagement));