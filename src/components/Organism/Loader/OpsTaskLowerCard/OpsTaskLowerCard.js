import React from 'react';
import ContentLoader from 'react-content-loader';
import cx from 'classnames';
import styles from './OpsTaskLowerCard.module.scss';
import themes from '../../../../theme.scss';

const OpsTaskLowerCard = props => {
    const primaryColor = themes.loaderPrimary;
    const secondaryColor = themes.loaderSecondary;

    return (
        <React.Fragment>

            {/* <div className={cx("p-2")}>
                <svg viewBox="0 0 2100 100">
                    <ContentLoader
                        height={500}
                        width={200}
                        speed={1}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}>

                        <rect x="0" y="60" rx="5" ry="200" width="100%" height="65%" />

                    </ContentLoader>
                </svg>

            </div> */}

            <div className={cx("px-2 py-3 mb-4", styles.FormBackgroundColor)}>
                <svg viewBox="0 0 2100 500">
                    <ContentLoader
                        height={500}
                        width={200}
                        speed={1}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}>

                        <rect x="8" y="40" rx="4" ry="100" width="28%" height="19%" />

                        <rect x="8" y="200" rx="4" ry="100" width="28%" height="19%" />
                        <rect x="8" y="340" rx="4" ry="100" width="28%" height="19%" />

                        <rect x="75" y="200" rx="4" ry="100" width="26%" height="19%" />
                        <rect x="75" y="340" rx="4" ry="100" width="26%" height="19%" />

                        <rect x="140" y="200" rx="4" ry="100" width="26%" height="19%" />
                        <rect x="140" y="340" rx="4" ry="100" width="26%" height="19%" />

                    </ContentLoader>
                </svg>

                <hr className={styles.HorizontalLine} />

                <div style={{ marginTop: "2rem" }}>
                    <svg viewBox="0 0 2100 400">
                        <ContentLoader
                            height={500}
                            width={200}
                            speed={1}
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}>

                            <rect x="8" y="0" rx="3" ry="100" width="90%" height="12%" />
                            <rect x="8" y="110" rx="3" ry="100" width="90%" height="12%" />
                            <rect x="8" y="220" rx="3" ry="100" width="90%" height="12%" />

                        </ContentLoader>
                    </svg>
                </div>
            </div>

        </React.Fragment>

    )
}
export default OpsTaskLowerCard;