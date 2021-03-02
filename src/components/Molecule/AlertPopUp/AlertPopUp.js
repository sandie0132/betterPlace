import React from 'react';
import styles from './AlertPopUp.module.scss';
import cx from 'classnames';

class AlertPopUp extends React.Component {
    render() {
        return (
            <div className={styles.backdrop} onClick={(event) => { event.stopPropagation(); }}>
                <div className={styles.Container}>
                    <div className={styles.icon40Infocontainer}>
                        <img src={this.props.icon} alt="icon" />
                    </div>
                    <h3 className={cx(styles.popUpText, "pt-4")}>{this.props.text}</h3>
                    <p className={cx(styles.Warning, this.props.paraStyle)}>{this.props.para}</p>

                    <div className={styles.ButtonRectangle}>
                        <button className={styles.buttonOk} onClick={this.props.closePopup}>{this.props.okText}</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default AlertPopUp;