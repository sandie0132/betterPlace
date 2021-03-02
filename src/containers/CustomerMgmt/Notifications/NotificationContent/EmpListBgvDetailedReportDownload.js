/* eslint-disable max-len */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import { Button } from 'react-crux';
import styles from './NotificationContent.module.scss';

import excel from '../../../../assets/icons/excelIcon.svg';
import CircularProgressBar from '../../../../components/Molecule/CircularProgressBar/CircularProgressBar';
import DownloadButton from '../../../../components/Atom/DownloadButton/DownloadButton';
import * as actions from '../Store/action';

const EmpListBgvDetailedReportDownload = (props) => {
  useEffect(() => {
    if (props.downloadBgvReportFileState === 'SUCCESS') {
      props.onCloseNotification(props.orgId, props.data._id);
    }
  }, // eslint-disable-next-line
  [props.downloadBgvReportFileState]);
  return (
  <div className={cx(styles.background, 'row mx-0 px-0')}>
    <div className={styles.circleProgressAlign}>
      {props.data.data.status === 'inProgress' ? (
        <CircularProgressBar
          type="loading"
          centerImage={excel}
        />
      )
        : props.data.data.status === 'success' ? (
          <CircularProgressBar
            type="progress"
            percentValue={100}
            centerImage={excel}
            status="success"
          />
        )
          : (
            <CircularProgressBar
              type="progress"
              percentValue={100}
              centerImage={excel}
              status="error"
            />
          )}
    </div>
    {
                props.data.data.status === 'inProgress' ? (
                  <div className={styles.maxWidth}>
                    <div className={cx(styles.headingLarge)}>bgv detailed report generation is in progress</div>
                    <div className={cx(styles.textProgress, 'mt-2')}>
                      bgv detailed report generation for
                      {' '}
                      {props.progressData.total}
                      {' '}
                      employee profiles is in progress
                    </div>
                  </div>
                )
                  : props.data.data.status === 'success' ? (
                    <>
                      <div className={styles.maxWidth}>
                        <div className={cx(styles.headingLarge)}>bgv detailed report generation has been successfull</div>
                        <div className={cx(styles.textSuccess, 'mt-2')}>
                          bgv detailed report generation has been completed for
                          {' '}
                          {props.progressData.total}
                          {' '}
                          profiles, download from here
                        </div>
                      </div>
                      <div className="ml-auto mt-5">
                        <DownloadButton
                          type="onboaardMgmtDocument"
                          label="download"
                          clickHandler={props.downloadBgvReportFileState === 'LOADING' ? null : () => props.onDownloadBgvReport(props.orgId, props.data._id, props.data.data.downloadURL, 'verify_detailed_report')}
                          downloadState={props.downloadBgvReportFileState}
                        />
                      </div>
                    </>
                  )
                    : (
                      <>
                        <div className={styles.maxWidth}>
                          <div className={cx(styles.headingLarge)}>Bgv Detailed Report generation failed !</div>
                          <div className={cx(styles.textError, 'mt-2')}>
                            bgv detailed report generation for
                            {' '}
{props.progressData.total}
                            {' '}
                            employee profiles has been failed !
                          </div>
                        </div>
                        <div className="ml-auto mt-5">
                          <Button
                            label="close"
                            clickHandler={() => props.onCloseNotification(props.orgId, props.data._id)}
                            type="save"
                          />
                        </div>
                      </>
                    )
            }

  </div>
  );
};

const mapStateToProps = (state) => ({
  downloadBgvReportFileState: state.notifications.downloadBgvReportFileState,
});

const mapDispatchToProps = (dispatch) => ({
  onDownloadBgvReport: (orgId, notificationId, url, fileName) => dispatch(actions.downloadBgvReportFile(orgId, notificationId, url, fileName)),
  onCloseNotification: (orgId, id) => dispatch(actions.closeNotification(orgId, id, null)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EmpListBgvDetailedReportDownload);
