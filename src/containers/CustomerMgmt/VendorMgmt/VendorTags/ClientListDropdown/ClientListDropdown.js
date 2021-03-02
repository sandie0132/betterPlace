/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import _ from 'lodash';
import cx from 'classnames';
import ClickAwayListener from 'react-click-away-listener';
import styles from './ClientListDropdown.module.scss';
import scrollStyle from '../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import Loader from '../../../../../components/Organism/Loader/Loader';

import arrowDown from '../../../../../assets/icons/greyDropdown.svg';
import arrowUp from '../../../../../assets/icons/dropdownArrow.svg';
import search from '../../../../../assets/icons/search.svg';

class ClientListDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDropdown: false,
      queryString: '',
    };
  }

  handleSelectedOption = (option) => {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.onChange(option.name, option.orgId);
    this.handleClickAway();
  }

  handleClickAway = () => {
    this.setState({ showDropdown: false, queryString: '' });
  }

  toggleDropdown = () => {
    const { showDropdown } = this.state;
    this.setState({ showDropdown: !showDropdown });
  }

  handleInputChange = (event) => {
    const key = event.target.value;
    if (key.length > 0) {
      // eslint-disable-next-line react/destructuring-assignment
      // this.props.searchClientByName(key);
    }
    this.setState({ queryString: key, showDropdown: true });
  }

  render() {
    const {
      className, disabled, value, options, orgId, firstSectionLabel, secondSectionLabel, showLoader,
      // icon,
    } = this.props;
    const { showDropdown, queryString } = this.state;
    let clientOptions = [];

    if (!_.isEmpty(options)) {
      clientOptions = options.filter((op) => op.orgId !== orgId);
      if (!_.isEmpty(queryString)) {
        clientOptions = clientOptions
          .filter((op) => op.name.toLowerCase().includes(queryString));
      }
    }

    return (
      <>
        <div
          className={cx(styles.Custom, className)}
          disabled={disabled}
        >
          <div className={cx(styles.SearchOption)} onClick={this.toggleDropdown} role="button" aria-hidden="true">
            <label className={cx(styles.hover, 'mb-0')}>
              {value}
            </label>
            {showLoader
              ? <Loader type="stepLoaderBlue" className={styles.Loader} />
              : <img src={arrowDown} className={styles.DropdownIconDown} align="right" alt="" />}
          </div>
          {showDropdown && !_.isEmpty(options)
            ? (
              <ClickAwayListener onClickAway={this.handleClickAway}>
                <div className={cx(styles.searchDropdown, scrollStyle.scrollbar)} aria-hidden="true" role="button">
                  <div className={cx(styles.FirstOption)} role="button" onClick={this.toggleDropdown}>
                    <label className={cx(styles.hover, 'mb-0')}>
                      {value}
                    </label>
                    <img src={arrowUp} className={styles.DropdownIconDown} align="right" alt="" />
                  </div>
                  <div className={cx(styles.SearchField)}>
                    <img src={search} className="mr-2 my-auto" style={{ height: '16px' }} alt="" />
                    <input
                      type="text"
                      placeholder="search by name"
                      value={queryString}
                      onPaste={(e) => this.handleInputChange(e)}
                      onChange={(e) => this.handleInputChange(e)}
                      className={styles.NoBorder}
                    />
                  </div>
                  <hr className={styles.HorizontalLine} />
                  <div style={{ marginTop: '3.5rem' }}>
                    {_.isEmpty(queryString)
                      ? (
                        <>
                          <div className={styles.HrLine}>
                            <span className={styles.Padding}>{firstSectionLabel}</span>
                          </div>
                          <div
                            className={cx('row no-gutters mb-0', styles.Options)}
                            onClick={() => this.handleSelectedOption(options[0])}
                            role="button"
                          >
                            <label className="mb-0">
                              {options[0].name}
                            </label>
                          </div>
                        </>
                      )
                      : ''}
                    {!_.isEmpty(clientOptions)
                      ? (
                        <div className={styles.HrLine}>
                          <span className={styles.Padding}>{secondSectionLabel}</span>
                        </div>
                      ) : null}
                    {clientOptions.map((option, index) => (
                      <div key={option.name}>
                        <div
                          className={cx('row no-gutters mb-0',
                            (index === options.length - 1 ? styles.LastOption : styles.Options))}
                          onClick={() => this.handleSelectedOption(option)}
                          role="button"
                        >
                          <label className="mb-0">
                            {option.name}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ClickAwayListener>
            )
            : null}
        </div>
      </>
    );
  }
}

export default ClientListDropdown;
