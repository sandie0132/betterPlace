import React, { Component } from 'react';
import cx from 'classnames';
import { withRouter } from 'react-router';
import _ from 'lodash';
import styles from './ReportDocuments.module.scss';

import greyCase from '../../../../../assets/icons/greyCase.svg';
import greenCase from '../../../../../assets/icons/greenCase.svg';
import redCase from '../../../../../assets/icons/verifyRed.svg';
import amberCase from '../../../../../assets/icons/yellow.svg';
import aadhaar from '../../../../../assets/icons/aadhar.svg';
import voter from '../../../../../assets/icons/voter.svg';
import pan from '../../../../../assets/icons/pan.svg';
import dl from '../../../../../assets/icons/driving.svg';
import rc from '../../../../../assets/icons/rcSmallIcon.svg';
import inprogress from '../../../../../assets/icons/inprogress.svg';
import redTag from '../../../../../assets/icons/redTag.svg';
import yellowTag from '../../../../../assets/icons/yellowTag.svg';
import greenTag from '../../../../../assets/icons/greenTag.svg';
import inprogressTag from '../../../../../assets/icons/inprogressTag.svg';

import StatusChangeTab from '../StatusChangeTab/StatusChangeTab';

class ReportDocuments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      panCheck: '',
      aadhaarCheck: '',
      dlCheck: '',
      rcCheck: '',
      voterCheck: '',
    };
  }

  componentDidMount = () => {
    const { bgvData } = this.props;
    let panCheck = ''; let aadhaarCheck = ''; let dlCheck = ''; let rcCheck = '';
    let voterCheck = '';
    _.forEach(bgvData.idcards.checks, (check) => {
      if (check.service === 'PAN' && check.status !== 'missing_info') {
        panCheck = check;
      } else if (check.service === 'AADHAAR' && check.status !== 'missing_info') {
        aadhaarCheck = check;
      } else if (check.service === 'DL' && check.status !== 'missing_info') {
        dlCheck = check;
      } else if (check.service === 'RC' && check.status !== 'missing_info') {
        rcCheck = check;
      } else if (check.service === 'VOTER' && check.status !== 'missing_info') {
        voterCheck = check;
      }
    });
    this.setState({
      panCheck,
      dlCheck,
      rcCheck,
      aadhaarCheck,
      voterCheck,
    });
  }

    handleBackgroundColor = (status) => {
      if (status === 'RED') { return { backgroundColor: '#FDEBEC' }; }
      if (status === 'GREEN') { return { backgroundColor: '#EDF7ED' }; }
      if (status === 'YELLOW') { return { backgroundColor: '#FFF7E5' }; }
      return { backgroundColor: '#F4F7FB' };
    }

    render() {
      const { bgvData, toggleModal } = this.props;
      const {
        panCheck, voterCheck, aadhaarCheck, rcCheck, dlCheck,
      } = this.state;
      const clientStatus = !_.isEmpty(bgvData.idcards) && !_.isEmpty(bgvData.idcards.clientStatus)
        ? bgvData.idcards.clientStatus : '';
      const platformStatus = !_.isEmpty(bgvData.idcards)
      && !_.isEmpty(bgvData.idcards.platformStatus) ? bgvData.idcards.platformStatus : '';

      let docVerificationStatus = <img src={inprogressTag} alt="grey" />;
      if (clientStatus === 'GREEN') docVerificationStatus = <img src={greenTag} alt="green" />;
      else if (clientStatus === 'YELLOW') docVerificationStatus = <img src={yellowTag} alt="amber" />;
      else if (clientStatus === 'RED') docVerificationStatus = <img src={redTag} alt="red" />;

      const idCard = (check) => {
        let idIcon = null;
        if (check.service === 'PAN') idIcon = <img className={cx('my-auto', styles.imgSize)} src={pan} alt="" />;
        else if (check.service === 'AADHAAR') idIcon = <img className={cx('my-auto', styles.imgSize)} src={aadhaar} alt="" />;
        else if (check.service === 'VOTER') idIcon = <img className={cx('my-auto', styles.imgSize)} src={voter} alt="" />;
        if (check.service === 'DL') idIcon = <img className={cx('my-auto', styles.imgSize)} src={dl} alt="" />;
        if (check.service === 'RC') idIcon = <img className={cx('my-auto', styles.imgSize)} src={rc} alt="" />;

        let statusIcon = <img src={greyCase} alt="grey" className={styles.statusIcon} />;
        if (!_.isEmpty(check.result) && check.result.clientStatus === 'GREEN') statusIcon = <img src={greenCase} alt="green" className={styles.statusIcon} />;
        else if (!_.isEmpty(check.result) && check.result.clientStatus === 'YELLOW') statusIcon = <img src={amberCase} alt="amber" className={styles.statusIcon} />;
        else if (!_.isEmpty(check.result) && check.result.clientStatus === 'RED') statusIcon = <img src={redCase} alt="red" className={styles.statusIcon} />;

        return (
          check.status === 'done' && !_.isEmpty(check.result)
            ? (
              <div className={cx(styles.BgStyle, 'mr-4 mb-3 d-flex flex-row')} style={this.handleBackgroundColor(check.result.clientStatus)}>
                {idIcon}
                <div className="d-flex flex-column ml-3 my-auto">
                  <span>
                    <small className={styles.serviceName}>
                      {' '}
                      {check.service.toLowerCase()}
                      {' '}
                    </small>
                    {statusIcon}
                  </span>
                  <div className={styles.docNumber}>
                    {check.doc.documentNumber}
                  </div>
                </div>
              </div>
            )
            : (
              <div className={cx(styles.BgStyle, 'mr-4 mb-3 d-flex flex-row')} style={this.handleBackgroundColor('GREY')}>
                {idIcon}
                <div className="d-flex flex-column ml-3 my-auto">
                  <span>
                    <small className={styles.serviceName}>
                      {check.service.toLowerCase()}
                      {' '}
                    </small>
                    <img src={inprogress} alt="inprogress" className={styles.statusIcon} />
                  </span>
                  <div className={styles.docNumber}>
                    {check.doc.documentNumber}
                  </div>
                </div>
              </div>
            )
        );
      };
      return (
        (_.isEmpty(panCheck) && _.isEmpty(voterCheck) && _.isEmpty(aadhaarCheck) && _.isEmpty(dlCheck) && _.isEmpty(rcCheck)) ? '' : (
          <>
            <div className={cx('d-flex flex-column')}>
              <div>
                <span className={styles.sectionHeading}>id verification</span>
                &emsp;
                {docVerificationStatus}
              </div>

              {/* changed status if any */}
              {clientStatus !== platformStatus ? (
                <StatusChangeTab
                  type="id verification"
                  platformStatus={platformStatus}
                  clientStatus={clientStatus}
                />
              ) : null}

              <div className="d-flex flex-wrap mt-3">
                {!_.isEmpty(aadhaarCheck)
                  ? (
                    <div
                      className={cx('col-lg-4 col-md-6 col-sm-6 col-xs-6 px-0')}
                      role="button"
                      aria-hidden
                      onClick={() => toggleModal(aadhaarCheck)}
                    >
                      {idCard(aadhaarCheck)}
                    </div>
                  )
                  : ''}
                {!_.isEmpty(panCheck)
                  ? (
                    <div
                      className={cx('col-lg-4 col-md-6 col-sm-6 col-xs-6 px-0')}
                      role="button"
                      aria-hidden
                      onClick={() => toggleModal(panCheck)}
                    >
                      {idCard(panCheck)}
                    </div>
                  )
                  : ''}
                {!_.isEmpty(dlCheck)
                  ? (
                    <div
                      className={cx('col-lg-4 col-md-6 col-sm-6 col-xs-6 px-0')}
                      role="button"
                      aria-hidden
                      onClick={() => toggleModal(dlCheck)}
                    >
                      {idCard(dlCheck)}
                    </div>
                  )
                  : ''}
                {!_.isEmpty(voterCheck)
                  ? (
                    <div
                      className={cx('col-lg-4 col-md-6 col-sm-6 col-xs-6 px-0')}
                      role="button"
                      aria-hidden
                      onClick={() => toggleModal(voterCheck)}
                    >
                      {idCard(voterCheck)}
                    </div>
                  )
                  : ''}
                {!_.isEmpty(rcCheck)
                  ? (
                    <div
                      className={cx('col-lg-4 col-md-6 col-sm-6 col-xs-6 px-0')}
                      role="button"
                      aria-hidden
                      onClick={() => toggleModal(rcCheck)}
                    >
                      {idCard(rcCheck)}
                    </div>
                  )
                  : ''}
              </div>
              <hr className={cx('mr-4 mb-4', styles.horizontalLine)} />
            </div>
          </>
        )
      );
    }
}

export default withRouter(ReportDocuments);
