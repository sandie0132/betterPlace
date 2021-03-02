import React from "react";
import _ from 'lodash';
import CustomSelect from "../../../../../../components/Atom/CustomSelect/CustomSelect";
import {Input, Datepicker} from 'react-crux';
import TagSearchField from '../../../../../TagSearch/TagSearchField/TagSearchField';
import HasAccess from '../../../../../../services/HasAccess/HasAccess';
import cx from 'classnames';
import styles from './Employee.module.scss';
import SingleTagSearchField from "../../../../../TagSearch/SingleTagSearch/SingleTagSearch";

const Employee = (props) => {

    return (

        <React.Fragment>
            <div className="row">
                <CustomSelect
                    name="employeeType"
                    className="my-1 col-4 py-2"
                    required={_.includes(props.requiredFields, 'employeeType')}
                    label={'employee type'}
                    disabled={props.disable}
                    options={props.empTypeOptions}
                    value={props.data.employeeType}
                    onChange={value => props.onChange(value, "employeeType")}

                />
                <Input
                    name="employeeId"
                    className="col-4"
                    label={"employee id"}
                    type="text"
                    placeholder={" employee id"}
                    disabled={props.disable}
                    value={props.data.employeeId}
                    onChange={event => props.onChange(event, "employeeId")}
                    onError={(error) => props.handleError(error, 'employeeId')}
                    validation={props.validation['employeeId']}
                    message={props.message['employeeId']}
                    errors={props.errors['employeeId']}
                    required={_.includes(props.requiredFields, 'employeeId')}
                />
                <CustomSelect
                    name="status"
                    className="my-1 col-4 py-2"
                    required={_.includes(props.requiredFields, 'status')}
                    label={'status'}
                    disabled={props.disable}
                    options={props.empStatusOptions}
                    value={props.data.status}
                    onChange={value => props.onChange(value, "status")}
                />
            </div>
            <div className="row no-gutters">
                <Datepicker
                    name="empJoiningDate"
                    className="col-4 pr-3"
                    label={'joining date'}
                    required={_.includes(props.requiredFields, 'joiningDate')}
                    disabled={props.disable}
                    value={props.data.joiningDate}
                    errors={props.errors['empJoiningDate']}
                    validation={props.validation['empJoiningDate']}
                    message={props.message['empJoiningDate']}
                    onChange={value => props.onChange(value, "joiningDate")}
                    onError={(error) => props.handleError(error, 'empJoiningDate')}
                />
            </div>

            <hr className={cx(styles.HorizontalLine)} />

            <HasAccess
                permission={["EMP_MGMT:ASSIGN"]}
                orgId={props.orgId}
                yes={() =>
                    <React.Fragment>

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
                            tags={props.location}
                            disabled={props.disable}
                            disableTags={props.data.tags}
                            required
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
                            type='role'
                            tags={props.roles}
                            disabled={props.disable}
                            disableTags={props.data.tags}
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
                }
            />
        </React.Fragment>

    )

}

export default Employee;