/* eslint-disable import/no-duplicates */
/* eslint-disable no-nested-ternary */
import React from 'react';
import cx from 'classnames';
import styles from './DownloadButton.module.scss';
import Loader from '../../Organism/Loader/Loader';
import tick from '../../../assets/icons/blackTick.svg';
import errorDownload from '../../../assets/icons/warningCircleSmall.svg';
import download from '../../../assets/icons/downloadIcon.svg';
import blueDownload from '../../../assets/icons/downloadIcon.svg';
import greyDownload from '../../../assets/icons/greyDownload.svg';
import downloadWhite from '../../../assets/icons/downloadWhite.svg';
import blackDownloadIcon from '../../../assets/icons/blackDownloadIcon.svg';

const DownloadButton = ({
  selectAll, totalEmployeeCount, dataCount, type, downloadState, clickHandler, disabled,
  label, showButton, className,
}) => {
  // need to update for multiple deployment
  const tooltipText = 'this action is disabled for more than 50 employees. select fewer employees and try again.';
  const countSelected = selectAll ? totalEmployeeCount : dataCount;

  let downloadButton = null;
  switch (type) {
    case 'errorExcelDownload': // excel onboarding - error excel
      downloadButton = (
        <div role="button" tabIndex={0} className={cx(styles.DownloadErrorExcel, 'mt-2')} onClick={clickHandler} onKeyDown={clickHandler}>
          {downloadState === 'download excel' ? <img src={blackDownloadIcon} className={cx(styles.ImgRotate, 'px-2')} alt="" />
            : downloadState === 'downloading excel' ? <Loader type="stepLoaderBlack" />
              : <img src={tick} className="px-1" alt="" />}
          <span className={downloadState === 'downloading excel' ? 'ml-4 pl-2' : 'pl-2'}>{downloadState}</span>
        </div>
      );
      break;

    case 'excelDownload': // emplist - download modal
      downloadButton = (
        <div>
          {downloadState === 'SUCCESS' ? (
            <div className={styles.downloadSuccess}>
              <span><img className={styles.greenFilter} src={tick} alt="img" /></span>
              <span className={styles.downloadSuccessText}>downloaded</span>
            </div>
          )
            : downloadState === 'ERROR' ? (
              <div className={styles.downloadFail}>
                <span><img src={errorDownload} alt="img" /></span>
                <span className={styles.downloadFailText}>download failed</span>
              </div>
            )
              : (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={clickHandler}
                  onKeyDown={clickHandler}
                  className={cx(styles.excelDownload, 'd-flex justify-content-between')}
                  style={downloadState === 'LOADING' ? { cursor: 'progress' }
                    : downloadState === 'INIT' ? { cursor: 'pointer' }
                      : { cursor: 'default' }}
                >

                  {downloadState === 'INIT'
                    ? <span><img className={cx(styles.imgColor)} src={download} style={{ height: '16px' }} alt="img" /></span>
                    : downloadState === 'LOADING'
                      ? <Loader type="stepLoaderBlue" />
                      : null}
                  <span className={cx(styles.downloadText, 'text-nowrap')}>download excel</span>
                </div>
              )}
        </div>
      );
      break;

    case 'zipDownload': // emplist - download modal
      downloadButton = (
        <div>
          {downloadState === 'SUCCESS' ? (
            <div className={styles.downloadSuccess}>
              <span><img className={styles.greenFilter} src={tick} alt="img" /></span>
              <span className={styles.downloadSuccessText}>downloaded</span>
            </div>
          )
            : downloadState === 'ERROR' ? (
              <div className={styles.downloadFail}>
                <span><img src={errorDownload} alt="img" /></span>
                <span className={styles.downloadFailText}>download failed</span>
              </div>
            )
              : (
                <div className={countSelected > 50 ? styles.tooltip : null}>
                  <div
                    role="button"
                    tabIndex={0}
                    className={cx(styles.excelDownload, 'd-flex justify-content-between')}
                    onClick={countSelected > 50 ? null : clickHandler}
                    onKeyDown={clickHandler}
                    style={downloadState === 'LOADING' ? { cursor: 'progress' }
                      : downloadState === 'INIT' ? { cursor: 'pointer' }
                        : { cursor: 'default' }}
                    disabled={countSelected > 50}
                  >

                    {downloadState === 'INIT'
                      ? (
                        <span>
                          <img
                            className={cx(styles.imgColor)}
                            src={download}
                            alt="img"
                          />
                        </span>
                      )
                      : downloadState === 'LOADING'
                        ? <Loader type="stepLoaderBlue" />
                        : null}
                    <span
                      className={cx(styles.downloadZip, 'text-nowrap')}
                    >
                      download zip
                    </span>
                  </div>
                  {countSelected > 50
                    ? (
                      <span className={styles.tooltiptext}>
                        <i>{tooltipText}</i>
                      </span>
                    ) : ''}
                </div>

              )}
        </div>
      );
      break;

    case 'opsDownloadTask': // workload mgmt - download tasks
      downloadButton = (
        <div
          role="button"
          tabIndex={0}
          onClick={clickHandler}
          onKeyDown={clickHandler}
          disabled={disabled}
          className={downloadState === 'LOADING' ? cx(styles.downloadBgOpsLoading, 'd-flex justify-content-around', styles.hover, className)
            : cx(styles.downloadBgOps, 'd-flex justify-content-around', styles.hover, className)}
        >

          {downloadState === 'LOADING'
            ? <span><Loader type="stepLoaderBlue" /></span>
            : <img className={cx(styles.imgColor)} src={blueDownload} alt="img" />}

          <span className={cx(styles.textOps, 'ml-0 text-nowrap')}>
            {downloadState === 'LOADING' ? 'generating excel' : label}
          </span>
        </div>
      );
      break;

    case 'orgOnboardSample': // orgMgmt - orgOnboardConfig- documentMgmt
      downloadButton = (
        <div
          role="button"
          tabIndex={0}
          onClick={clickHandler}
          onKeyDown={clickHandler}
          disabled={disabled}
          className={cx(styles.downloadBgOps, 'd-flex justify-content-around', styles.hover, className)}
        >

          {downloadState === 'LOADING'
            ? <span><Loader type="stepLoaderBlue" /></span>
            : <img className={cx(styles.imgColor)} style={{ marginBottom: '0.45rem', marginRight: '0rem' }} src={greyDownload} alt="img" />}

          <span className={cx(styles.textOps, 'ml-0 text-nowrap')}>
            {label}
          </span>
        </div>
      );
      break;

    case 'orgOnboardConfig': // orgMgmt - orgOnboardConfig- documentMgmt
      downloadButton = (
        <div
          role="button"
          tabIndex={0}
          onClick={clickHandler}
          onKeyDown={clickHandler}
          disabled={disabled}
          className={cx(styles.downloadBgOps, 'd-flex justify-content-around position-relative', styles.hover, className)}
        >

          {downloadState === 'LOADING'
            ? <span style={{ position: 'absolute', left: '16px' }}><Loader type="stepLoaderBlue" /></span>
            : (
              <img
                className={cx(styles.imgColor)}
                style={{
                  position: 'absolute', left: '12px', top: '8px', height: '16px', width: '16px',
                }}
                src={blueDownload}
                alt="img"
              />
            )}

          <span className={cx(styles.textOps, 'ml-0 text-nowrap')} style={{ position: 'absolute', right: '10px' }}>
            {label}
          </span>
        </div>
      );
      break;

    case 'orgOnboardConfigBlue': // orgMgmt - orgOnboardConfig- documentMgmt
      downloadButton = (
        <div
          role="button"
          tabIndex={0}
          onClick={clickHandler}
          onKeyDown={clickHandler}
          disabled={disabled}
          className={cx(styles.downloadBgOps, 'd-flex justify-content-around position-relative', styles.hover, className)}
        >

          {downloadState === 'LOADING'
            ? <span style={{ position: 'absolute', left: '16px' }}><Loader type="stepLoaderWhite" /></span>
            : (
              <img
                className={cx(styles.imgColor)}
                style={{
                  position: 'absolute', left: '12px', top: '8px', height: '16px', width: '16px',
                }}
                src={downloadWhite}
                alt="img"
              />
            )}

          <span className={cx(styles.whiteFont, styles.textOps, 'ml-0 text-nowrap')} style={{ position: 'absolute', right: '10px' }}>
            {label}
          </span>
        </div>
      );
      break;

    case 'onboaardMgmtDocument': // orgMgmt - orgOnboardConfig- documentMgmt
      downloadButton = (
        <div
          role="button"
          tabIndex={0}
          onClick={clickHandler}
          onKeyDown={clickHandler}
          disabled={disabled}
          className={cx(styles.downloadBgDoc, 'd-flex justify-content-around', styles.hover, className)}
        >

          {downloadState === 'LOADING'
            ? <span className="mr-4"><Loader type="stepLoaderWhite" /></span>
            : <img className={cx('pr-2 mr-0', styles.imgSizeDoc)} src={downloadWhite} alt="img" />}

          <span className={cx(styles.textDoc, 'ml-0 text-nowrap')}>
            {label}
          </span>
        </div>
      );
      break;

    case 'empNotification': // empnotifications
      downloadButton = (
        <div
          role="button"
          tabIndex={0}
          className={cx(styles.empNotification, 'mt-2')}
          style={downloadState === 'LOADING' ? { cursor: 'progress' } : { cursor: 'pointer' }}
          onClick={clickHandler}
          onKeyDown={clickHandler}
        >

          <img className={cx('mr-2')} src={greyDownload} alt="img" />
          {label}
        </div>
      );
      break;

    case 'tasksExcelDownload': // workload-mgmt excelUpload/Download
      downloadButton = (
        <div disabled={disabled}>
          {downloadState === 'LOADING' ? (
            <div
              className={cx('d-flex justify-content-between', styles.tasksExcelDownload)}
              style={{ cursor: 'progress' }}
            >
              <div className={styles.whiteLoader}>
                <Loader type="stepLoaderWhite" />
              </div>
              <span className={cx(styles.whiteText)}>generating excel</span>
            </div>
          )
            : downloadState === 'SUCCESS' && showButton
              ? (
                <div className={cx('d-flex justify-content-between', styles.tasksSuccess)}>
                  <span><img className={cx('ml-3 mt-2', styles.greenFilter)} src={tick} alt="img" /></span>
                  <span className={styles.tasksSuccessText}>excel downloaded</span>
                </div>
              )
              : (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={clickHandler}
                  style={{ cursor: 'pointer' }}
                  className={cx('d-flex justify-content-between', styles.tasksExcelDownload)}
                  onKeyDown={clickHandler}
                >
                  <span><img className="ml-3 mt-2" style={{ height: '13px' }} src={downloadWhite} alt="img" /></span>
                  <span className={cx(styles.whiteText)}>download excel</span>
                </div>
              )}
        </div>
      );
      break;

    default: // pdf report download
      downloadButton = (
        <div
          role="button"
          tabIndex={0}
          className={cx('row no-gutters', styles.downloadBg, className)}
          style={downloadState === 'LOADING' ? { cursor: 'progress' } : { cursor: 'pointer' }}
          onClick={clickHandler}
          onKeyDown={clickHandler}
        >

          <label
            style={downloadState === 'LOADING' ? { cursor: 'progress' } : { cursor: 'pointer' }}
            className={cx(styles.downloadLabel)}
            htmlFor="pdf-report-download"
          >
            {label}
          </label>
          {downloadState === 'LOADING'
            ? <div style={{ marginRight: '20px' }}><Loader type="stepLoaderBlue" /></div>
            : <img style={{ marginRight: '8px', marginBottom: '2px' }} src={download} alt="download" />}
        </div>
      );
      break;
  }

  return (
    <>
      {downloadButton}
    </>
  );
};

export default DownloadButton;
