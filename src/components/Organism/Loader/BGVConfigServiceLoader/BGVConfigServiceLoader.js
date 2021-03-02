import React from 'react';
import ContentLoader from 'react-content-loader';
import cx from 'classnames';
import themes from '../../../../theme.scss';
import styles from './BGVConfigServiceLoader.module.scss';

const BGVConfigServiceLoader = props => {
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

                        <rect x="5" y="150" rx="3" ry="100" width="95%" height="30%"></rect>

                    </ContentLoader>
                </svg>

                <hr className={styles.HorizontalLine} />

                <svg viewBox="0 0 2000 300">
                    <ContentLoader
                        height={500}
                        width={200}
                        speed={10}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}>

                        <rect x="5" y="120" rx="3" ry="100" width="14%" height="14%"></rect>
                        <rect x="5" y="250" rx="5" ry="100" width="24%" height="33%"></rect>
                        <rect x="60" y="290" rx="3" ry="100" width="67%" height="15%"></rect>

                    </ContentLoader>
                </svg>

                <svg viewBox="0 0 2000 300">
                    <ContentLoader
                        height={500}
                        width={200}
                        speed={10}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}>

                        <rect x="5" y="10" rx="5" ry="100" width="24%" height="33%"></rect>
                        <rect x="60" y="50" rx="3" ry="100" width="67%" height="15%"></rect>

                        <rect x="5" y="260" rx="5" ry="100" width="24%" height="33%"></rect>
                        <rect x="60" y="310" rx="3" ry="100" width="67%" height="15%"></rect>

                    </ContentLoader>
                </svg>

                <svg viewBox="0 0 2000 300">
                    <ContentLoader
                        height={500}
                        width={200}
                        speed={10}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}>

                        <rect x="5" y="10" rx="5" ry="100" width="24%" height="33%"></rect>
                        <rect x="60" y="50" rx="3" ry="100" width="67%" height="15%"></rect>

                        <rect x="5" y="260" rx="5" ry="100" width="24%" height="33%"></rect>
                        <rect x="60" y="310" rx="3" ry="100" width="67%" height="15%"></rect>

                    </ContentLoader>
                </svg>

                <hr className={styles.HorizontalLine} />

                <svg viewBox="0 0 2000 300">
                    <ContentLoader
                        height={500}
                        width={200}
                        speed={10}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}>

                        <rect x="5" y="120" rx="3" ry="100" width="14%" height="14%"></rect>
                        <rect x="5" y="250" rx="5" ry="100" width="24%" height="33%"></rect>
                        <rect x="60" y="290" rx="3" ry="100" width="67%" height="15%"></rect>

                    </ContentLoader>
                </svg>

                <svg viewBox="0 0 2000 150">
                    <ContentLoader
                        height={500}
                        width={200}
                        speed={10}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}>

                        <rect x="5" y="10" rx="5" ry="100%" width="24%" height="65%"></rect>
                        <rect x="60" y="70" rx="3" ry="100" width="67%" height="28%"></rect>

                    </ContentLoader>
                </svg>

                <hr className={styles.HorizontalLine} />

                <svg viewBox="0 0 2000 300">
                    <ContentLoader
                        height={500}
                        width={200}
                        speed={10}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}>

                        <rect x="5" y="120" rx="3" ry="100" width="14%" height="14%"></rect>
                        <rect x="5" y="250" rx="5" ry="100" width="24%" height="33%"></rect>
                        <rect x="60" y="290" rx="3" ry="100" width="67%" height="15%"></rect>

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

                        <rect x="160" y="60" rx="5" ry="150" width="19%" height="65%"></rect>

                    </ContentLoader>
                </svg>

            </div>
        </React.Fragment>
    )
}
export default BGVConfigServiceLoader;