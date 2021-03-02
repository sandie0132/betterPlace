import React, { Component } from 'react';
import styles from "./EmpOtherDetails.module.scss";

import _ from "lodash";
import cx from 'classnames';

import {Input} from 'react-crux';
import CustomSelect from '../../../../../../components/Atom/CustomSelect/CustomSelect';
import { validation, message } from './EmpOtherDetailsValidation';
import { empOtherDetailsInitData, requiredFields } from "./EmpOtherDetailsInitData";

class EmpOtherDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            formData: {
                ...empOtherDetailsInitData
            },
            isEdited: false,
            errors: {}
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(prevProps.data, this.props.data) & !this.state.isEdited) {
            this.handlePropsToState();
        }


        if (prevProps.isEdited !== this.props.isEdited) {
            if (!this.props.isEdited) {
                this.handlePropsToState();
            }
        }

        if (!_.isEqual(prevProps.errors, this.props.errors)) {
            if (!_.isEqual(this.props.errors, this.state.errors)) {
                let updatedErrors = {};
                if (!_.isEmpty(this.props.errors)) {
                    updatedErrors = _.cloneDeep(this.props.errors);
                }
                this.setState({
                    errors: updatedErrors
                });
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
            ...empOtherDetailsInitData
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
        let payload = {};
        _.forEach(this.state.formData, function (value, field) {
            if (!_.isEmpty(value)) {
                payload[field] = value
            }else{
                payload[field] = null;
            }
        });
        this.props.onChange(payload);
    }

    debouncedDataToParent = _.debounce(this.handleSendDataToParent, 700, {leading:true})

    handleInputChange = (value, inputField) => {
        let updatedFormData = _.cloneDeep(this.state.formData);
        updatedFormData[inputField] = value;
        this.setState({
            formData: updatedFormData,
            isEdited: true
        },()=> this.debouncedDataToParent());
    };

    handleError = (error, inputField) => {
        const currentErrors = _.cloneDeep(this.state.errors);
        let updatedErrors = _.cloneDeep(currentErrors);
        if (!_.isEmpty(error)) {
            updatedErrors[inputField] = error;
        } else {
            delete updatedErrors[inputField]
        }
        if (!_.isEqual(updatedErrors, currentErrors)) {
            this.setState({
                errors: updatedErrors
            });
        }
    };



    render() {
        return (
            <div className={styles.formLayout}>
                <div className={cx("mb-4", this.props.isActive ? styles.opacityHeadIn : styles.opacityHeadOut)}>
                    <div className={styles.horizontalLineInactive}></div>
                    <span className={styles.formHead}>other details</span>
                </div>
                <div className="row mx-0 px-0">
                    <Input
                        name='fatherName'
                        className='col-4 mx-0 pr-3'
                        label={"father's name"}
                        type='text'
                        placeholder={"father's name"}
                        required={_.includes(requiredFields, 'fatherName')}
                        value={this.state.formData['fatherName']}
                        onChange={(value) => this.handleInputChange(value, 'fatherName')}
                        validation={validation['fatherName']}
                        message={message['fatherName']}
                        errors={this.state.errors['fatherName']}
                        onError={(error) => this.handleError(error, 'fatherName')}
                    />
                    <Input
                        name='motherName'
                        className='col-4 pr-3'
                        label={"mother's name"}
                        type='text'
                        placeholder={"mother's name"}
                        required={_.includes(requiredFields, 'motherName')}
                        value={this.state.formData['motherName']}
                        onChange={(value) => this.handleInputChange(value, 'motherName')}
                        validation={validation['motherName']}
                        message={message['motherName']}
                        errors={this.state.errors['motherName']}
                        onError={(error) => this.handleError(error, 'motherName')}
                    />
                </div>
                <div className="row mx-0 px-0 mt-4">
                    <CustomSelect
                        name='maritalStatus'
                        className="col-4 pl-0 py-0 pr-3"
                        label={'marital status'}
                        required={_.includes(requiredFields, 'maritalStatus')}
                        options={this.props.staticData["EMP_MGMT_MARITAL_STATUS"]}
                        value={this.state.formData['maritalStatus']}
                        onChange={(value) => this.handleInputChange(value, 'maritalStatus')}
                    />
                    <CustomSelect
                        name='religion'
                        className="col-4 pl-0 py-0 pr-3"
                        label={'religion'}
                        required={_.includes(requiredFields, 'religion')}
                        options={this.props.staticData["EMP_MGMT_RELIGION"]}
                        value={this.state.formData['religion']}
                        onChange={(value) => this.handleInputChange(value, 'religion')}
                    />
                    <CustomSelect
                        name='nationality'
                        className="col-4 pl-0 py-0 pr-3"
                        label={'nationality'}
                        required={_.includes(requiredFields, 'nationality')}
                        options={this.props.staticData["EMP_MGMT_NATIONALITY"]}
                        value={this.state.formData['nationality']}
                        onChange={(value) => this.handleInputChange(value, 'nationality')}
                    />
                </div>
            </div>
        )
    }
}

export default EmpOtherDetails;