import React, { Component } from "react";
import cx from 'classnames';
import { connect } from 'react-redux';
import styles from './VerifyLink.module.scss';
import _ from 'lodash';
import * as actions from '../Store/action';


class VerifyInfo extends Component {
    state = {
        educationData: {},
        employmentData: {},
        type: '',
        submitData: {},
        enableSubmit: false
    }

    componentDidMount = () => {
        // console.log('type in verify', this.props.type);
        if (!_.isEmpty(this.props.type)) {
            this.setState({ type: this.props.type })
        }
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.type !== prevProps.type && !_.isEmpty(this.props.type)) {
            this.setState({ type: this.props.type })
        }
    }

    handleRadioButtonInput = (fieldName, value) => {
        let typeData = _.cloneDeep(this.state.submitData);
        let enableSubmit = this.state.enableSubmit;
        typeData[fieldName] = value;
        if (fieldName === 'isWorked' || fieldName === 'isQualificationTrue') {
            enableSubmit = true;
        }
        this.setState({ submitData: typeData, enableSubmit: enableSubmit })
    }

    handleRadioButtonChecked = (fieldName, value) => {
        let typeData = _.cloneDeep(this.state.submitData);
        if (!_.isEmpty(typeData[fieldName])) {
            if (typeData[fieldName] === value) {
                return true;
            }
        }
        return false;
    }

    radioButtonStyle = (fieldName, value) => {
        let typeData = _.cloneDeep(this.state.submitData)
        if (!_.isEmpty(typeData[fieldName])) {
            if (typeData[fieldName] === value) {
                return (cx(styles.RadioButtonContainer, styles.RadioButtonActiveContainer, styles.checkBoxText, styles.smallRadioWidth))
            }
        }
        return (cx(styles.RadioButtonContainer, styles.checkBoxText, styles.smallRadioWidth))
    }

    radioButtonTextStyle = (fieldName, value) => {
        let typeData = _.cloneDeep(this.state.submitData)
        if (!_.isEmpty(typeData[fieldName])) {
            if (typeData[fieldName] === value) {
                return (styles.LabelActive)
            }
        }
        return (styles.LabelDisabled)
    }

    handleTextArea = (event) => {
        let textData = _.cloneDeep(this.state.submitData);
        let inputValue = !_.isEmpty(event.target.value) ? event.target.value : event.value;
        if (!_.isEmpty(inputValue)) {
            textData['comments'] = [inputValue];
        }
        else {
            textData['comments'] = [];
        }
        this.setState({ submitData: textData })
    }

    handleShowDate = (date) => {
        let updatedDate = '';
        if (!_.isEmpty(date)) {
            updatedDate = date.split("-");
            updatedDate = updatedDate[2] + '.' + updatedDate[1] + "." + updatedDate[0]
        }
        return updatedDate;
    }

    handleSubmitData = () => {
        let result = _.cloneDeep(this.state.submitData);
        result.type = this.props.data.service;
        if ((this.state.type === 'employment' && this.state.submitData.isWorked === 'yes') || (this.state.type === 'education' && this.state.submitData.isQualificationTrue === 'yes')) {
            result.verificationResult = "GREEN"
        }
        else { result.verificationResult = "RED" }
        result.attachments = [];
        result.manualReview = false;

        let submitData = {}
        submitData.result = result;
        let refId = window.location.href.split('=')[1];
        this.props.putRefIdDetails(refId, this.state.type, submitData)

    }


    render() {
        let educationOptions =
            <div className={cx(styles.infoCard, styles.cardPadding, styles.verifyContainer, "d-flex flex-column")}>

                <div className="d-flex flex-column">
                    <label className={styles.verifyLabel}>is the education qualification {"diploma"} in {"computer technologies"} ?</label>
                    <div className="d-flex flex-row mt-3">
                        <div
                            className={this.radioButtonStyle('isQualificationTrue', 'yes')} onClick={() => this.handleRadioButtonInput('isQualificationTrue', 'yes')}>
                            <span className={this.radioButtonTextStyle('isQualificationTrue', 'yes')}>{"yes"}</span>
                            <input className={styles.RadioButton} type='radio' disabled={false} name='isQualificationTrue' value="yes"
                                onChange={() => this.handleRadioButtonInput('isQualificationTrue', 'yes')} checked={this.handleRadioButtonChecked('isQualificationTrue', 'yes')} />
                        </div>

                        <div
                            className={cx(this.radioButtonStyle('isQualificationTrue', 'no'), "ml-1")} onClick={() => this.handleRadioButtonInput('isQualificationTrue', 'no')}>
                            <span className={this.radioButtonTextStyle('isQualificationTrue', 'no')}>{"no"}</span>
                            <input className={styles.RadioButton} type='radio' disabled={false} name='isQualificationTrue' value="no"
                                onChange={() => this.handleRadioButtonInput('isQualificationTrue', 'no')} checked={this.handleRadioButtonChecked('isQualificationTrue', 'no')} />

                        </div>

                    </div>
                </div>


                <div className="d-flex flex-column mt-5">
                    <label className={styles.verifyLabel}>is education from {"ramayan educational institutions"}</label>
                    <div className="d-flex flex-row mt-3">
                        <div
                            className={this.radioButtonStyle('isSchoolTrue', 'yes')} onClick={() => this.handleRadioButtonInput('isSchoolTrue', 'yes')}>
                            <span className={this.radioButtonTextStyle('isSchoolTrue', 'yes')}>{"yes"}</span>
                            <input className={styles.RadioButton} type='radio' disabled={false} name='isSchoolTrue' value="yes"
                                onChange={() => this.handleRadioButtonInput('isSchoolTrue', 'yes')} checked={this.handleRadioButtonChecked('isSchoolTrue', 'yes')} />
                        </div>

                        <div
                            className={cx(this.radioButtonStyle('isSchoolTrue', 'no'), "ml-1")} onClick={() => this.handleRadioButtonInput('isSchoolTrue', 'no')}>
                            <span className={this.radioButtonTextStyle('isSchoolTrue', 'no')}>{"no"}</span>
                            <input className={styles.RadioButton} type='radio' disabled={false} name='isSchoolTrue' value="no"
                                onChange={() => this.handleRadioButtonInput('isSchoolTrue', 'no')} checked={this.handleRadioButtonChecked('isSchoolTrue', 'no')} />

                        </div>


                    </div>
                </div>

                <div className="d-flex flex-column mt-5">
                    <label className={styles.verifyLabel}>is graduation year is {"2019"}</label>
                    <div className="d-flex flex-row mt-3">
                        <div
                            className={this.radioButtonStyle('isGraduationYearTrue', 'yes')} onClick={() => this.handleRadioButtonInput('isGraduationYearTrue', 'yes')}>
                            <span className={this.radioButtonTextStyle('isGraduationYearTrue', 'yes')}>{"yes"}</span>
                            <input className={styles.RadioButton} type='radio' disabled={false} name='isGraduationYearTrue'
                                onChange={() => this.handleRadioButtonInput('isWorkDurationTrue', 'yes')} checked={this.handleRadioButtonChecked('isGraduationYearTrue', 'yes')} />
                        </div>

                        <div
                            className={cx(this.radioButtonStyle('isGraduationYearTrue', 'no'), "ml-1")} onClick={() => this.handleRadioButtonInput('isGraduationYearTrue', 'no')}>
                            <span className={this.radioButtonTextStyle('isGraduationYearTrue', 'no')}>{"no"}</span>
                            <input className={styles.RadioButton} type='radio' disabled={false} name='isGraduationYearTrue'
                                onChange={() => this.handleRadioButtonInput('isGraduationYearTrue', 'no')} checked={this.handleRadioButtonChecked('isGraduationYearTrue', 'no')} />

                        </div>

                        <div
                            className={cx(this.radioButtonStyle('isGraduationYearTrue', 'maybe'), styles.largeRadioWidth, "ml-1")} onClick={() => this.handleRadioButtonInput('isGraduationYearTrue', 'maybe')}>
                            <span className={this.radioButtonTextStyle('isGraduationYearTrue', 'maybe')}>{"no details found"}</span>
                            <input className={styles.RadioButton} type='radio' disabled={false} name='isGraduationYearTrue'
                                onChange={() => this.handleRadioButtonInput('isGraduationYearTrue', 'maybe')} checked={this.handleRadioButtonChecked('isGraduationYearTrue', 'maybe')} />

                        </div>
                    </div>
                </div>

                <div className="d-flex flex-column mt-5">
                    <label className={styles.verifyLabel}>is start date is {"02.04.2017"}</label>
                    <div className="d-flex flex-row mt-3">
                        <div
                            className={this.radioButtonStyle('isStartDateTrue', 'yes')} onClick={() => this.handleRadioButtonInput('isStartDateTrue', 'yes')}>
                            <span className={this.radioButtonTextStyle('isStartDateTrue', 'yes')}>{"yes"}</span>
                            <input className={styles.RadioButton} type='radio' disabled={false} name='isStartDateTrue'
                                onChange={() => this.handleRadioButtonInput('isStartDateTrue', 'yes')} checked={this.handleRadioButtonChecked('isStartDateTrue', 'yes')} />
                        </div>

                        <div
                            className={cx(this.radioButtonStyle('isStartDateTrue', 'no'), "ml-1")} onClick={() => this.handleRadioButtonInput('isStartDateTrue', 'no')}>
                            <span className={this.radioButtonTextStyle('isStartDateTrue', 'no')}>{"no"}</span>
                            <input className={styles.RadioButton} type='radio' disabled={false} name='isStartDateTrue'
                                onChange={() => this.handleRadioButtonInput('isStartDateTrue', 'no')} checked={this.handleRadioButtonChecked('isStartDateTrue', 'no')} />

                        </div>

                        <div
                            className={cx(this.radioButtonStyle('isStartDateTrue', 'maybe'), styles.largeRadioWidth, "ml-1")} onClick={() => this.handleRadioButtonInput('isStartDateTrue', 'maybe')}>
                            <span className={this.radioButtonTextStyle('isStartDateTrue', 'maybe')}>{"no details found"}</span>
                            <input className={styles.RadioButton} type='radio' disabled={false} name='isStartDateTrue'
                                onChange={() => this.handleRadioButtonInput('isStartDateTrue', 'maybe')} checked={this.handleRadioButtonChecked('isStartDateTrue', 'maybe')} />

                        </div>
                    </div>
                </div>

                <div className="d-flex flex-column mt-5">
                    <label className={styles.verifyLabel}>is end date is {"01.01.2019"}</label>
                    <div className="d-flex flex-row mt-3">
                        <div
                            className={this.radioButtonStyle('isEndDateTrue', 'yes')} onClick={() => this.handleRadioButtonInput('isEndDateTrue', 'yes')}>
                            <span className={this.radioButtonTextStyle('isEndDateTrue', 'yes')}>{"yes"}</span>
                            <input className={styles.RadioButton} type='radio' disabled={false} name='isEndDateTrue'
                                onChange={() => this.handleRadioButtonInput('isEndDateTrue', 'yes')} checked={this.handleRadioButtonChecked('isEndDateTrue', 'yes')} />
                        </div>

                        <div
                            className={cx(this.radioButtonStyle('isEndDateTrue', 'no'), "ml-1")} onClick={() => this.handleRadioButtonInput('isEndDateTrue', 'no')}>
                            <span className={this.radioButtonTextStyle('isEndDateTrue', 'no')}>{"no"}</span>
                            <input className={styles.RadioButton} type='radio' disabled={false} name='isEndDateTrue'
                                onChange={() => this.handleRadioButtonInput('isEndDateTrue', 'no')} checked={this.handleRadioButtonChecked('isEndDateTrue', 'no')} />

                        </div>

                        <div
                            className={cx(this.radioButtonStyle('isEndDateTrue', 'maybe'), styles.largeRadioWidth, "ml-1")} onClick={() => this.handleRadioButtonInput('isEndDateTrue', 'maybe')}>
                            <span className={this.radioButtonTextStyle('isEndDateTrue', 'maybe')}>{"no details found"}</span>
                            <input className={styles.RadioButton} type='radio' disabled={false} name='isEndDateTrue'
                                onChange={() => this.handleRadioButtonInput('isEndDateTrue', 'maybe')} checked={this.handleRadioButtonChecked('isEndDateTrue', 'maybe')} />

                        </div>
                    </div>
                </div>

                <div className="d-flex flex-column mt-5">
                    <label className={styles.verifyLabel}>is marks/percentage - {"92 %"} ?</label>
                    <div className="d-flex flex-row mt-3">
                        <div
                            className={this.radioButtonStyle('isMarksTrue', 'yes')} onClick={() => this.handleRadioButtonInput('isMarksTrue', 'yes')}>
                            <span className={this.radioButtonTextStyle('isMarksTrue', 'yes')}>{"yes"}</span>
                            <input className={styles.RadioButton} type='radio' disabled={false} name='isMarksTrue'
                                onChange={() => this.handleRadioButtonInput('isMarksTrue', 'yes')} checked={this.handleRadioButtonChecked('isMarksTrue', 'yes')} />
                        </div>

                        <div
                            className={cx(this.radioButtonStyle('isMarksTrue', 'no'), "ml-1")} onClick={() => this.handleRadioButtonInput('isMarksTrue', 'no')}>
                            <span className={this.radioButtonTextStyle('isMarksTrue', 'no')}>{"no"}</span>
                            <input className={styles.RadioButton} type='radio' disabled={false} name='isMarksTrue'
                                onChange={() => this.handleRadioButtonInput('isMarksTrue', 'no')} checked={this.handleRadioButtonChecked('isMarksTrue', 'no')} />

                        </div>

                        <div
                            className={cx(this.radioButtonStyle('isMarksTrue', 'maybe'), styles.largeRadioWidth, "ml-1")} onClick={() => this.handleRadioButtonInput('isMarksTrue', 'maybe')}>
                            <span className={this.radioButtonTextStyle('isMarksTrue', 'maybe')}>{"no details found"}</span>
                            <input className={styles.RadioButton} type='radio' disabled={false} name='isMarksTrue'
                                onChange={() => this.handleRadioButtonInput('isMarksTrue', 'maybe')} checked={this.handleRadioButtonChecked('isMarksTrue', 'maybe')} />

                        </div>
                    </div>
                </div>

                <div className="d-flex flex-column mt-5">
                    <label className={styles.verifyLabel}>other comments</label>
                    <textarea
                        placeholder="write something here"
                        name="comments"
                        className={styles.verifyTextArea}
                        onChange={(e) => this.handleTextArea(e)}
                    />
                </div>

                <div className="mt-5">
                    <button
                        className={this.state.enableSubmit ? styles.ActiveButton : styles.DisabledButton}
                        onClick={this.handleSubmitData}
                        disabled={!this.state.enableSubmit}
                    >submit</button>
                </div>

            </div>

        let employmentOptions =
            <div className={cx(styles.infoCard, styles.cardPadding, styles.verifyContainer, "d-flex flex-column")}>

                <div className="d-flex flex-column">
                    <label className={styles.verifyLabel}>did {this.props.data.fullName}
                        {this.props.data.employment.employeeId ? <span className={styles.verifyLabel}> with emp id {this.props.data.employment.employeeId} </span> : " "}
                        worked in your organization ?</label>
                    <div className="d-flex flex-row mt-3">
                        <div
                            className={this.radioButtonStyle('isWorked', 'yes')} onClick={() => this.handleRadioButtonInput('isWorked', 'yes')}>
                            <span className={this.radioButtonTextStyle('isWorked', 'yes')}>{"yes"}</span>
                            <input className={styles.RadioButton} type='radio' disabled={false} name='isWorked' value="yes"
                                onChange={() => this.handleRadioButtonInput('isWorked', 'yes')} checked={this.handleRadioButtonChecked('isWorked', 'yes')} />
                        </div>

                        <div
                            className={cx(this.radioButtonStyle('isWorked', 'no'), "ml-1")} onClick={() => this.handleRadioButtonInput('isWorked', 'no')}>
                            <span className={this.radioButtonTextStyle('isWorked', 'no')}>{"no"}</span>
                            <input className={styles.RadioButton} type='radio' disabled={false} name='isWorked' value="no"
                                onChange={() => this.handleRadioButtonInput('isWorked', 'no')} checked={this.handleRadioButtonChecked('isWorked', 'no')} />

                        </div>

                    </div>
                </div>

                {!_.isEmpty(this.props.data.employment.designation) ?
                    <div className="d-flex flex-column mt-5">
                        <label className={styles.verifyLabel}>was {this.props.data.fullName} {this.props.data.employment.designation} there ?</label>
                        <div className="d-flex flex-row mt-3">
                            <div
                                className={this.radioButtonStyle('isDesignationTrue', 'yes')} onClick={() => this.handleRadioButtonInput('isDesignationTrue', 'yes')}>
                                <span className={this.radioButtonTextStyle('isDesignationTrue', 'yes')}>{"yes"}</span>
                                <input className={styles.RadioButton} type='radio' disabled={false} name='isDesignationTrue' value="yes"
                                    onChange={() => this.handleRadioButtonInput('isDesignationTrue', 'yes')} checked={this.handleRadioButtonChecked('isDesignationTrue', 'yes')} />
                            </div>

                            <div
                                className={cx(this.radioButtonStyle('isDesignationTrue', 'no'), "ml-1")} onClick={() => this.handleRadioButtonInput('isDesignationTrue', 'no')}>
                                <span className={this.radioButtonTextStyle('isDesignationTrue', 'no')}>{"no"}</span>
                                <input className={styles.RadioButton} type='radio' disabled={false} name='isDesignationTrue' value="no"
                                    onChange={() => this.handleRadioButtonInput('isDesignationTrue', 'no')} checked={this.handleRadioButtonChecked('isDesignationTrue', 'no')} />

                            </div>


                        </div>
                    </div> : null}
                {(!(_.isEmpty(this.props.data.employment.joinedFrom) && _.isEmpty(this.props.data.employment.workedUntil))) ?
                    <div className="d-flex flex-column mt-5">
                        <label className={styles.verifyLabel}>did {this.props.data.fullName} joined on {this.handleShowDate(this.props.data.employment.joinedFrom)} and relieved on {this.handleShowDate(this.props.data.employment.workedUntil)}</label>
                        <div className="d-flex flex-row mt-3">
                            <div
                                className={this.radioButtonStyle('isWorkDurationTrue', 'yes')} onClick={() => this.handleRadioButtonInput('isWorkDurationTrue', 'yes')}>
                                <span className={this.radioButtonTextStyle('isWorkDurationTrue', 'yes')}>{"yes"}</span>
                                <input className={styles.RadioButton} type='radio' disabled={false} name='isWorkDurationTrue'
                                    onChange={() => this.handleRadioButtonInput('isWorkDurationTrue', 'yes')} checked={this.handleRadioButtonChecked('isWorkDurationTrue', 'yes')} />
                            </div>

                            <div
                                className={cx(this.radioButtonStyle('isWorkDurationTrue', 'no'), "ml-1")} onClick={() => this.handleRadioButtonInput('isWorkDurationTrue', 'no')}>
                                <span className={this.radioButtonTextStyle('isWorkDurationTrue', 'no')}>{"no"}</span>
                                <input className={styles.RadioButton} type='radio' disabled={false} name='isWorkDurationTrue'
                                    onChange={() => this.handleRadioButtonInput('isWorkDurationTrue', 'no')} checked={this.handleRadioButtonChecked('isWorkDurationTrue', 'no')} />

                            </div>

                            <div
                                className={cx(this.radioButtonStyle('isWorkDurationTrue', 'maybe'), styles.largeRadioWidth, "ml-1")} onClick={() => this.handleRadioButtonInput('isWorkDurationTrue', 'maybe')}>
                                <span className={this.radioButtonTextStyle('isWorkDurationTrue', 'maybe')}>{"can't mention"}</span>
                                <input className={styles.RadioButton} type='radio' disabled={false} name='isWorkDurationTrue'
                                    onChange={() => this.handleRadioButtonInput('isWorkDurationTrue', 'maybe')} checked={this.handleRadioButtonChecked('isWorkDurationTrue', 'maybe')} />

                            </div>
                        </div>
                    </div> : null}
                {this.props.data.employment.salary!==null ?
                    <div className="d-flex flex-column mt-5">
                        <label className={styles.verifyLabel}>{this.props.data.fullName}'s salary was {this.props.data.employment.salary}/month ?</label>
                        <div className="d-flex flex-row mt-3">
                            <div
                                className={this.radioButtonStyle('isSalaryTrue', 'yes')} onClick={() => this.handleRadioButtonInput('isSalaryTrue', 'yes')}>
                                <span className={this.radioButtonTextStyle('isSalaryTrue', 'yes')}>{"yes"}</span>
                                <input className={styles.RadioButton} type='radio' disabled={false} name='isSalaryTrue'
                                    onChange={() => this.handleRadioButtonInput('isSalaryTrue', 'yes')} checked={this.handleRadioButtonChecked('isSalaryTrue', 'yes')} />
                            </div>

                            <div
                                className={cx(this.radioButtonStyle('isSalaryTrue', 'no'), "ml-1")} onClick={() => this.handleRadioButtonInput('isSalaryTrue', 'no')}>
                                <span className={this.radioButtonTextStyle('isSalaryTrue', 'no')}>{"no"}</span>
                                <input className={styles.RadioButton} type='radio' disabled={false} name='isSalaryTrue'
                                    onChange={() => this.handleRadioButtonInput('isSalaryTrue', 'no')} checked={this.handleRadioButtonChecked('isSalaryTrue', 'no')} />

                            </div>
                            <div
                                className={cx(this.radioButtonStyle('isSalaryTrue', 'maybe'), styles.largeRadioWidth, "ml-1")} onClick={() => this.handleRadioButtonInput('isSalaryTrue', 'maybe')}>
                                <span className={this.radioButtonTextStyle('isSalaryTrue', 'maybe')}>{"can't mention"}</span>
                                <input className={styles.RadioButton} type='radio' disabled={false} name='isSalaryTrue'
                                    onChange={() => this.handleRadioButtonInput('isSalaryTrue', 'maybe')} checked={this.handleRadioButtonChecked('isSalaryTrue', 'maybe')} />

                            </div>
                        </div>
                    </div> : null}

                <div className="d-flex flex-column mt-5">
                    <label className={styles.verifyLabel}>exit formalities completed ?</label>
                    <div className="d-flex flex-row mt-3">
                        <div
                            className={this.radioButtonStyle('isExitFormalitiesCompleted', 'yes')} onClick={() => this.handleRadioButtonInput('isExitFormalitiesCompleted', 'yes')}>
                            <span className={this.radioButtonTextStyle('isExitFormalitiesCompleted', 'yes')}>{"yes"}</span>
                            <input className={styles.RadioButton} type='radio' disabled={false} name='isExitFormalitiesCompleted'
                                onChange={() => this.handleRadioButtonInput('isExitFormalitiesCompleted', 'yes')} checked={this.handleRadioButtonChecked('isExitFormalitiesCompleted', 'yes')} />
                        </div>

                        <div
                            className={cx(this.radioButtonStyle('isExitFormalitiesCompleted', 'no'), "ml-1")} onClick={() => this.handleRadioButtonInput('isExitFormalitiesCompleted', 'no')}>
                            <span className={this.radioButtonTextStyle('isExitFormalitiesCompleted', 'no')}>{"no"}</span>
                            <input className={styles.RadioButton} type='radio' disabled={false} name='isExitFormalitiesCompleted'
                                onChange={() => this.handleRadioButtonInput('isExitFormalitiesCompleted', 'no')} checked={this.handleRadioButtonChecked('isExitFormalitiesCompleted', 'no')} />

                        </div>
                        <div
                            className={cx(this.radioButtonStyle('isExitFormalitiesCompleted', 'maybe'), styles.largeRadioWidth, "ml-1")} onClick={() => this.handleRadioButtonInput('isExitFormalitiesCompleted', 'maybe')}>
                            <span className={this.radioButtonTextStyle('isExitFormalitiesCompleted', 'maybe')}>{"can't mention"}</span>
                            <input className={styles.RadioButton} type='radio' disabled={false} name='isExitFormalitiesCompleted'
                                onChange={() => this.handleRadioButtonInput('isExitFormalitiesCompleted', 'maybe')} checked={this.handleRadioButtonChecked('isExitFormalitiesCompleted', 'maybe')} />

                        </div>
                    </div>
                </div>

                <div className="d-flex flex-column mt-5">
                    <label className={styles.verifyLabel}>other comments</label>
                    <textarea
                        placeholder="write something here"
                        name="comments"
                        className={styles.verifyTextArea}
                        onChange={(e) => this.handleTextArea(e)}
                    />
                </div>

                <div className="mt-5">
                    <button
                        className={this.state.enableSubmit ? styles.ActiveButton : styles.DisabledButton}
                        onClick={this.handleSubmitData}
                        disabled={!this.state.enableSubmit}
                    >submit</button>
                </div>



            </div>

        return (
            this.props.type === 'education' ?
                educationOptions
                : this.props.type === 'employment' ?
                    employmentOptions
                    : null







        )
    }

}



const mapDispatchToProps = dispatch => {
    return {
        putRefIdDetails: (refId, type, submitData) => dispatch(actions.putRefIdDetails(refId, type, submitData))
    }
}

export default connect(null, mapDispatchToProps)(VerifyInfo);
