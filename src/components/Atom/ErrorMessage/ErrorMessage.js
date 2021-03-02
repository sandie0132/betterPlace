import React from 'react';
import styles from './ErrorMessage.module.scss';

const ErrorMessage = (props) => {
    let errorsList = null;
    if(props.errors){
        errorsList = props.errors.map((error)=>(
            <div key={error} className={styles.ErrorMessage}>{error}</div>
        ))
    }
    return errorsList;
};

export default ErrorMessage;