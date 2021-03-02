import React from 'react';
import styles from './BoxRadioButton.module.scss';
import cx from 'classnames';

const BoxRadioButton = (props) => {
    return (
        <div className={props.isSelected ? cx('d-flex flex-row', styles.activeContainer, props.className) : cx('d-flex flex-row', styles.defaultContainer, props.className)} onClick={props.changed}>
            {props.icon ? <img className= {cx(props.iconStyle, 'pr-2')} src={props.icon} alt='icon' /> : null}
            <div className='pr-2 d-flex align-items-center'>
                <label className={props.isSelected ? styles.activeLabel : styles.defaultLabel}>{props.label}</label>
            </div>
            <div className='ml-auto d-flex align-items-center'>
                <input
                    type='radio'
                    checked={props.isSelected}
                    onChange={props.changed}
                    className={styles.RadioButton}
                    name={props.name}
                    value={props.value}
                    icon={props.icon}
                    disabled={props.disabled}
                />

            </div>

        </div>
    );

}

export default BoxRadioButton;