/* eslint-disable no-nested-ternary */
import React from 'react';
import cx from 'classnames';
import styles from './WarningPopUp.module.scss';

const WarningPopUp = ({
  icon,
  text,
  paraStyle,
  para,
  centerAlignButton,
  closePopUpStyle,
  warningPopUp,
  confirmText,
  closePopup,
  cancelText,
  isAlert,
  warningPopUpStyle,
  highlightText,
  className,
}) => (
  <div className={styles.backdrop} onClick={(event) => { event.stopPropagation(); }} role="button" tabIndex="0" aria-hidden>
    <div className={cx(styles.Container, className)}>
      <div className={styles.icon40Infocontainer}>
        <img src={icon} alt="icon" />
      </div>
      <h3 className={cx(styles.popUpText, 'pt-4')}>{text}</h3>
      <p className={cx(styles.Warning, paraStyle)}>{para}</p>
      {highlightText && <p className={cx(styles.hightlightText)}>{highlightText}</p>}
      {centerAlignButton
        ? (
          <div className={styles.ButtonRectangle}>
            <button type="button" className={cx(styles.AlertButton, closePopUpStyle)} onClick={warningPopUp}>{confirmText}</button>
            <div role="button" tabIndex="0" aria-hidden className={cx(styles.GreyText)} onClick={closePopup}><u>{cancelText}</u></div>
          </div>
        )
        : confirmText && cancelText
          ? (
            <div className={styles.ButtonRectangle}>
              <button type="button" className={isAlert ? styles.AlertButton : cx(styles.button, warningPopUpStyle)} onClick={warningPopUp}>{confirmText}</button>
              <button type="button" className={cx(styles.buttonCancel, closePopUpStyle)} onClick={closePopup}>{cancelText}</button>
            </div>
          )
          : (
            <div className={styles.ButtonRectangle}>
              <button type="button" className={styles.buttonOk} onClick={closePopup}>{cancelText}</button>
            </div>
          )}
    </div>
  </div>
);

export default WarningPopUp;
