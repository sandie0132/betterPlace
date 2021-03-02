/* eslint-disable no-nested-ternary */
import React from 'react';
import _, { isEmpty } from 'lodash';
import cx from 'classnames';
import styles from './SingleModal.module.scss';
import scrollStyle from '../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';

import close from '../../../../../assets/icons/closePage.svg';
import edu from '../../../../../assets/icons/educationCheckBigIcon.svg';
import employ from '../../../../../assets/icons/empVerifyBigIcon.svg';
import ref from '../../../../../assets/icons/empRefBigIcon.svg';

import ProfilePicStatus from '../../../../../components/Organism/ProfilePicStatus/ProfilePicStatus';
import OtherFields from './OtherFields';
import Result from './Result';

const MultipleModal = ({
  verificationData, defaultRole, empData, bgvData, images, toggleModal,
  handleDownloadAttachment, downloadState,
}) => {
  const displayImg = () => {
    let displayIcon = '';
    if (verificationData.service === 'EDUCATION') { displayIcon = <img src={edu} alt="edu" />; }
    if (verificationData.service === 'EMPLOYMENT') { displayIcon = <img src={employ} alt="employ" />; }
    if (verificationData.service === 'REFERENCE') { displayIcon = <img src={ref} alt="ref" />; }
    return displayIcon;
  };

  const firstField = (fieldValue, fieldName) => (
    <div className={cx('d-flex flex-column mt-2')}>
      <div className="d-flex flex-row">
        <span className={cx('mt-3', styles.mediumText)}>
          {fieldValue}
        </span>
      </div>
      <span className={styles.greySmallText}>
        {fieldName}
      </span>
    </div>
  );

  const twoFields = (firstValue, firstFieldName, secondValue, secondFieldName) => (
    <div className="d-flex flex-row">
      <div className="d-flex flex-column mt-2" style={{ width: '15rem' }}>
        <span className={cx('mt-3', styles.mediumText)}>
          {firstValue}
        </span>
        <span className={styles.greySmallText}>
          {firstFieldName}
        </span>
      </div>
      <div className="d-flex flex-column mt-2" style={{ width: '8rem' }}>
        <span className={cx('mt-3', styles.mediumText)}>
          {secondValue}
        </span>
        <span className={styles.greySmallText}>
          {secondFieldName}
        </span>
      </div>
    </div>
  );

  const profileData = (ind) => (
    <div className="d-flex flex-row">
      <ProfilePicStatus
        index={ind}
        type="mini"
        src={empData.profilePicUrl ? (images[empData.uuid]
          ? images[empData.uuid].image : null)
          : null}
        serviceStatus={bgvData}
      />
      <div className="d-flex flex-column ml-2">
        <span className={cx(styles.smallLabel)}>
          {!_.isEmpty(empData.firstName) ? empData.firstName : null}
          {' '}
          {!_.isEmpty(empData.lastName) ? empData.lastName : null}
        </span>
        <span className={styles.greySmallText}>
          {!_.isEmpty(empData.employeeId) ? empData.employeeId : ''}
          {!_.isEmpty(empData.employeeId) && !_.isEmpty(defaultRole) ? ' | ' : ''}
          {!_.isEmpty(defaultRole) ? `${defaultRole[0].name}` : ''}
        </span>
      </div>
    </div>
  );

  return (
    <div className={cx(scrollStyle.scrollbar, styles.backdrop)}>
      <img className={cx(styles.closeModal)} src={close} aria-hidden onClick={toggleModal} alt="close" />
      {!isEmpty(bgvData)
        ? !_.isEmpty(bgvData.career) && !_.isEmpty(bgvData.career.checks)
        && (['EMPLOYMENT', 'EDUCATION'].includes(verificationData.service))
          ? (
            <>
              {bgvData.career.checks.map((item, i) => {
                if (verificationData.service === 'EDUCATION' && item.service === 'EDUCATION'
                && !_.isEmpty(item.education)) {
                  return (
                    <div key={item.serviceRequestId} className={cx(styles.modalContainer, 'col-9 mb-5')}>
                      <div className="d-flex flex-row justify-content-between">
                        <div className="d-flex flex-column">
                          {!_.isEmpty(empData) ? profileData(i) : null}
                          {!_.isEmpty(item.education.board_university)
                            ? firstField(item.education.board_university, 'board or university') : null}
                        </div>
                        <div className="ml-auto">
                          {displayImg()}
                        </div>
                      </div>

                      <OtherFields
                        dataFields={item.education}
                        service={item.service}
                        verificationData={item}
                      />

                      <hr className={styles.horizontalLine} />

                      {!_.isEmpty(item.result)
                        ? (
                          <Result
                            clientStatus={item.result.clientStatus}
                            completedOn={item.completedOn}
                            comments={item.result.comments}
                            attachments={item.result.attachments}
                            handleDownload={handleDownloadAttachment}
                            downloadState={downloadState}
                            verificationData={verificationData}
                          />
                        ) : <Result inProgress />}
                    </div>
                  );
                }
                if (verificationData.service === 'EMPLOYMENT' && item.service === 'EMPLOYMENT'
                && !_.isEmpty(item.employment)) {
                  return (
                    <div key={item.serviceRequestId} className={cx(styles.modalContainer, 'col-9 mb-5')}>
                      <div className="d-flex flex-row justify-content-between">
                        <div className="d-flex flex-column">
                          {!_.isEmpty(empData) ? profileData(i) : null}
                          {!_.isEmpty(item.employment.organisation)
                            ? firstField(item.employment.organisation, 'board or university') : null}
                        </div>
                        <div className="ml-auto">
                          {displayImg()}
                        </div>
                      </div>

                      <OtherFields
                        dataFields={item.employment}
                        service={item.service}
                        verificationData={item}
                      />

                      <hr className={styles.horizontalLine} />

                      {!_.isEmpty(item.result)
                        ? (
                          <Result
                            clientStatus={item.result.clientStatus}
                            completedOn={item.completedOn}
                            comments={item.result.comments}
                            attachments={item.result.attachments}
                            handleDownload={handleDownloadAttachment}
                            downloadState={downloadState}
                          />
                        ) : <Result inProgress />}
                    </div>
                  );
                }
                return null;
              })}
            </>
          )
          : verificationData.service === 'REFERENCE' && !_.isEmpty(bgvData.reference) && !_.isEmpty(bgvData.reference.checks)
            ? (
              <>
                {bgvData.reference.checks.map((item, i) => {
                  if (item.service === 'REFERENCE' && item.reference) {
                    return (
                      <div key={item.serviceRequestId} className={cx(styles.modalContainer, scrollStyle.scrollbar, 'col-9 mb-5')}>
                        <div className="d-flex flex-row justify-content-between">
                          <div className="d-flex flex-column">
                            {!_.isEmpty(empData) ? profileData(i) : null}
                            {!_.isEmpty(item.reference.name)
                              ? twoFields(item.reference.name, 'reference name', verificationData.reference.relationship, 'relation')
                              : null}
                          </div>
                          <div className="ml-auto">
                            {displayImg()}
                          </div>
                        </div>

                        <OtherFields
                          dataFields={item.reference}
                          service={item.service}
                          verificationData={item}
                        />

                        <hr className={styles.horizontalLine} />

                        {!_.isEmpty(item.result)
                          ? (
                            <Result
                              clientStatus={item.result.clientStatus}
                              completedOn={item.completedOn}
                              comments={item.result.comments}
                              attachments={item.result.attachments}
                              handleDownload={handleDownloadAttachment}
                              downloadState={downloadState}
                            />
                          ) : <Result inProgress />}
                      </div>
                    );
                  }
                  return null;
                })}
              </>
            )
            : null
        : null}
    </div>
  );
};

export default MultipleModal;
