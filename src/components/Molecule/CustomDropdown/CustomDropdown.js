import React, { Component } from "react";
import styles from './CustomDropdown.module.scss';
import _ from "lodash";
import cx from "classnames";
import arrowDown from '../../../assets/icons/greyDropdown.svg';
import arrowUp from '../../../assets/icons/dropdownArrow.svg';

class CustomDropdown extends Component {

    state = {
        showDropdown: false
    }

    handleSelectedOption = (name) => {
        this.props.changed(name);
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
        } else {
            document.removeEventListener('click', this.handleOutsideClick, false);
        }
        this.setState(prevState => ({
            showDropdown: !prevState.showDropdown
        }));
    }

    render() {
        return (
            <React.Fragment>
                <div className={cx(styles.Custom, this.props.className)} disabled={this.props.disabled} ref={node => { this.node = node; }}>
                    <div className={cx(styles.SearchOption)} onClick={this.handleClick}>
                        {this.props.searchIcon
                            ? <span className="position-relative">
                                <img src={this.props.searchIcon} alt='' />
                                <span className={cx('ml-1', styles.separator)} />
                            </span> : null}
                        <label className={cx(styles.hover, 'mb-0', this.props.searchIcon ? 'ml-1' : '')}>&ensp;{this.props.value}</label>
                        <img src={arrowDown} className={styles.DropdownIconDown} align='right' alt='' />
                    </div>
                    {this.state.showDropdown ?
                        <div className={cx(this.props.empList ? cx(styles.empListDropdown) : cx(styles.searchDropdown))} onClick={this.handleClick}>
                            {this.props.options.map((option, index) => {
                                return (
                                    <div key={index}>
                                        {index === 0 ?
                                            (['select view type', 'select view/download', 'select search type', 'select service'].includes(option.optionLabel) ?
                                                <React.Fragment>
                                                    <div className={cx(styles.DefaultOption)}>
                                                        <label className={cx(styles.hover, 'mb-0')}>&ensp;{option.optionLabel}</label>
                                                        <img src={arrowUp} className={styles.DropdownIconUp} align='right' alt='' />
                                                    </div>
                                                    <hr className={styles.HorizontalLine} />
                                                </React.Fragment>
                                                : ['select a vendor'].includes(option.optionLabel) ?
                                                    <React.Fragment>
                                                        <div className={cx(styles.DefaultOption)} onClick={() => this.handleSelectedOption(option.optionLabel)}>
                                                            <label className={cx(styles.hover, 'mb-0')}>&ensp;{option.optionLabel}</label>
                                                            <img src={arrowUp} className={styles.DropdownIconUp} align='right' alt='' />
                                                        </div>
                                                        <hr className={styles.HorizontalLine} />
                                                    </React.Fragment>
                                                :
                                                <React.Fragment>
                                                    <div className={cx(styles.FirstOption)} onClick={() => this.handleSelectedOption(option.optionLabel)}>
                                                        {/* {this.props.searchIcon ? <img src={this.props.searchIcon} alt=''/> : null} */}
                                                        <label className={cx(styles.hover, 'mb-0')}>&ensp;{option.optionLabel}</label>
                                                        <img src={arrowUp} className={styles.DropdownIconUp} align='right' alt='' />
                                                    </div>
                                                    <hr className={styles.HorizontalLine} />
                                                </React.Fragment>
                                            )
                                            :
                                            index === this.props.options.length - 1 ?
                                                <div className={cx("row no-gutters mb-0",styles.LastOption)} onClick={() => this.handleSelectedOption(option.optionLabel)}>
                                                    {this.props.icon ? <img className={styles.img} src={this.props.icon} alt="img"/> : ""}
                                                    <label>&ensp;{option.optionLabel}</label>
                                                </div>
                                                :
                                                <div className={cx("row no-gutters mb-0",styles.Options)} onClick={() => this.handleSelectedOption(option.optionLabel)}>
                                                    {this.props.icon ? <img className={styles.img} src={this.props.icon} alt="img"/> : ""}
                                                    <label>&ensp;{option.optionLabel}</label>
                                                </div>
                                        }
                                    </div>
                                )
                            })}
                        </div>
                    : null}
                </div>
            </React.Fragment>
        )
    }
}

export default CustomDropdown;