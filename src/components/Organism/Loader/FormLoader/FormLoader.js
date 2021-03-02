import React from 'react';
import ContentLoader from 'react-content-loader';
import cx from 'classnames';
import themes from '../../../../theme.scss';
import styles from './FormLoader.module.scss';

const FormLoader = props => {
  const primaryColor = themes.loaderPrimary;
  const secondaryColor = themes.loaderSecondary;

  return (

    <React.Fragment>

      <div className={cx('flex row px-0')}>

        <svg viewBox="10 50 2000 210" className="col-10">
          <ContentLoader
            height={600}
            width={200}
            speed={10}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}>
            <rect x="3" y="340" rx="55" ry="100%" width="5%" height="43%"></rect>
            <rect x="15" y="400" rx="3" ry="100" width="35%" height="20%"></rect>
          </ContentLoader>
        </svg>

      </div>

      <div className={cx("p-4 pb-2", styles.FormBackgroundColor)}>

        <svg viewBox="0 0 2000 210">
          <ContentLoader
            height={500}
            width={200}
            speed={10}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}>
            <rect x="0" y="20" rx="3" ry="100" width="14%" height="20%" />
            <rect x="0" y="177" rx="5" ry="100" width="47%" height="48%" />

            <rect x="130" y="20" rx="3" ry="100" width="21%" height="20%" />
            <rect x="130" y="270" rx="5" ry="100" width="32%" height="48%" />

          </ContentLoader>
        </svg>

        <svg viewBox="0 0 2000 210">
          <ContentLoader
            height={500}
            width={200}
            speed={10}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}>
            <rect x="0" y="20" rx="3" ry="100" width="14%" height="20%" />
            <rect x="0" y="177" rx="5" ry="100" width="47%" height="48%" />


          </ContentLoader>
        </svg>




        <svg viewBox="0 0 2000 210">
          <ContentLoader
            height={500}
            width={200}
            speed={10}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}>
            <rect x="0" y="20" rx="3" ry="100" width="14%" height="20%" />
            <rect x="0" y="177" rx="5" ry="100" width="47%" height="48%" />


          </ContentLoader>
        </svg>

        <svg viewBox="0 0 2000 210">
          <ContentLoader
            height={500}
            width={200}
            speed={10}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}>
            <rect x="0" y="20" rx="3" ry="100" width="14%" height="20%" />
            <rect x="0" y="177" rx="5" ry="100" width="32%" height="48%" />

            <rect x="130" y="20" rx="3" ry="100" width="8%" height="20%" />
            <rect x="130" y="210" rx="5" ry="100" width="32%" height="48%" />



          </ContentLoader>
        </svg>

        <svg viewBox="0 0 2000 210">
          <ContentLoader
            height={500}
            width={200}
            speed={10}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}>
            <rect x="0" y="20" rx="3" ry="100" width="14%" height="20%" />
            <rect x="0" y="177" rx="5" ry="100" width="32%" height="48%" />


          </ContentLoader>
        </svg>

        <svg viewBox="0 0 2000 210">
          <ContentLoader
            height={500}
            width={200}
            speed={10}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}>
            <rect x="0" y="20" rx="3" ry="100" width="14%" height="20%" />
            <rect x="0" y="177" rx="5" ry="100" width="32%" height="48%" />


          </ContentLoader>
        </svg>

        <svg viewBox="0 0 2000 210">
          <ContentLoader
            height={500}
            width={200}
            speed={10}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}>
            <rect x="0" y="20" rx="3" ry="100" width="14%" height="20%" />
            <rect x="70" y="20" rx="3" ry="100" width="14%" height="20%" />
          </ContentLoader>
        </svg>

        <svg viewBox="0 0 2000 210">
          <ContentLoader
            height={500}
            width={200}
            speed={10}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}>
            <rect x="0" y="20" rx="3" ry="100" width="18%" height="20%" />
            <rect x="0" y="185" rx="5" ry="100" width="22%" height="39%" />
            <rect x="52" y="185" rx="5" ry="100" width="22%" height="39%" />
            <rect x="104" y="185" rx="5" ry="100" width="22%" height="39%" />
          </ContentLoader>
        </svg>

        <svg viewBox="0 0 2000 220">
          <ContentLoader
            height={500}
            width={200}
            speed={10}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}>
            <rect x="0" y="177" rx="5" ry="100" width="15%" height="45%" />
          </ContentLoader>
        </svg>



      </div>


    </React.Fragment>

  )
}
export default FormLoader;