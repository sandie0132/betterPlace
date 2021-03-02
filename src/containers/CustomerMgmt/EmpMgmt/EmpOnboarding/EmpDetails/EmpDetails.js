/* eslint-disable no-lonely-if */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import _ from 'lodash';
import cx from 'classnames';
import { Button } from 'react-crux';
import * as actions from './Store/action';
import * as actionTypes from './Store/actionTypes';
import * as actionTerminateTypes from '../../EmpTermination/Store/actionTypes';
import * as empOnboardActions from '../Store/action';

import CardHeader from '../../../../../components/Atom/PageTitle/PageTitle';
import ArrowLink from '../../../../../components/Atom/ArrowLink/ArrowLink';

import styles from './EmpDetails.module.scss';
import Loader from '../../../../../components/Organism/Loader/Loader';
import Spinnerload from '../../../../../components/Atom/Spinner/Spinner';
import CancelButton from '../../../../../components/Molecule/CancelButton/CancelButton';
import WarningPopUp from '../../../../../components/Molecule/WarningPopUp/WarningPopUp';
import warn from '../../../../../assets/icons/warning.svg';
import {
  InitData, employeeRequiredFields, tenantRequiredFields, businessRequiredFields,
  contractorRequiredFields, contractorFields,
} from './EmpDetailsInitData';
import CustomSelect from '../../../../../components/Atom/CustomSelect/CustomSelect';

import Prompt from '../../../../../components/Organism/Prompt/Prompt';
import TerminationCard from '../../EmpTermination/TerminationCard/TerminationCard';
import HasAccess from '../../../../../services/HasAccess/HasAccess';
import warning from '../../../../../assets/icons/warningMedium.svg';
import empDetailsIcon from '../../../../../assets/icons/empDetailsIcon.svg';
import EmpSearch from './EmpSearch/EmpSearch';
import scrollStyle from '../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import SpocCard from '../../../OrgMgmt/OrgBgvConfig/ClientSpoc/SpocCard/SpocCard';
import Notification from '../../../../../components/Molecule/Notification/Notification';

import { validation, message } from './EmpDetailsValidation';

import Employee from './Employee/Employee';
import Tenant from './Tenant/Tenant';
import Business from './Business/Business';
import Contractor from './Contractor/Contractor';

import Carousel from '../../Carousel/Carousel';
import DeployedInfoTile from '../../DeployedInfoTile/DeployedInfoTile';

class EmpDetails extends Component {
    _isMounted = false;

    vendorExists = false;

    constructor(props) {
      super(props);
      this.state = {
        formData: _.cloneDeep(InitData),
        empId: null,
        isActive: true,
        isEdited: false,
        enableSubmit: false,
        showCancelPopUp: false,
        terminatePopup: false,
        entityList: '',
        // terminationSuccess: false,
        // showSaveButton: false,
        reportsTo: [],
        orgId: null,
        errors: {},
        location: [],
        role: [],
        custom: [],
        defaultRole: null,
        defaultLocation: null,
        contractorDefaultRole: null,
        contractorDefaultLocation: null,
        contractorLocation: [],
        contractorRole: [],
        selectedTile: 0,
        clientId: null,
        superClientId: null,
        employeeTags: [], // employee original tags
      };
    }

    componentDidMount() {
      const entityList = [];
      this._isMounted = true;
      const {
        match, orgData, onGetOrgData, empData, onGetData,
      } = this.props;
      const { empId } = match.params;
      const orgId = match.params.uuid;

      entityList.push(empId);
      this.setState({ empId, entityList, orgId });

      if (_.isEmpty(empData)) {
        onGetData(orgId, empId);
      } else {
        this.handleDeploymentData();
        this.handlePropsToState();
        this.handleGetTagData(orgId, null);
      }
      if (_.isEmpty(orgData)) {
        onGetOrgData(orgId);
      }
    }

    handleDeploymentData = () => {
      const {
        match, orgData, empData, onGetDeploymentHistory, servicesEnabled,
      } = this.props;
      const { empId } = match.params;
      const orgId = match.params.uuid;

      if (!_.isEmpty(orgData) && !_.isEmpty(servicesEnabled)
      && !_.isEmpty(servicesEnabled.platformServices)) {
        const pServices = _.cloneDeep(servicesEnabled.platformServices);
        pServices.forEach((element) => {
          if (element.platformService === 'VENDOR') {
            this.vendorExists = true;
          }
        });
        const requiredEmpData = {
          orgId: orgData.uuid,
          defaultLocation: empData.defaultLocation,
          defaultRole: empData.defaultRole,
          employeeId: empData.employeeId,
          status: empData.status,
          joiningDate: empData.joiningDate,
          deployedTo: empData.deployedTo,
          terminationDate: !_.isEmpty(empData.terminationDate) ? empData.terminationDate : null,
          type: 'org',
          orgData: {
            name: orgData.name,
            brandColor: orgData.brandColor,
            uuid: orgData.uuid,
          },
        };
        if (this.vendorExists) {
          onGetDeploymentHistory(orgId, empId, requiredEmpData, 'client', 'ACTIVE');
        }
      }
    }

    componentDidUpdate = (prevProps, prevState) => {
      const {
        match, getDataState, terminationState, onGetData, putDataState, servicesEnabledState,
        reportsToDataState, reportsToData, onGetReportsToTagInfo, getTagInfoState, tagList,
        deploymentHistoryState, deploymentHistory, getContractorDataState, getContractorData,
        putContractorDataState,
      } = this.props;
      const { reportsTo, formData, selectedTile } = this.state;
      let { clientId, superClientId } = this.state;
      const orgId = match.params.uuid;

      if (!_.isEqual(getDataState, prevProps.getDataState) && getDataState === 'SUCCESS') {
        this.handlePropsToState();
        this.handleGetTagData(orgId, null);
        this.handleDeploymentData();
      }

      if (!_.isEqual(servicesEnabledState, prevProps.servicesEnabledState) && servicesEnabledState === 'SUCCESS') {
        this.handleDeploymentData();
      }

      /// /Show Notification for Success/Error for TERMINATE API call
      if (terminationState !== prevProps.terminationState && (terminationState === 'SUCCESS' || terminationState === 'ERROR')) {
        let isActive = true;
        if (terminationState === 'SUCCESS') { isActive = false; }
        this.setState({ showNotification: true, enableSubmit: false, isActive });

        setTimeout(() => {
          if (terminationState === 'SUCCESS') {
            const { empId } = match.params;
            onGetData(orgId, empId);
          }
        }, 2000);

        setTimeout(() => {
          if (this._isMounted) {
            this.setState({ showNotification: false });
          }
        }, 5000);
      }

      /// /Show Notification for Success/Error for PUT call
      if ((putDataState !== prevProps.putDataState && (putDataState === 'SUCCESS' || putDataState === 'ERROR'))
      || (putContractorDataState !== prevProps.putContractorDataState
        && (putContractorDataState === 'SUCCESS' || putContractorDataState === 'ERROR'))) {
        let isEdited = true;
        if (putDataState === 'SUCCESS' || putContractorDataState === 'SUCCESS') { isEdited = false; }
        this.setState({ showNotification: true, enableSubmit: false, isEdited });
        setTimeout(() => {
          if (this._isMounted && (putDataState === 'SUCCESS' || putContractorDataState === 'SUCCESS')) {
            this.setState({ showNotification: false });
          }
        }, 5000);
      }

      if (!_.isEqual(prevState.reportsTo, reportsTo) && !_.isEmpty(reportsTo)) {
        const tagArray = [];
        if (!_.isEmpty(reportsTo.defaultRole)) {
          tagArray.push(reportsTo.defaultRole);
        }
        if (!_.isEmpty(reportsTo.defaultLocation)) {
          tagArray.push(reportsTo.defaultLocation);
        }
        if (tagArray.length > 0) {
          onGetReportsToTagInfo(reportsTo.tags);
        }
      }

      if (prevProps.reportsToDataState !== reportsToDataState) {
        if (reportsToDataState === 'SUCCESS') {
          this.setState({ reportsTo: reportsToData });
        }
      }

      if (formData.entityType !== prevState.formData.entityType
        && prevState.formData.entityType !== null) {
        this.stateResetOnEntityChange();
      }

      if (getTagInfoState !== prevProps.getTagInfoState && getTagInfoState === 'SUCCESS') {
        if (!_.isEmpty(tagList)) {
          this.handleTagAllocation(formData);
        }
      }

      // set state for client and superClient ids
      if (!_.isEqual(prevProps.deploymentHistoryState, deploymentHistoryState)
      && !_.isEmpty(deploymentHistory)) {
        deploymentHistory.forEach((history) => {
          if (history.type === 'client') { clientId = history.orgData.uuid; }
          if (history.type === 'superClient') { superClientId = history.orgData.uuid; }
        });
        this.setState({ clientId, superClientId });
      }
      // call contractor api when selected tile is client/superclient
      if (!_.isEmpty(deploymentHistory) && prevState.selectedTile !== selectedTile) {
        if (deploymentHistory[selectedTile].type !== 'org') {
          this.handleContractorAPI('get', null);
        } else {
          this.handleTagAllocation(formData);
        }
      }

      // fill props to state value for contractor
      if (!_.isEqual(prevProps.getContractorDataState, getContractorDataState) && getContractorDataState === 'SUCCESS') {
        if (!_.isEmpty(getContractorData)) {
          this.handlePropsToState();
        }
      }
    }

    handleContractorAPI = (method, payload) => {
      const { selectedTile, clientId } = this.state;
      let { superClientId } = this.state;
      const {
        match, onGetContractorDetails, deploymentHistory, onPutContractorDetails,
      } = this.props;

      superClientId = deploymentHistory[selectedTile].type === 'superClient'
        ? superClientId : null;

      if (method === 'get') {
        onGetContractorDetails(match.params.uuid, match.params.empId,
          deploymentHistory[selectedTile].type, clientId, superClientId);
      } else if (!_.isEmpty(payload)) {
        onPutContractorDetails(match.params.uuid, match.params.empId,
          deploymentHistory[selectedTile].type, clientId, superClientId, payload);
      }
    }

    stateResetOnEntityChange = () => {
      const { formData } = this.state;
      const currentEntity = formData.entityType;
      const initData = _.cloneDeep(InitData);
      initData.entityType = currentEntity;

      this.setState({
        formData: initData,
        enableSubmit: false,
        location: [],
        role: [],
        custom: [],
        reportsTo: [],
        defaultRole: null,
        defaultLocation: null,
        errors: {},
      });
    }

    handlePropsToState = () => {
      const { formData, selectedTile } = this.state;
      const {
        empData, deploymentHistory, deploymentHistoryState, getContractorData,
      } = _.cloneDeep(this.props);

      let updatedFormData = _.cloneDeep(formData);
      let isActive = true;
      if (!_.isEmpty(empData)) {
        const initData = _.cloneDeep(InitData);
        isActive = empData.isActive;
        _.forEach(initData, (val, key) => {
          updatedFormData[key] = empData[key];
          if (key === 'entityType' && _.isEmpty(empData[key])) {
            updatedFormData[key] = 'EMPLOYEE';
          }
        });
      } else {
        updatedFormData = _.cloneDeep(InitData);
        updatedFormData.entityType = 'EMPLOYEE';
      }

      // if selected tile is client/superClient, fill data from get api
      if (deploymentHistoryState === 'SUCCESS' && !_.isEmpty(deploymentHistory)) {
        if (deploymentHistory[selectedTile].type !== 'org') {
          updatedFormData.contractor = _.cloneDeep(contractorFields);
          _.forEach(getContractorData, (value, field) => {
            if (!_.isEmpty(updatedFormData.contractor) && getContractorData[field] !== undefined) {
              updatedFormData.contractor[field] = getContractorData[field];
            }
          });
          updatedFormData.contractor.type = deploymentHistory[selectedTile].type;
          if (!_.isEmpty(updatedFormData.contractor.tags)) {
            this.handleGetTagData(updatedFormData.orgId, updatedFormData);
          } else {
            this.handleTagAllocation(updatedFormData);
          }
        }
      }
      this.setState({
        formData: updatedFormData,
        errors: {},
        isEdited: false,
        showCancelPopUp: false,
        enableSubmit: false,
        isActive,
      });
    }

    handleGetTagData = (orgId, updatedFormData) => {
      const { empData, onGetTagInfo, onGetReportsToData } = this.props;
      let tagsArray = [];

      if (!_.isEmpty(updatedFormData)) {
        if (!_.isEmpty(updatedFormData.contractor) && !_.isEmpty(updatedFormData.contractor.tags)) {
          tagsArray = [...updatedFormData.contractor.tags, ...tagsArray];
        }
      } else {
        if (empData.tags != null && empData.tags.length > 0) {
          tagsArray = [...empData.tags];
        }
        if (empData.defaultLocation && !tagsArray.includes(empData.defaultLocation)) {
          tagsArray = [empData.defaultLocation, ...tagsArray];
        }
        if (empData.defaultRole && !tagsArray.includes(empData.defaultRole)) {
          tagsArray = [empData.defaultRole, ...tagsArray];
        }
      }

      if (tagsArray.length !== 0) {
        onGetTagInfo(tagsArray);
      }
      if (empData.reportsTo != null) {
        onGetReportsToData(empData.reportsTo, orgId);
      }
    }

    handleManagerClose = () => {
      const { formData } = this.state;
      const enableSubmit = this.handleEnableSubmit(formData);
      this.setState({ reportsTo: [], isEdited: true, enableSubmit });
    }

    handleInputReportsTo = (value) => {
      const { formData } = this.state;
      const { setReportsToData } = this.props;
      const enableSubmit = this.handleEnableSubmit(formData);
      setReportsToData(value);
      this.setState({ reportsTo: value, isEdited: true, enableSubmit });
    }

    handleInputChange = (event, inputIdentifier, action) => {
      const {
        formData, location, role, custom, selectedTile,
      } = _.cloneDeep(this.state);
      const { deploymentHistory, deploymentHistoryState } = this.props;
      const updatedFormData = _.cloneDeep(formData);
      let updatedLocation = _.cloneDeep(location);
      let updatedRoles = _.cloneDeep(role);
      let updatedCustom = _.cloneDeep(custom);
      let isEdited = false;
      let enableSubmit = false;

      if (inputIdentifier === 'tags') {
        if (action === 'add') {
          if (!_.isEmpty(updatedFormData.tags)) updatedFormData.tags.push(event.value.uuid);
          else updatedFormData.tags = [event.value.uuid];

          if (event.value.category === 'geographical') {
            updatedLocation = this.handleInsertInTags(updatedLocation, event.value);
          } else if (event.value.category === 'functional' && event.value.type === 'role') {
            updatedRoles = this.handleInsertInTags(updatedRoles, event.value);
          } else if (event.value.category === 'custom') {
            updatedCustom = this.handleInsertInTags(updatedCustom, event.value);
          }
        }
        if (action === 'delete') {
          updatedFormData.tags = _.remove(updatedFormData.tags, (tag) => tag !== event.value.uuid);
          if (event.value.category === 'geographical') {
            updatedLocation = this.handleDeleteInTags(updatedLocation, event.value);
          } else if (event.value.category === 'functional' && event.value.type === 'role') {
            updatedRoles = this.handleDeleteInTags(updatedRoles, event.value);
          } else if (event.value.category === 'custom') {
            updatedCustom = this.handleDeleteInTags(updatedCustom, event.value);
          }
        }
        isEdited = true;
      } else {
        if (deploymentHistoryState === 'SUCCESS' && !_.isEmpty(deploymentHistory)
            && deploymentHistory[selectedTile].type !== 'org') {
          updatedFormData.contractor[inputIdentifier] = event;
          isEdited = true;
        } else {
          updatedFormData[inputIdentifier] = event;
          isEdited = true;
        }
      }

      enableSubmit = this.handleEnableSubmit(updatedFormData);
      this.setState({
        formData: updatedFormData,
        isEdited,
        enableSubmit,
        location: updatedLocation,
        role: updatedRoles,
        custom: updatedCustom,
      });
    };

    removePopUp = () => {
      const { isEdited, showCancelPopUp } = this.state;
      if (!isEdited) {
        this.cancelHandler();
      } else {
        const showCancelPopUpFlag = (!showCancelPopUp);
        this.setState({
          showCancelPopUp: showCancelPopUpFlag,
        });
      }
    }

    cancelHandler = () => {
      const {
        match, reportsToData, empData, onGetReportsToData, onGetTagInfo,
      } = this.props;
      let { defaultRole, defaultLocation } = this.state;

      const reportManager = _.cloneDeep(reportsToData);
      const orgId = match.params.uuid;

      let updatedReportManager = [];
      if (!_.isEmpty(reportManager) && !_.isEmpty(empData) && !_.isEmpty(empData.reportsTo)) {
        if (_.isEqual(empData.reportsTo, reportsToData.uuid)) {
          updatedReportManager = reportManager;
        } else {
          onGetReportsToData(empData.reportsTo, orgId);
        }
      }
      this.setState({ reportsTo: updatedReportManager });
      this.handlePropsToState();

      let tagsArray = []; let defaultRoleExists = false; let defaultLocationExists = false;
      if (empData.tags != null && empData.tags.length > 0) {
        tagsArray = [...empData.tags];
        if (empData.defaultLocation && tagsArray.includes(empData.defaultLocation)) {
          defaultLocationExists = true;
        }
        if (empData.defaultRole && tagsArray.includes(empData.defaultRole)) {
          defaultRoleExists = true;
        }
      }
      if (empData.defaultLocation && !tagsArray.includes(empData.defaultLocation)) {
        tagsArray = [empData.defaultLocation, ...tagsArray];
        defaultLocationExists = true;
      }
      if (empData.defaultRole && !tagsArray.includes(empData.defaultRole)) {
        tagsArray = [empData.defaultRole, ...tagsArray];
        defaultRoleExists = true;
      }

      if (!defaultRoleExists) { defaultRole = null; }
      if (!defaultLocationExists) { defaultLocation = null; }
      this.setState({
        location: [], role: [], custom: [], defaultRole, defaultLocation,
      });

      if (tagsArray.length !== 0) {
        onGetTagInfo(tagsArray);
      }
    }

    handleError = (error, inputField) => {
      const { errors } = this.state;
      const currentErrors = _.cloneDeep(errors);
      const updatedErrors = _.cloneDeep(currentErrors);
      if (!_.isEmpty(error)) {
        updatedErrors[inputField] = error;
      } else {
        delete updatedErrors[inputField];
      }
      this.setState({ errors: updatedErrors });
    };

    handleDefaultTags = (event, action, category) => {
      const { formData, defaultLocation, defaultRole } = _.cloneDeep(this.state);

      const updatedFormData = _.cloneDeep(formData);
      let updatedDefaultLocation = _.cloneDeep(defaultLocation);
      let updatedDefaultRoles = _.cloneDeep(defaultRole);
      let enableSubmit = false;

      if (action === 'add') {
        if (category === 'geographical') {
          updatedFormData.defaultLocation = event.uuid;
          updatedDefaultLocation = event;
          updatedFormData.defaultLocation = updatedDefaultLocation.uuid;
        } else {
          updatedFormData.defaultRole = event.uuid;
          updatedDefaultRoles = event;
          updatedFormData.defaultRole = updatedDefaultRoles.uuid;
        }
      }
      if (action === 'delete') {
        if (category === 'geographical') {
          updatedFormData.defaultLocation = null;
          updatedDefaultLocation = null;
          updatedFormData.defaultLocation = null;
        } else {
          updatedFormData.defaultRole = null;
          updatedDefaultRoles = null;
          updatedFormData.defaultRole = null;
        }
      }

      enableSubmit = this.handleEnableSubmit(updatedFormData);

      this.setState({
        formData: updatedFormData,
        isEdited: true,
        enableSubmit,
        defaultLocation: updatedDefaultLocation,
        defaultRole: updatedDefaultRoles,
      });
    }

    handleInsertInTags = (tagList, tag) => [
      ...tagList.slice(0),
      tag,
    ]

    handleDeleteInTags = (tagList, targetTag) => (
      tagList.filter((tag) => tag.uuid !== targetTag.uuid)
    )

    toggleTerminate = () => {
      const { terminatePopup } = this.state;
      // if(event){ event.preventDefault() }
      this.setState({ terminatePopup: !terminatePopup });
    }

    handleTagAllocation = (data) => {
      let {
        defaultLocation, defaultRole, contractorDefaultLocation, contractorDefaultRole,
      } = _.cloneDeep(this.state);
      const updatedFormData = _.cloneDeep(data);
      const { employeeTags } = this.state;
      const { tagList, empData } = this.props;
      let loopTagArray = [];
      const location = []; const role = []; const custom = [];
      let contractorLocation = []; let contractorRole = [];

      loopTagArray = !_.isEmpty(employeeTags) ? employeeTags : tagList;

      if (!_.isEmpty(loopTagArray)) {
        _.forEach(loopTagArray, (tag) => {
          if (tag.orgId === empData.orgId) {
            if (tag.category === 'geographical' && (_.includes(empData.tags, tag.uuid) || tag.uuid !== empData.defaultLocation)) {
              location.push(tag);
            }
            if (tag.category === 'functional' && tag.type === 'role' && (_.includes(empData.tags, tag.uuid) || tag.uuid !== empData.defaultRole)) {
              role.push(tag);
            }
            if (tag.category === 'custom') {
              custom.push(tag);
            }
            if (tag.uuid === empData.defaultRole) {
              defaultRole = tag;
            }
            if (tag.uuid === empData.defaultLocation) {
              defaultLocation = tag;
            }
          }
        });
      }

      // for contractor tags
      if (!_.isEmpty(updatedFormData) && !_.isEmpty(updatedFormData.contractor)) {
        // if contractor tags, then display default role and location
        if (!_.isEmpty(updatedFormData.contractor.tags) && !_.isEmpty(tagList)) {
          _.forEach(tagList, (tag) => {
            if (tag.category === 'geographical' && tag.uuid === updatedFormData.contractor.defaultLocation) {
              contractorDefaultLocation = tag;
            } else if (_.isEmpty(updatedFormData.contractor.defaultLocation)) {
              contractorDefaultLocation = null;
            }

            if (tag.category === 'functional' && tag.uuid === updatedFormData.contractor.defaultRole) {
              contractorDefaultRole = tag;
            } else if (_.isEmpty(updatedFormData.contractor.defaultRole)) {
              contractorDefaultRole = null;
            }

            if (tag.category === 'geographical' && (_.includes(updatedFormData.contractor.tags, tag.uuid) || tag.uuid !== updatedFormData.contractor.defaultLocation)) {
              const tags = [];
              if (!_.isEmpty(contractorLocation)) {
                contractorLocation.forEach((each) => {
                  if (!tags.includes(each.uuid)) tags.push(each.uuid);
                });
              }
              if (!tags.includes(tag.uuid)) { contractorLocation.push(tag); }
            }
            if (tag.category === 'functional' && tag.type === 'role' && (_.includes(updatedFormData.contractor.tags, tag.uuid) || tag.uuid !== updatedFormData.contractor.defaultRole)) {
              const tags = [];
              if (!_.isEmpty(contractorRole)) {
                contractorRole.forEach((each) => {
                  if (!tags.includes(each.uuid)) tags.push(each.uuid);
                });
              }
              if (!tags.includes(tag.uuid)) { contractorRole.push(tag); }
            }
          });
        } else { // no contractor tags, display empty
          contractorDefaultLocation = ''; contractorDefaultRole = '';
          contractorLocation = []; contractorRole = [];
        }
      }

      if (!_.isEmpty(updatedFormData) && _.isEmpty(updatedFormData.contractor)) {
        this.setState({ employeeTags: tagList });
      }

      this.setState({
        location,
        role,
        custom,
        defaultLocation,
        defaultRole,
        contractorDefaultLocation,
        contractorDefaultRole,
        // formData,
        contractorLocation,
        contractorRole,
      });
    }

    handleEnableSubmit = (formData) => {
      const { errors } = this.state;
      const updatedFormData = _.cloneDeep(formData);
      let requiredFields = _.cloneDeep(employeeRequiredFields);
      let enableSubmit = true;

      if (updatedFormData.entityType === 'TENANT') requiredFields = _.cloneDeep(tenantRequiredFields);
      else if (updatedFormData.entityType === 'BUSINESS_ASSOCIATE') requiredFields = _.cloneDeep(businessRequiredFields);

      _.forEach(requiredFields, (key) => {
        if (_.isEmpty(updatedFormData[key])) enableSubmit = false;
      });

      // checking required fields for contractor
      if (!_.isEmpty(updatedFormData.contractor)) {
        requiredFields = _.cloneDeep(contractorRequiredFields);
        _.forEach(requiredFields, (key) => {
          if (_.isEmpty(updatedFormData.contractor[key])) enableSubmit = false;
        });
      }

      if (enableSubmit) {
        enableSubmit = enableSubmit && _.isEmpty(errors);
      }
      return enableSubmit;
    }

    handleFormSubmit = () => {
      const {
        formData, reportsTo, orgId, empId, selectedTile,
      } = _.cloneDeep(this.state);
      const { empData, onPutData, deploymentHistory } = this.props;

      const updatedEmpData = _.cloneDeep(empData);
      if (!_.isEmpty(reportsTo)) {
        formData.reportsTo = reportsTo.uuid;
      } else {
        formData.reportsTo = null;
      }

      _.forEach(formData, (value, field) => {
        if (formData[field] !== undefined) {
          updatedEmpData[field] = formData[field];
        }
      });

      if (!_.isEmpty(formData.contractor) && !_.isEmpty(deploymentHistory)
      && deploymentHistory[selectedTile].type !== 'org') {
        this.handleContractorAPI('put', updatedEmpData.contractor);
      } else {
        onPutData(orgId, empId, updatedEmpData);
      }
    }

    handleClick = (index) => {
      const { selectedTile } = this.state;
      if (index !== selectedTile) {
        this.setState({ selectedTile: index });
      }
    };

    render() {
      const {
        match, orgNamemapping, deploymentHistory, deploymentHistoryState, empData, getDataState,
        getStaticDataState, reportsToTagInfoState, reportsToTagInfo, history, orgData,
        terminationState, error, putDataState, empProfilePic,
        EMP_MGMT_ENTITY_TYPE, EMP_MGMT_EMPSTATUS, EMP_MGMT_EMP_TYPE,
        getContractorDataState, putContractorDataState,
      } = this.props;
      const {
        selectedTile, formData, location, role, custom, defaultRole, defaultLocation, isActive,
        errors, reportsTo, enableSubmit, isEdited, showCancelPopUp, showNotification,
        terminatePopup, contractorDefaultLocation, contractorDefaultRole,
        contractorLocation, contractorRole,
      } = this.state;

      const orgId = match.params.uuid;
      const { empId } = match.params;

      let empName = '';
      if (!_.isEmpty(empData)) {
        empName = (!_.isEmpty(empData.firstName) ? empData.firstName : '') + (!_.isEmpty(empData.lastName) ? ` ${empData.lastName}` : '');
      } else { empName = 'person'; }

      let managerCard = null; let reportsToDesignation = ''; let reportsToLocation = '';
      if (reportsToTagInfoState === 'SUCCESS') {
        _.forEach(reportsToTagInfo, (data) => {
          if (data.category === 'functional' && reportsTo.defaultRole === data.uuid) {
            reportsToDesignation = data.name;
          }
          if (data.category === 'geographical' && reportsTo.defaultLocation === data.uuid) {
            reportsToLocation = data.name;
          }
        });
      }

      if (!_.isEmpty(reportsTo)) {
        const managerData = reportsTo;
        managerCard = (
          <SpocCard
            reportingManager
            name={managerData.firstName + (managerData.lastName ? ` ${managerData.lastName}` : '')}
            profilePicUrl={managerData.profilePicUrl}
            empId={managerData.uuid}
            orgName={orgData.nameInLowerCase}
            employeeId={managerData.employeeId}
            designation={reportsToDesignation}
            locationTag={reportsToLocation}
            id={null}
            isChecked
            changed={this.handleManagerClose}
          />
        );
      }

      let mandatoryFieldsFilled = enableSubmit;
      mandatoryFieldsFilled = this.handleEnableSubmit(_.cloneDeep(formData));

      return (
        <>
          <Prompt
            when={isEdited}
            navigate={(path) => history.push(path)}
          />
          {showCancelPopUp
            ? (
              <WarningPopUp
                text="cancel?"
                para="WARNING: it can not be undone"
                confirmText="yes, cancel"
                cancelText="keep"
                icon={warn}
                warningPopUp={this.cancelHandler}
                closePopup={this.removePopUp}
              />
            ) : null}
          {getDataState === 'LOADING' || getStaticDataState === 'LOADING' || deploymentHistoryState === 'LOADING'
            ? (
              <div className={cx(styles.alignCenter, scrollStyle.scrollbar, 'pt-4')}>
                <Loader type="onboardForm" />
              </div>
            )
            : (
              <div className={cx(styles.form, scrollStyle.scrollbar)}>
                <div className={styles.fixedHeader}>
                  <ArrowLink
                    label={`${empName.toLowerCase()}'s profile`}
                    url={`/customer-mgmt/org/${orgId}/employee/${empId}/profile`}
                  />
                  <CardHeader label="employee details" iconSrc={empDetailsIcon} />
                  <div className={styles.notificationHeader}>
                    <div className={cx(styles.formHeader, 'row mx-0')} style={{ height: '3.5rem' }}>
                      <div className={cx(styles.timeHeading, 'col-8 mx-0 px-0')}>
                        {terminationState === 'SUCCESS' && showNotification
                          ? <Notification type="success" message="employee terminated successfully" />
                          : terminationState === 'ERROR' && showNotification
                            ? <Notification type="warning" message={error} />
                            : (putDataState === 'SUCCESS' || putContractorDataState === 'SUCCESS') && showNotification
                              ? <Notification type="success" message="employee updated successfully" />
                              : (putDataState === 'ERROR' || putContractorDataState === 'ERROR') && showNotification
                                ? <Notification type="warning" message={error} />
                                : !mandatoryFieldsFilled
                                  ? <Notification type="basic" message="please fill all the mandatory fields to enable save" />
                                  : null}
                      </div>

                      <div className="ml-auto d-flex my-auto">
                        <div className={cx('row no-gutters justify-content-end')}>
                          <CancelButton
                            isDisabled={!isActive}
                            clickHandler={this.removePopUp}
                            className={isActive ? styles.cancelButton : styles.disabledCancelButton}
                          />

                          {putDataState === 'LOADING' || putContractorDataState === 'LOADING' || terminationState === 'LOADING' ? <Spinnerload type="loading" />
                            : <Button label="save" isDisabled={!isActive ? !isActive : !enableSubmit} clickHandler={() => this.handleFormSubmit()} type="save" />}

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={cx(styles.alignCenter, scrollStyle.scrollbar)}>
                  <div className={cx(styles.CardLayout, ' card p-relative mr-0')}>
                    <div className={cx(styles.CardPadding, 'card-body')}>
                      {this.vendorExists && deploymentHistoryState === 'SUCCESS' && !_.isEmpty(deploymentHistory)
                        ? (
                          <>
                            <div className={styles.subHeading}>
                              employee job & contractor details
                            </div>
                            <Carousel
                              showItems={2}
                              itemWidth={292}
                              clickHandler={(index) => this.handleClick(index)}
                              selectedTile={selectedTile}
                              widthStyles={styles.sliderMaxWidth}
                              iconStylesLeft={styles.iconMarginTop}
                              iconStylesRight={styles.iconMarginTop}
                            >
                              {!_.isEmpty(deploymentHistory) && deploymentHistory.length > 0
                              && deploymentHistory.map((each, index) => (
                                <div key={each.orgId}>
                                  <DeployedInfoTile
                                    orgType={each.type}
                                    isTerminated={each.status === 'TERMINATED'}
                                    orgName={each.orgData.name}
                                    sourceOrgName={!_.isEmpty(each.source_org) ? orgNamemapping[each.source_org] : ''}
                                    originOrgName={!_.isEmpty(each.origin_org) ? orgNamemapping[each.origin_org] : ''}
                                    deployedTo={!_.isEmpty(each.deployedTo) ? each.deployedTo : ''}
                                    brandColor={each.orgData.brandColor}
                                    joiningDate={each.joiningDate}
                                    terminationDate={each.terminationDate}
                                    isSelected={index === selectedTile}
                                    clickHandler={() => this.handleClick(index)}
                                  />
                                  {index === selectedTile
                            && (
                            <div className="d-flex justify-content-center">
                              <div className={styles.activePointer} />
                              <hr className={styles.activeHorizontalLine} />
                            </div>
                            )}
                                </div>
                              ))}
                            </Carousel>
                            <hr className={styles.horizontalLine} />
                          </>
                        ) : <div className={styles.subHeading}>employee details</div>}
                      {this._isMounted
                        ? (
                          this.vendorExists && deploymentHistoryState === 'SUCCESS' && !_.isEmpty(deploymentHistory[selectedTile])
                          && deploymentHistory[selectedTile].type !== 'org' && getContractorDataState === 'SUCCESS'
                          && !_.isEmpty(formData) && !_.isEmpty(formData.contractor)
                            ? (
                              <>
                                <Contractor
                                  formData={formData.contractor}
                                  location={contractorLocation}
                                  roles={contractorRole}
                                  custom={null}
                                  contractorDefaultRole={contractorDefaultRole}
                                  contractorDefaultLocation={contractorDefaultLocation}
                                  onChange={this.handleInputChange}
                                  validation={validation}
                                  message={message}
                                  disable={!isActive}
                                  errors={errors}
                                  handleError={this.handleError}
                                  orgId={orgId}
                                  handleDefaultTags={this.handleDefaultTags}
                                  requiredFields={contractorRequiredFields}
                                  empStatusOptions={EMP_MGMT_EMPSTATUS}
                                  orgData={deploymentHistory[selectedTile].orgData}
                                />
                                {terminatePopup
                                  ? (
                                    <TerminationCard
                                      toggle={this.toggleTerminate}
                                      entityData={empData}
                                      entityProfilePic={empProfilePic}
                                      contractorData={deploymentHistory[selectedTile]}
                                    />
                                  ) : null}

                                <HasAccess
                                  permission={['EMP_MGMT:TERMINATE']}
                                  orgId={orgId}
                                  yes={() => (isActive === true
                                    ? (
                                      <div className={cx(styles.terminateBlock)}>
                                        <hr className={cx(styles.HorizontalLine)} />
                                        <div className={cx('mb-3')}>
                                          do you want to terminate the employee?
                                        </div>
                                        <Button
                                          type="custom"
                                          label="terminate"
                                          icon1={warning}
                                          className={cx(styles.terminateButton)}
                                          clickHandler={this.toggleTerminate}
                                          labelStyle={styles.labelStyle}
                                          isDisabled={false}
                                        />
                                      </div>
                                    ) : null)}
                                />
                              </>
                            )
                            : (
                              <>
                                <div className="row mt-3">
                                  <CustomSelect
                                    name="entityType"
                                    className="my-1 col-4 py-2"
                                    required
                                    label="entity type"
                                    disabled={!_.isEmpty(empData.entityType)}
                                    options={EMP_MGMT_ENTITY_TYPE}
                                    value={formData.entityType}
                                    onChange={(value) => this.handleInputChange(value, 'entityType')}
                                  />
                                </div>

                                {formData.entityType === 'EMPLOYEE'
                                  ? (
                                    <Employee
                                      data={formData}
                                      location={location}
                                      roles={role}
                                      custom={custom}
                                      defaultRole={defaultRole}
                                      defaultLocation={defaultLocation}
                                      onChange={this.handleInputChange}
                                      validation={validation}
                                      message={message}
                                      disable={!isActive}
                                      errors={errors}
                                      handleError={this.handleError}
                                      orgId={orgId}
                                      handleDefaultTags={this.handleDefaultTags}
                                      requiredFields={employeeRequiredFields}
                                      empTypeOptions={EMP_MGMT_EMP_TYPE}
                                      empStatusOptions={EMP_MGMT_EMPSTATUS}
                                    />
                                  )
                                  : formData.entityType === 'TENANT'
                                    ? (
                                      <Tenant
                                        data={formData}
                                        location={location}
                                        roles={role}
                                        custom={custom}
                                        defaultRole={defaultRole}
                                        defaultLocation={defaultLocation}
                                        onChange={this.handleInputChange}
                                        validation={validation}
                                        message={message}
                                        disable={!isActive}
                                        errors={errors}
                                        handleError={this.handleError}
                                        orgId={orgId}
                                        handleDefaultTags={this.handleDefaultTags}
                                        requiredFields={tenantRequiredFields}
                                      />
                                    )
                                    : formData.entityType === 'BUSINESS_ASSOCIATE'
                                      ? (
                                        <Business
                                          data={formData}
                                          location={location}
                                          roles={role}
                                          custom={custom}
                                          defaultRole={defaultRole}
                                          defaultLocation={defaultLocation}
                                          onChange={this.handleInputChange}
                                          validation={validation}
                                          message={message}
                                          disable={!isActive}
                                          errors={errors}
                                          handleError={this.handleError}
                                          orgId={orgId}
                                          handleDefaultTags={this.handleDefaultTags}
                                          requiredFields={businessRequiredFields}
                                          empStatusOptions={EMP_MGMT_EMPSTATUS}
                                        />
                                      ) : null}

                                <EmpSearch
                                  name="manager"
                                  label="select reporting manager"
                                  placeholder="start searching manager here"
                                  BarStyle={cx('col-6')}
                                  disabled={!isActive || !_.isEmpty(reportsTo)}
                                  selectedResult={reportsTo}
                                  updateTag={(value) => this.handleInputReportsTo(value)}
                                />

                                <div className="col-9 px-0 my-2">
                                  {managerCard}
                                </div>
                                {terminatePopup
                                  ? (
                                    <TerminationCard
                                      toggle={this.toggleTerminate}
                                      entityData={empData}
                                      entityProfilePic={empProfilePic}
                                      contractorData={null}
                                    />
                                  ) : null}

                                <HasAccess
                                  permission={['EMP_MGMT:TERMINATE']}
                                  orgId={orgId}
                                  yes={() => (isActive === true
                                    ? (
                                      <div className={cx(styles.terminateBlock)}>
                                        <hr className={cx(styles.HorizontalLine)} />
                                        <div className={cx('mb-3')}>
                                          do you want to terminate the employee?
                                        </div>
                                        <Button
                                          type="custom"
                                          label="terminate"
                                          icon1={warning}
                                          className={cx(styles.terminateButton)}
                                          clickHandler={this.toggleTerminate}
                                          labelStyle={styles.labelStyle}
                                          isDisabled={false}
                                        />
                                      </div>
                                    ) : null)}
                                />
                              </>
                            )
                        ) : null}
                    </div>
                  </div>
                </div>
              </div>
            )}

        </>
      // </React.Fragment>
      );
    }
}

const mapStateToProps = (state) => ({
  getDataState: state.empMgmt.empOnboard.onboard.getEmpDataState,
  putDataState: state.empMgmt.empOnboard.onboard.putEmpDataState,
  getTagInfoState: state.empMgmt.empOnboard.empDetails.getTagInfoState,
  tagList: state.empMgmt.empOnboard.empDetails.tagList,
  empData: state.empMgmt.empOnboard.onboard.empData,
  putDataError: state.empMgmt.empOnboard.empDetails.putDataError,
  error: state.empMgmt.empOnboard.onboard.error,
  entityType: state.empMgmt.empOnboard.empDetails.entityType,
  entityData: state.empMgmt.empOnboard.onboard.empData,
  empProfilePic: state.empMgmt.empOnboard.onboard.empProfilePic,
  terminationState: state.empMgmt.empTermination.entityTerminateState,
  terminationError: state.empMgmt.empTermination.error,
  reportsToData: state.empMgmt.empOnboard.empDetails.reportsToData,
  reportsToDataState: state.empMgmt.empOnboard.empDetails.reportsToDataState,
  reportsToTagInfoState: state.empMgmt.empOnboard.empDetails.reportsToTagInfoState,
  reportsToTagInfo: state.empMgmt.empOnboard.empDetails.reportsToTagInfo,
  orgDataState: state.empMgmt.staticData.getOrgDataState,
  orgData: state.empMgmt.staticData.orgData,
  getStaticDataState: state.empMgmt.staticData.getDataState,
  EMP_MGMT_ENTITY_TYPE: state.empMgmt.staticData.empMgmtStaticData.EMP_ENTITY_TYPE,
  EMP_MGMT_EMPSTATUS: state.empMgmt.staticData.empMgmtStaticData.EMP_MGMT_EMPSTATUS,
  EMP_MGMT_EMP_TYPE: state.empMgmt.staticData.empMgmtStaticData.EMP_MGMT_EMP_TYPE,

  deploymentHistoryState: state.empMgmt.empOnboard.empDetails.deploymentHistoryState,
  deploymentHistory: state.empMgmt.empOnboard.empDetails.deploymentHistory,
  orgNamemapping: state.empMgmt.empOnboard.empDetails.orgNamemapping,
  servicesEnabled: state.empMgmt.staticData.servicesEnabled,
  servicesEnabledState: state.empMgmt.staticData.getServicesEnabledState,
  // isActive: state.empMgmt.staticData.isActive

  getContractorData: state.empMgmt.empOnboard.empDetails.getContractorData,
  getContractorDataState: state.empMgmt.empOnboard.empDetails.getContractorDataState,
  putContractorData: state.empMgmt.empOnboard.empDetails.putContractorData,
  putContractorDataState: state.empMgmt.empOnboard.empDetails.putContractorDataState,
});

const mapDispatchToProps = (dispatch) => ({
  initState: () => dispatch(actions.initState()),
  onGetData: (orgId, empId) => dispatch(empOnboardActions.getEmpData(orgId, empId)),
  onPutData: (orgId, empId, data) => dispatch(
    empOnboardActions.putEmpData(orgId, empId, data, false, true, true),
  ),
  onResetError: () => dispatch({ type: actionTypes.RESET_ERROR }),
  onResetTerminationError: () => dispatch({ type: actionTerminateTypes.RESET_ERROR }),
  //   getEntityData: (orgId, empId) => dispatch(empMgmtActions.getData(orgId, empId)),
  onGetTagInfo: (tagIdList) => dispatch(actions.getTagInfo(tagIdList)),
  onGetReportsToData: (empId, orgId) => dispatch(actions.getReportsToData(empId, orgId)),
  onGetReportsToTagInfo: (tagIdList) => dispatch(actions.getReportsToTagInfo(tagIdList)),
  onGetOrgData: (orgId) => dispatch(actions.getOrgData(orgId)),
  setReportsToData: (reportsToData) => dispatch(actions.setReportsToData(reportsToData)),
  onGetDeploymentHistory: (orgId, empId, empData, type, status) => dispatch(
    actions.getDeploymentHistory(orgId, empId, empData, type, status),
  ),
  onGetContractorDetails: (orgId, empId, clientType, clientId, superClientId) => dispatch(
    actions.getContractorDetails(orgId, empId, clientType, clientId, superClientId),
  ),
  onPutContractorDetails: (orgId, empId, clientType, clientId, superClientId, payload) => dispatch(
    actions.putContractorDetails(orgId, empId, clientType, clientId, superClientId, payload),
  ),
});

export default (withRouter(connect(mapStateToProps, mapDispatchToProps)(EmpDetails)));
