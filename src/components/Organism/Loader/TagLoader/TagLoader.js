import React from 'react';
import ContentLoader from 'react-content-loader';
import themes from '../../../../theme.scss';

const TagLoader = props => {
    const primaryColor = themes.loaderPrimary;
    const secondaryColor = themes.loaderSecondary;

    return (
        <React.Fragment>
            <div>
                <svg width="100%" height="100%">
                    <ContentLoader
                        height={500}
                        width={200}
                        speed={1}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                    >
                        <rect x="0" y="55" rx="100%" ry="100%" width="4%" height="25%" />
                        <rect x="12" y="90" rx="2" ry="100" width="30%" height="10%"/>

                        <rect x="0" y="240" rx="4" ry="100" width="50%" height="28%"/>

                    </ContentLoader>
                </svg>
            </div>

            <div>
                <svg width="100%" height="100%">
                    <ContentLoader
                        height={500}
                        width={200}
                        speed={1}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                    >
                        <rect x="0" y="0" rx="4" ry="100" width="22%" height="27%"/>
                        <rect x="50" y="0" rx="4" ry="100" width="22%" height="27%"/>
                        <rect x="100" y="0" rx="4" ry="100" width="22%" height="27%"/>
                        <rect x="150" y="0" rx="4" ry="100" width="22%" height="27%"/>

                        <rect x="0" y="180" rx="4" ry="100" width="22%" height="27%"/>
                        <rect x="50" y="180" rx="4" ry="100" width="22%" height="27%"/>
                        <rect x="100" y="180" rx="4" ry="100" width="22%" height="27%"/>
                        <rect x="150" y="180" rx="4" ry="100" width="22%" height="27%"/>

                        <rect x="0" y="360" rx="4" ry="100" width="22%" height="27%"/>
                        <rect x="50" y="360" rx="4" ry="100" width="22%" height="27%"/>
                        <rect x="100" y="360" rx="4" ry="100" width="22%" height="27%"/>
                        <rect x="150" y="360" rx="4" ry="100" width="22%" height="27%"/>

                    </ContentLoader>
                </svg>
            </div>

            <div className="mt-3">
                <svg width="100%" height="100%">
                    <ContentLoader
                        height={500}
                        width={200}
                        speed={1}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                    >
                        <rect x="0" y="0" rx="4" ry="100" width="22%" height="27%"/>
                        <rect x="50" y="0" rx="4" ry="100" width="22%" height="27%"/>
                        <rect x="100" y="0" rx="4" ry="100" width="22%" height="27%"/>
                        <rect x="150" y="0" rx="4" ry="100" width="22%" height="27%"/>

                        <rect x="0" y="180" rx="4" ry="100" width="22%" height="27%"/>
                        <rect x="50" y="180" rx="4" ry="100" width="22%" height="27%"/>
                        <rect x="100" y="180" rx="4" ry="100" width="22%" height="27%"/>
                        <rect x="150" y="180" rx="4" ry="100" width="22%" height="27%"/>

                        <rect x="0" y="360" rx="4" ry="100" width="22%" height="27%"/>
                        <rect x="50" y="360" rx="4" ry="100" width="22%" height="27%"/>
                        <rect x="100" y="360" rx="4" ry="100" width="22%" height="27%"/>
                        <rect x="150" y="360" rx="4" ry="100" width="22%" height="27%"/>

                    </ContentLoader>
                </svg>
            </div>

            <div className="mt-3">
                <svg width="100%" height="100%">
                    <ContentLoader
                        height={500}
                        width={200}
                        speed={1}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                    >
                        <rect x="0" y="0" rx="4" ry="100" width="22%" height="27%"/>
                        <rect x="50" y="0" rx="4" ry="100" width="22%" height="27%"/>
                        <rect x="100" y="0" rx="4" ry="100" width="22%" height="27%"/>
                        <rect x="150" y="0" rx="4" ry="100" width="22%" height="27%"/>

                        <rect x="0" y="180" rx="4" ry="100" width="22%" height="27%"/>
                        <rect x="50" y="180" rx="4" ry="100" width="22%" height="27%"/>
                        <rect x="100" y="180" rx="4" ry="100" width="22%" height="27%"/>
                        <rect x="150" y="180" rx="4" ry="100" width="22%" height="27%"/>

                        <rect x="0" y="360" rx="4" ry="100" width="22%" height="27%"/>
                        <rect x="50" y="360" rx="4" ry="100" width="22%" height="27%"/>
                        <rect x="100" y="360" rx="4" ry="100" width="22%" height="27%"/>
                        <rect x="150" y="360" rx="4" ry="100" width="22%" height="27%"/>

                    </ContentLoader>
                </svg>
            </div>
            
        </React.Fragment>
    )
}

export default TagLoader;