import React from 'react';
import { Link } from 'react-router-dom';

import cx from 'classnames';
import _ from 'lodash';
import { Button } from 'react-crux';
import styles from './EmptyState.module.scss';

import emptyPage from '../../../assets/icons/opsEmptyState.svg';
import emptyVendorState from '../../../assets/icons/emptyVendorState.svg';
import noResultFound from '../../../assets/icons/NoResultFound.svg';

const EmptyState = (props) => {
  let emptyCase = null;

  switch (props.type) {
    case 'emptySearchResult':
      emptyCase = (
        <div className={styles.Container}>
          <div className="col-10 px-0 mx-auto">
            <div className={styles.Image}>
              <img src={noResultFound} alt="" />
            </div>
            <p className={cx(styles.Text, 'mt-4')}>
              search by
              <span className={styles.Medium}> employee name</span>
              {' '}
              or
              <span className={styles.Medium}>employee ID </span>
              above to view
              {' '}
              <br />
              {' '}
              closed
              {props.cardType.replace(/_/g, ' ')}
              {' '}
              verifications
            </p>
          </div>
        </div>
      );
      break;

    case 'pvc':
      emptyCase = (
        <div className={styles.Container}>
          <div className="col-10 px-0 mx-auto">
            <div className={styles.Image}>
              <img src={noResultFound} alt="" />
            </div>
            <p className={cx(styles.Text, 'mt-4')}>select a city from above to view police verification tasks of selected city</p>
          </div>
        </div>
      );
      break;

    case 'physical_address':
      emptyCase = (
        <div className={styles.Container}>
          <div className="col-10 px-0 mx-auto">
            <div className={styles.Image}>
              <img src={noResultFound} alt="" />
            </div>
            <p className={cx(styles.Text, 'mt-4')}>select a view from above to view physical verification tasks</p>
          </div>
        </div>
      );
      break;
    case 'postal_address':
      emptyCase = (
        <div className={styles.Container}>
          <div className="col-10 px-0 mx-auto">
            <div className={styles.Image}>
              <img src={noResultFound} alt="" />
            </div>
            <p className={cx(styles.Text, 'mt-4')}>select a service type from above to view postal verification tasks of selected service</p>
          </div>
        </div>
      );
      break;
    case 'address_verification':
      emptyCase = (
        <div className={styles.Container}>
          <div className={cx('row no-gutters')} style={{ overflow: 'hidden' }}>
            <span className={cx(styles.Heading, styles.Width1)}>candidate name</span>
            <span className={cx(styles.Heading, styles.Width2)}>address pincode</span>
            <span className={cx(styles.Heading, styles.Width3)}>assigned to</span>
            <span className={cx(styles.Heading, styles.Width4)}>case status</span>
            <span className={cx(styles.Heading, styles.Width5)}>TAT left</span>
          </div>

          <hr />
          <div className={styles.Image}>
            <img src={emptyPage} alt="" />
          </div>
          <p className={cx(styles.Bold, 'mt-4')}>hurray!!</p>
          <p className={cx(styles.Text, 'mt-1')}>
            there are no more tasks left for verification
            {props.showFilteredResults ? 'based on filters' : ''}
            {props.cardType === 'physical_address' && props.addressViewType !== 'select view' ? props.addressViewType : null}
          </p>
        </div>
      );
      break;

    case 'emptyVendorTagsList':
      emptyCase = (
        <div className="d-flex flex-column">
          <img className={styles.VendorEmptyState} src={emptyVendorState} alt="" />
          <span className={cx('d-flex justify-content-center', styles.VendorInfo)}>
            {props.label}
          </span>
          {props.url
            ? (
              <Link to={props.url}>
                <span className={cx('d-flex justify-content-center mb-4')}>
                  <Button label={props.buttonLabel} type="add" className={styles.AssignButton} />
                </span>
              </Link>
            ) : null}
        </div>
      );
      break;

    case 'emptyTaskList':
      emptyCase = (
        <div className={styles.EmptyContainer}>
          <div className="col-12 px-0">
            <div className={styles.Image}>
              <img src={emptyPage} alt="" />
            </div>
            <p className={cx(styles.Bold, 'mt-4')}>hurray!!</p>
            <p className={cx(styles.Text, 'mt-1')}>there are no more tasks left for verification</p>
          </div>
        </div>
      );
      break;

    case 'noResultFound':
      emptyCase = (
        <div className={cx(props.className)}>
          no search result found for
          {' '}
          {` "${props.searchKey}"`}
        </div>
      );
      break;

    case 'emptyvendorSearch':
      emptyCase = (
        <div className="d-flex flex-column justify-content-center">
          <img className={props.height} src={emptyVendorState} alt="" />
          <div className={props.className}>
            <p className="mb-0">
              There is no
              {' '}
              {props.name}
              {' '}
              named
            </p>
            <p className="mb-0">
              {' "'}
              {props.searchKey}
              {'" '}
              assigned to
              {' '}
              {props.vendorName}
            </p>
          </div>
        </div>
      );
      break;

    default:
      emptyCase = (
        <div className={styles.Container}>
          <div className="col-12 px-0">
            <div className={styles.Image}>
              <img src={emptyPage} alt="" />
            </div>
            <p className={cx(styles.Bold, 'mt-4')}>hurray!!</p>
            <p className={cx(styles.Text, 'mt-1')}>
              there are no more tasks left for
              {' '}
              {!_.isEmpty(props.cardType) ? props.cardType.replace(/_/g, ' ') : ''}
              {' '}
              verification
              {props.cardType === 'physical_address' && props.addressViewType !== 'select view' ? props.addressViewType : null}
            </p>
            <p className={cx(styles.Text)}>we will inform you if any new tasks are added</p>
          </div>
        </div>
      );
      break;
  }

  return (
    <>{emptyCase}</>
  );
};

export default EmptyState;
