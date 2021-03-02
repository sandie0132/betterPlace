import React from 'react';
import ContentLoader from 'react-content-loader';
import cx from 'classnames';
import styles from './OrgProfileLoader.module.scss';
import themes from '../../../../theme.scss';

const OrgProfileLoader = props => {
  const primaryColor = themes.loaderPrimary;
  const secondaryColor = themes.loaderSecondary;

  return (

    <React.Fragment>
      <div className={cx("pr-2 pb-2 mb-2 pt-5 pl-4", styles.FormBackgroundColor)}>
        <svg viewBox="0 0 2500 350">
          <ContentLoader
            height={500}
            width={200}
            speed={1}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          >
            <rect x="6" y="55" rx="2" ry="40" width="11%" height="75%" />

            <rect x="34" y="60" rx="2" ry="40" width="33%" height="13%" />
            <rect x="34" y="215" rx="2" ry="40" width="55%" height="13%" />
            <rect x="34" y="340" rx="2" ry="40" width="29%" height="13%" />

          </ContentLoader>
        </svg>

        <div className='mt-4'>

          <svg viewBox="10 50 2500 210">
            <ContentLoader
              height={500}
              width={200}
              speed={1}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            >
              <rect x="3" y="185" rx="55" ry="100%" width="5%" height="55%"></rect>
              <rect x="15" y="250" rx="3" ry="100" width="14%" height="29%"></rect>

            </ContentLoader>
          </svg>
        </div>

        <svg viewBox="0 0 2500 500">

          <ContentLoader
            height={500}
            width={200}
            speed={1}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          >
            <rect x="3" y="0" rx="2" ry="40" width="19.5%" height="99%"></rect>
            <rect x="48" y="0" rx="2" ry="40" width="19.5%" height="99%"></rect>
            <rect x="93" y="0" rx="2" ry="40" width="19.5%" height="99%"></rect>

          </ContentLoader>
        </svg>

        <div className='mt-4'>

          <svg viewBox="10 50 2500 210">
            <ContentLoader
              height={500}
              width={200}
              speed={1}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            >
              <rect x="3" y="185" rx="55" ry="100%" width="5%" height="55%"></rect>
              <rect x="15" y="250" rx="3" ry="100" width="14%" height="29%"></rect>

            </ContentLoader>
          </svg>
        </div>

        <svg viewBox="0 0 2500 500">

          <ContentLoader
            height={500}
            width={200}
            speed={1}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          >
            <rect x="3" y="0" rx="2" ry="40" width="19.5%" height="99%"></rect>
            <rect x="48" y="0" rx="2" ry="40" width="19.5%" height="99%"></rect>
            <rect x="93" y="0" rx="2" ry="40" width="19.5%" height="99%"></rect>

          </ContentLoader>
        </svg>

      </div>
    </React.Fragment >

    // <React.Fragment>
    //   <div className={cx("p-2 mb-2", styles.FormBackgroundColor)}>
    //     <svg viewBox="0 0 2500 350">
    //       <ContentLoader
    //         height={500}
    //         width={200}
    //         speed={1}
    //         primaryColor={primaryColor}
    //         secondaryColor={secondaryColor}
    //       >
    //         <rect x="5" y="55" rx="2" ry="40" width="11%" height="75%" />

    //         <rect x="30" y="60" rx="2" ry="40" width="33%" height="13%" />
    //         <rect x="30" y="215" rx="2" ry="40" width="55%" height="13%" />
    //         <rect x="30" y="340" rx="2" ry="40" width="29%" height="13%" />

    //       </ContentLoader>
    //     </svg>
    //   </div>

    //   <div className={cx("pt-2 pb-0")}>
    //     <svg viewBox="0 0 2000 90">
    //       <ContentLoader
    //         height={500}
    //         width={200}
    //         speed={1}
    //         primaryColor={primaryColor}
    //         secondaryColor={secondaryColor}
    //       >
    //         <rect x="0" y="40" rx="3" ry="150" width="15%" height="45%" />
    //       </ContentLoader>
    //     </svg>
    //   </div>

    //   <div className={"row no-gutters justify-content-between ml-0 mb-3"}>
    //     <div className={cx(styles.Cards,"mr-2")}>
    //       <svg viewBox="0 0 2500 1250">
    //         <ContentLoader
    //           height={500}
    //           width={200}
    //           speed={1}
    //           primaryColor={primaryColor}
    //           secondaryColor={secondaryColor}>

    //           <rect x="10" y="55" rx="7" ry="30" width="40%" height="75%" />
    //           <rect x="100" y="125" rx="6" ry="100" width="43%" height="13%" />
    //           <rect x="100" y="300" rx="6" ry="100" width="43%" height="13%" />

    //         </ContentLoader>
    //       </svg>
    //     </div>

    //     <div className={cx(styles.Cards, "mx-3")}>
    //       <svg viewBox="0 0 2500 1250">
    //         <ContentLoader
    //           height={500}
    //           width={200}
    //           speed={1}
    //           primaryColor={primaryColor}
    //           secondaryColor={secondaryColor}>

    //           <rect x="10" y="55" rx="7" ry="30" width="40%" height="75%" />
    //           <rect x="100" y="125" rx="6" ry="100" width="43%" height="13%" />
    //           <rect x="100" y="300" rx="6" ry="100" width="43%" height="13%" />

    //         </ContentLoader>
    //       </svg>
    //     </div>

    //     <div className={cx(styles.Cards, "ml-2")}>
    //       <svg viewBox="0 0 2500 1250">
    //         <ContentLoader
    //           height={500}
    //           width={200}
    //           speed={1}
    //           primaryColor={primaryColor}
    //           secondaryColor={secondaryColor}>

    //           <rect x="10" y="55" rx="7" ry="30" width="40%" height="75%" />
    //           <rect x="100" y="125" rx="6" ry="100" width="43%" height="13%" />
    //           <rect x="100" y="300" rx="6" ry="100" width="43%" height="13%" />

    //         </ContentLoader>
    //       </svg>
    //     </div>
    //   </div>

    //   <div className={cx("px-2")}>
    //     <svg viewBox="0 0 2000 90">
    //       <ContentLoader
    //         height={500}
    //         width={200}
    //         speed={1}
    //         primaryColor={primaryColor}
    //         secondaryColor={secondaryColor}
    //       >
    //         <rect x="0" y="40" rx="3" ry="150" width="15%" height="45%" />
    //       </ContentLoader>
    //     </svg>
    //   </div>

    //   <div className={"row no-gutters justify-content-between ml-0"}>
    //     <div className={cx(styles.Cards, "mr-2")}>
    //       <svg viewBox="0 0 2500 1250">
    //         <ContentLoader
    //           height={500}
    //           width={200}
    //           speed={1}
    //           primaryColor={primaryColor}
    //           secondaryColor={secondaryColor}>

    //           <rect x="10" y="55" rx="7" ry="30" width="40%" height="75%" />
    //           <rect x="100" y="125" rx="6" ry="100" width="43%" height="13%" />
    //           <rect x="100" y="300" rx="6" ry="100" width="43%" height="13%" />

    //         </ContentLoader>
    //       </svg>
    //     </div>

    //     <div className={cx(styles.Cards, "mx-3")}>
    //       <svg viewBox="0 0 2500 1250">
    //         <ContentLoader
    //           height={500}
    //           width={200}
    //           speed={1}
    //           primaryColor={primaryColor}
    //           secondaryColor={secondaryColor}>

    //           <rect x="10" y="55" rx="7" ry="30" width="40%" height="75%" />
    //           <rect x="100" y="125" rx="6" ry="100" width="43%" height="13%" />
    //           <rect x="100" y="300" rx="6" ry="100" width="43%" height="13%" />

    //         </ContentLoader>
    //       </svg>
    //     </div>

    //     <div className={cx(styles.Cards, "ml-2")}>
    //       <svg viewBox="0 0 2500 1250">
    //         <ContentLoader
    //           height={500}
    //           width={200}
    //           speed={1}
    //           primaryColor={primaryColor}
    //           secondaryColor={secondaryColor}>

    //           <rect x="10" y="55" rx="7" ry="30" width="40%" height="75%" />
    //           <rect x="100" y="125" rx="6" ry="100" width="43%" height="13%" />
    //           <rect x="100" y="300" rx="6" ry="100" width="43%" height="13%" />

    //         </ContentLoader>
    //       </svg>
    //     </div>
    //   </div>

    // </React.Fragment >
  )
}

export default OrgProfileLoader;