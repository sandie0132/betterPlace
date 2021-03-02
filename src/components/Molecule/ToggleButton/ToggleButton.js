import React, { Component } from "react";
import Switch from "react-switch";
import themes from '../../../theme.scss';
// import cx from 'classnames';
// import styles from './ToggleButton.module.scss';


const activeColor = themes.activeLink
const inActiveColor = themes.disabledLabel

class ToggleButton extends Component {

    constructor() {
        super();
        this.state = { checked: false };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (checked) => {
        this.setState({ checked });
    }

    render() {

        return (
            this.props.config ?
                <Switch
                    onChange={this.props.changed}
                    checked={this.props.value}
                    onColor={activeColor}
                    offColor={activeColor}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    width={40}
                    height={20}
                    disabled={this.props.isDisabled}
                />
                :
                <Switch
                    onChange={this.props.changed}
                    checked={this.props.value}
                    onColor={activeColor}
                    offColor={inActiveColor}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    width={34}
                    height={21}
                    disabled={this.props.isDisabled}
                />
        );
    }
}

export default ToggleButton;