import React, { Component } from 'react';
import _ from 'lodash';

import {initData, allFields, requiredFields} from './AddressInitData';
import { validation, message } from './AddressValidation';

import {Input} from 'react-crux';
import CustomSelect from '../../../../../../../components/Atom/CustomSelect/CustomSelect';

class Address extends Component {

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

    componentDidUpdate(prevProps, prevState){
        if(!_.isEqual(prevProps.data, this.props.data) & !this.state.isEdited){
            this.handlePropsToState();
        }

        if(!_.isEqual(prevProps.errors, this.props.errors)){
            if(!_.isEqual(this.props.errors, this.state.errors)){
                let updatedErrors = {};
                if(!_.isEmpty(this.props.errors)){
                    updatedErrors = _.cloneDeep(this.props.errors);
                }
                this.setState({
                    errors: updatedErrors
                });
            }
        }

        if(prevProps.isEdited !== this.props.isEdited){
            if(!this.props.isEdited){
                this.handlePropsToState();
            }
        }

        if(!_.isEqual(prevState.errors, this.state.errors)){
            this.props.onError(this.state.errors)
        }
    }

    handlePropsToState = () => {
        let updatedFormData = _.cloneDeep(this.props.data);
        if(_.isEmpty(this.props.data)){
            updatedFormData = {
                ...initData
            }
        }
        this.setState({
            formData: updatedFormData,
            isEdited: false
        })
    }

    handleSendDataToParent = () => {
        const formData = _.cloneDeep(this.state.formData);
        let emptyFieldCount = 0
        _.forEach(allFields, function(field){
            if(_.isEmpty(formData[field])){
                emptyFieldCount = emptyFieldCount + 1
            }
        })
        if(emptyFieldCount === allFields.length){
            this.props.onChange(null);
        }else{
            this.props.onChange(this.state.formData);
        }
    }

    debouncedDataToParent=_.debounce(this.handleSendDataToParent, 700, {leading: true})

    handleInputChange = (value, inputField) => {
        let updatedFormData = _.cloneDeep(this.state.formData);
        updatedFormData[inputField] = value;
        updatedFormData['addressType'] = this.props.addressType;
        this.setState({
            formData: updatedFormData,
            isEdited: true
        },()=> this.debouncedDataToParent());
    };

    handleError = (error, inputField) => {
        const currentErrors = _.cloneDeep(this.state.errors);
        let updatedErrors = _.cloneDeep(currentErrors);
        if(!_.isEmpty(error)){
            updatedErrors[inputField] = error;
        }else{
            delete updatedErrors[inputField]
        }
        if(!_.isEqual(updatedErrors, currentErrors)){
            this.setState({
                errors: updatedErrors
            });
        }
    };

    render() {
        return (
            <div disabled={this.props.isDisabled}>
                <form>
                    <div className="row no-gutters">
                        <CustomSelect
                            name='houseType'
                            className="col-4 pl-0 py-0 pr-3"
                            required={_.includes(requiredFields, 'houseType')}
                            label={'house type'}
                            options={this.props.EMP_MGMT_HOUSE_TYPE}
                            value={this.state.formData['houseType']}
                            errors={this.state.errors['houseType']}
                            onChange={(value) => this.handleInputChange(value, 'houseType')}
                            onError={(error) => this.handleError(error, 'houseType')}
                        />
                    </div>
                    <div className="row no-gutters">
                        <Input
                            name='addressLine1'
                            className='col-4 pr-3'
                            label={'address line 1'}
                            type='text'
                            placeholder={'address line 1'}
                            required={_.includes(requiredFields, 'addressLine1')}
                            value={this.state.formData['addressLine1']}
                            errors={this.state.errors['addressLine1']}
                            onChange={(value) => this.handleInputChange(value, 'addressLine1')}
                            onError={(error) => this.handleError(error, 'addressLine1')}
                            validation={validation['addressLine1']}
                            message={message['addressLine1']}
                        />
                        <Input
                            name='addressLine2'
                            className='col-4 pr-3'
                            label={'address line 2'}
                            type='text'
                            placeholder={'address line 2'}
                            required={_.includes(requiredFields, 'addressLine2')}
                            value={this.state.formData['addressLine2']}
                            errors={this.state.errors['addressLine2']}
                            onChange={(value) => this.handleInputChange(value, 'addressLine2')}
                            onError={(error) => this.handleError(error, 'addressLine2')}
                            validation={validation['addressLine2']}
                            message={message['addressLine2']}
                        />
                        <Input
                            name='landmark'
                            className='col-4 pr-3'
                            label={'landmark'}
                            type='text'
                            placeholder={'landmark'}
                            required={_.includes(requiredFields, 'landmark')}
                            value={this.state.formData['landmark']}
                            errors={this.state.errors['landmark']}
                            onChange={(value) => this.handleInputChange(value, 'landmark')}
                            onError={(error) => this.handleError(error, 'landmark')}
                            validation={validation['landmark']}
                            message={message['landmark']}
                        />
                    </div>
                    <div className="row no-gutters">
                        <Input
                            name='city'
                            className='col-4 pr-3'
                            label={'city'}
                            type='text'
                            placeholder={'city'}
                            required={_.includes(requiredFields, 'city')}
                            value={this.state.formData['city']}
                            errors={this.state.errors['city']}
                            onChange={(value) => this.handleInputChange(value, 'city')}
                            onError={(error) => this.handleError(error, 'city')}
                            validation={validation['city']}
                            message={message['city']}
                        />
                        <Input
                            name='district'
                            className='col-4 pr-3'
                            label={'district'}
                            type='text'
                            placeholder={'district'}
                            required={_.includes(requiredFields, 'district')}
                            value={this.state.formData['district']}
                            errors={this.state.errors['district']}
                            onChange={(value) => this.handleInputChange(value, 'district')}
                            onError={(error) => this.handleError(error, 'district')}
                            validation={validation['district']}
                            message={message['district']}
                        />
                        <Input
                            name='state'
                            className='col-4 pr-3'
                            label={'state'}
                            type='text'
                            placeholder={'state'}
                            required={_.includes(requiredFields, 'state')}
                            value={this.state.formData['state']}
                            errors={this.state.errors['state']}
                            onChange={(value) => this.handleInputChange(value, 'state')}
                            onError={(error) => this.handleError(error, 'state')}
                            validation={validation['state']}
                            message={message['state']}
                        />
                    </div>
                    <div className="row no-gutters">
                        <Input
                            name='country'
                            className='col-4 pr-3'
                            label={'country'}
                            type='text'
                            placeholder={'country'}
                            required={_.includes(requiredFields, 'country')}
                            value={this.state.formData['country']}
                            errors={this.state.errors['country']}
                            onChange={(value) => this.handleInputChange(value, 'country')}
                            onError={(error) => this.handleError(error, 'country')}
                            validation={validation['country']}
                            message={message['country']}
                        />
                        <Input
                            name='pincode'
                            className='col-4 pr-3'
                            label={'pincode'}
                            type='text'
                            placeholder={'pincode'}
                            required={_.includes(requiredFields, 'pincode')}
                            value={this.state.formData['pincode']}
                            errors={this.state.errors['pincode']}
                            onChange={(value) => this.handleInputChange(value, 'pincode')}
                            onError={(error) => this.handleError(error, 'pincode')}
                            validation={validation['pincode']}
                            message={message['pincode']}
                        />
                    </div>
                </form>
            </div>
        )
    }
}

export default Address;