import React from 'react';
import ContentLoader from 'react-content-loader';
import cx from 'classnames';
import themes from '../../../../theme.scss';
import styles from './SpocLoader.module.scss';

const SpocLoader = props => {
    const primaryColor = themes.loaderPrimary;
    const secondaryColor = themes.loaderSecondary;

    return (
        <React.Fragment>
            <div className={cx('flex row px-0')}>

                <svg viewBox="10 50 2000 200" className="col-10">
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

            <div className={cx("p-4 pb-2 mb-4", styles.FormBackgroundColor)}>

                <svg viewBox="0 0 2000 150">
                    <ContentLoader
                        height={500}
                        width={200}
                        speed={10}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}>

                        <rect x="5" y="150" rx="5" ry="500" width="65%" height="65%"></rect>

                    </ContentLoader>
                </svg>


                <svg width="50%">
                    <ContentLoader
                        height={500}
                        width={200}
                        speed={1}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}>

                        <rect x="10" y="78" rx="100%" ry="100%" width="19%" height="55%"></rect>

                        <rect x="55" y="110" rx="6" ry="100" width="43%" height="13%"></rect>
                        <rect x="55" y="205" rx="6" ry="100" width="36%" height="13%"></rect>
                        <rect x="55" y="300" rx="6" ry="100" width="52%" height="11%"></rect>

                    </ContentLoader>
                </svg>



                <hr className={styles.HorizontalLine} />

                <svg viewBox="0 0 2000 150">
                    <ContentLoader
                        height={500}
                        width={200}
                        speed={10}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}>

                        <rect x="5" y="150" rx="5" ry="500" width="65%" height="65%"></rect>

                    </ContentLoader>
                </svg>

                <div className='row'>

                    <svg width="50%">
                        <ContentLoader
                            height={500}
                            width={200}
                            speed={1}
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}>

                            <rect x="10" y="78" rx="100%" ry="100%" width="19%" height="55%"></rect>
                            <rect x="55" y="110" rx="6" ry="100" width="43%" height="13%"></rect>
                            <rect x="55" y="205" rx="6" ry="100" width="36%" height="13%"></rect>
                            <rect x="55" y="300" rx="6" ry="100" width="52%" height="11%"></rect>

                        </ContentLoader>
                    </svg>

                    <svg width="50%">
                        <ContentLoader
                            height={500}
                            width={200}
                            speed={1}
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}>

                            <rect x="10" y="78" rx="100%" ry="100%" width="19%" height="55%"></rect>
                            <rect x="55" y="110" rx="6" ry="100" width="43%" height="13%"></rect>
                            <rect x="55" y="205" rx="6" ry="100" width="36%" height="13%"></rect>
                            <rect x="55" y="300" rx="6" ry="100" width="52%" height="11%"></rect>

                        </ContentLoader>
                    </svg>

                </div>

                <div className='row'>

                    <svg width="50%">
                        <ContentLoader
                            height={500}
                            width={200}
                            speed={1}
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}>

                            <rect x="10" y="78" rx="100%" ry="100%" width="19%" height="55%"></rect>
                            <rect x="55" y="110" rx="6" ry="100" width="43%" height="13%"></rect>
                            <rect x="55" y="205" rx="6" ry="100" width="36%" height="13%"></rect>
                            <rect x="55" y="300" rx="6" ry="100" width="52%" height="11%"></rect>

                        </ContentLoader>
                    </svg>

                    <svg width="50%">
                        <ContentLoader
                            height={500}
                            width={200}
                            speed={1}
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}>

                            <rect x="10" y="78" rx="100%" ry="100%" width="19%" height="55%"></rect>
                            <rect x="55" y="110" rx="6" ry="100" width="43%" height="13%"></rect>
                            <rect x="55" y="205" rx="6" ry="100" width="36%" height="13%"></rect>
                            <rect x="55" y="300" rx="6" ry="100" width="52%" height="11%"></rect>

                        </ContentLoader>
                    </svg>

                </div>

                <hr className={styles.HorizontalLine} />

                <svg viewBox="0 0 2000 150">
                    <ContentLoader
                        height={500}
                        width={200}
                        speed={10}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}>

                        <rect x="160" y="100" rx="5" ry="150" width="19%" height="65%"></rect>

                    </ContentLoader>
                </svg>

            </div>
        </React.Fragment>
    )
}
export default SpocLoader;