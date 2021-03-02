/* eslint-disable no-nested-ternary */
import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import AlertPopUp from '../../../../../components/Molecule/AlertPopUp/AlertPopUp';
import ToggleButton from '../../../../../components/Molecule/ToggleButton/ToggleButton';
import WarningPopUp from '../../../../../components/Molecule/WarningPopUp/WarningPopUp';
import HasAccess from '../../../../../services/HasAccess/HasAccess';
import styles from './ProductCard.module.scss';
import configInactive from '../../../../../assets/icons/configInactive.svg';
import dashboardInactive from '../../../../../assets/icons/dashboardInactive.svg';
import rightArrowInactive from '../../../../../assets/icons/dashboardActiveArrow.svg';
import warn from '../../../../../assets/icons/warning.svg';

/**
 * Generates a Product or Service Card
 * @t {function} i18n translation
 * @permission {array} permissrion for displaying the card
 * @skipHasAccess {boolean} skips access check, meaning gives access without permission check
 * @isEnabled {boolean} if card is enabled or not
 * @leftIcon {image} icone image to be displayed in card
 * @ordId {string} organisation id
 * @toggleButton {object} parameters to control toggle button
 * @productLabel {string} label of the product
 * @configuration {object} properties for the configuration button
 * @dashboard {object} properties for dashboard button
 * @popup {object} properties for pop up warning and alerts
 */

const Card = ({
  t,
  permission,
  skipHasAccess,
  isEnabled,
  leftIcon,
  orgId,
  toggleButton,
  productLabel,
  configuration,
  dashboard,
  popup,
}) => (
  <>
    <HasAccess
      orgId={orgId}
      permission={permission}
      skipHasAccess={skipHasAccess}
      yes={() => (
        <div className={isEnabled ? styles.VerifyActive : styles.VerifyInactive}>
          <div className="d-flex flex-row justify-content-between mb-1">
            <span>
              <img src={leftIcon} alt="" />
            </span>
            <HasAccess
              permission={['*']}
              orgId={orgId}
              yes={() => (
                <span>
                  <ToggleButton
                    isDisabled={toggleButton.isDisabled}
                    value={isEnabled}
                    changed={() => toggleButton.onChange()}
                  />
                </span>
              )}
            />
          </div>

          <span className={cx('d-flex flex-row mt-2 mb-3', styles.ProdLabel)}>{productLabel}</span>
          {configuration.isVisible
          && (
          <HasAccess
            permission={configuration.permission}// {["ORG_PROFILE:VIEW"]}
            orgId={orgId}
            yes={() => (
              <>
                {configuration.isEnabled
                  ? (
                    <div className="d-flex flex-row my-3">
                      <Link to={configuration.link} className={styles.LinkBg}>
                        <div className={cx(styles.configTab)}>
                          <div className={cx('pr-2', styles.configImg)} alt="" />
                          <span>{t('translation_orgProfile:productCard:config')}</span>
                        </div>
                      </Link>

                      {configuration.tooltip
                      && (
                      <div className={styles.tooltip}>
                        <span className={styles.redDot} />
                        <span className={styles.tooltiptext}>
                          <i>{configuration.tooltipText}</i>
                        </span>
                      </div>
                      )}
                    </div>
                  )
                  : (
                    <div className="d-flex flex-row my-3">
                      <div className={cx(styles.inactiveConfigTab)}>
                        <img src={configInactive} className="pr-2" alt="" />
                        {' '}
                        {t('translation_orgProfile:productCard:config')}
                      </div>
                    </div>
                  )}
              </>
            )}
            no={() => (
              <div className="d-flex flex-row my-3">
                <div className={cx(styles.inactiveConfigTab)}>
                  <img src={configInactive} className="pr-2" alt="" />
                  {' '}
                  {t('translation_orgProfile:productCard:config')}
                </div>
              </div>
            )}
          />
          ) }
          {dashboard.isVisible
            && (
            <div>
              <HasAccess
                permission={dashboard.permission}
                orgId={orgId}
                yes={() => (
                  dashboard.isEnabled
                    ? (
                      <div className="d-flex flex-row">
                        <Link to={dashboard.link} className={styles.LinkBg}>
                          <div className={cx('mt-0', styles.dashboardTab)}>
                            <div className={cx('pr-2', styles.dashboardImg)} alt="" />
                            {t('translation_orgProfile:productCard:dashboard')}

                            {dashboard.tooltip
                                    && (
                                      <div className={cx('ml-1', styles.tooltip)}>
                                        <span className={styles.redDot} />
                                        <span className={styles.tooltiptext}>
                                          <i>{dashboard.tooltipText}</i>
                                        </span>
                                      </div>
                                    )}
                            <span className={styles.AlignRight}>
                              <div className={cx(styles.rightArrow)} />
                            </span>
                          </div>
                        </Link>
                      </div>
                    )
                    : (
                      <div className={cx('mt-0', styles.inactiveDashboardTab)}>
                        <img src={dashboardInactive} className="pr-2" alt="" />
                        {' '}
                        {t('translation_orgProfile:productCard:dashboard')}
                        <span className={styles.AlignRight}>
                          <img src={rightArrowInactive} alt="" />
                        </span>
                      </div>
                    )
                )}
                no={() => (
                  <div className={cx('mt-3', styles.inactiveDashboardTab)}>
                    <img src={dashboardInactive} className="pr-2" alt="" />
                    {' '}
                    {t('translation_orgProfile:productCard:dashboard')}
                    <span className={styles.AlignRight}>
                      <img src={rightArrowInactive} alt="" />
                    </span>
                  </div>
                )}
              />
            </div>
            )}
          {popup.show
            ? popup.isWarning
              ? (
                <WarningPopUp
                  icon={warn}
                  {...popup.warning}
                />
              )
              : (
                <AlertPopUp
                  icon={warn}
                  {...popup.alert}
                />
              )
            : null}
        </div>
      )}
    />
  </>
);
export default Card;
