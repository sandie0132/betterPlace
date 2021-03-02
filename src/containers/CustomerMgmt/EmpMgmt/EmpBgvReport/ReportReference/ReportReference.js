import React, { Component } from 'react';
import _ from 'lodash';
import cx from 'classnames';
import styles from './ReportReference.module.scss';
import greenCase from '../../../../../assets/icons/greenCase.svg';
import greyCase from '../../../../../assets/icons/greyCase.svg';
import redCase from '../../../../../assets/icons/verifyRed.svg';
import amberCase from '../../../../../assets/icons/verifyYellow.svg';
import reference from '../../../../../assets/icons/reference.svg';
import inprogress from '../../../../../assets/icons/inprogress.svg';
import redTag from '../../../../../assets/icons/redTag.svg';
import yellowTag from '../../../../../assets/icons/yellowTag.svg';
import greenTag from '../../../../../assets/icons/greenTag.svg';
import inprogressTag from '../../../../../assets/icons/inprogressTag.svg';

class ReportHealth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      referenceArray: [],
      referenceCheck: [],
    };
  }

  componentDidMount() {
    const { bgvData } = this.props;
    const referenceCheck = [];
    const referenceArray = [];
    if (!_.isEmpty(bgvData.reference)) {
      _.forEach(bgvData.reference.checks, (check) => {
        if (check.service === 'REFERENCE' && check.status !== 'missing_info') {
          referenceCheck.push(check);
        }
      });
      if (!_.isEmpty(referenceCheck)) {
        _.forEach(referenceCheck, (set) => {
          if (set.status === 'done') {
            referenceArray.push(set.reference.relationship);
          }
          if (referenceArray.length < 2) {
            if (set.status === 'inProgress') {
              referenceArray.push(set.reference.relationship);
            }
          }
        });
      }
    }
    this.setState({
      referenceCheck,
      referenceArray,
    });
  }

    handleBackgroundColor = (status) => {
      if (status === 'RED') { return { backgroundColor: '#FDEBEC' }; }
      if (status === 'GREEN') { return { backgroundColor: '#EDF7ED' }; }
      if (status === 'YELLOW') { return { backgroundColor: '#FFF7E5' }; }
      return { backgroundColor: '#F4F7FB' };
    }

    render() {
      const { referenceArray, referenceCheck } = this.state;
      const { bgvData, toggleModal } = this.props;
      const clientStatus = !_.isEmpty(bgvData.reference.clientStatus) ? bgvData.reference.clientStatus : 'GREY';

      let referenceVerificationStatus = <img src={inprogressTag} alt="grey" />;
      if (clientStatus === 'GREEN') referenceVerificationStatus = <img src={greenTag} alt="green" />;
      else if (clientStatus === 'YELLOW') referenceVerificationStatus = <img src={yellowTag} alt="amber" />;
      else if (clientStatus === 'RED') referenceVerificationStatus = <img src={redTag} alt="red" />;

      const card = (check) => {
        let statusIcon = <img src={greyCase} alt="grey" className={styles.statusIcon} />;
        if (!_.isEmpty(check.result) && check.result.clientStatus === 'GREEN') statusIcon = <img src={greenCase} alt="green" className={styles.statusIcon} />;
        else if (!_.isEmpty(check.result) && check.result.clientStatus === 'YELLOW') statusIcon = <img src={amberCase} alt="amber" className={styles.statusIcon} />;
        else if (!_.isEmpty(check.result) && check.result.clientStatus === 'RED') statusIcon = <img src={redCase} alt="red" className={styles.statusIcon} />;
        return (
          check.status === 'done' && !_.isEmpty(check.result)
            ? (
              <div className={cx(styles.BgStyle, 'mr-4 mb-3 d-flex flex-row')} style={this.handleBackgroundColor(check.result.clientStatus)}>
                <img src={reference} className={cx('my-auto', styles.imgSize)} alt="img" />
                <div className="d-flex flex-column ml-3 my-auto">
                  <span>
                    <small className={styles.serviceName}>
                      {check.service.toLowerCase()}
                      {' '}
                    </small>
                    {statusIcon}
                  </span>
                  {!_.isEmpty(referenceArray) ? (
                    <div className={styles.addressText}>
                      {referenceArray[0].toLowerCase()}
                      ,
                      {referenceArray.length > 1 ? referenceArray[1].toLowerCase() : ''}
                      {referenceCheck.length > 2 ? (
                        <span>
                          {' '}
                          , +
                          {referenceArray.length - 2}
                          {' '}
                          more...
                        </span>
                      ) : ''}
                    </div>
                  ) : ''}
                  <div className={styles.caseStatus}>
                    &quot;
                    {!_.isEmpty(referenceCheck[0].result.comments) ? referenceCheck[0].result.comments[0] : 'record found'}
                    &quot;
                  </div>
                </div>
              </div>
            ) : (
              <div className={cx(styles.BgStyle, 'mr-4 mb-3 d-flex flex-row')} style={this.handleBackgroundColor('GREY')}>
                <img src={reference} className={cx('my-auto', styles.imgSize)} alt="img" />
                <div className="d-flex flex-column ml-3 my-auto">
                  <span>
                    <small className={styles.serviceName}>
                      {check.service.toLowerCase()}
                      {' '}
                    </small>
                    <img src={inprogress} alt="inprogress" className={styles.statusIcon} />
                  </span>
                  {!_.isEmpty(referenceArray) ? (
                    <div className={styles.addressText}>
                      {referenceArray[0].toLowerCase()}
                      {' '}
                      {referenceArray.length > 1 ? (
                        <span>
                          ,
                          {referenceArray[1].toLowerCase()}
                        </span>
                      ) : ''}
                      {referenceCheck.length > 2 ? (
                        <span>
                          , +
                          {referenceCheck.length - 2}
                          {' '}
                          more...
                        </span>
                      ) : ''}
                    </div>
                  ) : ''}
                  <div className={styles.caseStatus}>
                    in progress
                  </div>
                </div>
              </div>
            )
        );
      };
      return (
        (_.isEmpty(referenceCheck)) ? null : (
          <>
            <div className={cx('d-flex flex-column ')}>
              <div className="d-flex flex-row">
                <span className={styles.sectionHeading}>reference verification</span>
                      &emsp;
                {referenceVerificationStatus}
              </div>
              <div className="d-flex flex-wrap mt-3">
                {!_.isEmpty(referenceCheck)
                  ? (
                    <div
                      className={cx('col-6 px-0')}
                      role="button"
                      aria-hidden
                      onClick={() => toggleModal(referenceCheck[0])}
                    >
                      {card(referenceCheck[0])}
                    </div>
                  ) : null}
              </div>
            </div>
          </>
        )
      );
    }
}

export default ReportHealth;
