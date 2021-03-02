/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { useLocation } from 'react-router';
// import { useParams } from 'react-router-dom';
import { get, isEmpty, cloneDeep } from 'lodash';
import styles from './VendorLabel.module.scss';
import themes from '../../../theme.scss';

const initialState = {
  selectedOrg: null,
  orgType: 'org',
};

const VendorLabel = () => {
  const [state, setState] = useState(initialState);
  const { selectedOrg, orgType } = state;

  const location = useLocation();
  // const { uuid } = useParams();

  const associatedListRState = useSelector((rstate) => get(rstate, 'vendorSearch', {}), shallowEqual);
  const {
    associatedList, getAssociatedOrgListState, superClientList, superClientListState,
    subVendorList, subVendorListState,
  } = get(associatedListRState, 'associatedOrgList', {});
  // const orgId = uuid;

  const urlSearchParams = new URLSearchParams(location.search);
  const vendorId = urlSearchParams.get('vendorId');
  const clientId = urlSearchParams.get('clientId');
  const superClientId = urlSearchParams.get('superClientId');
  const subVendorId = urlSearchParams.get('subVendorId');

  useEffect(() => {
    let currentVal = { ...associatedList };
    let type = 'org';
    if (getAssociatedOrgListState === 'SUCCESS') {
      if (vendorId) {
        currentVal = currentVal.vendors.find((org) => org._id === vendorId);
        type = 'vendor';
      } else if (clientId) {
        currentVal = currentVal.clients.find((org) => org._id === clientId);
        type = 'client';
      } else {
        currentVal = currentVal.org;
      }
      setState((prev) => ({
        ...prev,
        selectedOrg: currentVal,
        orgType: type,
      }));
    }

    if (superClientListState === 'SUCCESS') {
      if (superClientId) {
        currentVal = cloneDeep(superClientList);
        currentVal = currentVal.find((org) => org._id === superClientId);
        type = 'superClient';
      }
      setState((prev) => ({
        ...prev,
        selectedOrg: currentVal,
        orgType: type,
      }));
    }

    if (subVendorListState === 'SUCCESS') {
      if (subVendorId) {
        currentVal = cloneDeep(subVendorList);
        currentVal = currentVal.find((org) => org._id === subVendorId);
        type = 'subVendor';
      }
      setState((prev) => ({
        ...prev,
        selectedOrg: currentVal,
        orgType: type,
      }));
    }
  }, [getAssociatedOrgListState, associatedList, clientId, vendorId,
    superClientListState, superClientList, superClientId,
    subVendorListState, subVendorList, subVendorId]);

  const getLabel = () => {
    switch (orgType) {
      case 'vendor': return `${selectedOrg.name}`;
      case 'client': return `${selectedOrg.name}`;
      case 'superClient': return `${selectedOrg.name}`;
      case 'subVendor': return `${selectedOrg.name}`;
      default: return 'my organisation';
    }
  };

  const getSubText = () => {
    switch (orgType) {
      case 'vendor': return 'deployed by';
      case 'client': return 'deployed in';
      case 'superClient': return 'deployed in';
      case 'subVendor': return 'deployed by';
      default: return 'in';
    }
  };

  const getBgColor = () => {
    if (!isEmpty(selectedOrg)) {
      switch (selectedOrg.brandColor) {
        case '#262D33': return themes.black1Theme;
        case '#0059B2': return themes.blueTheme;
        case '#88ABD3': return themes.greyTheme;
        case '#4BB752': return themes.greenTheme;
        case '#FFB803': return themes.yellowTheme;
        case '#7C2E9E': return themes.purpleTheme;
        case '#EE3942': return themes.redTheme;
        case '#8D6D55': return themes.brownTheme;
        case '#A84567': return themes.black2Theme;
        default: return themes.defaultTheme;
      }
    } else return themes.defaultTheme;
  };

  const handleOrgLogo = (orgName) => {
    let updatedShortName = orgName.split(' ');
    if (updatedShortName.length === 1) {
      updatedShortName = updatedShortName[0].substr(0, 2);
    } else if (updatedShortName.length > 1) {
      updatedShortName = updatedShortName[0].substr(0, 1) + updatedShortName[1].substr(0, 1);
    }
    return updatedShortName;
  };

  return (
    <div className={styles.labelBg} style={{ backgroundColor: getBgColor() }}>
      <div
        className={styles.orgBadge}
        style={{ backgroundColor: !isEmpty(selectedOrg) && selectedOrg.brandColor }}
      >
        {!isEmpty(selectedOrg) && !isEmpty(selectedOrg.name)
          && handleOrgLogo(selectedOrg.name.toLowerCase())}
      </div>
      <div className={styles.alignText}>
        <span className={styles.text}>
          configuration for employees
          {' '}
          {getSubText()}
          {' '}
        </span>
        <span
          className={styles.textSecondary}
          style={{ color: !isEmpty(selectedOrg) && selectedOrg.brandColor }}
        >
          {getLabel()}
        </span>
      </div>
    </div>
  );
};

export default VendorLabel;
