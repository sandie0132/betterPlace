/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import cx from 'classnames';
import _ from 'lodash';
import { connect } from 'react-redux';

import NotificationIcon from './NotificationIcon/NotificationIcon';
import NotificationContent from './NotificationContent/NotificationContent';

import styles from './Notifications.module.scss';
import left from '../../../assets/icons/left.svg';
import right from '../../../assets/icons/right.svg';

class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentNotification: null,
    };
  }

  componentDidMount() {
    this.handlePropsToState();
  }

  componentDidUpdate(prevProps) {
    const { notificationList } = this.props;
    if (!_.isEqual(prevProps.notificationList, notificationList)) {
      this.handlePropsToState();
    }
  }

    handlePropsToState = () => {
      const { notificationList } = this.props;
      if (notificationList.length === 0) {
        this.setState({
          currentNotification: null,
        });
      } else {
        this.setState({
          currentNotification: 0,
        });
      }
    }

    handleNotificationPagination = (arrow) => {
      const { currentNotification } = this.state;
      const { notificationList } = this.props;
      let count = currentNotification;
      if (arrow === 'right' && count < notificationList.length - 1) {
        count += 1;
      } else if (count > 0 && arrow === 'left') {
        count -= 1;
      }
      this.setState({ currentNotification: count });
    }

    render() {
      const { orgId, notificationList } = this.props;
      const { currentNotification } = this.state;
      return (
        <>
          {
                    (notificationList.length !== 0)
                    && (currentNotification !== null)
                     && !_.isEmpty(notificationList[currentNotification])
                      ? (
                        <div className={cx(styles.NotificationCard, 'row ')}>
                          <div className="w-100">
                            <NotificationContent
                              name={
                                notificationList[currentNotification].name
                              }
                              dataProp={notificationList[currentNotification]}
                              orgId={orgId}
                            />
                          </div>
                          <div className={styles.absoluteRight}>
                            <img src={left} alt="left" className={cx('ml-auto', styles.PaginatorArrow)} onKeyPress={() => this.handleNotificationPagination('left')} onClick={() => this.handleNotificationPagination('left')} />
                            <span className={styles.PageCount}>
                              {' '}
                              {currentNotification + 1}
                              {' '}
                              of
                              {' '}
                              {notificationList.length}
                            </span>
                            <img src={right} alt="right" className={styles.PaginatorArrow} onKeyPress={() => this.handleNotificationPagination('right')} onClick={() => this.handleNotificationPagination('right')} />
                          </div>
                        </div>
                      )
                      : null

                }
        </>
      );
    }
}

const mapStateToProps = (state) => ({
  notificationList: state.notifications.notificationList,
});

export default (connect(mapStateToProps, null)(Notifications));
export { NotificationIcon };
