/* eslint-disable no-nested-ternary */
import React from 'react';
import _ from 'lodash';
import cx from 'classnames';
import styles from './SingleModal.module.scss';

import inprogress from '../../../../../assets/icons/inprogress.svg';
import greenCase from '../../../../../assets/icons/greenCase.svg';
import redCase from '../../../../../assets/icons/verifyRed.svg';
import amberCase from '../../../../../assets/icons/yellow.svg';
// import greyCase from '../../../../../assets/icons/greyCase.svg';
import pdf from '../../../../../assets/icons/pdfIcon.svg';
import commentIcon from '../../../../../assets/icons/commentIcon.svg';

const Result = ({
  clientStatus, comments, attachments, completedOn, handleDownload, downloadState, verificationData,
  inProgress,
}) => {
  let resultIcon = <img src={inprogress} className={cx('my-auto', styles.resultIcon)} alt="" />;
  if (!_.isEmpty(clientStatus)) {
    if (clientStatus === 'GREEN') resultIcon = <img src={greenCase} className={cx('my-auto', styles.resultIcon)} alt="" />;
    if (clientStatus === 'YELLOW') resultIcon = <img src={amberCase} className={cx('my-auto', styles.resultIcon)} alt="" />;
    if (clientStatus === 'RED') resultIcon = <img src={redCase} className={cx('my-auto', styles.resultIcon)} alt="" />;
  }

  const handleDate = (date) => {
    let currentDate = '';
    const year = date.substring(0, 4);
    const month = date.substring(5, 7);
    const day = date.substring(8, 10);
    if (month === '01') { currentDate = 'jan '; } else if (month === '02') { currentDate = 'feb '; } else if (month === '03') { currentDate = 'mar '; } else if (month === '04') { currentDate = 'apr '; } else if (month === '05') { currentDate = 'may '; } else if (month === '06') { currentDate = 'jun '; } else if (month === '07') { currentDate = 'jul '; } else if (month === '08') { currentDate = 'aug '; } else if (month === '09') { currentDate = 'sep '; } else if (month === '10') { currentDate = 'oct '; } else if (month === '11') { currentDate = 'nov '; } else if (month === '12') { currentDate = 'dec '; }
    currentDate += `${day}, ${year}`;
    return currentDate;
  };
  return (
    <div className="d-flex flex-row justify-content-between">
      <div className="d-flex flex-column">
        {inProgress ? (
          <>
            <span className={cx('mb-1', styles.greySmallText)}>
              current status
            </span>
            <div className="d-flex flex-row">
              {resultIcon}
              <span className="d-flex flex-column ml-2 my-auto">
                <span className={styles.smallLabel}>
                  verification - in progress
                </span>
              </span>
            </div>
          </>
        )
          : !inProgress && !_.isEmpty(clientStatus)
            ? (
              <>
                <span className={cx('mb-1', styles.greySmallText)}>
                  final status
                </span>
                <div className="d-flex flex-row">
                  {resultIcon}
                  <span className="d-flex flex-column ml-2 my-auto">
                    <span className={styles.smallLabel}>
                      verified -
                      {' '}
                      {clientStatus.toLowerCase()}
                      {' '}
                      case
                    </span>
                    {!_.isEmpty(completedOn)
                      ? <span className={styles.greySmallText}>{handleDate(completedOn)}</span>
                      : null}
                  </span>
                </div>
              </>
            )
            : null}
        {!_.isEmpty(comments)
          ? (
            <div className="d-flex flex-column mt-3">
              <span className={cx('mb-2', styles.greySmallText)}>
                comments
              </span>
              <span className="d-flex flex-row flex-wrap">
                {comments.map((eachComment) => (
                  <span key={eachComment} className={cx('mr-2 mb-2', styles.commentBg)}>
                    <img src={commentIcon} alt="" />
                    <span className="ml-2">{eachComment}</span>
                  </span>
                ))}
              </span>
            </div>
          )
          : null}
      </div>

      {!_.isEmpty(attachments)
        ? (
          <div className="d-flex flex-column">
            <span className={styles.greySmallText}>
              attachment
            </span>
            <span className="d-flex flex-row flex-wrap">
              {attachments.map((eachAttach) => (
                !_.isEmpty(eachAttach)
                  ? (
                    <span key={eachAttach}>
                      <img
                        src={pdf}
                        className={cx('mr-2', styles.resultIcon)}
                        onClick={downloadState === 'LOADING' ? null : () => handleDownload(eachAttach, verificationData.verificationPreference === 'PHYSICAL' ? 'PHYSICAL' : null)}
                        aria-hidden
                        alt=""
                        style={downloadState === 'LOADING' ? { cursor: 'progress' } : { cursor: 'pointer' }}
                      />
                    </span>
                  )
                  : null
              ))}
            </span>
          </div>
        ) : null}
    </div>
  );
};

export default Result;
