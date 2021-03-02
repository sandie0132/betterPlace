/* eslint-disable react/no-did-update-set-state */
import React, { Component } from 'react';
import cx from 'classnames';
import _ from 'lodash';
import RadioButton from '../../Molecule/RadioButton/RadioButton';
import styles from './RadioButtonGroup.module.scss';

class RadioButtonGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectOptions: [],
    };
  }

  componentDidMount() {
    const { selectItems, value } = this.props;
    const updatedSelectedOptions = selectItems.map((item) => {
      if (item.value === value) {
        return ({
          ...item,
          isSelected: true,
        });
      }
      return ({
        ...item,
        isSelected: false,
      });
    });
    this.setState({
      selectOptions: updatedSelectedOptions,
    });
  }

  componentDidUpdate(prevProps) {
    const { value, selectItems } = this.props;
    if (value !== prevProps.value) {
      const updatedSelectedOptions = selectItems.map((item) => {
        if (item.value === value) {
          return ({
            ...item,
            isSelected: true,
          });
        }
        return ({
          ...item,
          isSelected: false,
        });
      });
      this.setState({
        selectOptions: updatedSelectedOptions,
      });
    }
  }

    onChangedHandler = (targetIndex) => {
      const { selectItems, onSelectOption } = this.props;
      let selectedValue = null;

      if (!_.isEmpty(selectItems)) {
        _.forEach(selectItems, (val, index) => {
          if (index === targetIndex) {
            selectedValue = val.value;
          }
        });
      }

      onSelectOption(selectedValue);
    }

    render() {
      const { selectOptions } = this.state;
      const {
        disabled, type, labelColor, label, required, className, wrapperClass,
      } = this.props;
      const RadioButtons = selectOptions.map((values, index) => (
        <RadioButton
          key={values.label}
          label={values.label}
          icon={values.icon}
          value={values.value}
          isSelected={values.isSelected}
          disabled={disabled}
          changed={() => this.onChangedHandler(index)}
          className="mb-2"
          type={type}
        />
      ));
      return (
        <div className={wrapperClass}>
          <label
            htmlFor={label}
            style={disabled ? { cursor: 'default' } : { cursor: 'pointer' }}
            className={cx(styles.Label, labelColor)}
          >
            {label}
&nbsp;
            <span className={styles.requiredStar}>{required ? '*' : null}</span>
          </label>
          <div className={cx('row', className)}>

            {RadioButtons}

          </div>
        </div>

      );
    }
}

export default RadioButtonGroup;
