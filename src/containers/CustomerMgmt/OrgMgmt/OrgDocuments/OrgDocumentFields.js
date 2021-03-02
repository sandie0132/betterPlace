import React, { Component } from 'react';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';

import {Input, Datepicker} from 'react-crux';

import * as fieldData from './OrgDocumentsInitData';
import { requiredFields } from './OrgDocumentsInitData';
import { validation, message } from "./OrgDocumentsValidation";

class OrgDocumentFields extends Component {

    state = {
        formData: {
            data: {
                ...fieldData.InitData
            },
            editMode: false,
            noEdit: false
        },
        enableSubmit: false,
        errors: {}
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.docList !== prevProps.docList || this.state.formData !== prevProps.docList) {
            if (!_.isEmpty(this.props.docList)) {
                this.setState({ formData: this.props.docList })
            }
        }

        if (this.state.formData !== prevState.formData && this.state.noEdit) {
            this.props.changed(this.state.formData.data, this.props.index, this.state.enableSubmit)
        }

        if (this.props.type !== prevProps.type) {
            this.setState({
                formData: {
                    data: { ...fieldData.InitData },
                    editMode: false,
                    noEdit: false
                }
            })
        }

        if (!_.isEqual(this.state.errors, prevState.errors)) {
            let enableSubmit = true;
            if (!_.isEmpty(this.state.errors)) {
                enableSubmit = false;
            }
            else {
                enableSubmit = this.handleEnableSubmit(this.state.formData);
            }
            this.setState({ enableSubmit: enableSubmit })
            this.props.changed(this.state.formData.data, this.props.index, enableSubmit)
        }

    }

    handleInputChange = (value, inputIdentifier, type) => {
        let enableSubmit = false;
        let updatedFormData = _.cloneDeep(this.state.formData);

        updatedFormData.data.type = type;
        updatedFormData.data[inputIdentifier] =
            inputIdentifier === "documentNumber" ? value.toUpperCase() : value;

        enableSubmit = this.handleEnableSubmit(updatedFormData);
        this.props.changed(updatedFormData.data, this.props.index, enableSubmit);
        this.setState({ formData: updatedFormData, enableSubmit: enableSubmit })
    }

    handleEnableSubmit = (formData) => {
        let enableSubmit = true, fieldExist = true;
        const reqFields = requiredFields;

        _.forEach(formData.data, function (val, key) {
            if (reqFields.includes(key)) {
                if (val === '' || val === null) {
                    fieldExist = false;
                }
            }
            enableSubmit = fieldExist && enableSubmit;
        });


        if (enableSubmit) {
            enableSubmit = enableSubmit && _.isEmpty(this.state.errors);
        }

        return (enableSubmit);
    }

    handleError = (error, inputField) => {
        const currentErrors = _.cloneDeep(this.state.errors);
        let updatedErrors = _.cloneDeep(currentErrors);
        if (!_.isEmpty(error)) {
            updatedErrors[inputField] = error;
        }
        else {
            delete updatedErrors[inputField];
        }

        if (!_.isEqual(updatedErrors, currentErrors)) {
            this.setState({ errors: updatedErrors });
        }
    };

    render() {
        const { t } = this.props;
        let PAN_fields = <div></div>;
        let LLPIN_fields = <div></div>;
        let GST_fields = <div></div>;
        let CIN_fields = <div></div>;
        let AREF_fields = <div></div>;
        let TAN_fields = <div></div>;
        let AGREEMENT_fields = <div></div>;
        let defaultFields = <div></div>;

        switch (this.props.type) {
            case "PAN":
                PAN_fields =
                    <div className='row no-gutters'>
                        <Input
                            name={this.props.type + 'documentNumber'}
                            label={t('translation_orgDoc:input_orgDocuments.label.DocumentId')}
                            className='col-4 pr-3'
                            type='text'
                            value={this.state.formData.data.documentNumber}
                            required={_.includes(requiredFields, 'type')}
                            disabled={!this.props.editMode}
                            onChange={(value) => this.handleInputChange(value, 'documentNumber', this.props.type)}
                            validation={validation[this.props.type + 'documentNumber']}
                            message={message[this.props.type + 'documentNumber']}
                            errors={this.state.errors[this.props.type + 'documentNumber']}
                            onError={(error) => this.handleError(error, this.props.type + 'documentNumber')}
                        />
                        <Input
                            name={this.props.type + 'name'}
                            label={t('translation_orgDoc:input_orgDocuments.label.Name')}
                            className='col-4 pr-3'
                            type='text'
                            value={this.state.formData.data.name}
                            required={_.includes(requiredFields, 'name')}
                            disabled={!this.props.editMode}
                            onChange={(value) => this.handleInputChange(value, 'name', this.props.type)}
                            validation={validation[this.props.type + 'name']}
                            message={message[this.props.type + 'name']}
                            errors={this.state.errors[this.props.type + 'name']}
                            onError={(error) => this.handleError(error, this.props.type + 'name')}
                        />
                        <Datepicker
                            name='issuedOn'
                            label={t('translation_orgDoc:input_orgDocuments.label.Established')}
                            className='col-4'
                            type='text'
                            value={this.state.formData.data.issuedOn}
                            disabled={!this.props.editMode}
                            onChange={(value) => this.handleInputChange(value, 'issuedOn', this.props.type)}
                            validation={validation['issuedOn']}
                            message={message['issuedOn']}
                            errors={this.state.errors['issuedOn']}
                            onError={(error) => this.handleError(error, 'issuedOn')}
                        />
                    </div>
                break;

            case "GST":
                GST_fields =
                    <div className='row no-gutters'>
                        <Input
                            name={this.props.type + 'documentNumber'}
                            label={t('translation_orgDoc:input_orgDocuments.label.DocumentId')}
                            className='col-4 pr-3'
                            type='text'
                            value={this.state.formData.data.documentNumber}
                            required={_.includes(requiredFields, 'type')}
                            disabled={!this.props.editMode}
                            onChange={(value) => this.handleInputChange(value, 'documentNumber', this.props.type)}
                            validation={validation[this.props.type + 'documentNumber']}
                            message={message[this.props.type + 'documentNumber']}
                            errors={this.state.errors[this.props.type + 'documentNumber']}
                            onError={(error) => this.handleError(error, this.props.type + 'documentNumber')}
                        />
                        <Input
                            name={this.props.type + 'name'}
                            label={t('translation_orgDoc:input_orgDocuments.label.Name')}
                            className='col-4 pr-3'
                            type='text'
                            value={this.state.formData.data.name}
                            required={_.includes(requiredFields, 'name')}
                            disabled={!this.props.editMode}
                            onChange={(value) => this.handleInputChange(value, 'name', this.props.type)}
                            validation={validation[this.props.type + 'name']}
                            message={message[this.props.type + 'name']}
                            errors={this.state.errors[this.props.type + 'name']}
                            onError={(error) => this.handleError(error, this.props.type + 'name')}
                        />
                        <Datepicker
                            name='issuedOn'
                            label={t('translation_orgDoc:input_orgDocuments.label.IssuedOn')}
                            className='col-4'
                            type='text'
                            value={this.state.formData.data.issuedOn}
                            disabled={!this.props.editMode}
                            onChange={(value) => this.handleInputChange(value, 'issuedOn', this.props.type)}
                            validation={validation['issuedOn']}
                            message={message['issuedOn']}
                            errors={this.state.errors['issuedOn']}
                            onError={(error) => this.handleError(error, 'issuedOn')}
                        />
                        <Input
                            name={this.props.type + 'state'}
                            className="col-4 pr-3"
                            label={t('translation_orgDoc:input_orgDocuments.label.state')}
                            type='text'
                            placeholder='state'
                            value={this.state.formData.data.state}
                            required={_.includes(requiredFields, 'state')}
                            disabled={!this.props.editMode}
                            onChange={(value) => this.handleInputChange(value, 'state', this.props.type)}
                            validation={validation[this.props.type + 'state']}
                            message={message[this.props.type + 'state']}
                            errors={this.state.errors[this.props.type + 'state']}
                            onError={(error) => this.handleError(error, this.props.type + 'state')}
                        />
                    </div>
                break;

            case "LLPIN":
                LLPIN_fields =
                    <div className='row no-gutters'>
                        <Input
                            name={this.props.type + 'documentNumber'}
                            label={t('translation_orgDoc:input_orgDocuments.label.DocumentId')}
                            className='col-4 pr-3'
                            type='text'
                            value={this.state.formData.data.documentNumber}
                            disabled={!this.props.editMode}
                            required={_.includes(requiredFields, 'type')}
                            onChange={(value) => this.handleInputChange(value, 'documentNumber', this.props.type)}
                            validation={validation[this.props.type + 'documentNumber']}
                            message={message[this.props.type + 'documentNumber']}
                            errors={this.state.errors[this.props.type + 'documentNumber']}
                            onError={(error) => this.handleError(error, this.props.type + 'documentNumber')}
                        />
                        <Input
                            name={this.props.type + 'name'}
                            label={t('translation_orgDoc:input_orgDocuments.label.Name')}
                            className='col-4 pr-3'
                            type='text'
                            value={this.state.formData.data.name}
                            required={_.includes(requiredFields, 'name')}
                            disabled={!this.props.editMode}
                            onChange={(value) => this.handleInputChange(value, 'name', this.props.type)}
                            validation={validation[this.props.type + 'name']}
                            message={message[this.props.type + 'name']}
                            errors={this.state.errors[this.props.type + 'name']}
                            onError={(error) => this.handleError(error, this.props.type + 'name')}
                        />
                        <Datepicker
                            name='issuedOn'
                            label={t('translation_orgDoc:input_orgDocuments.label.IssuedOn')}
                            className='col-4'
                            type='text'
                            value={this.state.formData.data.issuedOn}
                            disabled={!this.props.editMode}
                            onChange={(value) => this.handleInputChange(value, 'issuedOn', this.props.type)}
                            validation={validation['issuedOn']}
                            message={message['issuedOn']}
                            errors={this.state.errors['issuedOn']}
                            onError={(error) => this.handleError(error, 'issuedOn')}
                        />
                        <Input
                            name={this.props.type + 'address'}
                            className="col-4 pr-3"
                            label={t('translation_orgDoc:input_orgDocuments.label.address')}
                            type='text'
                            placeholder={t('translation_orgDoc:input_orgDocuments.placeholder.address')}
                            value={this.state.formData.data.address}
                            required={_.includes(requiredFields, 'address')}
                            disabled={!this.props.editMode}
                            onChange={(value) => this.handleInputChange(value, 'address', this.props.type)}
                            validation={validation[this.props.type + 'address']}
                            message={message[this.props.type + 'address']}
                            errors={this.state.errors[this.props.type + 'address']}
                            onError={(error) => this.handleError(error, this.props.type + 'address')}
                        />
                        <Input
                            name={this.props.type + 'state'}
                            className="col-4 pr-3"
                            label={t('translation_orgDoc:input_orgDocuments.label.state')}
                            type='text'
                            placeholder='state'
                            value={this.state.formData.data.state}
                            required={_.includes(requiredFields, 'state')}
                            disabled={!this.props.editMode}
                            onChange={(value) => this.handleInputChange(value, 'state', this.props.type)}
                            validation={validation[this.props.type + 'state']}
                            message={message[this.props.type + 'state']}
                            errors={this.state.errors[this.props.type + 'state']}
                            onError={(error) => this.handleError(error, this.props.type + 'state')}
                        />
                        <Input
                            name={this.props.type + 'pincode'}
                            className="col-4"
                            label={t('translation_orgDoc:input_orgDocuments.label.pincode')}
                            type='text'
                            placeholder={t('translation_orgDoc:input_orgDocuments.placeholder.pincode')}
                            value={this.state.formData.data.pincode}
                            required={_.includes(requiredFields, 'pincode')}
                            disabled={!this.props.editMode}
                            onChange={(value) => this.handleInputChange(value, 'pincode', this.props.type)}
                            validation={validation[this.props.type + 'pincode']}
                            message={message[this.props.type + 'pincode']}
                            errors={this.state.errors[this.props.type + 'pincode']}
                            onError={(error) => this.handleError(error, this.props.type + 'pincode')}
                        />
                    </div>
                break;

            case "CIN":
                CIN_fields =
                    <div className='row no-gutters'>
                        <Input
                            name={this.props.type + 'documentNumber'}
                            label={t('translation_orgDoc:input_orgDocuments.label.DocumentId')}
                            className='col-4 pr-3'
                            type='text'
                            value={this.state.formData.data.documentNumber}
                            disabled={!this.props.editMode}
                            required={_.includes(requiredFields, 'type')}
                            onChange={(value) => this.handleInputChange(value, 'documentNumber', this.props.type)}
                            validation={validation[this.props.type + 'documentNumber']}
                            message={message[this.props.type + 'documentNumber']}
                            errors={this.state.errors[this.props.type + 'documentNumber']}
                            onError={(error) => this.handleError(error, this.props.type + 'documentNumber')}
                        />
                        <Input
                            name={this.props.type + 'name'}
                            label={t('translation_orgDoc:input_orgDocuments.label.Name')}
                            className='col-4 pr-3'
                            type='text'
                            value={this.state.formData.data.name}
                            required={_.includes(requiredFields, 'name')}
                            disabled={!this.props.editMode}
                            onChange={(value) => this.handleInputChange(value, 'name', this.props.type)}
                            validation={validation[this.props.type + 'name']}
                            message={message[this.props.type + 'name']}
                            errors={this.state.errors[this.props.type + 'name']}
                            onError={(error) => this.handleError(error, this.props.type + 'name')}
                        />
                        <Datepicker
                            name='issuedOn'
                            label={t('translation_orgDoc:input_orgDocuments.label.IssuedOn')}
                            className='col-4'
                            type='text'
                            value={this.state.formData.data.issuedOn}
                            disabled={!this.props.editMode}
                            onChange={(value) => this.handleInputChange(value, 'issuedOn', this.props.type)}
                            validation={validation['issuedOn']}
                            message={message['issuedOn']}
                            errors={this.state.errors['issuedOn']}
                            onError={(error) => this.handleError(error, 'issuedOn')}
                        />
                        <Input
                            name={this.props.type + 'address'}
                            className="col-4 pr-3"
                            label={t('translation_orgDoc:input_orgDocuments.label.address')}
                            type='text'
                            placeholder={t('translation_orgDoc:input_orgDocuments.placeholder.address')}
                            value={this.state.formData.data.address}
                            required={_.includes(requiredFields, 'address')}
                            disabled={!this.props.editMode}
                            onChange={(value) => this.handleInputChange(value, 'address', this.props.type)}
                            validation={validation[this.props.type + 'address']}
                            message={message[this.props.type + 'address']}
                            errors={this.state.errors[this.props.type + 'address']}
                            onError={(error) => this.handleError(error, this.props.type + 'address')}
                        />
                        <Input
                            name={this.props.type + 'state'}
                            className="col-4 pr-3"
                            label={t('translation_orgDoc:input_orgDocuments.label.state')}
                            type='text'
                            placeholder='state'
                            value={this.state.formData.data.state}
                            required={_.includes(requiredFields, 'state')}
                            disabled={!this.props.editMode}
                            onChange={(value) => this.handleInputChange(value, 'state', this.props.type)}
                            validation={validation[this.props.type + 'state']}
                            message={message[this.props.type + 'state']}
                            errors={this.state.errors[this.props.type + 'state']}
                            onError={(error) => this.handleError(error, this.props.type + 'state')}
                        />
                        <Input
                            name={this.props.type + 'pincode'}
                            className="col-4"
                            label={t('translation_orgDoc:input_orgDocuments.label.pincode')}
                            type='text'
                            placeholder={t('translation_orgDoc:input_orgDocuments.placeholder.pincode')}
                            value={this.state.formData.data.pincode}
                            required={_.includes(requiredFields, 'pincode')}
                            disabled={!this.props.editMode}
                            onChange={(value) => this.handleInputChange(value, 'pincode', this.props.type)}
                            validation={validation[this.props.type + 'pincode']}
                            message={message[this.props.type + 'pincode']}
                            errors={this.state.errors[this.props.type + 'pincode']}
                            onError={(error) => this.handleError(error, this.props.type + 'pincode')}
                        />
                    </div>
                break;

            case "1A_REF":
                AREF_fields =
                    <div className='row no-gutters'>
                        <Input
                            name={this.props.type + 'documentNumber'}
                            label={t('translation_orgDoc:input_orgDocuments.label.DocumentId')}
                            className='col-4 pr-3'
                            type='text'
                            value={this.state.formData.data.documentNumber}
                            disabled={!this.props.editMode}
                            required={_.includes(requiredFields, 'type')}
                            onChange={(value) => this.handleInputChange(value, 'documentNumber', this.props.type)}
                            validation={validation[this.props.type + 'documentNumber']}
                            message={message[this.props.type + 'documentNumber']}
                            errors={this.state.errors[this.props.type + 'documentNumber']}
                            onError={(error) => this.handleError(error, this.props.type + 'documentNumber')}
                        />
                        <Input
                            name={this.props.type + 'name'}
                            label={t('translation_orgDoc:input_orgDocuments.label.Name')}
                            className='col-4 pr-3'
                            type='text'
                            value={this.state.formData.data.name}
                            required={_.includes(requiredFields, 'name')}
                            disabled={!this.props.editMode}
                            onChange={(value) => this.handleInputChange(value, 'name', this.props.type)}
                            validation={validation[this.props.type + 'name']}
                            message={message[this.props.type + 'name']}
                            errors={this.state.errors[this.props.type + 'name']}
                            onError={(error) => this.handleError(error, this.props.type + 'name')}
                        />
                        <Datepicker
                            name='issuedOn'
                            label={t('translation_orgDoc:input_orgDocuments.label.IssuedOn')}
                            className='col-4'
                            type='text'
                            value={this.state.formData.data.issuedOn}
                            disabled={!this.props.editMode}
                            onChange={(value) => this.handleInputChange(value, 'issuedOn', this.props.type)}
                            validation={validation['issuedOn']}
                            message={message['issuedOn']}
                            errors={this.state.errors['issuedOn']}
                            onError={(error) => this.handleError(error, 'issuedOn')}
                        />
                        <Input
                            name={this.props.type + 'address'}
                            className="col-4 pr-3"
                            label={t('translation_orgDoc:input_orgDocuments.label.address')}
                            type='text'
                            placeholder={t('translation_orgDoc:input_orgDocuments.placeholder.address')}
                            value={this.state.formData.data.address}
                            required={_.includes(requiredFields, 'address')}
                            disabled={!this.props.editMode}
                            onChange={(value) => this.handleInputChange(value, 'address', this.props.type)}
                            validation={validation[this.props.type + 'address']}
                            message={message[this.props.type + 'address']}
                            errors={this.state.errors[this.props.type + 'address']}
                            onError={(error) => this.handleError(error, this.props.type + 'address')}
                        />
                        <Input
                            name={this.props.type + 'state'}
                            className="col-4 pr-3"
                            label={t('translation_orgDoc:input_orgDocuments.label.state')}
                            type='text'
                            placeholder='state'
                            value={this.state.formData.data.state}
                            required={_.includes(requiredFields, 'state')}
                            disabled={!this.props.editMode}
                            onChange={(value) => this.handleInputChange(value, 'state', this.props.type)}
                            validation={validation[this.props.type + 'state']}
                            message={message[this.props.type + 'state']}
                            errors={this.state.errors[this.props.type + 'state']}
                            onError={(error) => this.handleError(error, this.props.type + 'state')}
                        />
                        <Input
                            name={this.props.type + 'pincode'}
                            className="col-4"
                            label={t('translation_orgDoc:input_orgDocuments.label.pincode')}
                            type='text'
                            placeholder={t('translation_orgDoc:input_orgDocuments.placeholder.pincode')}
                            value={this.state.formData.data.pincode}
                            required={_.includes(requiredFields, 'pincode')}
                            disabled={!this.props.editMode}
                            onChange={(value) => this.handleInputChange(value, 'pincode', this.props.type)}
                            validation={validation[this.props.type + 'pincode']}
                            message={message[this.props.type + 'pincode']}
                            errors={this.state.errors[this.props.type + 'pincode']}
                            onError={(error) => this.handleError(error, this.props.type + 'pincode')}
                        />
                    </div>
                break;

            case "TAN":
                TAN_fields =
                    <div className='row no-gutters'>
                        <Input
                            name={this.props.type + 'documentNumber'}
                            label={t('translation_orgDoc:input_orgDocuments.label.DocumentId')}
                            className='col-4 pr-3'
                            type='text'
                            value={this.state.formData.data.documentNumber}
                            disabled={!this.props.editMode}
                            required={_.includes(requiredFields, 'type')}
                            onChange={(value) => this.handleInputChange(value, 'documentNumber', this.props.type)}
                            validation={validation[this.props.type + 'documentNumber']}
                            message={message[this.props.type + 'documentNumber']}
                            errors={this.state.errors[this.props.type + 'documentNumber']}
                            onError={(error) => this.handleError(error, this.props.type + 'documentNumber')}
                        />
                        <Input
                            name={this.props.type + 'name'}
                            label={t('translation_orgDoc:input_orgDocuments.label.Name')}
                            className='col-4 pr-3'
                            type='text'
                            value={this.state.formData.data.name}
                            required={_.includes(requiredFields, 'name')}
                            disabled={!this.props.editMode}
                            onChange={(value) => this.handleInputChange(value, 'name', this.props.type)}
                            validation={validation[this.props.type + 'name']}
                            message={message[this.props.type + 'name']}
                            errors={this.state.errors[this.props.type + 'name']}
                            onError={(error) => this.handleError(error, this.props.type + 'name')}
                        />
                        <Input
                            name={this.props.type + 'address'}
                            className="col-4 pr-3"
                            label={t('translation_orgDoc:input_orgDocuments.label.address')}
                            type='text'
                            placeholder={t('translation_orgDoc:input_orgDocuments.placeholder.address')}
                            value={this.state.formData.data.address}
                            required={_.includes(requiredFields, 'address')}
                            disabled={!this.props.editMode}
                            onChange={(value) => this.handleInputChange(value, 'address', this.props.type)}
                            validation={validation[this.props.type + 'address']}
                            message={message[this.props.type + 'address']}
                            errors={this.state.errors[this.props.type + 'address']}
                            onError={(error) => this.handleError(error, this.props.type + 'address')}
                        />
                        <Input
                            name={this.props.type + 'state'}
                            className="col-4 pr-3"
                            label={t('translation_orgDoc:input_orgDocuments.label.state')}
                            type='text'
                            placeholder='state'
                            value={this.state.formData.data.state}
                            required={_.includes(requiredFields, 'state')}
                            disabled={!this.props.editMode}
                            onChange={(value) => this.handleInputChange(value, 'state', this.props.type)}
                            validation={validation[this.props.type + 'state']}
                            message={message[this.props.type + 'state']}
                            errors={this.state.errors[this.props.type + 'state']}
                            onError={(error) => this.handleError(error, this.props.type + 'state')}
                        />
                        <Input
                            name={this.props.type + 'pincode'}
                            className="col-4"
                            label={t('translation_orgDoc:input_orgDocuments.label.pincode')}
                            type='text'
                            placeholder={t('translation_orgDoc:input_orgDocuments.placeholder.pincode')}
                            value={this.state.formData.data.pincode}
                            required={_.includes(requiredFields, 'pincode')}
                            disabled={!this.props.editMode}
                            onChange={(value) => this.handleInputChange(value, 'pincode', this.props.type)}
                            validation={validation[this.props.type + 'pincode']}
                            message={message[this.props.type + 'pincode']}
                            errors={this.state.errors[this.props.type + 'pincode']}
                            onError={(error) => this.handleError(error, this.props.type + 'pincode')}
                        />
                    </div>
                break;

            case "AGREEMENT":
                AGREEMENT_fields =
                    <div className='d-flex flex-wrap'>
                        <Datepicker
                            name='validFrom'
                            label={t('translation_orgDoc:input_orgDocuments.label.validFrom')}
                            className='col-4'
                            type='text'
                            value={this.state.formData.data.validFrom}
                            disabled={!this.props.editMode}
                            onChange={(value) => this.handleInputChange(value, 'validFrom', this.props.type)}
                            validation={validation['validFrom']}
                            message={message['validFrom']}
                            errors={this.state.errors['validFrom']}
                            onError={(error) => this.handleError(error, 'validFrom')}
                        />
                        <Datepicker
                            name='validUntil'
                            label={t('translation_orgDoc:input_orgDocuments.label.validTill')}
                            className='col-4'
                            type='text'
                            value={this.state.formData.data.validUntil}
                            disabled={!this.props.editMode}
                            onChange={(value) => this.handleInputChange(value, 'validUntil', this.props.type)}
                            validation={validation['validUntil']}
                            message={message['validUntil']}
                            errors={this.state.errors['validUntil']}
                            onError={(error) => this.handleError(error, 'validUntil')}
                        />
                    </div>
                break;

            default: defaultFields = <div></div>
        }
        return (
            <div>
                {this.props.type === "PAN" ? PAN_fields
                    : this.props.type === "GST" ? GST_fields
                        : this.props.type === "LLPIN" ? LLPIN_fields
                            : this.props.type === "CIN" ? CIN_fields
                                : this.props.type === "1A_REF" ? AREF_fields
                                    : this.props.type === "TAN" ? TAN_fields
                                        : this.props.type === "AGREEMENT" ? AGREEMENT_fields
                                            : defaultFields}
            </div>
        );
    }
}

export default withTranslation()(OrgDocumentFields)