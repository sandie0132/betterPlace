import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import _ from 'lodash';
import cx from 'classnames';
import styles from './ProfileDocuments.module.scss';
import IdDocumentModal from './IdDocumentModal/IdDocumentModal';
import * as actions from '../../Store/action';

import aadhaar from '../../../../../../assets/icons/aadhaarCard.svg';
import dl from '../../../../../../assets/icons/drivinglicenseCard.svg';
import pan from '../../../../../../assets/icons/panCard.svg';
import voterCard from '../../../../../../assets/icons/voterCard.svg';
import passportCard from '../../../../../../assets/icons/passportCard.svg';
import consentCard from '../../../../../../assets/icons/consentCard.svg';
import rcCard from '../../../../../../assets/icons/rcUpperCard.svg';
import idDoc from '../../../../../../assets/icons/idDocuments.svg';
import otherDoc from '../../../../../../assets/icons/otherDocument.svg';

import govIcon from '../../../../../../assets/icons/panConfIcon.svg';
import companyDoc from '../../../../../../assets/icons/companyDoc.svg';
import epfCard from '../../../../../../assets/icons/epfDocCard.svg';
import esicCard from '../../../../../../assets/icons/esicDocCard.svg';
import downloadIcon from '../../../../../../assets/icons/downloadCard.svg';
import companyCardIcon from '../../../../../../assets/icons/companyCardIcon.svg';

class ProfileDocuments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      docType: 'ID',
      showModal: false,
      idSelected: '',
      showDownload: false,
      hoverCard: '',
    };
  }

    handleDocTypeSelect = (docName) => {
      this.setState({
        docType: docName,
      });
    }

    handleFileDownload = (type, url) => {
      const { onDownloadFile } = this.props;
      onDownloadFile(type, url);
    }

    handleIdSelect = (idName) => {
      if (!_.isEmpty(idName)) {
        this.setState({
          showModal: true,
          idSelected: idName,
        });
      } else {
        this.setState({
          idSelected: '',
          showModal: false,
        });
      }
    }

    getIdData = () => {
      const { empData } = this.props;
      const { idSelected } = this.state;
      const propData = _.cloneDeep(empData);
      let data;
      if (!_.isEmpty(propData) && idSelected !== '') {
        data = propData.documents.find((doc) => doc.type === idSelected);
      }
      return (data);
    }

    handleCardLabel = (value) => {
      const doc = value;

      switch (doc) {
        case 'LOI': return 'LOI document';
        case 'OFFER_LETTER': return 'offer letter';
        case 'CODE_OF_CONDUCT': return 'code of conduct';
        case 'POSH': return 'POSH letter';
        case 'NDA': return 'NDA letter';
        case 'ETHICS': return 'ethics letter';
        default: return 'lol';
      }
    }

    render() {
      const docIcon = {
        AADHAAR: aadhaar,
        PAN: pan,
        VOTER: voterCard,
        DL: dl,
        PASSPORT: passportCard,
        CONSENT: consentCard,
        RC: rcCard,
      };

      const epfIcon = {
        EPF: epfCard,
        ESIC: esicCard,
      };

      const emptyState = (
        <div className="d-flex justify-content-center mt-5 mb-3">
          <div className={cx(styles.emptyInfo, 'px-2 py-1')}>
            not added yet
          </div>
        </div>
      );

      const { empData, downloadFileState } = this.props;

      const {
        docType, showDownload, showModal, idSelected, hoverCard,
      } = this.state;

      let govDocArray; let companyDocArray; let govIdArray; let otherDocArray;

      if (!_.isEmpty(empData)) {
        if (!_.isEmpty(empData.government_documents)) {
          govDocArray = _.filter(
            empData.government_documents, (doc) => !_.isEmpty(doc.downloadURL),
          );
        }
        if (!_.isEmpty(empData.documents)) {
          otherDocArray = _.filter(empData.documents, (doc) => doc.type === 'CONSENT' && !_.isEmpty(doc.downloadURL));
        }
        if (!_.isEmpty(empData.company_documents)) {
          companyDocArray = _.filter(
            empData.company_documents, (doc) => !_.isEmpty(doc.downloadURL),
          );
        }
        if (!_.isEmpty(empData.documents)) {
          govIdArray = _.filter(empData.documents, (doc) => doc.type !== 'CONSENT');
        }
      }

      return (
        <div>
          <div className={cx('row mt-2 mx-0', styles.optionBorder)}>
            <div className={cx('mr-4')}>
              <div className={cx(docType === 'ID' ? styles.ActiveButtonBg : styles.InactiveButtonBg)} role="button" aria-hidden onClick={() => this.handleDocTypeSelect('ID')}>
                <div className={docType === 'ID' ? styles.ActiveButton : styles.InactiveButton}>
                  <img src={idDoc} alt="img" className="pr-2" />
                  ids
                </div>
              </div>
            </div>
            <div className={cx('mr-4')}>
              <div className={cx(docType === 'GOV' ? styles.ActiveButtonBg : styles.InactiveButtonBg)} role="button" aria-hidden onClick={() => this.handleDocTypeSelect('GOV')}>
                <div className={docType === 'GOV' ? styles.ActiveButton : styles.InactiveButton}>
                  <img src={govIcon} alt="img" className="pr-2" />
                  government
                </div>
              </div>
            </div>
            <div className={cx('mr-4')}>
              <div className={cx(docType === 'COMPANY' ? styles.ActiveButtonBg : styles.InactiveButtonBg)} role="button" aria-hidden onClick={() => this.handleDocTypeSelect('COMPANY')}>
                <div className={docType === 'COMPANY' ? styles.ActiveButton : styles.InactiveButton}>
                  <img src={companyDoc} alt="img" className="pr-2" />
                  company
                </div>
              </div>
            </div>
            <div>
              <div className={cx(docType === 'OTHER' ? styles.ActiveButtonBg : styles.InactiveButtonBg)} role="button" aria-hidden onClick={() => this.handleDocTypeSelect('OTHER')}>
                <div className={docType === 'OTHER' ? styles.ActiveButton : styles.InactiveButton}>
                  <img src={otherDoc} alt="img" className="pr-2" />
                  other
                </div>
              </div>
            </div>

          </div>
          {docType === 'ID' ? (
            <div className="mt-3">
              {!_.isEmpty(govIdArray)
                ? govIdArray.map((doc) => (
                  <img
                    key={doc.uuid}
                    src={docIcon[doc.type]}
                    alt="doc"
                    className={cx('mr-3 mt-2', styles.cursor)}
                    onClick={() => this.handleIdSelect(doc.type)}
                    aria-hidden
                  />
                ))
                : emptyState}
              {
                <IdDocumentModal
                  show={showModal}
                  data={this.getIdData()}
                  close={() => this.handleIdSelect()}
                  showImg={docIcon[idSelected]}
                />
                            }

            </div>
          )
            : null}

          {docType === 'GOV' ? (
            <div className="mt-3">
              {!_.isEmpty(govDocArray)
                ? govDocArray.map((doc) => (
                  <div
                    onMouseEnter={() => this.setState({
                      showDownload: true, hoverCard: doc.documentType,
                    })}
                    onMouseLeave={() => this.setState({ showDownload: false, hoverCard: '' })}
                    key={doc.documentType}
                    className={cx(styles.displayCards, downloadFileState === 'LOADING' ? styles.cursorLoad : null)}
                  >

                    {showDownload && hoverCard === doc.documentType
                      ? (
                        <div className={styles.downloadHoverIcon}>
                          <img
                            src={downloadIcon}
                            alt="img"
                            onClick={downloadFileState === 'LOADING' ? null : () => this.handleFileDownload('employee_government_documents', doc.downloadURL)}
                            className={downloadFileState === 'LOADING' ? styles.cursorLoad : styles.cursor}
                            aria-hidden
                          />
                        </div>
                      ) : null}

                    <img src={epfIcon[doc.documentType]} alt="doc" className={cx('mr-3 mt-2')} />
                  </div>
                ))
                : emptyState}

            </div>
          )
            : null}

          {docType === 'COMPANY' ? (
            <div className="mt-3">
              {!_.isEmpty(companyDocArray)
                ? companyDocArray.map((doc) => (
                  <div
                    onMouseEnter={() => this.setState({
                      showDownload: true, hoverCard: doc.documentType,
                    })}
                    onMouseLeave={() => this.setState({ showDownload: false, hoverCard: '' })}
                    key={doc.documentType}
                    className={cx(styles.displayCards, downloadFileState === 'LOADING' ? styles.cursorLoad : null)}
                  >

                    {showDownload && hoverCard === doc.documentType
                      ? (
                        <div className={styles.downloadHoverIcon}>
                          <img
                            src={downloadIcon}
                            alt="img"
                            onClick={downloadFileState === 'LOADING' ? null : () => this.handleFileDownload('employee_company_documents', doc.downloadURL)}
                            className={downloadFileState === 'LOADING' ? styles.cursorLoad : styles.cursor}
                            aria-hidden
                          />
                        </div>
                      ) : null}

                    <div className={cx(styles.companyDocCard, 'mt-2')}>
                      <div className="row mx-0 px-0">
                        <div className={cx(styles.cardText, 'col-9 pl-2 pt-2 pr-0 pb-0 mx-0')}>
                          {this.handleCardLabel(doc.documentType)}
                        </div>
                        <div className="ml-auto">
                          <img src={companyCardIcon} alt="doc" />
                        </div>
                      </div>
                      <div className={styles.cardTextSmall}>organisation documents</div>
                    </div>

                  </div>
                ))
                : emptyState}

            </div>
          )
            : null}

          {docType === 'OTHER' ? (
            <div className="mt-3">
              {!_.isEmpty(otherDocArray)
                ? otherDocArray.map((doc) => (
                  <div
                    onMouseEnter={() => this.setState({
                      showDownload: true, hoverCard: doc.documentType,
                    })}
                    onMouseLeave={() => this.setState({ showDownload: false, hoverCard: '' })}
                    key={doc.uuid}
                    className={cx(styles.displayCards, downloadFileState === 'LOADING' ? styles.cursorLoad : null)}
                  >

                    {showDownload && hoverCard === doc.documentType
                      ? (
                        <div className={styles.downloadHoverIcon}>
                          <img
                            src={downloadIcon}
                            alt="img"
                            onClick={downloadFileState === 'LOADING' ? null : () => this.handleFileDownload('employee_documents', doc.downloadURL[0])}
                            className={downloadFileState === 'LOADING' ? styles.cursorLoad : styles.cursor}
                            aria-hidden
                          />
                        </div>
                      ) : null}
                    <img src={docIcon.CONSENT} alt="doc" className={cx('mr-3 mt-2')} />
                  </div>
                ))
                : emptyState}

            </div>
          )
            : null}
        </div>
      );
    }
}

const mapStateToProps = (state) => ({
  empData: state.empMgmt.empProfile.empData,
  error: state.empMgmt.empProfile.error,
  downloadFileState: state.empMgmt.empProfile.downloadFileState,
});

const mapDispatchToProps = (dispatch) => ({
  onDownloadFile: (type, url) => dispatch(actions.downloadFile(type, url)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProfileDocuments));
