import React from 'react';
import cx from 'classnames';
import { withRouter } from 'react-router';
// import { Button } from 'react-crux';
import { withTranslation } from 'react-i18next';
import styles from './VendorRow.module.scss';
import themes from '../../../../../theme.scss';

import inprogress from '../../../../../assets/icons/inprogress.svg';
import empFolder from '../../../../../assets/icons/empFolder.svg';
import roleFolder from '../../../../../assets/icons/roleFolder.svg';
import siteFolder from '../../../../../assets/icons/siteFolder.svg';

/**
 * Generates a vendor list row
 * @icon {string}
 * @iconStyle classname to change size of displayed icon
 * @vendorName {string}
 * @awaitingApproval {string} vendor status
 * @locations {number}
 * @roles {number}
 * @employees {number}
 * @brandColor {string} for bgColor of an org to display in icon
 */

const VendorRow = ({
  icon,
  iconStyle,
  vendorName,
  awaitingApproval,
  locations,
  roles,
  employees,
  brandColor,
}) => (
  <div className="row no-gutters mt-4">

    <div className={cx('my-auto', styles.Logo)} style={{ backgroundColor: (brandColor || themes.secondaryLabel) }}>
      <img className={iconStyle} src={icon} alt="vendor" />
    </div>

    <div className="d-flex flex-column ml-2 pl-2" style={{ width: '72%' }}>
      <div className={cx('row no-gutters', styles.Display)}>
        <span className={styles.VendorName}>
          {vendorName}
        </span>

        {awaitingApproval
          ? (
            <span>
              <img style={{ width: '13px', marginRight: '10px' }} src={inprogress} alt="waitingIcon" />
              <span className={styles.Approval}>awaiting approval</span>
            </span>
          )
          : null}
      </div>

      <div className="row no-gutters mt-2">
        <img src={siteFolder} alt="folder" />
        <span className={cx(styles.Folder, 'ml-2 mr-4')}>
          {locations}
          {' '}
          sites
        </span>
        <img src={roleFolder} alt="folder" />
        <span className={cx(styles.Folder, 'ml-2 mr-4')}>
          {roles}
          {' '}
          roles
        </span>
        <img src={empFolder} alt="folder" />
        <span className={cx(styles.Folder, 'ml-2')}>
          {employees}
          {' '}
          employees
        </span>
      </div>

    </div>

    {/* <span className="ml-auto my-auto">
      <Button
        label="view details"
        type="secondaryButtonWithArrow"
        className={styles.buttonHover}
        isDisabled={false}
        // clickHandler={this.handleRedirect}
      />
    </span> */}

  </div>
);

export default withTranslation()(withRouter(VendorRow));
