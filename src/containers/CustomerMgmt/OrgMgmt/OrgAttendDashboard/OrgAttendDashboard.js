import React, { useEffect } from 'react';
import cx from 'classnames';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Route, NavLink, Switch } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import styles from './OrgAttendDashboard.module.scss';
import ArrowLink from '../../../../components/Atom/ArrowLink/ArrowLink';

import insight from '../../../../assets/icons/active.svg';
import shiftMgmt from '../../../../assets/icons/shiftMgmt.svg';
import leaveMgmt from '../../../../assets/icons/leaveMgmt.svg';
import muster from '../../../../assets/icons/musterRoll.svg';
import { getDataById } from '../OrgMgmtStore/action';
import SiteShiftMgmt from './SiteShiftMgmt/SiteShiftMgmt';
import CreateShiftForm from './SiteShiftMgmt/CreateShift/CreateShiftForm/CreateShiftForm';

const OrgAttendDashBoard = (props) => {
  const { match } = props;
  const orgId = match.params.uuid;

  const dispatch = useDispatch();
  const { orgData } = useSelector((rState) => get(rState, 'orgMgmt.staticData', {}), shallowEqual);

  useEffect(() => {
    dispatch(getDataById(orgId));
  }, [dispatch, orgId]);

  const handleGetNavLink = (section) => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    let url = `${match.url}/${section}`;
    url = `${url}?${urlSearchParams.toString()}`;
    return url;
  };

  const navLinks = [
    {
      label: 'insights',
      icon: insight,
      url: 'insights',
    },
    {
      label: 'site/shift management',
      icon: shiftMgmt,
      url: 'site-shift-mgmt',
    },
    {
      label: 'leave management',
      icon: leaveMgmt,
      url: 'leave-mgmt',
    },
    {
      label: 'muster roll',
      icon: muster,
      url: 'muster-roll',
    },
  ];

  return (
    <>
      <div className={cx(styles.alignCenter)}>
        <div style={{ width: 'max-content' }}>
          <ArrowLink
            label={!isEmpty(orgData) && orgData.name}
            url={`/customer-mgmt/org/${orgId}/profile`}
          />
        </div>
        <>
          <div className="row  mt-3 px-3">
            {
              navLinks.map((nav) => (
                <div className={cx('pl-0 mr-5 ')} key={nav.label}>
                  <NavLink
                    to={handleGetNavLink(nav.url)}
                    activeClassName={cx(styles.NavLinkfontActive)}
                    className={styles.textDecoration}
                    isActive={(matches, location) => {
                      if (!matches) {
                        return false;
                      }
                      const { pathname } = location;
                      return matches.isExact && pathname.split('/')[6] === nav.url;
                    }}
                  >
                    <span className={styles.NavLinkfont}>
                      <span className={styles.svg}>
                        <img src={nav.icon} alt={nav.label} />
                        <span className="ml-2">{nav.label}</span>
                      </span>
                    </span>
                  </NavLink>
                </div>
              ))
            }
          </div>
          <hr className={cx(styles.hr1)} />
        </>
      </div>
      <div className={styles.scrollContent}>
        <Switch>
          <Route path={`${match.path}/site-shift-mgmt/site/:siteId/shift/add`} exact component={CreateShiftForm} />
          <Route path={`${match.path}/site-shift-mgmt/site/:siteId/shift/:shiftId`} exact component={CreateShiftForm} />
          <Route path={`${match.path}/site-shift-mgmt`} component={SiteShiftMgmt} />
        </Switch>
      </div>
    </>
  );
};

export default OrgAttendDashBoard;
