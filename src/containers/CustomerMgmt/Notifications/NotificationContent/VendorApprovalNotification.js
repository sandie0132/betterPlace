/* eslint-disable max-len */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { withRouter } from 'react-router';

import cx from 'classnames';
import { connect } from 'react-redux';
import { Button } from 'react-crux';
import styles from './NotificationContent.module.scss';
import whiteBuilding from '../../../../assets/icons/whiteBuilding.svg';

import * as actions from '../Store/action';

const handleRedirect = (props) => {
  props.history.push(`/customer-mgmt/org/${props.orgId}/vendor-mgmt/client/${props.data.data.clientId}/clientprofile?filter=overall_insights`);
};

const handleNotification = (value, props) => {
  const { orgId } = props;
  const { clientId } = props.data.data;

  const payload = { status: '' };

  if (value === 'approve') {
    payload.status = 'active';
  } else {
    payload.status = 'rejected';
  }
  props.onUpdateVendorApprovalReq(payload, orgId, clientId);
};

const VendorApprovalNotification = (props) => (
  <div className={cx(styles.background, 'row mx-0 px-0')}>

    <div
      className={cx(styles.Logo)}
      style={props.data && props.data.data && props.data.data.clientBrandColor
        ? { backgroundColor: props.data.data.clientBrandColor } : { backgroundColor: '#8697A8' }}
    >
      <img src={whiteBuilding} style={{ height: '48px', marginTop: '25%' }} alt="logo" />
    </div>
    <div className="col-7 px-0 ml-4">
      <div className="d-flex flex-column">
        <span className={cx('mt-1', styles.Heading)}>
          vendor approval request from
          {' '}
          {props.data.data.clientName}
        </span>
        <span className={cx('mt-1 mb-2', styles.Details)}>
          you have a new vendor request from
          {' '}
          {props.data.data.clientName}
        </span>
        <span
          role="button"
          aria-hidden="true"
          className={styles.BlueText}
          onClick={() => handleRedirect(props)}
        >
          <u>more details</u>
        </span>
      </div>
    </div>

    <div className="align-self-end">
      <div className={styles.absoluteRightButton}>
        <div className="d-flex flex-row">
          <Button
            type="cancel"
            className={cx(styles.IgnoreDefaultButton, styles.IgnoreButton)}
            label="ignore"
            isDisabled={false}
            clickHandler={() => handleNotification('ignore', props)}
          />
          <Button
            type="save"
            label="approve"
            isDisabled={false}
            clickHandler={() => handleNotification('approve', props)}
          />
        </div>
      </div>
    </div>

  </div>
);

const mapDispatchToProps = (dispatch) => ({
  onUpdateVendorApprovalReq: (payload, orgId, clientId) => dispatch(actions.updateVendorApprovalReq(payload, orgId, clientId)),
});

export default withRouter(connect(null, mapDispatchToProps)(VendorApprovalNotification));
