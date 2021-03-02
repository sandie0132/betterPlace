/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { useDispatch, shallowEqual, useSelector } from 'react-redux';
import { useRouteMatch, useLocation } from 'react-router';
import { get, isEmpty } from 'lodash';
import cx from 'classnames';
import queryString from 'query-string';
import styles from './ProfileVerify.module.scss';

import download from '../../../../../assets/icons/downloadIcon.svg';

import Loader from '../../../../../components/Organism/Loader/Loader';
import EmptyState from '../../../../../components/Atom/EmptyState/EmptyState';

import { downloadAttachment, downloadPdf } from '../../EmpBgvReport/Store/action';

import ReportDocuments from '../../EmpBgvReport/ReportDocuments/ReportDocuments';
import ReportLegal from '../../EmpBgvReport/ReportLegal/ReportLegal';
import ReportCareer from '../../EmpBgvReport/ReportCareer/ReportCareer';
import ReportHealth from '../../EmpBgvReport/ReportHealth/ReportHealth';
import ReportReference from '../../EmpBgvReport/ReportReference/ReportReference';
import ReportAddress from '../../EmpBgvReport/ReportAddress/ReportAddress';
import SingleModal from '../../EmpBgvReport/ReportModal/SingleModal';
import MultipleModal from '../../EmpBgvReport/ReportModal/MultipleModal';
import VendorDropdown from '../../../../VendorSearch/VendorDropdown/VendorDropdown';

const initialState = {
  showVerificationModal: false,
  modalData: {},
};

const ProfileVerify = ({ empData, bgvData }) => {
  const [state, setState] = useState(initialState);
  const match = useRouteMatch();
  const location = useLocation();
  const dispatch = useDispatch();
  // reducer values below
  const empMgmtRState = useSelector((rstate) => get(rstate, 'empMgmt', {}), shallowEqual);
  const downloadAttachmentState = get(empMgmtRState, 'empReport.downloadAttachmentState', 'INIT');
  const defaultRole = get(empMgmtRState, 'empReport.roleTag', '');
  const downloadSummaryPdfState = get(empMgmtRState, 'empReport.downloadSummaryPdfState', 'INIT');
  // for profile image
  const imageStore = useSelector((rstate) => get(rstate, 'imageStore', {}), shallowEqual);
  const images = get(imageStore, 'images', []);

  const { showVerificationModal, modalData } = state;

  const toggleModal = (verificationData) => {
    setState((prev) => ({
      ...prev,
      showVerificationModal: !showVerificationModal,
      modalData: verificationData,
    }));
  };

  const handleDownloadAttachment = (attachment) => {
    dispatch(downloadAttachment(attachment));
  };

  const handleSummaryPdfDownload = () => {
    const fileName = `${empData.firstName ? empData.firstName : ''}${empData.lastName ? `_${empData.lastName}` : ''}${empData.employeeId ? `_${empData.employeeId}` : ''}`;
    let orgFrom = null; let orgTo = null; let orgVia = null;
    const params = queryString.parse(location.search);

    if (!isEmpty(params.vendorId)) {
      if (!isEmpty(params.subVendorId)) {
        orgFrom = params.subVendorId;
        orgTo = match.params.uuid;
        orgVia = params.vendorId;
      } else {
        orgFrom = params.vendorId;
        orgTo = match.params.uuid;
        orgVia = null;
      }
    } else if (!isEmpty(params.clientId)) {
      if (!isEmpty(params.superClientId)) {
        orgFrom = match.params.uuid;
        orgTo = params.superClientId;
        orgVia = params.clientId;
      } else {
        orgFrom = match.params.uuid;
        orgTo = params.clientId;
        orgVia = null;
      }
    }
    dispatch(downloadPdf(match.params.uuid, match.params.empId, `${fileName}_report`, orgFrom, orgTo, orgVia));
  };

  return (
    <div className={cx('d-flex flex-column mb-4', styles.container)}>
      <div className={cx('my-4', styles.container)}>
        <div className={styles.vendorContainer}>
          <span className={cx('d-flex flex-row mb-4', styles.greyHeading)}>
            select a configuration below to view/download report
          </span>
          <div className={cx('d-flex flex-row')}>
            <div className={cx(styles.paddingY)}>
              <label className={styles.greySmallText}>select organization</label>
              <VendorDropdown type="primary" />
            </div>
            <div className={cx(styles.paddingY)}>
              <label className={styles.greySmallText}>select super client/ sub vendor</label>
              <VendorDropdown type="secondary" />
            </div>

            <div className={cx(styles.verticalLine)} />

            <div
              disabled={isEmpty(bgvData)}
              className={cx('d-flex flex-row', downloadSummaryPdfState === 'LOADING' ? styles.progressCursor : styles.cursor)}
              role="button"
              onClick={downloadSummaryPdfState !== 'LOADING' ? handleSummaryPdfDownload : null}
            >
              {downloadSummaryPdfState === 'LOADING'
                ? <div className={cx(styles.loaderMargin, 'my-auto')}><Loader type="stepLoaderBlue" /></div>
                : <img src={download} alt="download" className={cx('mr-2', styles.iconHeight)} />}
              <span className={styles.blueText}>verify report</span>
            </div>
          </div>
        </div>
        <hr className={styles.horizontalLine} />
        {!isEmpty(bgvData)
          && (!isEmpty(bgvData.idcards) || !isEmpty(bgvData.address)
            || !isEmpty(bgvData.legal) || !isEmpty(bgvData.career)
            || !isEmpty(bgvData.health) || !isEmpty(bgvData.reference))
          ? (
            <>
              {!isEmpty(bgvData.idcards)
                ? (
                  <ReportDocuments
                    bgvData={bgvData}
                    empData={empData}
                    toggleModal={toggleModal}
                  />
                ) : null}

              {!isEmpty(bgvData.address)
                ? (
                  <ReportAddress
                    bgvData={bgvData}
                    empData={empData}
                    toggleModal={toggleModal}
                  />
                ) : null}
              {!isEmpty(bgvData.legal)
                ? (
                  <ReportLegal
                    bgvData={bgvData}
                    empData={empData}
                    toggleModal={toggleModal}
                  />
                ) : null}
              {!isEmpty(bgvData.career)
                ? (
                  <ReportCareer
                    bgvData={bgvData}
                    empData={empData}
                    toggleModal={toggleModal}
                  />
                ) : null}
              {!isEmpty(bgvData.health)
                ? (
                  <ReportHealth
                    bgvData={bgvData}
                    empData={empData}
                    toggleModal={toggleModal}
                  />
                ) : null}
              {!isEmpty(bgvData.reference)
                ? (
                  <ReportReference
                    bgvData={bgvData}
                    empData={empData}
                    toggleModal={toggleModal}
                  />
                ) : null}
            </>
          )
          : <EmptyState type="emptyVendorTagsList" label="no BGV data to display for this employee" />}
      </div>

      {showVerificationModal
        ? ['EDUCATION', 'EMPLOYMENT', 'REFERENCE'].includes(modalData.service)
          ? (
            <MultipleModal
              verificationData={modalData}
              empData={empData}
              bgvData={bgvData}
              images={images}
              toggleModal={toggleModal}
              defaultRole={defaultRole}
              handleDownloadAttachment={handleDownloadAttachment}
              downloadState={downloadAttachmentState}
            />
          )
          : (
            <SingleModal
              verificationData={modalData}
              empData={empData}
              bgvData={bgvData}
              images={images}
              toggleModal={toggleModal}
              defaultRole={defaultRole}
              handleDownloadAttachment={handleDownloadAttachment}
              downloadState={downloadAttachmentState}
            />
          )
        : null}
    </div>
  );
};

export default ProfileVerify;
