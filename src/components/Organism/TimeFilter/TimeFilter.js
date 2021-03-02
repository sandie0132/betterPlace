import React, { Component } from "react";
import styles from './TimeFilter.module.scss';
import _ from "lodash";
import cx from "classnames";
import arrowDown from '../../../assets/icons/greyDropdown.svg';
import arrowUp from '../../../assets/icons/dropdownArrow.svg';
import { TimeFilterConfig } from './TimeFilterConfig';
import DateRangeModal from '../../Molecule/DateRangeModal/DateRangeModal';
import editGrey from '../../../assets/icons/editOrgActive.svg';

class TimeFilter extends Component {
    
    state = {
        toggleDropdown: false,
        toggleDateRange: false,
        options: _.cloneDeep(TimeFilterConfig.timeFilters.options)
    }

    componentDidMount = () => {
        let value = _.cloneDeep(this.props.value);
        if (!(typeof value === 'string' || value instanceof String)) {
            let updatedOptions = _.cloneDeep(this.state.options);
            _.forEach(updatedOptions, function (option, index) {
                if (option.key === "customDateRange") {
                    updatedOptions[index]['option'] = value;
                    let fromDate = value.from.split("-").reverse().join(" • ")
                    let toDate = value.to.split("-").reverse().join(" • ")
                    updatedOptions[index]['optionLabel'] = fromDate + " - " + toDate;
                }
            })
            this.setState({ options: updatedOptions })
        }
    }



    handleSelect = (name, key) => {
        var newOption = _.filter(this.state.options, function (op) {
            return op.optionLabel === name;
        });
        let optionVal = newOption[0].option;

        if (key === "customDateRange") {
            this.toggleDateRange();
            this.setState({ currentValue: optionVal })
        }
        else {
            let initOptions = _.cloneDeep(TimeFilterConfig.timeFilters.options);
            this.setState({ options: initOptions, currentValue: optionVal });
            this.props.onChange(optionVal);
        }
    }

    toggleDateRange = (event) => {
        if (event) event.preventDefault();
        this.setState({ toggleDateRange: !this.state.toggleDateRange })
    }

    handleDataFromDateRange = (value) => {
        let updatedOptions = _.cloneDeep(this.state.options);
        _.forEach(updatedOptions, function (option, index) {
            if (option.key === "customDateRange") {
                updatedOptions[index]['option'] = value;
                let fromDate = value.from.split("-").reverse().join(" • ")
                let toDate = value.to.split("-").reverse().join(" • ")
                updatedOptions[index]['optionLabel'] = fromDate + " - " + toDate;
            }
        })

        this.setState({ options: updatedOptions })
        this.props.onChange(value);
    }


    getLabel = (val) => {
        var newOption = _.filter(this.state.options, function (op) {
            return _.isEqual(op.option, val);
        });

        if(!_.isEmpty(newOption[0]))  return newOption[0].optionLabel;
        else return null
       
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
        if (!this.state.toggleDropdown) {
            document.addEventListener('click', this.handleOutsideClick, false);
        } else {
            document.removeEventListener('click', this.handleOutsideClick, false);
        }
        this.setState(prevState => ({
            toggleDropdown: !prevState.toggleDropdown
        }));
    }

    render() {
        return (
            <React.Fragment >
                <div style={{ position: "relative", marginLeft: "0.5rem" }}>
                    {this.props.label ?
                        <div className={styles.SearchBy}>{this.props.label}</div> : null}
                    <div className={cx(styles.SearchOption, this.props.defaultColor, this.props.className)} onClick={this.handleClick}>
                        {!_.isEmpty(this.props.value) ?
                            <label className='mb-0' style={{ cursor: 'pointer' }}> {this.getLabel(this.props.value)}</label>
                            : <span>select option</span>}
                        {this.state.toggleDropdown ? <img src={arrowUp} className={styles.DropdownIcon} align='right' alt='' />
                            : <img src={arrowDown} className={styles.DropdownIcon} align='right' alt='' />}
                    </div>
                    <div ref={node => { this.node = node; }}>
                        {this.state.toggleDropdown ?
                            <div className={styles.searchDropdown} onClick={this.handleClick}>
                                {this.state.options.map((option, index) => {
                                    return (
                                        <div key={index}>
                                            <label className={cx('mb-0', styles.Options)} onClick={() => this.handleSelect(option.optionLabel, option.key)} ref={dropDownDiv => this.dropDownDiv = dropDownDiv}> {option.optionLabel}
                                                <span>{option.key === "customDateRange" && option.optionLabel !== "custom date range" ? <img src={editGrey} alt="edit" style={{ paddingLeft: "8px", paddingBottom: "5px" }} /> : null}</span></label>
                                        </div>
                                    )
                                })
                                }
                            </div>
                            : null
                        }

                        {this.state.toggleDateRange ?
                            <DateRangeModal
                                toggle={this.toggleDateRange}
                                onChange={this.handleDataFromDateRange}
                                value={this.state.currentValue}


                            />
                            : null}
                    </div>
                </div>
            </React.Fragment >
        )
    }
}

export default TimeFilter;