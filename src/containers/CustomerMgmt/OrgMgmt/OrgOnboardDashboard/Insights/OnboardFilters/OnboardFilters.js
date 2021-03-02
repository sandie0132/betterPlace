import React, { Component } from "react";
import { withRouter } from "react-router";
import _ from "lodash";
import cx from 'classnames';

import styles from "./OnboardFilters.module.scss";
import reset from "../../../../../../assets/icons/resetBlue.svg";
import TagSearchField from "../../../../../TagSearch/TagSearchField/TagSearchField";
import DropDownSmall from "../../../../../../components/Atom/SmallDropDown/SmallDropDown";
import { Button } from 'react-crux';
import CancelButton from '../../../../../../components/Molecule/CancelButton/CancelButton';


const initState = {
    roleTags: [],
    geoTags: [],
    ageGroup: "",
    gender: "",
    migrationStatus: "",
    maritalStatus: ""
}

class OnboardFilters extends Component {

    state = _.cloneDeep(initState)

    componentDidMount(){
        this.handlePropsToState();
    }

    handlePropsToState = () => {
        if (_.isEmpty(this.props.filters)){
            this.setState(_.cloneDeep(initState))
        }else{
            this.setState(_.cloneDeep(this.props.filters))
        }
    }

    handleTagChange = (event, inputIdentifier, action) => {
        let updatedRoles = _.cloneDeep(this.state.roleTags);
        let updatedLocation = _.cloneDeep(this.state.geoTags);
        
        if (inputIdentifier === "geoTags") {
            if (action === "add") {
                updatedLocation.push(event.value);
            } 
            else {
                updatedLocation = this.handleDeleteInTags(updatedLocation, event.value);    
            }
        } else {
            if (action === "add") {
                updatedRoles.push(event.value);
            } else {
                updatedRoles = this.handleDeleteInTags(updatedRoles, event.value);
            }
        }
        this.setState({
            roleTags: updatedRoles,
            geoTags: updatedLocation
        });
    }

    handleDeleteInTags = (tagList, targetTag) => {
        return (
            tagList.filter(tag => tag.uuid !== targetTag.uuid)
        )
    }

    handleDropDownSelect = (value, filter) => {
        this.setState({
            [filter]: value
        })
    }

    handleSendDataToParent = () => {
        this.props.onChange(this.state);
    }

    handleReset = () => {
        this.setState(_.cloneDeep(initState))
    }

    render() {
        return (
            <React.Fragment>
                <div className={styles.filterCard}>
                    <TagSearchField
                        name="location"
                        placeholder={'select or search locations'}
                        orgId={this.props.orgId}
                        category={"geographical"}
                        tags={this.state.geoTags}
                        dropdownMenu={styles.TagDropdownMenu}
                        BarStyle={styles.tagSearch}
                        updateTag={(value, action) => this.handleTagChange(value, 'geoTags', action)}
                        className={styles.placeholderText}
                    />
                    <div className="mt-4">
                        <TagSearchField
                            name="function"
                            placeholder={'select or search roles'}
                            orgId={this.props.orgId}
                            category={"functional"}
                            type="role"
                            tags={this.state.roleTags}
                            dropdownMenu={styles.TagDropdownMenu}
                            BarStyle={styles.tagSearch}
                            updateTag={(value, action) => this.handleTagChange(value, 'roleTags', action)}
                            className={styles.placeholderText}
                        />
                    </div>
                    <div className="d-flex mt-4">
                        <DropDownSmall
                            Options={[
                                { "option": "", "optionLabel": "select gender" },
                                { "option": "MALE", "optionLabel": "male" },
                                { "option": "FEMALE", "optionLabel": "female" },
                                { "option": "OTHER", "optionLabel": "other" }
                            ]}
                            changed={(value) => this.handleDropDownSelect(value, "gender")}
                            value={this.state.gender}
                            defaultColor={cx(this.state.gender === "" ? styles.defaultColor : null, styles.optionDropdown)}
                            dropdownMenu={styles.dropdownMenu}
                            placeholder="select gender"
                        />
                        <DropDownSmall
                            Options={[
                                { "option": "", "optionLabel": "select age group" },
                                { "option": "20-25", "optionLabel": "20-25 years" },
                                { "option": "26-30", "optionLabel": "26-30 years" },
                                { "option": "31-35", "optionLabel": "31-35 years" },
                                { "option": "36-40", "optionLabel": "36-40 years" },
                                { "option": "41-45", "optionLabel": "41-45 years" },
                                { "option": "46-50", "optionLabel": "46-50 years" },
                                { "option": "51-55", "optionLabel": "51-55 years" },
                                { "option": "56-60", "optionLabel": "56-60 years" },
                                { "option": "61-65", "optionLabel": "61-65 years" },
                                { "option": "66-70", "optionLabel": "66-70 years" },
                                { "option": "71-75", "optionLabel": "71-75 years" },
                                { "option": "76-80", "optionLabel": "76-80 years" },
                                { "option": "81-85", "optionLabel": "81-85 years" },
                                { "option": "86-90", "optionLabel": "86-90 years" },
                                { "option": "91-95", "optionLabel": "91-95 years" },
                                { "option": "96-100", "optionLabel": "96-100 years" },
                            ]}
                            changed={(value) => this.handleDropDownSelect(value, "ageGroup")}
                            value={this.state.ageGroup}
                            defaultColor={cx(this.state.ageGroup === "" ? styles.defaultColor : null, styles.optionDropdown)}
                            dropdownMenu={styles.dropdownMenu}
                            placeholder="select age group"
                            className="ml-4"
                        />
                    </div>
                    <div className="d-flex mt-4">
                        <DropDownSmall
                            Options={[
                                { "option": "", "optionLabel": "migrated/local" },
                                { "option": "MIGRATED", "optionLabel": "migrated" },
                                { "option": "LOCAL", "optionLabel": "local" }
                            ]}
                            changed={(value) => this.handleDropDownSelect(value, "migrationStatus")}
                            value={this.state.migrationStatus}
                            defaultColor={cx(this.state.migrationStatus === "" ? styles.defaultColor : null, styles.optionDropdown)}
                            dropdownMenu={styles.dropdownMenu}
                            placeholder="migrated/local"
                        />
                        <DropDownSmall
                            Options={[
                                { "option": "", "optionLabel": "marital status" },
                                { "option": "SINGLE", "optionLabel": "single" },
                                { "option": "MARRIED", "optionLabel": "married" }
                            ]}
                            changed={(value) => this.handleDropDownSelect(value, "maritalStatus")}
                            value={this.state.maritalStatus}
                            defaultColor={cx(this.state.maritalStatus === "" ? styles.defaultColor : null, styles.optionDropdown)}
                            dropdownMenu={styles.dropdownMenu}
                            placeholder="marital status"
                            className="ml-4"
                        />
                    </div>
                    <div className="d-flex mt-4">
                        <div className="my-auto" onClick={()=>this.handleReset()} style={{cursor:'pointer'}}>
                            <img src={reset} alt="reset" className="mr-2" /><span className={styles.filterText}>reset filter</span>
                        </div>
                        <div className="d-flex ml-auto">
                            <CancelButton label="cancel" clickHandler={() => this.props.closeFilters()}/>
                            <Button label="apply" type="save" clickHandler={() => this.handleSendDataToParent()}/>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
export default withRouter(OnboardFilters);