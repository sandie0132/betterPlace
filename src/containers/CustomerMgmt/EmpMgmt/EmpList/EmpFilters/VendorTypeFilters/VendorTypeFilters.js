/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import _ from 'lodash';
import cx from 'classnames';
import { Tooltip } from 'react-crux';
import styles from './VendorTypeFilters.module.scss';
import scrollStyle from '../../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
// icons
import arrowDown from '../../../../../../assets/icons/form.svg';
import arrowUp from '../../../../../../assets/icons/formChecked.svg';
import greyTag from '../../../../../../assets/icons/greyTag.svg';
import blueTag from '../../../../../../assets/icons/blueTag.svg';
import arrow from '../../../../../../assets/icons/arrowLeft.svg';
import locTag from '../../../../../../assets/icons/locationTags.svg';
import funcTag from '../../../../../../assets/icons/functionTags.svg';

import * as actions from './Store/action';
import * as empListActions from '../../Store/action';
import Checkbox from '../../../../../../components/Atom/CheckBox/CheckBox';
import TagSharingFilters from './TagSharingFilters';
import VendorStaticSearchSmall from '../../../../../VendorSearch/VendorStaticSearchSmall/VendorStaticSearchSmall';

class VendorTypeFilters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openVendorFilter: false,
      searchVendor: '',
      vendorCount: 0,
      selectedVendor: {},
      vendorRadioType: 'both',
      selectedSubvendorList: [],
      subVendorList: [],

      openClientFilter: false,
      searchClient: '',
      clientCount: 0,
      selectedClient: {},
      clientRadioType: 'both',
      selectedSuperClientList: [],
      superClientList: [],
      filterPayload: {
        client: {},
        superClient: [],
        vendor: {},
        subVendor: [],
        deployedTo: '',
        deployedFrom: '',
      },
      // searchViewAllOrgs: '',
      viewAllOrgs: false,
      openSearchTagsTab: false,
      type: '',
      selectedTagOrg: {},
    };
  }

  componentDidMount = () => {
    // assigning parent props to state
    const { vendorFilters } = this.props;
    const filters = _.cloneDeep(vendorFilters);
    if (!_.isEmpty(filters)) {
      const {
        openVendorFilter, searchVendor, vendorCount, selectedVendor, vendorRadioType,
        selectedSubvendorList, subVendorList,
        openClientFilter, searchClient, clientCount, selectedClient, clientRadioType,
        selectedSuperClientList, superClientList,
        viewAllOrgs, openSearchTagsTab, type, selectedTagOrg,
      } = filters;
      const { filterPayload } = _.cloneDeep(filters);
      this.setState({
        openVendorFilter,
        searchVendor,
        vendorCount,
        selectedVendor,
        vendorRadioType,
        selectedSubvendorList,
        subVendorList,
        openClientFilter,
        searchClient,
        clientCount,
        selectedClient,
        clientRadioType,
        selectedSuperClientList,
        superClientList,
        viewAllOrgs,
        openSearchTagsTab,
        type,
        selectedTagOrg,
        filterPayload,
      });
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    const {
      getSubVendorList, getSubVendorListState, getSuperClientList, getSuperClientListState,
      selectedTags, selectedTagsToParent, onUpdatePayload,
    } = this.props;
    const {
      vendorCount, clientCount, filterPayload, subVendorList, superClientList,
    } = this.state;

    if (prevProps.getSubVendorListState !== getSubVendorListState && getSubVendorListState === 'SUCCESS') {
      this.handlePropsToState('vendor', getSubVendorList);
    }
    if (prevProps.getSuperClientListState !== getSuperClientListState && getSuperClientListState === 'SUCCESS') {
      this.handlePropsToState('client', getSuperClientList);
    }
    // passing count to EmpFilters
    if (prevState.clientCount !== clientCount || prevState.vendorCount !== vendorCount) {
      selectedTags(clientCount + vendorCount);
    }
    // emp list api call on payload change
    if (prevState.filterPayload !== filterPayload) {
      onUpdatePayload(filterPayload);
      selectedTagsToParent(this.state); // passing state values to empFilters (parent)
    }

    // subVendors / superclients list to be passed to parent
    if (prevState.subVendorList !== subVendorList
      || prevState.superClientList !== superClientList) {
      selectedTagsToParent(this.state); // passing state values to empFilters (parent)
    }
  }

  handlePropsToState = (type, propsArray) => {
    const updatedVendorList = [];
    const updatedClientList = [];
    if (!_.isEmpty(propsArray)) {
      _.forEach(propsArray, (elem) => {
        if (type === 'vendor') {
          const data = {
            ...elem,
            allTagsSelected: true,
            sharedRoles: [],
            sharedRolesId: [],
            sharedSites: [],
            sharedSitesId: [],
            type,
          };
          updatedVendorList.push(data);
        } else {
          const data = {
            ...elem,
            allTagsSelected: true,
            sharedRoles: [],
            sharedRolesId: [],
            sharedSites: [],
            sharedSitesId: [],
            type,
          };
          updatedClientList.push(data);
        }
      });
    }
    this.setState({ subVendorList: updatedVendorList, superClientList: updatedClientList });
  }

  handleRadioButton = (value, inputIdentifier) => {
    const {
      match, onGetSubVendor, getSubVendorListState, getSuperClientListState,
    } = this.props;
    const {
      vendorRadioType, clientRadioType, selectedClient, selectedVendor, filterPayload,
    } = this.state;
    const updatedFilterPayload = _.cloneDeep(filterPayload);
    if (inputIdentifier === 'vendor') {
      updatedFilterPayload.deployedFrom = value;
      this.setState({ vendorRadioType: value, filterPayload: updatedFilterPayload });
    } else {
      updatedFilterPayload.deployedTo = value;
      this.setState({ clientRadioType: value, filterPayload: updatedFilterPayload });
    }
    if ((inputIdentifier === 'vendor' && vendorRadioType !== 'vendor' && getSubVendorListState !== 'SUCCESS')
      || (inputIdentifier === 'client' && clientRadioType !== 'client' && getSuperClientListState !== 'SUCCESS')) {
      onGetSubVendor(match.params.uuid, inputIdentifier === 'vendor' ? selectedVendor._id : selectedClient._id, inputIdentifier);
    }
  }

  handleShowTags = (type, item) => {
    const { openSearchTagsTab } = this.state;
    this.setState({
      openSearchTagsTab: !openSearchTagsTab,
      type,
      selectedTagOrg: item,
    });
  }

  handleTagData = (type, tagFilterData, boolValue) => {
    const { subVendorList, superClientList, filterPayload } = this.state;
    let {
      selectedSubvendorList, selectedSuperClientList, selectedVendor, selectedClient,
    } = this.state;

    const vendorList = _.cloneDeep(subVendorList);
    const clientList = _.cloneDeep(superClientList);
    const updatedFilterPayload = _.cloneDeep(filterPayload);
    if (!_.isEmpty(tagFilterData) && boolValue) {
      if (tagFilterData.type === 'vendor') {
        // searched org has shared tags
        if (tagFilterData._id === selectedVendor._id) {
          selectedVendor = tagFilterData;
          updatedFilterPayload.vendor.tags = [];
          if (!_.isEmpty(tagFilterData.sharedSitesId)) {
            updatedFilterPayload.vendor.tags = updatedFilterPayload.vendor.tags.concat(
              tagFilterData.sharedSitesId,
            );
          }
          if (!_.isEmpty(tagFilterData.sharedRolesId)) {
            updatedFilterPayload.vendor.tags = updatedFilterPayload.vendor.tags.concat(
              tagFilterData.sharedRolesId,
            );
          }
        } else {
          vendorList.forEach((eachVendor) => {
            if (eachVendor._id === tagFilterData._id) {
              eachVendor.sharedRoles = tagFilterData.sharedRoles;
              eachVendor.sharedRolesId = tagFilterData.sharedRolesId;
              eachVendor.sharedSites = tagFilterData.sharedSites;
              eachVendor.sharedSitesId = tagFilterData.sharedSitesId;
              eachVendor.allTagsSelected = tagFilterData.allTagsSelected;
              eachVendor.type = tagFilterData.type;
              // if no tags are selected, remove from selectedorgs
              if (!tagFilterData.allTagsSelected && _.isEmpty(tagFilterData.sharedRolesId)
                && _.isEmpty(tagFilterData.sharedSitesId)) {
                selectedSubvendorList = selectedSubvendorList.filter(
                  (elem) => elem !== tagFilterData._id,
                );
                updatedFilterPayload.subVendor = updatedFilterPayload.subVendor.filter(
                  (eachItem) => eachItem.orgId !== eachVendor._id,
                );
              }
            }
            updatedFilterPayload.subVendor.forEach((eachSubClient) => {
              if (tagFilterData._id === eachSubClient.orgId) {
                eachSubClient.tags = [];
                if (!_.isEmpty(tagFilterData.sharedSitesId)) {
                  eachSubClient.tags = eachSubClient.tags.concat(tagFilterData.sharedSitesId);
                }
                if (!_.isEmpty(tagFilterData.sharedRolesId)) {
                  eachSubClient.tags = eachSubClient.tags.concat(tagFilterData.sharedRolesId);
                }
              }
            });
          });
        }
      } else if (tagFilterData.type === 'client') {
        if (tagFilterData._id === selectedClient._id
          || tagFilterData._id === updatedFilterPayload.client.orgId) {
          selectedClient = tagFilterData;
          updatedFilterPayload.client.tags = [];
          if (!_.isEmpty(tagFilterData.sharedSitesId)) {
            updatedFilterPayload.client.tags = updatedFilterPayload.client.tags.concat(
              tagFilterData.sharedSitesId,
            );
          }
          if (!_.isEmpty(tagFilterData.sharedRolesId)) {
            updatedFilterPayload.client.tags = updatedFilterPayload.client.tags.concat(
              tagFilterData.sharedRolesId,
            );
          }
        } else {
          clientList.forEach((eachClient) => {
            if (eachClient._id === tagFilterData._id) {
              eachClient.sharedRoles = tagFilterData.sharedRoles;
              eachClient.sharedRolesId = tagFilterData.sharedRolesId;
              eachClient.sharedSites = tagFilterData.sharedSites;
              eachClient.sharedSitesId = tagFilterData.sharedSitesId;
              eachClient.allTagsSelected = tagFilterData.allTagsSelected;
              eachClient.type = tagFilterData.type;
              // if no tags are selected, remove from selectedorgs
              if (!eachClient.allTagsSelected && _.isEmpty(eachClient.sharedRolesId)
                && _.isEmpty(eachClient.sharedSitesId)) {
                selectedSuperClientList = selectedSuperClientList.filter(
                  (elem) => elem !== eachClient._id,
                );
                updatedFilterPayload.superClient = updatedFilterPayload.superClient.filter(
                  (eachItem) => eachItem.orgId !== eachClient._id,
                );
              }
            }
            updatedFilterPayload.superClient.forEach((eachSupClient) => {
              if (tagFilterData._id === eachSupClient.orgId) {
                eachSupClient.tags = [];
                if (!_.isEmpty(tagFilterData.sharedSitesId)) {
                  eachSupClient.tags = eachSupClient.tags.concat(tagFilterData.sharedSitesId);
                }
                if (!_.isEmpty(tagFilterData.sharedRolesId)) {
                  eachSupClient.tags = eachSupClient.tags.concat(tagFilterData.sharedRolesId);
                }
              }
            });
          });
        }
      }
      this.setState({
        type,
        subVendorList: vendorList,
        superClientList: clientList,
        selectedSubvendorList,
        selectedSuperClientList,
        selectedVendor,
        selectedClient,
        filterPayload: updatedFilterPayload,
      });
    }
    this.setState({
      openSearchTagsTab: boolValue,
      // type,
      // subVendorList: vendorList,
      // superClientList: clientList,
      // selectedSubvendorList,
      // selectedSuperClientList,
      // selectedVendor,
      // selectedClient,
      // filterPayload: updatedFilterPayload,
    });
  }

  toggleViewAll = (type) => {
    const { viewAllOrgs } = this.state;
    this.setState({ viewAllOrgs: !viewAllOrgs, openSearchTagsTab: false, type });
  }

  toggleSelectAll = (type, propsList) => {
    const { selectedSubvendorList, selectedSuperClientList, filterPayload } = this.state;
    let updatedVendorList = _.cloneDeep(selectedSubvendorList);
    let updatedClientList = _.cloneDeep(selectedSuperClientList);
    const updatedFilterPayload = _.cloneDeep(filterPayload);
    if (type === 'vendor') {
      if (updatedVendorList.length === propsList.length) {
        updatedVendorList = []; // empty if all selected
        updatedFilterPayload.subVendor = [];
      } else {
        const arr = [];
        propsList.forEach((eachItem) => { // if some vendor orgs are selected, then let them be
          if (!updatedVendorList.includes(eachItem._id)) {
            updatedVendorList.push(eachItem._id);
            const obj = {};
            obj.orgId = eachItem._id;
            arr.push(obj);
          }
        });
        updatedFilterPayload.subVendor = updatedFilterPayload.subVendor.concat(arr);
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (updatedClientList.length === propsList.length) {
        updatedClientList = []; // empty if all selected
        updatedFilterPayload.superClient = [];
      } else {
        const arr = [];
        propsList.forEach((eachItem) => { // if some client orgs are selected, then let them be
          if (!updatedClientList.includes(eachItem._id)) {
            updatedClientList.push(eachItem._id);
            const obj = {};
            obj.orgId = eachItem._id;
            arr.push(obj);
          }
        });
        updatedFilterPayload.superClient = updatedFilterPayload.superClient.concat(arr);
      }
    }
    this.setState({
      selectedSubvendorList: updatedVendorList,
      selectedSuperClientList: updatedClientList,
      filterPayload: updatedFilterPayload,
    });
  }

  handleCheckbox = (type, orgId) => {
    const { selectedSubvendorList, selectedSuperClientList, filterPayload } = this.state;
    let updatedVendorList = _.cloneDeep(selectedSubvendorList);
    let updatedClientList = _.cloneDeep(selectedSuperClientList);
    const updatedFilterPayload = _.cloneDeep(filterPayload);

    if (type === 'vendor') {
      if (updatedVendorList.includes(orgId)) {
        updatedVendorList = updatedVendorList.filter((eachItem) => eachItem !== orgId);
        updatedFilterPayload.subVendor = updatedFilterPayload.subVendor.filter(
          (eachItem) => eachItem.orgId !== orgId,
        );
      } else {
        updatedVendorList.push(orgId);
        const obj = {};
        obj.orgId = orgId;
        updatedFilterPayload.subVendor.push(obj);
      }
    } else if (updatedClientList.includes(orgId)) {
      updatedClientList = updatedClientList.filter((eachItem) => eachItem !== orgId);
      updatedFilterPayload.superClient = updatedFilterPayload.superClient.filter(
        (eachItem) => eachItem.orgId !== orgId,
      );
    } else {
      updatedClientList.push(orgId);
      const obj = {};
      obj.orgId = orgId;
      updatedFilterPayload.superClient.push(obj);
    }
    this.setState({
      selectedSubvendorList: updatedVendorList,
      selectedSuperClientList: updatedClientList,
      filterPayload: updatedFilterPayload,
    });
  }

  handleReset = (type) => {
    const { filterPayload } = this.state;
    const updatedFilterPayload = _.cloneDeep(filterPayload);
    if (type === 'vendor') {
      updatedFilterPayload.vendor = {};
      updatedFilterPayload.subVendor = [];
      updatedFilterPayload.deployedFrom = '';
      this.setState({
        searchVendor: '',
        vendorCount: 0,
        selectedVendor: {},
        vendorRadioType: 'both',
        selectedSubvendorList: [],
        subVendorList: [],
        filterPayload: updatedFilterPayload,
      });
    } else {
      updatedFilterPayload.client = {};
      updatedFilterPayload.superClient = [];
      updatedFilterPayload.deployedTo = '';
      this.setState({
        searchClient: '',
        clientCount: 0,
        selectedClient: {},
        clientRadioType: 'both',
        selectedSuperClientList: [],
        superClientList: [],
        filterPayload: updatedFilterPayload,
      });
    }
  }

  handleToolTipText = (type, item) => {
    const tooltipContent = (
      <div>
        <div className="row no-gutters">
          <span className={cx('mb-2', styles.SelectAll)}>selected tags</span>
        </div>
        {!_.isEmpty(item.sharedSites)
          ? (
            <>
              <div className="row no-gutters">
                <span className={cx('mb-1', styles.GreyLightText)} style={{ fontSize: '12px' }}>locations</span>
              </div>
              <div className="d-flex flex-column">
                {item.sharedSites.map((eachLoc) => (
                  <div className="row no-gutters mb-2" key={eachLoc.uuid}>
                    <img src={locTag} alt="" height="12px" />
&nbsp;
                    <span className={styles.BlackText}>{eachLoc.name}</span>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        {!_.isEmpty(item.sharedRoles)
          ? (
            <>
              <div className="row no-gutters">
                <span className={cx('mb-1', styles.GreyLightText)} style={{ fontSize: '12px' }}>roles</span>
              </div>
              <div className="d-flex flex-column">
                {item.sharedRoles.map((eachRole) => (
                  <div className="row no-gutters mb-2" key={eachRole.uuid}>
                    <img src={funcTag} alt="" height="12px" />
&nbsp;
                    <span className={styles.BlackText}>{eachRole.name}</span>
                  </div>
                ))}
              </div>
            </>
          ) : null}
      </div>
    );
    return tooltipContent;
  }

  // handleViewAllSearch = (e, inputIdentifier) => {
  //   const { getSubVendorList, getSuperClientList } = this.props;
  //   // const { subVendorList, superClientList } = this.state;
  //   // updated state values with shared sites and roles if any
  //   // const oldVendorList = _.cloneDeep(subVendorList);
  //   // const oldClientList = _.cloneDeep(superClientList);
  //   let vendorList = [];
  //   let clientList = [];
  //   let key = e.target.value;
  //   if (key.length) {
  //     key = key.toLowerCase();
  //     if (inputIdentifier === 'vendor') {
  //       _.forEach(getSubVendorList, (eachVendor) => {
  //         if ((eachVendor.name.toLowerCase()).includes(key)) {
  //           vendorList.push(eachVendor);
  //         }
  //       });
  //     } else {
  //       _.forEach(getSuperClientList, (eachClient) => {
  //         if ((eachClient.name.toLowerCase()).includes(key)) {
  //           clientList.push(eachClient);
  //         }
  //       });
  //     }
  //   } else if (inputIdentifier === 'vendor') {
  //     vendorList = this.handlePropsToState(inputIdentifier, getSubVendorList);
  //   } else {
  //     clientList = this.handlePropsToState(inputIdentifier, getSuperClientList);
  //   }
  //   this.setState({
  //     // searchViewAllOrgs: key,
  //     superClientList: clientList,
  //     subVendorList: vendorList,
  //   });
  // }

  handleViewAllClearSearch = (type) => {
    const { getSubVendorList, getSuperClientList } = this.props;
    if (type === 'vendor') this.setState({ subVendorList: getSubVendorList });
    else this.setState({ superClientList: getSuperClientList });
    // this.setState({ searchViewAllOrgs: '' });
  }

  handleSharedTagsCount = (item) => {
    const tagCount = !_.isEmpty(item.sharedRolesId) && !_.isEmpty(item.sharedSitesId)
      ? `${item.sharedRolesId.length + item.sharedSitesId.length} tags selected`
      : !_.isEmpty(item.sharedRolesId) && _.isEmpty(item.sharedSitesId)
        ? `${item.sharedRolesId.length} tags selected`
        : _.isEmpty(item.sharedRolesId) && !_.isEmpty(item.sharedSitesId)
          ? `${item.sharedSitesId.length} tags selected`
          : null;
    return tagCount;
  }

  handleSelectedValue = (data, type) => {
    const { match, onGetSubVendor } = this.props;
    let {
      selectedClient, selectedVendor, searchClient, searchVendor, clientCount, vendorCount,
    } = this.state;
    const { filterPayload, clientRadioType, vendorRadioType } = this.state;
    const updatedFilterPayload = _.cloneDeep(filterPayload);
    if (type === 'client') {
      selectedClient = data;
      selectedClient.allTagsSelected = true;
      selectedClient.sharedRoles = [];
      selectedClient.sharedRolesId = [];
      selectedClient.sharedSites = [];
      selectedClient.sharedSitesId = [];
      selectedClient.type = type;
      searchClient = data.name;
      clientCount = 1;

      updatedFilterPayload.deployedTo = clientRadioType;
      updatedFilterPayload.client.orgId = data._id;
    } else {
      selectedVendor = data;
      selectedVendor.allTagsSelected = true;
      selectedVendor.sharedRoles = [];
      selectedVendor.sharedRolesId = [];
      selectedVendor.sharedSites = [];
      selectedVendor.sharedSitesId = [];
      selectedVendor.type = type;
      searchVendor = data.name;
      vendorCount = 1;
      updatedFilterPayload.vendor.orgId = data._id;
      updatedFilterPayload.deployedFrom = vendorRadioType;
    }
    this.setState({
      selectedClient,
      selectedVendor,
      searchClient,
      searchVendor,
      clientCount,
      vendorCount,
      filterPayload: updatedFilterPayload,
    });
    onGetSubVendor(match.params.uuid, type === 'vendor' ? selectedVendor._id : selectedClient._id, type);
  }

  render() {
    const {
      t, match, getSubVendorList, getSubVendorListState,
      getSuperClientListState, getSuperClientList,
    } = this.props;

    const {
      openSearchTagsTab, viewAllOrgs, type, selectedTagOrg, // searchViewAllOrgs,
      openVendorFilter, searchVendor, selectedVendor, vendorRadioType,
      vendorCount, selectedSubvendorList, subVendorList,
      openClientFilter, searchClient, selectedClient, clientRadioType,
      clientCount, selectedSuperClientList, superClientList,
    } = this.state;
    return (
      <div className={cx(styles.Container, scrollStyle.scrollbar)}>
        {!openSearchTagsTab && !viewAllOrgs
          ? (
            <div className={cx(styles.Heading)}>
              <div className="pb-1 pr-3 mt-3 d-flex flex-row justify-content-between">
                <label className={cx('col-7 pl-3', styles.FilterHeadings)} htmlFor="arrow">
                  <img
                    src={openVendorFilter ? arrowUp : arrowDown}
                    alt=""
                    onClick={() => this.setState({ openVendorFilter: !openVendorFilter })}
                    className={cx('mr-2', styles.ArrowIcon)}
                    aria-hidden
                    id="arrow"
                  />
                  {t('translation_empList:empFilters.vendorTypeFilters.vendors')}
                </label>
                <label className="mb-0" htmlFor="count">
                  <span id="count" className={vendorCount > 0 ? styles.ActiveNum : styles.InactiveNum}>{`0${vendorCount}`}</span>
                  &nbsp;
                  <span role="button" aria-hidden className={cx(styles.Cursor, styles.GreyLightText)} onClick={() => this.handleReset('vendor')}>{t('translation_empList:empFilters.vendorTypeFilters.reset')}</span>
                </label>
              </div>
              {openVendorFilter
                ? (
                  <div className="mx-3">
                    <div className="position-relative">
                      <VendorStaticSearchSmall
                        type="vendor"
                        handleSelectedValue={this.handleSelectedValue}
                        getAssociatedOrgs
                        searchKey={searchVendor}
                        selectedOrgName={!_.isEmpty(selectedVendor) ? selectedVendor.name : ''}
                        handleClearInput={this.handleReset}
                      />
                    </div>
                    {!_.isEmpty(selectedVendor)
                      ? (
                        _.isEmpty(selectedVendor.sharedRoles)
                          && _.isEmpty(selectedVendor.sharedSites)
                          ? (
                            <span
                              className={cx('mt-1 d-flex justify-content-end', styles.Cursor, styles.BlueText)}
                              onClick={() => this.handleShowTags('vendor', selectedVendor)}
                              role="button"
                              aria-hidden
                            >
                              select tags for
                              {' '}
                              {searchVendor}
                              &nbsp;
                              <img src={blueTag} alt="" />
                            </span>
                          )
                          : (
                            <div data-for={selectedVendor._id} data-tip={selectedVendor._id}>
                              <div className={cx('row no-gutters justify-content-end mt-1', styles.Cursor, styles.BlueText)}>
                                <u>
                                  {this.handleSharedTagsCount(selectedVendor)}
                                </u>
                                &nbsp;
                                <img
                                  className={styles.Cursor}
                                  src={blueTag}
                                  alt=""
                                  align="right"
                                  onClick={() => this.handleShowTags('vendor', selectedVendor)}
                                  aria-hidden
                                />
                              </div>
                              <Tooltip
                                id={selectedVendor._id}
                                arrowColor="transparent"
                                place="top"
                                type="custom"
                                tooltipClass={styles.tooltipClass}
                              >
                                {this.handleToolTipText('vendor', selectedVendor)}
                              </Tooltip>
                            </div>
                          )
                      ) : null}

                    <div className="mt-3" disabled={_.isEmpty(selectedVendor)}>
                      <label className={cx('mb-0', styles.GreyMediumText)} htmlFor="vendorDeploy">{t('translation_empList:empFilters.vendorTypeFilters.viewDeployed')}</label>
                      <br />
                      <div className="row no-gutters">
                        <input
                          type="radio"
                          className={styles.RadioButton}
                          name="VENDOR"
                          value={vendorRadioType}
                          onChange={() => this.handleRadioButton('vendor', 'vendor')}
                          checked={vendorRadioType === 'vendor'}
                        />
                        <span className={cx('mb-0', styles.GreyMediumText)}>{t('translation_empList:empFilters.vendorTypeFilters.onlyVendor')}</span>
                  &emsp;
                        <input
                          type="radio"
                          className={styles.RadioButton}
                          name="SUBVENDOR"
                          value={vendorRadioType}
                          onChange={() => this.handleRadioButton('subVendor', 'vendor')}
                          checked={vendorRadioType === 'subVendor'}
                        />
                        <span className={cx('mb-0', styles.GreyMediumText)}>{t('translation_empList:empFilters.vendorTypeFilters.onlySubVendor')}</span>
                  &emsp;
                        <input
                          type="radio"
                          className={styles.RadioButton}
                          name="both"
                          value={vendorRadioType}
                          onChange={() => this.handleRadioButton('both', 'vendor')}
                          checked={vendorRadioType === 'both'}
                        />
                        <span className={cx('mb-0', styles.GreyMediumText)}>{t('translation_empList:empFilters.vendorTypeFilters.both')}</span>
                      </div>
                    </div>
                    <hr />
                    <div disabled={_.isEmpty(selectedVendor)}>
                      {getSubVendorListState === 'SUCCESS' && !_.isEmpty(subVendorList) && vendorRadioType !== 'vendor'
                        ? (
                          <div className="d-flex flex-row justify-content-between mb-2">
                            <span>
                              <label className={cx(styles.GreyMediumText, 'mb-0')} htmlFor="subvendor">{t('translation_empList:empFilters.vendorTypeFilters.selectSubVendor')}</label>
                              <span className={styles.GreyLightText} style={{ fontSize: '12px' }}>
                                {` ( ${selectedSubvendorList.length}/${subVendorList.length} )`}
                              </span>
                            </span>
                            {subVendorList.length > 20
                              ? <label aria-hidden className={cx(styles.BlueText, styles.Cursor, 'my-auto')} onClick={() => this.toggleViewAll('vendor')} htmlFor="viewAll">view all</label>
                              : null}
                          </div>
                        )
                        : (
                          <>
                            <label className={cx('mb-2', styles.GreyMediumText)} htmlFor="subvendor">{t('translation_empList:empFilters.vendorTypeFilters.selectSubVendor')}</label>
                            <br />
                          </>
                        )}
                      {getSubVendorListState === 'SUCCESS' && !_.isEmpty(subVendorList) && vendorRadioType !== 'vendor'
                        ? (
                          <div>
                            <div className="row no-gutters mb-2">
                              <Checkbox
                                type="medium"
                                value={selectedSubvendorList.length === subVendorList.length}
                                onChange={() => this.toggleSelectAll('vendor', subVendorList)}
                                disabled={false}
                                className={styles.PositionRelative}
                              />
                              {' '}
                              <span className={cx(styles.GreyBoldText, 'ml-4')}>select all</span>
                            </div>
                            {subVendorList.map((item, i) => (
                              i < 20
                                ? (
                                  <div className="row no-gutters mb-1" key={item._id}>
                                    <Checkbox
                                      type="medium"
                                      value={selectedSubvendorList.includes(item._id)}
                                      onChange={() => this.handleCheckbox('vendor', item._id)}
                                      disabled={false}
                                      className={styles.PositionRelative}
                                    />
                                    <div className={cx(styles.GreyLightText, 'ml-4')} style={{ fontSize: '12px' }}>{item.name}</div>
                                    <div className="d-flex flex-row ml-auto">
                                      {selectedSubvendorList.includes(item._id)
                                        ? item.allTagsSelected ? null
                                          : (
                                            <div data-for={item._id} data-tip={item._id}>
                                              <div className={cx(styles.Cursor, styles.BlueText)}>
                                                <u>
                                                  {this.handleSharedTagsCount(item)}
                                                </u>
                                              </div>
                                              <Tooltip
                                                id={item._id}
                                                arrowColor="transparent"
                                                place="top"
                                                type="custom"
                                                tooltipClass={styles.tooltipClass}
                                              >
                                                {this.handleToolTipText('vendor', item)}
                                              </Tooltip>
                                            </div>
                                          ) : null}
                                      &nbsp;
                                      <img
                                        className={styles.Cursor}
                                        style={{ marginBottom: '0.5rem' }}
                                        src={selectedSubvendorList.includes(item._id)
                                          ? blueTag : greyTag}
                                        alt=""
                                        align="right"
                                        onClick={selectedSubvendorList.includes(item._id)
                                          ? () => this.handleShowTags('vendor', item) : null}
                                        aria-hidden
                                      />
                                    </div>
                                  </div>
                                ) : null
                            ))}
                          </div>
                        )
                        : getSubVendorListState === 'SUCCESS' && _.isEmpty(subVendorList) && vendorRadioType !== 'vendor'
                          ? <span className={cx('mb-0', styles.GreyMediumText)}><i>{t('translation_empList:empFilters.vendorTypeFilters.noVendors')}</i></span>
                          : <span className={cx('mb-0', styles.GreyMediumText)}><i>{t('translation_empList:empFilters.vendorTypeFilters.emptySubVendor')}</i></span>}
                    </div>
                  </div>
                )
                : null}
              <hr />
              <div className="pb-1 pr-3 mt-3 d-flex flex-row justify-content-between">
                <label className={cx('col-7 pl-3', styles.FilterHeadings)} htmlFor="arrow">
                  <img
                    src={openClientFilter ? arrowUp : arrowDown}
                    alt=""
                    onClick={() => this.setState({ openClientFilter: !openClientFilter })}
                    className={cx('mr-2', styles.ArrowIcon)}
                    aria-hidden
                    id="arrow"
                  />
                  {t('translation_empList:empFilters.vendorTypeFilters.client')}
                </label>
                <label className="mb-0" htmlFor="count">
                  <span id="count" className={clientCount > 0 ? styles.ActiveNum : styles.InactiveNum}>{`0${clientCount}`}</span>
              &nbsp;
                  <span role="button" aria-hidden className={cx(styles.Cursor, styles.GreyLightText)} onClick={() => this.handleReset('client')}>{t('translation_empList:empFilters.vendorTypeFilters.reset')}</span>
                </label>
              </div>
              {openClientFilter
                ? (
                  <div className="mx-3">
                    <div className="position-relative">
                      <VendorStaticSearchSmall
                        type="client"
                        handleSelectedValue={this.handleSelectedValue}
                        getAssociatedOrgs
                        selectedOrgName={!_.isEmpty(selectedClient) ? selectedClient.name : ''}
                        searchKey={searchClient}
                        handleClearInput={this.handleReset}
                      />
                    </div>
                    {!_.isEmpty(selectedClient)
                      ? _.isEmpty(selectedClient.sharedRoles)
                        && _.isEmpty(selectedClient.sharedSites)
                        ? (
                          <span
                            className={cx('mt-1 d-flex justify-content-end', styles.Cursor, styles.BlueText)}
                            onClick={() => this.handleShowTags('client', selectedClient)}
                            role="button"
                            aria-hidden
                          >
                            select tags for
                            {' '}
                            {searchClient}
                      &nbsp;
                            <img src={blueTag} alt="" />
                          </span>
                        )
                        : (
                          <div data-for={selectedClient._id} data-tip={selectedClient._id}>
                            <div className={cx('row no-gutters justify-content-end mt-1', styles.Cursor, styles.BlueText)}>
                              <u>
                                {this.handleSharedTagsCount(selectedClient)}
                                &nbsp;
                                <img
                                  className={styles.Cursor}
                                  src={blueTag}
                                  alt=""
                                  align="right"
                                  onClick={() => this.handleShowTags('client', selectedClient)}
                                  aria-hidden
                                />
                              </u>
                            </div>
                            <Tooltip
                              id={selectedClient._id}
                              arrowColor="transparent"
                              place="top"
                              type="custom"
                              tooltipClass={styles.tooltipClass}
                            >
                              {this.handleToolTipText('client', selectedClient)}
                            </Tooltip>
                          </div>
                        )
                      : null}

                    <div className="mt-3" disabled={_.isEmpty(selectedClient)}>
                      <label className={cx('mb-0', styles.GreyMediumText)} htmlFor="vendorDeploy">{t('translation_empList:empFilters.vendorTypeFilters.viewDeployedTo')}</label>
                      <br />
                      <div className="row no-gutters">
                        <input
                          type="radio"
                          className={styles.RadioButton}
                          name="CLIENT"
                          value={clientRadioType}
                          onChange={() => this.handleRadioButton('client', 'client')}
                          checked={clientRadioType === 'client'}
                        />
                        <span className={cx('mb-0', styles.GreyMediumText)}>{t('translation_empList:empFilters.vendorTypeFilters.onlyClient')}</span>
                  &emsp;
                        <input
                          type="radio"
                          className={styles.RadioButton}
                          name="CLIENTSCLIENT"
                          value={clientRadioType}
                          onChange={() => this.handleRadioButton('superClient', 'client')}
                          checked={clientRadioType === 'superClient'}
                        />
                        <span className={cx('mb-0', styles.GreyMediumText)}>{t('translation_empList:empFilters.vendorTypeFilters.clientsOfClient')}</span>
                  &emsp;
                        <input
                          type="radio"
                          className={styles.RadioButton}
                          name="bothCLIENT"
                          value={clientRadioType}
                          onChange={() => this.handleRadioButton('both', 'client')}
                          checked={clientRadioType === 'both'}
                        />
                        <span className={cx('mb-0', styles.GreyMediumText)}>{t('translation_empList:empFilters.vendorTypeFilters.both')}</span>
                      </div>
                    </div>
                    <hr />
                    <div disabled={_.isEmpty(selectedClient)}>
                      {getSuperClientListState === 'SUCCESS' && !_.isEmpty(getSuperClientList) && clientRadioType !== 'client'
                        ? (
                          <div className="d-flex flex-row justify-content-between mb-2">
                            <span>
                              <label className={cx(styles.GreyMediumText, 'mb-0')} htmlFor="superclient">{t('translation_empList:empFilters.vendorTypeFilters.selectClientsClient')}</label>
                              <span className={styles.GreyLightText} style={{ fontSize: '12px' }}>
                                {` ( ${selectedSuperClientList.length}/${getSuperClientList.length} )`}
                              </span>
                            </span>
                            {getSuperClientList.length > 20
                              ? <label aria-hidden className={cx(styles.BlueText, styles.Cursor, 'my-auto')} onClick={() => this.toggleViewAll('client')} htmlFor="viewAll">view all</label>
                              : null}
                          </div>
                        )
                        : (
                          <>
                            <label className={cx('mb-2', styles.GreyMediumText)} htmlFor="superclient">{t('translation_empList:empFilters.vendorTypeFilters.selectClientsClient')}</label>
                            <br />
                          </>
                        )}
                      {getSuperClientListState === 'SUCCESS' && !_.isEmpty(getSuperClientList) && clientRadioType !== 'client'
                        ? (
                          <div>
                            <div className="row no-gutters mb-2">
                              <Checkbox
                                type="medium"
                                value={selectedSuperClientList.length
                                  === getSuperClientList.length}
                                onChange={() => this.toggleSelectAll('client', getSuperClientList)}
                                disabled={false}
                                className={styles.PositionRelative}
                              />
                              {' '}
                              <span className={cx(styles.GreyBoldText, 'ml-4')}>select all</span>
                            </div>
                            {superClientList.map((item, i) => (
                              i < 20
                                ? (
                                  <div className="row no-gutters mb-1" key={item._id}>
                                    <Checkbox
                                      type="medium"
                                      value={selectedSuperClientList.includes(item._id)}
                                      onChange={() => this.handleCheckbox('client', item._id)}
                                      disabled={false}
                                      className={styles.PositionRelative}
                                    />
                                    <div className={cx(styles.GreyLightText, 'ml-4')} style={{ fontSize: '12px' }}>{item.name}</div>
                                    <div className="d-flex flex-row ml-auto">
                                      {selectedSuperClientList.includes(item._id)
                                        ? item.allTagsSelected ? null
                                          : (
                                            <div data-for={item._id} data-tip={item._id}>
                                              <div className={cx(styles.Cursor, styles.BlueText)}>
                                                <u>
                                                  {this.handleSharedTagsCount(item)}
                                                </u>
                                              </div>
                                              <Tooltip
                                                id={item._id}
                                                arrowColor="transparent"
                                                place="top"
                                                type="custom"
                                                tooltipClass={styles.tooltipClass}
                                              >
                                                {this.handleToolTipText('client', item)}
                                              </Tooltip>
                                            </div>
                                          ) : null}
                                      &nbsp;
                                      <img
                                        className={styles.Cursor}
                                        style={{ marginBottom: '0.5rem' }}
                                        src={selectedSuperClientList.includes(item._id)
                                          ? blueTag : greyTag}
                                        alt=""
                                        align="right"
                                        onClick={selectedSuperClientList.includes(item._id)
                                          ? () => this.handleShowTags('client', item) : null}
                                        aria-hidden
                                      />
                                    </div>
                                  </div>
                                ) : null
                            ))}
                          </div>
                        )
                        : getSuperClientListState === 'SUCCESS' && _.isEmpty(getSuperClientList) && clientRadioType !== 'client'
                          ? <span className={cx('mb-0', styles.GreyMediumText)}><i>{t('translation_empList:empFilters.vendorTypeFilters.noClients')}</i></span>
                          : <span className={cx('mb-0', styles.GreyMediumText)}><i>{t('translation_empList:empFilters.vendorTypeFilters.emptyClient')}</i></span>}
                  &emsp;
                    </div>
                  </div>
                )
                : null}
            </div>
          )
          : openSearchTagsTab // to show tags search field
            ? (
              <TagSharingFilters
                type={type}
                orgId={match.params.uuid}
                // searched client/vendor
                selectedOrg={type === 'vendor' ? selectedVendor : selectedClient}
                selectedTagOrg={selectedTagOrg} // the org whose tag icon is clicked
                handleTagData={this.handleTagData}
              />
            )
            : !openSearchTagsTab && viewAllOrgs // on click of view all
              ? type === 'vendor' ? (
                <div className="m-3">
                  <div role="button" aria-hidden className={cx(styles.Cursor, 'row no-gutters')} onClick={() => this.toggleViewAll('vendor')}>
                    <img src={arrow} alt="" />
                    &emsp;
                    <span className={styles.GreyBoldText} style={{ fontSize: '14px' }}>
                      vendors of
                      {' '}
                      {searchVendor}
                    </span>
                  </div>
                  {/* <div className={cx('row no-gutters py-1 px-2', styles.SearchBar)}>
                    <img src={search} className={styles.SearchIcon} alt="" />
                    <input
                      className={cx('pl-2', styles.SearchQuery)}
                      value={searchViewAllOrgs}
                      onChange={(e) => this.handleViewAllSearch(e, 'vendor')}
                      onPaste={(e) => this.handleViewAllSearch(e, 'vendor')}
                      disabled={false}
                      placeholder={
                        t('translation_empList:empFilters.vendorTypeFilters.searchVendor')
                      }
                    />
                    {searchViewAllOrgs !== ''
                      ? (
                        <span className={cx('ml-auto', styles.Cursor)}
                        onClick={() => this.handleViewAllClearSearch('vendor')}>
                          <img src={clearSearch} alt="" />
                        </span>
                      ) : null}
                  </div> */}
                  <div className="row no-gutters my-2">
                    <Checkbox
                      type="medium"
                      value={selectedSubvendorList.length === getSubVendorList.length}
                      onChange={() => this.toggleSelectAll('vendor', getSubVendorList)}
                      disabled={false}
                      className={styles.PositionRelative}
                    />
                    {' '}
                    <span className={cx(styles.GreyBoldText, 'ml-4')}>select all</span>
                  </div>
                  {subVendorList.map((item) => (
                    <div className="row no-gutters mb-1" key={item._id}>
                      <Checkbox
                        type="medium"
                        value={selectedSubvendorList.includes(item._id)}
                        onChange={() => this.handleCheckbox('vendor', item._id)}
                        disabled={false}
                        className={styles.PositionRelative}
                      />
                      <div className={cx(styles.GreyLightText, 'ml-4')} style={{ fontSize: '12px' }}>{item.name}</div>
                      <div className="d-flex flex-row ml-auto">
                        {selectedSubvendorList.includes(item._id)
                          ? item.allTagsSelected ? null
                            : (
                              <div data-for={item._id} data-tip={item._id}>
                                <div className={cx(styles.Cursor, styles.BlueText)}>
                                  <u>
                                    {this.handleSharedTagsCount(item)}
                                  </u>
                                </div>
                                <Tooltip
                                  id={item._id}
                                  arrowColor="transparent"
                                  place="top"
                                  type="custom"
                                  tooltipClass={styles.tooltipClass}
                                >
                                  {this.handleToolTipText('vendor', item)}
                                </Tooltip>
                              </div>
                            ) : null}
                                      &nbsp;
                        <img
                          className={styles.Cursor}
                          style={{ marginBottom: '0.5rem' }}
                          src={selectedSubvendorList.includes(item._id) ? blueTag : greyTag}
                          alt=""
                          align="right"
                          aria-hidden
                          onClick={selectedSubvendorList.includes(item._id)
                            ? () => this.handleShowTags('vendor', item) : null}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="m-3">
                  <div role="button" aria-hidden className={cx(styles.Cursor, 'row no-gutters')} onClick={() => this.toggleViewAll('client')}>
                    <img src={arrow} alt="" />
                    &emsp;
                    <span className={styles.GreyBoldText} style={{ fontSize: '14px' }}>
                      clients of
                      {' '}
                      {searchClient}
                    </span>
                  </div>
                  {/* <div className={cx('row no-gutters py-1 px-2', styles.SearchBar)}>
                    <img src={search} className={styles.SearchIcon} alt="" />
                    <input
                      className={cx('pl-2', styles.SearchQuery)}
                      value={searchViewAllOrgs}
                      onChange={(e) => this.handleViewAllSearch(e, 'client')}
                      onPaste={(e) => this.handleViewAllSearch(e, 'client')}
                      disabled={false}
                      placeholder={
                        t('translation_empList:empFilters.vendorTypeFilters.searchVendor')
                      }
                    />
                    {searchViewAllOrgs !== ''
                      ? (
                        <span className={cx('ml-auto', styles.Cursor)}
                        onClick={() => this.handleViewAllClearSearch('client')}>
                          <img src={clearSearch} alt="" />
                        </span>
                      ) : null}
                  </div> */}
                  <div className="row no-gutters my-2">
                    <Checkbox
                      type="medium"
                      value={selectedSuperClientList.length === getSuperClientList.length}
                      onChange={() => this.toggleSelectAll('client', getSuperClientList)}
                      disabled={false}
                      className={styles.PositionRelative}
                    />
                    {' '}
                    <span className={cx(styles.GreyBoldText, 'ml-4')}>select all</span>
                  </div>
                  {superClientList.map((item) => (
                    <div className="row no-gutters mb-1" key={item._id}>
                      <Checkbox
                        type="medium"
                        value={selectedSuperClientList.includes(item._id)}
                        onChange={() => this.handleCheckbox('client', item._id)}
                        disabled={false}
                        className={styles.PositionRelative}
                      />
                      <div className={cx(styles.GreyLightText, 'ml-4')} style={{ fontSize: '12px' }}>{item.name}</div>
                      <div className="d-flex flex-row ml-auto">
                        {selectedSuperClientList.includes(item._id)
                          ? item.allTagsSelected ? null
                            : (
                              <div data-for={item._id} data-tip={item._id}>
                                <div className={cx(styles.Cursor, styles.BlueText)}>
                                  <u>
                                    {this.handleSharedTagsCount(item)}
                                  </u>
                                </div>
                                <Tooltip
                                  id={item._id}
                                  arrowColor="transparent"
                                  place="top"
                                  type="custom"
                                  tooltipClass={styles.tooltipClass}
                                >
                                  {this.handleToolTipText('client', item)}
                                </Tooltip>
                              </div>
                            ) : null}
                                      &nbsp;
                        <img
                          className={styles.Cursor}
                          style={{ marginBottom: '0.5rem' }}
                          src={selectedSuperClientList.includes(item._id) ? blueTag : greyTag}
                          alt=""
                          align="right"
                          aria-hidden
                          onClick={selectedSuperClientList.includes(item._id)
                            ? () => this.handleShowTags('client', item) : null}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )
              : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  searchedVendorListState: state.empMgmt.empVendorFilter.searchedVendorListState,
  searchedVendorList: state.empMgmt.empVendorFilter.searchedVendorList,
  searchedClientListState: state.empMgmt.empVendorFilter.searchedClientListState,
  searchedClientList: state.empMgmt.empVendorFilter.searchedClientList,
  getSubVendorListState: state.empMgmt.empVendorFilter.subVendorListState,
  getSubVendorList: state.empMgmt.empVendorFilter.subVendorList,
  getSuperClientListState: state.empMgmt.empVendorFilter.superClientListState,
  getSuperClientList: state.empMgmt.empVendorFilter.superClientList,
  error: state.empMgmt.empVendorFilter.error,
});

const mapDispatchToProps = (dispatch) => ({
  onGetInitState: () => dispatch(actions.getInitData),
  onSearchVendorAndClient: (orgId, searchKey, type) => dispatch(
    actions.searchVendorAndClient(orgId, searchKey, type),
  ),
  onGetSubVendor: (orgId, vendorId, category) => dispatch(
    actions.getSubVendor(orgId, vendorId, category),
  ),
  onUpdatePayload: (payload) => dispatch(empListActions.getFilterPayloadData(payload)),
});

export default withTranslation()(withRouter(
  connect(mapStateToProps, mapDispatchToProps)(VendorTypeFilters),
));
