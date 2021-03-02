import React, { Component } from 'react';
import _ from 'lodash';
import cx from 'classnames';

import Social from './Social/Social';
import { initData } from './Social/SocialInitData';
import addButton from "../../../../../../assets/icons/addMore.svg";

import styles from "./EmpSocial.module.scss";

class EmpSocial extends Component {

    constructor(props) {
        super(props);
        this.state = {
            formData: [],
            errors: {},
            isEdited: false
        };
        this._isMounted = false;
    }

    componentDidMount(){
        this.handlePropsToState()
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

        // if (!_.isEqual(prevState.formData, this.state.formData) & this.state.isEdited) {
        //     this.handleSendDataToParent();
        // }

        if (!_.isEqual(prevState.errors, this.state.errors)) {
            this.props.onError(this.state.errors)
        }
    }

    handlePropsToState = () => {
        let updatedFormData = [];
        if (!_.isEmpty(this.props.data)) {
            _.forEach(this.props.data, function (social) {
                updatedFormData.push(social);
            })
        }
        if (_.isEmpty(updatedFormData)) updatedFormData.push({ ...initData })
        this.setState({
            formData: updatedFormData,
            isEdited: false
        })
    }

    handleSendDataToParent = () => {
        let payload = [];
        _.forEach(this.state.formData, function (data) {
            if(!_.isEmpty(data)){
                payload.push(data);
            }
        });
        if (_.isEmpty(payload)) {
            this.props.onChange(null);
        } else {
            this.props.onChange(payload);
        }
    }

    handleUpdateError = (errors) => {
        let updatedErrors = {};
        _.forEach(errors, function (error, index) {
            updatedErrors[Number(index) + 1] = error
        })
        return updatedErrors;
    }

    handleAddNewData = () => {
        const newData = { ...initData };
        let updatedFormData = _.cloneDeep(this.state.formData);
        let updatedErrors = _.cloneDeep(this.handleUpdateError(this.state.errors));
        updatedFormData = [
            newData,
            ...updatedFormData.slice(0)
        ]
        this.setState({
            formData: updatedFormData,
            errors: updatedErrors,
            isEdited: true
        },()=> this.debouncedDataToParent())
    }

    handleDeleteError = (errors, targetIndex) => {
        let updatedErrors = {};
        _.forEach(errors, function (error, index) {
            if (index > targetIndex) {
                updatedErrors[index - 1] = error
            } else if (index < targetIndex) {
                updatedErrors[index] = error
            }
        })
        return updatedErrors;
    }

    handleDeleteData = (targetIndex) => {
        let updatedFormData = _.cloneDeep(this.state.formData);
        let updatedErrors = _.cloneDeep(this.handleDeleteError(this.state.errors, targetIndex));
        updatedFormData = updatedFormData.filter((data, index) => {
            if (index === targetIndex) return null;
            else return data
        })
        this.setState({
            formData: updatedFormData,
            errors: updatedErrors,
            isEdited: true
        },()=> this.debouncedDataToParent())
    }

    debouncedDataToParent = _.debounce(this.handleSendDataToParent, 700, {leading:true})

    handleInputChange = (value, inputField, targetIndex) => {
        let updatedFormData = _.cloneDeep(this.state.formData);
        updatedFormData[targetIndex][inputField] = value;
        this.setState({
            formData: updatedFormData,
            isEdited: true
        },()=> this.debouncedDataToParent());
    };

    handleError = (error, inputField, targetIndex) => {
        const currentErrors = _.cloneDeep(this.state.errors);
        let updatedErrors = _.cloneDeep(currentErrors);
        let targetError = _.isEmpty(updatedErrors[targetIndex]) ? {} : updatedErrors[targetIndex];
        if (!_.isEmpty(error)) {
            targetError[inputField] = error;
        } else {
            delete targetError[inputField]
        }
        if (!_.isEmpty(targetError)) {
            updatedErrors[targetIndex] = targetError
        } else {
            delete updatedErrors[targetIndex]
        }
        if (!_.isEqual(updatedErrors, currentErrors)) {
            this.setState({
                errors: updatedErrors
            });
        }
    };

    render() {
        return (
            <div className={styles.formLayout} >
                <div className={cx("mb-4", this.props.isActive ? styles.opacityHeadIn : styles.opacityHeadOut)}>
                    <div className={styles.horizontalLineInactive}></div>
                    <span className={styles.formHead}>social</span>
                </div>

                <div className="mt-2">
                    <span className={styles.addHeading} onClick={this.handleAddNewData}>add social<img src={addButton} alt="add" className="ml-2" /></span>
                </div>
                {
                    this.state.formData.map((data, index) => {
                        return (
                            <Social
                                key={index}
                                serialNumber={this.state.formData.length - index}
                                data={data}
                                errors={_.isEmpty(this.state.errors[index]) ? {} : this.state.errors[index]}
                                EMP_MGMT_PLATFORM={this.props.staticData['EMP_MGMT_PLATFORM']}
                                onChange={(value, inputField) => this.handleInputChange(value, inputField, index)}
                                onError={((error, inputField) => this.handleError(error, inputField, index))}
                                onDelete={() => this.handleDeleteData(index)}
                            />
                        )
                    })
                }
            </div>
        )
    }
}

export default EmpSocial;