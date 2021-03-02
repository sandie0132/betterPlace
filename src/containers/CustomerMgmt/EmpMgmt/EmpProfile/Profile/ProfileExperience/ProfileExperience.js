/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';
import styles from './ProfileExperience.module.scss';

import eduIcon from '../../../../../../assets/icons/educationalBuilding.svg';
import empIcon from '../../../../../../assets/icons/buildingWithBg.svg';
import noAttachments from '../../../../../../assets/icons/noAttachments.svg';
import pdf from '../../../../../../assets/icons/pdfIcon.svg';

import * as actions from '../../Store/action';

class ProfileExperience extends Component {
    handleFileDownload = (type, url) => {
      const { onDownloadFile } = this.props;
      onDownloadFile(type, url);
    }

    handleFileNamePreview = (fileURL) => {
      const fileName = fileURL.split('/').pop();
      if (fileName.length > 10) {
        return `${fileName.slice(0, 6)}..`;
      }
      return fileName;
    }

    render() {
      const {
        t, downloadFileState, experienceSection, workDetails, educationSection, educationDetails,
      } = this.props;

      const emptyAttachments = (
        <span className={cx('col-5 px-0 row')}>
          <img src={noAttachments} alt="" />
        </span>
      );

      return (
        <>
          {experienceSection
            ? (
              <>
                {workDetails.map((hist, index) => (
                  <div key={hist.uuid} className={cx('row no-gutters', index === workDetails.length - 1 ? '' : 'mb-4')}>
                    <span className="mx-0 px-0">
                      <img src={empIcon} alt={t('translation_empProfile:image_alt_empProfile.profileExperience.icon')} className="mt-1" />
                    </span>
                    <span className="col-6 px-0 mx-3">
                      <label htmlFor="designation" className={cx(styles.greyBoldText, 'mb-1')}>
                        {hist.designation}
                        {' '}
                        {hist.designation ? <span>@</span> : null}
                        {' '}
                        {hist.organisation}
                      </label>
                      <br />
                      {!_.isEmpty(hist.employeeId)
                        ? (
                          <div className={cx(styles.primaryText, 'mb-1')}>
                            {t('translation_empProfile:texts_empProfile.profileExperience.empId')}
                            {' '}
                            {hist.employeeId}
                          </div>
                        ) : null}
                      <div className={cx(styles.secondaryText, 'mt-2')}>
                        {hist.joinedFrom.split('-').reverse().join(' • ')}
                        {' '}
                        {hist.workedUntil ? `- ${hist.workedUntil.split('-').reverse().join(' • ')}` : null}
                      </div>
                    </span>
                    {!_.isEmpty(hist.downloadURL)
                      ? (
                        <span className={downloadFileState === 'LOADING' ? cx('col-5 row', styles.pdfStyleLoading) : cx('col-5 row', styles.pdfStyle)}>
                          {hist.downloadURL.map((histPdf) => (
                            <span key={histPdf} className="mr-4">
                              <span className="pl-1 mt-1">
                                <img
                                  src={pdf}
                                  alt={t('translation_empProfile:image_alt_empProfile.profileExperience.img')}
                                  onClick={downloadFileState === 'LOADING' ? null
                                    : () => this.handleFileDownload('employee_work_history_documents', histPdf)}
                                  aria-hidden
                                />
                                <br />
                                <span className={styles.greySmallText}>
                                  {this.handleFileNamePreview(histPdf)}
                                </span>
                              </span>
                            </span>
                          ))}
                        </span>
                      )
                      : emptyAttachments}
                  </div>
                ))}
              </>
            ) : null}

          {educationSection
            ? (
              <>
                {educationDetails.map((edu, index) => (
                  <div key={edu.uuid} className={cx('row no-gutters', index === educationDetails.length - 1 ? '' : 'mb-4')}>
                    <span className=" mx-0 px-0">
                      <img src={eduIcon} alt={t('translation_empProfile:image_alt_empProfile.profileExperience.icon')} className="mt-2" />
                    </span>
                    <span className="col-6 px-0 mx-3">
                      <small className={cx('mb-1', styles.greyBoldText)}>{edu.educationType.toLowerCase().replace(/_/g, ' ')}</small>

                      <div className={cx(styles.primaryText, 'mb-0 pb-1')}>
                        {(edu.school_college).toLowerCase()}
                      </div>

                      <div className={cx(styles.primaryText, 'mb-1')}>
                        {edu.board_university}
                        ,
                        {' '}
                        {edu.course}
                        {!_.isEmpty(edu.cgpa_percentage)
                          ? (
                            <span>
                              ,
                              {' '}
                              {edu.cgpa_percentage}
                              {edu.cgpa_percentage > 10 ? '%' : ' cgpa'}
                            </span>
                          )
                          : null}
                      </div>

                      {!_.isEmpty(edu.from)
                        ? (
                          <div className={cx(styles.primaryText, 'mb-2')}>
                            {edu.from.split('-').reverse().join(' • ')}
                            {' '}
                            {!_.isEmpty(edu.to) ? `- ${edu.to.split('-').reverse().join(' • ')}` : null}
                          </div>
                        )
                        : null}

                      {!_.isEmpty(edu.passedYear)
                        ? (
                          <div className={cx(styles.secondaryText)}>
                            {t('translation_empProfile:texts_empProfile.profileExperience.graduation')}
                            {edu.passedYear}
                          </div>
                        )
                        : null}
                    </span>
                    {!_.isEmpty(edu.downloadURL)
                      ? (
                        <span className={downloadFileState === 'LOADING' ? cx('col-5 row', styles.pdfStyleLoading) : cx('col-5 row', styles.pdfStyle)}>
                          {edu.downloadURL.map((pdfEdu) => (
                            <span key={pdfEdu} className="mr-4">
                              <span className="pl-1 mt-1">
                                <img
                                  src={pdf}
                                  alt={t('translation_empProfile:image_alt_empProfile.profileExperience.img')}
                                  onClick={downloadFileState === 'LOADING' ? null : () => this.handleFileDownload('employee_education_documents', pdfEdu)}
                                  aria-hidden
                                />
                                <br />
                                <span className={styles.greySmallText}>
                                  {this.handleFileNamePreview(pdfEdu)}
                                </span>
                              </span>
                            </span>
                          ))}
                        </span>
                      )
                      : emptyAttachments}
                  </div>
                ))}
              </>
            )
            : null}
        </>
      );
    }
}

const mapStateToProps = (state) => ({
  downloadFileState: state.empMgmt.empProfile.downloadFileState,
});

const mapDispatchToProps = (dispatch) => ({
  onDownloadFile: (type, url) => dispatch(actions.downloadFile(type, url)),
});

export default withTranslation()(withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProfileExperience),
));
