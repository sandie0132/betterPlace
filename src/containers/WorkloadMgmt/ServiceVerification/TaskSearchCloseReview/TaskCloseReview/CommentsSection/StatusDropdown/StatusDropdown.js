import React, { Component } from "react";
import styles from './StatusDropdown.module.scss';
import _ from "lodash";
import cx from "classnames";
import arrowUp from '../../../../../../../assets/icons/dropdownArrow.svg';
import { withTranslation } from "react-i18next";

class StatusDropdown extends Component {

    state = {
        showStatusDropdown: false
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.showDropdown !== this.props.showDropdown) {
            this.setState({ showStatusDropdown: this.props.showDropdown })
        }
    }

    handleSelectedOption = (name) => {
        let optionSelected = '', color = '';

        if (name === 'GREEN' || name === 'YELLOW' || name === 'RED') {
            optionSelected = name.toLowerCase() + ' case';
            color = name.toLowerCase();
        }
        else if (name === 'INSUFFICIENT_INFORMATION') {
            optionSelected = 'insufficient information';
            color = 'yellow';
        }
        else if (name === 'PROCEED_FOR_VERIFICATION') {
            optionSelected = 'proceed for verification';
            color = 'green';
        }
        else {
            optionSelected = name.toLowerCase().replace(/_/g, ' ');
            color = '';
        }
        this.props.changed(optionSelected, color);
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
        if (!this.state.showStatusDropdown) {
            document.addEventListener('click', this.handleOutsideClick, false);
        }
        else {
            document.removeEventListener('click', this.handleOutsideClick, false);
        }
        this.setState(prevState => ({
            showStatusDropdown: !prevState.showStatusDropdown
        }));
    }

    render() {
        const { t } = this.props;

        let statusType = [];
        if (!_.isEmpty(this.props.statusType)) {
            Object.entries(this.props.statusType).forEach(key => {
                statusType.push(key[0]);
            })
        }
        statusType[statusType.length] = 'select status';

        return (
            <React.Fragment>
                <div disabled={this.props.disabled} ref={node => { this.node = node; }}>
                    {this.state.showStatusDropdown && statusType.length > 0 ?
                        <div className={cx(this.props.className)} onClick={this.handleClick}>
                            {statusType.map((option, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        {index === statusType.length - 1 ?
                                            <React.Fragment>
                                                <hr className={styles.HorizontalLine} />
                                                <div className={cx(styles.defaultOption)}>
                                                    <label className={cx(styles.hover, 'mb-0')}>&ensp;{t('translation_docVerification:commentsSection.selectStatus')}</label>
                                                    <img src={arrowUp} className={styles.DropdownIconUp} align='right' alt='' />
                                                </div>
                                            </React.Fragment>
                                            :
                                            <label className={
                                                option === 'RED' ? cx('mb-0', styles.redFilter)
                                                    : option === 'YELLOW' || option === 'INSUFFICIENT_INFORMATION' ? cx('mb-0', styles.yellowFilter)
                                                        : option === 'GREEN' || option === 'PROCEED_FOR_VERIFICATION' ? cx('mb-0', styles.greenFilter)
                                                            : cx('mb-0', styles.otherFilter)
                                            }
                                                onClick={() => this.handleSelectedOption(option)}>
                                                &ensp;
                                                {option === 'RED' || option === 'YELLOW' || option === 'GREEN' ?
                                                    option.toLowerCase() + ' case'
                                                    : option.toLowerCase().replace(/_/g, ' ')}
                                            </label>
                                        }
                                    </React.Fragment>
                                )
                            })}
                        </div> : null}
                </div>
            </React.Fragment>
        )
    }
}

export default withTranslation()(StatusDropdown);