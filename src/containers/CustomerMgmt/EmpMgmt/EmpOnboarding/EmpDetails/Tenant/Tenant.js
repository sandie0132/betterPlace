import React from "react";
import _ from 'lodash';
// import CustomSelect from "../../../../../../components/Atom/CustomSelect/CustomSelect";
import {Input, Datepicker} from 'react-crux';
import TagSearchField from '../../../../../TagSearch/TagSearchField/TagSearchField';
// import HasAccess from '../../../../../../services/HasAccess/HasAccess';
import cx from 'classnames';
import styles from './Tenant.module.scss';
import SingleTagSearchField from "../../../../../TagSearch/SingleTagSearch/SingleTagSearch";

const Tenant = (props) =>{
    return(
        <React.Fragment>
        <div className="row no-gutters">
          <Input
            name="tenantId"
            className="col-4 pr-3"
            label={"tenant id"}
            type="text"
            placeholder={"tenant id"}
            disabled={props.disable}
            value={props.data.employeeId}
            onChange={event => props.onChange(event, "employeeId")}
            onError={(error) => props.handleError(error, 'employeeId')}
            validation={props.validation['employeeId']}
            message={props.message['employeeId']}
            errors={props.errors['employeeId']}
            required={_.includes(props.requiredFields, 'employeeId')}
          //  onErrorCheck={(errorCheck) => props.onErrorCheck(errorCheck)}
          />
          <Datepicker
            name="moveInDate"
            className="col-4 pr-3"
            label={"move in date"}
            type="text"
            placeholder={"DD-MM-YYYY"}
            disabled={props.disable}
            value={props.data.moveInDate}
            onChange={event => props.onChange(event, "moveInDate")}
            validation={props.validation['moveInDate']}
            message={props.message['moveInDate']}
            onError={(error) => props.handleError(error, 'moveInDate')}
            errors={props.errors['moveInDate']}
            required={_.includes(props.requiredFields, 'moveInDate')}
          // onErrorCheck={(errorCheck) => props.onErrorCheck(errorCheck)}
          />
          <Datepicker
            name="moveOutDate"
            className="col-4"
            label={"move out date"}
            disabled={props.disable}
            required={_.includes(props.requiredFields, 'moveOutDate')}
            value={props.data.moveOutDate}
            validation={props.validation['moveOutDate']}
            message={props.message['moveOutDate']}
            errors={props.errors['moveOutDate']}
            onChange={event => props.onChange(event, "moveOutDate")}
            onError={(error) => props.handleError(error, 'moveOutDate')}
          />
        </div>

        <hr className={cx(styles.HorizontalLine)} />

        <div className='row no-gutters'>
          <div className='col-5 px-0'>
            <label className={styles.defaultLabel}>{'default location '}
              <span className={styles.requiredStar}>*</span>
            </label>

            <SingleTagSearchField
              placeholder="search location"
              name="defaultLocation"
              orgId={props.orgId}
              category='geographical'
              tags={props.defaultLocation}
              updateTag={(value, action) => props.handleDefaultTags(value, action, "geographical")}
              saveOnlyTagName
              searchBar={styles.searchBar}
              disabled={props.disable}
            />
          </div>
        </div>

        <TagSearchField
          name="location"
          labelText={styles.labelText}
          className='col-12'
          label={"other locations"}
          placeholder={"start searching location here"}
          orgId={props.orgId}
          category='geographical'
          tags={props.location}
          disabled={props.disable}
          disableTags={props.data.tags}
          required
          updateTag={(value, action) => props.onChange(value, 'tags', action)}
        />

        <TagSearchField
          name="custom"
          labelText={styles.labelText}
          className='col-12'
          label={"custom tags"}
          placeholder={"start searching custom tags"}
          orgId={props.orgId}
          category='custom'
          tags={props.custom}
          disabled={props.disable}
          disableTags={props.data.tags}
          updateTag={(value, action) => props.onChange(value, 'tags', action)}
        />

      </React.Fragment>
    )
}

export default Tenant;