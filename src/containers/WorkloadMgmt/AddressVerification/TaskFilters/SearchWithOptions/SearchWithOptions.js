import React, { Component } from "react";
import { withRouter } from "react-router";
import _ from 'lodash';
import cx from 'classnames';
import styles from './SearchWithOptions.module.scss';
import scrollStyle from '../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';

import arrowDown from '../../../../../assets/icons/greyDropdown.svg';
import arrowUp from '../../../../../assets/icons/dropdownArrow.svg';
import search from '../../../../../assets/icons/search.svg';
import ClickAwayListener from "react-click-away-listener";


class SearchWithOptions extends Component {

    state = {
        queryString: '',
        showDropdown: false
    }

    toggleDropdown = () => {


        this.setState({ showDropdown: !this.state.showDropdown })
    }

    handleInputChange = (event) => {
        let key = event.target.value;
        if (key.length > 0) {

            if (!_.isEmpty(this.props.type) && this.props.type === "assign") {
                this.props.searchExecutive(key);
            }
        }

        this.setState({ queryString: key, showDropdown: true })
    }

    handleSelectedOption = (option) => {
        this.props.selectedAssignData(option);
        this.setState({ queryString: '', showDropdown: false })
    }

    handleClickAway = () => {
        this.setState({ showDropdown: false })
    }

    render() {

        let options = [];

        if (!_.isEmpty(this.props.type) && this.props.type === "client" && !_.isEmpty(this.state.queryString)) {
            let temp = this.props.searchExecutiveResults(this.state.queryString);
            options.push(...temp);
        }
        else if (!_.isEmpty(this.props.searchExecutiveResults) && !_.isEmpty(this.state.queryString)) {
            options.push(...this.props.searchExecutiveResults);
        }
        else if(!_.isEmpty(this.props.defaultOptions)) {
            options.push(...this.props.defaultOptions);
        }

        return (
            <React.Fragment>
                {this.state.showDropdown ?
                    <ClickAwayListener onClickAway={this.handleClickAway}>

                        <div className={cx(styles.Dropdown, scrollStyle.scrollbar)}>
                            <div className={cx(styles.SelectedOption)} onClick={this.toggleDropdown}>
                                <label className={cx(styles.hover, 'mb-0')}>&ensp;{this.props.value}</label>
                                <img src={arrowUp} className={styles.DropdownIconDown} align='right' alt='' />
                            </div>
                            <div className={cx('d-flex', styles.SearchField)}>
                                <img src={search} className='mr-2 my-auto' style={{ height: "16px" }} alt='' />
                                <input
                                    type='text'
                                    placeholder='search by name'
                                    value={this.state.queryString}
                                    onPaste={(e) => this.handleInputChange(e)}
                                    onChange={e => this.handleInputChange(e)}
                                    className={styles.NoBorder}
                                />
                            </div>

                            <div style={{ marginTop: '3rem' }}>
                                {options.map((option, index) => {
                                    return (
                                        <React.Fragment key={index}>
                                            {
                                                index === 0 ?
                                                    <div className={cx(styles.FirstOption)} onClick={() => this.handleSelectedOption(option)}>
                                                        <label className={cx(styles.hover, 'mb-0')}>&ensp;{option.label ? option.label : option.firstName + " " + option.lastName}</label>
                                                    </div>
                                                    :
                                                    // index === options.length - 1 ?
                                                    //     <label className={cx('mb-0', styles.LastOption)} onClick={() => this.handleSelectedOption(option)}>
                                                    //         &ensp;{option.label ? option.label : option.firstName + " " + option.lastName}
                                                    //     </label>
                                                    //     :
                                                    <div>
                                                        <label className={cx('mb-0', styles.Options)} onClick={() => this.handleSelectedOption(option)}>
                                                            &ensp;{option.label ? option.label : option.firstName + " " + option.lastName}
                                                        </label>

                                                    </div>
                                            }
                                        </React.Fragment>
                                    )
                                })
                                }
                            </div>
                        </div>
                    </ClickAwayListener>
                    : null}

                <div className={cx(styles.SelectedOptionWithBorder)} onClick={this.toggleDropdown}>
                    <label className={cx(styles.hover, 'mb-0')}>&ensp;{this.props.value}</label>
                    <img src={this.state.showDropdown ? arrowUp : arrowDown} className={styles.DropdownIconDown} align='right' alt='' />
                </div>
            </React.Fragment>
        )
    }
}

export default withRouter(SearchWithOptions);