/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Button } from 'react-crux';
import _ from 'lodash';
import cx from 'classnames';
import styles from './VendorTagsAssignment.module.scss';
import scrollStyle from '../../../../components/Atom/ScrollBar/ScrollBar.module.scss';

import EmptyState from '../../../../components/Atom/EmptyState/EmptyState';
import ArrowLink from '../../../../components/Atom/ArrowLink/ArrowLink';
import WarningPopUp from '../../../../components/Molecule/WarningPopUp/WarningPopUp';
import Loader from '../../../../components/Organism/Loader/Loader';

import close from '../../../../assets/icons/closeBlack.svg';
import folderIcon from '../../../../assets/icons/locationTags.svg';
import warn from '../../../../assets/icons/deleteWithBg.svg';
import expand from '../../../../assets/icons/expandGrey.svg';

import TagAssignmentSearch from '../TagSearch/TagSearchField/TagAssignmentSearch';
import TagTraverse from '../TagSearch/TagTraverse/TagTraverse';
import ExpandTags from './ExpandTags/ExpandTags';

import * as actions from './Store/action';
import * as tagTraverseActions from '../TagSearch/TagTraverse/Store/action';
import * as vendorTagsActions from '../VendorTags/Store/action';

const defaultChildTagType = ['site', 'role'];
class VendorTagsAssignment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTags: [],
      selectedTagsId: [],
      selectedSites: [],
      selectedSitesId: [],
      showWarningPopUp: false,
      categoryLabel: 'location',
      tagLabel: '',
      expandTagList: false,
    };
  }

  componentDidMount = () => {
    const { match } = this.props;
    const orgId = match.params.uuid;
    const { clientId } = match.params;
    let { categoryLabel, tagLabel } = this.state;

    if (match.params.category === 'location-sites') {
      categoryLabel = 'location';
      tagLabel = 'geographical';
    } else if (match.params.category === 'function-role') {
      categoryLabel = 'function';
      tagLabel = 'functional';
    }
    this.setState({ categoryLabel, tagLabel });
    this.props.onGetOrgName(match.params.clientId);
    if (!_.isEmpty(match.params.category)) this.props.onGetTagList(orgId, tagLabel, clientId);
  }

  componentDidUpdate = (prevProps) => {
    const {
      match, postAssignedTagsState,
    } = this.props;

    if (prevProps.postAssignedTagsState !== postAssignedTagsState && postAssignedTagsState === 'SUCCESS') {
      this.props.history.push(`/customer-mgmt/org/${match.params.uuid}/vendor-mgmt/vendor/${match.params.vendorId}/config/${match.params.category}`);
    }
  }

  handleSearch = (event, inputIdentifier, action) => {
    const {
      selectedTags, selectedTagsId, selectedSites, selectedSitesId,
    } = this.state;
    let updatedTags = _.cloneDeep(selectedTags);
    let updatedTagUuid = _.cloneDeep(selectedTagsId);
    let updatedSities = _.cloneDeep(selectedSites);
    let updatedSitiesUuid = _.cloneDeep(selectedSitesId);
    let obj = {};
    if (inputIdentifier === 'tags') {
      if (action === 'add') {
        obj = this.handleInsertInTags(
          updatedTags, updatedTagUuid, updatedSities, updatedSitiesUuid, event.value,
        );
      } else if (action === 'delete') {
        obj = this.handleDeleteInTags(
          updatedTags, updatedTagUuid, updatedSities, updatedSitiesUuid, event.value,
        );
      }
      updatedTags = obj.selectedTags;
      updatedTagUuid = obj.selectedTagsId;
      updatedSities = obj.selectedSites;
      updatedSitiesUuid = obj.selectedSitesId;
    }
    this.setState({
      selectedTags: updatedTags,
      selectedTagsId: updatedTagUuid,
      selectedSites: updatedSities,
      selectedSitesId: updatedSitiesUuid,
    });
  };

  handleClearTagsWarning = () => {
    const { showWarningPopUp } = this.state;
    this.setState({ showWarningPopUp: !showWarningPopUp });
  }

  handleClearTags = () => {
    this.setState({
      showWarningPopUp: false,
      selectedTags: [],
      selectedTagsId: [],
      selectedSites: [],
      selectedSitesId: [],
    });
  }

  handleDeleteSelectedTag = (item) => {
    let { selectedSites, selectedSitesId } = this.state;
    selectedSites = selectedSites.filter((tag) => tag.uuid !== item.uuid);
    selectedSitesId = selectedSitesId.filter((tagId) => tagId !== item.uuid);
    this.setState({ selectedSites, selectedSitesId });
  }

  handleTagAssign = () => {
    const { selectedSites, selectedSitesId } = this.state;
    const { match, getOrgName } = this.props;
    let payload = [];

    if (match.params.uuid === match.params.clientId) {
      payload = selectedSitesId;
    } else {
      selectedSites.forEach((eachTag) => {
        payload.push(eachTag.tag_uuid);
      });
    }

    const postPayload = {
      clientId: match.params.clientId,
      tagIds: payload,
    };
    this.props.onPostAssignedTags(
      match.params.uuid, match.params.vendorId, postPayload, getOrgName.name,
    );
  }

  handleTagSelect = (event, action) => { // tag traverse function
    let {
      selectedTags, selectedTagsId, selectedSites, selectedSitesId,
    } = this.state;
    let obj = {};

    if (action === 'add') {
      obj = this.handleInsertInTags(
        selectedTags, selectedTagsId, selectedSites, selectedSitesId, event.value,
      );
    } else if (action === 'delete') {
      obj = this.handleDeleteInTags(
        selectedTags, selectedTagsId, selectedSites, selectedSitesId, event.value,
      );
    }
    selectedTags = obj.selectedTags;
    selectedTagsId = obj.selectedTagsId;
    selectedSites = obj.selectedSites;
    selectedSitesId = obj.selectedSitesId;

    this.setState({
      selectedTags, selectedTagsId, selectedSites, selectedSitesId,
    });
  };

  handleInsertInTags = (tagList, tagIdList, sites, sitesIdList, tag) => {
    const { tagData } = this.props;
    const existingTagData = _.cloneDeep(tagData);
    const tagId = tag.uuid;
    const tagType = tag.type;
    const index = _.findIndex(existingTagData, { tagType }) + 1;

    let childrenTagArray = [];
    let childrenTagIdArray = [];
    let sitiesArray = [];
    let sitiesIdArray = [];

    if (_.findIndex(defaultChildTagType, (n) => n === tagType) < 0) {
      childrenTagArray = [tag];
      childrenTagIdArray = [tagId];
      this.getAllChildTags(
        tagId, existingTagData, index, childrenTagArray, childrenTagIdArray, sitiesArray,
        sitiesIdArray,
      );
    } else {
      sitiesArray = [tag];
      sitiesIdArray = [tagId];
    }

    childrenTagArray = _.unionBy(tagList, childrenTagArray, 'uuid');
    childrenTagIdArray = _.union(tagIdList, childrenTagIdArray);
    sitiesArray = _.unionBy(sites, sitiesArray, 'uuid');
    sitiesIdArray = _.union(sitesIdList, sitiesIdArray);

    const returnObj = {
      selectedTags: childrenTagArray,
      selectedTagsId: childrenTagIdArray,
      selectedSites: sitiesArray,
      selectedSitesId: sitiesIdArray,
    };
    return returnObj;
  }

  handleDeleteInTags = (tagList, tagIdList, sites, sitesIdList, tag) => {
    const { tagData } = this.props;
    const existingTagData = _.cloneDeep(tagData);
    const tagId = tag.uuid;
    const tagType = tag.type;
    const index = _.findIndex(existingTagData, { tagType }) + 1;

    let childrenTagArray = [];
    let childrenTagIdArray = [];
    let sitiesArray = [];
    let sitiesIdArray = [];

    if (_.findIndex(defaultChildTagType, (n) => n === tagType) < 0) {
      childrenTagArray = [tag];
      childrenTagIdArray = [tagId];
      this.getAllChildTags(
        tagId, existingTagData, index, childrenTagArray, childrenTagIdArray, sitiesArray,
        sitiesIdArray,
      );
      _.pullAllBy(tagList, childrenTagArray, 'uuid');
      _.pullAll(tagIdList, childrenTagIdArray);
    } else {
      sitiesArray = [tag];
      sitiesIdArray = [tagId];
    }

    _.pullAllBy(sites, sitiesArray, 'uuid');
    _.pullAll(sitesIdList, sitiesIdArray);

    const returnObj = {
      selectedTags: tagList,
      selectedTagsId: tagIdList,
      selectedSites: sites,
      selectedSitesId: sitesIdList,
    };
    return returnObj;
  }

  getAllChildTags = (
    tagId, existingTagData, index, childrenTagArray, childrenTagIdArray, sitesArray, siteIdArray,
  ) => {
    const thisRef = this;
    const tagDataList = _.cloneDeep(existingTagData);
    const size = tagDataList.length;
    const tagData = (index < size) ? tagDataList[index] : {};
    const tagType = !_.isEmpty(tagData) ? tagData.tagType : '';
    const tagsArray = !_.isEmpty(tagData) ? tagData.tagList : [];

    _.remove(tagsArray, (n) => n.parent !== tagId);
    // eslint-disable-next-line no-plusplus
    index++;

    _.forEach(tagsArray, (value) => {
      const tagUuid = value.uuid;
      if (_.findIndex(defaultChildTagType, (n) => n === tagType) < 0) {
        childrenTagArray.push(value);
        childrenTagIdArray.push(tagUuid);
        thisRef.getAllChildTags(
          tagUuid, existingTagData, index, childrenTagArray, childrenTagIdArray, sitesArray,
          siteIdArray,
        );
      } else {
        siteIdArray.push(tagUuid);
        sitesArray.push(value);
      }
    });
  }

  handleSelectAllTags = (tagList) => {
    const {
      selectedTags, selectedTagsId, selectedSites, selectedSitesId,
    } = this.state;
    const thisRef = this;
    let updatedSelectedTag = _.cloneDeep(selectedTags);
    let updatedSelectedTagsId = _.cloneDeep(selectedTagsId);
    let updatedSities = _.cloneDeep(selectedSites);
    let updatedSitiesUuid = _.cloneDeep(selectedSitesId);

    _.forEach(tagList, ((tag) => {
      let tagSelected = false;
      _.forEach(updatedSelectedTag, ((selectedTag) => {
        if (selectedTag.uuid === tag.uuid) {
          tagSelected = true;
        }
      }));
      if (!tagSelected) {
        const obj = thisRef.handleInsertInTags(
          updatedSelectedTag, updatedSelectedTagsId, updatedSities, updatedSitiesUuid, tag,
        );
        updatedSelectedTag = obj.selectedTags;
        updatedSelectedTagsId = obj.selectedTagsId;
        updatedSities = obj.selectedSites;
        updatedSitiesUuid = obj.selectedSitesId;
      }
    }));

    this.setState({
      selectedTags: updatedSelectedTag,
      selectedTagsId: updatedSelectedTagsId,
      selectedSites: updatedSities,
      selectedSitesId: updatedSitiesUuid,
    });
  }

  toggleExpandList = () => {
    const { expandTagList } = this.state;
    this.setState({ expandTagList: !expandTagList });
  }

  render() {
    const {
      t, match, getOrgName, tagData, currentOrgData, getTagTraverseState,
    } = this.props;
    const orgId = match.params.uuid;
    const { vendorId, category, clientId } = match.params;

    const {
      categoryLabel, selectedTags, selectedTagsId, selectedSites, selectedSitesId,
      tagLabel, showWarningPopUp, expandTagList,
    } = this.state;
    const allSelectedTags = [...selectedTags, ...selectedSites];
    const allSelectedTagsId = [...selectedTagsId, ...selectedSitesId];
    const orgName = !_.isEmpty(getOrgName) ? getOrgName.name.toLowerCase() : 'org_name';
    const currentOrgDataName = !_.isEmpty(currentOrgData) ? currentOrgData.name.toLowerCase() : 'current org';

    return (
      <div className={styles.AlignCenter}>
        <ArrowLink
          label={t('translation_vendorTags:vendorTagsAssignment.back') + categoryLabel}
          url={`/customer-mgmt/org/${orgId}/vendor-mgmt/vendor/${vendorId}/config/${category}`}
        />
        {getTagTraverseState === 'LOADING'
          ? <Loader />
          : getTagTraverseState === 'SUCCESS' && !_.isEmpty(tagData)
            ? (
              <div className={styles.CardLayout}>
                <span className={styles.Heading}>
                  {`${orgName} ${categoryLabel} ${t('translation_vendorTags:vendorTagsAssignment.tags')}`}
                </span>

                <div className={cx('row no-gutters mt-3', styles.SearchBorder)}>
                  <div className="col-12 px-0">
                    <TagAssignmentSearch
                      name={categoryLabel}
                      noBorder
                      hideTagsInInput
                      placeholder={t('translation_vendorTags:vendorTagsAssignment.search') + categoryLabel + t('translation_vendorTags:vendorTagsAssignment.tag')}
                      orgId={orgId}
                      clientId={clientId}
                      category={tagLabel}
                      tags={allSelectedTags}
                      isSelected={false}
                      dropdownMenu={cx(styles.DropdownWidth)}
                      disableTags={allSelectedTagsId}
                      // BarStyle={styles.tagSearch}
                      updateTag={(value, action) => this.handleSearch(value, 'tags', action)}
                    />
                  </div>
                </div>

                <div className="row no-gutters justify-content-between mt-4">
                  <span className={styles.SmallText}>
                    {categoryLabel === 'location'
                      ? `${t('translation_vendorTags:vendorTagsAssignment.selectedSites')}`
                      : `${t('translation_vendorTags:vendorTagsAssignment.selectedRoles')}`}
                    {` (${selectedSites.length > 9 ? '' : '0'}${selectedSites.length})`}
                  </span>
                  <span className={_.isEmpty(selectedSites) ? styles.GreyText : styles.BlueText} role="button" aria-hidden="true" disabled={_.isEmpty(selectedSites)} onClick={this.handleClearTagsWarning}>{t('translation_vendorTags:vendorTagsAssignment.clear')}</span>
                </div>

                {expandTagList
                  ? (
                    <ExpandTags
                      selectedTags={selectedSites}
                      handleDeleteSelectedTag={this.handleDeleteSelectedTag}
                      toggleExpandList={this.toggleExpandList}
                    />
                  )
                  : (
                    <div className={cx('row no-gutters', styles.TagsBg, scrollStyle.scrollbar)}>
                      {_.isEmpty(selectedSites)
                        ? <span className={styles.GreySmallText}>{t('translation_vendorTags:vendorTagsAssignment.display')}</span>
                        : (
                          <>
                            {selectedSites.map((item, index) => (
                              index < 9
                                ? (
                                  <span className={styles.SelectedWhiteTag} key={item.uuid}>
                                    <img
                                      src={folderIcon}
                                      className={cx(styles.FolderIcon, 'pr-2 ml-1')}
                                      alt={t('translation_vendorTags:image_alt_vendorTags.folder')}
                                    />
                                    {' '}
                                    {item.name}
                                    <img
                                      aria-hidden="true"
                                      src={close}
                                      className={cx('ml-3', styles.Cursor)}
                                      onClick={() => this.handleDeleteSelectedTag(item)}
                                      alt={t('translation_vendorTags:image_alt_vendorTags.close')}
                                    />
                                  </span>
                                )
                                : null
                            ))}
                            {selectedSites.length > 9
                              ? (
                                <span className={styles.SelectedWhiteTag}>
                                  {`+ ${(selectedSites.length - 9)} tags`}
                                </span>
                              ) : null}
                            <div className="justify-content-end align-self-end ml-auto">
                              <img
                                src={expand}
                                className={cx('', styles.Cursor)}
                                alt=""
                                onClick={this.toggleExpandList}
                                aria-hidden="true"
                              />
                            </div>
                          </>
                        )}
                    </div>
                  )}

                <div className="row no-gutters my-3">
                  <TagTraverse
                    orgId={orgId}
                    clientId={clientId}
                    category={tagLabel}
                    tags={allSelectedTags}
                    disableTags={[]}
                    updateTag={(value, action) => this.handleTagSelect(value, action)}
                    SectionStyle={styles.Traverse}
                    cardStyle={styles.Card}
                    ActiveClass={styles.ActiveClass}
                    SectionHead={styles.SectionHead}
                    showSelectAll
                    selectAllTags={
                      (tagList, action) => this.handleSelectAllTags(tagList, action)
                    }
                  />
                </div>

                <div className="row no-gutters justify-content-end">
                  <Button
                    type="save"
                    label={t('translation_vendorTags:vendorTagsAssignment.assign')}
                    isDisabled={false}
                    clickHandler={this.handleTagAssign}
                  />
                </div>

                {showWarningPopUp
                  ? (
                    <WarningPopUp
                      text={t('translation_vendorTags:vendorTagsAssignment.warningText')}
                      para={t('translation_vendorTags:vendorTagsAssignment.warningPara')}
                      confirmText={t('translation_vendorTags:vendorTagsAssignment.confirmText')}
                      cancelText={t('translation_vendorTags:vendorTagsAssignment.cancelText')}
                      icon={warn}
                      warningPopUp={this.handleClearTags}
                      closePopup={this.handleClearTagsWarning}
                    />
                  )
                  : null}
              </div>
            )
            : (
              <div className={styles.CardLayout}>
                <EmptyState
                  type="emptyVendorTagsList"
                  label={`${t('translation_vendorTags:vendorTagsAssignment.emptyState')} ${currentOrgDataName} ${t('translation_vendorTags:vendorTagsAssignment.and')} ${orgName}`}
                />
              </div>
            )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tagData: state.vendorMgmt.vendorTagTraverse.tagData,
  getTagTraverseState: state.vendorMgmt.vendorTagTraverse.getTagTraverseState,
  postAssignedTags: state.vendorMgmt.vendorTagsAssign.postAssignedTags,
  postAssignedTagsState: state.vendorMgmt.vendorTagsAssign.postAssignedTagsState,
  error: state.vendorMgmt.vendorTagsAssign.error,
  getOrgName: state.vendorMgmt.vendorTags.getOrgName,
  getOrgNameState: state.vendorMgmt.vendorTags.getOrgNameState,

  currentOrgData: state.orgMgmt.staticData.orgData,
});

const mapDispatchToProps = (dispatch) => ({
  onGetInitState: () => dispatch(actions.initState()),
  onGetOrgName: (orgId) => dispatch(vendorTagsActions.getOrgNameById(orgId)),
  onPostAssignedTags: (orgId, vendorId, payload, orgName) => dispatch(
    actions.postAssignedTags(orgId, vendorId, payload, orgName),
  ),
  onGetTagList: (orgId, category, clientId) => dispatch(
    tagTraverseActions.getTagTraverse(orgId, category, clientId),
  ),
});

export default withTranslation()(withRouter(
  connect(mapStateToProps, mapDispatchToProps)(VendorTagsAssignment),
));
