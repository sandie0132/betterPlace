import React from 'react';
import ContentLoader from 'react-content-loader';
import styles from './OpsHome.module.scss';
import cx from 'classnames';
import themes from '../../../../theme.scss';

const OpsHome = props => {
  const primaryColor = themes.loaderPrimary;
  const secondaryColor = themes.tileLoaderSecondary;

  const loaders = [];
  for (let i = 0; i < 5; i++) {
    loaders.push(
      <div key={i} className={cx("mr-4 ml-0", styles.AlignLoader)}>
        <svg width="100%">
          <ContentLoader
            height={450}
            width={2000}
            speed={5}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}>
            <rect x="0" y="0" rx="50" ry="30" width="100%" height="70%" />
          </ContentLoader>
        </svg>
      </div>
    )
  }

  return (
    <React.Fragment>
      <div className='ml-0 mt-3'>
        <svg viewBox="10 50 2000 210" className="col-10 px-0">
          <ContentLoader
            height={600}
            width={200}
            speed={10}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}>

            <rect x="3" y="350" rx="3" ry="100" width="20%" height="31%"></rect>
          </ContentLoader>
        </svg>

        <svg width="50%" height="95%">
          <ContentLoader
            height={500}
            width={200}
            speed={1}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}>

            <rect x="0" y="0" rx="100%" ry="100%" width="20%" height="65%"></rect>
            <rect x="60" y="40" rx="6" ry="100" width="70%" height="16%"></rect>
            <rect x="60" y="155" rx="4" ry="100" width="50%" height="11%"></rect>
            <rect x="60" y="240" rx="4" ry="100" width="38%" height="11%"></rect>

            <rect x="0" y="420" rx="6" ry="100" width="31%" height="16%"></rect>
          </ContentLoader>
        </svg>
      </div>

      <div className='row ml-0' style={{marginTop: '2rem'}}>
        {loaders}
      </div>

      <hr className={styles.HorizontalLine} />

      <div>
        <svg viewBox="0 0 1500 100">
          <ContentLoader
            height={600}
            width={200}
            speed={10}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}>

            <rect x="0" y="200" rx="3" ry="100" width="17%" height="35%"></rect>
          </ContentLoader>
        </svg>
      </div>

      <div className='row ml-0 mt-1'>
        <div className={cx("mr-4 ml-0", styles.AlignLoader)}>
          <svg width="100%">
            <ContentLoader
              height={450}
              width={2000}
              speed={5}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}>
              <rect x="0" y="0" rx="50" ry="30" width="100%" height="70%" />
            </ContentLoader>
          </svg>
        </div>
      </div>

    </React.Fragment>


  )
}
export default OpsHome;