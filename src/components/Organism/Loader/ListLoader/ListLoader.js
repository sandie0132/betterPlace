import React from 'react';
import ContentLoader from 'react-content-loader';
import cx from 'classnames';
import styles from './ListLoader.module.scss';
import themes from '../../../../theme.scss';

const ListLoader = props => {
  const primaryColor=themes.loaderPrimary;
  const secondaryColor=themes.loaderSecondary;

  return (
    <React.Fragment>
      <div className={cx("p-2 my-4", styles.FormBackgroundColor)}>

        <svg viewBox="0 0 2500 500">
          <ContentLoader
            height={500}
            width={200}
            speed={1}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          >
            <rect x="10" y="40" rx="3" ry="100" width="17%" height="11%" />
            <rect x="10" y="150" rx="3" ry="100" width="17%" height="11%" />
            <rect x="10" y="260" rx="3" ry="100" width="17%" height="11%" />

            <rect x="80" y="40" rx="3" ry="100" width="16%" height="11%" />
            <rect x="80" y="150" rx="3" ry="100" width="15%" height="11%" />
            <rect x="80" y="260" rx="3" ry="100" width="22%" height="11%" />

            <rect x="150" y="40" rx="3" ry="100" width="25%" height="11%" />
            <rect x="150" y="200" rx="5" ry="100" width="15%" height="25%" />

          </ContentLoader>
        </svg>

      </div>
      <div className={cx("p-2 my-4", styles.FormBackgroundColor)}>

        <svg viewBox="0 0 2500 500">
          <ContentLoader
            height={500}
            width={200}
            speed={1}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}>
            <rect x="10" y="40" rx="3" ry="100" width="17%" height="11%" />
            <rect x="10" y="150" rx="3" ry="100" width="17%" height="11%" />
            <rect x="10" y="260" rx="3" ry="100" width="17%" height="11%" />

            <rect x="80" y="40" rx="3" ry="100" width="18%" height="11%" />
            <rect x="80" y="150" rx="3" ry="100" width="22%" height="11%" />
            <rect x="80" y="260" rx="3" ry="100" width="15%" height="11%" />

            <rect x="150" y="40" rx="3" ry="100" width="25%" height="11%" />
            <rect x="150" y="200" rx="5" ry="100" width="15%" height="25%" />

          </ContentLoader>
        </svg>

      </div>
      <div className={cx("p-2 my-4", styles.FormBackgroundColor)}>

        <svg viewBox="0 0 2500 500">
          <ContentLoader
            height={500}
            width={200}
            speed={1}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}>
            <rect x="10" y="40" rx="3" ry="100" width="17%" height="11%" />
            <rect x="10" y="150" rx="3" ry="100" width="19%" height="11%" />
            <rect x="10" y="260" rx="3" ry="100" width="17%" height="11%" />

            <rect x="80" y="40" rx="3" ry="100" width="18%" height="11%" />
            <rect x="80" y="150" rx="3" ry="100" width="18%" height="11%" />
            <rect x="80" y="260" rx="3" ry="100" width="22%" height="11%" />

            <rect x="150" y="40" rx="3" ry="100" width="25%" height="11%" />
            <rect x="150" y="200" rx="5" ry="100" width="15%" height="25%" />

          </ContentLoader>
        </svg>

      </div>


    </React.Fragment >

  )
}
export default ListLoader;