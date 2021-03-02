import React from "react";
import _ from 'lodash';
import CustomSelect from "../../../../../../components/Atom/CustomSelect/CustomSelect";
import {Input, Datepicker} from 'react-crux';
import TagSearchField from '../../../../../TagSearch/TagSearchField/TagSearchField';
// import HasAccess from '../../../../../../services/HasAccess/HasAccess';
import cx from 'classnames';
import styles from './Business.module.scss';
import SingleTagSearchField from "../../../../../TagSearch/SingleTagSearch/SingleTagSearch";


const BusinessAssociate = (props) => {
    return (
        <React.Fragment>
            <div className='row no-gutters'>
                <Input
                    name="businessAssociateId"
                    className="col-4 pr-3"
                    label={"business associate id"}
                    type="text"
                    placeholder={"business associate id"}
                    disabled={props.disable}
                    value={props.data.employeeId}
                    onChange={event => props.onChange(event, "employeeId")}
                    onError={(error) => props.handleError(error, 'employeeId')}
                    validation={props.validation['employeeId']}
                    message={props.message['employeeId']}
                    errors={props.errors['employeeId']}
                    required={_.includes(props.requiredFields, 'employeeId')}

                //onErrorCheck={(errorCheck) => props.onErrorCheck(errorCheck)}
                />

                <CustomSelect
                    name='status'
                    label={'status'}
                    className={cx('col-4', styles.DropDownPadding)}
                    options={props.empStatusOptions}
                    value={props.data.status}
                    disabled={props.disable}
                    required={_.includes(props.requiredFields, 'status')}
                    onChange={value => props.onChange(value, "status")}
                />

            </div>

            <div className='row no-gutters'>
                <Datepicker
                    name="joiningDate"
                    className="col-4 pr-3"
                    label={"joining date"}
                    disabled={props.disable}
                    required={_.includes(props.requiredFields, 'joiningDate')}
                    value={props.data.joiningDate}
                    errors={props.errors['joiningDate']}
                    validation={props.validation['joiningDate']}
                    message={props.message['joiningDate']}
                    onChange={event => props.onChange(event, "joiningDate")}
                    onError={(error) => props.handleError(error, 'joiningDate')}
                />

                <Input
                    name="kitNumber"
                    className="col-4"
                    label={"kit number"}
                    type="text"
                    placeholder={"kit number"}
                    disabled={props.disable}
                    value={props.data.kitNumber}
                    onChange={event => props.onChange(event, "kitNumber")}
                    validation={props.validation['kitNumber']}
                    message={props.message['kitNumber']}
                    onError={(error) => props.handleError(error, 'kitNumber')}
                    errors={props.errors['kitNumber']}
                    required={_.includes(props.requiredFields, 'kitNumber')}
                //onErrorCheck={(errorCheck) => props.onErrorCheck(errorCheck)}
                />

            </div>
            <hr className={cx(styles.HorizontalLine)} />

            <div className='row no-gutters'>
                <div className='col-5 px-0'>
                    <label className={styles.defaultLabel}>{'default location '}
                        <span className={styles.requiredStar}>*</span></label>

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

                <div className='col-5 px-0' style={{ marginLeft: '5rem' }}>
                    <label className={styles.defaultLabel}>{'default role '}
                        <span className={styles.requiredStar}>*</span></label>
                    <SingleTagSearchField
                        placeholder="search role"
                        name="defaultRole"
                        orgId={props.orgId}
                        category='functional'
                        tags={props.defaultRole}
                        updateTag={(value, action) => props.handleDefaultTags(value, action, "functional")}
                        searchBar={styles.searchBar}
                        disabled={props.disable}
                        type="role"
                        required
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
                disableTags={props.data.tags}
                tags={props.location}
                disabled={props.disable}
                updateTag={(value, action) => props.onChange(value, 'tags', action)}
            />

            <TagSearchField
                name="role"
                labelText={styles.labelText}
                className='col-12'
                label={"other roles"}
                placeholder={"start searching role here"}
                orgId={props.orgId}
                category='functional'
                disableTags={props.data.tags}
                type='role'
                tags={props.roles}
                disabled={props.disable}
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

export default BusinessAssociate;