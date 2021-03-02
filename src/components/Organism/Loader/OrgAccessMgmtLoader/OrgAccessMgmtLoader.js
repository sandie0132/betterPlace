import React from 'react';
import ContentLoader from 'react-content-loader';
import cx from 'classnames';
import themes from '../../../../theme.scss';
import styles from './OrgAccessMgmtLoader.module.scss';

const OrgAccessMgmtLoader = props => {
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

            <div className={cx("p-4 pb-2", styles.FormBackgroundColor)}>

                <svg viewBox="0 0 2000 200">
                    <ContentLoader
                        height={500}
                        width={200}
                        speed={10}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}>

                        <rect x="0" y="150" rx="5" ry="100" width="100%" height="38%" />

                    </ContentLoader>
                </svg>

                <svg viewBox="0 0 2000 200">
                    <ContentLoader
                        height={500}
                        width={200}
                        speed={10}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}>

                        <rect x="5" y="177" rx="5" ry="100" width="23%" height="45%"></rect>
                        <rect x="58" y="180" rx="5" ry="100" width="63%" height="40%"></rect>

                    </ContentLoader>
                </svg>

                <svg viewBox="0 0 2000 250">
                    <ContentLoader
                        height={500}
                        width={200}
                        speed={10}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}>

                        <rect x="5" y="17" rx="5" ry="100" width="23%" height="40%"></rect>
                        <rect x="58" y="18" rx="5" ry="100" width="63%" height="31%"></rect>
                        <rect x="5" y="270" rx="5" ry="100" width="23%" height="40%"></rect>
                        <rect x="58" y="270" rx="5" ry="100" width="63%" height="31%"></rect>

                    </ContentLoader>
                </svg>

                <svg viewBox="0 0 2000 250">
                    <ContentLoader
                        height={500}
                        width={200}
                        speed={10}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}>

                        <rect x="5" y="35" rx="5" ry="100" width="23%" height="40%"></rect>
                        <rect x="58" y="40" rx="3" ry="100" width="63%" height="20%"></rect>

                        <rect x="5" y="300" rx="5" ry="100" width="23%" height="40%"></rect>
                        <rect x="58" y="200" rx="3" ry="100" width="63%" height="20%"></rect>

                        <rect x="58" y="360" rx="3" ry="100" width="63%" height="20%"></rect>

                    </ContentLoader>
                </svg>

                <svg viewBox="0 0 2000 250">
                    <ContentLoader
                        height={500}
                        width={200}
                        speed={10}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}>

                        <rect x="5" y="60" rx="5" ry="100" width="23%" height="40%"></rect>
                        <rect x="58" y="60" rx="3" ry="100" width="63%" height="20%"></rect>
                        <rect x="5" y="310" rx="5" ry="100" width="23%" height="38%"></rect>
                        <rect x="58" y="230" rx="3" ry="100" width="63%" height="20%"></rect>

                    </ContentLoader>
                </svg>

                <svg viewBox="0 0 2000 250">
                    <ContentLoader
                        height={500}
                        width={200}
                        speed={10}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}>

                        <rect x="5" y="60" rx="5" ry="100" width="23%" height="40%"></rect>
                        <rect x="5" y="310" rx="5" ry="100" width="23%" height="38%"></rect>

                        <rect x="58" y="60" rx="3" ry="100" width="63%" height="20%"></rect>
                        <rect x="58" y="230" rx="3" ry="100" width="63%" height="20%"></rect>
                        <rect x="58" y="400" rx="3" ry="100" width="63%" height="20%"></rect>


                    </ContentLoader>
                </svg>

            </div>
        </React.Fragment>
    )
}
export default OrgAccessMgmtLoader;