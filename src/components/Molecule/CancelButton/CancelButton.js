import React from 'react';
import styles from './CancelButton.module.scss';
import cx from 'classnames';
import { Button } from 'react-crux';

const CancelButton = (props) => (

    <Button
      className={cx('d-flex pl-4 col-3', styles.DefaultButton, props.className)} 
      clickHandler={props.clickHandler}
      type='cancel'
      label='cancel'
      isDisabled = {props.isDisabled}
    
    />

    // <div>
    //    <button
        
    //         className={cx('d-flex pl-4 col-3 ', styles.DefaultButton)} onClick={props.clickHandler}>
    //         cancel
    //     </button>
    // </div>
);

export default CancelButton;
