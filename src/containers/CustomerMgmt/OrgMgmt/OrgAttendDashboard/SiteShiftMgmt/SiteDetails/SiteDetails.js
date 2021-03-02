/* eslint-disable no-nested-ternary */
/* eslint-disable dot-notation */
import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import { Button, Notifier } from 'react-crux';
import { useRouteMatch, useHistory, useLocation } from 'react-router';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Loader from '../../../../../../components/Organism/Loader/Loader';
import ShiftCard from './ShiftCard/ShiftCard';
import ArrowLink from '../../../../../../components/Atom/ArrowLink/ArrowLink';
import styles from './SiteDetails.module.scss';
import scrollStyle from '../../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import addShift from '../../../../../../assets/icons/addShift.svg';
import {
  getAttendSiteDetails,
} from './Store/action';

const initState = {
  isMounted: false,
  showNotification: true,
};

const SiteDetails = () => {
  const [state, setState] = useState(initState);
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const orgId = match.params.uuid;
  const { siteId } = match.params;
  const { isMounted, showNotification } = state;

  const orgMgmtRState = useSelector((rstate) => get(rstate, 'orgMgmt', {}), shallowEqual);
  const shiftDetailsRState = get(orgMgmtRState, 'orgAttendDashboard.siteShiftMgmt.siteDetails', {});
  // const siteDetails = get(shiftDetailsRState, 'shiftDetails', {});
  const siteTagDetails = get(shiftDetailsRState, 'tagDetails', {});
  const shiftList = get(shiftDetailsRState, 'shiftList', {});
  const shiftListState = get(shiftDetailsRState, 'getSiteShiftListState', 'INIT');
  const createShiftRState = get(orgMgmtRState, 'orgAttendDashboard.siteShiftMgmt.createShift', {});
  const shiftDetails = get(createShiftRState, 'shiftDetails', {});

  useEffect(() => {
    if (!isMounted) {
      dispatch(getAttendSiteDetails(orgId, siteId));
    }
    setState((prev) => ({
      ...prev,
      isMounted: true,
    }));
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        showNotification: false,
      }));
    }, 5000);
  }, [isMounted, dispatch, orgId, siteId]);

  const redirectCreateShiftUrl = () => {
    const url = `/customer-mgmt/org/${orgId}/site/${siteId}/shift/add`;
    history.push(url);
  };

  return (
    <div className={cx(styles.alignCenter, scrollStyle.scrollbar)}>
      <div className="pt-2">
        <ArrowLink
          label="all sites"
          url={`/customer-mgmt/org/${orgId}/dashboard/attend/site-shift-mgmt`}
        />
      </div>
      <div className="d-flex flex-row justify-content-between mt-4 pb-3">
        <div className="d-flex flex-column">
          <span className={styles.Heading}>{`${get(siteTagDetails, 'name', '').toLowerCase()}`}</span>
          {/* <span className={cx(styles.subText, 'mt-2')}>
            --- employees, --- functions and --- roles
          </span> */}
        </div>

        <div>
          <Button
            type="newTab"
            label="go to roster"
            clickHandler={() => history.push(`/customer-mgmt/org/${orgId}/site/${siteId}/roaster-mgmt`)}
          />
        </div>

      </div>
      { (get(location, 'state.status', '') === 'success' && showNotification && !isEmpty(shiftDetails))
            && (
              <>
                {get(location, 'state.action', '') === 'deleted'
                  ? (
                    <Notifier type="delete" text={`'${get(shiftDetails, 'shiftName', '')}' shift ${get(location, 'state.action', '')} successfully`} />
                  )
                  : <Notifier type="success" text={`'${get(shiftDetails, 'shiftName', '')}' shift ${get(location, 'state.action', '')} successfully`} />}
              </>
            )}
      <div className="d-flex flex-row justify-content-between" style={{ marginTop: '16px', marginBottom: '24px' }}>
        <span className={styles.sectionHeading}> all shifts </span>
        <Button
          type="add"
          isSecondary
          label="add new shift"
          clickHandler={redirectCreateShiftUrl}
        />
      </div>
      <div className={cx(styles.allShiftContainer, 'row no-gutters')}>
        { shiftListState === 'INIT' || shiftListState === 'LOADING'
          ? (
            <div className="ml-2">
              <Loader type="attendShiftList" />
            </div>
          )
          : isEmpty(shiftList) && shiftListState === 'SUCCESS'
            ? <img src={addShift} className={styles.addShiftIcon} alt="add shift" onClick={redirectCreateShiftUrl} aria-hidden />
            : shiftList.map((shift) => (
              <ShiftCard
                data={shift}
                key={shift['_id']}
              />
            ))}

      </div>
    </div>
  );
};
export default SiteDetails;
