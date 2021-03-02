/* eslint-disable no-underscore-dangle */
/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { isEmpty } from 'lodash';
import { Button } from 'react-crux';
import styles from './NotificationContent.module.scss';

import zip from '../../../../assets/icons/zipIcon.svg';
import CircularProgressBar from '../../../../components/Molecule/CircularProgressBar/CircularProgressBar';
import DownloadButton from '../../../../components/Atom/DownloadButton/DownloadButton';
import * as actions from '../Store/action';

const EmpListBgvPdfReportDownload = ({
  data, progressData, downloadBgvReportFileState, onDownloadBgvReport, orgId, onCloseNotification,
}) => {
  useEffect(() => {
    if (downloadBgvReportFileState === 'SUCCESS') {
      onCloseNotification(orgId, data._id);
    }
  }, // eslint-disable-next-line
  [downloadBgvReportFileState]);
  return (
    <div className={cx(styles.background, 'row mx-0 px-0')}>
      <div className={styles.circleProgressAlign}>
        {data.data.status === 'inProgress' ? (
          <CircularProgressBar
            type="loading"
            centerImage={zip}
          />
        )
          : data.data.status === 'success' ? (
            <CircularProgressBar
              type="progress"
              percentValue={100}
              centerImage={zip}
              status="success"
            />
          )
            : (
              <CircularProgressBar
                type="progress"
                percentValue={100}
                centerImage={zip}
                status="error"
              />
            )}
      </div>
      {
                data.data.status === 'inProgress' ? (
                  <div className={styles.maxWidth}>
                    <div className={cx(styles.headingLarge)}>
                      Bulk Verify Reports are in progress
                    </div>
                    <div className={cx(styles.textProgress, 'mt-2')}>
                      Verify Reports generation for
                      {' '}
                      {progressData.total}
                      {' '}
                      selected employees
                      {' '}
                      {progressData.total > 1 ? 'are' : 'is' }
                      {' '}
                      in progress
                    </div>
                  </div>
                )
                  : data.data.status === 'success' ? (
                    <>
                      <div className={styles.maxWidth}>
                        <div className={cx(styles.headingLarge)}>
                          Bulk Verify Reports are complete
                        </div>
                        <div className={cx(styles.textSuccess, 'mt-2')}>
                          Verify Reports generation for
                          {' '}
                          {isEmpty(data.data.size) ? `${data.data.size} out of ` : ''}

                          {progressData.total}
                          {' '}
                          selected employees is complete.
                        </div>
                      </div>
                      <div className="ml-auto mt-5">
                        <DownloadButton
                          type="zipDownload"
                          label="download"
                          clickHandler={downloadBgvReportFileState === 'LOADING' ? null : () => onDownloadBgvReport(orgId, data._id, data.data.downloadURL, 'VerifyReports')}
                          downloadState={downloadBgvReportFileState}
                        />
                      </div>
                    </>
                  )
                    : (
                      <>
                        <div className={styles.maxWidth}>
                          <div className={cx(styles.headingLarge)}>
                            bgv pdf summary report zipfile generation failed !
                          </div>
                          <div className={cx(styles.textError, 'mt-2')}>
                            pdf generation for
                            {' '}
                            {progressData.total}
                            {' '}
                            employee profiles has been failed !
                          </div>
                        </div>
                        <div className="ml-auto mt-5">
                          <Button
                            label="close"
                            clickHandler={
                                () => onCloseNotification(orgId, data._id)
                            }
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
  onDownloadBgvReport: (orgId, notificationId, url, filename) => dispatch(
    actions.downloadBgvReportFile(orgId, notificationId, url, filename),
  ),
  onCloseNotification: (orgId, id) => dispatch(actions.closeNotification(orgId, id, null)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EmpListBgvPdfReportDownload);
