import React from 'react';
import cx from 'classnames';
import _ from 'lodash';
import styles from './CheckBox.module.scss';

const Checkbox = (props) => {
    let checkBox = null;

    switch (props.type) {
        case 'smallBlue':
            checkBox =
                <div className={props.className}>
                    <label className={cx(styles.smallBlueContainer,"mb-0")}>
                        <input
                            type='checkbox'
                            checked={props.value != null ? props.value : false}
                            name={props.name}
                            onChange={props.onChange}
                            disabled={props.disabled}
                        />
                        <span className={cx(styles.smallBlueCheckmark)}></span>
                    </label>
                </div>
            break;

        case 'medium15px':
            checkBox =
                <div className={props.className}>
                    <label className={cx(styles.medium15pxContainer)}>
                        <input
                            type='checkbox'
                            checked={props.value != null ? props.value : false}
                            name={props.name}
                            onChange={props.onChange}
                            disabled={props.disabled}
                        />
                        <span className={cx(styles.medium15pxCheckmark)}></span>
                    </label>
                </div>
            break;

        case 'medium':
            checkBox =
                <div className={props.className}>
                    <label className={cx(styles.mediumContainer,"mb-0")}>
                        <input
                            type='checkbox'
                            checked={props.value != null ? props.value : false}
                            name={props.name}
                            onChange={props.onChange}
                            disabled={props.disabled}
                        />
                        <span className={cx(styles.mediumCheckmark,props.checkMarkStyle)}></span>
                    </label>
                    {!_.isEmpty(props.label) ?
                        <span className={cx(props.value ? styles.SmallContentActive : styles.SmallContent, props.LabelStyle)}>
                            {props.label}
                        </span> : null}
                </div>
            break;

        case 'medium15pxline':
            checkBox =
                <div className={props.className}>
                    <label className={cx(styles.medium15pxContainer)}>
                        <input
                            type='checkbox'
                            checked={props.value != null ? props.value : false}
                            name={props.name}
                            onChange={props.onChange}
                            disabled={props.disabled}
                        />
                        <span className={cx(styles.medium15pxlineCheckMark)}></span>
                    </label>
                </div>
            break;

        case 'small':
            checkBox =
                <div className={cx(props.className,"row px-0 mx-0")}>
                    <label className={cx(styles.smallContainer,props.checkBoxStyle)}>
                        <input
                            type='checkbox'
                            checked={props.value != null ? props.value : false}
                            name={props.name}
                            onChange={props.onChange}
                            disabled={props.disabled}
                        />
                        <span className={cx(styles.smallCheckmark,props.checkMarkStyle)}></span>
                    </label>
                    {!_.isEmpty(props.label) ?
                        <span className={cx(props.value ? styles.SmallContentActive : styles.SmallContent, props.LabelStyle)}>
                            {props.label}
                        </span> : null}
                </div>
            break;

        case 'smallCircle':
            checkBox =
                <div className={cx(props.className,"row px-0 mx-0")}>
                    <label className={cx(styles.smallCircleContainer,props.checkBoxStyle)}>
                        <input
                            type='checkbox'
                            checked={props.value != null ? props.value : false}
                            name={props.name}
                            onChange={props.onChange}
                            disabled={props.disabled}
                        />
                        <span className={cx(styles.smallCircleCheckmark,props.checkMarkStyle)}></span>
                    </label>
                    {!_.isEmpty(props.label) ?
                        <span className={cx(props.value ? styles.SmallContentActive : styles.SmallContent, props.LabelStyle)}>
                            {props.label}
                        </span> : null}
                </div>
            break;

            default : checkBox = null
    }

    return (
        <React.Fragment>
            {checkBox}
        </React.Fragment>
    );
}

export default Checkbox;