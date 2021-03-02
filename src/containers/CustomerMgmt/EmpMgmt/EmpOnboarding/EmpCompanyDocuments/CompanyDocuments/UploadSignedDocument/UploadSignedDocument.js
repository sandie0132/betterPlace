/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import cx from 'classnames';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from 'react-crux';
import Prompt from '../../../../../../../components/Organism/Prompt/Prompt';
import styles from './UploadSignedDocument.module.scss';
import DocumentUpload from '../../../DocumentUpload/DocumentUpload';
import CancelButton from '../../../../../../../components/Molecule/CancelButton/CancelButton';
import WarningPopUp from '../../../../../../../components/Molecule/WarningPopUp/WarningPopUp';
import Notification from '../../../../../../../components/Molecule/Notification/Notification';
import companyIcon from '../../../../../../../assets/icons/companyIcon.svg';
import * as actions from '../../../Store/action';
import warn from '../../../../../../../assets/icons/warning.svg';
import Spinnerload from '../../../../../../../components/Atom/Spinner/Spinner';

class UploadSignedDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        signedDocumentURLs: [],
      },
      documentType: '',
      isEdited: false,
      enableSubmit: false,
      showCancelPopUp: false,
      showNotification: false,
    };
    this._isMounted = false;
  }

    componentDidMount = () => {
      this._isMounted = true;
      this.handlePropsToState();
    }

    componentDidUpdate = (prevProps) => {
      const { data, documentType, putDataState } = this.props;
      if (documentType !== prevProps.documentType || !_.isEqual(data, prevProps.data)) {
        this.handlePropsToState();
      }

      // if(putDataState !== prevProps.putDataState && putDataState === "SUCCESS"){
      //     this.setState({ enableSubmit: false, isEdited: false})
      // }

      if (prevProps.putDataState !== putDataState) {
        if (putDataState === 'SUCCESS') {
          this.setState({
            showNotification: true,
            isEdited: false,
            enableSubmit: false,
          });
          setTimeout(() => {
            if (this._isMounted) {
              this.setState({ showNotification: false });
            }
          }, 5000);
        }
        if (putDataState === 'ERROR') {
          this.setState({
            showNotification: true,
            isEdited: false,
            enableSubmit: false,
          });
        }
      }
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    handlePropsToState = () => {
      const { data, documentType } = this.props;
      const { formData } = this.state;
      const updatedDocumentType = documentType || '';
      let updatedFormData = {};
      if (!_.isEmpty(data)) {
        updatedFormData = _.cloneDeep(data);
        if (_.isEmpty(updatedFormData.signedDocumentURLs)) {
          updatedFormData.signedDocumentURLs = formData.signedDocumentURLs;
        }
      } else {
        updatedFormData.documentType = updatedDocumentType;
        updatedFormData.signedDocumentURLs = []; // formData.signedDocumentURLs;
        updatedFormData.status = 'done';
      }
      this.setState({
        formData: updatedFormData,
        documentType: updatedDocumentType,
        isEdited: false,
        enableSubmit: false,
        showCancelPopUp: false,
      });
    }

    handleFileUplod = (url) => {
      const { formData } = this.state;
      const updatedFormData = _.cloneDeep(formData);
      updatedFormData.signedDocumentURLs = url;
      this.setState({
        formData: updatedFormData,
        isEdited: true,
        enableSubmit: true,
      });
    }

    handleSubmit = () => {
      const { match, empData, putEmpData } = this.props;
      const orgId = match.params.uuid;
      const { empId } = match.params;
      const { documentType, formData } = this.state;
      // const empData = _.cloneDeep(this.props.empData);
      let companyDocuments = _.cloneDeep(empData.company_documents);
      if (!_.isEmpty(companyDocuments)) {
        let exist = false;
        companyDocuments.forEach((doc, index) => {
          if (doc.documentType === documentType) {
            companyDocuments[index] = formData; exist = true;
          }
        });
        if (!exist) {
          companyDocuments.push(formData);
        }
      } else {
        companyDocuments = [];
        formData.status = 'done';
        companyDocuments.push(formData);
      }
      empData.company_documents = companyDocuments;
      putEmpData(orgId, empId, empData);
    }

    handleShowCancelPopUp = () => {
      const { showCancelPopUp } = this.state;
      this.setState({
        showCancelPopUp: !showCancelPopUp,
      });
    }

    render() {
      const {
        documentType, showNotification, isEdited, showCancelPopUp, enableSubmit, formData,
      } = this.state;
      const {
        error, putDataState,
      } = this.props;
      return (
        <>
          <Prompt
            when={isEdited || !_.isEmpty(error)}
          />
          {showCancelPopUp
                    && (
                    <WarningPopUp
                      text="cancel?"
                      para="Warning: this cannot be undone"
                      confirmText="yes, cancel"
                      cancelText="keep"
                      icon={warn}
                      warningPopUp={this.handlePropsToState}
                      closePopup={this.handleShowCancelPopUp}
                    />
                    )}
          <div className="d-flex flex-column">
            <div className={cx(styles.formHeader, 'row mx-0')}>
              <div className={cx(styles.timeHeading, 'col-8 mx-0 px-0')} style={{ maxWidth: 'fit-content' }}>
                {!_.isEmpty(error) && showNotification
                  ? (
                    <Notification
                      type="warning"
                      message={error}
                    />
                  )
                  : putDataState === 'SUCCESS' && showNotification
                    ? (
                      <Notification
                        type="success"
                        message="upload documents saved successfully"
                      />
                    )
                    : (
                      <Notification
                        type="info"
                        message={`please select and upload ${documentType.replaceAll('_', ' ').toLowerCase()} document and click on save`}
                      />
                    )}
              </div>
              <div className="ml-auto d-flex my-auto" style={{ position: 'relative' }}>
                <CancelButton
                  className={styles.cancelButton}
                  isDisabled={!isEdited}
                  clickHandler={this.handleShowCancelPopUp}
                />
                {
                                putDataState === 'LOADING'
                                  ? <Spinnerload type="loading" />
                                  : (
                                    <Button
                                      label="save"
                                      type="save"
                                      isDisabled={!enableSubmit}
                                      clickHandler={this.handleSubmit}
                                    />
                                  )
                            }
              </div>
            </div>

            <div className={cx(styles.Container, 'd-flex flex-column')}>
              <img src={companyIcon} alt="company_icon" className={styles.companyIcon} />
              <span className={styles.Heading}>{`upload signed ${documentType.replaceAll('_', ' ').toLowerCase()} document`}</span>
              <span className={cx(styles.text, 'mt-2')}>{`please sign the downloaded ${documentType.replaceAll('_', ' ').toLowerCase()} document, scan and upload it here`}</span>

              <div className="mt-4">
                <DocumentUpload
                  documentType={documentType}
                  file={(url) => this.handleFileUplod(url)}
                  url={formData.signedDocumentURLs}
                  folderName="employee_company_documents"
                  maxMbSize={5}
                  className={styles.UploadContainer}
                />
              </div>
            </div>
          </div>
        </>
      );
    }
}

const mapStateToProps = (state) => ({
  orgData: state.empMgmt.staticData.orgData,
  orgOnboardConfig: state.empMgmt.staticData.orgOnboardConfig,
  empData: state.empMgmt.empOnboard.onboard.empData,
  putDataState: state.empMgmt.empOnboard.onboard.putEmpDataState,
  generateDataState: state.empMgmt.empOnboard.onboard.empDocGenerateState,
  docDownloadState: state.empMgmt.empOnboard.onboard.downloadDocumentState,
  error: state.empMgmt.empOnboard.onboard.error,
});

const mapDispatchToProps = (dispatch) => ({
  putEmpData: (orgId, empId, data) => dispatch(actions.putEmpData(orgId, empId, data, false, false)),

});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UploadSignedDocument));
