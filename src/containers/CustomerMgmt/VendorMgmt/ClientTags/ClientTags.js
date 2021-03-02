/* eslint-disable prefer-const */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';

import _ from 'lodash';
import cx from 'classnames';
import styles from './ClientTags.module.scss';
// import scrollStyle from '../../../../components/Atom/ScrollBar/ScrollBar.module.scss';

import CardHeader from '../../../../components/Atom/PageTitle/PageTitle';
import ArrowLink from '../../../../components/Atom/ArrowLink/ArrowLink';

import container from '../../../../assets/icons/greenBgBuilding.svg';
import clearGrey from '../../../../assets/icons/clearFilters.svg';
import clearBlue from '../../../../assets/icons/resetBlue.svg';
import whiteCross from '../../../../assets/icons/closeWhite.svg';

import * as actions from './Store/action';
import * as vendorTagsAction from '../VendorTags/Store/action';
import * as vendorProfileActions from '../VendorProfile/Store/action';

import ClientTagList from './ClientTagList/ClientTagList';
import ClientListDropdown from '../VendorTags/ClientListDropdown/ClientListDropdown';
import TagSearchField from '../TagSearch/TagSearchField/TagSearchField';
// import HasAccess from '../../../../services/HasAccess/HasAccess';

const regex = /(?:pageNumber=)([0-9]+)/;
const regex1 = /(&pageNumber=)([0-9]+)/;

class ClientTags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagHeading: '',
      tagLabel: 'geographical',
      categoryLabel: 'location',
      pageSize: 20,
      dropdownClientName: '',
      dropdownClientId: '',
      searchKey: '',
      selectedFilters: [],
      selectedFiltersId: [],
    };
  }

    componentDidMount = () => {
      const { match } = this.props;
      this.handleVendorTag();
      this.props.onGetClientData(match.params.uuid, match.params.clientId);
      this.props.onGetOrgName(match.params.uuid);
    }

    handleVendorTag = () => {
      const {
        match,
        // location
      } = this.props;
      let {
        tagHeading, categoryLabel, tagLabel,
      } = this.state;

      if (match.params.category === 'location-sites') {
        tagHeading = 'view location and sites';
        tagLabel = 'geographical';
        categoryLabel = 'location';
      } else if (match.params.category === 'function-role') {
        tagHeading = 'view function and roles';
        tagLabel = 'functional';
        categoryLabel = 'function';
      }
      this.setState({
        tagHeading, tagLabel, categoryLabel, selectedFilters: [], selectedFiltersId: [],
      });
      this.props.onGetClientTagsCount(match.params.uuid, match.params.clientId, tagLabel);
    }

    componentDidUpdate = (prevProps) => {
      const {
        match, location,
        clientTagsCountState, clientTagsCount,
        clientData, clientDataState,
        clientsClientList, clientsClientListState,
        selectedFilterTagCountState, selectedFilterTagCount,
      } = this.props;

      const {
        pageSize, tagLabel, selectedFiltersId, selectedFilters,
      } = this.state;

      if (prevProps.clientDataState !== clientDataState && clientDataState === 'SUCCESS') {
        this.props.onGetClientsClientList(match.params.clientId, match.params.uuid, clientData);
      }

      if (prevProps.clientsClientListState !== clientsClientListState && clientsClientListState === 'SUCCESS') {
        this.setState({
          dropdownClientName: clientsClientList[0].name,
          dropdownClientId: clientsClientList[0].orgId,
        });
      }

      if (prevProps.clientTagsCountState !== clientTagsCountState && clientTagsCountState === 'SUCCESS') {
        if (clientTagsCount.count > pageSize) {
          if (location.search.includes('pageNumber')) {
            this.props.onGetClientTagsList(
              match.params.uuid, match.params.clientId, this.state.tagLabel, pageSize,
              location.search, this.state.dropdownClientId,
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

          this.props.onGetClientTagsList(
            match.params.uuid, match.params.clientId, tagLabel, pageSize, location.search,
            this.state.dropdownClientId,
          );
        } else if (location.search.includes('&pageNumber=')) {
          const newSearchPath = location.search.replace(regex1, '');
          const redirectPath = location.pathname + newSearchPath;
          this.props.history.push(redirectPath);
          this.props.onGetClientTagsList(
            match.params.uuid, match.params.clientId, tagLabel, pageSize, location.search,
            this.state.dropdownClientId,
          );
        } else {
          this.props.onGetClientTagsList(
            match.params.uuid, match.params.clientId, tagLabel, pageSize, location.search,
            this.state.dropdownClientId,
          );
        }
      }

      if (prevProps.selectedFilterTagCountState !== selectedFilterTagCountState && selectedFilterTagCountState === 'SUCCESS') {
        if (selectedFilterTagCount.count > pageSize) {
          if (location.search.includes('pageNumber')) {
            this.props.onGetSelectedFilters(
              match.params.uuid, match.params.clientId, tagLabel, pageSize,
              location.search, this.state.dropdownClientId, selectedFiltersId,
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
          this.props.onGetSelectedFilters(
            match.params.uuid, match.params.clientId, tagLabel, pageSize, location.search,
            this.state.dropdownClientId, selectedFiltersId,
          );
        } else {
          this.props.onGetSelectedFilters(
            match.params.uuid, match.params.clientId, tagLabel, pageSize, location.search,
            this.state.dropdownClientId, selectedFiltersId,
          );
        }
      }

      // if change in pageNumber-url, then call api
      if (prevProps.match.params.category !== match.params.category) {
        this.handleVendorTag();
      } else if (prevProps.location.search !== this.props.location.search) {
        if (!_.isEmpty(selectedFilters)) {
          if (location.search.includes('pageNumber')) {
            this.props.onGetSelectedFilters(
              match.params.uuid, match.params.clientId, tagLabel, pageSize, location.search,
              this.state.dropdownClientId, selectedFiltersId,
            );
          } else {
            const postPayload = {
              clientId: this.state.dropdownClientId,
              tagIds: selectedFiltersId,
            };
            this.props.onGetSelectedFiltersCount(
              match.params.uuid, match.params.clientId, tagLabel, pageSize, location.search,
              postPayload,
            );
          }
        } else {
          // eslint-disable-next-line no-lonely-if
          if (location.search.includes('pageNumber')) {
            this.props.onGetClientTagsList(
              match.params.uuid, match.params.clientId, this.state.tagLabel, pageSize,
              location.search, this.state.dropdownClientId,
            );
          } else {
            this.props.onGetClientTagsCount(
              match.params.uuid, match.params.clientId, this.state.tagLabel, pageSize,
              location.search, this.state.dropdownClientId,
            );
          }
        }
      }
    }

    componentWillUnmount = () => {
      this.props.onGetInitState();
    }

    handleSearch = (event, inputIdentifier, action) => {
      const { match, location } = this.props;
      const {
        selectedFilters, selectedFiltersId, tagLabel, pageSize, dropdownClientId,
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
        clientId: dropdownClientId,
        tagIds: updatedTagUuid,
      };
      this.props.onGetSelectedFiltersCount(
        match.params.uuid, match.params.clientId, tagLabel, pageSize, location.search, postPayload,
      );
    };

    handleInsertInTags = (tagList, tag) => [...tagList.slice(0), tag]

    handleDeleteInTags = (tagList, targetTag) => (
      tagList.filter((tag) => tag.uuid !== targetTag.uuid)
    )

    handleClearTagFilters = () => {
      const { match, location } = this.props;
      this.setState({ selectedFilters: [], selectedFiltersId: [] });
      this.props.onGetClientTagsCount(
        match.params.uuid, match.params.clientId, this.state.tagLabel, this.state.pageSize,
        location.search, this.state.dropdownClientId,
      );
    }

    handleDropdownOption = (selectedOrgOption, selectedOrgOptionId) => {
      const { match, location } = this.props;
      const { tagLabel, pageSize } = this.state;
      this.setState({
        dropdownClientName: selectedOrgOption,
        dropdownClientId: selectedOrgOptionId,
        selectedFilters: [],
        selectedFiltersId: [],
      });

      const currentUrlParams = new URLSearchParams(location.search.slice(1));
      if (!_.isEmpty(location.search) && location.search.includes('pageNumber')) { // removing pageNumber from url
        currentUrlParams.delete('pageNumber');
      }

      this.props.onGetClientTagsCount(
        match.params.uuid, match.params.clientId, tagLabel, pageSize, location.search,
        selectedOrgOptionId,
      );
      this.props.onGetSelectedClient(selectedOrgOptionId);
    }

    render() {
      const {
        t, match, clientData, getOrgName, clientsClientList, clientsClientListState,
      } = this.props;
      const orgId = match.params.uuid;
      const { clientId } = match.params;

      let {
        tagHeading, tagLabel, categoryLabel, searchKey, selectedFilters, selectedFiltersId,
        dropdownClientName, dropdownClientId,
      } = this.state;

      const orgName = !_.isEmpty(getOrgName) ? getOrgName.name.toLowerCase() : 'org_name';
      const clientName = !_.isEmpty(clientData) ? clientData.legalName.toLowerCase() : 'client_name';

      return (
        <div className={styles.alignCenter}>
          <ArrowLink
            label={`${orgName}/configure client`}
            url={`/customer-mgmt/org/${orgId}/vendor-mgmt/client/${clientId}/clientprofile?filter=overall_insights`}
          />

          <div className="d-flex flex-row justify-content-between">
            <CardHeader label={tagHeading} iconSrc={container} />
          </div>

          <div className={cx('mb-2', styles.CardLayout)}>

            <div className="row no-gutters">
              <div className="d-flex flex-column" style={{ width: '100%' }}>
                <label className={cx('mb-1', styles.SmallLabel)}>
                  {`${t('translation_vendorTags:view')} ${categoryLabel} ${t('translation_vendorTags:tagsFrom')}`}
                </label>
                <ClientListDropdown
                  options={clientsClientList}
                  onChange={(value, id) => this.handleDropdownOption(value, id)}
                  className="col-4 px-0"
                  value={dropdownClientName}
                  valueId={dropdownClientId}
                  orgId={clientId}
                  firstSectionLabel="client"
                  secondSectionLabel={"client's client"}
                  showLoader={clientsClientListState === 'LOADING'}
                />
              </div>
            </div>

            <hr className={styles.HorizontalLine} />

            <div className="row no-gutters mt-4">
              <div className={cx('col-12 px-0')}>
                <TagSearchField
                  hideTagsInInput
                  placeholder={`${t('translation_vendorTags:search')} ${dropdownClientName} ${categoryLabel} ${t('translation_vendorTags:tag')} ${t('translation_vendorTags:assigned')} ${categoryLabel}`}
                  orgId={clientId}
                  clientId={!_.isEmpty(dropdownClientId) ? dropdownClientId : clientId}
                  vendorId={orgId}
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
            <ClientTagList
              orgName={orgName}
              vendorName={orgName}
              searchKey={searchKey}
              tagHeading={tagHeading}
              tagLabel={tagLabel}
              categoryLabel={categoryLabel}
              clientName={clientName}
              orgOptionId={dropdownClientId}
              selectedFilters={selectedFilters}
              selectedFiltersId={selectedFiltersId}
            />
          </div>
        </div>
      );
    }
}

const mapStateToProps = (state) => ({
  getOrgName: state.vendorMgmt.clientTags.getOrgName,
  getOrgNameState: state.vendorMgmt.clientTags.getOrgNameState,
  clientData: state.vendorMgmt.clientTags.getClientData,
  clientDataState: state.vendorMgmt.clientTags.getClientDataState,

  clientTagsCount: state.vendorMgmt.clientTags.getClientTagsCount,
  clientTagsCountState: state.vendorMgmt.clientTags.getClientTagsCountState,
  clientTags: state.vendorMgmt.clientTags.clientTags,
  clientTagsState: state.vendorMgmt.clientTags.clientTagsState,

  selectedFilterTagCountState: state.vendorMgmt.clientTags.selectedFilterTagCountState,
  selectedFilterTagCount: state.vendorMgmt.clientTags.selectedFilterTagCount,
  error: state.vendorMgmt.clientTags.error,

  // clientsClientList: state.vendorMgmt.vendorTags.clientList,
  // clientsClientListState: state.vendorMgmt.vendorTags.clientListState,
  clientsClientList: state.vendorMgmt.vendorProfile.assignedClients,
  clientsClientListState: state.vendorMgmt.vendorProfile.assignedClientsState,
  selectedClient: state.vendorMgmt.vendorTags.getSelectedClient,
  selectedClientState: state.vendorMgmt.vendorTags.getSelectedClientState,
});

const mapDispatchToProps = (dispatch) => ({
  onGetInitState: () => dispatch(actions.initState()),
  onGetOrgName: (orgId) => dispatch(actions.getOrgNameById(orgId)),
  onGetClientData: (orgId, clientId) => dispatch(actions.getClientData(orgId, clientId)),
  onGetClientTagsCount: (
    orgId, clientId, category, pageSize, targetUrl, dropdownClientId,
  ) => dispatch(actions.getClientTagsCount(orgId, clientId, category, pageSize,
    targetUrl, dropdownClientId)),
  onGetClientTagsList: (orgId, clientId, category, pageSize, targetUrl,
    dropdownClientId) => dispatch(
    actions.getClientTags(orgId, clientId, category, pageSize, targetUrl, dropdownClientId),
  ),
  onGetSelectedFiltersCount: (orgId, clientId, tagLabel, pageSize, targetUrl, payload) => dispatch(
    actions.getSelectedFiltersCount(orgId, clientId, tagLabel, pageSize, targetUrl, payload),
  ),
  onGetSelectedFilters: (
    orgId, clientId, tagLabel, pageSize, targetUrl, dropdownClientId, selectedFiltersId,
  ) => dispatch(
    actions.getSelectedFilters(orgId, clientId, tagLabel, pageSize, targetUrl,
      dropdownClientId, selectedFiltersId),
  ),
  onGetSelectedClient: (orgId) => dispatch(vendorTagsAction.getSelectedClientName(orgId)),
  // onGetClientsClientList: (orgId, orgDetails) => dispatch(
  //   vendorTagsAction.getClientList(orgId, orgDetails),
  // ),
  onGetClientsClientList: (orgId, vendorId, clientData) => dispatch(
    vendorProfileActions.getAssignedClients(orgId, vendorId, clientData),
  ),
});

export default withTranslation()(withRouter(connect(
  mapStateToProps, mapDispatchToProps,
)(ClientTags)));
