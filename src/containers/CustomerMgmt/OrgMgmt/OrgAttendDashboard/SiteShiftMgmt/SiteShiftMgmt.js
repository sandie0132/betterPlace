/* eslint-disable no-underscore-dangle */
import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import { useHistory, useLocation } from 'react-router';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { Notifier, Button } from 'react-crux';
import { Link } from 'react-router-dom';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import cx from 'classnames';
import styles from './SiteShiftMgmt.module.scss';
import TagSearchField from '../../../../TagSearch/TagSearchField/TagSearchField';
import scrollStyle from '../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import Checkbox from '../../../../../components/Atom/CheckBox/CheckBox';
import Paginator from '../../../../../components/Organism/Paginator/Paginator';
import clear from '../../../../../assets/icons/resetBlue.svg';
import close from '../../../../../assets/icons/crossIcon.svg';
import sort from '../../../../../assets/icons/sortIcon.svg';
import addNewShift from '../../../../../assets/icons/createFolder.svg';
import arrow from '../../../../../assets/icons/blueArrow.svg';
import dash from '../../../../../assets/icons/dash.svg';
import Loader from '../../../../../components/Organism/Loader/Loader';
import CreateShiftPopup from './CreateShift/CreateShiftPopup/CreateShiftPopup';
import {
  getAttendSiteList, getAttendSiteCount, getTagInfo, initState,
} from './Store/action';
import { initState as shiftInit } from './CreateShift/Store/action';

const initialState = {
  filterTags: [],
  selectedSites: [],
  selectAllSites: false,
  showSelectAll: false,
  showShiftPopUp: false,
  showNotification: false,
};

const PAGE_SIZE = 10;

const SiteShiftMgmt = (props) => {
  const _isMounted = useRef(true);
  const [state, setState] = useState(initialState);
  const {
    filterTags, selectedSites, selectAllSites, showSelectAll, showShiftPopUp,
    showNotification,
  } = state;

  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const orgMgmtRState = useSelector((rstate) => get(rstate, 'orgMgmt', {}), shallowEqual);

  const { match } = props;
  const orgId = match.params.uuid;
  const redirectBasePath = `/customer-mgmt/org/${orgId}/dashboard/attend/site-shift-mgmt`;

  const {
    dataCount, getAttendSiteCountState, siteList, getAttendSiteListState, tagList, postTagInfoState,
  } = get(orgMgmtRState, 'orgAttendDashboard.siteShiftMgmt.siteShiftMgmt', {});

  const { postShiftDetailsByIdState, shiftDetails } = get(orgMgmtRState, 'orgAttendDashboard.siteShiftMgmt.createShift', {});

  useEffect(() => {
    const targetUrl = location.search;
    const urlSearchParams = new URLSearchParams(targetUrl);
    const tags = urlSearchParams.get('tags');
    if (tags != null && tags.length !== 0) {
      dispatch(getTagInfo(tags.split(',')));
    }
    dispatch(getAttendSiteCount(orgId, targetUrl));
  }, [orgId, dispatch, location]);

  useEffect(() => () => {
    dispatch(initState());
    dispatch(shiftInit());
    _isMounted.current = false;
  }, [dispatch]);

  const handleNewTab = () => {
    history.push(`/customer-mgmt/org/${orgId}/attendconfig/site-config`);
  };

  const handleTagIdUrl = (filters) => {
    const urlSearchParams = new URLSearchParams();
    if (!isEmpty(filters)) {
      let filterTagsUuid = filters.map((tag) => tag.uuid);
      filterTagsUuid = Array.from(filterTagsUuid).join(',');
      urlSearchParams.set('tags', filterTagsUuid);
    }
    history.push({
      pathname: redirectBasePath,
      search: `?${urlSearchParams.toString()}`,
    });
  };

  useEffect(() => {
    if (getAttendSiteCountState === 'SUCCESS') {
      const targetUrl = location.search;
      if (dataCount > PAGE_SIZE) {
        if (location.search.includes('pageNumber')) {
          dispatch(getAttendSiteList(orgId, targetUrl, PAGE_SIZE));
        } else {
          let redirectPath = '';
          if (location.search.length !== 0) {
            redirectPath = `/customer-mgmt/org/${orgId}/dashboard/attend/site-shift-mgmt${location.search}&pageNumber=1`;
          } else {
            redirectPath = `/customer-mgmt/org/${orgId}/dashboard/attend/site-shift-mgmt?pageNumber=1`;
          }
          history.push(redirectPath);
        }
      } else if (location.search.includes('pageNumber')) {
        const regex = /(?:pageNumber=)([0-9]+)/;
        const newSearchPath = location.search.replace(regex, '');
        const redirectPath = `/customer-mgmt/org/${orgId}/dashboard/attend/site-shift-mgmt${newSearchPath}`;
        history.push(redirectPath);
      } else {
        dispatch(getAttendSiteList(orgId, targetUrl, PAGE_SIZE));
      }
    }
  }, [getAttendSiteCountState, dataCount, orgId, dispatch, history, location.search]);

  const handleUrlToState = useCallback(() => {
    setState((prev) => ({
      ...prev,
      filterTags: tagList,
    }));
  }, [tagList]);

  useEffect(() => {
    if (postTagInfoState === 'SUCCESS') {
      handleUrlToState();
    }
  }, [postTagInfoState, handleUrlToState]);

  useEffect(() => {
    if ((postShiftDetailsByIdState === 'SUCCESS') || (postShiftDetailsByIdState === 'ERROR')) {
      setState((prev) => ({
        ...prev,
        showNotification: true,
        selectAllSites: false,
        showSelectAll: false,
        selectedSites: [],
        showShiftPopUp: false,
        notificationType: postShiftDetailsByIdState,
      }));
      setTimeout(() => {
        if (_isMounted.current) {
          setState((prev) => ({
            ...prev,
            showNotification: false,
          }));
        }
      }, 5000);
    }
  }, [postShiftDetailsByIdState]);

  const handleTagInput = (event, action) => {
    let updatedFilterTags = [...filterTags];
    if (action === 'add') {
      updatedFilterTags = [
        ...updatedFilterTags.slice(0),
        event.value,
      ];
    } else if (action === 'delete') {
      updatedFilterTags = updatedFilterTags.filter((tag) => tag.uuid !== event.value.uuid);
    }
    setState({
      ...state,
      filterTags: updatedFilterTags,
    });
    handleTagIdUrl(updatedFilterTags);
  };

  const handleClearFilters = () => {
    setState({
      ...state,
      filterTags: [],
    });
    handleTagIdUrl([]);
  };

  const handleSortByCity = () => {
    const targetUrl = location.search;
    const urlSearchParams = new URLSearchParams(targetUrl);
    const sortBy = urlSearchParams.get('sortBy');
    const orderBy = urlSearchParams.get('orderBy');
    if (sortBy != null) {
      if (orderBy === 'ASC') {
        urlSearchParams.set('orderBy', 'DESC');
      } else if (orderBy === 'DESC') {
        urlSearchParams.set('orderBy', 'ASC');
      } else {
        urlSearchParams.set('orderBy', 'ASC');
      }
    } else {
      urlSearchParams.set('sortBy', 'cityName');
      urlSearchParams.set('orderBy', 'ASC');
    }

    history.push({
      pathname: redirectBasePath,
      search: `?${urlSearchParams.toString()}`,
    });
  };

  const toggleSelectSite = (id, clearAll) => {
    let selectedId = [...selectedSites];

    if (!clearAll) {
      if (selectedId.includes(id)) {
        selectedId = selectedId.filter((sites) => sites !== id);
      } else {
        selectedId.push(id);
      }
      setState({
        ...state,
        selectedSites: selectedId,
        showSelectAll: false,
      });
    } else {
      selectedId = [];
      setState({
        ...state,
        showSelectAll: false,
        selectAllSites: false,
        selectedSites: selectedId,
      });
    }
  };
  const handlePageSelectStatus = () => {
    const selectSite = [...selectedSites];
    let status = null;
    let count = 0;
    if (!isEmpty(siteList)) {
      siteList.forEach((site) => {
        if (selectSite.includes(site.siteId)) {
          count += 1;
        }
      });
    }

    if (!isEmpty(siteList) && count === siteList.length && count !== 0) {
      status = 'all-selected';
    } else if (count > 0) {
      status = 'some-selected';
    }
    return status;
  };

  const handleSelectCheckBox = () => {
    const selectedSiteArray = [...selectedSites];
    let updatedSelectedSiteList = [...selectedSiteArray];
    const pageSelectStatus = handlePageSelectStatus();
    let showSelectAllOption = false;

    if (!isEmpty(siteList)) {
      if (pageSelectStatus === null) {
        siteList.forEach((site) => {
          if (!selectedSiteArray.includes(site.siteId)) {
            updatedSelectedSiteList.push(site.siteId);
          }
        });
        if (dataCount > updatedSelectedSiteList.length) showSelectAllOption = true;
      } else {
        siteList.forEach((site) => {
          if (selectedSiteArray.includes(site.siteId)) {
            updatedSelectedSiteList = updatedSelectedSiteList.filter(
              (siteId) => siteId !== site.siteId,
            );
          }
        });
      }
    }

    setState({
      ...state,
      selectedSites: updatedSelectedSiteList,
      showSelectAll: showSelectAllOption,
    });
  };

  const toggleSelectAllSite = () => {
    setState({
      ...state,
      selectAllSites: !selectAllSites,
    });
  };

  const handleTotalCount = () => {
    if (selectAllSites) {
      return dataCount;
    }
    return selectedSites.length;
  };

  const toggleShiftPopUp = () => {
    setState({
      ...state,
      showShiftPopUp: !showShiftPopUp,
    });
  };

  const handleNotification = () => {
    switch (postShiftDetailsByIdState) {
      case 'SUCCESS':
        return {
          text: `"${shiftDetails.shiftName}" shift has been created successfully for ${shiftDetails.count} sites`,
          type: 'success',
        };
      case 'ERROR':
        return {
          text: 'error occurred while creating shift',
          type: 'error',
        };
      default:
        return {
          text: '',
          type: '',
        };
    }
  };

  const filterTagsUuid = filterTags.map((tag) => tag.uuid);

  return (
    <>
      <div className="row mx-0 px-0">
        <div className={styles.headingLarge}>
          all configured sites
        </div>
        <div className="ml-auto">
          <Button label="configure new sites" type="newTab" isSecondary clickHandler={() => handleNewTab()} />
        </div>
      </div>
      <div className={styles.configFilterCard}>
        <TagSearchField
          name="location"
          className={cx(styles.tagInputField, 'col-12')}
          placeholder="search for any tags and filter configured sites"
          orgId={orgId}
          category="geographical"
          disableTags={filterTagsUuid}
          updateTag={(value, action) => handleTagInput(value, action)}
          dropdownMenu={styles.tagDropdown}
          hideTagsInInput
        />

        <div className="mt-4 row w-100 mx-0 px-0">

          <div className="col-10 pl-0">
            <div className={styles.heading}>selected filter</div>
            {
              !isEmpty(filterTags) && filterTags.map((tag) => (
                <div className={styles.selectedTagTab} key={tag.uuid}>
                  {tag.name}
                  <button type="button" onClick={() => handleTagInput({ value: tag }, 'delete')} className={styles.btn}>
                    <img src={close} alt="close" className="ml-4" />
                  </button>
                </div>
              ))
            }
          </div>
          <div className="col-2 px-0" disabled={filterTags.length === 0}>
            <button type="button" onClick={() => handleClearFilters()} className={styles.btn}>
              <img src={clear} alt="clear filter" />
              <span className={styles.clearFilter}>
                clear all filters
              </span>
            </button>
          </div>
        </div>

      </div>
      {
          showNotification && <Notifier type={handleNotification().type} text={handleNotification().text} className="mt-2" />
        }
      <div className={cx(styles.paginationBar, 'd-flex')}>
        <div className={styles.selectAllCheckBox}>
          <Checkbox
            type={handlePageSelectStatus() === 'all-selected' ? 'medium15px' : 'medium15pxline'}
            value={handlePageSelectStatus() !== null}
            onChange={() => handleSelectCheckBox()}
          />
        </div>
        {
          ((selectedSites.length > 0 && !showSelectAll) || showSelectAll)
          && (
            <div>
              <img src={dash} alt="dash" className="ml-4" />
              <img src={addNewShift} alt="addNewShift" className="ml-2 mr-1" />
              <button className={cx(styles.btn, styles.alignCreateBtn)} type="button" onClick={() => toggleShiftPopUp()}>
                <span className={styles.createBtn}>create new shift</span>
              </button>
            </div>
          )
        }
        {dataCount > PAGE_SIZE && getAttendSiteCountState === 'SUCCESS'
          && (
            <Paginator
              dataCount={dataCount}
              pageSize={PAGE_SIZE}
              baseUrl={`/customer-mgmt/org/${orgId}/dashboard/attend/site-shift-mgmt`}
              className={styles.pagination}
            />
          )}
      </div>

      {
        selectedSites.length > 0 && !showSelectAll
        && (
          <div className={cx(styles.selectAllBar, 'w-100')}>
            <>
              <span className={styles.selectEmpText}>
                <span className={styles.BoldTextSmall}>
                  {selectedSites.length}
                </span>
                &nbsp;site(s) selected.
              </span>
            </>
          </div>
        )
      }

      {
        showSelectAll && (
          <div className={cx(styles.selectAllBar, 'w-100')}>
            { !selectAllSites
              ? (
                <>
                  <span className={styles.selectEmpText}>
                    <span className={styles.BoldTextSmall}>
                      {selectedSites.length}
                    </span>
                  &nbsp;sites are meh selected.
                  </span>
                  <button className={styles.btn} type="button" onClick={() => toggleSelectAllSite()}>
                    <span className={styles.selectAllEmp}>
                      select all
                      {' '}
                      <span className={styles.BoldTextSmall}>{dataCount}</span>
                      {' '}
                      sites from site list
                    </span>
                  </button>
                </>
              )
              : (
                <>
                  <span className={styles.selectEmpText}>
                    all
                    <span className={styles.BoldTextSmall}>
                      {' '}
                      {dataCount}
                    </span>
                    &nbsp;sites from site list are selected.
                  </span>
                  <button className={styles.btn} type="button" onClick={() => toggleSelectSite(null, 'clear')}>
                    <span className={styles.selectAllEmp}>clear all selection</span>
                  </button>
                </>
              )}
          </div>
        )
      }
      {
        getAttendSiteCountState === 'LOADING' || getAttendSiteListState === 'LOADING'
          ? <Loader type="taskListLoader" />
          : (
            <div>
              {!isEmpty(siteList)
              && (
                <div className={cx(styles.siteListContainer)}>
                  <div className="row no-gutters" style={{ overflow: 'hidden' }}>
                    <span className={cx(styles.Heading, styles.headingWidth1, 'ml-4')}>site name</span>
                    <span
                      className={cx(styles.Heading, styles.headingWidth2)}
                      role="presentation"
                    >
                      city
                      <button onClick={() => handleSortByCity()} type="button" className={styles.btn}>
                        <img src={sort} alt="sort" />
                      </button>
                    </span>
                    <span className={cx(styles.Heading, styles.headingWidth2)}>code</span>
                    <span className={cx(styles.Heading, styles.headingWidth2)}>no. of shift</span>
                    <span className={cx(styles.Heading, styles.headingWidth2)}>
                      no. of employees
                    </span>
                  </div>
                  <hr style={{ margin: '1rem 1rem 1rem 0' }} />
                  <div style={{ overflow: 'auto', maxHeight: '20rem' }} className={scrollStyle.scrollbarBlue}>
                    {!isEmpty(siteList)
                      && siteList.map((obj) => (
                        <div key={obj.siteId}>
                          <div className="d-flex flex-row py-2 position-relative">
                            <span className={styles.listWidth0}>
                              <Checkbox
                                type="smallCircle"
                                value={selectedSites.includes(obj.siteId)}
                                onChange={() => toggleSelectSite(obj.siteId)}
                              />
                            </span>
                            <span className={cx(styles.listBoldText, styles.listWidth1)}>
                              {obj.siteName}
                            </span>
                            <span className={cx(styles.listText, styles.listWidth2)}>
                              {obj.cityName}
                            </span>
                            <span className={cx(styles.listText, styles.listWidth2)}>
                              {obj.siteCode}
                            </span>
                            <span className={cx(styles.listText, styles.listWidth2)}>
                              {obj.shiftCount}
                            </span>
                            <span className={cx(styles.listText, styles.listWidth2)}>
                              {obj.empCount}
                            </span>
                            <Link to={`/customer-mgmt/org/${orgId}/site/${obj.siteId}/shift`} className={cx(styles.btn, 'ml-auto mr-4')}>
                              <img src={arrow} alt="arrow" />
                            </Link>
                          </div>
                          <hr style={{ marginRight: '0.5rem' }} />
                        </div>

                      ))}
                  </div>
                </div>
              )}
            </div>
          )
      }
      {
        showShiftPopUp
        && (
          <CreateShiftPopup
            toggleFunction={() => toggleShiftPopUp()}
            siteIdList={selectedSites}
            selectAll={selectAllSites}
            totalCount={handleTotalCount()}
          />
        )
      }

    </>
  );
};

export default SiteShiftMgmt;
