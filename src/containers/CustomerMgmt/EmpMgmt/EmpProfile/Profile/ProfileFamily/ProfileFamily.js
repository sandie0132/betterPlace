/* eslint-disable no-nested-ternary */
import React from 'react';
import { withRouter } from 'react-router';
import _ from 'lodash';
import cx from 'classnames';
import { withTranslation } from 'react-i18next';
import styles from './ProfileFamily.module.scss';
import phone from '../../../../../../assets/icons/phoneWithBg.svg';
import dob from '../../../../../../assets/icons/birthdayCake.svg';
import person from '../../../../../../assets/icons/familyProfile.svg';
import blood from '../../../../../../assets/icons/bloodGroupIcon.svg';
import currAddress from '../../../../../../assets/icons/currentAddressIcon.svg';
import permAddress from '../../../../../../assets/icons/permanentAddressIcon.svg';
import height from '../../../../../../assets/icons/heightIcon.svg';
import weight from '../../../../../../assets/icons/weightIcon.svg';
import mark from '../../../../../../assets/icons/identificationMark.svg';
import email from '../../../../../../assets/icons/emailIcon.svg';
import largePhone from '../../../../../../assets/icons/phoneIconWithBg.svg';

const ProfileFamily = ({
  t, familySection, familyRefs, healthSection, healthObject,
  addressSection, addresses, isCurrAndPerAddrSame, contactSection, contacts,
}) => {
  const dateFormat = (date) => {
    const values = date.split('-');
    let updatedDate = '';
    updatedDate = `${values[2]} • ${values[1]} • ${values[0]}`;
    return updatedDate;
  };

  const mobArray = []; const emailArray = [];
  if (!_.isEmpty(contacts)) {
    _.forEach(contacts, (value) => {
      if (value.type === 'MOBILE') mobArray.push(value.contact);
      else if (value.type === 'EMAIL') emailArray.push(value.contact);
    });
  }

  return (
    <div>
      {familySection && familyRefs.map((family, index) => (
        <React.Fragment key={family.uuid}>
          <label htmlFor="relationship" className={styles.greyBoldText}>{family.relationship.toLowerCase()}</label>
          <div className={cx('row no-gutters', index === familyRefs.length - 1 ? '' : 'mb-3')}>
            <div className="col-4 px-0">
              <div className="row no-gutters">
                <img src={person} alt={t('translation_empProfile:image_alt_empProfile.profileFamily.img')} className="mr-2" />
                <div style={{ width: '81%' }}>
                  <span className={cx('mb-0', styles.mediumText)}>
                    {' '}
                    {family.name}
                    {' '}
                  </span>
                  <br />
                  <span className={styles.greyContent}>{t('translation_empProfile:span_label_empProfile.profileFamily.name')}</span>
                </div>
              </div>
            </div>
            {!_.isEmpty(family.dob)
              ? (
                <div className="col-4 px-0">
                  <div className="row no-gutters">
                    <img src={dob} alt={t('translation_empProfile:image_alt_empProfile.profileFamily.img')} className="mr-2" />
                    <div>
                      <span className={cx('mb-0', styles.mediumText)}>{!_.isEmpty(family.dob) ? dateFormat(family.dob) : null}</span>
                      <br />
                      <span className={styles.greyContent}>{t('translation_empProfile:span_label_empProfile.profileFamily.dob')}</span>
                    </div>
                  </div>
                </div>
              ) : null}

            {!_.isEmpty(family.mobile)
              ? (
                <div className="col-4 px-0">
                  <div className="row no-gutters">
                    <img src={phone} alt={t('translation_empProfile:image_alt_empProfile.profileFamily.img')} className="mr-2" />
                    <div>
                      <span className={cx('mb-0', styles.mediumText)}>{family.mobile}</span>
                      <br />
                      <span className={styles.greyContent}>{t('translation_empProfile:span_label_empProfile.profileFamily.phone')}</span>
                    </div>
                  </div>
                </div>
              ) : null}
          </div>
        </React.Fragment>
      ))}

      {healthSection
        ? (
          <>
            <div className="row no-gutters">
              {!_.isEmpty(healthObject.weight)
                ? (
                  <div className="col-4 px-0">
                    <div className="row no-gutters">
                      <img src={weight} alt={t('translation_empProfile:image_alt_empProfile.profileFamily.img')} className="mr-2" />
                      <div style={{ width: '82%' }}>
                        <span className={cx('mb-0', styles.mediumText)}>
                          {healthObject.weight}
                          {' '}
                          {!_.isEmpty(healthObject.weightUnit) ? healthObject.weightUnit : 'kg'}
                        </span>
                        <br />
                        <span className={styles.greyContent}>{t('translation_empProfile:span_label_empProfile.profileFamily.weight')}</span>
                      </div>
                    </div>
                  </div>
                ) : null}

              {!_.isEmpty(healthObject.height)
                ? (
                  <div className="col-4 px-0">
                    <div className="row no-gutters">
                      <img src={height} alt={t('translation_empProfile:image_alt_empProfile.profileFamily.img')} className="mr-2" />
                      <div style={{ width: '82%' }}>
                        <span className={cx('mb-0', styles.mediumText)}>
                          {healthObject.height}
                          {' '}
                          {!_.isEmpty(healthObject.heightUnit) ? healthObject.heightUnit : 'cm'}
                        </span>
                        <br />
                        <span className={styles.greyContent}>{t('translation_empProfile:span_label_empProfile.profileFamily.height')}</span>
                      </div>
                    </div>
                  </div>
                ) : null}

              {!_.isEmpty(healthObject.bloodGroup)
                ? (
                  <div className="col-4 px-0">
                    <div className="row no-gutters">
                      <img src={blood} alt={t('translation_empProfile:image_alt_empProfile.profileFamily.img')} className={cx('mr-2')} />
                      <div>
                        <span className={cx('mb-0', styles.mediumText)}>{healthObject.bloodGroup}</span>
                        <br />
                        <span className={styles.greyContent}>{t('translation_empProfile:span_label_empProfile.profileFamily.bloodType')}</span>
                      </div>
                    </div>
                  </div>
                ) : null}

              {!_.isEmpty(healthObject.identificationMark)
                ? (
                  <div className="col-4 px-0">
                    <div className={cx('row no-gutters', {
                      'mt-4': healthObject.weight && healthObject.height && healthObject.bloodGroup,
                    })}
                    >
                      <img src={mark} alt={t('translation_empProfile:image_alt_empProfile.profileFamily.img')} className={cx('mr-2')} />
                      <div style={{ width: '82%' }}>
                        <span className={cx('mb-0', styles.mediumText)}>{healthObject.identificationMark}</span>
                        <br />
                        <span className={styles.greyContent}>{t('translation_empProfile:span_label_empProfile.profileFamily.idMark')}</span>
                      </div>
                    </div>
                  </div>
                ) : null}
            </div>
          </>
        ) : null}

      {addressSection
        ? (
          <span className="row no-gutters">
            {addresses.map((address, index) => (
              <React.Fragment key={address.uuid}>
                <div className={cx('row no-gutters col-6 px-0', index === addresses.length - 1 ? 'mt-2' : 'my-2')}>

                  <div className="px-0 mt-2 mr-3">
                    {address.addressType === 'PERMANENT_ADDRESS' ? <img src={permAddress} alt={t('translation_empProfile:image_alt_empProfile.profileFamily.img')} /> : <img src={currAddress} alt={t('translation_empProfile:image_alt_empProfile.profileFamily.img')} />}
                  </div>

                  <div className="col-sm-10 px-0 py-0">
                    <span className={cx(styles.greyBoldText)}>
                      {isCurrAndPerAddrSame
                        ? 'current and permanent address'
                        : address.addressType.replace(/_/gi, ' ').toLowerCase()}
                    </span>
                    <br />
                    <p className={styles.smallText}>
                      {(!_.isEmpty(address.addressLine1) ? `${address.addressLine1}, ` : '') + (!_.isEmpty(address.addressLine2) ? `${address.addressLine2}, ` : '')}
                      <br />
                      {!_.isEmpty(address.landmark) ? `${address.landmark}, ` : ''}
                      {!_.isEmpty(address.city) ? `${address.city}, ` : ''}
                      {(!_.isEmpty(address.landmark) || !_.isEmpty(address.city))
                        ? <br /> : null}
                      {(!_.isEmpty(address.district) ? `${address.district}, ` : '')
                          + (!_.isEmpty(address.state) ? `${address.state}, ` : '')
                          + (!_.isEmpty(address.country) ? `${address.country}, ` : '')
                          + address.pincode}
                    </p>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </span>
        ) : null}

      {contactSection && (!_.isEmpty(mobArray) || !_.isEmpty(emailArray))
        ? (
          <>
            <div className="row no-gutters mt-2">
              {!_.isEmpty(mobArray)
                ? (
                  <>
                    <div className="px-0 mt-2 mr-3">
                      <img src={largePhone} alt={t('translation_empProfile:image_alt_empProfile.profileFamily.img')} />
                    </div>

                    <div className="col-sm-5 px-0 py-0">
                      <span className={cx(styles.greyBoldText)}>
                        {t('translation_empProfile:span_label_empProfile.profileFamily.phone')}
                      </span>
                      {mobArray.map((mob) => (
                        <p key={mob} className={cx(styles.smallText)}>
                          {mob}
                        </p>
                      ))}
                    </div>
                  </>
                ) : null}
              {!_.isEmpty(emailArray)
                ? (
                  <>
                    <div className="px-0 mt-2 mr-3">
                      <img src={email} alt={t('translation_empProfile:image_alt_empProfile.profileFamily.img')} />
                    </div>

                    <div className="col-sm-5 px-0 py-0">
                      <span className={cx(styles.greyBoldText)}>
                        {t('translation_empProfile:span_label_empProfile.profileFamily.emailId')}
                      </span>
                      {emailArray.map((mail) => (
                        <p key={mail} className={cx(styles.smallText)}>
                          {mail}
                        </p>
                      ))}
                    </div>
                  </>
                ) : null}
            </div>
          </>
        ) : null}
    </div>
  );
};

export default withTranslation()(withRouter(ProfileFamily));
