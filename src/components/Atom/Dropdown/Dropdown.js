import React, { Component } from "react";
import styles from './Dropdown.module.scss';
import _ from "lodash";
import cx from "classnames";
import arrowDown from '../../../assets/icons/greyDropdown.svg';
import arrowUp from '../../../assets/icons/dropdownArrow.svg';
import scrollStyle from '../../Atom/ScrollBar/ScrollBar.module.scss';
import Loader from '../../Organism/Loader/Loader';

class Dropdown extends Component {

    state = {
        showDropdown: false
    }

    handleSelectedOption = (option) => {
        this.props.changed(option);
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
        if (!this.state.showDropdown) {
            document.addEventListener('click', this.handleOutsideClick, false);
        }
        else {
            document.removeEventListener('click', this.handleOutsideClick, false);
        }
        this.setState(prevState => ({
            showDropdown: !prevState.showDropdown,
        }));
    }

    shortenDisplayName = (displayName) => {
        if (displayName.length > 25) {
            const updatedDisplayName = displayName.substring(0, 25) + '...';
            return (updatedDisplayName);
        }
        return (displayName);
    }

    render() {
        let defaultOptions = [];

        if (!_.isEmpty(this.props.defaultOption)) {
            defaultOptions.push(this.props.defaultOption)
        }

        let options = this.props.options;

        return (
            <React.Fragment>
                {this.props.label ?
                    <div className={cx('row no-gutters mb-2', styles.Label)}>
                        {this.props.label}
                    </div>
                    : null}
                <div className={cx(styles.Custom, this.props.className)} disabled={this.props.disabled} ref={node => { this.node = node; }}>
                    {this.state.showDropdown ?
                        <React.Fragment>
                            <div className={cx(styles.Dropdown, scrollStyle.scrollbar)} onClick={this.handleClick}>
                                {!_.isEmpty(options) ?
                                    options.map((option, index) => {
                                        return (
                                            <div key={index}>
                                                {index === 0 ?
                                                    (!_.isEmpty(defaultOptions) && defaultOptions.includes(option.label) ?
                                                        <div className={cx(styles.DefaultOption)}>
                                                            <label className={cx(styles.hover, 'mb-0')}>{option.label}</label>
                                                            <img src={arrowUp} className={styles.DropdownIconUp} align='right' alt='' />
                                                        </div>
                                                        :
                                                        <div className={cx(option.label.length > 25 ? 'pr-0' : null, styles.FirstOption)} onClick={() => this.handleSelectedOption(option)}>
                                                            <label className={cx(styles.hover, 'mb-0')}>{option.label}</label>
                                                            <img src={arrowUp} className={styles.DropdownIconUp} align='right' alt='' />
                                                        </div>
                                                    )
                                                    :
                                                    index === options.length - 1 ?
                                                        <label className={cx('mb-0', styles.LastOption)} onClick={() => this.handleSelectedOption(option)}>
                                                            {option.label}
                                                        </label>
                                                        :
                                                        <label className={cx('mb-0', styles.Options)} onClick={() => this.handleSelectedOption(option)}>
                                                            {option.label}
                                                        </label>
                                                }

                                                {/* add horizontal line in dropdown at specific index*/}
                                                {this.props.showDemarkation && this.props.horizontalLineIndex.includes(index) ?
                                                    <hr className={cx(styles.Demarkation)} />
                                                    : null
                                                }
                                            </div>
                                        )
                                    })
                                    : null}
                            </div>
                            <div className={cx(styles.SelectedOption)} onClick={this.handleClick}>
                                <label className={cx(styles.hover, 'mb-0')}>&ensp;{this.shortenDisplayName(this.props.value)}</label>
                                {this.props.showLoader && !this.props.disabled ?
                                    <Loader type='stepLoaderBlue' className={this.props.filters ? styles.FilterLoader : styles.Loader} /> :
                                    <img src={arrowDown} className={styles.DropdownIconDown} align='right' alt='' />
                                }
                                {/* <img src={arrowDown} className={styles.DropdownIconDown} align='right' alt='' /> */}
                            </div>
                        </React.Fragment>
                        :
                        <div className={this.props.showLoader ? cx(styles.SelectedOption, styles.ProgressCursor) : cx(styles.SelectedOption, styles.hover)}
                            onClick={this.props.showLoader ? null : this.handleClick}>

                            <label className={cx(styles.hover, 'mb-0')}>&ensp;{this.shortenDisplayName(this.props.value)}</label>
                            {this.props.showLoader && !this.props.disabled ?
                                <Loader type='stepLoaderBlue' className={this.props.filters ? styles.FilterLoader : styles.Loader} /> :
                                <img src={arrowDown} className={styles.DropdownIconDown} align='right' alt='' />
                            }
                        </div>
                    }
                </div>
            </React.Fragment>
        )
    }
}

export default Dropdown;