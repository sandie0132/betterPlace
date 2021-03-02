import React, { Component } from 'react';
import cx from 'classnames';
import _ from 'lodash';
import styles from './ReportLegal.module.scss';
import greenCase from '../../../../../assets/icons/greenCase.svg';
import greyCase from '../../../../../assets/icons/greyCase.svg';
import redCase from '../../../../../assets/icons/verifyRed.svg';
import amberCase from '../../../../../assets/icons/verifyYellow.svg';
import inprogress from '../../../../../assets/icons/inprogress.svg';
import onhold from '../../../../../assets/icons/onholdYellow.svg';
import court from '../../../../../assets/icons/court.svg';
import globaldb from '../../../../../assets/icons/globaldb.svg';
import policeIcon from '../../../../../assets/icons/policeIcon.svg';
import redTag from '../../../../../assets/icons/redTag.svg';
import yellowTag from '../../../../../assets/icons/yellowTag.svg';
import greenTag from '../../../../../assets/icons/greenTag.svg';
import inprogressTag from '../../../../../assets/icons/inprogressTag.svg';

import StatusChangeTab from '../StatusChangeTab/StatusChangeTab';

class ReportLegal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      crcCurCheck: '',
      crcPerCheck: '',
      globalDbCheck: '',
      policeCheck: '',
    };
  }

  componentDidMount() {
    const { bgvData } = this.props;
    let crcCurCheck = ''; let crcPerCheck = ''; let globalDbCheck = ''; let policeCheck = '';
    if (!_.isEmpty(bgvData.legal)) {
      _.forEach(bgvData.legal.checks, (check) => {
        if (check.service === 'CRC_CURRENT_ADDRESS' && check.status !== 'missing_info') {
          crcCurCheck = check;
        } else if (check.service === 'CRC_PERMANENT_ADDRESS' && check.status !== 'missing_info') {
          crcPerCheck = check;
        } else if (check.service === 'GLOBALDB' && check.status !== 'missing_info') {
          globalDbCheck = check;
        } else if (check.service === 'POLICE_VERIFICATION' && check.status !== 'missing_info') {
          policeCheck = check;
        }
      });
      this.setState({
        crcCurCheck,
        crcPerCheck,
        globalDbCheck,
        policeCheck,
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
        crcCurCheck, crcPerCheck, globalDbCheck, policeCheck,
      } = this.state;
      const { bgvData, empData, toggleModal } = this.props;
      const clientStatus = !_.isEmpty(bgvData.legal.clientStatus) ? bgvData.legal.clientStatus : 'GREY';
      const platformStatus = !_.isEmpty(bgvData.legal.platformStatus) ? bgvData.legal.platformStatus : 'GREY';

      let legalVerificationStatus = <img src={inprogressTag} alt="grey" />;
      if (clientStatus === 'GREEN') legalVerificationStatus = <img src={greenTag} alt="green" />;
      else if (clientStatus === 'YELLOW') legalVerificationStatus = <img src={yellowTag} alt="amber" />;
      else if (clientStatus === 'RED') legalVerificationStatus = <img src={redTag} alt="red" />;

      const legalCard = (check) => {
        let statusIcon = <img src={greyCase} alt="grey" className={styles.statusIcon} />;
        if (!_.isEmpty(check.result) && check.result.clientStatus === 'GREEN') statusIcon = <img src={greenCase} alt="green" className={styles.statusIcon} />;
        else if (!_.isEmpty(check.result) && check.result.clientStatus === 'YELLOW') statusIcon = <img src={amberCase} alt="amber" className={styles.statusIcon} />;
        else if (!_.isEmpty(check.result) && check.result.clientStatus === 'RED') statusIcon = <img src={redCase} alt="red" className={styles.statusIcon} />;

        let sameCurrAndPermAddress = null;
        if (empData.isCurrAndPerAddrSame === false || _.isEmpty(empData.isCurrAndPerAddrSame)) {
          if (check.service === 'CRC_CURRENT_ADDRESS') {
            sameCurrAndPermAddress = (
              <small className={styles.serviceName}>
                court - current address
              </small>
            );
          } else if (check.service === 'CRC_PERMANENT_ADDRESS') {
            sameCurrAndPermAddress = (
              <small className={styles.serviceName}>
                court - permanent address
              </small>
            );
          }
        } else {
          sameCurrAndPermAddress = (
            <small className={styles.serviceName}>
              court current and permanent address
            </small>
          );
        }

        let legalData = null;
        if (check.status === 'done' && !_.isEmpty(check.result)) {
          if (check.service === 'POLICE_VERIFICATION') {
            legalData = (
              <div className={cx(styles.BgStyle, 'mr-4 mb-3 d-flex flex-row')} style={this.handleBackgroundColor(check.result.clientStatus)}>
                <img src={policeIcon} className={cx('my-auto', styles.imgSize)} alt="" />
                <div className="d-flex flex-column ml-3 my-auto">
                  <span>
                    <small className={styles.serviceName}>police</small>
                    {statusIcon}
                  </span>
                  <div className={styles.caseStatus}>
                    &quot;no record found&quot;
                  </div>
                </div>
              </div>
            );
          } else if (check.service === 'GLOBALDB') {
            legalData = (
              <div className={cx(styles.BgStyle, 'mr-4 mb-3 d-flex flex-row')} style={this.handleBackgroundColor(check.result.clientStatus)}>
                <img src={globaldb} className={cx('my-auto', styles.imgSize)} alt="" />
                <div className="d-flex flex-column ml-3 my-auto">
                  <span>
                    <small className={styles.serviceName}>global database verification</small>
                    {statusIcon}
                  </span>
                  <div className={styles.caseStatus}>
                    &quot;no record found&quot;
                  </div>
                </div>
              </div>
            );
          } else {
            legalData = (
              <div className={cx(styles.BgStyle, 'mr-4 mb-3 d-flex flex-row')} style={this.handleBackgroundColor(check.result.clientStatus)}>
                <img src={court} className={cx('my-auto', styles.imgSize)} alt="" />
                <div className="d-flex flex-column ml-3 my-auto">
                  <span>
                    {sameCurrAndPermAddress}
                    {statusIcon}
                  </span>
                  {!_.isEmpty(check.matched_case_details) ? (
                    <div className={styles.addressText}>
                      {check.matched_case_details[0].matched_address}
                    </div>
                  ) : (
                    <div className={styles.caseStatus}>
                      &quot;no record found&quot;
                    </div>
                  )}
                </div>
              </div>
            );
          }
        } else if (check.service === 'POLICE_VERIFICATION') {
          legalData = (
            <div className={cx(styles.BgStyle, 'mr-4 mb-3 d-flex flex-row')} style={this.handleBackgroundColor('GREY')}>
              <img src={policeIcon} className={cx('my-auto', styles.imgSize)} alt="" />
              <div className="d-flex flex-column ml-3 my-auto">
                <span>
                  <small className={styles.serviceName}>police</small>
                  <img src={inprogress} alt="inprogress" className={cx('ml-1', styles.statusIcon)} />
                </span>
                <div className={styles.caseStatus}>
                  in progress
                </div>
              </div>
            </div>
          );
        } else if (check.service === 'GLOBALDB') {
          legalData = (
            <div className={cx(styles.BgStyle, 'mr-4 mb-3 d-flex flex-row')} style={this.handleBackgroundColor('GREY')}>
              <img src={globaldb} className={cx('my-auto', styles.imgSize)} alt="" />
              <div className="d-flex flex-column ml-3 my-auto">
                <span>
                  <small className={styles.serviceName}>global database verification</small>
                  <img src={inprogress} alt="inprogress" className={cx('ml-1', styles.statusIcon)} />
                </span>
                <div className={styles.caseStatus}>
                  in progress
                </div>
              </div>
            </div>
          );
        } else {
          legalData = (
            <div className={cx(styles.BgStyle, 'mr-4 mb-3 d-flex flex-row')} style={this.handleBackgroundColor('GREY')}>
              <img src={court} className={cx('my-auto', styles.imgSize)} alt="" />
              <div className="d-flex flex-column ml-3 my-auto">
                <span>
                  {sameCurrAndPermAddress}
                  {check.status.toLowerCase() === 'insufficient_info'
                    ? <img src={onhold} alt="onhold" className={cx('ml-1', styles.statusIcon)} />
                    : <img src={inprogress} alt="inprogress" className={cx('ml-1', styles.statusIcon)} />}
                </span>
                {!_.isEmpty(check.matched_case_details) ? (
                  <div className={styles.addressText}>
                    {check.matched_case_details[0].matched_address}
                  </div>
                ) : (
                  <div className={styles.caseStatus}>
                    {!_.isEmpty(check.status) ? check.status.toLowerCase() : ''}
                  </div>
                )}
              </div>
            </div>
          );
        }
        return legalData;
      };

      return (
        (_.isEmpty(crcCurCheck) && _.isEmpty(crcPerCheck) && _.isEmpty(globalDbCheck) && _.isEmpty(policeCheck)) ? '' : (
          <>
            <div className={cx('d-flex flex-column')}>
              <div className="d-flex flex-row">
                <span className={styles.sectionHeading}>legal verification</span>
                &emsp;
                {legalVerificationStatus}
              </div>

              {clientStatus !== platformStatus ? (
                <StatusChangeTab
                  type="legal verification"
                  platformStatus={platformStatus}
                  clientStatus={clientStatus}
                />
              ) : null}

              <div className="d-flex flex-wrap mt-3">
                {!_.isEmpty(crcCurCheck)
                  ? (
                    <div
                      className={cx('col-6 px-0')}
                      role="button"
                      aria-hidden
                      onClick={() => toggleModal(crcCurCheck)}
                    >
                      {legalCard(crcCurCheck)}
                    </div>
                  ) : null}
                {!_.isEmpty(crcPerCheck)
                  ? (
                    <div
                      className={cx('col-6 px-0')}
                      role="button"
                      aria-hidden
                      onClick={() => toggleModal(crcPerCheck)}
                    >
                      {legalCard(crcPerCheck)}
                    </div>
                  ) : ''}
                {!_.isEmpty(globalDbCheck)
                  ? (
                    <div
                      className={cx('col-6 px-0')}
                      role="button"
                      aria-hidden
                      onClick={() => toggleModal(globalDbCheck)}
                    >
                      {legalCard(globalDbCheck)}
                    </div>
                  ) : ''}
                {!_.isEmpty(policeCheck)
                  ? (
                    <div
                      className={cx('col-6 px-0')}
                      role="button"
                      aria-hidden
                      onClick={() => toggleModal(policeCheck)}
                    >
                      {legalCard(policeCheck)}
                    </div>
                  ) : ''}
              </div>
              <hr className={cx('mr-4 mb-4', styles.horizontalLine)} />
            </div>
          </>
        )
      );
    }
}

export default ReportLegal;
