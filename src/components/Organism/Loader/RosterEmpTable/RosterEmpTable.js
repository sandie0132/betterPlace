import React from 'react';
import ContentLoader from 'react-content-loader';
import cx from 'classnames';
import styles from './RosterEmpTable.module.scss';
import themes from '../../../../theme.scss';

const RosterEmpTable = () => {
  const primaryColor = themes.loaderPrimary;
  const secondaryColor = themes.loaderSecondary;

  return (
    <>
      <div className={cx('px-2 py-3 mb-4', styles.FormBackgroundColor)}>
        <svg viewBox="0 0 2100 900">
          <ContentLoader
            // height={500}
            width={200}
            speed={10}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          >
            {/* //row 1 */}

            <rect x="2" y="2" rx="50%" ry="50%" width="6" height="9" />
            <rect x="10" y="2" rx="1" ry="60" width="26" height="3" />
            <rect x="10" y="7" rx="1" ry="60" width="30" height="3" />
            <rect x="10" y="12" rx="1" ry="60" width="22" height="3" />

            <rect x="45" y="2" rx="1" ry="60" width="18" height="3" />
            <rect x="45" y="7" rx="1" ry="60" width="15" height="3" />

            <rect x="68" y="2" rx="1" ry="60" width="18" height="3" />
            <rect x="68" y="7" rx="1" ry="60" width="15" height="3" />

            <rect x="91" y="2" rx="1" ry="60" width="18" height="3" />
            <rect x="91" y="7" rx="1" ry="60" width="15" height="3" />

            <rect x="114" y="2" rx="1" ry="60" width="18" height="3" />
            <rect x="114" y="7" rx="1" ry="60" width="15" height="3" />

            <rect x="136" y="2" rx="1" ry="60" width="18" height="3" />
            <rect x="136" y="7" rx="1" ry="60" width="15" height="3" />

            <rect x="158" y="2" rx="1" ry="60" width="18" height="3" />
            <rect x="158" y="7" rx="1" ry="60" width="15" height="3" />

            <rect x="180" y="2" rx="1" ry="60" width="18" height="3" />
            <rect x="180" y="7" rx="1" ry="60" width="15" height="3" />

            {/* //row 2 */}

            <rect x="2" y="22" rx="50%" ry="50%" width="6" height="9" />
            <rect x="10" y="22" rx="1" ry="60" width="26" height="3" />
            <rect x="10" y="27" rx="1" ry="60" width="30" height="3" />
            <rect x="10" y="32" rx="1" ry="60" width="22" height="3" />

            <rect x="45" y="22" rx="1" ry="60" width="18" height="3" />
            <rect x="45" y="27" rx="1" ry="60" width="15" height="3" />

            <rect x="68" y="22" rx="1" ry="60" width="18" height="3" />
            <rect x="68" y="27" rx="1" ry="60" width="15" height="3" />

            <rect x="91" y="22" rx="1" ry="60" width="18" height="3" />
            <rect x="91" y="27" rx="1" ry="60" width="15" height="3" />

            <rect x="114" y="22" rx="1" ry="60" width="18" height="3" />
            <rect x="114" y="27" rx="1" ry="60" width="15" height="3" />

            <rect x="136" y="22" rx="1" ry="60" width="18" height="3" />
            <rect x="136" y="27" rx="1" ry="60" width="15" height="3" />

            <rect x="158" y="22" rx="1" ry="60" width="18" height="3" />
            <rect x="158" y="27" rx="1" ry="60" width="15" height="3" />

            <rect x="180" y="22" rx="1" ry="60" width="18" height="3" />
            <rect x="180" y="27" rx="1" ry="60" width="15" height="3" />

            {/* //row 3 */}

            <rect x="2" y="42" rx="50%" ry="50%" width="6" height="9" />
            <rect x="10" y="42" rx="1" ry="60" width="26" height="3" />
            <rect x="10" y="47" rx="1" ry="60" width="30" height="3" />
            <rect x="10" y="52" rx="1" ry="60" width="22" height="3" />

            <rect x="45" y="42" rx="1" ry="60" width="18" height="3" />
            <rect x="45" y="47" rx="1" ry="60" width="15" height="3" />

            <rect x="68" y="42" rx="1" ry="60" width="18" height="3" />
            <rect x="68" y="47" rx="1" ry="60" width="15" height="3" />

            <rect x="91" y="42" rx="1" ry="60" width="18" height="3" />
            <rect x="91" y="47" rx="1" ry="60" width="15" height="3" />

            <rect x="114" y="42" rx="1" ry="60" width="18" height="3" />
            <rect x="114" y="47" rx="1" ry="60" width="15" height="3" />

            <rect x="136" y="42" rx="1" ry="60" width="18" height="3" />
            <rect x="136" y="47" rx="1" ry="60" width="15" height="3" />

            <rect x="158" y="42" rx="1" ry="60" width="18" height="3" />
            <rect x="158" y="47" rx="1" ry="60" width="15" height="3" />

            <rect x="180" y="42" rx="1" ry="60" width="18" height="3" />
            <rect x="180" y="47" rx="1" ry="60" width="15" height="3" />

            {/* //row 4 */}

            <rect x="2" y="62" rx="50%" ry="50%" width="6" height="9" />
            <rect x="10" y="62" rx="1" ry="60" width="26" height="3" />
            <rect x="10" y="67" rx="1" ry="60" width="30" height="3" />
            <rect x="10" y="72" rx="1" ry="60" width="22" height="3" />

            <rect x="45" y="62" rx="1" ry="60" width="18" height="3" />
            <rect x="45" y="67" rx="1" ry="60" width="15" height="3" />

            <rect x="68" y="62" rx="1" ry="60" width="18" height="3" />
            <rect x="68" y="67" rx="1" ry="60" width="15" height="3" />

            <rect x="91" y="62" rx="1" ry="60" width="18" height="3" />
            <rect x="91" y="67" rx="1" ry="60" width="15" height="3" />

            <rect x="114" y="62" rx="1" ry="60" width="18" height="3" />
            <rect x="114" y="67" rx="1" ry="60" width="15" height="3" />

            <rect x="136" y="62" rx="1" ry="60" width="18" height="3" />
            <rect x="136" y="67" rx="1" ry="60" width="15" height="3" />

            <rect x="158" y="62" rx="1" ry="60" width="18" height="3" />
            <rect x="158" y="67" rx="1" ry="60" width="15" height="3" />

            <rect x="180" y="62" rx="1" ry="60" width="18" height="3" />
            <rect x="180" y="67" rx="1" ry="60" width="15" height="3" />

            {/* //row 5 */}

            <rect x="2" y="82" rx="50%" ry="50%" width="6" height="9" />
            <rect x="10" y="82" rx="1" ry="60" width="26" height="3" />
            <rect x="10" y="87" rx="1" ry="60" width="30" height="3" />
            <rect x="10" y="92" rx="1" ry="60" width="22" height="3" />

            <rect x="45" y="82" rx="1" ry="60" width="18" height="3" />
            <rect x="45" y="87" rx="1" ry="60" width="15" height="3" />

            <rect x="68" y="82" rx="1" ry="60" width="18" height="3" />
            <rect x="68" y="87" rx="1" ry="60" width="15" height="3" />

            <rect x="91" y="82" rx="1" ry="60" width="18" height="3" />
            <rect x="91" y="87" rx="1" ry="60" width="15" height="3" />

            <rect x="114" y="82" rx="1" ry="60" width="18" height="3" />
            <rect x="114" y="87" rx="1" ry="60" width="15" height="3" />

            <rect x="136" y="82" rx="1" ry="60" width="18" height="3" />
            <rect x="136" y="87" rx="1" ry="60" width="15" height="3" />

            <rect x="158" y="82" rx="1" ry="60" width="18" height="3" />
            <rect x="158" y="87" rx="1" ry="60" width="15" height="3" />

            <rect x="180" y="82" rx="1" ry="60" width="18" height="3" />
            <rect x="180" y="87" rx="1" ry="60" width="15" height="3" />

            {/* //row 6 */}

            <rect x="2" y="102" rx="50%" ry="50%" width="6" height="9" />
            <rect x="10" y="102" rx="1" ry="60" width="26" height="3" />
            <rect x="10" y="107" rx="1" ry="60" width="30" height="3" />
            <rect x="10" y="112" rx="1" ry="60" width="22" height="3" />

            <rect x="45" y="102" rx="1" ry="60" width="18" height="3" />
            <rect x="45" y="87" rx="1" ry="60" width="15" height="3" />

            <rect x="68" y="102" rx="1" ry="60" width="18" height="3" />
            <rect x="68" y="107" rx="1" ry="60" width="15" height="3" />

            <rect x="91" y="102" rx="1" ry="60" width="18" height="3" />
            <rect x="91" y="107" rx="1" ry="60" width="15" height="3" />

            <rect x="114" y="102" rx="1" ry="60" width="18" height="3" />
            <rect x="114" y="107" rx="1" ry="60" width="15" height="3" />

            <rect x="136" y="102" rx="1" ry="60" width="18" height="3" />
            <rect x="136" y="107" rx="1" ry="60" width="15" height="3" />

            <rect x="158" y="102" rx="1" ry="60" width="18" height="3" />
            <rect x="158" y="107" rx="1" ry="60" width="15" height="3" />

            <rect x="180" y="102" rx="1" ry="60" width="18" height="3" />
            <rect x="180" y="107" rx="1" ry="60" width="15" height="3" />

          </ContentLoader>
        </svg>
      </div>
    </>
  );
};

export default RosterEmpTable;
