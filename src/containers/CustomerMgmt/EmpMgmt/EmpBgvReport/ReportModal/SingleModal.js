/* eslint-disable no-nested-ternary */
import React from 'react';
import _ from 'lodash';
import cx from 'classnames';
import styles from './SingleModal.module.scss';
import scrollStyle from '../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';

import close from '../../../../../assets/icons/closePage.svg';
import pan from '../../../../../assets/icons/panCard.svg';
import aadhaar from '../../../../../assets/icons/aadhaarCard.svg';
import rc from '../../../../../assets/icons/rcUpperCard.svg';
import dl from '../../../../../assets/icons/drivinglicenseCard.svg';
import voter from '../../../../../assets/icons/voterCard.svg';
import postal from '../../../../../assets/icons/postalBigIcon.svg';
import physical from '../../../../../assets/icons/physicalAddress.svg';
import court from '../../../../../assets/icons/courtCard.svg';
import globalDb from '../../../../../assets/icons/global.svg';
import police from '../../../../../assets/icons/police.svg';
import health from '../../../../../assets/icons/healthCheckBigIcon.svg';

import ProfilePicStatus from '../../../../../components/Organism/ProfilePicStatus/ProfilePicStatus';
import OtherFields from './OtherFields';
import Result from './Result';

const SingleModal = ({
  verificationData, defaultRole, empData, bgvData, images, toggleModal,
  handleDownloadAttachment, downloadState,
}) => {
  const displayImg = () => {
    let displayIcon = '';
    if (verificationData.service === 'PAN') { displayIcon = <img src={pan} alt="pan" />; }
    if (verificationData.service === 'AADHAAR') { displayIcon = <img src={aadhaar} alt="aadhaar" />; }
    if (verificationData.service === 'DL') { displayIcon = <img src={dl} alt="dl" />; }
    if (verificationData.service === 'RC') { displayIcon = <img src={rc} alt="rc" />; }
    if (verificationData.service === 'VOTER') { displayIcon = <img src={voter} alt="voter" />; }
    if (verificationData.verificationPreference === 'POSTAL') { displayIcon = <img src={postal} alt="postal" />; }
    if (verificationData.verificationPreference === 'PHYSICAL') { displayIcon = <img src={physical} alt="physical" />; }
    if (verificationData.service === 'CRC_CURRENT_ADDRESS' || verificationData.service === 'CRC_PERMANENT_ADDRESS') { displayIcon = <img src={court} alt="court" />; }
    if (verificationData.service === 'POLICE_VERIFICATION') { displayIcon = <img src={police} alt="police" />; }
    if (verificationData.service === 'GLOBALDB') { displayIcon = <img src={globalDb} alt="globalDb" />; }
    if (verificationData.service === 'HEALTH') { displayIcon = <img src={health} alt="health" />; }
    return displayIcon;
  };

  const addressObj = (givenAddress) => {
    let fullAddress = '';
    if (givenAddress.addressLine1) { fullAddress += `${givenAddress.addressLine1}, `; }
    if (givenAddress.addressLine2) { fullAddress += `${givenAddress.addressLine2}, `; }
    if (givenAddress.landmark) { fullAddress += `${givenAddress.landmark}, `; }
    if (givenAddress.city) { fullAddress += `${givenAddress.city}, `; }
    if (givenAddress.state) { fullAddress += `${givenAddress.state}, `; }
    if (givenAddress.pincode) { fullAddress += givenAddress.pincode; }
    return fullAddress;
  };

  const firstField = (fieldValue, fieldName) => (
    <div className={cx('d-flex flex-column mt-2')}>
      <div className="d-flex flex-row">
        <span className={cx('mt-3', styles.mediumText)}>
          {fieldValue}
        </span>
      </div>
      <span className={styles.greySmallText}>
        {fieldName === 'CRC_CURRENT_ADDRESS'
          ? 'current address'
          : fieldName === 'CRC_PERMANENT_ADDRESS'
            ? 'permanent address'
            : fieldName}
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

  const resultAttachments = [];
  if (!_.isEmpty(verificationData.result) && !_.isEmpty(verificationData.result.addressObject)) {
    verificationData.result.addressObject.forEach((key) => {
      if (!_.isEmpty(key) && key.url) {
        resultAttachments.push(key.url);
      }
    });
  }

  return (
    <div className={cx(scrollStyle.scrollbar, styles.backdrop)}>
      <img className={cx(styles.closeModal)} src={close} aria-hidden onClick={toggleModal} alt="close" />
      <div className={cx(styles.modalContainer, 'col-9')}>
        <div className="d-flex flex-row justify-content-between">
          <div className="d-flex flex-column">
            {!_.isEmpty(empData)
              ? (
                // profile picture with name & designation
                <div className="d-flex flex-row">
                  <ProfilePicStatus
                    type="mini"
                    src={empData.profilePicUrl ? (images[empData.uuid]
                      ? images[empData.uuid].image : null)
                      : null}
                    serviceStatus={bgvData}
                    index={0}
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
              ) : null}

            {/* first field */}
            {!_.isEmpty(verificationData.service)
              ? !_.isEmpty(verificationData.doc) && !_.isEmpty(verificationData.doc.documentNumber)
                ? firstField(verificationData.doc.documentNumber, `${verificationData.service.toLowerCase()} number`)
                : !_.isEmpty(verificationData.address)
                  && !_.isEmpty(verificationData.address.addressType)
                  ? (
                    verificationData.service === 'POLICE_VERIFICATION'
                      || verificationData.verificationPreference === 'POSTAL'
                      ? firstField(verificationData.address.fullName, 'full name')
                      : firstField(addressObj(verificationData.address), `${verificationData.service.toLowerCase().replace(/_/g, ' ')}`)
                  )
                  : !_.isEmpty(verificationData.crc) && !_.isEmpty(verificationData.crc.addressType)
                    ? firstField(addressObj(verificationData.crc), `${verificationData.service}`)
                    : !_.isEmpty(verificationData.globaldb)
                      ? firstField(verificationData.globaldb.fullName, 'full name')
                      : !_.isEmpty(verificationData.health)
                        ? twoFields(verificationData.fullName, 'full name', verificationData.health.bloodGroup, 'blood group')
                        : null
              : null}
          </div>
          <div className="ml-auto">
            {displayImg()}
          </div>
        </div>

        {/* to display other fields wrt to given data */}
        <OtherFields
          dataFields={
            !_.isEmpty(verificationData.doc) ? verificationData.doc
              : !_.isEmpty(verificationData.address) ? verificationData.address
                : !_.isEmpty(verificationData.crc) ? verificationData.crc
                  : !_.isEmpty(verificationData.globaldb) ? verificationData.globaldb
                    : null
          }
          service={verificationData.service}
          verificationData={verificationData}
        />

        <hr className={styles.horizontalLine} />

        {/* third section */}
        {!_.isEmpty(verificationData.result)
          ? (
            <Result
              clientStatus={verificationData.result.clientStatus}
              completedOn={verificationData.completedOn}
              comments={verificationData.result.comments}
              attachments={verificationData.verificationPreference === 'PHYSICAL' ? resultAttachments : verificationData.result.attachments}
              handleDownload={handleDownloadAttachment}
              downloadState={downloadState}
              verificationData={verificationData}
            />
          )
          : (
            <Result
              inProgress
            />
          )}
      </div>
    </div>
  );
};

export default SingleModal;
