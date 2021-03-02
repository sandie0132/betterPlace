import React from 'react';
import cx from 'classnames';
import { withTranslation } from 'react-i18next';
import { Button } from 'react-crux';
import styles from './VendorClientInfoCard.module.scss';

import inprogress from '../../../../../assets/icons/inprogress.svg';
import roleFolder from '../../../../../assets/icons/roleFolder.svg';
import empFolder from '../../../../../assets/icons/empFolder.svg';
import siteFolder from '../../../../../assets/icons/siteFolder.svg';
import whiteBuilding from '../../../../../assets/icons/whiteBuilding.svg';

const VendorClientInfoCard = ({
  brandColor, orgName, category, type, id, showLine, handleRedirect,
  sites, roles, employees,
}) => (
  <>
    <div className="d-flex justify-content-between" style={showLine ? null : { marginBottom: '1.5rem' }}>
      <div className="d-flex">
        <div className={styles.box} style={{ backgroundColor: brandColor || '#8697A8' }}>
          <img className={styles.icon} src={whiteBuilding} alt="" />
        </div>
        <div className="d-flex flex-column ml-3 pl-2">
          <div className="row no-gutters">
            <span className={styles.VendorName}>{orgName}</span>
            {type === 'pending' ? (
              <>
                <img style={{ width: '13px', marginRight: '10px' }} src={inprogress} alt="waitingIcon" />
                <span className={styles.Approval}>{category === 'vendors' ? 'awaiting approval' : 'pending approval'}</span>
              </>
            ) : null}
          </div>

          <div className="row no-gutters mt-2">
            <img src={siteFolder} alt="folder" />
            <span className={cx(styles.Folder, 'ml-2 mr-4')}>
              {sites}
              {' '}
              sites
            </span>
            <img src={roleFolder} alt="folder" />
            <span className={cx(styles.Folder, 'ml-2 mr-4')}>
              {roles}
              {' '}
              roles
            </span>
            {type === 'approved' ? (
              <>
                <img src={empFolder} alt="folder" />
                <span className={cx(styles.Folder, 'ml-2')}>
                  {employees}
                  {' '}
                  employees
                </span>
              </>
            ) : null}
          </div>
        </div>
      </div>
      <Button
        label={category === 'vendors' ? 'view details' : 'view profile'}
        type="secondaryButtonWithArrow"
        className={styles.buttonHover}
        isDisabled={false}
        clickHandler={() => handleRedirect(id, category)}
      />
    </div>
    {showLine
      ? <hr className={styles.hr2} style={{ width: '100%', marginTop: '1.5rem' }} />
      : null}
  </>
);

export default withTranslation()(VendorClientInfoCard);
