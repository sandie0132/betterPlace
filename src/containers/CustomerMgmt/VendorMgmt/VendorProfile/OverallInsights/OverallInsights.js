/* eslint-disable no-nested-ternary */
import React from 'react';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';
import styles from './OverallInsights.module.scss';

import folderVendor from '../../../../../assets/icons/folderVendor.svg';
import rolesFolder from '../../../../../assets/icons/vendorRolesFolder.svg';
import deployedEmployeesVendor from '../../../../../assets/icons/deployedEmployeesVendor.svg';
import activeEmployeesVendor from '../../../../../assets/icons/activeEmployeesVendor.svg';

/**
 * Generates a overall insights card
 * @singleCard {boolean}
 * @associatedVendors {boolean}
 * @locations {number}
 * @roles {number}
 * @deployedEmployees {number}
 * @activeEmployees {number}
 * @clientName {string}
 * @icon {string}
 * @heading {string}
 * @number {number}
 * @leftHeading {string}
 * @leftNumber {number}
 * @rightHeading {string}
 * @rightNumber {number}
 */

const getNumberValue = (num) => {
  if (Math.abs(num) > 999) {
    return `${Math.floor(num / 1000, 1)}k`;
  }
  return num;
};

const OverallInsights = (
  {
    singleCard, associatedVendors, locations, roles, deployedEmployees, activeEmployees,
    clientName, icon, heading, number, leftHeading, leftNumber, rightHeading, rightNumber,
    show,
  },
) => (
  <>
    {singleCard
      ? associatedVendors
        ? (
          <div className={cx(styles.singleCard, 'row no-gutters justify-content-between')}>
            <div className="d-flex flex-row">
              <img className={styles.singleImg} src={folderVendor} alt="" />
              <div className="d=flex flex-column" style={{ width: '6.5rem' }}>
                <div className="d-flex">
                  <div className={styles.smallCardHeading}>
                    {getNumberValue(locations)}
                    {' '}
                  </div>
                  <div className={styles.smallCardTextBold}>&nbsp;&nbsp;sites</div>
                </div>
                <div className={cx(styles.smallCardText)}>assigned by my organisation</div>
              </div>
            </div>

            <div className="d-flex flex-row">
              <img className={styles.singleImg} src={rolesFolder} alt="" />
              <div className="d=flex flex-column" style={{ width: '6.5rem' }}>
                <div className="d-flex">
                  <div className={styles.smallCardHeading}>
                    {getNumberValue(roles)}
                    {' '}
                  </div>
                  <div className={styles.smallCardTextBold}>&nbsp;&nbsp;roles</div>
                </div>
                <div className={cx(styles.smallCardText)}>assigned by my organisation</div>
              </div>
            </div>

            <div className="d-flex flex-row">
              <img className={styles.singleImg} src={deployedEmployeesVendor} alt="" />
              <div className="d=flex flex-column" style={{ width: '6.5rem' }}>
                <div className="d-flex">
                  <div className={styles.smallCardHeading}>
                    {getNumberValue(deployedEmployees)}
                    {' '}
                  </div>
                  <div className={styles.smallCardTextBold}>&nbsp;&nbsp;employees</div>
                </div>
                <div className={cx(styles.smallCardText)}>deployed to my organisation</div>
              </div>
            </div>

            <div className="d-flex flex-row">
              <img className={styles.singleImg} src={activeEmployeesVendor} alt="" />
              <div className="d=flex flex-column" style={{ width: '6.5rem' }}>
                <div className="d-flex">
                  <div className={styles.smallCardHeading}>
                    {getNumberValue(activeEmployees)}
                    {' '}
                  </div>
                  <div className={styles.smallCardTextBold}>&nbsp;&nbsp;employees</div>
                </div>
                <div className={cx(styles.smallCardText)}>active now in my organisation</div>
              </div>
            </div>
          </div>
        )
        : (
          <div className={cx(styles.singleCard, 'row no-gutters justify-content-between')}>
            <div className="d-flex flex-row">
              <img className={styles.singleImg} src={folderVendor} alt="" />
              <div className="d=flex flex-column" style={{ width: '6.5rem' }}>
                <div className="d-flex">
                  <div className={styles.smallCardHeading}>
                    {getNumberValue(locations)}
                    {' '}
                  </div>
                  <div className={styles.smallCardTextBold}>&nbsp;&nbsp;sites</div>
                </div>
                <div className={cx(styles.smallCardText)}>
                  assigned by
                  {' '}
                  {clientName}
                  {' '}
                  clients
                </div>
              </div>
            </div>

            <div className="d-flex flex-row">
              <img className={styles.singleImg} src={rolesFolder} alt="" />
              <div className="d=flex flex-column" style={{ width: '6.5rem' }}>
                <div className="d-flex">
                  <div className={styles.smallCardHeading}>
                    {getNumberValue(roles)}
                    {' '}
                  </div>
                  <div className={styles.smallCardTextBold}>&nbsp;&nbsp;roles</div>
                </div>
                <div className={cx(styles.smallCardText)}>
                  assigned by
                  {' '}
                  {clientName}
                  {' '}
                  clients
                </div>
              </div>
            </div>

            <div className="d-flex flex-row">
              <img className={styles.singleImg} src={deployedEmployeesVendor} alt="" />
              <div className="d=flex flex-column" style={{ width: '6.5rem' }}>
                <div className="d-flex">
                  <div className={styles.smallCardHeading}>
                    {getNumberValue(deployedEmployees)}
                    {' '}
                  </div>
                  <div className={styles.smallCardTextBold}>&nbsp;&nbsp;employees</div>
                </div>
                <div className={cx(styles.smallCardText)}>
                  deployed to
                  {' '}
                  {clientName}
                  {' '}
                  clients
                </div>
              </div>
            </div>

            <div className="d-flex flex-row">
              <img className={styles.singleImg} src={activeEmployeesVendor} alt="" />
              <div className="d=flex flex-column" style={{ width: '6.5rem' }}>
                <div className="d-flex">
                  <div className={styles.smallCardHeading}>
                    {getNumberValue(activeEmployees)}
                    {' '}
                  </div>
                  <div className={styles.smallCardTextBold}>&nbsp;&nbsp;employees</div>
                </div>
                <div className={cx(styles.smallCardText)}>
                  active now in
                  {' '}
                  {clientName}
                  {' '}
                  clients
                </div>
              </div>
            </div>
          </div>
        )
      : show
        ? (
          <div className={styles.assigned}>
            <div className="row no-gutters">
              <img src={icon} alt="" />
              <div className="d-flex flex-column ml-3" style={{ width: '77%' }}>
                <span className={styles.label}>{heading}</span>
                <span className={styles.numberAssigned}>{getNumberValue(number)}</span>
              </div>
            </div>

            <hr className={styles.horizontalLine} />

            <div className="row no-gutters">
              <div className="d-flex flex-column" style={{ width: '40%' }}>
                <span className={styles.subHeading}>{leftHeading}</span>
                <span className={cx(styles.numberAssignedSmaller)}>
                  {getNumberValue(leftNumber)}
                </span>
              </div>

              <hr className={styles.verticalLine} />

              <div className={cx('d-flex flex-column')} style={{ width: '45%' }}>
                <span className={cx(styles.subHeading)}>{rightHeading}</span>
                <span className={cx(styles.numberAssignedSmaller)}>
                  {getNumberValue(rightNumber)}
                </span>
              </div>
            </div>
          </div>
        )
        : ''}
  </>
);

export default withTranslation()(withRouter(OverallInsights));
