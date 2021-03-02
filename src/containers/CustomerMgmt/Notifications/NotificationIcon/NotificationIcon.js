/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../Store/action';

import bellIcon from '../../../../assets/icons/bell.svg';
import arrowDown from '../../../../assets/icons/greyDropdown.svg';
import arrowUp from '../../../../assets/icons/downArrow.svg';
import styles from './NotificationIcon.module.scss';
import loader from '../../../../assets/icons/lineLoader.gif';

/**
 * Notification Icon to show notifications
 * @orgId {string} orgId for getting notification list
 * @query {object} object containing query params to filter notification list
 * @showNotifications {boolean} show hide notification cards
 * @handleShowHideNotifications {function} function to show/hide notifications
 * @alignProgress {string} css class for progress alignment
 */

class NotificationIcon extends Component {
  componentDidMount() {
    const { orgId, query } = this.props;
    if (!_.isEmpty(orgId)) {
      this.props.onGetNotificationList(orgId, query);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.orgId !== this.props.orgId) {
      this.props.onGetNotificationList(this.props.orgId, this.props.product);
    }
    if (!_.isEqual(prevProps.notificationList, this.props.notificationList)) {
      if (this.props.notificationList.length === 0) {
        this.props.handleShowHideNotifications(false);
      }
    }
  }

    handleShowInProgressAnimation = () => {
      let showAnimation = false;
      _.forEach(this.props.notificationList, (notification) => {
        if (!_.isEmpty(notification.reqType)) {
          if (notification.reqType === 'DOWNLOAD_DATA') {
            if (!_.isEmpty(notification.data) && notification.data.status === 'inProgress') {
              showAnimation = true;
            }
          } else if (notification.reqType === 'PROCESS_DATA') {
            if (!_.isEmpty(notification.data) && !_.isEmpty(notification.data.empIds)) {
              showAnimation = true;
            }
          }
        }
      });
      return showAnimation;
    }

    render() {
      return (
        <>
          <div
            className={cx(this.props.showNotifications ? styles.notificationBellActive
              : styles.NotificationBell)}
            disabled={this.props.notificationList.length === 0}
            onClick={() => this.props.handleShowHideNotifications(!this.props.showNotifications)}
          >
            <div className={cx('row no-gutters')}>
              <img className={styles.BellIcon} src={bellIcon} alt="img" />
              <div className={this.props.notificationList.length === 0
                ? styles.NotificationCountZero
                : styles.NotificationCount}
              >
                <span className={this.props.bellIconContent}>
                  {this.props.notificationList.length}
                </span>
              </div>
              <img className="ml-1 mt-1" src={this.props.showNotifications ? arrowUp : arrowDown} alt="img" />
            </div>
            <div className={this.props.alignProgress}>
              {
                this.handleShowInProgressAnimation() ? <img src={loader} alt="img" style={{ marginTop: '-10px' }} /> : null
              }
            </div>

          </div>

        </>
      );
    }
}

const mapStateToProps = (state) => ({
  notificationList: state.notifications.notificationList,
});

const mapDispatchToProps = (dispatch) => ({
  onGetNotificationList: (orgId, query) => dispatch(actions.getNotificationList(orgId, query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationIcon);
