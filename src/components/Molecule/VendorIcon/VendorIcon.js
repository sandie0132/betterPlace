/* eslint-disable no-nested-ternary */
import React from 'react';
import cx from 'classnames';
import { isEmpty } from 'lodash';
import { Tooltip } from 'react-crux';
import styles from './VendorIcon.module.scss';
import arrowIcon from '../../../assets/icons/arrow.svg';
import personIcon from '../../../assets/icons/person.svg';

const handleToolTipText = (source, origin, deployed) => {
  let hierarchy = '';
  const grp = [];
  if (!isEmpty(source) && !isEmpty(origin)) {
    if (source === origin) {
      hierarchy += `${source} > `;
    } else if (source !== origin) {
      hierarchy += `${origin} > ${source} > `;
    }
  }
  hierarchy += 'my org';
  if (!isEmpty(deployed)) {
    deployed.forEach((dep) => {
      if (!isEmpty(dep)) {
        if (!isEmpty(dep.clientName)) {
          hierarchy += ` > ${dep.clientName}`;
        }
        if (!isEmpty(dep.superClientName)) {
          hierarchy += ` > ${dep.superClientName}`;
        }
      }
      grp.push(hierarchy);
    });
  }
  // need to update for multiple deployment
  const tooltipContent = (
    <div>
      <div className="row no-gutters">
        <span className={cx(styles.SelectAll)}>{hierarchy}</span>
      </div>
    </div>
  );
  return tooltipContent;
};

const vendorIcon = ({
  sourceOrg, originOrg, deployedTo, id, deplength,
}) => (
  !isEmpty(sourceOrg) || !isEmpty(originOrg) || !isEmpty(deployedTo)
    ? (
      <div className={cx(styles.vendorIcon, 'd-flex flex-row ')} data-for={id} data-tip={id}>
        {!isEmpty(sourceOrg) && !isEmpty(originOrg)
          ? (sourceOrg !== originOrg ? (
            <>
              <img className={cx('row no-gutters')} src={arrowIcon} style={{ marginRight: '1px' }} alt="" />
              <img className={cx('row no-gutters')} src={arrowIcon} style={{ marginRight: '1px' }} alt="" />
            </>
          )
            : <img className={cx('row no-gutters')} src={arrowIcon} style={{ marginRight: '1px' }} alt="" />) : ''}
        <img className={cx('row no-gutters')} src={personIcon} alt="" style={{ marginRight: '1px' }} />
        {!isEmpty(deployedTo)
          ? !isEmpty(deployedTo[0].superClient) ? ( // multiple deployment loop missing
            <>
              <img className={cx('row no-gutters')} src={arrowIcon} style={{ marginRight: '1px' }} alt="" />
              <img className={cx('row no-gutters')} src={arrowIcon} style={{ marginRight: '1px' }} alt="" />
            </>
          )
            : <img className={cx('row no-gutters')} src={arrowIcon} alt="" style={{ marginRight: '1px' }} />
          : ''}
        {!isEmpty(deplength) && deplength > 1
          ? (
            <span className={styles.deployedCount} aria-hidden htmlFor="true">
              {deplength}
            </span>
          )
          : ''}
        <Tooltip
          id={id}
          arrowColor="transparent"
          place="top"
          type="info"
          tooltipClass={styles.tooltipClass}
        >
          {handleToolTipText(sourceOrg, originOrg, deployedTo)}
        </Tooltip>
      </div>
    ) : ''
);

export default vendorIcon;
