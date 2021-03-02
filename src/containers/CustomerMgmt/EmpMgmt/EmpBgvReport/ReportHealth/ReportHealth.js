import React, { Component } from 'react';
import _ from 'lodash';
import cx from 'classnames';
import styles from './ReportHealth.module.scss';
import greenCase from '../../../../../assets/icons/greenCase.svg';
import greyCase from '../../../../../assets/icons/greyCase.svg';
import redCase from '../../../../../assets/icons/verifyRed.svg';
import amberCase from '../../../../../assets/icons/verifyYellow.svg';
import health from '../../../../../assets/icons/healthVerify.svg';
import inprogress from '../../../../../assets/icons/inprogress.svg';
import redTag from '../../../../../assets/icons/redTag.svg';
import yellowTag from '../../../../../assets/icons/yellowTag.svg';
import greenTag from '../../../../../assets/icons/greenTag.svg';
import inprogressTag from '../../../../../assets/icons/inprogressTag.svg';

class ReportHealth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      healthCheck: '',
    };
  }

  componentDidMount() {
    const { bgvData } = this.props;
    let healthCheck = '';
    if (!_.isEmpty(bgvData.health)) {
      _.forEach(bgvData.health.checks, (check) => {
        if (check.service === 'HEALTH' && check.status !== 'missing_info') {
          healthCheck = check;
        }
      });
    }
    this.setState({
      healthCheck,
    });
  }

    handleBackgroundColor = (status) => {
      if (status === 'RED') { return { backgroundColor: '#FDEBEC' }; }
      if (status === 'GREEN') { return { backgroundColor: '#EDF7ED' }; }
      if (status === 'YELLOW') { return { backgroundColor: '#FFF7E5' }; }
      return { backgroundColor: '#F4F7FB' };
    }

    render() {
      const { healthCheck } = this.state;
      const { bgvData, toggleModal } = this.props;
      const clientStatus = !_.isEmpty(bgvData.health.clientStatus) ? bgvData.health.clientStatus : 'GREY';

      let healthVerificationStatus = <img src={inprogressTag} alt="grey" />;
      if (clientStatus === 'GREEN') healthVerificationStatus = <img src={greenTag} alt="green" />;
      else if (clientStatus === 'YELLOW') healthVerificationStatus = <img src={yellowTag} alt="amber" />;
      else if (clientStatus === 'RED') healthVerificationStatus = <img src={redTag} alt="red" />;

      const card = (check) => {
        let statusIcon = <img src={greyCase} alt="grey" className={styles.statusIcon} />;
        if (!_.isEmpty(check.result) && check.result.clientStatus === 'GREEN') statusIcon = <img src={greenCase} alt="green" className={styles.statusIcon} />;
        else if (!_.isEmpty(check.result) && check.result.clientStatus === 'YELLOW') statusIcon = <img src={amberCase} alt="amber" className={styles.statusIcon} />;
        else if (!_.isEmpty(check.result) && check.result.clientStatus === 'RED') statusIcon = <img src={redCase} alt="red" className={styles.statusIcon} />;
        return (
          check.status === 'done' && !_.isEmpty(check.result)
            ? (
              <div className={cx(styles.BgStyle, 'mr-4 mb-3 d-flex flex-row')} style={this.handleBackgroundColor(check.result.clientStatus)}>
                <img src={health} className={cx('my-auto', styles.imgSize)} alt="img" />
                <div className="d-flex flex-column ml-3 my-auto">
                  <span>
                    <small className={styles.serviceName}>
                      {check.service.toLowerCase()}
                      {' '}
                    </small>
                    {statusIcon}
                  </span>
                  <div className={styles.caseStatus}>
                    &quot;
                    {!_.isEmpty(check.result.comments) ? check.result.comments[0] : 'record found'}
                    &quot;
                  </div>
                </div>
              </div>
            ) : (
              <div className={cx(styles.BgStyle, 'mr-4 mb-3 d-flex flex-row')} style={this.handleBackgroundColor('GREY')}>
                <img src={health} className={cx('my-auto', styles.imgSize)} alt="img" />
                <div className="d-flex flex-column ml-3 my-auto">
                  <span>
                    <small className={styles.serviceName}>
                      {check.service.toLowerCase()}
                      {' '}
                    </small>
                    <img src={inprogress} alt="inprogress" className={styles.statusIcon} />
                  </span>
                  <div className={styles.caseStatus}>
                    in progress
                  </div>
                </div>
              </div>
            )
        );
      };
      return (
        (_.isEmpty(healthCheck)) ? null : (
          <>
            <div className={cx('d-flex flex-column')}>
              <div className="d-flex flex-row">
                <span className={styles.sectionHeading}>health verification</span>
                &emsp;
                {healthVerificationStatus}
              </div>
              <div className="d-flex flex-wrap mt-3">
                {!_.isEmpty(healthCheck)
                  ? (
                    <div
                      className={cx('col-6 px-0')}
                      role="button"
                      aria-hidden
                      onClick={() => toggleModal(healthCheck)}
                    >
                      {card(healthCheck)}
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

export default ReportHealth;
