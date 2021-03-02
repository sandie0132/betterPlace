import React from 'react';
import _ from 'lodash';
import cx from 'classnames';
import styles from './TextArea.module.scss';

const TextArea = ({
  className, rows, type, placeholder, disabled, value, changed, maxLength, label,
}) => (
  <div className={cx(className, styles.TextArea, 'd-flex flex-column-reverse my-1')}>
    <textarea
      className={styles.InputElement}
      rows={rows}
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      value={_.isEmpty(value) ? '' : value}
      onChange={changed}
      maxLength={_.isEmpty(maxLength) ? '60' : maxLength}
    />
    <div className="d-flex flex-row">
      {label
        ? (
          <span className={value.length ? cx(styles.LabelWithValue) : cx(styles.Label)}>
            {label}
          </span>
        )
        : ''}
    </div>
  </div>
);

export default TextArea;
