import React, { Component } from 'react';
import styles from './CompanyDocuments.module.scss';
import cx from 'classnames';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import scrollStyle from '../../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import GenerateDocument from './GenerateDocument/GenerateDocument';
import FillDetails from './FillDetails/FillDetails';
import UploadSignedDocument from './UploadSignedDocument/UploadSignedDocument';
import TabsDocProcedure from '../TabsDocProcedure/TabsDocProcedure';
import { withTranslation } from 'react-i18next';

class CompanyDocuments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDoc: '',
            documentData: {},
            currentSection: 'FILL_DETAILS',
            fillDetailsTab: 'next',
            generateAndDownloadTab: 'next',
            uploadSignedDocsTab: 'next',
        }
    }


    componentDidMount = () => {
        // const { match } = this.props;
        if(!_.isEmpty(this.props.empData)){
            this.handlePropsToState();
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (!_.isEqual(this.props.location.pathname, prevProps.location.pathname)) {
            this.handlePropsToState();
        }

        if (this.props.getDataState !== prevProps.getDataState && this.props.getDataState === "SUCCESS") {
            this.handlePropsToState();
        }

        if(!_.isEqual(this.props.empData, prevProps.empData)){
            this.handlePropsToState();
        }
    }

    handleHeaderStatus=(section)=>{
        let fillDetailsTab= 'next';
        let generateAndDownloadTab= 'next';
        let uploadSignedDocsTab= 'next';
        const { documentData } = this.state

        if(!_.isEmpty(documentData)){
            fillDetailsTab='prev';
            if(section === "FILL_DETAILS") fillDetailsTab = 'current';
        

        if("downloadURL" in documentData)
            generateAndDownloadTab='prev';
        if(section === "GENERATE") generateAndDownloadTab = 'current'

        if("signedDocumentURLs" in documentData){
            uploadSignedDocsTab = 'prev';
            fillDetailsTab = !_.isEmpty(documentData) && documentData.hasOwnProperty("employeeName") ? 'prev' : 'next';
            generateAndDownloadTab = "downloadURL" in documentData ? 'prev' : 'next';
            if(section === "UPLOAD") uploadSignedDocsTab = 'current'
        }
    }

        this.setState({
            fillDetailsTab,
            generateAndDownloadTab,
            uploadSignedDocsTab
        })
        
    }

    handlePropsToState = () => {
        const { match, empData } = this.props;
        const docType = match.params.docType.toUpperCase();
        let docData = {}; let companyDocuments = []; let currentSection = "FILL_DETAILS"

        let updatedEmpData = _.cloneDeep(empData);

        let updatedfillDetailsTab = this.state.fillDetailsTab;
        let updatedgenerateAndDownloadTab = this.state.generateAndDownloadTab;
        let updateduploadSignedDocsTab = this.state.uploadSignedDocsTab;

        updatedfillDetailsTab = 'current';

        if (!_.isEmpty(updatedEmpData)) {
            companyDocuments = updatedEmpData['company_documents'];
        }
        if (!_.isEmpty(companyDocuments)) {
            companyDocuments.forEach((companyDoc) => {
                if (companyDoc.documentType === docType) {
                    docData = companyDoc;

                }
            })
        }
        if(_.isEmpty(docData)){
            updatedfillDetailsTab = 'current';
            updatedgenerateAndDownloadTab = 'next'
            updateduploadSignedDocsTab = 'next';
            currentSection = "FILL_DETAILS";
        }

        if (!_.isEmpty(docData) || "downloadURL" in docData ) {
            updatedfillDetailsTab = 'prev';
            updatedgenerateAndDownloadTab = 'current';
            updateduploadSignedDocsTab = 'next';
            currentSection = "GENERATE";
        }

        if ("signedDocumentURLs" in docData) {
            updatedfillDetailsTab = !_.isEmpty(docData) && docData.hasOwnProperty("employeeName") ? 'prev' : 'next';
            updatedgenerateAndDownloadTab = "downloadURL" in docData ? 'prev' : 'next';
            updateduploadSignedDocsTab = 'current';
            currentSection = "UPLOAD";
        }

        this.setState({
            currentDoc: docType,
            documentData: docData,
            currentSection: currentSection,
            fillDetailsTab: updatedfillDetailsTab,
            generateAndDownloadTab: updatedgenerateAndDownloadTab,
            uploadSignedDocsTab: updateduploadSignedDocsTab
        })
    }

    changeSection = (section) => {
        this.setState({
            currentSection: section
        })
        this.handleHeaderStatus(section);
    }

    handleTab = (tabSelected)=>{
        let section = "";
        let previousTab = this.state.currentSection ; 
        
        if(tabSelected === "FILL_DETAILS" && this.state.fillDetailsTab === "prev")
            section = "FILL_DETAILS";

        if( (previousTab === "FILL_DETAILS" && tabSelected === "GENERATE" && !_.isEmpty(this.state.documentData) ) || (tabSelected === "GENERATE" && (this.state.generateAndDownloadTab === "prev" || this.state.fillDetailsTab === "prev")))
            section = "GENERATE";

        if((previousTab === "GENERATE" && tabSelected === "UPLOAD" && "downloadURL" in this.state.documentData )  || (tabSelected === "UPLOAD" && this.state.uploadSignedDocsTab === "prev"))
            section = "UPLOAD";
        
        if(!_.isEmpty(section))
        {
            this.setState({
                currentSection: section
            })
            this.handleHeaderStatus(section)
        }
        
    }

    render() {
        const { t } = this.props;
        const { currentDoc, documentData, currentSection , fillDetailsTab , generateAndDownloadTab , uploadSignedDocsTab } = this.state;
        let fillDetailsConfigured = false  , generateAndDownloadConfigured = false  , uploadSignedDocsConfigured = false ;
        
        if(generateAndDownloadTab === "prev")
            generateAndDownloadConfigured = true  ; 
        if(uploadSignedDocsTab === "prev")
            uploadSignedDocsConfigured = true  ;
        if(fillDetailsTab === "prev" || !_.isEmpty(documentData) )
            fillDetailsConfigured = true;
        
        let currentDocName = currentDoc ; 
        if(!_.isEmpty(currentDocName)){
            if(currentDocName.indexOf("_")!== -1){
                currentDocName = currentDocName.replaceAll("_"," ");
            }
            currentDocName = currentDocName.toLowerCase();
        }
        
        return (
            <div>
                <div className={cx(styles.containerAlignCenter, scrollStyle.scrollbar)}>
                    <div className={styles.CardLayout}>
                        <div className={styles.heading}>
                        {!_.isEmpty(currentDocName) ? currentDocName + " - new document generation process" : ""}
                        </div>
                        <div className={cx("row  mt-4 px-3 d-flex justify-content-center")}>
                     
                            <div onClick={()=>this.handleTab("FILL_DETAILS")} className={cx('pl-0 mr-5 ')}>
                                <TabsDocProcedure
                                    detailsTab={fillDetailsTab}
                                    //detailsTab={"prev"}
                                    currentSection={currentSection === "FILL_DETAILS" ? true : false}
                                    label={t('translation_empOnboardingConfigCompany:headerHeading.fillDetails')}
                                    tabPosition="first"
                                    configuredTab={fillDetailsConfigured}
                                    //configuredTab={true}
                                />
                            </div>
                            <div onClick={()=>this.handleTab("GENERATE")} className={cx('pl-2 mr-5 ')}>
                                <TabsDocProcedure
                                    detailsTab={generateAndDownloadTab}
                                    //detailsTab={"prev"}
                                    currentSection={currentSection === "GENERATE" ? true : false}
                                    label={t('translation_empOnboardingConfigCompany:headerHeading.generateAndDownload')}
                                    tabPosition="mid"
                                    configuredTab={generateAndDownloadConfigured}
                                    //configuredTab={true}
                                />
                            </div>
                            <div onClick={()=>this.handleTab("UPLOAD")} className={cx('pl-2')}>
                                <TabsDocProcedure
                                    detailsTab={uploadSignedDocsTab}
                                    //detailsTab={"current"}
                                    currentSection={currentSection === "UPLOAD" ? true : false}
                                    label={t('translation_empOnboardingConfigCompany:headerHeading.uploadSignedDocs')}
                                    tabPosition="last"
                                    configuredTab={uploadSignedDocsConfigured}
                                    //configuredTab={false}
                                />
                            </div>
                        </div>
                        <hr className={cx(styles.hr1)} />

                        {currentSection === "FILL_DETAILS" &&(
                            <FillDetails
                                data={documentData}
                                documentType={currentDoc}
                                changeSection={this.changeSection}
                            />
                        )}
                        {currentSection === "GENERATE" && (
                            <GenerateDocument
                                data={documentData}
                                documentType={currentDoc}
                                changeSection={this.changeSection}
                            />
                        )}
                        {currentSection === "UPLOAD" && (
                            <UploadSignedDocument
                                documentType={currentDoc}
                                data={documentData}
                            />
                        )}


                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        EMP_MGMT_COMPANY_DOC_GENERATE_EMP_TYPE: state.empMgmt.staticData.empMgmtStaticData["EMP_MGMT_COMPANY_DOC_GENERATE_EMP_TYPE"],
        orgData: state.empMgmt.staticData.orgData,
        orgOnboardConfig: state.empMgmt.staticData.orgOnboardConfig,
        empData: state.empMgmt.empOnboard.onboard.empData,
        empDefaultRole: state.empMgmt.empOnboard.onboard.empDefaultRole,
        empDefaultLocation: state.empMgmt.empOnboard.onboard.empDefaultLocation,
        empReportingManager: state.empMgmt.empOnboard.onboard.empReportingManager,
        getDataState: state.empMgmt.empOnboard.onboard.getEmpDataState,
        putDataState: state.empMgmt.empOnboard.onboard.putEmpDataState,
        generateDataState: state.empMgmt.empOnboard.onboard.empDocGenerateState,
        docDownloadState: state.empMgmt.empOnboard.onboard.downloadDocumentState,
        // getSignatureState: state.empMgmt.empOnboard.empCompanyDocuments.digitalSignature.signatureDownloadState,
        // uploadSignatureState: state.empMgmt.empOnboard.empCompanyDocuments.digitalSignature.signatureUploadState,
        // signatureURL: state.empMgmt.empOnboard.empCompanyDocuments.digitalSignature.signatureURL,
        // signatureImage: state.empMgmt.empOnboard.empCompanyDocuments.digitalSignature.signatureImage,
        error: state.empMgmt.empOnboard.onboard.error,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        // putEmpData: (orgId, empId, data) => dispatch(actions.putEmpData(orgId, empId, data, false, false)),
        // generateDoc: (orgId, empId, docType, data) => dispatch(actions.generateDocument(orgId, empId, 'COMPANY', docType, data)),
        // documentDownload: (url) => dispatch(actions.documentDownload(url)),
        // getSignatureImage: (url) => dispatch(actionsSignature.getSignature(url)),
        // uploadSignature: (folder, imageData) => dispatch(actionsSignature.signatureUpload(folder, imageData))
    }
}

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(CompanyDocuments)));