/* eslint-disable no-return-assign */
import React, { Component } from 'react';
import _ from 'lodash';
import cx from 'classnames';
import styles from './SmallDropDown.module.scss';
import arrowDown from '../../../assets/icons/greyDropdown.svg';
import arrowUp from '../../../assets/icons/dropdownArrow.svg';

class SmallDropDown extends Component {
  // container = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      toggleDropdown: false,
    };
  }

    handleClient = (name) => {
      const { Options, changed } = this.props;
      const newOption = _.filter(Options, (op) => op.option === name);
      const optionVal = newOption[0].option;
      changed(optionVal);
    }

    getLabel = (val) => {
      const { Options } = this.props;
      const newOption = _.filter(Options, (op) => op.option === val);
      return newOption[0].optionLabel;
    }

    getCustomLabel = (val) => {
      const { Options } = this.props;
      const newOption = _.filter(Options, (op) => op.option === val);
      return newOption[0].customLabel;
    }

    handleOutsideClick = (e) => {
      if (!_.isEmpty(this.node)) {
        if (this.node.contains(e.target)) {
          return;
        }
        this.handleClick();
      }
    }

    handleClick = (event) => {
      if (event) {
        event.preventDefault();
      }
      const { toggleDropdown } = this.state;
      if (!toggleDropdown) {
        document.addEventListener('click', this.handleOutsideClick, false);
      } else {
        document.removeEventListener('click', this.handleOutsideClick, false);
      }
      this.setState((prevState) => ({
        toggleDropdown: !prevState.toggleDropdown,
      }));
    }

    render() {
      let options = [];

      // filterOptionsBy = {key1: [value1, value2], key2: [value3, value4]}
      const thisRef = this;
      const {
        filterOptionsBy,
        Options,
        className,
        label,
        defaultColor,
        value,
        placeholder,
        dropdownMenu,
        disabled,
      } = this.props;
      const { toggleDropdown } = this.state;

      if (!_.isEmpty(filterOptionsBy)) {
        _.forEach(Options, (option) => {
          let showOption = true;
          if (showOption) {
            _.forEach(thisRef.props.filterOptionsBy, (filterValue, filterKey) => {
              if (!_.includes(filterValue, option[filterKey])) {
                if (showOption) showOption = false;
              }
            });
          }
          if (showOption) options.push(option);
        });
      } else {
        options = _.cloneDeep(Options);
      }

      return (
        <>
          <div
            style={{ position: 'relative' }}
            className={cx(className, {
              [`${styles.disabled}`]: disabled,
            })}
          >
            {label
              ? <div className={styles.SearchBy}>{label}</div> : null}
            <div className={cx(styles.SearchOption, defaultColor)} onClick={this.handleClick} role="button" tabIndex="0" aria-hidden>
              {value !== ''
                ? (
                  <label htmlFor={this.getLabel(value)} className="mb-0" style={{ cursor: 'pointer' }}>
                    <span>
                      {this.getLabel(value)}
                      {this.getCustomLabel(value)}
                    </span>
                  </label>
                )
                : <span>{placeholder || 'select option'}</span>}
              {toggleDropdown ? <img src={arrowUp} className={styles.DropdownIcon} align="right" alt="" />
                : <img src={arrowDown} className={styles.DropdownIcon} align="right" alt="" />}
            </div>
            <div ref={(node) => { this.node = node; }}>
              {toggleDropdown
                ? (
                  <div className={cx(styles.searchDropdown, dropdownMenu)} onClick={this.handleClick} role="button" tabIndex="0" aria-hidden>
                    {options.map((option) => (
                      <div key={option.optionLabel}>
                        <label htmlFor={option.optionLabel} className={cx('mb-0', styles.Options)} onClick={() => this.handleClient(option.option)} ref={(dropDownDiv) => this.dropDownDiv = dropDownDiv} aria-hidden>
                          <span>
                            {option.optionLabel}
                            {option.customLabel}
                          </span>
                        </label>

                      </div>
                    ))}
                  </div>
                )
                : null}
            </div>
          </div>
        </>
      );
    }
}

export default SmallDropDown;
