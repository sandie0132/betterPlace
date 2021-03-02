import React from 'react';
import cx from "classnames";

import styles from "./DocumentCard.module.scss";
import CheckBox from '../../../../../../components/Atom/CheckBox/CheckBox';
import government from "../../../../../../assets/icons/pan.svg";
import docConfig from "../../../../../../assets/icons/documentConfig.svg";


const DocumentCard = (props) => {

    const shortenDisplayName = (displayName) => {
        if (displayName.length > 30) {
            const updatedDisplayName = displayName.substring(0, 30) + '...';
            return (updatedDisplayName);
        }
        return (displayName);
    }

    let Card;
    switch (props.type) {
        case 'gov':
            Card =
                <div className={cx(styles.cardBgGov, props.checked? styles.shadow : null)}>
                    <div className={styles.cardPadding}>
                        <img src={government} alt="gov" className={styles.govIcon} />
                        <div className={styles.subSectionHeading}>government of india</div>
                        <div className={styles.label}>{shortenDisplayName(props.label)}</div>
                    </div>
                    <div className={styles.bottomSectionGov}>
                        <div className={styles.smallLabel}>select {props.initial}</div>
                        <span className="ml-auto mr-2" style={{position:'relative'}}>
                            <CheckBox
                                type="medium"
                                name='govDocumentCard'
                                value={props.checked}
                                onChange={props.changed}
                                checkMarkStyle={styles.checkMarkStyle}
                            />
                        </span>

                    </div>
                </div>

            break;

        default:
            Card =
                <div className={cx(styles.cardBgDoc, props.checked? styles.shadow : null)}>
                    <div className={styles.cardPadding}>
                        <img src={docConfig} alt="gov" />
                        <div className={styles.subSectionHeading}>organisation documents</div>
                        <div className={styles.label}>{shortenDisplayName(props.label)}</div>
                    </div>
                    <div className={styles.bottomSectionDoc}>
                        <div className={styles.smallLabel}>select {props.initial}</div>
                        <div className="ml-auto mr-2" style={{position:'relative'}}>
                            <CheckBox
                                type="medium"
                                name='documentCard'
                                // className={styles.checkBoxAlign}
                                value={props.checked}
                                onChange={props.changed}
                                checkMarkStyle={styles.checkMarkStyle}
                            />
                        </div>

                    </div>
                </div>
            break;
    }


    return (
        <React.Fragment>
            {Card}
        </React.Fragment>
    )


}

export default DocumentCard;

