import React, { Component } from "react";
import cx from 'classnames';
import styles from './CopyText.module.scss';
import tickSmall from '../../../assets/icons/tickSmall.svg';
import copy from '../../../assets/icons/copyText.svg';
import inactiveCopy from '../../../assets/icons/inactiveCopy.svg';

class CopyText extends Component {

    state = {
        copySuccess: false
    }

    copyTextHandler = () => {
        let textField = document.createElement('textarea')

        if (this.props.manualAddress && this.props.id) {
            textField.innerText = document.getElementById(this.props.id).innerText;
        }
        else {
            textField.innerText = this.props.textToCopy
        }
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        textField.focus();
        textField.remove()
        this.setState({ copySuccess: true });
    }

    componentDidUpdate = () => {
        if (this.state.copySuccess === true) {
            setTimeout(() => {
                this.setState({ copySuccess: false });
            }, 2000);
        }
    }

    render() {
        return (
            <div>
                <span className='row no-gutters'>
                    <img src={!this.props.disabled ? copy : inactiveCopy}
                        onClick={this.copyTextHandler}
                        alt='copy'
                        className={styles.hover}
                    />
                    {this.state.copySuccess ?
                        <div className={cx('row no-gutters', styles.copyCard)}>
                            <span>
                                <img
                                    src={tickSmall}
                                    alt='tick'
                                />
                                &emsp;copied to clipboard</span>
                        </div>
                        : null}
                </span>
            </div>
        )
    }
}

export default CopyText;