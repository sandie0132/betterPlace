import React from 'react';
import ContentLoader from 'react-content-loader';
import styles from './TileLoader.module.scss';
import cx from 'classnames';
import themes from '../../../../theme.scss';

const TileLoader = props => {
  const primaryColor = themes.loaderPrimary;
  const secondaryColor = themes.tileLoaderSecondary;

  const loaders = [];
  for (let i = 0; i < 9; i++) {
    loaders.push(
      <div key={i} className={cx("col-4 px-4 pb-4", styles.AlignLoader)}>
        <svg width="100%" height="100%" viewBox="0 0 1700 1100">
          <ContentLoader
            height={700}
            width={3500}
            speed={5}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}>
            <rect x="0" y="35" rx="50" ry="30" width="100%" height="60%" />
            <rect x="0" y="550" rx="100" ry="100" width="58%" height="13%" />
            <rect x="2600" y="550" rx="100" ry="100" width="15%" height="13%" />
          </ContentLoader>
        </svg>
      </div>
    )
  }

  return (
    <React.Fragment>
      <div className="container row pl-0 pr-0">
        <div className='row no-gutters w-100'>
          <svg width="100%" height="100%">
            <ContentLoader
              height={500}
              width={200}
              speed={5}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            >
              <rect x="0" y="100" rx="4" ry="100" width="100%" height="28%" />
              <rect x="0" y="300" rx="4" ry="100" width="100%" height="28%" />

            </ContentLoader>
          </svg>
        </div>
        <div className='row mt-4'>
          {loaders}
        </div>
      </div>

    </React.Fragment>


  )
}
export default TileLoader;