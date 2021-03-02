import React from 'react';
import ContentLoader from 'react-content-loader';
import styles from './onboardTodoLoader.module.scss';
import cx from 'classnames';
import themes from '../../../../theme.scss';

const onBoardTodo = props => {
  const primaryColor = themes.loaderPrimary;
  const secondaryColor = themes.tileLoaderSecondary;

  const loaders = [];
  for (let i = 0; i < 4; i++) {
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

      <div className='row ml-0' style={{marginTop: '10rem'}}>
        {loaders}
      </div>

    </React.Fragment>


  )
}
export default onBoardTodo;