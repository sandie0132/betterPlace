import React from 'react';
import cx from 'classnames';
import last from 'lodash/last';
import styles from './copyDropDown.module.scss';
import Checkbox from '../../../../../../../components/Atom/CheckBox/CheckBox';

const isPropsEqual = (prev, next) => JSON.stringify(prev.config)
        === JSON.stringify(next.config);

const ConfigDropDown = ({ onChange, config, checkboxes }) => (
  <div className={cx(styles.copyContainer)}>
    <div className={cx(styles.options)}>
      {checkboxes.map((checkbox) => (
        !checkbox.hide
        && (
        <div className={cx(styles.checkBox)}>
          <Checkbox
            type="medium"
            value={config.includes(checkbox.value)}
            onChange={() => onChange(checkbox.value)}
            disabled={false}
            className={styles.PositionRelative}
          />
          <span className={cx('pl-4')}>{checkbox.value}</span>
        </div>
        )
      ))}
    </div>
    {last(checkboxes).hide
    && (
    <div className="pt-1">
      <span style={{ fontStyle: 'italic', cursor: 'pointer' }} role="button" tabIndex="0" aria-hidden onClick={() => onChange('copy entire week')}>
        {last(checkboxes).value}
      </span>
    </div>
    )}

  </div>
);
export default React.memo(ConfigDropDown, isPropsEqual);
