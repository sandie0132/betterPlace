import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import _ from 'lodash';
import cx from 'classnames';
import styles from './IdDocumentModal.module.scss';
import Modal from '../../../../../../../components/Atom/Modal/Modal';

import closePage from '../../../../../../../assets/icons/closePage.svg';
import pdf from '../../../../../../../assets/icons/pdfIcon.svg';

import * as actions from '../../../Store/action';

class IdDocumentModal extends Component {
    closeAndReset = () => {
      const { close } = this.props;
      close();
    }

    handleFileDownload = (type, url) => {
      const { onDownloadFile } = this.props;
      onDownloadFile(type, url);
    }

    handleFileNamePreview = (fileURL) => {
      const fileName = fileURL.split('/').pop();
      if (fileName.length > 8) {
        return `${fileName.slice(0, 8)}..`;
      }
      return fileName;
    }

    handleFormatDate = (date) => {
      const day = date.substr(8, 2);
      const month = date.substr(5, 2);
      const year = date.substr(0, 4);
      const newDate = `${day} • ${month} • ${year}`;
      return newDate;
    }

    render() {
      const {
        show, data, showImg, downloadFileState,
      } = this.props;
      return (
        <Modal show={show} className={styles.alignModal}>
          <img onClick={this.closeAndReset} src={closePage} alt="close" className={styles.closeImg} aria-hidden />
          {!_.isEmpty(data)
            ? (
              <div className={styles.modalContainer}>
                <div className="row mx-0 px-0">
                  <div style={{ width: '74%' }}>
                    <div>
                      <div className={styles.textLarge}>{data.documentNumber}</div>
                      <div className={styles.textSmall}>
                        {data.type}
                        {' '}
                        number
                      </div>
                    </div>
                    <div className="row mx-0 mt-4">
                      <div className="col-7 px-0">
                        <div className={styles.textLarge}>{data.name}</div>
                        <div className={styles.textSmall}>name</div>
                      </div>
                      {!_.isEmpty(data.dob)
                        ? (
                          <div className="px-0 col-3">
                            <div className={styles.textLarge}>
                              {this.handleFormatDate(data.dob)}
                            </div>
                            <div className={styles.textSmall}>date of birth</div>
                          </div>
                        )
                        : null}
                      {!_.isEmpty(data.yob)
                        ? (
                          <div className="px-0 col-2">
                            <div className={styles.textLarge}>{data.yob}</div>
                            <div className={styles.textSmall}>year of birth</div>
                          </div>
                        )
                        : null}
                    </div>
                    {_.isEmpty(data.chassisNumber)
                    && _.isEmpty(data.engineNumber)
                      ? null
                      : (
                        <div className="row mx-0 mt-4">
                          {!_.isEmpty(data.chassisNumber)
                            ? (
                              <div className="col-7 px-0">
                                <div className={styles.textLarge}>
                                  {data.chassisNumber}
                                </div>
                                <div className={styles.textSmall}>chassis number</div>
                              </div>
                            )
                            : null}
                          {!_.isEmpty(data.engineNumber)
                            ? (
                              <div className="col-5 px-0">
                                <div className={styles.textLarge}>
                                  {data.engineNumber}
                                </div>
                                <div className={styles.textSmall}>engine number</div>
                              </div>
                            )
                            : null}

                        </div>
                      )}
                    {_.isEmpty(data.issuedOn) && _.isEmpty(data.fatherName)

                      ? null
                      : (
                        <div className="row mx-0  mt-4">
                          {!_.isEmpty(data.fatherName)
                            ? (
                              <div className="col-7 px-0">
                                <div className={styles.textLarge}>{data.fatherName}</div>
                                <div className={styles.textSmall}>father name</div>
                              </div>
                            )
                            : null}
                          {!_.isEmpty(data.issuedOn)
                            ? (
                              <div className="col-5 px-0">
                                <div className={styles.textLarge}>
                                  {this.handleFormatDate(data.issuedOn)}
                                </div>
                                <div className={styles.textSmall}>issued on</div>
                              </div>
                            )
                            : null}
                        </div>
                      )}
                    {_.isEmpty(data.validFrom) && _.isEmpty(data.validUpto)
                    && _.isEmpty(data.insuranceUpto)
                      ? null
                      : (
                        <div className="row mx-0  mt-4">
                          {!_.isEmpty(data.insuranceUpto)
                            ? (
                              <div className="col-7 px-0">
                                <div className={styles.textLarge}>
                                  {this.handleFormatDate(data.insuranceUpto)}
                                </div>
                                <div className={styles.textSmall}>insurance upto</div>
                              </div>
                            )
                            : null}
                          {!_.isEmpty(data.validFrom)
                            ? (
                              <div className="col-7 px-0">
                                <div className={styles.textLarge}>
                                  {this.handleFormatDate(data.validFrom)}
                                </div>
                                <div className={styles.textSmall}>valid from</div>
                              </div>
                            )
                            : null}
                          {!_.isEmpty(data.validUpto)
                            ? (
                              <div className="col-5 px-0">
                                <div className={styles.textLarge}>
                                  {this.handleFormatDate(data.validUpto)}
                                </div>
                                <div className={styles.textSmall}>valid upto</div>
                              </div>
                            )
                            : null}
                        </div>
                      )}

                    {_.isEmpty(data.addressLine1)
                    && _.isEmpty(data.addressLine2)
                    && _.isEmpty(data.pincode) ? null
                      : (
                        <div className="mt-4">
                          <div className={styles.textLarge}>{data.addressLine1}</div>
                          <div className={styles.textLarge}>
                            {data.addressLine2}
                            {!_.isEmpty(data.addressLine2) && !_.isEmpty(data.pincode) ? ', ' : null}
                            {data.pincode}
                          </div>
                          <div className={styles.textSmall}>address</div>
                        </div>
                      )}

                  </div>
                  <div className="ml-auto">
                    <img src={showImg} alt="img" />
                  </div>
                </div>

                {!_.isEmpty(data.downloadURL)
                  ? (
                    <>
                      <hr className={cx(styles.HorizontalLine, 'w-100')} />
                      <div className={styles.textSmall}>attachment</div>
                      <div className={cx(downloadFileState === 'LOADING' ? styles.pdfStyleLoading : styles.pdfStyle, 'mt-3')}>
                        {data.downloadURL.map((pdfEdu) => (
                          <span key={pdfEdu} className="mr-3">
                            <img src={pdf} alt="img" onClick={downloadFileState === 'LOADING' ? null : () => this.handleFileDownload('employee_documents', pdfEdu)} style={{ height: '24px' }} aria-hidden />
                          </span>
                        ))}
                      </div>
                    </>
                  )
                  : null}
              </div>
            )
            : null}
        </Modal>
      );
    }
}

const mapStateToProps = (state) => ({
  downloadFileState: state.empMgmt.empProfile.downloadFileState,
});

const mapDispatchToProps = (dispatch) => ({
  onDownloadFile: (type, url) => dispatch(actions.downloadFile(type, url)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(IdDocumentModal));
