import React, { Component } from 'react';
import _ from 'lodash';

import { initData, requiredFields } from './EmpContactInitData';
import { validation, message } from './EmpContactValidation';
import styles from "./EmpContactDetails.module.scss";

import { Input } from 'react-crux';
import BGVLabel from '../BGVLabel/BGVLabel';

class EmpContactDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            formData: {
                ...initData
            },
            errors: {},
            isEdited: false
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(prevProps.data, this.props.data) & !this.state.isEdited) {
            this.handlePropsToState();
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

        if (prevProps.isEdited !== this.props.isEdited) {
            if (!this.props.isEdited) {
                this.handlePropsToState();
            }
        }

        if (!_.isEqual(prevState.errors, this.state.errors)) {
            this.props.onError(this.state.errors)
        }
    }

    handlePropsToState = () => {
        let updatedFormData = {
            ...initData
        }
        if (!_.isEmpty(this.props.data)) {
            _.forEach(this.props.data, function (contactObj) {
                if (contactObj['isPrimary']) {
                    if (contactObj['type'] === 'MOBILE') {
                        updatedFormData['primaryMobile'] = contactObj['contact']
                    } else if (contactObj['type'] === 'EMAIL') {
                        updatedFormData['primaryEmail'] = contactObj['contact']
                    }
                }
                else {
                    if (contactObj['type'] === 'MOBILE') {
                        updatedFormData['secondaryMobile'] = contactObj['contact']
                    } else if (contactObj['type'] === 'EMAIL') {
                        updatedFormData['secondaryEmail'] = contactObj['contact']
                    }
                }
            });
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
            const payload = this.formPayload();
            this.props.onChange(payload);
        }
    }

    debouncedDataToParent = _.debounce(this.handleSendDataToParent, 700, { leading: true })

    formPayload = () => {
        const formData = _.cloneDeep(this.state.formData);
        let payload = [];
        let primaryMobileObj, primaryEmailObj, secondaryMobileObj, secondaryEmailObj = null;

        if (!_.isEmpty(this.props.data)) {
            _.forEach(this.props.data, function (contactObj) {
                if (contactObj['isPrimary']) {
                    if (contactObj['type'] === 'MOBILE') {
                        primaryMobileObj = _.cloneDeep(contactObj);
                    } else if (contactObj['type'] === 'EMAIL') {
                        primaryEmailObj = _.cloneDeep(contactObj);
                    }
                }
                else {
                    if (contactObj['type'] === 'MOBILE') {
                        secondaryMobileObj = _.cloneDeep(contactObj);
                    } else if (contactObj['type'] === 'EMAIL') {
                        secondaryEmailObj = _.cloneDeep(contactObj);
                    }
                }
            })
        }
        if (!_.isEmpty(formData['primaryMobile'])) {
            if (primaryMobileObj) {
                payload.push({
                    ...primaryMobileObj,
                    contact: formData['primaryMobile']
                });
            } else {
                payload.push({
                    contact: formData['primaryMobile'],
                    isPrimary: true,
                    type: 'MOBILE'
                })
            }
        }
        if (!_.isEmpty(formData['primaryEmail'])) {
            if (primaryEmailObj) {
                payload.push({
                    ...primaryEmailObj,
                    contact: formData['primaryEmail']
                });
            } else {
                payload.push({
                    contact: formData['primaryEmail'],
                    isPrimary: true,
                    type: 'EMAIL'
                })
            }
        }
        if (!_.isEmpty(formData['secondaryMobile'])) {
            if (secondaryMobileObj) {
                payload.push({
                    ...secondaryMobileObj,
                    contact: formData['secondaryMobile']
                });
            } else {
                payload.push({
                    contact: formData['secondaryMobile'],
                    isPrimary: false,
                    type: 'MOBILE'
                })
            }
        }
        if (!_.isEmpty(formData['secondaryEmail'])) {
            if (secondaryEmailObj) {
                payload.push({
                    ...secondaryEmailObj,
                    contact: formData['secondaryEmail']
                });
            } else {
                payload.push({
                    contact: formData['secondaryEmail'],
                    isPrimary: false,
                    type: 'EMAIL'
                })
            }
        }
        return payload;
    }

    handleInputChange = (value, inputField) => {
        let updatedFormData = _.cloneDeep(this.state.formData);
        updatedFormData[inputField] = value;
        this.setState({
            formData: updatedFormData,
            isEdited: true
        }, () => this.debouncedDataToParent());
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

    getMissingInfoData = () => {
        const { bgvMissingInfo } = this.props;
        let missingInfo = null;
        if (!_.isEmpty(bgvMissingInfo)) {
            if (!_.isEmpty(bgvMissingInfo.CURRENT_ADDRESS) && !_.isEmpty(bgvMissingInfo.CURRENT_ADDRESS[0])
                && !_.isEmpty(bgvMissingInfo.CURRENT_ADDRESS[0].missingFields)
                && bgvMissingInfo.CURRENT_ADDRESS[0].missingFields.includes('contact')) {
                missingInfo = _.cloneDeep(bgvMissingInfo.CURRENT_ADDRESS[0]);
                missingInfo._id = "contactMissingInfo";
                missingInfo.missingFields = ['contact'];
            } else if (!_.isEmpty(bgvMissingInfo.PERMANENT_ADDRESS) && !_.isEmpty(bgvMissingInfo.PERMANENT_ADDRESS[0])
                && !_.isEmpty(bgvMissingInfo.PERMANENT_ADDRESS[0].missingFields)
                && bgvMissingInfo.PERMANENT_ADDRESS[0].missingFields.includes('contact')) {
                missingInfo = _.cloneDeep(bgvMissingInfo.PERMANENT_ADDRESS[0]);
                missingInfo._id = "contactMissingInfo";
                missingInfo.missingFields = ['contact'];
            }
        }
        return missingInfo;
    }

    render() {
        return (
            <div className={styles.formLayout} >
                {/* {this.props.isActive ? null :
                <React.Fragment>
                    <div className={styles.horizontalLineInactive}></div>
                    <span className={styles.formHead}>contact details</span>
                </React.Fragment>
                } */}

                <form>
                    <div className="row no-gutters">
                        <Input
                            name='primaryMobile'
                            className='col-4 pr-3'
                            label={'primary phone number'}
                            type='text'
                            placeholder={'9999999999'}
                            required={_.includes(requiredFields, 'primaryMobile')}
                            value={this.state.formData['primaryMobile']}
                            errors={this.state.errors['primaryMobile']}
                            onChange={(value) => this.handleInputChange(value, 'primaryMobile')}
                            onError={(error) => this.handleError(error, 'primaryMobile')}
                            validation={validation['primaryMobile']}
                            message={message['primaryMobile']}
                        />
                        <Input
                            name='primaryEmail'
                            className='col-4 pr-3'
                            label={'primary email id'}
                            type='text'
                            placeholder={'enter email id'}
                            required={_.includes(requiredFields, 'primaryEmail')}
                            value={this.state.formData['primaryEmail']}
                            errors={this.state.errors['primaryEmail']}
                            onChange={(value) => this.handleInputChange(value, 'primaryEmail')}
                            onError={(error) => this.handleError(error, 'primaryEmail')}
                            validation={validation['primaryEmail']}
                            message={message['primaryEmail']}
                        />

                        {!_.isEmpty(this.getMissingInfoData()) ?
                            <div className="ml-auto">
                                <BGVLabel
                                    missingInfoData={this.getMissingInfoData()}
                                    type="missingInfo"
                                />
                            </div> : null}
                    </div>

                    <div className="row no-gutters mt-2">
                        <Input
                            name='secondaryMobile'
                            className='col-4 pr-3'
                            label={'secondary phone number'}
                            type='text'
                            placeholder={'9999999999'}
                            required={_.includes(requiredFields, 'secondaryMobile')}
                            value={this.state.formData['secondaryMobile']}
                            errors={this.state.errors['secondaryMobile']}
                            onChange={(value) => this.handleInputChange(value, 'secondaryMobile')}
                            onError={(error) => this.handleError(error, 'secondaryMobile')}
                            validation={validation['secondaryMobile']}
                            message={message['secondaryMobile']}
                        />
                        <Input
                            name='secondaryEmail'
                            className='col-4 pr-3'
                            label={'secondary email id'}
                            type='text'
                            placeholder={'enter email id'}
                            required={_.includes(requiredFields, 'secondaryEmail')}
                            value={this.state.formData['secondaryEmail']}
                            errors={this.state.errors['secondaryEmail']}
                            onChange={(value) => this.handleInputChange(value, 'secondaryEmail')}
                            onError={(error) => this.handleError(error, 'secondaryEmail')}
                            validation={validation['secondaryEmail']}
                            message={message['secondaryEmail']}
                        />

                    </div>
                </form>

            </div>
        )
    }
}

export default (EmpContactDetails);