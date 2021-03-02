import React from 'react';
import cx from 'classnames';
import { Tooltip } from 'react-crux';
import styles from './publishCell.module.scss';
import tick from '../../../../../../../assets/icons/whiteTick.svg';
import publishIcon from '../../../../../../../assets/icons/publishIcon.svg';
import publishEnable from '../../../../../../../assets/icons/publishActive.svg';
import Loader from '../../../../../../../components/Organism/Loader/Loader';

const ifPropsEqual = (prevCell, nextCell) => prevCell.isPublished === nextCell.isPublished
&& prevCell.isLoading === nextCell.isLoading
 && prevCell.selected === nextCell.isSelected;

const PublishCell = ({
  isPublished, isLoading, isSelected, onPublishClick,
}) => {
  if (isPublished) {
    return (
      <div className={cx(styles.cellTextAlignSec, 'd-flex flex-row justify-content-center')}>
        <div className={styles.tabGreen}>
          <div className={styles.inlineBlock}>
            <img src={tick} alt="tick" height="14px" className="mr-1" />
          </div>
          <div className={styles.inlineBlock}>
            published
          </div>
        </div>

      </div>
    );
  }

  if (isSelected) {
    return (
      <>
        <span data-tip="active" data-for="active">
          <div className={cx(styles.cellTextAlignSec, 'd-flex flex-row justify-content-center')}>
            <div className={styles.tabEnable} role="button" tabIndex="0" aria-hidden onClick={() => onPublishClick()}>
              <div className={styles.inlineBlock}><img src={publishEnable} alt="publishIcon" height="20px" /></div>
              <div className={styles.inlineBlock}>publish changes</div>
            </div>
          </div>
          <Tooltip id="active" type="info" place="top" delayShow={300} tooltipClass={styles.tooltipClass}>
            <span className={styles.tooltip}>
              publish selected
            </span>
          </Tooltip>
        </span>
      </>
    );
  }

  if (isLoading) {
    return (
      <div className={cx(styles.cellTextAlignSec, 'd-flex flex-row justify-content-center')}>
        <div className={cx(styles.tabLoading, 'd-flex')}>
          <Loader type="stepLoaderWhite" />

          {' '}
          <span className="ml-4 pt-1">publishing changes</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <span data-tip="disabled" data-for="disabled">
        <div className={cx(styles.cellTextAlignSec, 'd-flex flex-row justify-content-center')}>
          <div className={styles.tabGrey}>
            <div className={styles.inlineBlock}><img src={publishIcon} alt="publishIcon" height="20px" /></div>
            <div className={styles.inlineBlock}>publish changes</div>
          </div>
          <Tooltip id="disabled" type="info" place="top" delayShow={300} tooltipClass={styles.tooltipClass}>
            <span className={styles.tooltip}>
              select the column to publish
            </span>
          </Tooltip>
        </div>
      </span>
    </>
  );
};

export default React.memo(PublishCell, ifPropsEqual);
