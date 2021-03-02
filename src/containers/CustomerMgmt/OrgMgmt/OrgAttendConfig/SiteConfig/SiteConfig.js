import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Notifier, Button } from 'react-crux';
import {
  cloneDeep, isEmpty, isEqual, forEach,
} from 'lodash';
import get from 'lodash/get';
import cx from 'classnames';
import * as actions from './Store/action';
import styles from './SiteConfig.module.scss';
import ArrowLink from '../../../../../components/Atom/ArrowLink/ArrowLink';
import Paginator from '../../../../../components/Organism/Paginator/Paginator';
import CardHeader from '../../../../../components/Atom/PageTitle/PageTitle';
import siteConfig from '../../../../../assets/icons/attendenceContainer.svg';
import scrollStyle from '../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import clear from '../../../../../assets/icons/resetBlue.svg';
import close from '../../../../../assets/icons/crossIcon.svg';
import sort from '../../../../../assets/icons/sortIcon.svg';
import TagSearchField from '../../../../TagSearch/TagSearchField/TagSearchField';
import emptyIcon from '../../../../../assets/icons/LeftBackground.svg';
import blueEdit from '../../../../../assets/icons/blueEdit.svg';
import viewIcon from '../../../../../assets/icons/eyeIconViewMode.svg';
import Loader from '../../../../../components/Organism/Loader/Loader';
import HasAccess from '../../../../../services/HasAccess/HasAccess';
import VendorDropdown from '../../../../VendorSearch/VendorDropdown/VendorDropdown';

const PAGE_SIZE = 20;
class SiteConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterTags: [],
      showNotification: false,
      type: '',
    };
  }

  componentDidMount() {
    const {
      onGetAttendSiteConfigCount, onGetTagInfo, match, location,
      postAttendSiteConfigState, deleteAttendSiteConfigState,
    } = this.props;
    const orgId = match.params.uuid;
    const targetUrl = location.search;
    const urlSearchParams = new URLSearchParams(targetUrl);
    const tags = urlSearchParams.get('tags');
    let sharedTag = false;
    if (tags != null && tags.length !== 0) {
      if (urlSearchParams.get('vendorId') || urlSearchParams.get('clientId')) sharedTag = true;
      onGetTagInfo(tags.split(','), sharedTag);
    }
    onGetAttendSiteConfigCount(orgId, targetUrl);

    if (postAttendSiteConfigState === 'SUCCESS') {
      this.handleNotification('success');
    } else if (deleteAttendSiteConfigState === 'SUCCESS') {
      this.handleNotification('error');
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      getCountState, match, location, dataCount, onGetAttendSiteConfigCount,
      onGetAttendSiteConfigList, history, postTagInfoState, tagList,
      // postAttendSiteConfigState, deleteAttendSiteConfigState,
    } = this.props;
    const { filterTags } = this.state;
    if (prevProps.getCountState !== getCountState) {
      if (getCountState === 'SUCCESS') {
        const orgId = match.params.uuid;
        const targetUrl = location.search;
        if (dataCount > PAGE_SIZE) {
          if (location.search.includes('pageNumber')) {
            onGetAttendSiteConfigList(orgId, targetUrl, PAGE_SIZE);
          } else {
            let redirectPath = '';
            if (location.search.length !== 0) {
              redirectPath = `/customer-mgmt/org/${orgId}/attendconfig/site-config${location.search}&pageNumber=1`;
            } else {
              redirectPath = `/customer-mgmt/org/${orgId}/attendconfig/site-config?pageNumber=1`;
            }
            history.push(redirectPath);
          }
        } else if (location.search.includes('pageNumber')) {
          const regex = /(?:pageNumber=)([0-9]+)/;
          const newSearchPath = location.search.replace(regex, '');
          const redirectPath = `/customer-mgmt/org/${orgId}/attendconfig/site-config${newSearchPath}`;
          history.push(redirectPath);
        } else {
          onGetAttendSiteConfigList(orgId, targetUrl, PAGE_SIZE);
        }
      }
    }

    if (prevProps.location.search !== location.search) {
      if (location.search.includes('pageNumber')) {
        const orgId = match.params.uuid;
        const targetUrl = location.search;
        onGetAttendSiteConfigList(orgId, targetUrl, PAGE_SIZE);
      } else {
        const orgId = match.params.uuid;
        const targetUrl = location.search;
        onGetAttendSiteConfigCount(orgId, targetUrl);
      }
      const urlSearchParams = new URLSearchParams(location.search);
      const prevSearchParams = new URLSearchParams(prevProps.location.search);
      if (prevSearchParams.get('vendorId') !== urlSearchParams.get('vendorId') || prevSearchParams.get('clientId') !== urlSearchParams.get('clientId')) {
        this.handleClearFilters();
      }
    }

    if (!isEqual(prevState.filterTags, filterTags)) {
      const orgId = match.params.uuid;
      let redirectPath = `/customer-mgmt/org/${orgId}/attendconfig/site-config`;
      if (!isEmpty(filterTags)) {
        let filterTagsUuid = filterTags.map((tag) => tag.uuid);
        filterTagsUuid = Array.from(filterTagsUuid).join(',');
        const urlSearchParams = new URLSearchParams(location.search);
        urlSearchParams.set('tags', filterTagsUuid);
        redirectPath += `?${urlSearchParams.toString()}`;
      } else {
        const urlSearchParams = new URLSearchParams(location.search);
        urlSearchParams.delete('tags');
        redirectPath += `?${urlSearchParams.toString()}`;
      }
      history.push(redirectPath);
    }

    if (prevProps.postTagInfoState !== postTagInfoState) {
      if (postTagInfoState === 'SUCCESS') {
        if (!isEmpty(tagList)) {
          this.handleUrlToState(tagList);
        }
      }
    }
  }

  componentWillUnmount() {
    const { initState } = this.props;
    initState();
  }

  handleNotification = (type) => {
    this.setState({
      showNotification: true,
      type,
    }, () => {
      setTimeout(() => {
        this.setState({ showNotification: false, type: '' });
      }, 5000);
    });
  }

  handleNotificationText = () => {
    const { type } = this.state;
    const { prevSiteName } = this.props;
    let text = '';
    if (type === 'success') {
      text = `"${prevSiteName}" site configuration has been sucessfully added`;
    } else text = `"${prevSiteName}" site configuration has been sucessfully removed`;
    return text;
  }

  handleUrlToState = (tagList) => {
    this.setState({
      filterTags: tagList,
    });
  }

  handleRedirectToAddNew = () => {
    const { match, history, location } = this.props;
    const orgId = match.params.uuid;
    const targetUrl = location.search;
    const urlSearchParams = new URLSearchParams(targetUrl);
    let redirectUrl = `/customer-mgmt/org/${orgId}/attendconfig/site-config/site-config-detail/add`;
    redirectUrl += `?${urlSearchParams.toString()}`;
    history.push(redirectUrl);
  }

  handleTagInput = (event, action) => {
    const { filterTags } = this.state;
    let updatedFilterTags = cloneDeep(filterTags);
    if (action === 'add') {
      updatedFilterTags = [
        ...updatedFilterTags.slice(0),
        event.value,
      ];
    } else if (action === 'delete') {
      updatedFilterTags = updatedFilterTags.filter((tag) => tag.uuid !== event.value.uuid);
    }

    this.setState({
      filterTags: updatedFilterTags,
    });
  };

  handleClearFilters = () => {
    this.setState({
      filterTags: [],
    });
  }

  handleSortByCity = () => {
    const {
      match, history, location,
    } = this.props;
    const orgId = match.params.uuid;
    let redirectPath = `/customer-mgmt/org/${orgId}/attendconfig/site-config`;
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
    redirectPath += `?${urlSearchParams.toString()}`;
    history.push(redirectPath);
  }

  handleShowVendorDropDown = () => {
    let showVendorDropDown = false;
    const { enabledServices } = this.props;
    if (!isEmpty(enabledServices) && !isEmpty(enabledServices.platformServices)) {
      forEach(enabledServices.platformServices, (service) => {
        if (service.platformService === 'VENDOR') showVendorDropDown = true;
      });
    }
    return showVendorDropDown;
  }

  render() {
    const {
      match, siteList, dataCount, getCountState, getSiteListState,
      location,
    } = this.props;
    const urlSearchParams = new URLSearchParams(location.search);
    const viewOnly = !!urlSearchParams.get('vendorId');
    const orgId = match.params.uuid;
    const showVendorDropDown = this.handleShowVendorDropDown();
    const { filterTags, showNotification, type } = this.state;
    const filterTagsUuid = filterTags.map((tag) => tag.uuid);

    return (
      <div className={styles.alignCenter}>
        <div className={styles.fixedHeader}>
          <div className="d-flex">
            <ArrowLink
              label={get(this.props, 'orgData.name', '').toLowerCase()}
              url={`/customer-mgmt/org/${orgId}/profile`}
            />
            {showVendorDropDown
              && (
                <div className="ml-auto mt-2">
                  <VendorDropdown showIcon />
                </div>
              )}
          </div>
          <div className="d-flex">
            <CardHeader label="site configuration" iconSrc={siteConfig} />
            {
              !viewOnly
              && (
                <HasAccess
                  permission={['SITE_CONFIG:CREATE']}
                  orgId={orgId}
                  yes={() => (
                    <div className="ml-auto my-auto">
                      <Button
                        label="configure new sites"
                        type="add"
                        clickHandler={() => this.handleRedirectToAddNew()}
                      />
                    </div>
                  )}
                />
              )
            }
          </div>
          <div className={styles.configFilterCard}>
            <TagSearchField
              name="location"
              labelText={styles.labelText}
              className={cx(styles.tagInputField, 'col-12')}
              label="configured sites"
              placeholder="search for any tags and filter configured sites"
              orgId={orgId}
              category="geographical"
              disableTags={filterTagsUuid}
              updateTag={(value, action) => this.handleTagInput(value, action)}
              dropdownMenu={styles.tagDropdown}
              hideTagsInInput
              vendorId={urlSearchParams.get('vendorId')}
              clientId={urlSearchParams.get('clientId')}
            />

            <div className="mt-4 row w-100 mx-0 px-0">

              <div className="col-10 pl-0">
                <div className={styles.heading}>selected filter</div>
                {
                  !isEmpty(filterTags) && filterTags.map((tag) => (
                    <div className={styles.selectedTagTab} key={tag.uuid}>
                      {tag.name}
                      <button type="button" onClick={() => this.handleTagInput({ value: tag }, 'delete')} className={styles.btn}>
                        <img src={close} alt="close" className="ml-4" />
                      </button>
                    </div>
                  ))
                }
              </div>
              <div className="col-2 px-0" disabled={filterTags.length === 0}>
                <button type="button" onClick={() => this.handleClearFilters()} className={styles.btn}>
                  <img src={clear} alt="clear filter" />
                  <span className={styles.clearFilter}>
                    clear all filters
                  </span>
                </button>
              </div>
            </div>

          </div>

          {
            showNotification && <Notifier type={type} text={this.handleNotificationText()} className="mt-2" />
          }

          <div style={{ height: '3rem', position: 'relative' }}>
            {dataCount > PAGE_SIZE && getCountState === 'SUCCESS'
              && (
                <Paginator
                  dataCount={dataCount}
                  pageSize={PAGE_SIZE}
                  baseUrl={`/customer-mgmt/org/${orgId}/attendconfig/site-config`}
                  className={styles.pagination}
                />
              )}
          </div>
        </div>
        <div>

          {
            getCountState === 'LOADING' || getSiteListState === 'LOADING'
              ? <Loader type="taskListLoader" />
              : (
                <div>
                  {!isEmpty(siteList)
                    ? (
                      <div className={cx(styles.siteListContainer)}>
                        <div className="row no-gutters" style={{ overflow: 'hidden' }}>
                          <span className={cx(styles.Heading, styles.headingWidth1)}>
                            site name
                          </span>
                          <span
                            className={cx(styles.Heading, styles.headingWidth2)}
                            role="presentation"
                          >
                            city
                            <button onClick={() => this.handleSortByCity()} type="button" className={styles.btn}>
                              <img src={sort} alt="sort" />
                            </button>
                          </span>
                          <span className={cx(styles.Heading, styles.headingWidth3)}>
                            hierarchy
                          </span>
                        </div>
                        <hr style={{ margin: '1rem 1rem 1rem 0' }} />
                        <div style={{ overflow: 'auto', maxHeight: '20rem' }} className={scrollStyle.scrollbarBlue}>
                          {!isEmpty(siteList)
                            && siteList.map((obj) => (
                              <div key={obj.siteId}>
                                <div className="d-flex flex-row py-2 position-relative">
                                  <span className={cx(styles.listBoldText, styles.listWidth1)}>
                                    {obj.siteName}
                                  </span>
                                  <span className={cx(styles.listText, styles.listWidth2)}>
                                    {obj.cityName}
                                  </span>
                                  <span className={cx(styles.listText, styles.listWidth3)}>
                                    {
                                      obj.siteHierarchyNames.map((site, index) => (
                                        <span key={site}>
                                          <span>
                                            {site}
                                            {obj.siteHierarchyNames.length - 1 !== index && ' > '}
                                          </span>
                                        </span>
                                      ))
                                    }
                                  </span>

                                  <HasAccess
                                    permission={['SITE_CONFIG:CREATE']}
                                    orgId={orgId}
                                    yes={() => (
                                      <Link
                                        className={styles.editContainer}
                                        to={`/customer-mgmt/org/${orgId}/attendconfig/site-config/site-config-detail/${obj.siteId}?${urlSearchParams.toString()}`}
                                      >
                                        {
                                          viewOnly
                                            ? (
                                              <span>
                                                <img src={viewIcon} alt="view" />
                                                &nbsp;view
                                              </span>
                                            )
                                            : (
                                              <span>
                                                <img src={blueEdit} alt="edit" />
                                                &nbsp;edit
                                              </span>
                                            )
                                        }
                                      </Link>
                                    )}
                                    no={() => (
                                      <Link
                                        className={styles.editContainer}
                                        to={`/customer-mgmt/org/${orgId}/attendconfig/site-config/site-config-detail/${obj.siteId}?${urlSearchParams.toString()}`}
                                      >
                                        <span>
                                          <img src={viewIcon} alt="view" />
                                            &nbsp;view
                                        </span>
                                      </Link>
                                    )}
                                  />

                                </div>
                                <hr style={{ marginRight: '0.5rem' }} />
                              </div>

                            ))}

                        </div>

                      </div>
                    )
                    : (
                      <div>
                        <div className={cx(styles.blankScreenContainer, 'd-flex flex-row justify-content-center')}>
                          <div className={cx('d-flex flex-column')} style={{ textAlign: 'center' }}>
                            <img src={emptyIcon} alt="icon" style={{ height: '14rem', marginTop: '2rem' }} />
                            <span className={styles.listText} style={{ marginTop: '0.5rem' }}>there are no configured sites</span>
                            <div className="mt-5">
                              {
                                !viewOnly
                                && (
                                <HasAccess
                                  permission={['SITE_CONFIG:CREATE']}
                                  orgId={orgId}
                                  yes={() => (
                                    <div className="ml-auto my-auto">
                                      <Button
                                        label="configure new sites"
                                        type="add"
                                        clickHandler={() => this.handleRedirectToAddNew()}
                                      />
                                    </div>
                                  )}
                                />
                                )
                              }
                            </div>

                          </div>

                        </div>
                      </div>

                    )}

                </div>

              )

          }
        </div>

      </div>

    );
  }
}

const mapStateToProps = (state) => ({
  orgData: state.orgMgmt.staticData.orgData,
  enabledServices: state.orgMgmt.staticData.servicesEnabled,
  siteList: state.orgMgmt.orgAttendConfig.siteConfig.siteConfigList,
  tagList: state.orgMgmt.orgAttendConfig.siteConfig.tagList,
  noSitesConfigured: state.orgMgmt.orgAttendConfig.siteConfig.noSitesConfigured,
  dataCount: state.orgMgmt.orgAttendConfig.siteConfig.dataCount,
  getSiteListState: state.orgMgmt.orgAttendConfig.siteConfig.getAttendSiteConfigListState,
  getCountState:
    state.orgMgmt.orgAttendConfig.siteConfig.getAttendSiteConfigCountState,
  postTagInfoState: state.orgMgmt.orgAttendConfig.siteConfig.postTagInfoState,
  postAttendSiteConfigState: state.orgMgmt.orgAttendConfig.siteConfig.postAttendSiteConfigState,
  deleteAttendSiteConfigState: state.orgMgmt.orgAttendConfig.siteConfig.deleteAttendSiteConfigState,
  prevSiteName: state.orgMgmt.orgAttendConfig.siteConfig.prevSiteName,
  error: state.orgMgmt.orgAttendConfig.orgLevelConfig.error,
});

const mapDispatchToProps = (dispatch) => ({
  initState: () => dispatch(actions.initState()),
  onGetAttendSiteConfigCount:
    (orgId, targetUrl) => dispatch(actions.getAttendSiteConfigCount(orgId, targetUrl)),
  onGetAttendSiteConfigList: (orgId, targetUrl, pageSize) => dispatch(
    actions.getAttendSiteConfigList(
      orgId, targetUrl, pageSize,
    ),
  ),
  onGetTagInfo: (tagIdList, sharedTag) => dispatch(actions.getTagInfo(tagIdList, sharedTag)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SiteConfig));
