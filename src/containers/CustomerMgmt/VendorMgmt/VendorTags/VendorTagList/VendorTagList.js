/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-did-update-set-state */
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';
import cx from 'classnames';
import styles from './VendorTagList.module.scss';

import VendorTagRow from './VendorTagRow/VendorTagRow';

import Loader from '../../../../../components/Organism/Loader/Loader';
import Paginator from '../../../../../components/Organism/Paginator/Paginator';
import SuccessNotification from '../../../../../components/Organism/Notifications/SuccessNotification/SuccessNotification';
import scrollStyle from '../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import EmptyState from '../../../../../components/Atom/EmptyState/EmptyState';
import Checkbox from '../../../../../components/Atom/CheckBox/CheckBox';

import dash from '../../../../../assets/icons/dash.svg';
import unassignActive from '../../../../../assets/icons/unassignActive.svg';
import unassignInactive from '../../../../../assets/icons/unassignInactive.svg';

import * as actions from '../Store/action';
import * as vendorTagsAssignmentActions from '../../VendorTagsAssignment/Store/action';
// import HasAccess from '../../../../../services/HasAccess/HasAccess';

class VendorTagList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTags: [],
      actionType: '',
      showSuccessNotification: false,
      showAssignTagSuccessNotification: false,
      pageSize: 20,
      allTagsSelected: false,
      showSelectedFiltersNotification: false,
    };
  }

  componentDidMount = () => {
    const { postAssignedTagsState } = this.props;
    if (postAssignedTagsState === 'SUCCESS') {
      this.setState({ showAssignTagSuccessNotification: true });
      setTimeout(() => {
        this.setState({ showAssignTagSuccessNotification: false });
      }, 4000);
    }
  }

  componentDidUpdate = (prevProps) => {
    const { unassignState, selectedFilters } = this.props;

    if (prevProps.unassignState !== unassignState && unassignState === 'SUCCESS') {
      this.setState({
        showSuccessNotification: true, actionType: '',
      });
      setTimeout(() => {
        this.setState({ showSuccessNotification: false, selectedTags: [], allTagsSelected: false });
      }, 4000);
    }

    if (prevProps.selectedFilters !== selectedFilters) {
      this.setState({ showSelectedFiltersNotification: true });
      setTimeout(() => {
        this.setState({ showSelectedFiltersNotification: false });
      }, 4000);
    }
  }

  componentWillUnmount = () => {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.onGetInitState();
  }

  handleSelectedTasks = (uuid) => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const { selectedTags } = this.state;
    let tagArray = _.cloneDeep(selectedTags);
    if (_.includes(tagArray, uuid)) {
      tagArray = _.remove(tagArray, (tag) => tag !== uuid);
    } else {
      tagArray.push(uuid);
    }
    this.setState({ selectedTags: tagArray });
  }

  toggleSelectAll = () => {
    const { selectedTags } = this.state;
    const { vendorTags, selectedFiltersId, selectedFilterTagData } = this.props;

    if (selectedTags.length > 0) {
      this.setState({ selectedTags: [], allTagsSelected: false });
    } else {
      // eslint-disable-next-line prefer-const
      let selectAll = [];
      if (!_.isEmpty(vendorTags) && _.isEmpty(selectedFiltersId)) {
        vendorTags.map((tag) => (selectAll.push(tag.tagName.tag_uuid)));
      } else {
        selectedFilterTagData.map((tag) => (selectAll.push(tag.tagName.tag_uuid)));
      }
      this.setState({ selectedTags: selectAll });
    }
  }

  handleActionSelect = (actionType) => {
    const { allTagsSelected, selectedTags } = this.state;
    const {
      match, orgOptionId, selectedFiltersId, tagLabel,
    } = this.props;

    let payload = {};
    if (allTagsSelected) {
      payload = {
        clientId: orgOptionId === '' ? match.params.uuid : orgOptionId,
        tag_uuids: [],
        filters: selectedFiltersId,
      };
    } else {
      payload = {
        clientId: orgOptionId === '' ? match.params.uuid : orgOptionId,
        tag_uuids: selectedTags,
        filters: [],
      };
    }
    // eslint-disable-next-line react/destructuring-assignment
    this.props.onPostUnassignTags(match.params.uuid, match.params.vendorId, payload,
      allTagsSelected, tagLabel);
    this.setState({ actionType });
  }

  handleAllTaskSelection = (msg) => {
    if (msg === 'select from all pages') {
      this.setState({ allTagsSelected: true });
    } else {
      this.setState({ allTagsSelected: false });
    }
  }

  closeSuccessNotification = () => {
    this.setState({ showSuccessNotification: false, showAssignTagSuccessNotification: false });
  }

  // handleUndo = () => {
  //   const { selectedTags } = this.state;
  //   const { match, orgOptionId } = this.props;

  //   const postPayload = {
  //     clientId: orgOptionId,
  //     tagIds: selectedTags,
  //   };
  //   // eslint-disable-next-line react/destructuring-assignment
  //   this.props.onPostAssignedTags(match.params.uuid, match.params.vendorId, postPayload);
  //   this.setState({ showSuccessNotification: false });
  // }

  render() {
    const {
      t, match, location, postAssignedTags, searchKey, selectedFilters, clientListState,
      vendorTagsCountState, vendorTagsCount, vendorTags, vendorTagsState,
      orgOption, orgOptionId, vendorName, categoryLabel,
      selectedFilterTagData, selectedFilterTagCount, selectedFilterTagCountState,
      selectedFilterTagState,
    } = this.props;

    let {
      // eslint-disable-next-line prefer-const
      allTagsSelected, showAssignTagSuccessNotification, actionType, pageSize,
      // eslint-disable-next-line prefer-const
      selectedTags, showSelectedFiltersNotification, showSuccessNotification,
    } = this.state;

    const orgId = match.params.uuid;
    const { vendorId, category } = match.params;
    const selectAllMsg = allTagsSelected ? 'select from this page only' : 'select from all pages';

    let checkboxStatus = null;

    if (!_.isEmpty(selectedTags) && selectedTags.length > 0) {
      if (_.isEmpty(searchKey) && vendorTags.length > 0) {
        checkboxStatus = allTagsSelected ? 'all-selected' : 'some-selected';
      } else if (!_.isEmpty(searchKey) && selectedFilters.length > 0) { // search key length > 2
        checkboxStatus = allTagsSelected ? 'all-selected' : 'some-selected';
      }
    }

    return (
      <>
        <div className="d-flex flex-row">
          {showAssignTagSuccessNotification
            ? (
              <SuccessNotification
                type="agencyNotification"
                message={`${postAssignedTags.count}` > 0
                  ? `assigned ${postAssignedTags.count} tags to ${vendorName}`
                  : `${postAssignedTags.message}`}
                boldText=""
                closeNotification={this.closeSuccessNotification}
              />
            )
            : showSuccessNotification
              ? (
                <SuccessNotification
                  type="agencyNotification"
                  message="selected tags have been unassigned"
                  // boldText="undo"
                  // boldTextStyle={cx('pl-2', styles.NotifUnderline)}
                  // boldTextClickHandler={this.handleUndo}
                  closeNotification={this.closeSuccessNotification}
                  className={cx(styles.NotifBg, 'my-1')}
                />
              )
            // : error
            //   // eslint-disable-next-line react/jsx-no-undef
            //   ? <ErrorNotification type="agencyErrorNotification" error={error} />
              : null}
        </div>

        {
          (_.isEmpty(searchKey) && !_.isEmpty(vendorTags))
            || (!_.isEmpty(searchKey) && !_.isEmpty(selectedFilters))
            ? (
              <>
                <div className="d-flex flex-row justify-content-between">
                  <div className={cx(styles.actionContent, 'd-flex')}>
                    <>
                      <Checkbox
                        type={checkboxStatus === 'all-selected' ? 'medium15px' : 'medium15pxline'}
                        value={checkboxStatus !== null}
                        name="selectAll"
                        onChange={this.toggleSelectAll}
                        className="pt-1 mt-2"
                      />
                      <img src={dash} alt="" className="ml-4" />

                      {selectedTags.length > 0
                        ? (
                          <span className="row px-0 mx-0">
                            <div
                              className={actionType !== 'unassign' ? styles.mainDiv : null}
                              role="button"
                              aria-hidden="true"
                              onClick={() => this.handleActionSelect('unassign')}
                            >
                              <div className={actionType === 'unassign' ? styles.ActiveButton : styles.InactiveButton}>
                                <img
                                  src={actionType === 'unassign' ? unassignActive : unassignInactive}
                                  alt=""
                                  className="pr-2"
                                />
                                {t('translation_vendorTags:vendorTagList.unassign')}
                              </div>
                            </div>
                          </span>
                        )
                        : null}
                    </>
                  </div>
                  <div className="d-flex flex-row">
                    {vendorTagsCountState === 'SUCCESS' && _.isEmpty(selectedFilters) && vendorTagsCount.count > pageSize
                      ? (
                        <>
                          <img src={dash} alt="" className="mr-3 ml-2" />
                          <Paginator
                            dataCount={vendorTagsCount.count}
                            pageSize={pageSize}
                            baseUrl={location.pathname}
                            className="mt-2"
                          />
                        </>
                      )
                      : selectedFilterTagCountState === 'SUCCESS' && !_.isEmpty(selectedFilters) && selectedFilterTagCount.count > pageSize
                        ? (
                          <>
                            <img src={dash} alt="" className="mr-3 ml-2" />
                            <Paginator
                              dataCount={selectedFilterTagCount.count}
                              pageSize={pageSize}
                              baseUrl={location.pathname}
                              className="mt-2"
                            />
                          </>
                        )
                        : null}
                  </div>
                </div>
                <hr className={cx('my-0', styles.HorizontalLine)} />
              </>
            )
            : <div className={cx(styles.emptyActionContent, 'd-flex')} />
        }

        <div>
          {/* {showSuccessNotification
            ? (
              <SuccessNotification
                type="agencyNotification"
                message="selected tags have been unassigned"
                boldText="undo"
                boldTextStyle={cx('pl-2', styles.NotifUnderline)}
                boldTextClickHandler={this.handleUndo}
                closeNotification={this.closeSuccessNotification}
                className={cx(styles.NotifBg, 'mb-3 mt-1')}
              />
            )
            :  */}
          {vendorTags && selectedTags.length === pageSize && vendorTagsCount.count > pageSize
            ? (
              <SuccessNotification
                type="selectAll"
                empCount={allTagsSelected ? vendorTagsCount.count : selectedTags.length}
                message={allTagsSelected ? 'tasks selected from all pages' : 'tasks selected from current page'}
                selectAllMsg={selectAllMsg}
                clickHandler={() => this.handleAllTaskSelection(selectAllMsg)}
                className="mb-3 mt-1"
              />
            )
            : null}
        </div>

        {vendorTagsCountState === 'LOADING' || vendorTagsState === 'LOADING' || selectedFilterTagCountState === 'LOADING' || selectedFilterTagState === 'LOADING'
          ? <Loader type="taskListLoader" />
          : (
            ((_.isEmpty(searchKey) || searchKey.length < 3) && _.isEmpty(selectedFilters))
              ? !_.isEmpty(vendorTags)
                ? (
                  <div className={cx('mt-1 mb-4', styles.Card)}>
                    <div className={cx('row no-gutters')} style={{ overflow: 'hidden' }}>
                      <span className={cx(styles.Heading, styles.Width1)}>{t('translation_vendorTags:vendorTagList.tagName')}</span>
                      {categoryLabel === 'location' ? (
                        <>
                          <span className={cx(styles.Heading, styles.Width2)}>{t('translation_vendorTags:vendorTagList.country')}</span>
                          <span className={cx(styles.Heading, styles.Width3)}>{t('translation_vendorTags:vendorTagList.state')}</span>
                          <span className={cx(styles.Heading, styles.Width4)}>{t('translation_vendorTags:vendorTagList.city')}</span>
                          <span className={cx(styles.Heading, styles.Width5)}>{t('translation_vendorTags:vendorTagList.hierarchy')}</span>
                        </>
                      )
                        : categoryLabel === 'function' ? (
                          <>
                            <span className={cx(styles.Heading, styles.Width2)}>function</span>
                            <span className={cx(styles.Heading, styles.Width3)}>role</span>
                            <span className={cx(styles.Heading, styles.WidthFuncHierarchy)}>{t('translation_vendorTags:vendorTagList.hierarchy')}</span>
                          </>
                        )
                          : null}
                    </div>

                    <hr className={styles.HrStyle} />
                    <div style={{ overflow: 'auto', maxHeight: '40rem' }} className={scrollStyle.scrollbarBlue} />
                    {
                      vendorTags.map((item) => (
                        categoryLabel === 'location'
                          ? (
                            <VendorTagRow
                              categoryLabel={categoryLabel}
                              key={item.tagName.name}
                              tagName={item.tagName.name}
                              tagId={item.tagName.tag_uuid}
                              country={!_.isEmpty(item.country) ? item.country.name : 'n/a'}
                              state={!_.isEmpty(item.state) ? item.state.name : 'n/a'}
                              city={!_.isEmpty(item.city) ? item.city.name : 'n/a'}
                              hierarchy={!_.isEmpty(item.hierarchy)
                                ? item.hierarchy.map((each, index) => (
                                  <span key={each.name}>
                                    {each.name}
                                    {' '}
                                    {index === item.hierarchy.length - 1 ? '' : '> '}
                                  </span>
                                ))
                                : 'n/a'}
                              handleSelectedTasks={
                                () => this.handleSelectedTasks(item.tagName.tag_uuid)
                              }
                              allTagsSelected={allTagsSelected}
                              selectedTags={selectedTags}
                            />
                          )
                          : categoryLabel === 'function'
                            ? (
                              <VendorTagRow
                                categoryLabel={categoryLabel}
                                key={item.tagName.name}
                                tagName={item.tagName.name}
                                tagId={item.tagName.tag_uuid}
                                func={!_.isEmpty(item.function) ? item.function.name : 'n/a'}
                                role={!_.isEmpty(item.role) ? item.role.name : 'n/a'}
                                hierarchy={!_.isEmpty(item.hierarchy)
                                  ? item.hierarchy.map((each, index) => (
                                    <span key={each.name}>
                                      {each.name}
                                      {' '}
                                      {index === item.hierarchy.length - 1 ? '' : '> '}
                                    </span>
                                  ))
                                  : 'n/a'}
                                handleSelectedTasks={
                                  () => this.handleSelectedTasks(item.tagName.tag_uuid)
                                }
                                allTagsSelected={allTagsSelected}
                                selectedTags={selectedTags}
                              />
                            )
                            : null
                      ))
                    }
                  </div>
                )
                : (
                  <div className={cx('mt-1 mb-4', styles.Card)}>
                    <EmptyState
                      type="emptyVendorTagsList"
                      label={`${t('translation_vendorTags:vendorTagList.emptyState')} ${orgOption} ${t('translation_vendorTags:vendorTagList.to')} ${vendorName}`}
                      url={clientListState === 'LOADING' || clientListState === 'ERROR'
                        ? null : `/customer-mgmt/org/${orgId}/vendor-mgmt/vendor/${vendorId}/config/client/${orgOptionId}/${category}/assign`}
                      buttonLabel={`${t('translation_vendorTags:vendorTagList.assign')} ${categoryLabel}`}
                      buttonClassname={styles.AssignButton}
                    />
                  </div>
                )
              : !_.isEmpty(selectedFilters)
                ? (
                  <div className={cx('mt-1 mb-4', styles.Card)}>
                    <div className={cx('row no-gutters')} style={{ overflow: 'hidden' }}>
                      <span className={cx(styles.Heading, styles.Width1)}>{t('translation_vendorTags:vendorTagList.tagName')}</span>
                      {categoryLabel === 'location' ? (
                        <>
                          <span className={cx(styles.Heading, styles.Width2)}>{t('translation_vendorTags:vendorTagList.country')}</span>
                          <span className={cx(styles.Heading, styles.Width3)}>{t('translation_vendorTags:vendorTagList.state')}</span>
                          <span className={cx(styles.Heading, styles.Width4)}>{t('translation_vendorTags:vendorTagList.city')}</span>
                          <span className={cx(styles.Heading, styles.Width5)}>{t('translation_vendorTags:vendorTagList.hierarchy')}</span>
                        </>
                      )
                        : categoryLabel === 'function' ? (
                          <>
                            <span className={cx(styles.Heading, styles.Width2)}>function</span>
                            <span className={cx(styles.Heading, styles.Width3)}>role</span>
                            <span className={cx(styles.Heading, styles.WidthFuncHierarchy)}>{t('translation_vendorTags:vendorTagList.hierarchy')}</span>
                          </>
                        )
                          : null}
                    </div>

                    <hr className={styles.HrStyle} />
                    {showSelectedFiltersNotification && !_.isEmpty(selectedFilterTagData)
                      ? (
                        <div className="row no-gutters">
                          <span className={styles.FiltersMessage}>
                            {t('translation_vendorTags:vendorTagList.showingResults')}
                          </span>
                        </div>
                      )
                      : null}
                    <div style={{ overflow: 'auto', maxHeight: '40rem' }} className={scrollStyle.scrollbarBlue} />

                    {
                      !_.isEmpty(selectedFilters) && !_.isEmpty(selectedFilterTagData)
                        ? selectedFilterTagData.map((item) => (
                          categoryLabel === 'location'
                            ? (
                              <VendorTagRow
                                categoryLabel={categoryLabel}
                                key={item.tagName.name}
                                tagName={item.tagName.name}
                                tagId={item.tagName.tag_uuid}
                                country={!_.isEmpty(item.country) ? item.country.name : 'n/a'}
                                state={!_.isEmpty(item.state) ? item.state.name : 'n/a'}
                                city={!_.isEmpty(item.city) ? item.city.name : 'n/a'}
                                hierarchy={!_.isEmpty(item.hierarchy)
                                  ? item.hierarchy.map((each, index) => (
                                    <span key={each.name}>
                                      {each.name}
                                      {' '}
                                      {index === item.hierarchy.length - 1 ? '' : '> '}
                                    </span>
                                  ))
                                  : 'n/a'}
                                handleSelectedTasks={
                                  () => this.handleSelectedTasks(item.tagName.tag_uuid)
                                }
                                allTagsSelected={allTagsSelected}
                                selectedTags={selectedTags}
                              />
                            )
                            : categoryLabel === 'function'
                              ? (
                                <VendorTagRow
                                  categoryLabel={categoryLabel}
                                  key={item.tagName.name}
                                  tagName={item.tagName.name}
                                  tagId={item.tagName.tag_uuid}
                                  func={!_.isEmpty(item.function) ? item.function.name : 'n/a'}
                                  role={!_.isEmpty(item.role) ? item.role.name : 'n/a'}
                                  hierarchy={!_.isEmpty(item.hierarchy)
                                    ? item.hierarchy.map((each, index) => (
                                      <span key={each.name}>
                                        {each.name}
                                        {' '}
                                        {index === item.hierarchy.length - 1 ? '' : '> '}
                                      </span>
                                    ))
                                    : 'n/a'}
                                  handleSelectedTasks={
                                    () => this.handleSelectedTasks(item.tagName.tag_uuid)
                                  }
                                  allTagsSelected={allTagsSelected}
                                  selectedTags={selectedTags}
                                />
                              )
                              : null
                        ))
                        : <div className={cx('d-flex justify-content-center', styles.Heading)}>{t('translation_vendorTags:vendorTagList.noResults')}</div>
                    }
                  </div>
                )
                : null)}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  clientListState: state.vendorMgmt.vendorTags.clientListState,
  vendorTagsCount: state.vendorMgmt.vendorTags.getVendorTagsCount,
  vendorTagsCountState: state.vendorMgmt.vendorTags.getVendorTagsCountState,
  vendorTagsState: state.vendorMgmt.vendorTags.vendorTagsState,
  vendorTags: state.vendorMgmt.vendorTags.vendorTags,

  postAssignedTags: state.vendorMgmt.vendorTagsAssign.postAssignedTags,
  postAssignedTagsState: state.vendorMgmt.vendorTagsAssign.postAssignedTagsState,

  unassignData: state.vendorMgmt.vendorTags.unassignData,
  unassignState: state.vendorMgmt.vendorTags.unassignState,

  selectedFilterTagCountState: state.vendorMgmt.vendorTags.selectedFilterTagCountState,
  selectedFilterTagCount: state.vendorMgmt.vendorTags.selectedFilterTagCount,
  selectedFilterTagState: state.vendorMgmt.vendorTags.selectedFilterTagState,
  selectedFilterTagData: state.vendorMgmt.vendorTags.selectedFilterTagData,

  error: state.vendorMgmt.vendorTags.error,
});

const mapDispatchToProps = (dispatch) => ({
  onGetInitState: () => dispatch(actions.initState()),
  onPostUnassignTags: (orgId, vendorId, payload, selectAll, category) => dispatch(
    actions.postUnassignTags(orgId, vendorId, payload, selectAll, category),
  ),
  onPostAssignedTags: (orgId, vendorId, payload) => dispatch(
    vendorTagsAssignmentActions.postAssignedTags(orgId, vendorId, payload),
  ),
});

export default withTranslation()(withRouter(
  connect(mapStateToProps, mapDispatchToProps)(VendorTagList),
));
