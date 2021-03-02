import React from 'react';
import ContentLoader from 'react-content-loader';
import themes from '../../../../theme.scss';
import styles from './EmpProfileLoader.module.scss';
import cx from 'classnames';

const EmpProfileLoader = props => {
    const primaryColor = themes.loaderPrimary;
    const secondaryColor = themes.loaderSecondary;

    return (
        <React.Fragment>
            <div className={cx('mb-4 py-2', styles.MainDiv)}>
                <svg width="100%" height="100%">
                    <ContentLoader
                        height={500}
                        width={200}
                        speed={1}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                    >
                        <rect x="11" y="100" rx="100%" ry="100%" width="12.5%" height="74%"></rect>

                        <rect x="43" y="120" rx="2" ry="100" width="35%" height="13%" />
                        <rect x="43" y="220" rx="2" ry="100" width="35%" height="13%" />
                        <rect x="43" y="320" rx="2" ry="100" width="35%" height="13%" />
                        <rect x="43" y="420" rx="2" ry="100" width="35%" height="13%" />

                    </ContentLoader>
                </svg>
            </div>

            {props.data.UpperCard ? null
                :
                <div className={cx(styles.SecondDiv, "mb-4")}>
                    <svg width="100%" height="100%">
                        <ContentLoader
                            height={500}
                            width={200}
                            speed={1}
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}
                        >
                            <rect x="10" y="100" rx="3" ry="100" width="15%" height="15%" />
                            <rect x="10" y="270" rx="3" ry="100" width="70%" height="15%" />
                            <rect x="10" y="400" rx="3" ry="100" width="50%" height="15%" />

                        </ContentLoader>
                    </svg>
                    <svg width="100%" height="100%">
                        <ContentLoader
                            height={500}
                            width={200}
                            speed={1}
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}
                        >
                            <rect x="10" y="100" rx="4" ry="100" width="20%" height="30%" />
                            <rect x="70" y="100" rx="4" ry="100" width="20%" height="30%" />
                            <rect x="130" y="100" rx="4" ry="100" width="20%" height="30%" />

                            <rect x="10" y="350" rx="4" ry="100" width="20%" height="30%" />
                            <rect x="70" y="350" rx="4" ry="100" width="20%" height="30%" />

                        </ContentLoader>
                    </svg>
                    <svg width="100%" height="100%">
                        <ContentLoader
                            height={500}
                            width={200}
                            speed={1}
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}
                        >
                            <rect x="10" y="100" rx="3" ry="100" width="15%" height="16%" />
                            <rect x="10" y="270" rx="3" ry="100" width="70%" height="16%" />
                            <rect x="10" y="400" rx="3" ry="100" width="50%" height="16%" />

                        </ContentLoader>
                    </svg>
                    <svg width="100%" height="100%">
                        <ContentLoader
                            height={500}
                            width={200}
                            speed={1}
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}
                        >
                            <rect x="10" y="100" rx="3" ry="100" width="15%" height="16%" />
                            <rect x="10" y="270" rx="3" ry="100" width="70%" height="16%" />

                        </ContentLoader>
                    </svg>
                </div>
            }
        </React.Fragment>
    )
}

export default EmpProfileLoader;