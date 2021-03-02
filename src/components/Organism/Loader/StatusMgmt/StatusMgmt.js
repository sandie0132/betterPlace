import React from 'react';
import ContentLoader from 'react-content-loader';
import cx from 'classnames';
import themes from '../../../../theme.scss';
import styles from './StatusMgmt.module.scss';

const StatusMgmt = props => {
    const primaryColor = themes.loaderPrimary;
    const secondaryColor = themes.loaderSecondary;

    return (
        <React.Fragment>

            <div className={cx("p-4 pb-2 mb-4", styles.FormBackgroundColor)}>

                <svg viewBox="0 0 2000 250">
                    <ContentLoader
                        height={500}
                        width={200}
                        speed={10}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}>

                        <rect x="5" y="50" rx="3" ry="100" width="16%" height="22%"></rect>
                        <rect x="5" y="250" rx="5" ry="100" width="65%" height="32%"></rect>

                    </ContentLoader>
                </svg>

                <svg viewBox="0 0 2000 250">
                    <ContentLoader
                        height={500}
                        width={200}
                        speed={10}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}>

                        <rect x="5" y="0" rx="5" ry="100" width="65%" height="32%"></rect>
                        <rect x="5" y="350" rx="3" ry="100" width="16%" height="22%"></rect>

                    </ContentLoader>
                </svg>

                <svg viewBox="0 0 2000 250">
                    <ContentLoader
                        height={500}
                        width={200}
                        speed={10}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}>

                        <rect x="5" y="30" rx="5" ry="100" width="65%" height="32%"></rect>
                        <rect x="5" y="250" rx="5" ry="100" width="65%" height="32%"></rect>

                    </ContentLoader>
                </svg>

                <svg viewBox="0 0 2000 250">
                    <ContentLoader
                        height={500}
                        width={200}
                        speed={10}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}>

                        <rect x="5" y="60" rx="3" ry="100" width="16%" height="22%"></rect>
                        <rect x="5" y="250" rx="5" ry="100" width="65%" height="32%"></rect>

                    </ContentLoader>
                </svg>

                <hr className={styles.HorizontalLine} />

                <svg viewBox="0 0 2000 400">
                    <ContentLoader
                        height={500}
                        width={200}
                        speed={10}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}>

                        <rect x="5" y="50" rx="3" ry="100" width="55%" height="14%"></rect>
                        <rect x="5" y="155" rx="3" ry="100" width="36%" height="11%"></rect>
                        <rect x="5" y="240" rx="3" ry="100" width="26%" height="11%"></rect>
                        <rect x="5" y="325" rx="3" ry="100" width="33%" height="11%"></rect>

                    </ContentLoader>
                </svg>
            </div>
        </React.Fragment>
    )
}
export default StatusMgmt;