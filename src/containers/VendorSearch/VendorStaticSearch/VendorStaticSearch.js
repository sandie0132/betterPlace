/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, {
  useState, useEffect, useRef,
} from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { get, isEmpty, cloneDeep } from 'lodash';

import cx from 'classnames';
import styles from './VendorStaticSearch.module.scss';

import { getAssociatedOrgList } from '../Store/action';

import search from '../../../assets/icons/search.svg';
import clearSearch from '../../../assets/icons/closeNotification.svg';
import scrollStyle from '../../../components/Atom/ScrollBar/ScrollBar.module.scss';

const initialState = {
  selectedOrg: '',
  showList: false,
  selectClientName: '',
  selectClient: '',
  list: {},
};

const VendorStaticSearch = (props) => {
  const [state, setState] = useState(initialState);
  const {
    list, selectedOrg, showList, selectClientName, selectClient,
  } = state;
  const associatedListRState = useSelector((rstate) => get(rstate, 'vendorSearch', {}), shallowEqual);

  const dispatch = useDispatch();
  const { uuid } = useParams();
  const location = useLocation();

  const {
    orgId, showOnly, getAssociatedOrgs, label, required, hideInput,
    isDisabled, disableIfEmpty, associatedOrgIdUrl, inputClassName,
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
    if (getAssociatedOrgListState === 'SUCCESS' && getAssociatedOrgs) {
      setState((prev) => ({
        ...prev,
        list: associatedList,
      }));
    }
  }, [getAssociatedOrgListState, associatedList, orgId, location, getAssociatedOrgs]);

  const handleInputChange = (event) => {
    const searchKey = event.target.value;
    const updatedList = cloneDeep(list);
    const regex = new RegExp(searchKey, 'i');
    if (!isEmpty(updatedList.org) && !updatedList.org.name.match(regex)) {
      delete updatedList.org;
    }
    setState({
      ...state,
      selectClientName: searchKey,
      showList: !isEmpty(searchKey),
      list: updatedList,
    });
  };

  const handleSelectedValue = (item) => {
    let showInputVal = '';
    if (!hideInput) {
      showInputVal = item.name;
    }
    setState({
      ...state,
      selectClientName: showInputVal,
      selectClient: item._id,
      showList: false,
    });
    props.handleSelectedValue(item, showOnly);
  };

  const handleClearInput = () => {
    setState({
      ...state, selectClientName: '', selectClient: {}, showList: false,
    });
    props.handleSelectedValue({}, showOnly);
  };

  const regex = new RegExp(selectClientName, 'i');

  return (
    <>
      {
      !isEmpty(label)
      && (
      <div className="d-flex flex-row mt-4" disabled={isDisabled || disableIfEmpty ? isEmpty(list[`${showOnly}s`]) : false}>
        <span className={cx(styles.GreyHeading, 'mb-1')}>
          {label}
          &nbsp;
          {required ? <span className={styles.requiredStar}>*</span> : null}
        </span>
      </div>
      )
      }
      <div
        className={cx(styles.SearchBorder)}
        disabled={isDisabled || disableIfEmpty ? isEmpty(list[`${showOnly}s`]) : false}
      >
        <img src={search} style={{ height: '20px' }} alt="" />
        <input
          type="text"
          placeholder={`search a ${showOnly} here`}
          value={!isDisabled ? selectClientName : ''}
          onChange={(e) => handleInputChange(e, showOnly)}
          onPaste={(e) => handleInputChange(e, showOnly)}
          className={cx('pl-2', styles.NoBorder, inputClassName, isDisabled && styles.disabledInput)}
          disabled={isDisabled}
        />
        {(selectedOrg !== '' || !isEmpty(selectClient)) && !hideInput
          ? (
            <span className={cx('ml-auto', styles.Cursor)} onClick={() => handleClearInput()} onKeyDown={() => handleClearInput()}>
              <img src={clearSearch} alt="" />
            </span>
          ) : null}
      </div>
      {showList && !isEmpty(list[`${showOnly}s`])
        ? (
          <div className="row no-gutters">
            <div className={cx(scrollStyle.scrollbar, styles.SearchDropdown)}>
              {list[`${showOnly}s`].map((item) => (
                <div key={item.name}>
                  {!isEmpty(selectClientName) && item.name.match(regex) && (
                    <div
                      className={cx(styles.Cursor, styles.Option)}
                      onClick={() => handleSelectedValue(item, showOnly)}
                      onKeyDown={() => handleSelectedValue(item, showOnly)}
                    >
                      {item.name}
                    </div>
                  )}
                  {isEmpty(selectClientName) && (
                    <div
                      className={cx(styles.Cursor, styles.Option)}
                      onClick={() => handleSelectedValue(item, showOnly)}
                      onKeyDown={() => handleSelectedValue(item, showOnly)}
                    >
                      {item.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
        : null}
    </>
  );
};

export default VendorStaticSearch;
