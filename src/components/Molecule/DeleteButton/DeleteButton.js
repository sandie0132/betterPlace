import React from 'react';
import styles from './DeleteButton.module.scss';
import cx from 'classnames';
import deleteIcon from '../../../assets/icons/delete.svg';
import { Button } from 'react-crux';

const deleteButton = (props) => (
    
    <div className={cx(styles.DeleteButton, props.className)}>
        <span className="flex-row d-flex ml-4">
            { props.isDeleteIconRequired ? <img className={'d-flex '} src={deleteIcon} alt="delete Logo" /> : ''}
            <Button
                className={cx('d-flex pl-0 ml-1 btn', styles.DefaultButton, styles.DeleteButton)}
                clickHandler={props.clickHandler}
                isDisabled={props.isDisabled}
                label= {props.label}
                type='custom'
                />
           
        </span>
    </div>
);

export default deleteButton;