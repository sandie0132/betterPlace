/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';
import _ from 'lodash';
import { Button, Datepicker } from 'react-crux';
import styles from './DeployModal.module.scss';

import { validation, message } from './DeployModalValidation';

import closePage from '../../../../../assets/icons/closePage.svg';
import warning from '../../../../../assets/icons/greyWarningCircle.svg';
import defaultPic from '../../../../../assets/icons/defaultPic.svg';

import scrollStyle from '../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';

import * as empListActions from '../Store/action';
// import HasAccess from '../../../../../services/HasAccess/HasAccess';
import SingleTagSearchField from '../../../VendorMgmt/TagSearch/SingleTagSearch/SingleTagSearch';
import VendorStaticSearch from '../../../../VendorSearch/VendorStaticSearch/VendorStaticSearch';

class DeployModal extends Component {
  constructor(props) {
    super(props);
    let currentDate = new Date().toLocaleDateString();
    currentDate = currentDate.split('/').join('-');
    this.state = {
      selectClient: {},
      selectEmployer: {},
      selectedLocationTag: '',
      selectedRoleTag: '',
      errors: {},
      deploymentFromDate: currentDate,
      deploymentToDate: null,
      triggeredSection: false, // this is for validation trigger on change of from/to dates
    };
  }

  handleSelectedFilterTag = (event, action, selectedTagType) => {
    const { selectedLocationTag, selectedRoleTag } = this.state;
    let locTag = _.cloneDeep(selectedLocationTag);
    let roleTag = _.cloneDeep(selectedRoleTag);

    if (selectedTagType === 'role') {
      roleTag = action === 'add' ? event : '';
    } else {
      locTag = action === 'add' ? event : '';
    }
    this.setState({ selectedLocationTag: locTag, selectedRoleTag: roleTag });
  }

  handleDeploy = () => {
    const {
      orgDetails, location, selectedEmployees, onPostBulkActions, selectAll, toggle,
    } = this.props;
    const { uuid } = orgDetails;
    let searchParams = new URLSearchParams(location.search.toString());
    searchParams.delete('pageNumber');
    searchParams = searchParams.toString();

    const {
      selectClient, selectedLocationTag, selectedRoleTag, selectEmployer,
      deploymentFromDate, deploymentToDate,
    } = this.state;

    let fromDate = deploymentFromDate;
    if (!_.isEmpty(fromDate)) {
      fromDate = fromDate.split('-');
      if (fromDate[0] && fromDate[0].length === 2) {
        fromDate = fromDate.reverse().join('-');
      } else {
        fromDate = fromDate.join('-');
      }
    }

    let payload = {
      plaformService: 'VENDOR',
      data: {
        client: {
          name: selectClient.name,
          orgId: selectClient._id,
        },
        location: {
          uuid: selectedLocationTag.uuid,
          tag_uuid: selectedLocationTag.tag_uuid,
        },
        empIds: [...selectedEmployees],
        deploymentStartDate: fromDate,
        deploymentEndDate: !_.isEmpty(deploymentToDate) ? deploymentToDate : null,
      },
    };
    if (!_.isEmpty(selectedRoleTag)) {
      payload = {
        ...payload,
        data: {
          ...payload.data,
          role: {
            uuid: selectedRoleTag.uuid,
            tag_uuid: selectedRoleTag.tag_uuid,
          },
        },

      };
    }
    if (!_.isEmpty(selectEmployer)) {
      payload = {
        ...payload,
        data: {
          ...payload.data,
          superClient: {
            name: selectEmployer.name,
            orgId: selectEmployer._id,
          },
        },
      };
    }
    onPostBulkActions(uuid, 'EMPLOYEE_VENDOR_DEPLOY', 'PROCESS_DATA', searchParams, payload, selectAll);
    toggle();
  }

  checkDisabled = () => {
    let disable = false;
    const {
      selectClient, selectedLocationTag, deploymentFromDate, errors,
    } = this.state;
    if (_.isEmpty(selectClient) || _.isEmpty(selectedLocationTag) || _.isEmpty(deploymentFromDate)
    || !_.isEmpty(errors)) {
      disable = true;
    }
    return disable;
  }

  handleSelectedValue = (data, type) => {
    let { selectClient, selectEmployer } = this.state;
    if (type === 'client') {
      selectClient = data;
      selectEmployer = {};
    } else {
      selectEmployer = data;
    }
    this.setState({ selectClient, selectEmployer });
  }

  handleDateInputChange = (value, inputField) => {
    let { deploymentFromDate, deploymentToDate } = _.cloneDeep(this.state);
    if (inputField === 'deploymentFromDate') {
      deploymentFromDate = value;
    } else {
      deploymentToDate = value;
    }
    this.setState({ deploymentFromDate, deploymentToDate, triggeredSection: inputField });
  };

  handleError = (error, inputField) => {
    const { errors } = _.cloneDeep(this.state);
    const updatedErrors = _.cloneDeep(errors);
    if (!_.isEmpty(error)) {
      updatedErrors[inputField] = error;
    } else {
      delete updatedErrors[inputField];
    }
    if (!_.isEqual(updatedErrors, errors)) {
      this.setState({ errors: updatedErrors });
    }
  };

  render() {
    const {
      t, match, toggle, selectAll, totalEmployeeCount, selectedEmployees, employeeList, images,
    } = this.props;
    const orgId = match.params.uuid;
    const empCount = selectAll ? totalEmployeeCount : selectedEmployees.length;
    const empHeading = selectAll
      ? totalEmployeeCount + t('translation_empList:deployModal.allSelected')
      : selectedEmployees.length + t('translation_empList:deployModal.fewSelected');

    const {
      selectClient, selectedLocationTag, selectedRoleTag, selectEmployer,
      deploymentFromDate, deploymentToDate, errors, triggeredSection,
    } = this.state;

    const profilePics = []; const empIds = [];
    employeeList.forEach((emp) => {
      if (selectedEmployees.includes(emp.uuid)) {
        profilePics.push(emp.profilePicUrl);
        empIds.push(emp.uuid);
      }
    });

    return (
      <div className={cx(styles.backdrop, scrollStyle.scrollbar)}>
        <div>
          <img
            aria-hidden="true"
            className={styles.closeStyle}
            src={closePage}
            onClick={toggle}
            alt={t('translation_empList:deployModal.close')}
          />
        </div>
        <div className={styles.MainHeading}>{t('translation_empList:deployModal.heading')}</div>
        <div className={cx(styles.Container, scrollStyle.scrollbar)}>
          <div className={cx(styles.CardPadding)}>
            <div className="d-flex flex-column">
              <div className="d-flex flex-row justify-content-center">
                {profilePics.map((pic, index) => {
                  if (index < 5) {
                    return (
                      <span key={empIds[index]}>
                        <img
                          src={pic ? (images[empIds[index]]
                            ? images[empIds[index]].image : defaultPic) : defaultPic}
                          alt=""
                          className={cx('mr-2', styles.profilePicUrl)}
                        />
                      </span>
                    );
                  } return null;
                })}
                {/* {employeeList.map((emp, index) => (
                  selectedEmployees.includes(emp.uuid) && index < 5 ? (
                    <span key={emp.uuid}>
                      <img
                        src={emp.profilePicUrl ? (images[emp.uuid]
                          ? images[emp.uuid].image : defaultPic) : defaultPic}
                        alt=""
                        className={cx('mr-2', styles.profilePicUrl)}
                      />
                    </span>
                  ) : null
                ))} */}
                {empCount > 5
                  ? (
                    <span className={cx('align-self-center', styles.countcircle)}>
                      +
                      {empCount - 5}
                    </span>
                  ) : null}
              </div>
              <span className={cx('mt-3 mb-1', styles.mediumText)}>
                {empHeading}
              </span>
              <span className={cx('mb-1', styles.greyTextSmall)}>
                {t('translation_empList:deployModal.pleaseDeploy')}
              </span>
            </div>
            <div className={cx('d-flex flex-row mt-3', styles.greyBg)}>
              <img src={warning} alt={t('translation_empList:deployModal.warningImg')} />
              &nbsp;
              <span className={cx('pl-2', styles.HelpText)}>
                {t('translation_empList:deployModal.helpText')}
              </span>
            </div>
            <hr className={cx(styles.HorizontalLine)} />

            <VendorStaticSearch
              showOnly="client"
              handleSelectedValue={this.handleSelectedValue}
              getAssociatedOrgs
              label={t('translation_empList:deployModal.selectAClient')}
              className={styles.SearchDropdown}
              inputClassName={styles.PrimaryText}
              required
            />

            <VendorStaticSearch
              showOnly="superClient"
              getAssociatedOrgs={!_.isEmpty(selectClient)}
              disableIfEmpty
              handleSelectedValue={this.handleSelectedValue}
              associatedOrgIdUrl={`clientId=${selectClient._id}`}
              isDisabled={_.isEmpty(selectClient)}
              label={t('translation_empList:deployModal.selectPrincipalEmployer')}
              className={styles.SearchDropdown}
              inputClassName={styles.PrimaryText}
            />

            {/* select location below */}
            <div className="row no-gutters" disabled={_.isEmpty(selectClient)}>
              <SingleTagSearchField
                saveOnlyTagName
                label={t('translation_empList:deployModal.selectLocation')}
                labelStyle="mb-1 mt-4"
                name="geographical"
                placeholder={t('translation_empList:deployModal.searchLocationPlaceholder')}
                orgId={orgId}
                clientId={selectClient._id}
                category="geographical"
                tags={selectedLocationTag}
                updateTag={(value, action) => this.handleSelectedFilterTag(value, action, 'loc')}
                superClientId={!_.isEmpty(selectEmployer)
                  ? selectEmployer._id : selectClient._id}
                searchBar={cx(styles.TagSearchBar)}
                BarStyle={cx('col-12 px-0', styles.TagBarStyle)}
                isSelected
                deployModal
                required
              />
            </div>

            {/* select a role below */}
            <div className="row no-gutters" disabled={_.isEmpty(selectClient)}>
              <SingleTagSearchField
                saveOnlyTagName
                position
                label={t('translation_empList:deployModal.selectRole')}
                labelStyle="mb-1 mt-0"
                name="functional"
                placeholder={t('translation_empList:deployModal.searchRolePlaceholder')}
                orgId={orgId}
                clientId={selectClient._id}
                category="functional"
                tags={selectedRoleTag}
                updateTag={(value, action) => this.handleSelectedFilterTag(value, action, 'role')}
                superClientId={!_.isEmpty(selectEmployer)
                  ? selectEmployer._id : selectClient._id}
                searchBar={cx(styles.TagSearchBar)}
                BarStyle={cx('col-12 px-0 mb-2', styles.TagBarStyle)}
                isSelected
                deployModal
              />
            </div>

            {/* select deployment dates below */}
            <div className="row no-gutters" disabled={_.isEmpty(selectClient)}>
              <Datepicker
                name="deploymentFromDate"
                className="col-6 pr-3"
                labelClassName={styles.dateLabel}
                label={t('translation_empList:deployModal.deploymentFrom')}
                required
                disabled={false}
                value={deploymentFromDate}
                onChange={(value) => this.handleDateInputChange(value, 'deploymentFromDate')}
                onError={(error) => this.handleError(error, 'deploymentFromDate')}
                validation={validation.deploymentFromDate}
                message={message.deploymentFromDate}
                errors={errors.deploymentFromDate}
              />
              <Datepicker
                name="deploymentToDate"
                className="col-6"
                labelClassName={styles.dateLabel}
                label={t('translation_empList:deployModal.deploymentTo')}
                required={false}
                disabled={false}
                value={deploymentToDate}
                onChange={(value) => this.handleDateInputChange(value, 'deploymentToDate')}
                onError={(error) => this.handleError(error, 'deploymentToDate')}
                validation={validation.deploymentToDate}
                message={message.deploymentToDate}
                errors={errors.deploymentToDate}
                triggerValidation={triggeredSection === 'deploymentFromDate' || triggeredSection === 'deploymentToDate'}
                customValidators={[_.get(this.state, 'deploymentFromDate', null), _.get(this.state, 'deploymentToDate', null)]}
              />
            </div>

            <hr className={styles.HorizontalLine} />

            <div className="d-flex flex-row justify-content-center mt-2">
              <Button
                type="save"
                label={t('translation_empList:deployModal.deploy')}
                isDisabled={this.checkDisabled()}
                clickHandler={this.handleDeploy}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  clientSearchResultState: state.empMgmt.empList.clientSearchResultState,
  clientSearchResult: state.empMgmt.empList.clientSearchResult,

  postBulkActionState: state.empMgmt.empList.postBulkActionState,
  postBulkActionName: state.empMgmt.empList.actionName,
  images: state.imageStore.images,
});

const mapDispatchToProps = (dispatch) => ({
  onPostBulkActions: (orgId, action, reqType, query, payload, selectAll) => dispatch(
    empListActions.employeeBulkActions(orgId, action, reqType, query, payload, selectAll),
  ),
  onSearchClient: (orgId, searchKey, clientId) => dispatch(
    empListActions.clientSearch(orgId, searchKey, clientId),
  ),
});

export default withTranslation()(withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DeployModal),
));
