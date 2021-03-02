import React from 'react';
import styles from "./ToggleDocConfig.module.scss";
import ToggleButton from '../../../../../components/Molecule/ToggleButton/ToggleButton';
import cx from "classnames";

const ToggleDocConfig = (props) => {

    return (
        <div className={styles.container}>
            <div className={styles.heading}>
                please select an option below to update {props.docName} document of your employee
            </div>
            <div className={cx(styles.toggleContainer,props.disabled ? styles.disabled : null)}>
                <div className={props.value ? styles.inactive: styles.active}>
                    upload available
                </div>
                <div className={styles.toggleButton}>
                <ToggleButton
                    isDisabled={props.disabled}
                    value={props.value}
                    changed={() => props.changed()}
                    config
                />
                </div>
                <div className={props.value ? styles.active: styles.inactive}>
                    generate new
                </div>
            </div>
        </div>
    )
}

export default ToggleDocConfig;