/* eslint-disable radix */
import React, { Component } from 'react';
import cx from 'classnames';
import { withRouter } from 'react-router';
import _ from 'lodash';
import styles from './ReportCareer.module.scss';
import greyCase from '../../../../../assets/icons/greyCase.svg';
import greenCase from '../../../../../assets/icons/greenCase.svg';
import redCase from '../../../../../assets/icons/verifyRed.svg';
import amberCase from '../../../../../assets/icons/yellow.svg';
import education from '../../../../../assets/icons/education.svg';
import employment from '../../../../../assets/icons/employment.svg';
import inprogress from '../../../../../assets/icons/inprogress.svg';
import redTag from '../../../../../assets/icons/redTag.svg';
import yellowTag from '../../../../../assets/icons/yellowTag.svg';
import greenTag from '../../../../../assets/icons/greenTag.svg';
import inprogressTag from '../../../../../assets/icons/inprogressTag.svg';

import StatusChangeTab from '../StatusChangeTab/StatusChangeTab';

class ReportCareer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      educationArray: [],
      employmentArray: [],
      setEducation: [],
      setEmployment: [],
      educationComment: '',
      employmentComment: '',
    };
  }

  componentDidMount() {
    const { bgvData } = this.props;
    const educationCheck = []; const employmentCheck = [];
    const educationArray = []; const employmentArray = [];
    const setEmployment = []; const setEducation = [];
    let educationComment = ''; let employmentComment = '';

    if (!_.isEmpty(bgvData.career) && !_.isEmpty(bgvData.career.checks)) {
      _.forEach(bgvData.career.checks, (check) => {
        if (check.service === 'EDUCATION' && check.status !== 'missing_info') {
          educationCheck.push(check);
        }
        if (check.service === 'EMPLOYMENT' && check.status !== 'missing_info') {
          employmentCheck.push(check);
        }
      });
      if (!_.isEmpty(educationCheck)) {
        _.forEach(educationCheck, (value) => {
          const object = {};
          object.date = parseInt(value.education.passedYear);
          object.value = value;
          setEducation.push(object);
        });
        setEducation.sort((a, b) => b.date - a.date);

        if (!_.isEmpty(setEducation)) {
          _.forEach(setEducation, (set) => {
            educationArray.push(set.value.education.school_college);
          });
          if (setEducation[0].value.status === 'done') {
            educationComment = !_.isEmpty(setEducation[0].value.result) && !_.isEmpty(setEducation[0].value.result.comments) ? setEducation[0].value.result.comments[0] : 'record found';
          }
        }
      }
      if (!_.isEmpty(employmentCheck)) {
        _.forEach(employmentCheck, (value) => {
          const object = {};
          object.date = parseInt(value.employment.workedUntil);
          object.value = value;
          setEmployment.push(object);
        });
        setEmployment.sort((a, b) => b.date - a.date);
        if (!_.isEmpty(setEmployment)) {
          _.forEach(setEmployment, (set) => {
            employmentArray.push(set.value.employment.organisation);
          });
          if (setEmployment[0].value.status === 'done') {
            employmentComment = !_.isEmpty(setEmployment[0].value.result.comments) ? setEmployment[0].value.result.comments[0] : 'record found';
          }
        }
      }
      this.setState({
        educationArray,
        employmentArray,
        setEducation,
        setEmployment,
        educationComment,
        employmentComment,
      });
    }
  }

    handleBackgroundColor = (status) => {
      if (status === 'RED') { return { backgroundColor: '#FDEBEC' }; }
      if (status === 'GREEN') { return { backgroundColor: '#EDF7ED' }; }
      if (status === 'YELLOW') { return { backgroundColor: '#FFF7E5' }; }
      return { backgroundColor: '#F4F7FB' };
    }

    render() {
      const {
        educationArray, employmentArray, setEducation, setEmployment,
        educationComment, employmentComment,
      } = this.state;
      const { bgvData, toggleModal } = this.props;
      const clientStatus = !_.isEmpty(bgvData.career.clientStatus) ? bgvData.career.clientStatus : 'GREY';
      const platformStatus = !_.isEmpty(bgvData.career.platformStatus) ? bgvData.career.platformStatus : 'GREY';

      let careerVerificationStatus = <img src={inprogressTag} alt="grey" />;
      if (clientStatus === 'GREEN') careerVerificationStatus = <img src={greenTag} alt="green" />;
      else if (clientStatus === 'YELLOW') careerVerificationStatus = <img src={yellowTag} alt="amber" />;
      else if (clientStatus === 'RED') careerVerificationStatus = <img src={redTag} alt="red" />;

      const icon = (check) => {
        if (check.service === 'EDUCATION') return <img src={education} className={cx('my-auto', styles.imgSize)} alt="img" />;
        if (check.service === 'EMPLOYMENT') return <img src={employment} className={cx('my-auto', styles.imgSize)} alt="img" />;
        return null;
      };

      const careerCard = (check) => {
        let statusIcon = <img src={greyCase} alt="grey" className={styles.statusIcon} />;
        if (!_.isEmpty(check.result) && check.result.clientStatus === 'GREEN') statusIcon = <img src={greenCase} alt="green" className={styles.statusIcon} />;
        else if (!_.isEmpty(check.result) && check.result.clientStatus === 'YELLOW') statusIcon = <img src={amberCase} alt="amber" className={styles.statusIcon} />;
        else if (!_.isEmpty(check.result) && check.result.clientStatus === 'RED') statusIcon = <img src={redCase} alt="red" className={styles.statusIcon} />;

        let serviceArray = null;
        if (check.service === 'EDUCATION' && !_.isEmpty(educationArray)) {
          serviceArray = (
            <div className={styles.addressText}>
              {educationArray[0]}
              {educationArray.length > 1 ? (
                <span>
                  {' '}
                  , +
                  {educationArray.length - 1}
                  {' '}
                  more...
                </span>
              ) : ''}
            </div>
          );
        } else if (check.service === 'EMPLOYMENT' && !_.isEmpty(employmentArray)) {
          serviceArray = (
            <div className={styles.addressText}>
              {employmentArray[0]}
              {employmentArray.length > 1 ? (
                <span>
                  {' '}
                  , +
                  {employmentArray.length - 1}
                  {' '}
                  more...
                </span>
              ) : ''}
            </div>
          );
        }

        return (
          check.status === 'done' && !_.isEmpty(check.result)
            ? (
              <div className={cx(styles.BgStyle, 'mr-4 mb-3 d-flex flex-row')} style={this.handleBackgroundColor(check.result.clientStatus)}>
                {icon(check)}
                <div className="d-flex flex-column ml-3 my-auto">
                  <span>
                    <small className={styles.serviceName}>
                      {check.service.toLowerCase()}
                      {' '}
                    </small>
                    {statusIcon}
                  </span>
                  {serviceArray}
                  {check.service === 'EDUCATION'
                    ? (
                      <div className={styles.caseStatus}>
                        &quot;
                        {educationComment}
                        &quot;
                      </div>
                    ) : (
                      <div className={styles.caseStatus}>
                        &quot;
                        {employmentComment}
                        &quot;
                      </div>
                    )}
                </div>
              </div>
            ) : (
              <div className={cx(styles.BgStyle, 'mr-4 mb-3 d-flex flex-row')} style={this.handleBackgroundColor('GREY')}>
                {icon(check)}
                <div className="d-flex flex-column ml-3 my-auto">
                  <span>
                    <small className={styles.serviceName}>
                      {check.service.toLowerCase()}
                      {' '}
                    </small>
                    <img src={inprogress} alt="inprogress" className={styles.statusIcon} />
                  </span>
                  {serviceArray}
                  <div className={styles.caseStatus}>
                    in progress
                  </div>
                </div>
              </div>
            )
        );
      };

      return (
        (_.isEmpty(educationArray) && _.isEmpty(employmentArray)) ? null : (
          <>
            <div className={cx('d-flex flex-column')}>
              <div className="d-flex flex-row">
                <span className={styles.sectionHeading}>career verification</span>
                &emsp;
                {careerVerificationStatus}
              </div>

              {clientStatus !== platformStatus ? (
                <StatusChangeTab
                  type="career verification"
                  platformStatus={platformStatus}
                  clientStatus={clientStatus}
                />
              ) : null}

              <div className="d-flex flex-wrap mt-3">
                {!_.isEmpty(setEducation)
                  ? (
                    <div
                      className={cx('col-6 px-0')}
                      role="button"
                      aria-hidden
                      onClick={() => toggleModal(setEducation[0].value)}
                    >
                      {careerCard(setEducation[0].value)}
                    </div>
                  ) : null}
                {!_.isEmpty(setEmployment)
                  ? (
                    <div
                      className={cx('col-6 px-0')}
                      role="button"
                      aria-hidden
                      onClick={() => toggleModal(setEmployment[0].value)}
                    >
                      {careerCard(setEmployment[0].value)}
                    </div>
                  ) : null}
              </div>
              <hr className={cx('mr-4 mb-4', styles.horizontalLine)} />
            </div>
          </>
        )
      );
    }
}

export default withRouter(ReportCareer);
