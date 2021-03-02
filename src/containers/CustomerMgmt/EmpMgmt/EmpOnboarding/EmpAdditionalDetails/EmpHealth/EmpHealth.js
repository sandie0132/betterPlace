import React, { Component } from 'react';
import { empHealthConfigData, empHealthInitData } from "./EmpHealthInitData";
import styles from "./EmpHealth.module.scss";

import _ from 'lodash';
import cx from 'classnames';

import TextArea from '../../../../../../components/Atom/TextArea/TextArea';
import CustomSelect from '../../../../../../components/Atom/CustomSelect/CustomSelect';
import BGVLabel from '../BGVLabel/BGVLabel';

import height from '../../../../../../assets/icons/height.svg';
import weight from '../../../../../../assets/icons/weight.svg';
import blood from '../../../../../../assets/icons/bloodGroup.svg';


class EmpHealth extends Component {

    constructor(props) {
        super(props);
        this.state = {
            formData: {
                ...empHealthInitData
            },
            configData: {
                ...empHealthConfigData
            },
            errors: {},
            isEdited: false,
            focusHeight: false,
            focusWeight: false,
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
            ...empHealthInitData
        }

        if (!_.isEmpty(this.props.data)) {
            updatedFormData = _.cloneDeep(this.props.data);


        }
        this.setState({
            formData: updatedFormData,
            isEdited: false
        })
    }

    handleSendDataToParent = () => {
        let isFormEmpty = true;
        _.forEach(this.state.formData, function (value) {
            if (!_.isEmpty(value)) {
                isFormEmpty = false
            }
        });
        if (isFormEmpty) {
            this.props.onChange(null);
        } else {
            const payload = _.cloneDeep(this.state.formData)
            this.props.onChange(payload);
        }
    }

    onFocus = (focusType) => {
        if (focusType === "focusWeight") {
            this.setState({ focusWeight: true })
        }
        else {
            this.setState({ focusHeight: true })
        }

    }

    onBlur = (focusType) => {
        if (focusType === "focusWeight") {
            this.setState({ focusWeight: false })
        }
        else {
            this.setState({ focusHeight: false })
        }
    }

    debouncedDataToParent = _.debounce(this.handleSendDataToParent, 700, {leading:true})

    handleInputChange = (event, inputIdentifier) => {
        const updatedHealth = _.cloneDeep(this.state.formData)
        let updatedValue = event.target ? event.target.value : event;
        if (inputIdentifier === 'weight') {
            if (!updatedValue.match(/^[0-9.]*$/)) {
                updatedValue = updatedValue.substr(0, updatedValue.length - 1)
            }
        }
        if (inputIdentifier === 'height') {
            if (this.state.formData["heightUnit"] === 'ft') {
                if (!updatedValue.match(/^[0-9.'"]*$/)) {
                    updatedValue = updatedValue.substr(0, updatedValue.length - 1)
                }
            }
            if (this.state.formData["heightUnit"] === 'cm') {
                if (!updatedValue.match(/^[0-9.]*$/)) {
                    updatedValue = updatedValue.substr(0, updatedValue.length - 1)
                }
            }
        }

        if (inputIdentifier === 'heightUnit') {
            updatedHealth['height'] = '';
        }

        if (inputIdentifier === 'weightUnit') {
            updatedHealth['weight'] = '';
        }
        updatedHealth[inputIdentifier] = updatedValue;

        this.setState({ formData: updatedHealth, isEdited: true },()=> this.debouncedDataToParent());
    }

    getBGVData = () => {
        let BgvData = null;
        if (!_.isEmpty(this.props.bgvData)) {
            if (!_.isEmpty(this.props.bgvData[0])) {
                if (!_.isEmpty(this.props.bgvData[0].bgv)) {
                    if (!_.isEmpty(this.props.bgvData[0].bgv.health)) {
                        BgvData = this.props.bgvData[0].bgv.health.checks[0]
                    }
                }
            }
        }
        return BgvData;
    }

    getInProgressStatus = () => {
        let progressCheck = false;
        if (!_.isEmpty(this.props.bgvData)) {
            if (!_.isEmpty(this.props.bgvData[0])) {
                if (!_.isEmpty(this.props.bgvData[0].bgv)) {
                    if (!_.isEmpty(this.props.bgvData[0].bgv.health)) {
                        let BgvData = this.props.bgvData[0].bgv.health.checks[0]
                        if (!_.isEmpty(BgvData)) {
                            if (BgvData.status === "inProgress") {
                                progressCheck = true
                            }
                        }

                    }
                }
            }
        }
        return progressCheck;
    }
    
    getBGVMissingInfo = () => {
        let missingInfo = null;
        if (!_.isEmpty(this.props.bgvMissingInfo)) {
            if (this.props.bgvMissingInfo.hasOwnProperty("HEALTH")) {
                missingInfo = this.props.bgvMissingInfo["HEALTH"][0];
            }
        }
        return missingInfo;
    }

    render() {
        return (
            <div className={styles.formLayout}>
                <div className={cx("mb-4", this.props.isActive ? styles.opacityHeadIn : styles.opacityHeadOut)}>
                    <div className={styles.horizontalLineInactive}></div>
                    <span className={styles.formHead}>health details</span>
                </div>
                {
                    !_.isEmpty(this.props.bgvMissingInfo) ?
                        this.getBGVMissingInfo() ?   
                            <div className="row mb-4">
                                <div className="ml-auto mr-4">
                                    <BGVLabel
                                        missingInfoData={this.getBGVMissingInfo()}
                                        type="missingInfo"
                                    />
                                </div>
                            </div>
                            : null
                        :
                        !_.isEmpty(this.props.bgvData) ?
                            this.getBGVData() ?
                                <div className="row mb-4">
                                    <div className="ml-auto mr-4">
                                        <BGVLabel
                                            bgvData={this.getBGVData()}
                                            type="bgvStatus"
                                        />
                                    </div>
                                    <br />
                                </div>
                                : null
                            :
                            null
                }
                <div className={this.getInProgressStatus() ? styles.showOpacity : null}>
                <div className={cx("row mx-0 px-0 mt-2")}>
                    <div className="col-4 mx-0 px-0">
                        <div className="d-flex">
                            <img src={weight} alt="weight" />
                            <span className={styles.iconLabelPosition}>
                                <div>select</div> <div>weight</div>
                            </span>
                        </div>
                        <div className="d-flex">

                            <CustomSelect
                                options={this.state.configData["weightUnit"]["options"]}
                                value={this.state.formData["weightUnit"]}
                                className="col-6 px-0 mt-3"
                                onChange={(event) => this.handleInputChange(event, 'weightUnit')}
                                disabled={this.getInProgressStatus()}
                                name="weightUnit"

                            />

                            <div className={cx(this.state.focusWeight ? styles.InputPlaceFocus : styles.InputPlace, "row col-4 mx-auto mt-3 mb-2")}>
                                <input
                                    type='text'
                                    value={this.state.formData["weight"]}
                                    onChange={(event) => this.handleInputChange(event, 'weight')}
                                    className={cx(styles.InputText, "ml-1 px-6 row")}
                                    onFocus={() => this.onFocus("focusWeight")}
                                    onBlur={() => this.onBlur("focusWeight")}
                                    maxLength="6"
                                    disabled={this.getInProgressStatus()}
                                />
                                <span className={cx(styles.InputUnit)}>
                                    {this.state.formData["weightUnit"] === 'lbs' ? 'lbs' : 'kg'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="col-4 mx-0 px-0">
                        <div className="d-flex">
                            <img src={height} alt="height" />
                            <span className={styles.iconLabelPosition}>
                                <div>select</div> <div>height</div>
                            </span>
                        </div>
                        <div className="d-flex">
                            <CustomSelect
                                options={this.state.configData["heightUnit"]["options"]}
                                value={this.state.formData["heightUnit"]}
                                className="col-6 px-0 mt-3"
                                onChange={(event) => this.handleInputChange(event, 'heightUnit')}
                                disabled={this.getInProgressStatus()}
                                name="heightUnit"

                            />
                            <div className={cx(this.state.focusHeight ? styles.InputPlaceFocus : styles.InputPlace, "row col-4 mx-auto mt-3 mb-2")}>
                                <input
                                    type='text'
                                    value={this.state.formData["height"]}
                                    onChange={(event) => this.handleInputChange(event, 'height')}
                                    className={cx(styles.InputText, "ml-1 px-6 row")}
                                    onFocus={() => this.onFocus("focusHeight")}
                                    onBlur={() => this.onBlur("focusHeight")}
                                    maxLength="6"
                                    disabled={this.getInProgressStatus()}
                                />
                                <span className={cx(styles.InputUnit)}>
                                    {this.state.formData["heightUnit"] === 'ft' ? 'ft' : 'cm'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="col-4 mx-0 px-0">
                        <div className="d-flex">
                            <img src={blood} alt="blood" />
                            <span className={styles.iconLabelPosition}>
                                <div>select</div> <div>blood group</div>
                            </span>
                        </div>
                        <CustomSelect
                            options={this.state.configData["bloodGroup"]["options"]}
                            value={this.state.formData["bloodGroup"]}
                            className="col-10 px-0 mt-3"
                            onChange={(event) => this.handleInputChange(event, 'bloodGroup')}
                            disabled={this.getInProgressStatus()}
                            name="bloodGroup"
                        />
                    </div>

                </div>
                <div className="row px-0 mt-2 mx-0">
                    <TextArea
                        name='identificationMark'
                        className="col-4 pr-3"
                        rows='2'
                        label="indetification mark"
                        placeholder={"enter identification mark"}
                        value={this.state.formData["identificationMark"]}
                        changed={(event) => this.handleInputChange(event, 'identificationMark')}
                        disabled={this.getInProgressStatus()}

                    />
                </div>
                </div>


            </div>
        )
    }
}

export default EmpHealth;