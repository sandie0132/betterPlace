/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { useParams } from 'react-router-dom';
import { get, isEmpty, cloneDeep } from 'lodash';
import cx from 'classnames';
import styles from './VendorDropdown.module.scss';
import arrowDown from '../../../assets/icons/orgProfileArrow.svg';
import arrowUp from '../../../assets/icons/dropdownArrow.svg';
import { getAssociatedOrgList, getSubVendor } from '../Store/action';

/**
 * "VendorDropDown to show and select from associated orgs"
 * NOTE: All the props mentioned below are optional, the default behaviour of this component
 * is to read target orgId from URL and upon selection put clientId or vendorId in the
 * URL as query parameter.
 * @orgId {string} target orgId for getting associated orgs. (if not passed the component
 * will expect this to be present in URL as path param(uuid).)
 * @vendorId {string} selected vendorId for showing in drop-down (if not passed the component
 * will expect this to be present in URL as query param.)
 * @clientId {string} selected clientId for showing in drop-down. (if not passed the component
 * will expect this to be present in URL as query param.)
 * @onSelect {function} if passed, this function will return: orgType[org, vendor, client]
 * and selected org object.
 * @showOnly {string} possible values: ('vendor', 'client'). pass this to only show vendor or client
 * orgs in drop-down options.
 * @showIcon {boolean} pass this to show badge with selected-org brand color and intials
 * next to drop-down.
 * @orgHeading {string} pass this to override default heading shown on top of current org
 * in drop-down.
 * @vendorHeading {string} pass this to override default heading shown on top of vendors
 * in drop-down.
 * @clientHeading {string} pass this to override default heading shown on top of clients
 * in drop-down.
 * @subVendorHeading {string} pass this to override default heading shown on top of sub vendors
 * in drop-down.
 * @superlcientHeading {string} pass this to override default heading shown on top of super clients
 * in drop-down.
 */

const defaultMyOrgHeading = 'view configuration for my org';
const defaultVendorHeading = 'view configuration made by vendor';
const defaultClientHeading = 'view configuration made for my client';
const defaultSuperClientHeading = 'view configuration for my super client';
const defaultSubVendorHeading = 'view configuration for my sub vendor';

const initialState = {
  showDropDown: false,
  selectedOrg: null,
  orgType: 'org',
  key: '',
  list: {},
  superClientList: [],
  subVendorList: [],
};

const VendorDropdown = (props) => {
  const [state, setState] = useState(initialState);
  const {
    showDropDown, selectedOrg, orgType, key, list,
  } = state;
  const {
    orgId, showIcon, showOnly, orgHeading, vendorHeading, clientHeading,
    subVendorHeading, superClientHeading, onSelect, vendorId, clientId, type,
  } = props;

  const refer = useRef();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { uuid } = useParams();

  const associatedListRState = useSelector((rstate) => get(rstate, 'vendorSearch', {}), shallowEqual);
  const {
    associatedList, getAssociatedOrgListState, superClientList, superClientListState,
    subVendorList, subVendorListState,
  } = get(associatedListRState, 'associatedOrgList', {});
  const organisationId = !isEmpty(orgId) ? orgId : uuid;

  const useOnClickOutside = (ref, handler) => {
    useEffect(
      () => {
        const listener = (event) => {
          if (!ref.current || ref.current.contains(event.target)) {
            return;
          }
          handler(event);
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        return () => {
          document.removeEventListener('mousedown', listener);
          document.removeEventListener('touchstart', listener);
        };
      },
      [ref, handler],
    );
  };

  useOnClickOutside(refer, () => setState({
    ...state,
    showDropDown: false,
    key: '',
    list: cloneDeep(associatedList),
  }));

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(location.search);
    const selectedClient = !isEmpty(clientId) ? clientId : urlSearchParams.get('clientId');
    const selectedVendor = !isEmpty(vendorId) ? vendorId : urlSearchParams.get('vendorId');
    if (type === 'secondary') {
      if (!isEmpty(selectedClient)) {
        dispatch(getSubVendor(organisationId, selectedClient, 'client'));
      } else if (!isEmpty(selectedVendor)) {
        dispatch(getSubVendor(organisationId, selectedVendor, 'vendor'));
      }
    } else {
      dispatch(getAssociatedOrgList(organisationId, showOnly));
    }
  }, [dispatch, organisationId, showOnly, clientId, vendorId, location, type]);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(location.search);
    if (type === 'primary' && getAssociatedOrgListState === 'SUCCESS') {
      let currentVal = cloneDeep(associatedList);
      let updatedOrgType = 'org';
      if ((urlSearchParams.get('vendorId') || !isEmpty(vendorId))) {
        const selectedVendor = !isEmpty(vendorId) ? vendorId : urlSearchParams.get('vendorId');
        currentVal = currentVal.vendors.find((org) => org._id === selectedVendor);
        updatedOrgType = 'vendor';
      } else if ((urlSearchParams.get('clientId') || !isEmpty(clientId))) {
        const selectedClient = !isEmpty(clientId) ? clientId : urlSearchParams.get('clientId');
        currentVal = currentVal.clients.find((org) => org._id === selectedClient);
        updatedOrgType = 'client';
      } else {
        currentVal = currentVal.org;
      }
      setState((prev) => ({
        ...prev,
        selectedOrg: currentVal,
        orgType: updatedOrgType,
        list: associatedList,
      }));
    }
  }, [getAssociatedOrgListState, associatedList, orgId, clientId,
    vendorId, location, type]);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(location.search);

    if (type === 'secondary') {
      if (superClientListState === 'SUCCESS') {
        let currentVal = '';
        let updatedOrgType = orgType;
        if (urlSearchParams.get('superClientId')) {
          currentVal = cloneDeep(superClientList);
          updatedOrgType = 'superClient';
          const selectedSuperClientId = urlSearchParams.get('superClientId');
          currentVal = currentVal.find((org) => org._id === selectedSuperClientId);
        }
        setState((prev) => ({
          ...prev,
          selectedOrg: currentVal,
          orgType: updatedOrgType,
          superClientList,
        }));
      }
    }
  }, [superClientListState, superClientList, location, orgType, type]);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(location.search);
    if (type === 'secondary') {
      if (subVendorListState === 'SUCCESS') {
        let currentVal = '';
        let updatedOrgType = orgType;
        if (urlSearchParams.get('subVendorId')) {
          currentVal = cloneDeep(subVendorList);
          updatedOrgType = 'subVendor';
          const selectedSubVendorId = urlSearchParams.get('subVendorId');
          currentVal = currentVal.find((org) => org._id === selectedSubVendorId);
        }
        setState((prev) => ({
          ...prev,
          selectedOrg: currentVal,
          orgType: updatedOrgType,
          subVendorList,
        }));
      }
    }
  }, [subVendorListState, subVendorList, location, orgType, type]);

  const handleDropDown = () => {
    let updatedKey = key;
    let updatedList = cloneDeep(list);
    if (showDropDown) {
      updatedKey = '';
      updatedList = cloneDeep(associatedList);
    }
    setState({
      ...state,
      showDropDown: !showDropDown,
      key: updatedKey,
      list: updatedList,
    });
  };

  const handleSelectOrg = (orgTypeName, org) => {
    if (onSelect) {
      onSelect(orgTypeName, org);
    } else {
      const urlSearchParams = new URLSearchParams(location.search);
      if (orgTypeName === 'vendor') {
        if (urlSearchParams.get('superClientId')) urlSearchParams.delete('superClientId');
        if (urlSearchParams.get('subVendorId')) urlSearchParams.delete('subVendorId');
        urlSearchParams.delete('clientId');
        urlSearchParams.set('vendorId', org._id);
      } else if (orgTypeName === 'client') {
        if (urlSearchParams.get('superClientId')) urlSearchParams.delete('superClientId');
        if (urlSearchParams.get('subVendorId')) urlSearchParams.delete('subVendorId');
        urlSearchParams.delete('vendorId');
        urlSearchParams.set('clientId', org._id);
      } else if (orgTypeName === 'superClient') {
        urlSearchParams.delete('vendorId');
        urlSearchParams.set('superClientId', org._id);
      } else if (orgTypeName === 'subVendor') {
        urlSearchParams.delete('clientId');
        urlSearchParams.set('subVendorId', org._id);
      } else {
        if (urlSearchParams.get('vendorId')) urlSearchParams.delete('vendorId');
        if (urlSearchParams.get('clientId')) urlSearchParams.delete('clientId');
        if (urlSearchParams.get('superClientId')) urlSearchParams.delete('superClientId');
        if (urlSearchParams.get('subVendorId')) urlSearchParams.delete('subVendorId');
      }
      history.push({
        search: `?${urlSearchParams.toString()}`,
      });
      if (props.onChange) props.onChange(orgTypeName, org);
    }

    setState({
      ...state,
      showDropDown: false,
      selectedOrg: org,
      orgType: orgTypeName,
    });
  };

  const getOrgType = () => {
    switch (orgType) {
      case 'client': return 'my client';
      case 'vendor': return 'my vendor';
      default: return 'my organisation';
    }
  };

  const shortenDisplayName = (displayName) => {
    if (displayName.length > 14) {
      const updatedDisplayName = `${displayName.substring(0, 14)}...`;
      return (updatedDisplayName);
    }
    return (displayName);
  };

  const handleSearch = (event) => {
    const searchKey = event.target.value;
    const updatedList = cloneDeep(associatedList);
    const regex = new RegExp(searchKey, 'i');
    if (!isEmpty(updatedList)) {
      if (!isEmpty(updatedList.vendors)) {
        updatedList.vendors = updatedList.vendors.filter((org) => org.name.match(regex));
      }
      if (!isEmpty(updatedList.clients)) {
        updatedList.clients = updatedList.clients.filter((org) => org.name.match(regex));
      }
      if (!isEmpty(updatedList.org) && !updatedList.org.name.match(regex)) {
        delete updatedList.org;
      }
    }
    setState({
      ...state,
      key: searchKey,
      list: updatedList,
    });
  };

  const handleDisabled = () => {
    let isDisabled = false;
    const urlSearchParams = new URLSearchParams(location.search);
    if (type === 'secondary') {
      if (urlSearchParams.get('clientId')) {
        isDisabled = isEmpty(superClientList);
      } else if (urlSearchParams.get('vendorId')) {
        isDisabled = isEmpty(subVendorList);
      } else {
        isDisabled = true;
      }
    }
    return isDisabled;
  };

  const urlSearchParams = new URLSearchParams(location.search);

  return (
    <div className={styles.relative}>
      {
        !showDropDown
          ? (
            <div className={styles.relative}>
              {
                showIcon && (
                  <div
                    className={styles.orgBadge}
                    style={{ backgroundColor: !isEmpty(selectedOrg) && selectedOrg.brandColor }}
                  >
                    {!isEmpty(selectedOrg) && selectedOrg.name.substring(0, 2)}
                  </div>
                )
              }
              <div
                onClick={() => handleDropDown()}
                aria-hidden
                className={cx(showIcon && styles.paddingLeft, styles.dropdownOption, 'd-flex')}
                disabled={handleDisabled()}
              >
                {type === 'secondary'
                  ? (
                    <>
                      {isEmpty(selectedOrg)
                        && (
                        <span className={styles.secondaryText}>
                          {urlSearchParams.get('vendorId') && 'select sub vendor'}
                          {urlSearchParams.get('clientId') && 'select super client'}
                          {!urlSearchParams.get('vendorId') && !urlSearchParams.get('clientId') && 'select super client/ sub vendor'}
                        </span>
                        )}
                      {!isEmpty(selectedOrg) && shortenDisplayName(selectedOrg.name)}
                    </>
                  )
                  : (
                    <>
                      {!isEmpty(selectedOrg) && shortenDisplayName(selectedOrg.name)}
                      &nbsp;
                      (
                      {getOrgType()}
                      )
                    </>
                  )}
                <div className="ml-auto"><img src={arrowDown} alt="arrow" className="ml-auto" /></div>
              </div>
            </div>
          )
          : (
            <>
              <div className={styles.dropdownMenu} ref={refer}>
                <div onClick={() => handleDropDown()} aria-hidden className={cx('d-flex', styles.currentHeading)}>
                  {type === 'secondary'
                    ? 'select super client'
                    : (
                      <>
                        {!isEmpty(selectedOrg) && shortenDisplayName(selectedOrg.name)}
                        &nbsp;
                        (
                        {getOrgType()}
                        )
                      </>
                    )}
                  <div className="ml-auto">
                    <img src={arrowUp} alt="arrow" />
                  </div>
                </div>
                <hr className={styles.horizontalLine} />
                <input
                  placeholder="search here"
                  className={styles.searchBox}
                  onChange={(event) => handleSearch(event)}
                  value={key || ''}
                />

                <div className={styles.maxHeight}>
                  {type === 'secondary'
                    ? (
                      <>
                        {urlSearchParams.get('vendorId')
                          && (
                          <>
                            {!isEmpty(subVendorList)
                            && (
                              <div className={styles.relative}>
                                <div className={styles.ddHeading}>
                                  {!isEmpty(subVendorHeading)
                                    ? subVendorHeading : defaultSubVendorHeading}
                                </div>
                              </div>
                            )}
                            { !isEmpty(subVendorList)
                            && subVendorList.map((org) => (
                              <div
                                onClick={() => handleSelectOrg('subVendor', org)}
                                aria-hidden
                                key={org._id}
                                className={styles.ddOption}
                              >
                                {org.name}
                              </div>
                            ))}
                          </>
                          )}

                        {urlSearchParams.get('clientId')
                        && (
                        <>
                          {!isEmpty(superClientList)
                          && (
                            <div className={styles.relative}>
                              <div className={styles.ddHeading}>
                                {!isEmpty(superClientHeading)
                                  ? superClientHeading : defaultSuperClientHeading}
                              </div>
                            </div>
                          )}
                          { !isEmpty(superClientList)
                            && superClientList.map((org) => (
                              <div
                                onClick={() => handleSelectOrg('superClient', org)}
                                aria-hidden
                                key={org._id}
                                className={styles.ddOption}
                              >
                                {org.name}
                              </div>
                            ))}
                        </>
                        )}
                      </>
                    )
                    : (!isEmpty(list))
                    && (
                      <>
                        {!isEmpty(list.org)
                        && (
                          <div className={styles.relative}>
                            <div className={styles.ddHeading}>
                              {!isEmpty(orgHeading) ? orgHeading : defaultMyOrgHeading}
                            </div>
                          </div>
                        )}
                        {!isEmpty(list.org)
                        && (
                          <div onClick={() => handleSelectOrg('org', list.org)} aria-hidden className={styles.ddOption}>
                            {list.org.name}
                          </div>
                        )}
                        {!isEmpty(list.vendors)
                        && (
                          <div className={styles.relative}>
                            <div className={styles.ddHeading}>
                              {!isEmpty(vendorHeading) ? vendorHeading : defaultVendorHeading}
                            </div>
                          </div>
                        )}
                        {!isEmpty(list.vendors) && list.vendors.map((org) => (
                          <div onClick={() => handleSelectOrg('vendor', org)} aria-hidden key={org._id} className={styles.ddOption}>{org.name}</div>
                        ))}
                        {!isEmpty(list.clients)
                        && (
                          <div className={styles.relative}>
                            <div className={styles.ddHeading}>
                              {!isEmpty(clientHeading) ? clientHeading : defaultClientHeading}
                            </div>
                          </div>
                        )}
                        {!isEmpty(list.clients) && list.clients.map((org) => (
                          <div onClick={() => handleSelectOrg('client', org)} aria-hidden key={org._id} className={styles.ddOption}>{org.name}</div>
                        ))}
                      </>
                    )}
                </div>
              </div>
              <div className={styles.height} />
            </>

          )
      }
    </div>
  );
};

export default VendorDropdown;
