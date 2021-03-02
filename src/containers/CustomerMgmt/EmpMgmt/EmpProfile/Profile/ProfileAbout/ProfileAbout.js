/* eslint-disable no-nested-ternary */
import React from 'react';
import { withRouter } from 'react-router';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';

import cx from 'classnames';
import styles from './ProfileAbout.module.scss';
import father from '../../../../../../assets/icons/father.svg';
import mother from '../../../../../../assets/icons/mother.svg';
import statIcon from '../../../../../../assets/icons/maritalStatus.svg';
import religionIcon from '../../../../../../assets/icons/religion.svg';
import nationalityIcon from '../../../../../../assets/icons/nationality.svg';

const ProfileAbout = ({
  t, firstName, defaultRole, gender, skills, preferences, languages,
  fatherName, motherName, maritalStatus, nationality, religion,
}) => {
  const handleArrayLists = (array) => {
    let text = ' ';
    _.forEach(array, (value) => {
      text += `${value.name.toLowerCase().replace(/_/g, ' ')}, `;
    });
    text = text.replace(/,\s*$/, '');
    return text;
  };

  const eachField = (name, value, icon) => (
    <span className={cx('col-4 px-0', styles.marginTop)}>
      <span className="row no-gutters">
        <img src={icon} className="pr-2" alt="" />
        <span className="d-flex flex-column" style={{ width: '81%' }}>
          <span className={styles.mediumText}>
            {value}
          </span>
          <span className={styles.greyText}>
            {name}
          </span>
        </span>
      </span>
    </span>
  );

  const aboutDetailsCondition = _.isEmpty(defaultRole) && _.isEmpty(skills)
  && _.isEmpty(preferences) && _.isEmpty(languages);

  return (
    <>
      {aboutDetailsCondition
        ? null
        : (
          <div className="mb-3">
            <span className={styles.mediumText}>
              {_.isEmpty(firstName) ? null
                : (
                  <>
                    {defaultRole
                      ? `${firstName
                            + t('translation_empProfile:texts_empProfile.profileAbout.workingAs')
                            + defaultRole.toLowerCase().replace(/_/g, ' ')}, `
                      : null}

                    {!_.isEmpty(skills)
                      ? (defaultRole
                        ? (gender === 'MALE'
                          ? t('translation_empProfile:texts_empProfile.profileAbout.he')
                          : t('translation_empProfile:texts_empProfile.profileAbout.she')
                        ) : firstName)
                            + t('translation_empProfile:texts_empProfile.profileAbout.hasSkills')
                            + handleArrayLists(skills)
                      : ''}

                    {!_.isEmpty(preferences)
                      ? `${t('translation_empProfile:texts_empProfile.profileAbout.but')
                            + (gender === 'MALE'
                              ? t('translation_empProfile:texts_empProfile.profileAbout.his')
                              : t('translation_empProfile:texts_empProfile.profileAbout.her'))
                            + t('translation_empProfile:texts_empProfile.profileAbout.interest')
                            + handleArrayLists(preferences)}. `
                      : ''}

                    {!_.isEmpty(languages)
                      ? `${firstName + t('translation_empProfile:texts_empProfile.profileAbout.knows')
                            + languages.map((lang) => (` ${lang.language.toLowerCase()}`))}.`
                      : ''}
                  </>
                )}
            </span>
          </div>
        )}

      {fatherName || motherName || maritalStatus || religion || nationality
        ? (
          <div className={cx('row no-gutters')}>
            {fatherName
              ? (
                eachField(t('translation_empProfile:span_label_empProfile.profileAbout.fatherName'), fatherName.toLowerCase(), father)
              ) : null}

            {motherName
              ? (
                eachField(t('translation_empProfile:span_label_empProfile.profileAbout.motherName'), motherName.toLowerCase(), mother)
              ) : null}

            {maritalStatus
              ? (
                eachField(t('translation_empProfile:span_label_empProfile.profileAbout.maritalStatus'), maritalStatus.toLowerCase(), statIcon)
              ) : null}

            {religion
              ? (
                eachField(t('translation_empProfile:span_label_empProfile.profileAbout.religion'), religion.toLowerCase(), religionIcon)
              ) : null}

            {nationality
              ? (
                eachField(t('translation_empProfile:span_label_empProfile.profileAbout.nationality'), nationality.toLowerCase(), nationalityIcon)
              ) : null}
          </div>
        ) : null}
    </>
  );
};

export default withTranslation()(withRouter(ProfileAbout));
