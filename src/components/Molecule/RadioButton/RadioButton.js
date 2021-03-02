/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-nested-ternary */
import React from 'react';
import cx from 'classnames';
import styles from './RadioButton.module.scss';

const RadioButton = ({
  icon, className, disabled, changed, isSelected, label, type,
}) => {
  switch (type) {
    case 'simple':
      return (
        <div className="d-flex flex-row">
          <input
            className={styles.RadioButtonSimple}
            style={disabled ? { cursor: 'default' } : { cursor: 'pointer' }}
            type="radio"
            name="gender"
            value={label}
            onChange={changed}
            checked={isSelected}
          />
          <label className={styles.LabelActiveSimple} htmlFor={label}>{label}</label>
        </div>
      );
    default:
      return (
        <div
          className={cx(styles.RadioButtonContainer, className)}
          style={disabled ? { cursor: 'default' } : { cursor: 'pointer' }}
          onClick={disabled ? null : changed}
          tabIndex={0}
          role="button"
          aria-hidden
        >
          {icon
      && (
        <img
          src={icon}
          alt="icon"
          className={isSelected ? styles.IconActive : styles.IconDisabled}
        />
      )}
          <label
            htmlFor={label}
            className={disabled ? styles.inactiveLabel
              : isSelected ? styles.LabelActive : styles.LabelDisabled}
          >
            {label}
          </label>
          <input className={styles.RadioButton} style={disabled ? { cursor: 'default' } : { cursor: 'pointer' }} type="radio" disabled={disabled} onChange={changed} checked={isSelected || ''} />
        </div>
      );
  }
};

export default RadioButton;
