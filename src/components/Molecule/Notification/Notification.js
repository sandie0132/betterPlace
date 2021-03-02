/* eslint-disable react/no-did-update-set-state */
/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import cx from 'classnames';
import _ from 'lodash';
import styles from './Notification.module.scss';
import Loader from '../../Organism/Loader/Loader';

import autosave from '../../../assets/icons/autosaveIcon.svg';
import success from '../../../assets/icons/greenSmalltick.svg';
import warning from '../../../assets/icons/redSmallWarning.svg';
import doubleTick from '../../../assets/icons/doubleTickGreen.svg';
import info from '../../../assets/icons/infoMid.svg';

class AutosaveMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: '',
      message: '',
    };
  }

  componentDidMount() {
    const { type, message } = this.props;
    let updatedType = '';
    let updatedMessage = '';
    if (!_.isEmpty(type)) {
      updatedType = type;
    }

    if (!_.isEmpty(message)) {
      updatedMessage = message;
    }
    this.setState({ type: updatedType, message: updatedMessage });
  }

  componentDidUpdate(prevProps) {
    const { type, message } = this.props;
    if (type !== prevProps.type && !_.isEmpty(type)) {
      this.setState({ type });
    }

    if (message !== prevProps.message && !_.isEmpty(message)) {
      this.setState({ message });
    }
  }

  render() {
    const { type, message } = this.state;
    return (

      type === 'success' ? (
        <div className={styles.notificationContainer}>
          <div className="d-flex flex-row" style={{ marginLeft: '0.5rem' }}>
            <img src={success} alt="success_icon" />
            <label htmlFor={message} className={cx(styles.notificationText, 'mb-0')} style={{ marginLeft: '8px' }}>
              {message}
            </label>
          </div>

        </div>
      )

        : type === 'warning' ? (
          <div className={styles.notificationContainer}>
            <div className="d-flex flex-row" style={{ marginLeft: '0.5rem' }}>
              <img src={warning} alt="warning_icon" />
              <label htmlFor={message} className={cx(styles.notificationText, 'mb-0')} style={{ marginLeft: '8px' }}>
                {message}
              </label>
            </div>

          </div>
        )

          : type === 'info' ? (
            <div className={styles.notificationContainer}>
              <div className="d-flex flex-row" style={{ marginLeft: '0.5rem' }}>
                <img src={info} alt="autosave_icon" />
                <label htmlFor={message} className={cx(styles.autosaveText, 'mb-0')} style={{ marginLeft: '8px', marginTop: '1px' }}>
                  {message}
                </label>
              </div>
            </div>

          )

            : type === 'inprogress' ? (
              <div className={styles.notificationContainer}>
                <div className="d-flex flex-row position-relative" style={{ marginLeft: '0.5rem' }}>
                  <div style={{ position: 'absolute', left: '-27px', top: '-46px' }}>
                    <Loader type="stepLoaderMid" />
                  </div>
                  <label htmlFor={message} className={cx(styles.notificationText, 'mb-0')} style={{ marginLeft: '2.5rem' }}>
                    {message}
                  </label>
                </div>

              </div>
            )
              : type === 'done' ? (
                <div className={styles.notificationContainer}>
                  <div className="d-flex flex-row" style={{ marginLeft: '0.5rem' }}>
                    <img src={doubleTick} alt="completed" />
                    <label htmlFor={message} className={cx(styles.notificationText, 'mb-0')} style={{ marginLeft: '8px', marginTop: '2px' }}>
                      {message}
                    </label>
                  </div>

                </div>
              )

                : (
                  <div className={styles.notificationContainer}>
                    <div className="d-flex flex-row" style={{ marginLeft: '0.5rem' }}>
                      <img src={autosave} alt="autosave_icon" />
                      <label htmlFor={message} className={cx(styles.autosaveText, 'mb-0')} style={{ marginLeft: '8px', marginTop: '1px' }}>
                        {message}
                      </label>
                    </div>

                  </div>
                )

    );
  }
}

export default AutosaveMessage;
