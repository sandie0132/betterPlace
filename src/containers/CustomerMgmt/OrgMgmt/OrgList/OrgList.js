/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import _ from 'lodash';
import cx from 'classnames';
import { withTranslation } from 'react-i18next';
import styles from './OrgList.module.scss';
import scrollStyle from '../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import Loader from '../../../../components/Organism/Loader/Loader';
import Paginator from '../../../../components/Organism/Paginator/Paginator';

import orgLogo from '../../../../assets/icons/companyEmptyLogo.svg';
import arrowRight from '../../../../assets/icons/orgRightArrow.svg';
import search from '../../../../assets/icons/search.svg';
import allclients from '../../../../assets/icons/allOrg.svg';
import starIcon from '../../../../assets/icons/starIcon.svg';
import emptyStarred from '../../../../assets/icons/emptyStarredOrg.svg';
import noresult from '../../../../assets/icons/NoResultFound.svg';

import * as actions from './Store/action';
import OrgCard from './OrgCard/OrgCard';
import OrgOnboarding from '../OrgOnboarding/OrgOnboarding';
import HasAccess from '../../../../services/HasAccess/HasAccess';

class OrgList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchParam: '',
      showTabs: true,
    };
  }

  componentDidMount = () => {
    const { onGetOrgListPaginationCount, onGetStarredOrgList } = this.props;
    onGetOrgListPaginationCount();
    onGetStarredOrgList();
  }

  componentDidUpdate = (prevProps) => {
    const { getOrgListPaginationData, onGetStarredOrgList } = this.props;
    // const { location } = this.props;
    const { location, orgListPaginationCountState } = this.props;
    const url = location.search;

    if (orgListPaginationCountState !== prevProps.orgListPaginationCountState && orgListPaginationCountState === 'SUCCESS') {
      if (location.search !== '?filter=starred') {
        this.handleChangeUrl('all');
      }
    }

    if (location.search !== prevProps.location.search) { // pagination
      if (location.search !== '?filter=starred') {
        getOrgListPaginationData(url, 9);
      } else if (location.search === '?filter=starred') {
        onGetStarredOrgList();
      }
    }
  }

  handleChangeUrl = (filterType) => {
    const {
      location, orgListPaginationCountState, paginationCount, history,
      onGetStarredOrgList, getOrgListPaginationData,
    } = this.props;
    let url;
    if (filterType === 'starred' && !location.search.includes('filter=starred')) {
      url = location.search.replace(location.search, '?filter=starred');
      history.push(url);
      onGetStarredOrgList();
    } else if (filterType === 'all') {
      if (orgListPaginationCountState === 'SUCCESS') {
        if (paginationCount.all > 9) {
          url = location.search.replace(location.search, '?pageNumber=1');
          getOrgListPaginationData(url, 9);
          history.push(url);
        } else {
          url = location.search.replace(location.search, '');
          getOrgListPaginationData(url, 9);
          history.push('/customer-mgmt/org');
        }
      }
    }
  }

  getFilter() {
    const { location } = this.props;
    if (location.search === '') {
      return 'all';
    } if (location.search === '?filter=active') {
      return 'active';
    } if (location.search === '?filter=deactive') {
      return 'deactive';
    } if (location.search === '?filter=starred') {
      return 'starred';
    }
    return '';
  }

  isStarredOrg = (orgId) => {
    const { starredOrgIds } = this.props;
    if (starredOrgIds) {
      return starredOrgIds.includes(orgId);
    }
    return false;
  }

  shortenDisplayName = (displayName) => {
    if (displayName.length > 12) {
      const updatedDisplayName = `${displayName.substring(0, 12)}...`;
      return (updatedDisplayName);
    }
    return (displayName);
  }

  handleInputChange = (event) => {
    const { showTabs } = this.state;
    const {
      location, onSearchOrgList, getOrgListPaginationData, onGetStarredOrgList,
    } = this.props;
    const url = location.search;
    const updatedSearchParam = _.trimStart(event.target.value);
    let updatedShowTabs = showTabs;
    if (updatedSearchParam.length > 0) {
      onSearchOrgList(event.target.value);
      updatedShowTabs = false;
    } else if (updatedShowTabs !== true && this.getFilter() !== 'starred') {
      getOrgListPaginationData(url, 9);
      updatedShowTabs = true;
    } else if (updatedShowTabs !== true && this.getFilter() === 'starred') {
      onGetStarredOrgList();
      updatedShowTabs = true;
    }
    this.setState({
      searchParam: updatedSearchParam,
      showTabs: updatedShowTabs,
    });
  }

  render() {
    const {
      t, location, orgListPaginationDataState, starredOrgListState, paginationData,
      orgListPaginationCountState, starredOrgIds,
      showModal, idNo, idState, idImage, starredCount, paginationCount,
    } = this.props;

    const {
      searchParam, showTabs,
    } = this.state;

    const orgList = ((orgListPaginationDataState === 'SUCCESS' || starredOrgListState === 'SUCCESS')
    && !_.isEmpty(paginationData) && Array.isArray(paginationData))
      ? paginationData.map((org) => {
        const orgUrl = `/customer-mgmt/org/${org.uuid}/profile`;
        return (
          <OrgCard
            key={org.uuid}
            index={org.uuid}
            starredOrg={this.isStarredOrg(org.uuid)}
            icon2={orgLogo}
            filter={this.getFilter()}
            url={orgUrl}
            icon3={arrowRight}
            shortenName={org.name}
            brandColor={org.brandColor}
            legalName={org.legalName}
          />
        );
      }) : '';

    return (
      <>

        {
          orgListPaginationCountState === 'LOADING' || orgListPaginationDataState === 'LOADING'
          || starredOrgListState === 'LOADING'
            ? (
              <div className={cx(styles.alignCenter, scrollStyle.scrollbar)}>
                <Loader type="tile" />
              </div>
            )

            : (
              <div className={styles.alignCenter}>
                <div className={cx(styles.Align)}>
                  <div className={cx(styles.searchIcon)}>
                    <img src={search} alt={t('translation_orgList:image_alt_orgList.search')} />
                    {' '}
&nbsp;
                    <input
                      type="text"
                      placeholder={t('translation_orgList:input_orgList.placeholder.searchClient')}
                      value={searchParam}
                      className={styles.searchBar}
                      onChange={(event) => this.handleInputChange(event)}
                    />
                  </div>
                  <div className={styles.TabAlign}>
                    <HasAccess
                      permission={['*']}
                      yes={() => (
                        <OrgOnboarding
                          buttonLabel={t('translation_orgList:button_orgList.addClient')}
                          showModal={showModal}
                          idNo={idNo}
                          idState={idState}
                          idImage={idImage}
                        />
                      )}
                    />
                  </div>
                </div>
                <br />
                {showTabs
                  ? (
                    <div className="row-fluid">
                      <ul>
                        <li
                          className={location.search === '?filter=starred' ? cx('pl-0 mr-3', styles.ActiveTabLink) : cx('pl-0 mr-3', styles.InactiveTabLink)}
                          onClick={() => this.handleChangeUrl('starred')}
                          aria-hidden="true"
                        >
                          <img src={starIcon} alt={t('translation_orgList:image_alt_orgList.starred')} className={location.search === '?filter=starred' ? cx(styles.ActiveTabLinkImage, 'pr-2') : cx('pr-2')} />
                          <span>
                            {' '}
                            {t('translation_orgList:button_orgList.starred')}
                            {' '}
                            |
                            {' '}
                            {starredCount === undefined ? 0 : starredCount}
                            {' '}
                          </span>
                        </li>

                        <li
                          className={location.search !== '?filter=starred' ? cx('pl-0', styles.ActiveTabLink) : cx('pl-0', styles.InactiveTabLink)}
                          onClick={() => this.handleChangeUrl('all')}
                          aria-hidden="true"
                        >
                          <img src={allclients} alt={t('translation_orgList:image_alt_orgList.allclients')} className={location.search !== '?filter=starred' ? cx(styles.ActiveTabLinkImage, 'pr-2') : cx('pr-2')} />
                          <span>
                            {' '}
                            {t('translation_orgList:button_orgList.all')}
                            {' '}
                            |
                            {' '}
                            {paginationCount.all}
                            {' '}
                          </span>
                        </li>

                        <li style={{ float: 'right' }} className="px-0">
                          <div className={styles.Pagination}>
                            {location.search !== '?filter=starred'
                              && orgListPaginationDataState === 'SUCCESS'
                              && !_.isEmpty(paginationData)
                              ? (
                                paginationCount.all > paginationData.length
                                  ? (
                                    <Paginator
                                      dataCount={paginationCount.all}
                                      pageSize={9}
                                      baseUrl="/customer-mgmt/org"
                                    />
                                  ) : null)
                              : null}
                          </div>
                        </li>
                      </ul>
                      <hr className={styles.hr1} />
                    </div>
                  ) : null}

                <div className="row">
                  {_.isEmpty(starredOrgIds) && location.search === '?filter=starred' && _.isEmpty(searchParam)
                    ? (
                      <div className="col-12">
                        <div className="row no-gutters">
                          <div className="col-4 px-0">
                            <img src={emptyStarred} alt="" />
                          </div>
                          <div className="col-6 px-3">
                            <p className={styles.NoClient}>{t('translation_orgList:noClientStarred')}</p>
                            <p className={styles.Info}>{t('translation_orgList:noClientStarredDescription')}</p>
                          </div>
                        </div>
                      </div>
                    )
                    : !_.isEmpty(searchParam)
                      && _.isEmpty(paginationData)
                      ? (
                        <div className={cx('ml-auto mr-auto', styles.NoResultPage)}>
                          <label
                            className={styles.NoResult}
                          >
                            {t('translation_orgList:noSearchResults')}
                            {' '}
                            <span className={styles.BoldText}>
                              {`'${searchParam}'`}
                            </span>
                          </label>
                          <br />
                          <label className={styles.NoResult}>{t('translation_orgList:tryAgain')}</label>
                          <br />
                          <img src={noresult} alt="" />
                        </div>
                      )
                      : orgList}
                </div>
              </div>
            )
        }
        <br />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  orgList: state.orgMgmt.orgList.orgList,
  paginationCount: state.orgMgmt.orgList.paginationCount,
  paginationData: state.orgMgmt.orgList.paginationData,
  pageNumber: state.orgMgmt.orgList.pageNumber,
  orgListFormState: state.orgMgmt.orgList.getDataListState,
  orgListPaginationDataState: state.orgMgmt.orgList.orgListPaginationDataState,
  orgListPaginationCountState: state.orgMgmt.orgList.orgListPaginationCountState,
  starredOrgListState: state.orgMgmt.orgList.getStarredOrgListState,
  starredCount: state.orgMgmt.orgList.starredCount,
  starredOrgList: state.orgMgmt.orgList.starredOrgList,
  starredOrgIds: state.orgMgmt.orgList.starredOrgIds,
  showModal: state.orgMgmt.orgOnboard.showModal,
  idNo: state.orgMgmt.orgOnboard.idNo,
  idState: state.orgMgmt.orgOnboard.cardtype,
  idImage: state.orgMgmt.orgOnboard.idImage,
});

const mapDispatchToProps = (dispatch) => ({
  initOrgList: () => dispatch(actions.initState()),
  getOrgList: () => dispatch(actions.getDataList()),
  setPaginatorCount: (count) => dispatch(actions.setPaginatorCount(count)),
  onSearchOrgList: _.debounce((searchParam) => dispatch(
    actions.searchOrgList(searchParam),
  ), 700, { trailing: true }),
  onGetOrgListPaginationCount: (targetUrl) => dispatch(
    actions.getOrgListPaginationCount(targetUrl),
  ),
  getOrgListPaginationData: (targetUrl, pageSize) => dispatch(
    actions.getOrgListPaginationData(targetUrl, pageSize),
  ),
  onGetStarredOrgList: () => dispatch(actions.getStarredOrgList()),
});

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(OrgList)));
