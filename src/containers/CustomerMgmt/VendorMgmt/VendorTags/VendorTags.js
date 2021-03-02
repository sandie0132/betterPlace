/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from 'react-crux';

import _ from 'lodash';
import cx from 'classnames';
import styles from './VendorTags.module.scss';
// import scrollStyle from '../../../../components/Atom/ScrollBar/ScrollBar.module.scss';

import CardHeader from '../../../../components/Atom/PageTitle/PageTitle';
import ArrowLink from '../../../../components/Atom/ArrowLink/ArrowLink';
import ClientListDropdown from './ClientListDropdown/ClientListDropdown';

import container from '../../../../assets/icons/greenBgBuilding.svg';
// import search from '../../../../assets/icons/search.svg';
import clearGrey from '../../../../assets/icons/clearFilters.svg';
import clearBlue from '../../../../assets/icons/resetBlue.svg';
import whiteCross from '../../../../assets/icons/closeWhite.svg';

import * as actions from './Store/action';
import VendorTagList from './VendorTagList/VendorTagList';
import TagSearchField from '../TagSearch/TagSearchField/TagSearchField';

// import HasAccess from '../../../../services/HasAccess/HasAccess';
const regex = /(?:pageNumber=)([0-9]+)/;
const regex1 = /(&pageNumber=)([0-9]+)/;

class VendorTags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagHeading: '',
      tagLabel: 'geographical',
      categoryLabel: 'location',
      pageSize: 20,
      orgOption: '',
      orgOptionId: '',
      searchKey: '',
      selectedFilters: [],
      selectedFiltersId: [],
    };
  }

    componentDidMount = () => {
      const { match } = this.props;
      this.handleVendorTag();
      this.props.onGetVendorData(match.params.uuid, match.params.vendorId);
      this.props.onGetOrgName(match.params.uuid);
    }

    handleVendorTag = () => {
      const { match, location, clientObject } = this.props;
      let {
        // eslint-disable-next-line prefer-const
        tagHeading, categoryLabel, tagLabel, orgOption, orgOptionId, pageSize,
      } = this.state;
      if (!_.isEmpty(this.props.clientObject)) {
        orgOption = clientObject.name;
        orgOptionId = clientObject.orgId;
      }
      if (match.params.category === 'location-sites') {
        tagHeading = 'assign location and sites';
        tagLabel = 'geographical';
        categoryLabel = 'location';
      } else if (match.params.category === 'function-role') {
        tagHeading = 'assign function and roles';
        tagLabel = 'functional';
        categoryLabel = 'function';
      }
      this.setState({
        tagHeading,
        tagLabel,
        categoryLabel,
        selectedFilters: [],
        selectedFiltersId: [],
        orgOption,
        orgOptionId,
      });
      this.props.onGetVendorTagsCount(
        match.params.uuid, match.params.vendorId, tagLabel, pageSize, location.search, orgOptionId,
      );
    }

    componentDidUpdate = (prevProps) => {
      const {
        match, getOrgNameState, getOrgName, clientList, clientListState,
        vendorTagsCountState, vendorTagsCount, unassignState,
        selectedFilterTagCount, selectedFilterTagCountState, postAssignedTagsState,
        clientObject,
      } = this.props;
      // eslint-disable-next-line prefer-const
      let { location } = this.props;
      const {
        pageSize, selectedFilters, selectedFiltersId,
      } = this.state;

      let { orgOption, orgOptionId } = this.state;
      // call shared tags - count api again if undo is clicked from notif after unassignment
      if (prevProps.postAssignedTagsState !== postAssignedTagsState && postAssignedTagsState === 'SUCCESS') {
        this.props.onGetVendorTagsCount(match.params.uuid, match.params.vendorId,
          this.state.tagLabel, pageSize, location.search, orgOptionId);
      }

      // get dropdown values
      if (prevProps.getOrgNameState !== getOrgNameState && getOrgNameState === 'SUCCESS') {
        this.props.onGetClientList(match.params.uuid, getOrgName);
      }

      // set state for dropdown values as orgId first time
      if (prevProps.clientListState !== clientListState && clientListState === 'SUCCESS') {
        orgOption = clientList[0].name;
        orgOptionId = clientList[0].orgId;

        if (this.props.postAssignedTagsState === 'SUCCESS' && !_.isEmpty(this.props.clientObject)) {
          orgOption = clientObject.name;
          orgOptionId = clientObject.orgId;
        }
        this.setState({
          orgOption,
          orgOptionId,
        });
      }

      // pagination related code for vendor tags
      if (prevProps.vendorTagsCountState !== vendorTagsCountState && vendorTagsCountState === 'SUCCESS') {
        if (vendorTagsCount.count > pageSize) {
          if (location.search.includes('pageNumber')) {
            this.props.onGetVendorTags(
              match.params.uuid, match.params.vendorId, this.state.tagLabel, pageSize,
              location.search, orgOptionId,
            );
          } else {
            let redirectPath = '';
            if (location.search.length !== 0) {
              redirectPath = `${location.pathname + location.search}&pageNumber=1`;
            } else {
              redirectPath = `${location.pathname}?pageNumber=1`;
            }
            this.props.history.push(redirectPath);
          }
        } else if (location.search.includes('?pageNumber=')) {
          const newSearchPath = location.search.replace(regex, '');
          const redirectPath = location.pathname + newSearchPath;
          this.props.history.push(redirectPath);
        } else if (location.search.includes('&pageNumber=')) {
          const newSearchPath = location.search.replace(regex1, '');
          const redirectPath = location.pathname + newSearchPath;
          this.props.history.push(redirectPath);
          this.props.onGetVendorTags(match.params.uuid, match.params.vendorId, this.state.tagLabel,
            pageSize, location.search, orgOptionId);
        } else {
          this.props.onGetVendorTags(match.params.uuid, match.params.vendorId, this.state.tagLabel,
            pageSize, location.search, orgOptionId);
        }
      }

      // pagination for selected filters
      if (prevProps.selectedFilterTagCountState !== selectedFilterTagCountState && selectedFilterTagCountState === 'SUCCESS') {
        if (selectedFilterTagCount.count > pageSize) {
          if (location.search.includes('pageNumber')) {
            this.props.onGetSelectedFilters(match.params.uuid, match.params.vendorId,
              this.state.tagLabel, pageSize, location.search, orgOptionId, selectedFiltersId);
          } else {
            let redirectPath = '';
            if (location.search.length !== 0) {
              redirectPath = `${location.pathname + location.search}&pageNumber=1`;
            } else {
              redirectPath = `${location.pathname}?pageNumber=1`;
            }
            this.props.history.push(redirectPath);
          }
        } else if (location.search.includes('?pageNumber=')) {
          const newSearchPath = location.search.replace(regex, '');
          const redirectPath = location.pathname + newSearchPath;
          this.props.history.push(redirectPath);
        } else if (location.search.includes('&pageNumber=')) {
          const newSearchPath = location.search.replace(regex1, '');
          const redirectPath = location.pathname + newSearchPath;
          this.props.history.push(redirectPath);
          this.props.onGetSelectedFilters(match.params.uuid, match.params.vendorId,
            this.state.tagLabel, pageSize, location.search, orgOptionId, selectedFiltersId);
        } else {
          this.props.onGetSelectedFilters(match.params.uuid, match.params.vendorId,
            this.state.tagLabel, pageSize, location.search, orgOptionId, selectedFiltersId);
        }
      }

      // if change in pageNumber-url, then call api
      if (prevProps.match.params.category !== match.params.category) {
        this.handleVendorTag();
      } else if (prevProps.location.search !== this.props.location.search) {
        if (!_.isEmpty(selectedFilters)) {
          if (location.search.includes('pageNumber')) {
            this.props.onGetSelectedFilters(match.params.uuid, match.params.vendorId,
              this.state.tagLabel, pageSize, location.search, orgOptionId, selectedFiltersId);
          } else {
            const postPayload = {
              clientId: orgOptionId,
              tagIds: selectedFiltersId,
            };
            this.props.onGetSelectedFiltersCount(match.params.uuid, match.params.vendorId,
              this.state.tagLabel, pageSize, location.search, postPayload);
          }
        } else {
          // eslint-disable-next-line no-lonely-if
          if (location.search.includes('pageNumber')) {
            this.props.onGetVendorTags(match.params.uuid, match.params.vendorId,
              this.state.tagLabel, pageSize, location.search, orgOptionId);
          } else {
            this.props.onGetVendorTagsCount(match.params.uuid, match.params.vendorId,
              this.state.tagLabel, pageSize, location.search, orgOptionId);
          }
        }
      }

      // unassign success - call get api again
      if (prevProps.unassignState !== unassignState && unassignState === 'SUCCESS') {
        if (!_.isEmpty(selectedFilters)) {
          const postPayload = {
            clientId: orgOptionId,
            tagIds: selectedFiltersId,
          };
          this.props.onGetSelectedFiltersCount(match.params.uuid, match.params.vendorId,
            this.state.tagLabel, pageSize, location.search, postPayload);
        } else {
          this.props.onGetVendorTagsCount(match.params.uuid, match.params.vendorId,
            this.state.tagLabel, pageSize, location.search, orgOptionId);
        }
      }
    }

    componentWillUnmount = () => {
      this.props.onGetInitState();
    }

    handleOrgOption = (selectedOrgOption, selectedOrgOptionId) => {
      const { match, location } = this.props;
      const { tagLabel, pageSize } = this.state;
      this.setState({
        orgOption: selectedOrgOption,
        orgOptionId: selectedOrgOptionId,
        selectedFilters: [],
        selectedFiltersId: [],
      });

      const currentUrlParams = new URLSearchParams(location.search.slice(1));
      if (!_.isEmpty(location.search) && location.search.includes('pageNumber')) { // removing pageNumber from url
        currentUrlParams.delete('pageNumber');
      }

      this.props.onGetVendorTagsCount(match.params.uuid, match.params.vendorId,
        tagLabel, pageSize, currentUrlParams, selectedOrgOptionId);
      this.props.onGetSelectedClient(selectedOrgOptionId);
    }

    handleSearch = (event, inputIdentifier, action) => {
      const { match, location } = this.props;
      const {
        selectedFilters, selectedFiltersId, tagLabel, pageSize, orgOptionId,
      } = this.state;
      let updatedTags = _.cloneDeep(selectedFilters);
      let updatedTagUuid = _.cloneDeep(selectedFiltersId);

      if (inputIdentifier === 'tags') {
        if (action === 'add') {
          updatedTags = this.handleInsertInTags(updatedTags, event.value);
          updatedTagUuid.push(event.value.uuid);
        }
        if (action === 'delete') {
          updatedTags = this.handleDeleteInTags(updatedTags, event);
          updatedTagUuid = updatedTagUuid.filter((tag) => tag !== event.uuid);
        }
      }
      this.setState({ selectedFilters: updatedTags, selectedFiltersId: updatedTagUuid });
      const postPayload = {
        clientId: orgOptionId,
        tagIds: updatedTagUuid,
      };
      this.props.onGetSelectedFiltersCount(match.params.uuid, match.params.vendorId,
        tagLabel, pageSize, location.search, postPayload);
    };

    handleInsertInTags = (tagList, tag) => [...tagList.slice(0), tag]

    handleDeleteInTags = (tagList, targetTag) => (
      tagList.filter((tag) => tag.uuid !== targetTag.uuid)
    )

    handleClearTagFilters = () => {
      const { match, location } = this.props;
      this.setState({ selectedFilters: [], selectedFiltersId: [] });
      this.props.onGetVendorTagsCount(match.params.uuid, match.params.vendorId,
        this.state.tagLabel, this.state.pageSize, location.search, this.state.orgOptionId);
    }

    render() {
      const {
        t, match, vendorData, clientList, clientListState, getOrgName,
      } = this.props;
      const orgId = match.params.uuid;
      const { vendorId, category } = match.params;

      let {
        // eslint-disable-next-line prefer-const
        tagHeading, tagLabel, categoryLabel, orgOption, orgOptionId, searchKey,
        // eslint-disable-next-line prefer-const
        selectedFilters, selectedFiltersId,
      } = this.state;

      const orgName = !_.isEmpty(getOrgName) ? getOrgName.name.toLowerCase() : 'org_name';
      const vendorName = !_.isEmpty(vendorData) ? vendorData.vendorLegalName.toLowerCase() : 'vendor_name';

      return (
        <div className={styles.alignCenter}>
          <ArrowLink
            label={orgName + t('translation_vendorTags:label')}
            url={`/customer-mgmt/org/${orgId}/vendor-mgmt?filter=vendors`}
          />

          <div className="d-flex flex-row justify-content-between">
            <CardHeader label={tagHeading} iconSrc={container} />
            <Link to={`/customer-mgmt/org/${orgId}/vendor-mgmt/vendor/${vendorId}/config/client/${orgOptionId}/${category}/assign`}>
              <Button
                type="add"
                label={`${t('translation_vendorTags:assign')} ${categoryLabel}`}
                isDisabled={_.isEmpty(orgOptionId)}
                className={cx('mt-3', styles.AssignButton)}
              />
            </Link>
          </div>

          <div className={cx('mb-2', styles.CardLayout)}>
            <div className="row no-gutters">
              <div className="d-flex flex-column" style={{ width: '100%' }}>
                <label className={cx('mb-1', styles.SmallLabel)}>
                  {`${t('translation_vendorTags:view')} ${categoryLabel} ${t('translation_vendorTags:tagsFrom')}`}
                </label>
                <ClientListDropdown
                  options={clientList}
                  onChange={(value, id) => this.handleOrgOption(value, id)}
                  className="col-4 px-0"
                  value={orgOption}
                  valueId={orgOptionId}
                  orgId={orgId}
                  firstSectionLabel="my organisation"
                  secondSectionLabel="my clients"
                  showLoader={clientListState === 'LOADING'}
                />
              </div>
            </div>

            <hr className={styles.HorizontalLine} />

            <div className="row no-gutters mt-4">
              <div className={cx('col-12 px-0')}>
                <TagSearchField
                  name={categoryLabel}
                  hideTagsInInput
                  placeholder={`${t('translation_vendorTags:search')} ${orgOption} ${categoryLabel} ${t('translation_vendorTags:tag')} ${t('translation_vendorTags:assigned')} ${categoryLabel}`}
                  orgId={orgId}
                  vendorId={vendorId}
                  clientId={orgOptionId}
                  category={tagLabel}
                  tags={selectedFilters}
                  isSelected={true}
                  dropdownMenu={cx(styles.DropdownWidth)}
                  disableTags={selectedFiltersId}
                  className={styles.SearchInputWidth}
                  updateTag={(value, action) => this.handleSearch(value, 'tags', action)}
                />
              </div>
            </div>

            <div className="row no-gutters justify-content-between mb-3 mt-4">
              <span className={styles.SelectedFilter}>{t('translation_vendorTags:selectedFilter')}</span>

              <span className={styles.Cursor} role="button" aria-hidden="true" onClick={this.handleClearTagFilters}>
                <img
                  src={!_.isEmpty(selectedFilters) ? clearBlue : clearGrey}
                  alt={t('translation_vendorTags:image_alt_vendorTags.clear')}
                  className="pr-2"
                />
                <span className={!_.isEmpty(selectedFilters) ? styles.BlueText : (styles.GreyText)}>{t('translation_vendorTags:clearFilter')}</span>
              </span>
            </div>

            <div className="row no-gutters">
              {_.isEmpty(selectedFilters)
                ? <span className={styles.GreyText}>{t('translation_vendorTags:selectMore')}</span>
                : selectedFilters.map((item) => (
                  <span className={styles.SelectedFilterTag} key={item.uuid}>
                    {item.name}
                    <span className={cx('ml-3 mr-1', styles.WhiteVerticalLine)} />
                    <img
                     //  role="button"
                      aria-hidden
                      src={whiteCross}
                      className={styles.Cursor}
                      onClick={() => this.handleSearch(item, 'tags', 'delete')}
                      alt={t('translation_vendorTags:image_alt_vendorTags.close')}
                    />
                  </span>
                ))}
            </div>
          </div>

          <div className="mt-3">
            <VendorTagList
              orgName={orgName}
              vendorName={vendorName}
              searchKey={searchKey}
              tagHeading={tagHeading}
              tagLabel={tagLabel}
              categoryLabel={categoryLabel}
              orgOption={orgOption}
              orgOptionId={orgOptionId}
              selectedFilters={selectedFilters}
              selectedFiltersId={selectedFiltersId}
            />
          </div>
        </div>
      );
    }
}

const mapStateToProps = (state) => ({
  getOrgName: state.vendorMgmt.vendorTags.getOrgName,
  getOrgNameState: state.vendorMgmt.vendorTags.getOrgNameState,
  selectedClient: state.vendorMgmt.vendorTags.getSelectedClient,
  selectedClientState: state.vendorMgmt.vendorTags.getSelectedClientState,

  vendorTagsCount: state.vendorMgmt.vendorTags.getVendorTagsCount,
  vendorTagsCountState: state.vendorMgmt.vendorTags.getVendorTagsCountState,
  vendorTags: state.vendorMgmt.vendorTags.vendorTags,
  vendorTagsState: state.vendorMgmt.vendorTags.vendorTagsState,

  vendorData: state.vendorMgmt.vendorTags.getVendorData,
  vendorDataState: state.vendorMgmt.vendorTags.getVendorDataState,

  clientList: state.vendorMgmt.vendorTags.clientList,
  clientListState: state.vendorMgmt.vendorTags.clientListState,

  unassignData: state.vendorMgmt.vendorTags.unassignData,
  unassignState: state.vendorMgmt.vendorTags.unassignState,

  clientObject: state.vendorMgmt.vendorTagsAssign.selectedClient,
  postAssignedTags: state.vendorMgmt.vendorTagsAssign.postAssignedTags,
  postAssignedTagsState: state.vendorMgmt.vendorTagsAssign.postAssignedTagsState,

  selectedFilterTagCountState: state.vendorMgmt.vendorTags.selectedFilterTagCountState,
  selectedFilterTagCount: state.vendorMgmt.vendorTags.selectedFilterTagCount,
  error: state.vendorMgmt.vendorTags.error,
});

const mapDispatchToProps = (dispatch) => ({
  onGetInitState: () => dispatch(actions.initState()),
  onGetOrgName: (orgId) => dispatch(actions.getOrgNameById(orgId)),
  onGetSelectedClient: (orgId) => dispatch(actions.getSelectedClientName(orgId)),
  onGetVendorTagsCount: (orgId, vendorId, category, pageSize, targetUrl, orgOptionId) => dispatch(
    actions.getVendorTagsCount(orgId, vendorId, category, pageSize, targetUrl, orgOptionId),
  ),
  onGetVendorTags: (orgId, vendorId, category, pageSize, targetUrl, orgOptionId) => dispatch(
    actions.getVendorTags(orgId, vendorId, category, pageSize, targetUrl, orgOptionId),
  ),
  onGetVendorData: (orgId, vendorId) => dispatch(actions.getVendorData(orgId, vendorId)),
  onGetClientList: (orgId, orgDetails) => dispatch(actions.getClientList(orgId, orgDetails)),
  onGetSelectedFiltersCount: (orgId, vendorId, tagLabel, pageSize, targetUrl, payload) => dispatch(
    actions.getSelectedFiltersCount(orgId, vendorId, tagLabel, pageSize, targetUrl, payload),
  ),
  onGetSelectedFilters: (orgId, vendorId, tagLabel, pageSize, targetUrl, payload,
    selectedFiltersId) => dispatch(
    actions.getSelectedFilters(orgId, vendorId, tagLabel, pageSize, targetUrl, payload,
      selectedFiltersId),
  ),
});

export default withTranslation()(withRouter(
  connect(mapStateToProps, mapDispatchToProps)(VendorTags),
));
