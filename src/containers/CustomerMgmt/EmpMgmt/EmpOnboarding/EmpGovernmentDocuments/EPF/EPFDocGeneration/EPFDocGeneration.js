import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import cx from "classnames";
import _ from "lodash";

import CustomSelect from "../../../../../../../components/Atom/CustomSelect/CustomSelect";
import {Input, Datepicker} from 'react-crux';
import RadioButton from '../../../../../../../components/Molecule/RadioButton/RadioButton';
import CheckBox from '../../../../../../../components/Atom/CheckBox/CheckBox';
import ear from "../../../../../../../assets/icons/ear.svg";
import eye from "../../../../../../../assets/icons/eye.svg";
import locomotive from "../../../../../../../assets/icons/locomotive.svg";

import styles from "./EPFDocGeneration.module.scss";
import { validation, message } from './EPFDocGenerationValidations';
import { requiredFields } from './EPFDocGenerationInitData';

const EPFDocGeneration = (props) => {

    return (
        <div className={props.disabled ? styles.disable : null}>
            <div className={styles.headingBold}>personal details</div>
            <div className="row no-gutter">
                <CustomSelect
                    name="title"
                    className="mt-3 col-4 pr-3"
                    label={'title'}
                    required={_.includes(requiredFields, 'title')}
                    options={props.EMP_MGMT_EPF_TITLE}
                    value={props.formData['title']}
                    onChange={value => props.handleInputChange(value, 'title')}
                    disabled={props.disabled}
                />
                <Input
                    name='name'
                    className='col-4 pr-3'
                    label={'name (as on aadhaar)'}
                    required={_.includes(requiredFields, 'name')}
                    type='text'
                    placeholder={'enter name'}
                    value={props.formData['name']}
                    errors={props.errors['name']}
                    onChange={(value) => props.handleInputChange(value, 'name')}
                    onError={(error) => props.handleError(error, 'name')}
                    validation={validation['name']}
                    message={message['name']}
                    disabled={props.disabled}
                />
                <Datepicker
                    name='dob'
                    className="col-4 pr-3"
                    label={'date of birth (as on aadhaar)'}
                    required={_.includes(requiredFields, 'dob')}
                    type='text'
                    value={props.formData['dob']}
                    onChange={(value) => props.handleInputChange(value, 'dob')}
                    onError={(error) => props.handleError(error, 'dob')}
                    validation={validation['dob']}
                    message={message['dob']}
                    errors={props.errors['dob']}
                    disabled={props.disabled}
                />
            </div>
            <div className="row no-gutter">
                <CustomSelect
                    name="gender"
                    className="mt-3 col-4 pr-3"
                    label={'gender'}
                    required={_.includes(requiredFields, 'gender')}
                    options={props.EMP_MGMT_EPF_GENDER}
                    value={props.formData['gender']}
                    onChange={value => props.handleInputChange(value, 'gender')}
                    disabled={props.disabled}
                />
                <CustomSelect
                    name="nationality"
                    className="mt-3 col-4 pr-3"
                    label={'nationality'}
                    required={_.includes(requiredFields, 'nationality')}
                    options={props.EMP_MGMT_EPF_NATIONALITY}
                    value={props.formData['nationality']}
                    onChange={value => props.handleInputChange(value, 'nationality')}
                    disabled={props.disabled}
                />
                <CustomSelect
                    name="maritalStatus"
                    className="mt-3 col-4 pr-3"
                    label={'marital status'}
                    required={_.includes(requiredFields, 'maritalStatus')}
                    options={props.EMP_MGMT_EPF_MARITAL_STATUS}
                    value={props.formData['maritalStatus']}
                    onChange={value => props.handleInputChange(value, 'maritalStatus')}
                    disabled={props.disabled}
                />
            </div>
            <div className="row no-gutter mt-3 px-1">
                <Input
                    name='employeePhoneNumber'
                    className='col-4 pr-3'
                    label={'mobile number'}
                    required={_.includes(requiredFields, 'employeePhoneNumber')}
                    type='text'
                    placeholder={'enter mobile number'}
                    value={props.formData['employeePhoneNumber']}
                    errors={props.errors['employeePhoneNumber']}
                    onChange={(value) => props.handleInputChange(value, 'employeePhoneNumber')}
                    onError={(error) => props.handleError(error, 'employeePhoneNumber')}
                    validation={validation['employeePhoneNumber']}
                    message={message['employeePhoneNumber']}
                    disabled={props.disabled}
                />
                <CustomSelect
                    name="qualification"
                    className="mt-3 col-4 pr-3"
                    label={'qualification'}
                    required={_.includes(requiredFields, 'qualification')}
                    options={props.EMP_MGMT_EPF_QUALIFICATION}
                    value={props.formData['qualification']}
                    onChange={value => props.handleInputChange(value, 'qualification')}
                    disabled={props.disabled}
                />
            </div>
            <div className={styles.horizontalLineInactive}></div>
            <div className={cx("mt-4", styles.headingBold)}>family details</div>
            <div className="row no-gutter">
                <CustomSelect
                    name="relation"
                    className="mt-3 col-4 pr-3"
                    label={'relation'}
                    required={_.includes(requiredFields, 'relation')}
                    options={props.EMP_MGMT_EPF_RELATION}
                    value={props.formData['relation']}
                    onChange={value => props.handleInputChange(value, 'relation')}
                    disabled={props.disabled}
                />
                <Input
                    name='fatherOrHusbandName'
                    className='col-4 pr-3'
                    label={'father/husband name'}
                    required={_.includes(requiredFields, 'fatherOrHusbandName')}
                    type='text'
                    placeholder={'enter father/husband name'}
                    value={props.formData['fatherOrHusbandName']}
                    errors={props.errors['fatherOrHusbandName']}
                    onChange={(value) => props.handleInputChange(value, 'fatherOrHusbandName')}
                    onError={(error) => props.handleError(error, 'fatherOrHusbandName')}
                    validation={validation['fatherOrHusbandName']}
                    message={message['fatherOrHusbandName']}
                    disabled={props.disabled}
                />
            </div>
            <div className={styles.horizontalLineInactive}></div>
            <div className={cx("mt-4", styles.headingBold)}>joining date and aadhaar number</div>
            <div className="row no-gutter px-1">
                <Datepicker
                    name='joiningDate'
                    className="col-4 pr-3"
                    label={'date of joining'}
                    required={_.includes(requiredFields, 'joiningDate')}
                    value={props.formData['joiningDate']}
                    onChange={(value) => props.handleInputChange(value, 'joiningDate')}
                    disabled={props.disabled}
                    onError={(error) => props.handleError(error, 'joiningDate')}
                    validation={validation['joiningDate']}
                    message={message['joiningDate']}
                    errors={props.errors['joiningDate']}
                />
                <Input
                    name='aadhaarNumber'
                    className='col-4 pr-3'
                    label={'aadhaar number'}
                    required={_.includes(requiredFields, 'aadhaarNumber')}
                    type='text'
                    placeholder={'enter aadhaar number'}
                    value={props.formData['aadhaarNumber']}
                    errors={props.errors['aadhaarNumber']}
                    onChange={(value) => props.handleInputChange(value, 'aadhaarNumber')}
                    onError={(error) => props.handleError(error, 'aadhaarNumber')}
                    validation={validation['aadhaarNumber']}
                    message={message['aadhaarNumber']}
                    disabled={props.disabled}
                />
            </div>
            <div className={styles.horizontalLineInactive}></div>
            <div className={cx("mt-4", styles.headingBold)}>EPF details</div>
            <div className="row no-gutter px-1">
                <Input
                    name='uanNumber'
                    className='col-4 pr-3'
                    label={'uan number'}
                    required={_.includes(requiredFields, 'uanNumber')}
                    type='text'
                    placeholder={'enter uan number'}
                    value={props.formData['uanNumber']}
                    errors={props.errors['uanNumber']}
                    onChange={(value) => props.handleInputChange(value, 'uanNumber')}
                    onError={(error) => props.handleError(error, 'uanNumber')}
                    validation={validation['uanNumber']}
                    message={message['uanNumber']}
                    disabled={props.disabled}
                />
            </div>
            <div className={styles.horizontalLineInactive}></div>
            <div className={cx("mt-4 mb-2", styles.headingBold)}>international worker details</div>
            <div>
                <CheckBox
                    type="medium"
                    name='isInternationalWorker'
                    // className={cx(styles.centerAlign, styles.checkBoxAlign)}
                    value={props.formData['isInternationalWorker']}
                    onChange={() => props.handleCheckBox('isInternationalWorker')}
                    disabled={props.disabled}
                    checkMarkStyle={styles.checkMarkStyle}
                />
                <span className={cx("ml-4", styles.headingGrey)}>is a international worker</span>
            </div>
            <div className={!props.formData['isInternationalWorker'] ? styles.hide : null}>
                <div className="row no-gutter">
                    <CustomSelect
                        name="countryOfOrigin"
                        className="mt-3 col-4 pr-3"
                        label={'country of origin'}
                        required={_.includes(requiredFields, 'countryOfOrigin')}
                        options={props.EMP_MGMT_EPF_COUNTRY_OF_ORIGIN}
                        value={props.formData['countryOfOrigin']}
                        onChange={value => props.handleInputChange(value, 'countryOfOrigin')}
                        disabled={props.disabled}
                    />
                    <Input
                        name='nameOnPassport'
                        className='col-4 pr-3'
                        label={'name on passport'}
                        required={_.includes(requiredFields, 'nameOnPassport')}
                        type='text'
                        placeholder={'enter name on passport'}
                        value={props.formData['nameOnPassport']}
                        errors={props.errors['nameOnPassport']}
                        onChange={(value) => props.handleInputChange(value, 'nameOnPassport')}
                        onError={(error) => props.handleError(error, 'nameOnPassport')}
                        validation={validation['nameOnPassport']}
                        message={message['nameOnPassport']}
                        disabled={props.disabled}
                    />
                </div>
                <div className="row no-gutter px-1 mt-2">
                    <Input
                        name='passportNumber'
                        className='col-4 pr-3'
                        label={'passport number'}
                        required={_.includes(requiredFields, 'passportNumber')}
                        type='text'
                        placeholder={'enter passport number'}
                        value={props.formData['passportNumber']}
                        errors={props.errors['passportNumber']}
                        onChange={(value) => props.handleInputChange(value, 'passportNumber')}
                        onError={(error) => props.handleError(error, 'passportNumber')}
                        validation={validation['passportNumber']}
                        message={message['passportNumber']}
                        disabled={props.disabled}
                    />
                    <Datepicker
                        name='passportValidFrom'
                        className="col-4 pr-3"
                        label={'passport valid from'}
                        required={_.includes(requiredFields, 'passportValidFrom')}
                        value={props.formData['passportValidFrom']}
                        onChange={(value) => props.handleInputChange(value, 'passportValidFrom')}
                        disabled={props.disabled}
                        onError={(error) => props.handleError(error, 'passportValidFrom')}
                        validation={validation['passportValidFrom']}
                        message={message['passportValidFrom']}
                        errors={props.errors['passportValidFrom']}
                    />
                    <Datepicker
                        name='passportValidTill'
                        className="col-4 pr-3"
                        label={'passport valid till'}
                        required={_.includes(requiredFields, 'passportValidTill')}
                        value={props.formData['passportValidTill']}
                        onChange={(value) => props.handleInputChange(value, 'passportValidTill')}
                        disabled={props.disabled}
                        onError={(error) => props.handleError(error, 'passportValidTill')}
                        validation={validation['passportValidTill']}
                        message={message['passportValidTill']}
                        errors={props.errors['passportValidTill']}
                    />
                </div>
            </div>
            <div className={styles.horizontalLineInactive}></div>
            <div className={cx("mt-4 mb-2", styles.headingBold)}>disability details</div>
            <div>
                <CheckBox
                    type="medium"
                    name='isDifferentlyAbled'
                    // className={cx(styles.centerAlign, styles.checkBoxAlign)}
                    value={props.formData['isDifferentlyAbled']}
                    onChange={() => props.handleCheckBox('isDifferentlyAbled')}
                    disabled={props.disabled}
                    checkMarkStyle={styles.checkMarkStyle}
                />
                <span className={cx("ml-4", styles.headingGrey)}>is employee disabled</span>
            </div>
            <div className={cx(!props.formData['isDifferentlyAbled'] ? styles.hide : null, "mt-2")}>
                <div className={styles.smallText}>disability type<span className={styles.required}>*</span></div>
                <div className={cx('row mt-1')}>
                    <RadioButton
                        label={"locomotive"}
                        icon={locomotive}
                        isSelected={_.includes(props.formData['disablityType'], 'LOCOMOTIVE')}
                        disabled={props.disabled}
                        changed={() => props.handleRadioButton('LOCOMOTIVE')}
                        className="mb-2"
                    />
                    <RadioButton
                        label={"eye"}
                        icon={eye}
                        isSelected={_.includes(props.formData['disablityType'], 'VISUAL')}
                        disabled={props.disabled}
                        changed={() => props.handleRadioButton('VISUAL')}
                        className="mb-2"
                    />
                    <RadioButton
                        label={"ear"}
                        icon={ear}
                        isSelected={_.includes(props.formData['disablityType'], 'HEARING')}
                        disabled={props.disabled}
                        changed={() => props.handleRadioButton('HEARING')}
                        className="mb-2"
                    />
                </div>
            </div>
            <div className={styles.horizontalLineInactive}></div>
            <div className={cx("mt-4 mb-2", styles.headingBold)}>other details</div>
            <div>
                <CheckBox
                    type="medium"
                    name='isNorthEastMember'
                    // className={cx(styles.centerAlign, styles.checkBoxAlign)}
                    value={props.formData['isNorthEastMember']}
                    onChange={() => props.handleCheckBox('isNorthEastMember')}
                    disabled={props.disabled}
                    checkMarkStyle={styles.checkMarkStyle}
                />
                <span className={cx("ml-4", styles.headingGrey)}>member is from assam/meghalaya</span>
            </div>
        </div>
    )

}

const mapStateToProps = state => {
    return {
        EMP_MGMT_EPF_GENDER: state.empMgmt.empOnboard.onboard.staticData["EMP_MGMT_EPF_GENDER"],
        EMP_MGMT_EPF_TITLE: state.empMgmt.empOnboard.onboard.staticData["EMP_MGMT_EPF_TITLE"],
        EMP_MGMT_EPF_RELATION: state.empMgmt.empOnboard.onboard.staticData["EMP_MGMT_EPF_RELATION"],
        EMP_MGMT_EPF_MARITAL_STATUS: state.empMgmt.empOnboard.onboard.staticData["EMP_MGMT_EPF_MARITAL_STATUS"],
        EMP_MGMT_EPF_QUALIFICATION: state.empMgmt.empOnboard.onboard.staticData["EMP_MGMT_EPF_QUALIFICATION"],
        EMP_MGMT_EPF_COUNTRY_OF_ORIGIN: state.empMgmt.empOnboard.onboard.staticData["EMP_MGMT_EPF_COUNTRY_OF_ORIGIN"],
        EMP_MGMT_EPF_NATIONALITY: state.empMgmt.empOnboard.onboard.staticData["EMP_MGMT_EPF_NATIONALITY"]
    }
}

export default withRouter(connect(mapStateToProps, null)(EPFDocGeneration));