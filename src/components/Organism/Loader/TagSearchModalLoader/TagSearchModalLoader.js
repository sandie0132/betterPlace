import React from 'react';
import ContentLoader from 'react-content-loader';
import themes from '../../../../theme.scss';

const TagSearchModalLoader = props => {
    const primaryColor = themes.loaderPrimary;
    const secondaryColor = themes.loaderSecondary;

    return (
        <React.Fragment>
            <div className="py-2">
                <svg width="100%" height="100%" viewBox="0 0 2500 500">
                    {props.data.assign ?
                        <ContentLoader
                            height={500}
                            width={200}
                            speed={1}
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}>

                            <rect x="6" y="30" rx="3" ry="100" width="16%" height="10%"></rect>

                            <rect x="6" y="115" rx="3" ry="100" width="16%" height="10%"></rect>
                            <rect x="43" y="115" rx="3" ry="100" width="16%" height="10%"></rect>
                            <rect x="80" y="115" rx="3" ry="100" width="16%" height="10%"></rect>
                            <rect x="117" y="115" rx="3" ry="100" width="16%" height="10%"></rect>

                            <rect x="6" y="200" rx="3" ry="100" width="16%" height="10%"></rect>
                            <rect x="43" y="200" rx="3" ry="100" width="16%" height="10%"></rect>
                            <rect x="80" y="200" rx="3" ry="100" width="16%" height="10%"></rect>
                            <rect x="117" y="200" rx="3" ry="100" width="16%" height="10%"></rect>

                            {/*another row
                             <rect x="6" y="270" rx="3" ry="100" width="16%" height="10%"></rect>
                            <rect x="43" y="270" rx="3" ry="100" width="16%" height="10%"></rect>
                            <rect x="80" y="270" rx="3" ry="100" width="16%" height="10%"></rect>
                            <rect x="117" y="270" rx="3" ry="100" width="16%" height="10%"></rect> */}

                        </ContentLoader>
                        :
                        <ContentLoader
                            height={500}
                            width={200}
                            speed={1}
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}>

                            <rect x="0" y="15" rx="5" ry="100" width="45%" height="21%" />

                            <rect x="0" y="165" rx="5" ry="100" width="30%" height="21%" />
                            <rect x="68" y="165" rx="5" ry="100" width="30%" height="21%" />
                            <rect x="136" y="165" rx="5" ry="100" width="30%" height="21%" />

                            <rect x="0" y="300" rx="5" ry="100" width="30%" height="21%" />
                            <rect x="68" y="300" rx="5" ry="100" width="30%" height="21%" />
                            <rect x="136" y="300" rx="5" ry="100" width="30%" height="21%" />

                        </ContentLoader>
                    }
                </svg>
            </div>
        </React.Fragment >
    )
}

export default TagSearchModalLoader;