import React from 'react';
import cx from 'classnames';
import styles from './empCell.module.scss';

const ifPropsEqual = (prev, next) => JSON.stringify(prev.emp) === JSON.stringify(next.emp)
&& prev.pic === next.pic;

const EmpCell = ({ emp, pic }) => {
  const {
    employeeId = '', firstName = '', lastName = '', vendorName = '', defaultRole = '',
  } = emp;
  return (
    <div className="d-flex row pt-1 pb-1 m-0">
      <div className="align-self-center">
        {/* need to replace proper image */}
        <img src={pic} alt="employee" className={styles.empProfilePic} />
      </div>
      <div className={cx('ml-3', styles.empInfo)}>
        <span className={styles.empName}>
          {`${firstName} ${lastName}`.toLowerCase()}
        </span>
        <br />
        <span>
          {`${employeeId} | ${vendorName}`}
        </span>
        <br />
        <span>
          {defaultRole}
        </span>
      </div>

    </div>
  );
};

export default React.memo(EmpCell, ifPropsEqual);
