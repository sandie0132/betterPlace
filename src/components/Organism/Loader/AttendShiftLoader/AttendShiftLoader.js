import React from 'react';
import ContentLoader from 'react-content-loader';
import cx from 'classnames';
import styles from './AttendShiftLoader.module.scss';
import themes from '../../../../theme.scss';

const onBoardTodo = () => {
  const primaryColor = themes.loaderPrimary;
  const secondaryColor = themes.tileLoaderSecondary;

  const loaders = [];
  for (let i = 0; i < 6; i += 1) {
    loaders.push(
      <div key={i} className={cx('ml-0', styles.AlignLoader)}>
        <svg width="100%" height="100%">
          <ContentLoader
            height={546}
            width={1200}
            speed={5}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          >
            <rect x="0" y="0" rx="50" ry="30" width="100%" height="100%" />
          </ContentLoader>
        </svg>
      </div>,
    );
  }

  return (
    <>

      <div className="row ml-0" style={{ marginTop: '0rem' }}>
        {loaders}
      </div>

    </>

  );
};
export default onBoardTodo;
