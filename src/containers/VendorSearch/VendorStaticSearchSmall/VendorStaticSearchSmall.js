/* eslint-disable no-nested-ternary */
import React, {
  useState, useEffect, useRef,
} from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { get, isEmpty, cloneDeep } from 'lodash';

import cx from 'classnames';
import styles from './VendorStaticSearchSmall.module.scss';

import { getAssociatedOrgList } from '../Store/action';

import search from '../../../assets/icons/search.svg';
import clearSearch from '../../../assets/icons/closeNotification.svg';
import scrollStyle from '../../../components/Atom/ScrollBar/ScrollBar.module.scss';

const initialState = {
  showList: false,
  selectClientName: '',
  selectClient: '',
  list: {},
};

const VendorStaticSearchSmall = (props) => {
  const [state, setState] = useState(initialState);
  const {
    list, showList, selectClientName,
  } = state;
  const associatedListRState = useSelector((rstate) => get(rstate, 'vendorSearch', {}), shallowEqual);

  const dispatch = useDispatch();
  const { uuid } = useParams();
  const location = useLocation();

  const {
    orgId, showOnly, getAssociatedOrgs, associatedOrgIdUrl, selectedOrgName, type,
  } = props;

  const organisationId = !isEmpty(orgId) ? orgId : uuid;

  const {
    associatedList, getAssociatedOrgListState,
  } = get(associatedListRState, 'associatedOrgList', {});

  const usePrevious = (value) => {
    const ref = useRef();

    useEffect(() => {
      ref.current = value;
    }, [value]);

    return ref.current;
  };

  const getPrevAssociatedOrgs = usePrevious(getAssociatedOrgs);
  const prevSelectedOrgName = usePrevious(selectedOrgName);

  useEffect(() => {
    if (getAssociatedOrgs) {
      dispatch(getAssociatedOrgList(organisationId, showOnly, associatedOrgIdUrl));
    }
  }, [dispatch, organisationId, showOnly, getAssociatedOrgs, associatedOrgIdUrl]);

  useEffect(() => {
    if (!isEmpty(getPrevAssociatedOrgs && (getPrevAssociatedOrgs !== getAssociatedOrgs)
          && getAssociatedOrgs)) {
      dispatch(getAssociatedOrgList(organisationId, showOnly, associatedOrgIdUrl));
    }
  }, [dispatch, organisationId, showOnly, getPrevAssociatedOrgs,
    getAssociatedOrgs, associatedOrgIdUrl]);

  useEffect(() => {
    if (prevSelectedOrgName !== selectedOrgName) {
      setState({
        ...state,
        selectClientName: selectedOrgName,
      });
    }
  }, [state, selectClientName, prevSelectedOrgName, selectedOrgName]);

  useEffect(() => {
    if (getAssociatedOrgListState === 'SUCCESS' && getAssociatedOrgs) {
      setState((prev) => ({
        ...prev,
        list: associatedList,
      }));
    }
  }, [getAssociatedOrgListState, associatedList, orgId, location, getAssociatedOrgs]);

  const handleInputChange = (event) => {
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
      selectClientName: searchKey,
      showList: !isEmpty(searchKey),
      list: updatedList,
    });
  };

  const handleSelectedValue = (item, inputIdentifier) => {
    if (inputIdentifier === 'client') {
      setState({
        ...state,
        selectClientName: item.name,
        selectClient: item._id,
        showList: false,
      });
      props.handleSelectedValue(item, type);
    }
  };

  const handleClearInput = () => {
    setState({
      ...state, selectClientName: '', selectClient: {}, showList: false,
    });
    props.handleClearInput(type);
  };

  return (
    <>
      <div className={cx('row no-gutters py-1 px-2', styles.SearchBar)}>
        <img src={search} className={styles.SearchIcon} alt="" />
        <input
          className={cx('pl-2', styles.SearchQuery)}
          placeholder={`search a ${type} here`}
          value={selectClientName}
          onChange={(e) => handleInputChange(e, 'client')}
          onPaste={(e) => handleInputChange(e, 'client')}
        />
        {selectClientName !== ''
          ? (
            <span role="button" aria-hidden className={cx('ml-auto', styles.Cursor)} onClick={() => handleClearInput('client')}>
              <img src={clearSearch} alt="" />
            </span>
          ) : null}
      </div>
      {showList
        ? !isEmpty(list[`${type}s`])
          ? (
            <div className="row no-gutters">
              <div className={cx(scrollStyle.scrollbar, styles.SearchDropdown)}>
                {list[`${type}s`].map((item) => (
                  <div
                    key={item.name}
                    className={cx(styles.Cursor, styles.Option)}
                    onClick={() => handleSelectedValue(item, 'client')}
                    onKeyDown={() => handleSelectedValue(item, 'client')}
                    role="button"
                    aria-hidden
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          )
          : (
            <div className="row no-gutters">
              <div
                className={cx(scrollStyle.scrollbar,
                  styles.SearchDropdown, styles.Option)}
              >
                no
                {' '}
                {`${type}s`}
                {' '}
                found
              </div>
            </div>
          )
        : null}
    </>
  );
};

export default VendorStaticSearchSmall;
