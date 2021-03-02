import React from 'react';
import ContentLoader from 'react-content-loader';
import cx from 'classnames';
import styles from './RosterEmpCount.module.scss';
import themes from '../../../../theme.scss';

const RosterEmpCount = () => {
  const primaryColor = themes.loaderPrimary;
  const secondaryColor = themes.loaderSecondary;

  return (
    <>
      <div className={cx('px-2', styles.FormBackgroundColor)}>
        <svg viewBox="0 0 2100 100">
          <ContentLoader
            // height={500}
            width={200}
            speed={10}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          >
            {/* //row 1 */}

            <rect x="2" y="20%" rx="50%" ry="50%" width="6" height="60%" />

            <rect x="10" y="34%" rx="2" ry="60" width="30" height="33%" />

            <rect x="45" y="20%" rx="3" ry="60" width="18" height="60%" />

            <rect x="68" y="20%" rx="3" ry="60" width="18" height="60%" />

            <rect x="91" y="20%" rx="3" ry="60" width="18" height="60%" />

            <rect x="114" y="20%" rx="3" ry="60" width="18" height="60%" />

            <rect x="136" y="20%" rx="3" ry="60" width="18" height="60%" />

            <rect x="158" y="20%" rx="3" ry="60" width="18" height="60%" />

            <rect x="180" y="20%" rx="3" ry="60" width="18" height="60%" />

          </ContentLoader>
        </svg>
      </div>
    </>
  );
};

export default RosterEmpCount;
