import React, { Component } from 'react';
import cx from 'classnames';
import _ from 'lodash';
import { withRouter } from 'react-router';
import styles from './ReportAddress.module.scss';
// import aadharIcon from '../../../../../assets/icons/aadharIcon.svg';
import redTag from '../../../../../assets/icons/redTag.svg';
import yellowTag from '../../../../../assets/icons/yellowTag.svg';
import greenTag from '../../../../../assets/icons/greenTag.svg';
import inprogressTag from '../../../../../assets/icons/inprogressTag.svg';
import permanentAddress from '../../../../../assets/icons/permanent_address_config_report.svg';
import currentAddress from '../../../../../assets/icons/current_address_config_report.svg';
import onhold from '../../../../../assets/icons/onholdYellow.svg';
import greenCase from '../../../../../assets/icons/greenCase.svg';
import greyCase from '../../../../../assets/icons/greyCase.svg';
import redCase from '../../../../../assets/icons/verifyRed.svg';
import amberCase from '../../../../../assets/icons/verifyYellow.svg';
import inprogress from '../../../../../assets/icons/inprogress.svg';

import StatusChangeTab from '../StatusChangeTab/StatusChangeTab';

class ReportAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currCheck: '',
      perCheck: '',
    };
  }

  componentDidMount() {
    const { bgvData } = this.props;
    let currCheck = ''; let perCheck = '';
    if (!_.isEmpty(bgvData.address)) {
      _.forEach(bgvData.address.checks, (check) => {
        if (check.service === 'CURRENT_ADDRESS' && check.status !== 'missing_info') {
          currCheck = check;
        } else if (check.service === 'PERMANENT_ADDRESS' && check.status !== 'missing_info') {
          perCheck = check;
        }
      });
    }

    this.setState({
      currCheck,
      perCheck,
    });
  }

    handleBackgroundColor = (status) => {
      if (status === 'RED') { return { backgroundColor: '#FDEBEC' }; }
      if (status === 'GREEN') { return { backgroundColor: '#EDF7ED' }; }
      if (status === 'YELLOW') { return { backgroundColor: '#FFF7E5' }; }
      return { backgroundColor: '#F4F7FB' };
    }

    render() {
      const { currCheck, perCheck } = this.state;
      const { bgvData, toggleModal } = this.props;
      const clientStatus = !_.isEmpty(bgvData.address.clientStatus) ? bgvData.address.clientStatus : '';
      const platformStatus = !_.isEmpty(bgvData.address)
      && !_.isEmpty(bgvData.address.platformStatus) ? bgvData.address.platformStatus : '';

      let addressVerificationStatus = <img src={inprogressTag} alt="grey" />;
      if (clientStatus === 'GREEN') addressVerificationStatus = <img src={greenTag} alt="green" />;
      else if (clientStatus === 'YELLOW') addressVerificationStatus = <img src={yellowTag} alt="amber" />;
      else if (clientStatus === 'RED') addressVerificationStatus = <img src={redTag} alt="red" />;

      const card = (check) => {
        let address = '';
        if (check.address) {
          if (!_.isEmpty(check.address.addressLine1)) { address += `${check.address.addressLine1}, `; }
          if (!_.isEmpty(check.address.addressLine2)) { address += `${check.address.addressLine2}, `; }
          if (!_.isEmpty(check.address.landmark)) { address += `${check.address.landmark}, `; }
          if (!_.isEmpty(check.address.city)) { address += `${check.address.city}, `; }
          if (!_.isEmpty(check.address.district)) { address += `${check.address.district}, `; }
          if (!_.isEmpty(check.address.state)) { address += `${check.address.state}, `; }
          if (!_.isEmpty(check.address.pincode)) { address += check.address.pincode; }
        }

        let statusIcon = <img src={greyCase} alt="grey" className={styles.statusIcon} />;
        if (!_.isEmpty(check.result) && check.result.clientStatus === 'GREEN') statusIcon = <img src={greenCase} alt="green" className={styles.statusIcon} />;
        else if (!_.isEmpty(check.result) && check.result.clientStatus === 'YELLOW') statusIcon = <img src={amberCase} alt="amber" className={styles.statusIcon} />;
        else if (!_.isEmpty(check.result) && check.result.clientStatus === 'RED') statusIcon = <img src={redCase} alt="red" className={styles.statusIcon} />;

        let addressData = null;
        if (check.status === 'done' && !_.isEmpty(check.result)) {
          if (check.service === 'CURRENT_ADDRESS') {
            addressData = (
              <div className={cx(styles.BgStyle, 'mr-4 mb-3 d-flex flex-row')} style={this.handleBackgroundColor(check.result.clientStatus)}>
                <img src={currentAddress} className={cx('my-auto', styles.imgSize)} alt="" />
                <div className="d-flex flex-column ml-3 my-auto">
                  <span>
                    <small className={styles.serviceName}>current address</small>
                    {statusIcon}
                  </span>
                  <div className={styles.addressText}>
                    {address}
                  </div>
                </div>
              </div>
            );
          } else {
            addressData = (
              <div className={cx(styles.BgStyle, 'mr-4 mb-3 d-flex flex-row')} style={this.handleBackgroundColor(check.result.clientStatus)}>
                <img src={permanentAddress} className={cx('my-auto', styles.imgSize)} alt="" />
                <div className="d-flex flex-column ml-3 my-auto">
                  <span>
                    <small className={styles.serviceName}>permanent address</small>
                    {statusIcon}
                  </span>
                  <div className={styles.addressText}>
                    {address}
                  </div>
                </div>
              </div>
            );
          }
        } else if (check.service === 'CURRENT_ADDRESS') {
          addressData = (
            <div className={cx(styles.BgStyle, 'mr-4 mb-3 d-flex flex-row')} style={this.handleBackgroundColor('GREY')}>
              <img src={currentAddress} className={cx('my-auto', styles.imgSize)} alt="" />
              <div className="d-flex flex-column ml-3 my-auto">
                <span>
                  <small className={styles.serviceName}>current address</small>
                  {check.status.toLowerCase() === 'insufficient_info'
                    ? <img src={onhold} alt="onhold" className={cx('ml-1', styles.statusIcon)} />
                    : <img src={inprogress} alt="inprogress" className={cx('ml-1', styles.statusIcon)} />}
                </span>
                <div className={styles.addressText}>
                  {address}
                </div>
              </div>
            </div>
          );
        } else {
          addressData = (
            <div className={cx(styles.BgStyle, 'mr-4 mb-3 d-flex flex-row')} style={this.handleBackgroundColor('GREY')}>
              <img src={permanentAddress} className={cx('my-auto', styles.imgSize)} alt="" />
              <div className="d-flex flex-column ml-3 my-auto">
                <span>
                  <small className={styles.serviceName}>permanent address</small>
                  {check.status.toLowerCase() === 'insufficient_info'
                    ? <img src={onhold} alt="onhold" className={cx('ml-1', styles.statusIcon)} />
                    : <img src={inprogress} alt="inprogress" className={cx('ml-1', styles.statusIcon)} />}
                </span>
                <div className={styles.addressText}>
                  {address}
                </div>
              </div>
            </div>
          );
        }
        return addressData;
      };

      return (
        (_.isEmpty(currCheck) && _.isEmpty(perCheck)) ? '' : (
          <>
            <div className={cx('d-flex flex-column')}>
              <div>
                <span className={styles.sectionHeading}>address verification</span>
                &emsp;
                {addressVerificationStatus}
              </div>

              {clientStatus !== platformStatus ? (
                <StatusChangeTab
                  type="address verification"
                  platformStatus={platformStatus}
                  clientStatus={clientStatus}
                />
              ) : null}

              <div className="d-flex flex-wrap mt-3">
                {(!_.isEmpty(perCheck))
                  ? (
                    <div
                      className={cx('col-6 px-0')}
                      role="button"
                      aria-hidden
                      onClick={() => toggleModal(perCheck)}
                    >
                      {card(perCheck)}
                    </div>
                  ) : ''}
                {!_.isEmpty(currCheck)
                  ? (
                    <div
                      className={cx('col-6 px-0')}
                      role="button"
                      aria-hidden
                      onClick={() => toggleModal(currCheck)}
                    >
                      {card(currCheck)}
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

export default withRouter(ReportAddress);
