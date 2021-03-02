import React from 'react';
import ContentLoader from 'react-content-loader';
import cx from 'classnames';
import styles from './OpsTaskCardLoader.module.scss';
import themes from '../../../../theme.scss';

const OpsTaskCardLoader = props => {
  const primaryColor = themes.loaderPrimary;
  const secondaryColor = themes.loaderSecondary;

  return (
    <React.Fragment>
      <div className={cx("px-2 pt-4 pb-3 mt-4", styles.FormBackgroundColor)} style={{ marginBottom: '32px' }}>
        <svg viewBox="0 0 2500 350">
          <ContentLoader
            height={500}
            width={200}
            speed={1}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          >
            <rect x="8" y="40" rx="4" ry="100" width="28%" height="25%"></rect>
            <rect x="8" y="240" rx="4" ry="100" width="25%" height="30%"></rect>

            <rect x="159" y="22" width="16.7%" height="75%"></rect>

          </ContentLoader>
        </svg>
      </div>
    </React.Fragment >
  )
}

export default OpsTaskCardLoader;