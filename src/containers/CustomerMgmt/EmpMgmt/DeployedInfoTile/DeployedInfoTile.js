import React from 'react';
import cx from 'classnames';
import moment from 'moment';
import { VendorIcon } from 'react-crux';
import styles from './DeployedInfoTile.module.scss';
import { getBgColor, getDescription, handleOrgLogo } from './helper';

const DeployedInfoTile = ({
  orgType, isTerminated, orgName, brandColor, joiningDate,
  terminationDate, isSelected, clickHandler, deployedTo, sourceOrgName, originOrgName,
}) => {
  const transformDate = (date) => {
    if (date && moment(date, 'DD-MM-YYYY').isValid()) {
      return moment(date, 'DD-MM-YYYY').format('DD MMM YYYY');
    }
    return '';
  };

  return (
    <div
      className={cx(styles.tile, isSelected ? styles.tileActive : styles.tileInActive)}
      onClick={clickHandler}
      role="button"
      tabIndex={0}
      aria-hidden
    >
      {isTerminated && (
        <div className={cx(styles.terminatedTile,
          isSelected ? styles.terminatedTileActive : styles.terminatedTileInActive)}
        />
      )}
      <div className={styles.paddingLeft}>
        <div className="d-flex justify-content-between">
          <span className={cx(styles.description, 'text-nowrap')}>{getDescription({ orgType, sourceOrgName })}</span>
          {isTerminated ? <span className={styles.inActiveStatus}>in-active</span>
            : <span className={styles.activeStatus}>active</span>}
        </div>
        <div className="d-flex" style={{ marginTop: '1rem' }}>
          <div
            style={{ color: brandColor, backgroundColor: getBgColor({ brandColor }) }}
            className={styles.brandLogo}
          >
            {handleOrgLogo({ orgName })}
          </div>
          <div className={cx(styles.orgName)}>{orgType === 'org' ? `My org ( ${orgName} )` : orgName}</div>
          {orgType !== 'org'
            && (
            <div className={styles.vendorIconMargin}>
              <VendorIcon
                id={orgName}
                deployedTo={deployedTo.length > 0 ? deployedTo : []}
                sourceOrg={`${sourceOrgName}`}
                originOrg={`${originOrgName}`}
                deplength={deployedTo.length}
              />
            </div>
            )}
        </div>
        {joiningDate && (
          <div style={{ marginTop: '1rem' }} className={styles.duration}>
            {`${transformDate(joiningDate)} -`}
            {' '}
            {isTerminated ? transformDate(terminationDate) : 'present'}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeployedInfoTile;
