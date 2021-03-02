/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-nested-ternary */
/* eslint-disable arrow-body-style */
import React from 'react';

import { connect } from 'react-redux';
import cx from 'classnames';
import _ from 'lodash';
import { Button } from 'react-crux';
import * as actions from '../Store/action';

import styles from './NotificationContent.module.scss';
import assign from '../../../../assets/icons/initiateActive.svg';
import CircularProgressBar from '../../../../components/Molecule/CircularProgressBar/CircularProgressBar';

const EmpDeployment = (props) => {
  const { data } = props.data;

  return (
    <div className={cx(styles.background, 'row mx-0 px-0')}>
      <div className={styles.circleProgressAlign}>
        {props.state === 'error' ? (
          <CircularProgressBar
            type="progress"
            percentValue={100}
            centerImage={assign}
            status={props.state}
          />
        ) : (
          <CircularProgressBar
            type="progress"
            percentValue={props.progressData.percent}
            centerImage={assign}
            status={props.state}
          />
        )}
      </div>
      {props.state === 'inProgress' ? (
        <div className={styles.maxWidth}>
          <div className={cx(styles.headingLarge)}>
            employee deployment is in progress
          </div>
          <div className={cx(styles.textProgress, 'mt-2')}>
            deployment for
            {' '}
            {props.progressData.success ? props.progressData.success : 0}
            /
            {props.progressData.total}
            {' '}
            selected employees is in progress...
          </div>
        </div>
      ) : props.state === 'success' ? (
        <>
          <div className={styles.maxWidth}>
            <div className={cx(styles.headingLarge)}>
              employee deployment successful
            </div>
            <div className={cx(styles.textSuccess, 'mt-2')}>
              {props.progressData.success ? props.progressData.success : 0}
              /
              {props.progressData.total}
              {' '}
              selected employees are successfully deployed
              {' '}
              {!_.isEmpty(data)
                ? !_.isEmpty(data.superClient)
                  ? `to principal employer ${data.superClient.name}`
                  : !_.isEmpty(data.client) ? `to client ${data.client.name}` : ''
                : ''}

            </div>
          </div>
          <div className="ml-auto mt-5">
            <Button
              label="close"
              clickHandler={() => props.onCloseNotification(
                props.orgId,
                props.data._id,
                props.data.name,
              )}
              type="save"
            />
          </div>
        </>
      ) : (
        <>
          <div className={styles.maxWidth}>
            <div className={cx(styles.headingLarge)}>
              employee deployment failed !
            </div>
            <div className={cx(styles.textError, 'mt-2')}>
              deployment for
              {' '}
              {props.progressData.error}
              /
              {props.progressData.total}
              {' '}
              employees has been failed !
            </div>
          </div>
          <div className="ml-auto mt-5">
            <Button
              label="close"
              clickHandler={() => props.onCloseNotification(
                props.orgId,
                props.data._id,
                props.data.name,
              )}
              type="save"
            />
          </div>
        </>
      )}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCloseNotification: (orgId, id, name) => dispatch(actions.closeNotification(orgId, id, name)),
  };
};

export default connect(null, mapDispatchToProps)(EmpDeployment);
