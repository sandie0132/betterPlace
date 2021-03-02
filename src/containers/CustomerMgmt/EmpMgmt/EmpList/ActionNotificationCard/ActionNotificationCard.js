import React, { Component } from 'react';
import Modal from '../../../../../components/Atom/Modal/Modal';
import styles from './ActionNotificationCard.module.scss';
import cx from 'classnames';
import { Button } from 'react-crux';
import crossSymbol from '../../../../../assets/icons/remove.svg';
import tick from '../../../../../assets/icons/tick.svg';
import closePage from '../../../../../assets/icons/closePage.svg';
import { withTranslation } from 'react-i18next';

class ActionNotificationCard extends Component {

    render() {
        const {t} = this.props;
        return (
            <React.Fragment>
                 
                <Modal show={this.props.showModal} className={styles.ModalStyle}>
                    <div className={cx("mx-0 col-7 ", styles.modalAlign)}>
                        {/* <button className ={cx(styles.closeButton)} onClick = {this.props.onClickClose}> */}
                            <img className = {cx(styles.imgClose,"mr-1")} src = {closePage} alt = {t('translation_empList:image_alt.close')} onClick = {this.props.onClickClose}/>
                        {/* </button> */}
                        {/* <div className={styles.closeAlign} onClick={this.props.handleCloseModal}>
                            <span className={styles.closeText}>{this.props.tagType}</span>
                        </div> */}
                        <div className={cx(styles.ModalCardLayout)}>
                            <div className={cx('card-body')}>
                                <div className = {cx(styles.contentHeading)}>
                                {t('translation_empList:actionNotificationCard.l0')} {this.props.message}
                                </div>
                                <div className={cx(styles.box,'container')}>
                                    <div className = {cx(styles.contentData,"row")}>
                                        <div className = {cx('col-sm')}>
                                            <img src = {crossSymbol} alt = {t('translation_empList:image_alt.close')} className = "mr-1"/>
                                            {t('translation_empList:actionNotificationCard.l1')}
                                            <div className = {cx(styles.subContentData,'ml-3')}>{t('translation_empList:actionNotificationCard.l2')}</div>
                                        </div>
                                        <div className = {cx('col-sm')}>
                                        <img src = {tick} alt = {t('translation_empList:image_alt.tick')} className = "mr-1"/>
                                        {t('translation_empList:actionNotificationCard.l3')}
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className={cx(styles.contentData,"row ml-1")}>
                                    {t('translation_empList:actionNotificationCard.l4')}
                                    </div>
                                    <div className={cx(styles.button,"row")}>
                                        <div className="col-sm">
                                            <Button label="initiate" clickHandler={this.props.buttonOnClick}/>
                                        </div>
                                    </div>
                                    <div className={cx(styles.buttonContentData,"row align-center")}>
                                    <div className ={cx(styles.InactiveButton)} onClick = {this.props.onClickText}> {t('translation_empList:actionNotificationCard.l5')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </React.Fragment>
        )


    }
}
export default withTranslation()(ActionNotificationCard);