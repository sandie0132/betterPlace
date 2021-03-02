import React, { Component } from 'react';
import styles from './Modal.module.scss';
import cx from 'classnames';

class Modal extends Component {

    componentDidMount() {
        document.addEventListener('click', this.handleClick, false);
    }
    componentWillUnmount() {
        document.removeEventListener('click', this.handleClick, false);
    }
    handleClick = (event) => {
        if (!this.innerDiv.contains(event.target) && this.outerDiv.contains(event.target)) {
            this.props.handleClose();
        }
        return;
    }
    render() {
        const showHideClassName = this.props.show ? cx(styles.modal, styles.displayBlock) : cx(styles.modal, styles.displayNone);
        return (
            <div className={showHideClassName} ref={outerDiv => this.outerDiv = outerDiv}>
                <section className={cx(styles.modal_main,this.props.className)} ref={innerDiv => this.innerDiv = innerDiv}>
                    {this.props.children}
                </section>
            </div>
        )
    }
}

export default Modal;