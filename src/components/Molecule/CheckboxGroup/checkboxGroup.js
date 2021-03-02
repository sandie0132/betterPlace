import React from 'react';
import cx from 'classnames';
import without from 'lodash/without';
import styles from './checkboxGroup.module.scss';
import Checkbox from '../../Atom/CheckBox/CheckBox';

const {
  checkboxWrapper, labelStyle, requiredStar, disabledClass,
} = styles;

const CheckboxGroup = ({
  wrapperClass, label, labelClass, required, options, value, type, onChange, disabled,
}) => {
  const onClickCheckBox = (val) => {
    let newValues = [...value];
    const arrayIndex = newValues.indexOf(val);
    if (arrayIndex > -1) {
      newValues = without(newValues, val);
    } else {
      newValues.push(val);
    }
    onChange(newValues);
  };
  return (
    <div className={cx(wrapperClass, checkboxWrapper, 'd-flex flex-column my-1', { [`${disabledClass}`]: disabled })}>
      <label className={cx(labelStyle, labelClass)} htmlFor={label}>
        {label}
        <span className={requiredStar}>{required && '*' }</span>
        <div className="d-flex flex-row mt-4">
          {options.map((opt) => (
            <Checkbox
              key={opt.value}
              type={type}
              name={opt.value}
              label={opt.label}
              value={value.includes(opt.value)}
              onChange={() => onClickCheckBox(opt.value)}
            />
          ))}
        </div>
      </label>
    </div>
  );
};
export default CheckboxGroup;
