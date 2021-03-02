import React, { Component } from 'react';
import _ from 'lodash';
import cx from 'classnames';

import { empSkillPrefInitData, languageInitData } from "./EmpSkillPrefLanguageInitData";
import styles from "./EmpSkillPrefLanguage.module.scss";
import TagWithInput from '../../../../../../components/Organism/TagWithInput/TagWithInput';
import CustomSelect from '../../../../../../components/Atom/CustomSelect/CustomSelect';
import CheckBox from '../../../../../../components/Atom/CheckBox/CheckBox';
import addMore from '../../../../../../assets/icons/addMore.svg';
import DeleteButton from '../../../../../../components/Molecule/DeleteButton/DeleteButton';


class EmpSkillPrefLanguage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            formData: {
                ...empSkillPrefInitData
            },
            languageInit: {
                ...languageInitData
            },

            errors: {},
            isEdited: false,
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(prevProps.data, this.props.data) & !this.state.isEdited) {
            this.handlePropsToState();
        }

        if (!_.isEqual(prevProps.errors, this.props.errors)) {
            if (!_.isEqual(this.props.errors, this.state.errors)) {
                let updatedErrors = {};
                if (this.props.isEdited) {
                    updatedErrors = _.assign({}, this.props.errors, this.state.errors);
                }
                this.setState({
                    errors: updatedErrors
                });
            }
        }

        if (prevProps.isEdited !== this.props.isEdited) {
            if (!this.props.isEdited) {
                this.handlePropsToState();
            }
        }

        // if (!_.isEqual(prevState.formData, this.state.formData) & this.state.isEdited) {
        //     this.handleSendDataToParent();
        // }

        if (!_.isEqual(prevState.errors, this.state.errors)) {
            this.props.onError(this.state.errors)
        }

    }


    handlePropsToState = () => {
        let updatedFormData = {
            ...empSkillPrefInitData
        }
        if (!_.isEmpty(this.props.data["skills"])) {
            updatedFormData["skills"] = _.cloneDeep(this.props.data["skills"]);
        }
        if (!_.isEmpty(this.props.data["preferences"])) {
            updatedFormData["preferences"] = _.cloneDeep(this.props.data["preferences"]);
        }
        if (!_.isEmpty(this.props.data["languages"])) {
            updatedFormData["languages"] = _.cloneDeep(this.props.data["languages"]);
        }
        this.setState({
            formData: updatedFormData,
            isEdited: false
        })
    }

    handleSendDataToParent = () => {
        let payload = {};
        _.forEach(this.state.formData, function (value, field) {
            if (!_.isEmpty(value)) {
                if (field === 'languages') {
                    payload['languages'] = [];
                    _.forEach(value, function (language) {
                        if (!_.isEmpty(language['language'])) {
                            payload['languages'].push(language)
                        }
                    })
                } else {
                    payload[field] = value
                }
            } else {
                payload[field] = null
            }
        });
        if (_.isEmpty(payload)) {
            this.props.onChange(null);
        } else {
            this.props.onChange(payload);
        }
    }

    debouncedDataToParent = _.debounce(this.handleSendDataToParent, 700, {leading:true})


    handleInputChange = (event, value) => {
        let updatedSkills = _.cloneDeep(this.state.formData)
        if (value === 'skills') {
            updatedSkills['skills'] = event.value
        } else {
            updatedSkills['preferences'] = event.value
        }
        this.setState({
            formData: updatedSkills,
            isEdited: true
        },()=> this.debouncedDataToParent());
    };

    handleAddNewLanguageData = () => {
        let newData = {
            ...languageInitData
        }
        let updatedDataList = _.cloneDeep(this.state.formData);
        updatedDataList["languages"] = [
            newData,
            ...updatedDataList["languages"].slice(0)
        ];
        this.setState({
            formData: updatedDataList,
            isEdited: true
        }, ()=> this.debouncedDataToParent());
    }

    handleDeleteLanguageData = (targetIndex) => {
        let updatedArray = _.cloneDeep(this.state.formData);
        updatedArray["languages"].slice();
        updatedArray["languages"].splice(targetIndex, 1);
        this.setState({
            formData: updatedArray,
            isEdited: true
        },()=> this.debouncedDataToParent())
    }

    handleLanguageOptions = (event, inputIdentifier, targetIndex) => {
        let updatedDataList = _.cloneDeep(this.state.formData);
        if (inputIdentifier === 'motherTongue') {
            updatedDataList["languages"] = updatedDataList["languages"].map((item, index) => {
                if (targetIndex !== index) {
                    item['motherTongue'] = false;
                }
                return (item)
            })
        }
        updatedDataList["languages"] = updatedDataList["languages"].map((item, index) => {
            if (index === targetIndex) {
                if (inputIdentifier === 'language') {
                    if (event) {
                        if (item[inputIdentifier] !== event) {
                            item['speak'] = false;
                            item['write'] = false;
                            item['read'] = false;
                            item['motherTongue'] = false;
                        }
                        item[inputIdentifier] = event;
                        return (item)
                    }
                }
                else {
                    return {
                        ...item,
                        [inputIdentifier]: event ? (event.target ? event.target.value : event) :
                            !item[inputIdentifier]
                    }
                }
            }
            return (item);
        });
        this.setState({ formData: updatedDataList, isEdited: true },()=>this.debouncedDataToParent());
    }

    render() {
        let empLanguage = {};
        if (this.props.staticData) {
            empLanguage = this.props.staticData["EMP_MGMT_LANGUAGES_KNOWN"].filter(language => {
                return !this.state.formData["languages"].some(item => item.language === language.value)
            })
        }

        let selectedLanguages = [];
        if (!_.isEmpty(this.state.formData["languages"])) {
            _.forEach(this.state.formData["languages"], function (lang) {
                if (!_.isEmpty(lang.language)) selectedLanguages.push(lang.language)
            })
        }

        let filterOptionsBy = { value: [] };
        _.forEach(this.props.staticData["EMP_MGMT_LANGUAGES_KNOWN"], function (option) {
            if (!_.includes(selectedLanguages, option.value)) filterOptionsBy['value'].push(option.value)
        })

        return (
            <div className={styles.formLayout}>
                <div className={cx("mb-4", this.props.isActive ? styles.opacityHeadIn : styles.opacityHeadOut)}>

                    <div className={styles.horizontalLineInactive}></div>
                    <span className={styles.formHead}>skills &amp; preference</span>
                </div>

                <div className="mt-1">
                    <div>
                        <div className={styles.formSubHead}>
                            skills
                    </div>
                        <TagWithInput
                            name="skills"
                            label={"add skills"}
                            placeholder="skill (ex: driver)"
                            suggestions={[]}
                            onNewTag={(tagArray) => this.handleInputChange(tagArray, "skills")}
                            value={this.state.formData["skills"]}
                        />
                    </div>

                    <div className={styles.horizontalLine} />

                    <div className="mt-3">
                        <div className={styles.formSubHead}>
                            preferences
                        </div>
                        <TagWithInput
                            name="preferences"
                            label={"add preferences"}
                            placeholder="preferences (ex: delivery partner)"
                            suggestions={[]}
                            onNewTag={(tagArray) => this.handleInputChange(tagArray, "preferences")}
                            value={this.state.formData["preferences"]}
                        />
                    </div>

                    <div className={styles.horizontalLine} />
                    <div className={styles.formSubHead}>
                        languages
                    </div>

                    {empLanguage.length > 1 ?
                        <div className='pt-4 pb-2'>
                            <span onClick={this.handleAddNewLanguageData} className={styles.addHeading}>
                                <small>add language</small>&nbsp;<img src={addMore} alt="add more" />
                            </span>
                        </div>
                        :
                        null
                    }
                    {this.state.formData["languages"].map((item, index) => {
                        return (
                            <div className="d-flex" key={index} >
                                <CustomSelect
                                    name='language'
                                    className="col-4 pt-2 my-1"
                                    required
                                    label="language"
                                    options={this.props.staticData["EMP_MGMT_LANGUAGES_KNOWN"]}
                                    filterOptionsBy={filterOptionsBy}
                                    value={item.language}
                                    onChange={(event) => this.handleLanguageOptions(event, 'language', index)}
                                />
                                <div className="mr-3 mt-2 pt-2 ml-4">
                                    <div className={styles.labelStyle}>speak</div>
                                    <CheckBox
                                        type="medium"
                                        name="speak"
                                        className={cx("mt-3", styles.alignLabel10px)}
                                        disabled={_.isEmpty(item.language)}
                                        value={item.speak}
                                        onChange={() => this.handleLanguageOptions(null, 'speak', index)}
                                    />
                                </div>
                                <div className="mr-3 mt-2 pt-2">
                                    <div className={styles.labelStyle}>write</div>
                                    <CheckBox
                                        type="medium"
                                        name="write"
                                        className={cx("mt-3", styles.alignLabel6px)}
                                        disabled={_.isEmpty(item.language)}
                                        value={item.write}
                                        onChange={() => this.handleLanguageOptions(null, 'write', index)}
                                    />
                                </div>
                                <div className="mr-3 mt-2 pt-2">
                                    <div className={styles.labelStyle}>read</div>
                                    <CheckBox
                                        type="medium"
                                        name="read"
                                        className={cx("mt-3", styles.alignLabel6px)}
                                        disabled={_.isEmpty(item.language)}
                                        value={item.read}
                                        onChange={() => this.handleLanguageOptions(null, 'read', index)}
                                    />
                                </div>
                                <div className="mr-3 mt-2 pt-2">
                                    <div className={styles.labelStyle}>mother tongue</div>
                                    <CheckBox
                                        type="medium"
                                        name="motherTongue"
                                        className={cx("mt-3", styles.alignLabel32px)}
                                        disabled={_.isEmpty(item.language)}
                                        value={item.motherTongue}
                                        onChange={() => this.handleLanguageOptions(null, 'motherTongue', index)}
                                    />
                                </div>
                                {this.state.formData["languages"].length > 0 ?

                                    <div className='ml-auto'>
                                        <DeleteButton
                                            label={'delete'}
                                            isDeleteIconRequired={true}
                                            clickHandler={() => this.handleDeleteLanguageData(index)}
                                            className={"mt-4 pt-2 "}
                                            isDisabled={!this.props.isActive}
                                        />

                                    </div>
                                    : null
                                }
                            </div>
                        )
                    })
                    }
                </div>
            </div>
        )
    }
}


export default EmpSkillPrefLanguage;