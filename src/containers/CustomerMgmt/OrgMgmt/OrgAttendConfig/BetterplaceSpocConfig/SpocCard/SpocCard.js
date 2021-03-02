/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import cx from 'classnames';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import styles from './SpocCard.module.scss';
import cross from '../../../../../../assets/icons/closeNotification.svg';
import spocClose from '../../../../../../assets/icons/redCross.svg';
import spocAdd from '../../../../../../assets/icons/bluePlus.svg';
import role from '../../../../../../assets/icons/defaultRole.svg';
import locTag from '../../../../../../assets/icons/defaultLocation.svg';
import spocBackground from '../../../../../../assets/icons/spocBackground.svg';
import vendorPhone from '../../../../../../assets/icons/vendorPhone.svg';
import vendorMail from '../../../../../../assets/icons/vendorMail.svg';
import * as imageStoreActions from '../../../../../Home/Store/action';

class SpocCard extends Component {
  componentDidMount() {
    const { profilePicUrl, onGetProfilePic, empId } = this.props;
    if (profilePicUrl) {
      onGetProfilePic(empId, profilePicUrl);
    }
  }

  render() {
    const {
      profilePicUrl, images, className, name, reportingManager, changed, empId, isDisabled,
      isChecked, orgName, employeeId, designation, locationTag, phoneNumber, emailId,
    } = this.props;
    return (
      <div className={cx('pl-3 pr-2 mb-3', styles.SpocCard)}>
        <div className="row no-gutters d-flex">

          <div className="col-2">
            <img
              className={cx(styles.Image)}
              src={profilePicUrl
                ? (images[empId]
                  ? images[empId].image : null)
                : spocBackground}
              alt=""
            />
          </div>

          <div className={cx('pl-3 col-10', className)}>
            <div className="d-flex flex-row justify-content-between">
              <span className={cx(styles.Name)}>{name}</span>
              <span>
                {reportingManager ? null
                  : (
                    <input
                      type="radio"
                      className={styles.RadioButton}
                      onChange={changed}
                      disabled={isDisabled}
                    />
                  )}
                {isDisabled ? null
                  : (
                    <img
                      className={styles.Cross}
                      src={reportingManager && isChecked
                        ? cross : isChecked ? spocClose : spocAdd}
                      alt=""
                      onClick={changed}
                    />
                  )}
              </span>
            </div>

            {reportingManager
              ? (
                <span className="row d-flex no-gutters">
                  <span className={cx(styles.Details)}>
                    {orgName}
                    {employeeId ? (` | ${employeeId}`) : ''}
                  </span>
                </span>
              )
              : (
                <span className="row d-flex no-gutters">
                  <span className={cx(styles.Details)}>{designation}</span>
                </span>
              )}

            {reportingManager
              ? (
                <span className="row no-gutters justify-content-space-around">
                  <span className="row no-gutters">
                    <img src={role} alt="" />
                    <span className={cx('pl-1 pr-2', styles.Details)}>{designation}</span>
                  </span>
                  <span className="row no-gutters">
                    <img src={locTag} alt="" />
                    <span className={cx('pl-1', styles.Details)}>{locationTag}</span>
                  </span>
                </span>
              )
              : null}

            {phoneNumber
              ? (
                <span className="row d-flex no-gutters">
                  <img src={vendorPhone} className="pr-2" alt="" />
                  <span className={cx('pl-1', styles.Details)}>{phoneNumber}</span>
                </span>
              ) : null}

            {emailId
              ? (
                <span className="row d-flex no-gutters">
                  <img src={vendorMail} className={cx('pr-2 mt-1', styles.emailSize)} alt="" />
                  <span className={cx(styles.Details)}>{emailId}</span>
                </span>
              ) : null}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  images: state.imageStore.images,
});

const mapDispatchToProps = (dispatch) => ({
  onGetProfilePic: (empId, filePath) => dispatch(imageStoreActions.getProfilePic(empId, filePath)),
});

export default (withRouter(connect(mapStateToProps, mapDispatchToProps)(SpocCard)));
