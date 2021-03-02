import React from 'react';
import cx from 'classnames';
import { get, isEmpty } from 'lodash';
import { Input } from 'react-crux';
import styles from './CreateShiftInput.module.scss';
import DropDownSmall from '../../../../../../components/Atom/SmallDropDown/SmallDropDown';
import time from '../../../../../../assets/icons/startTime.svg';
import pValue from '../../../../../../assets/icons/pValueBox.svg';
import hValue from '../../../../../../assets/icons/hValueBox.svg';
import timeTolerance from '../../../../../../assets/icons/timeToleranceBox.svg';
import forceLogout from '../../../../../../assets/icons/forceLogoutBox.svg';

const CreateShiftInput = ({
  formData,
  handleInputChange,
  errors,
  handleError,
  validation,
  message,
  triggeredSection,
}) => (
  <div className="d-flex flex-column">
    <div style={{ marginLeft: '-10px', paddingBottom: '10px' }}>
      <Input
        name="shiftName"
        className={cx(styles.Input)}
        label="shift name"
        required
        placeholder="enter shift name"
        value={get(formData, 'shiftName', '')}
        onChange={(value) => handleInputChange(value, 'shiftName', null)}
        validation={validation.shiftName}
        message={message.shiftName}
        errors={errors.shiftName}
        onError={(err) => handleError(err, 'shiftName')}
      />
    </div>
    <div className="d-flex flex-row">
      <div className="d-flex flex-column" style={{ width: '254px' }}>
        <span className={styles.Label}>
          shift start time&nbsp;
          <span className={styles.requiredStar}>*</span>
        </span>
        <div className="d-flex flex-row">
          <img src={time} alt="time" />
          <Input
            name="startTimeHour"
            placeholder="00"
            className={cx(styles.inputContainer)}
            value={get(formData, 'startTime.hours', '')}
            onChange={(value) => handleInputChange(value, 'hours', 'startTime')}
            validation={validation.startShiftTime}
            message={message.startShiftTime}
            errors={!isEmpty(errors.startTime) && { error: '' }}
            onError={(err) => handleError(err, 'startTime')}
            customValidators={[get(formData, 'startTime', {})]}
          />
          <span className={cx(styles.Label, 'mt-3 pt-1')}>:</span>
          <Input
            name="startTimeMinute"
            placeholder="00"
            className={cx(styles.inputContainer)}
            value={get(formData, 'startTime.minutes', '')}
            onChange={(value) => handleInputChange(value, 'minutes', 'startTime')}
            validation={validation.startShiftTime}
            message={message.startShiftTime}
            errors={!isEmpty(errors.startTime) && { error: '' }}
            onError={(err) => handleError(err, 'startTime')}
            customValidators={[get(formData, 'startTime', {})]}
          />
          <DropDownSmall
            Options={[
              { option: 'AM', optionLabel: 'AM' },
              { option: 'PM', optionLabel: 'PM' },
            ]}
            dropdownMenu={styles.dropdownMenu}
            className={cx(styles.dropDownStyle, 'mt-2')}
            name="startTimePeriod"
            value={get(formData, 'startTime.period', 'AM')}
            changed={(value) => handleInputChange(value, 'period', 'startTime')}
            defaultColor={cx(styles.optionDropdown)}
          />

        </div>
        <div className="d-flex flex-column">
          {Object.values(get(errors, 'startTime', {})).map((val) => <span key={val} className={styles.errorMessage}>{val}</span>)}
        </div>
      </div>

      <div className="d-flex flex-column" style={{ marginLeft: '32px' }}>
        <span className={styles.Label}>
          shift end time&nbsp;
          <span className={styles.requiredStar}>*</span>
        </span>
        <div className="d-flex flex-row">
          <img src={time} alt="time" />
          <Input
            name="endTimeHour"
            placeholder="00"
            className={cx(styles.inputContainer)}
            value={get(formData, 'endTime.hours', '')}
            onChange={(value) => handleInputChange(value, 'hours', 'endTime')}
            validation={validation.endShiftTime}
            message={message.endShiftTime}
            errors={!isEmpty(errors.endTime) && { error: '' }}
            onError={(err) => handleError(err, 'endTime')}
            customValidators={[get(formData, 'endTime', {})]}
          />
          <span className={cx(styles.Label, 'mt-3 pt-1')}>:</span>
          <Input
            name="endTimeMinute"
            placeholder="00"
            className={cx(styles.inputContainer)}
            value={get(formData, 'endTime.minutes', '')}
            onChange={(value) => handleInputChange(value, 'minutes', 'endTime')}
            validation={validation.endShiftTime}
            message={message.endShiftTime}
            errors={!isEmpty(errors.endTime) && { error: '' }}
            onError={(err) => handleError(err, 'endTime')}
            customValidators={[get(formData, 'endTime', {})]}
          />
          <DropDownSmall
            Options={[
              { option: 'AM', optionLabel: 'AM' },
              { option: 'PM', optionLabel: 'PM' },
            ]}
            dropdownMenu={styles.dropdownMenu}
            className={cx(styles.dropDownStyle, 'mt-2')}
            name="endTimePeriod"
            value={get(formData, 'endTime.period', '')}
            changed={(value) => handleInputChange(value, 'period', 'endTime')}
            defaultColor={cx(styles.optionDropdown)}
          />

        </div>
        <div className="d-flex flex-column">
          {Object.values(get(errors, 'endTime', {})).map((val) => <span key={val} className={styles.errorMessage}>{val}</span>)}
        </div>
      </div>
    </div>
    {/* //// P value and H value  */}
    <div className="d-flex flex-row mt-3">
      <div className="d-flex flex-column" style={{ width: '254px' }}>
        <span className={styles.Label}>p value</span>
        <div className="d-flex flex-row">
          <img src={pValue} alt="time" />
          <Input
            name="pValueHour"
            placeholder="00"
            className={cx(styles.inputContainer)}
            value={get(formData, 'pValue.hours', '')}
            onChange={(value) => handleInputChange(value, 'hours', 'pValue')}
            validation={validation.pValue}
            message={message.pValue}
            triggerValidation={triggeredSection === 'startTime' || triggeredSection === 'endTime'}
            errors={!isEmpty(errors.pValue) && { error: '' }}
            onError={(err) => handleError(err, 'pValue')}
            customValidators={[get(formData, 'pValue', {})]}
          />
          <span className={cx(styles.Label, 'mt-3 pt-1')}>hr</span>
          <Input
            name="pValueMinute"
            placeholder="00"
            className={cx(styles.inputContainer)}
            value={get(formData, 'pValue.minutes', '')}
            onChange={(value) => handleInputChange(value, 'minutes', 'pValue')}
            validation={validation.pValue}
            message={message.pValue}
            errors={!isEmpty(errors.pValue) && { error: '' }}
            onError={(err) => handleError(err, 'pValue')}
            customValidators={[get(formData, 'pValue', {})]}
          />
          <span className={cx(styles.Label, 'mt-3 pt-1')}>min</span>

        </div>
        <div className="d-flex flex-column">
          {Object.values(get(errors, 'pValue', {})).map((val) => <span key={val} className={styles.errorMessage}>{val}</span>)}
        </div>
      </div>

      <div className="d-flex flex-column" style={{ marginLeft: '34px', width: '254px' }}>
        <span className={styles.Label}>h value</span>
        <div className="d-flex flex-row">
          <img src={hValue} alt="time" />
          <Input
            name="hValueHour"
            placeholder="00"
            className={cx(styles.inputContainer)}
            value={get(formData, 'hValue.hours', '')}
            onChange={(value) => handleInputChange(value, 'hours', 'hValue')}
            triggerValidation={triggeredSection === 'pValue'}
            validation={validation.hValue}
            message={message.hValue}
            errors={!isEmpty(errors.hValue) && { error: '' }}
            onError={(err) => handleError(err, 'hValue')}
            customValidators={[get(formData, 'pValue', {}), get(formData, 'hValue', {})]}
          />
          <span className={cx(styles.Label, 'mt-3 pt-1')}>hr</span>
          <Input
            name="hValueMinute"
            placeholder="00"
            className={cx(styles.inputContainer)}
            value={get(formData, 'hValue.minutes', '')}
            onChange={(value) => handleInputChange(value, 'minutes', 'hValue')}
            validation={validation.hValue}
            message={message.hValue}
            errors={!isEmpty(errors.hValue) && { error: '' }}
            onError={(err) => handleError(err, 'hValue')}
            customValidators={[get(formData, 'pValue', {}), get(formData, 'hValue', {})]}
          />
          <span className={cx(styles.Label, 'mt-3 pt-1')}>min</span>

        </div>
        <div className="d-flex flex-column">
          {Object.values(get(errors, 'hValue', {})).map((val) => <span key={val} className={styles.errorMessage}>{val}</span>)}
        </div>
      </div>
    </div>

    {/* ////time tolerance and force logout */}
    <div className="d-flex flex-row mt-3">
      <div className="d-flex flex-column" style={{ width: '254px' }}>
        <span className={styles.Label}>time tolerance</span>
        <div className="d-flex flex-row">
          <img src={timeTolerance} alt="time" />
          <Input
            name="timeTolerance"
            placeholder="00"
            className={cx(styles.inputContainer)}
            value={get(formData, 'timeTolerance.minutes', '')}
            triggerValidation={triggeredSection === 'pValue' || triggeredSection === 'startTime' || triggeredSection === 'endTime'}
            onChange={(value) => handleInputChange(value, 'minutes', 'timeTolerance')}
            validation={validation.timeTolerance}
            message={message.timeTolerance}
            errors={!isEmpty(errors.timeTolerance) && { error: '' }}
            onError={(err) => handleError(err, 'timeTolerance')}
            customValidators={[get(formData, 'pValue', {}), get(formData, 'timeTolerance', {})]}
          />
          <span className={cx(styles.Label, 'mt-3 pt-1')}>min</span>
        </div>
        <div className="d-flex flex-column">
          {Object.values(get(errors, 'timeTolerance', {})).map((val) => <span key={val} className={styles.errorMessage}>{val}</span>)}
        </div>
      </div>

      <div className="d-flex flex-column" style={{ marginLeft: '34px', width: '254px' }}>
        <span className={styles.Label}>force logout option</span>
        <div className="d-flex flex-row">
          <img src={forceLogout} alt="time" style={{ marginTop: '8px', marginRight: '8px' }} />
          <DropDownSmall
            Options={[
              { optionLabel: 'no', option: false },
              { optionLabel: 'yes', option: true },
            ]}
            dropdownMenu={styles.dropdownMenuLarge}
            className={cx(styles.dropDownStyleLarge, 'mt-2')}
            value={get(formData, 'isForcedLogoutEnabled', false)}
            changed={(value) => handleInputChange(value, 'isForcedLogoutEnabled', null)}
            defaultColor={cx(styles.optionDropdownLarge)}
          />
        </div>
      </div>
    </div>

  </div>
);

export default CreateShiftInput;
