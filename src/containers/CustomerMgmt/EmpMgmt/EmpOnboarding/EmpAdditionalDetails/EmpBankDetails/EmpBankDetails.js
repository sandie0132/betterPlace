import React, { Component } from 'react';
import styles from "./EmpBankDetails.module.scss";

import _ from "lodash";
import cx from 'classnames';

import {Input} from 'react-crux';
import { empBankDetailsInitData, allFields, requiredFields } from "./EmpBankDetailsInitData";
import { validation, message } from './EmpBankDetailsValidation';


class EmpBankDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            formData: _.cloneDeep(empBankDetailsInitData),
            isEdited: false,
            errors: {},

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
        let updatedFormData = _.cloneDeep(empBankDetailsInitData);

        if (!_.isEmpty(this.props.data)) {
            updatedFormData = _.cloneDeep(this.props.data);
        }
        this.setState({
            formData: updatedFormData,
            isEdited: false
        })
    }

    handleSendDataToParent = () => {
        let payload = [];
        _.forEach(this.state.formData, function (data) {
            if (!_.isEmpty(data)) {
                let emptyFieldCount = 0
                _.forEach(allFields, function (field) {
                    if (_.isEmpty(data[field])) {
                        emptyFieldCount = emptyFieldCount + 1
                    }
                })
                if (emptyFieldCount !== allFields.length) {
                    payload.push(data);
                }
            }
        });
        if (_.isEmpty(payload)) {
            this.props.onChange(null);
        } else {
            this.props.onChange(payload);
        }
    }

    debouncedDataToParent = _.debounce(this.handleSendDataToParent, 700, {leading:true})

    handleInputChange = (value, inputField) => {
        let updatedFormData = _.cloneDeep(this.state.formData);
        updatedFormData[0][inputField] = value;
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
                    <span className={styles.formHead}>bank details</span>
                </div>


                <div className="row mx-0 px-0">

                    <Input
                        name='holderName'
                        className='col-4 mx-0 pr-3'
                        label={"account holder's name"}
                        type='text'
                        placeholder={"account holder's name"}
                        required={_.includes(requiredFields, 'holderName')}
                        validation={validation['holderName']}
                        message={message['holderName']}
                        value={this.state.formData[0]['holderName']}
                        errors={this.state.errors['holderName']}
                        onError={(error) => this.handleError(error, 'holderName')}
                        onChange={(value) => this.handleInputChange(value, 'holderName')}
                    />

                    <Input
                        name='branchName'
                        className='col-4 mx-0 pr-3'
                        label={"branch"}
                        type='text'
                        placeholder={"branch name"}
                        required={_.includes(requiredFields, 'branchName')}
                        value={this.state.formData[0]['branchName']}
                        onChange={(value) => this.handleInputChange(value, 'branchName')}
                    />

                </div>
                <div className="row mx-0 px-0 mt-4">

                    <Input
                        name='bankName'
                        className='col-4 mx-0 pr-3'
                        label={"bank name"}
                        type='text'
                        placeholder={"bank name"}
                        value={this.state.formData[0]['bankName']}
                        validation={validation['bankName']}
                        message={message['bankName']}
                        required={_.includes(requiredFields, 'bankName')}
                        errors={this.state.errors['bankName']}
                        onError={(error) => this.handleError(error, 'bankName')}
                        onChange={(value) => this.handleInputChange(value, 'bankName')}
                    />
                    <Input
                        name='accountNumber'
                        className='col-4 mx-0 pr-3'
                        label={"bank account number"}
                        type='text'
                        placeholder={"account number"}
                        value={this.state.formData[0]['accountNumber']}
                        validation={validation['accountNumber']}
                        message={message['accountNumber']}
                        required={_.includes(requiredFields, 'accountNumber')}
                        errors={this.state.errors['accountNumber']}
                        onError={(error) => this.handleError(error, 'accountNumber')}
                        onChange={(value) => this.handleInputChange(value, 'accountNumber')}
                    />
                    <Input
                        name='ifscCode'
                        className='col-4 mx-0 pr-3'
                        label={"IFSC code"}
                        type='text'
                        placeholder={"IFSC code"}
                        value={this.state.formData[0]['ifscCode']}
                        validation={validation['ifscCode']}
                        message={message['ifscCode']}
                        required={_.includes(requiredFields, 'ifscCode')}
                        errors={this.state.errors['ifscCode']}
                        onError={(error) => this.handleError(error, 'ifscCode')}
                        onChange={(value) => this.handleInputChange(value, 'ifscCode')}
                    />

                </div>

            </div>
        )
    }
}

export default EmpBankDetails;