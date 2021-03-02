/* eslint-disable no-underscore-dangle */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-case-declarations */
import React from 'react';
import _ from 'lodash';
import cx from 'classnames';
import { Tooltip } from 'react-crux';
import styles from './BGVLabel.module.scss';

import inProgress from '../../../../../../assets/icons/inProgressLock.svg';
import greenCase from '../../../../../../assets/icons/greenCase.svg';
import redCase from '../../../../../../assets/icons/redOption.svg';
import yellowCase from '../../../../../../assets/icons/yellow.svg';
import expired from '../../../../../../assets/icons/onholdRed.svg';
import missingInfo from '../../../../../../assets/icons/missingInfo.svg';

const BGVLabel = (
  {
    bgvData, type, missingInfoData, insufInfoData,
  },
) => {
  const status = bgvData ? bgvData.status : null;
  let badge = null;

  const getBackgroundColor = () => {
    switch (status) {
      case 'inProgress': return styles.progressBG;
      case 'manualReviewPending': return styles.progressBG;
      case 'done':
        if (!_.isEmpty(bgvData.expiryDate)
        && new Date(bgvData.expiryDate).getTime() < new Date().getTime()) {
          return styles.redBG;
        }
        const result = bgvData.result.clientStatus;
        switch (result) {
          case 'YELLOW': return styles.yellowBG;
          case 'GREEN': return styles.greenBG;
          default: return styles.redBG;
        }

      default: return styles.labelBG;
    }
  };

  const getSectionStatus = () => {
    switch (status) {
      case 'inProgress': return 'verification is in progress ';
      case 'manualReviewPending': return 'manual review pending';
      case 'done':
        if (!_.isEmpty(bgvData.expiryDate)
        && new Date(bgvData.expiryDate).getTime() < new Date().getTime()) {
          return 'verification expired ';
        }
        const result = bgvData.result.clientStatus;
        switch (result) {
          case 'YELLOW': return 'verified as yellow case ';
          case 'GREEN': return 'verified as green case ';
          default: return 'verified as red case ';
        }
      default: return styles.labelBG;
    }
  };

  const getTextColor = () => {
    switch (status) {
      case 'inProgress': return styles.progressText;
      case 'manualReviewPending': return styles.progressText;
      case 'done':
        if (!_.isEmpty(bgvData.expiryDate)
        && new Date(bgvData.expiryDate).getTime() < new Date().getTime()) {
          return styles.redText;
        }
        const result = bgvData.result.clientStatus;
        switch (result) {
          case 'YELLOW': return styles.yellowText;
          case 'GREEN': return styles.greenText;
          default: return styles.redText;
        }

      default: return styles.labelBG;
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    let month = `${d.getMonth() + 1}`;
    let day = `${d.getDate()}`;
    const year = d.getFullYear();

    if (month.length < 2) { month = `0${month}`; }
    if (day.length < 2) { day = `0${day}`; }

    return [day, month, year].join('.');
  };

  const getSectionText = () => {
    switch (status) {
      case 'inProgress': return "can't change details now";
      case 'manualReviewPending': return "can't change details now";
      case 'done':
        if (!_.isEmpty(bgvData.expiryDate)
        && new Date(bgvData.expiryDate).getTime() < new Date().getTime()) {
          return `on ${formatDate(bgvData.expiryDate)}`;
        } if (!_.isEmpty(bgvData.completedOn)) {
          return `on ${formatDate(bgvData.completedOn)}`;
        }
        return null;

      default: return styles.labelBG;
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'inProgress': return inProgress;
      case 'manualReviewPending': return inProgress;
      case 'done':
        if (!_.isEmpty(bgvData.expiryDate)
        && new Date(bgvData.expiryDate).getTime() < new Date().getTime()) {
          return expired;
        }
        const result = bgvData.result.clientStatus;
        switch (result) {
          case 'YELLOW': return yellowCase;
          case 'GREEN': return greenCase;
          default: return redCase;
        }

      default: return inProgress;
    }
  };

  const handleTooltipText = () => {
    if (type === 'missingInfo') {
      const tooltipContent = (
        <div>
          <div className={cx('row no-gutters', styles.BlackSmallText)}>following details are missing</div>
          <hr className={cx('mx-2', styles.YellowHr)} />
          <div className={cx('mb-0 d-flex flex-column', styles.YellowSmallText)}>
            {missingInfoData.missingFields.map((element) => (
              <span key={element}>
                {element}
              </span>
            ))}
          </div>
        </div>
      );
      return tooltipContent;
    // eslint-disable-next-line no-else-return
    } else if (type === 'insufInfo') {
      const tooltipContent = (
        <div>
          <div className={cx('row no-gutters', styles.BlackSmallText)}>remarks for insufficient info</div>
          <hr className={cx('mx-2', styles.YellowHr)} />
          <div className={cx('mb-0 d-flex flex-column', styles.YellowSmallText)}>
            <span key={insufInfoData.remarks}>
              {insufInfoData.remarks}
            </span>
          </div>
        </div>
      );
      return tooltipContent;
    }
    return null;
  };

  switch (type) {
    case 'missingInfo':
      badge = (
        <div
          // className={styles.tooltip}
          data-for={missingInfoData._id}
          data-tip={missingInfoData._id}
        >
          <div className={cx(styles.yellowBG, styles.background)}>
            <img src={missingInfo} alt="lock" />
            <span className={cx(styles.yellowText, styles.text)}>
              <span style={{ fontFamily: 'gilroy-bold' }}>missing details</span>
            </span>
          </div>
          {!_.isEmpty(missingInfoData) && !_.isEmpty(missingInfoData.missingFields)
            ? (
              <Tooltip
                type="info"
                arrowColor="transparent"
                id={missingInfoData._id}
                place="left"
              >
                {handleTooltipText()}
              </Tooltip>
            ) : null}
        </div>
      );
      break;

    case 'insufInfo':
      badge = (
        <div
          data-for={insufInfoData._id}
          data-tip={insufInfoData._id}
        >
          <div className={cx(styles.yellowBG, styles.background)}>
            <img src={missingInfo} alt="lock" />
            <span className={cx(styles.yellowText, styles.text)}>
              <span style={{ fontFamily: 'gilroy-bold' }}>insufficient details</span>
            </span>
          </div>
          {!_.isEmpty(insufInfoData) && !_.isEmpty(insufInfoData.remarks)
            ? (
              <Tooltip
                type="info"
                arrowColor="transparent"
                id={insufInfoData._id}
                place="left"
              >
                {handleTooltipText()}
              </Tooltip>
            ) : null}
        </div>
      );
      break;

    default:
      badge = (
        <div className={cx(getBackgroundColor(), styles.background)}>
          <img src={getIcon()} alt="lock" />
          <span className={cx(getTextColor(), styles.text)}>
            <span style={{ fontFamily: 'gilroy-bold' }}>{`${getSectionStatus()} `}</span>
            {getSectionText()}
          </span>
        </div>
      );
  }

  return (
    <>
      {badge}
    </>
  );
};

export default BGVLabel;
