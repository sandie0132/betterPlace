/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import cx from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button } from 'react-crux';
import styles from './GenerateDocument.module.scss';
import Loader from '../../../../../../../components/Organism/Loader/Loader';
import download from '../../../../../../../assets/icons/downloadIcon.svg';
import Notification from '../../../../../../../components/Molecule/Notification/Notification';
import companyIcon from '../../../../../../../assets/icons/companyIcon.svg';
import infoIcon from '../../../../../../../assets/icons/infoMid.svg';
import warningIcon from '../../../../../../../assets/icons/yellowExclamation.svg';
import document from '../../../../../../../assets/icons/docIcon_2.svg';
import Spinnerload from '../../../../../../../components/Atom/Spinner/Spinner';
import generateAgain from '../../../../../../../assets/icons/generateAgain.svg';
import * as actions from '../../../Store/action';

class GenerateDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      documentType: '',
      generatedOn: null,
      modifiedOn: null,
      generatedState: 'INIT',
    };
  }

    componentDidMount = () => {
      this.handlePropsToState();
    }

    componentDidUpdate = (prevProps) => {
      const { data, documentType } = this.props;
      if (documentType !== prevProps.documentType || !_.isEqual(data, prevProps.data)) {
        this.handlePropsToState();
      }
    }

    handlePropsToState = () => {
      const { data, documentType } = this.props;
      let generatedOn = null; let modifiedOn = null;
      const updatedDocumentType = documentType || '';
      let updatedFormData = {}; let generatedState = 'INIT';

      if (!_.isEmpty(data)) {
        updatedFormData = _.cloneDeep(data);
        if (!_.isEmpty(data.generatedOn)) generatedOn = data.generatedOn;
        if (!_.isEmpty(data.modifiedOn)) modifiedOn = data.modifiedOn;
        generatedState = data.status || 'INIT'; generatedState = generatedState.toUpperCase();
      }
      this.setState({
        formData: updatedFormData,
        documentType: updatedDocumentType,
        generatedOn,
        modifiedOn,
        generatedState,
      });
    }

    handleDocumentGenerate = () => {
      const { documentType, formData } = this.state;
      const { match, generateDoc } = this.props;
      const orgId = match.params.uuid;
      const { empId } = match.params;
      formData.isConfigDocGenerate = true;
      generateDoc(orgId, empId, documentType, formData);
    }

    handleFileDownload = () => {
      const { formData } = this.state;
      const { documentDownload } = this.props;
      const url = formData.downloadURL;
      documentDownload(url);
    }

    handleNext = () => {
      const { changeSection } = this.props;
      changeSection('UPLOAD');
    }

    render() {
      const {
        documentType, generatedOn, modifiedOn, generatedState, formData,
      } = this.state;

      const {
        error, generateDataState, docDownloadState,
      } = this.props;

      return (
        <div className="d-flex flex-column">
          <div className={cx(styles.formHeader, 'row mx-0')}>
            <div className={cx(styles.timeHeading, 'col-8 mx-0 px-0')} style={{ maxWidth: 'fit-content' }}>
              {generatedState === 'ERROR' || !_.isEmpty(error)
                ? (
                  <Notification
                    type="warning"
                    message={!_.isEmpty(error) ? error : 'unable to generate document. please check your details and try again !'}
                  />
                )

                : (
                  <Notification
                    type="done"
                    message={`${documentType.replaceAll('_', ' ').toLowerCase()} document ready to ${generatedState === 'DONE' ? 'download' : 'generate'}`}
                  />
                )}
            </div>
            <div className="ml-auto d-flex my-auto" style={{ position: 'relative' }}>
              <Button
                label="next"
                type="save"
                isDisabled={formData.status !== 'done'}
                clickHandler={this.handleNext}
              />
            </div>
          </div>
          <div className={cx(styles.Container, 'd-flex flex-column')}>
            <img src={companyIcon} alt="company_icon" className={styles.companyIcon} />
            <span className={styles.Heading}>{`generate ${documentType.replaceAll('_', ' ').toLowerCase()}`}</span>

            {(generatedState === 'INIT' || generatedState === 'ERROR')
                        && (
                        <span className="mt-2">
                          <img src={infoIcon} className={styles.infoIcon} alt="info" />
                          <span className={cx(styles.text, styles.greyText, 'pl-2')}>{`data fields for ${documentType.replaceAll('_', ' ').toLowerCase()} generation were added on ${moment(modifiedOn).format('DD MMM YYYY').toLowerCase()} and is ready to generate`}</span>
                        </span>
                        )}

            {generatedState === 'INPROGRESS'
                        && (<span className={cx(styles.text, 'mt-2')}>{`${documentType.replaceAll('_', ' ').toLowerCase()} document generation is in progress`}</span>)}

            {moment(modifiedOn).isAfter(moment(generatedOn)) && generatedState === 'DONE'
                        && (
                        <span className="mt-2">
                          <img src={warningIcon} className={styles.infoIcon} alt="info" />
                          <span className={cx(styles.text, 'pl-2 pr-2')}>{`there has been change in data fields on ${moment(modifiedOn).add(330, 'minutes').format('DD MMM YYYY').toLowerCase()} ${moment(modifiedOn).add(330, 'minutes').utcOffset('+05:30').format('hh:mm A')}`}</span>
                          <button type="button" className={styles.btnHide} onClick={this.handleDocumentGenerate}>
                            <img src={generateAgain} className={cx(styles.infoIcon, styles.pointer)} alt="info" />

                            <span className={cx(styles.text, styles.blueText, styles.pointer, 'pl-1')} style={{ textDecoration: 'underline' }}>generate again</span>
                          </button>
                        </span>
                        )}

            {(generatedState === 'INIT' || generatedState === 'ERROR')
              ? generateDataState === 'LOADING' ? (
                <div className={cx(styles.GenerateButton, 'align-self-center')}>
                  <Spinnerload type="loading" />
                </div>
              )
                : (
                  <Button
                    type="save"
                    label="generate document"
                    className={styles.GenerateButton}
                    clickHandler={this.handleDocumentGenerate}
                  />
                )
              : null}
            {(generatedState === 'INPROGRESS' || generatedState === 'DONE')
                        && (
                        <div className={styles.GenerationContainer}>
                          <div className="d-flex flex-row">
                            <img src={document} alt="document_icon" />
                            <div className="d-flex flex-column ml-2">
                              {generatedState === 'INPROGRESS'
                                            && (
                                            <div className="d-flex flex-column">
                                              <span className={cx(styles.text, styles.greyText, 'pl-2 text-left')} style={{ marginTop: '10px' }}>please wait while document generation is being done</span>
                                              <div className={cx(styles.Loading, 'pl-2')} />
                                            </div>
                                            )}
                              {generatedState === 'DONE'
                                            && (
                                            <div className="d-flex flex-column">
                                              <span className={cx(styles.text, 'pl-2 text-left')} style={{ marginTop: '10px', width: 'max-content' }}>{`${documentType.replaceAll('_', ' ').toLowerCase()} generated successfully on ${moment(generatedOn).format('DD MMM YYYY').toLowerCase()}`}</span>
                                              <div className={cx(styles.LoadingComplete, 'pl-2')} />
                                            </div>
                                            )}
                            </div>
                            {generatedState === 'DONE'
                                        && (
                                        <div className="ml-4">
                                          <button type="button" className={styles.btnHide} onClick={this.handleFileDownload}>
                                            <div className={cx(styles.downloadButtonContainer, styles.pointer, 'd-flex flex-row mx-auto')} style={{ marginTop: '12px' }}>
                                              {docDownloadState === 'LOADING'
                                                ? <div style={{ marginLeft: '10px', paddingRight: '12px' }}><Loader type="stepLoaderBlue" /></div>
                                                : (
                                                  <img
                                                    src={download}
                                                    alt="icon"
                                                    style={{
                                                      height: '16px', width: '16px', marginLeft: '6px', marginTop: '4px',
                                                    }}
                                                  />
                                                )}
                                              <label htmlFor className={cx(styles.text, styles.blueText, styles.pointer)} style={{ paddingLeft: '8px', paddingRight: '4px' }}>{`download ${documentType.replaceAll('_', ' ').toLowerCase()}`}</label>
                                            </div>
                                          </button>
                                        </div>
                                        )}
                          </div>

                        </div>
                        )}

          </div>

        </div>
      );
    }
}

const mapStateToProps = (state) => ({
  orgData: state.empMgmt.staticData.orgData,
  orgOnboardConfig: state.empMgmt.staticData.orgOnboardConfig,
  empData: state.empMgmt.empOnboard.onboard.empData,
  generateDataState: state.empMgmt.empOnboard.onboard.empDocGenerateState,
  docDownloadState: state.empMgmt.empOnboard.onboard.downloadDocumentState,
  error: state.empMgmt.empOnboard.onboard.error,
});

const mapDispatchToProps = (dispatch) => ({
  generateDoc: (orgId, empId, docType, data) => dispatch(actions.generateDocument(orgId, empId, 'COMPANY', docType, data)),
  documentDownload: (url) => dispatch(actions.documentDownload(url)),

});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GenerateDocument));
