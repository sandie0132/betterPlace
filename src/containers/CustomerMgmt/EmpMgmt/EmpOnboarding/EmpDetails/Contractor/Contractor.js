/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import _ from 'lodash';
import { Input, Datepicker } from 'react-crux';
import cx from 'classnames';
import styles from './Contractor.module.scss';

import CustomSelect from '../../../../../../components/Atom/CustomSelect/CustomSelect';
import TagSearchField from '../../../../../TagSearch/TagSearchField/TagSearchField';
import SingleTagSearchField from '../../../../../TagSearch/SingleTagSearch/SingleTagSearch';
import OrgLogo from '../../../../../../components/Atom/OrgLogo/OrgLogo';

import HasAccess from '../../../../../../services/HasAccess/HasAccess';

/**
 * @requiredFields {array} checking if field value is required or not
 * @disable {boolean} if field has to be disabled
 * @formData {object} form state values
 * @onChange {function} for input change
 * @handleError {function} for error check
 * @validation {} input value validity check
 * @message {string} shows error message
 * @errors {object} shows which field has error
 * @orgId {string}
 * @orgData {object} gives org data
 * @handleDefaultTags {function} to handle tags
 * @empStatusOptions {array} gives options for status dropdown
 * @contractorDefaultLocation {string} to display default location tag
 * @contractorDefaultRole {string} to display default role tag
 * @location {array of objects} to display other location tags
 * @roles {array of objects} to display other role tags
 */
const Contractor = ({
  requiredFields, disable, formData, onChange, handleError, validation, message,
  errors, orgId, orgData, handleDefaultTags, empStatusOptions,
  contractorDefaultLocation, contractorDefaultRole, location, roles, // custom,
}) => (
  <>
    <div className="row no-gutters mt-3">
      <Input
        name="employeeId"
        className="col-4 pr-3"
        label="contractor id"
        type="text"
        placeholder="contractor id"
        disabled={disable}
        value={formData.employeeId}
        onChange={(event) => onChange(event, 'employeeId')}
        onError={(error) => handleError(error, 'employeeId')}
        validation={validation.employeeId}
        message={message.employeeId}
        errors={errors.employeeId}
        required={_.includes(requiredFields, 'employeeId')}
      />
      <CustomSelect
        name="status"
        className="my-1 col-4 pr-3 py-2"
        required={_.includes(requiredFields, 'status')}
        label="status"
        disabled={disable}
        options={empStatusOptions}
        value={formData.status}
        onChange={(value) => onChange(value, 'status')}
      />
      <div className="ml-auto my-auto">
        <OrgLogo
          name={orgData.name}
          brandColor={orgData.brandColor}
        />
      </div>
    </div>
    <div className="row no-gutters">
      <Datepicker
        name="deploymentStartDate"
        className="col-4 pr-3"
        label="deployment start date"
        required={_.includes(requiredFields, 'deploymentStartDate')}
        disabled={disable}
        value={formData.deploymentStartDate}
        errors={errors.deploymentStartDate}
        validation={validation.deploymentStartDate}
        message={message.deploymentStartDate}
        onChange={(value) => onChange(value, 'deploymentStartDate')}
        onError={(error) => handleError(error, 'deploymentStartDate')}
      />
      <Datepicker
        name="deploymentEndDate"
        className="col-4 pr-3"
        label="deployment end date"
        required={_.includes(requiredFields, 'deploymentEndDate')}
        disabled={disable}
        value={formData.deploymentEndDate}
        errors={errors.deploymentEndDate}
        validation={validation.deploymentEndDate}
        message={message.deploymentEndDate}
        onChange={(value) => onChange(value, 'deploymentEndDate')}
        onError={(error) => handleError(error, 'deploymentEndDate')}
      />
    </div>

    <hr className={cx(styles.HorizontalLine)} />

    <HasAccess
      permission={['EMP_MGMT:ASSIGN']}
      orgId={orgId}
      yes={() => (
        <>
          <div className="row no-gutters">
            <div className="col-5 px-0">
              <label className={styles.defaultLabel}>
                {'contractor default location '}
                <span className={styles.requiredStar}>*</span>
              </label>
              <SingleTagSearchField
                placeholder="search location"
                name="contractorDefaultLocation"
                orgId={orgId}
                category="geographical"
                tags={contractorDefaultLocation}
                updateTag={(value, action) => handleDefaultTags(value, action, 'geographical')}
                saveOnlyTagName
                searchBar={styles.searchBar}
                disabled={disable}
              />
            </div>

            <div className="col-5 px-0" style={{ marginLeft: '5rem' }}>
              <label className={styles.defaultLabel}>
                {'contractor default role '}
                <span className={styles.requiredStar}>*</span>
              </label>
              <SingleTagSearchField
                placeholder="search role"
                name="contractorDefaultRole"
                orgId={orgId}
                category="functional"
                tags={contractorDefaultRole}
                updateTag={(value, action) => handleDefaultTags(value, action, 'functional')}
                searchBar={styles.searchBar}
                disabled={disable}
                type="role"
                required
              />
            </div>
          </div>

          <TagSearchField
            name="location"
            labelText={styles.labelText}
            className="col-12"
            label="contractor other locations"
            placeholder="start searching location here"
            orgId={orgId}
            category="geographical"
            tags={location}
            disabled={disable}
            disableTags={formData.tags}
            required
            updateTag={(value, action) => onChange(value, 'tags', action)}
          />

          <TagSearchField
            name="role"
            labelText={styles.labelText}
            className="col-12"
            label="contractor other roles"
            placeholder="start searching role here"
            orgId={orgId}
            category="functional"
            type="role"
            tags={roles}
            disabled={disable}
            disableTags={formData.tags}
            updateTag={(value, action) => onChange(value, 'tags', action)}
          />

          {/* <TagSearchField
            name="custom"
            labelText={styles.labelText}
            className="col-12"
            label="contractor custom tags"
            placeholder="start searching custom tags"
            orgId={orgId}
            category="custom"
            tags={custom}
            disabled={disable}
            disableTags={formData.tags}
            updateTag={(value, action) => onChange(value, 'tags', action)}
          /> */}
        </>
      )}
    />
  </>
);

export default Contractor;
