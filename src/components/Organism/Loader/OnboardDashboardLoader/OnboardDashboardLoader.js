import React from 'react';
import ContentLoader from 'react-content-loader';
import cx from 'classnames';
import styles from './OnboardDashboardLoader.module.scss';
import themes from '../../../../theme.scss';

const OnboardDashboardLoader = props => {
    const primaryColor = themes.loaderPrimary;
    const secondaryColor = themes.loaderSecondary;

    return (
        <React.Fragment>

            <div className={cx("p-2 mb-2")}>
                <svg viewBox="0 0 2500 100">
                    <ContentLoader
                        height={500}
                        width={200}
                        speed={1}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                    >
                        <rect x="0" y="55" rx="4" ry="100%" width="17%" height="70%"></rect>
                    </ContentLoader>
                </svg>
            </div>

            <div className={cx("p-2 mb-2")}>
            <div className={cx(styles.Cards, "mr-2")}>
                <svg viewBox="0 0 1800 850">
                    <ContentLoader
                        height={500}
                        width={200}
                        speed={1}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                    >
                        <rect x="5" y="55" rx="4" ry="50%" width="17%" height="8%"></rect>
                        <rect x="45" y="55" rx="4" ry="100%" width="75%" height="8%"></rect>

                        <rect x="5" y="135" rx="4" ry="50%" width="17%" height="8%"></rect>
                        <rect x="45" y="135" rx="4" ry="100%" width="75%" height="8%"></rect>

                        <rect x="5" y="215" rx="4" ry="50%" width="17%" height="8%"></rect>
                        <rect x="45" y="215" rx="4" ry="100%" width="75%" height="8%"></rect>

                        <rect x="5" y="295" rx="4" ry="50%" width="17%" height="8%"></rect>
                        <rect x="45" y="295" rx="4" ry="100%" width="75%" height="8%"></rect>

                        <rect x="5" y="375" rx="4" ry="50%" width="17%" height="8%"></rect>
                        <rect x="45" y="375" rx="4" ry="100%" width="75%" height="8%"></rect>

                    </ContentLoader>
                </svg>
                </div>
            </div>

            <div className={cx("py-2 mt-3")}>
                <svg viewBox="0 0 2500 100">
                    <ContentLoader
                        height={500}
                        width={200}
                        speed={1}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                    >
                        <rect x="0" y="55" rx="4" ry="100%" width="17%" height="70%"></rect>
                    </ContentLoader>
                </svg>
            </div>

            <div className={"row ml-0 mb-3"}>
                <div className={cx(styles.Cards, "mr-2")}>
                    <svg viewBox="0 0 1400 500">
                        <ContentLoader
                            height={500}
                            width={200}
                            speed={1}
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}>

                            <rect x="12" y="50" rx="4" ry="100" width="43%" height="8%"></rect>

                            <rect x="12" y="130" rx="0" ry="0" width="3.2%" height="57%"></rect>
                            <rect x="20" y="130" rx="0" ry="0" width="3.2%" height="57%"></rect>

                            <rect x="36" y="130" rx="0" ry="0" width="3.2%" height="57%"></rect>
                            <rect x="44" y="130" rx="0" ry="0" width="3.2%" height="57%"></rect>

                            <rect x="59" y="130" rx="0" ry="0" width="3.2%" height="57%"></rect>
                            <rect x="67" y="130" rx="0" ry="0" width="3.2%" height="57%"></rect>

                            <rect x="82" y="130" rx="0" ry="0" width="3.2%" height="57%"></rect>
                            <rect x="90" y="130" rx="0" ry="0" width="3.2%" height="57%"></rect>

                            <rect x="106" y="130" rx="0" ry="0" width="3.2%" height="57%"></rect>
                            <rect x="114" y="130" rx="0" ry="0" width="3.2%" height="57%"></rect>

                            <rect x="129" y="130" rx="0" ry="0" width="3.2%" height="57%"></rect>
                            <rect x="137" y="130" rx="0" ry="0" width="3.2%" height="57%"></rect>

                            <rect x="153" y="130" rx="0" ry="0" width="3.2%" height="57%"></rect>
                            <rect x="161" y="130" rx="0" ry="0" width="3.2%" height="57%"></rect>

                            <rect x="177" y="130" rx="0" ry="0" width="3.2%" height="57%"></rect>
                            <rect x="185" y="130" rx="0" ry="0" width="3.2%" height="57%"></rect>

                        </ContentLoader>
                    </svg>
                </div>
            </div>


        </React.Fragment >
    )
}

export default OnboardDashboardLoader;