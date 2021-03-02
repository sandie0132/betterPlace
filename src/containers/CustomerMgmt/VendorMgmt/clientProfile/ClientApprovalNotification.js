import React from 'react';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';
import { Button } from 'react-crux';
import styles from './clientProfile.module.scss';

const ClientApprovalNotification = ({ className, orgName, handleNotification }) => (
  <>
    <div className={cx(className, styles.NotificationCard, 'd-flex flex-row justify-content-between')}>
      <div className="my-auto" style={{ fontSize: '14px' }}>
        {`do you want to accept ${orgName}'s vendor request?`}
      </div>
      <div className="row no-gutters">
        <Button
          type="cancel"
          className={styles.IgnoreButton}
          label="ignore"
          isDisabled={false}
          clickHandler={() => handleNotification('rejected')}
        />
        <Button
          type="save"
          label="accept"
          isDisabled={false}
          clickHandler={() => handleNotification('active')}
        />
      </div>
    </div>
  </>
);

export default withTranslation()(withRouter(ClientApprovalNotification));
