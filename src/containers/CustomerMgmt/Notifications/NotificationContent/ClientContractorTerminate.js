/* eslint-disable camelcase */
import React from 'react';
import cx from 'classnames';
import { Button } from 'react-crux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import styles from './NotificationContent.module.scss';

import terminationNotificationIcon from '../../../../assets/icons/terminationNotificationIcon.svg';

import * as empListActions from '../../EmpMgmt/EmpList/Store/action';

const ClientContractorTerminate = (props) => {
  const { data } = props;
  const {
    empIds, origin_org, source_org, vendorOrgName, terminationDate,
  } = data.data;

  const monthMapping = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const transformDate = (date) => {
    let newDate = date.split('-').reverse().join('-');
    newDate = new Date(date);
    const day = newDate.getDate();
    const month = monthMapping[newDate.getMonth()];
    const year = newDate.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const redirectUrl = () => {
    const { orgId } = props;
    let vendor = {};
    let subVendor = [];
    vendor = { orgId: source_org };
    if (origin_org !== source_org) {
      vendor = { orgId: source_org };
      subVendor = [{ orgId: origin_org }];
    }
    const payload = {
      client: {},
      superClient: [],
      vendor,
      subVendor,
      deployedTo: '',
      deployedFrom: 'both',
    };
    props.history.push(`/customer-mgmt/org/${orgId}/employee?isActive=false&terminatedFromDate=${terminationDate}&terminatedToDate=${terminationDate}`);
    props.onUpdatePayload(payload);
  };

  return (
    <div className="d-flex">
      <img src={terminationNotificationIcon} alt="terminateIcon" />
      <div className={cx(styles.margin)}>
        <div className={cx(styles.headingLarge)}>
          {empIds.length}
          {' '}
          employees terminated in vendor org
        </div>
        <div className="d-flex justify-content-between">
          <div className={cx(styles.textNormal, styles.textMaxWidth, 'mt-1')}>
            <span className={styles.boldFont}>
              {empIds.length}
              {' '}
              employees
            </span>
            {' '}
            have been terminated in vendor organisation
            {' '}
            <span className={styles.boldFont}>{vendorOrgName}</span>
            {' '}
            on
            {' '}
            <span className={styles.boldFont}>{transformDate(terminationDate)}</span>
          </div>
          <Button
            label="view profiles"
            clickHandler={() => redirectUrl()}
            type="save"
          />
        </div>

      </div>

    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  onUpdatePayload: (payload) => dispatch(empListActions.getFilterPayloadData(payload)),
});

export default withRouter(
  connect(null, mapDispatchToProps)(ClientContractorTerminate),
);
