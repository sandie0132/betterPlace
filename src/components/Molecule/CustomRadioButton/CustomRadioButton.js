import React from 'react';
import styles from './CustomRadioButton.module.scss';
import cx from 'classnames';

const customRadioButton = (props) => {
    return (
                <div 
                    className={cx(props.isSelected
                                    ? cx(styles.RadioButtonContainer,styles.RadioButtonActiveContainer,props.className) 
                                    : cx(styles.RadioButtonContainer,props.className)
                                , props.hasEditAccess ? styles.checkBoxText : null
                               )} 
                    onClick={ props.hasEditAccess ? props.disabled ? null : props.changed : null}>
                        {props.icon? 
                            <img src={props.icon}  alt="icon" className={props.iconClassname ? props.iconClassname : styles.IconActive}/> :''}
                        <span className={props.isSelected? styles.LabelActive: styles.LabelDisabled}>{props.label}</span>
                        <input  className={cx(styles.RadioButton,props.hasEditAccess ? styles.checkBoxText : null)} 
                                type='radio' disabled={props.disabled} 
                                onChange={ props.hasEditAccess ? props.disabled ? null : props.changed : null} 
                                checked={props.isSelected}/>     
                </div>
    );
    
}

export default customRadioButton;