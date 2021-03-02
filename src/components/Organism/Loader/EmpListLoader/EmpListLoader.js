import React from 'react';
import ContentLoader from 'react-content-loader';
import styles from './EmpListLoader.module.scss';
import cx from 'classnames';
import themes from '../../../../theme.scss';

const EmpListLoader = props => {
    const primaryColor = themes.loaderPrimary;
    const secondaryColor = themes.loaderSecondary;

    const loaders = [];
    for (let i = 0; i < 18; i++) {
        loaders.push(
            <div key={i} className='col-4'>
                <div className={cx(styles.AlignLoader, "pt-1 d-flex flex-row flex-wrap justify-content-between")}>
                    <svg width="100%">
                        <ContentLoader
                            height={200}
                            width={200}
                            speed={1}
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}>

                            <rect x="8" y="10" rx="100%" ry="100%" width="24%" height="45%"></rect>
                            <rect x="65" y="17" rx="6" ry="100" width="45%" height="11%"></rect>
                            <rect x="65" y="47" rx="6" ry="100" width="40%" height="10%"></rect>
                            <rect x="65" y="75" rx="6" ry="100" width="52%" height="10%"></rect>

                        </ContentLoader>
                    </svg>
                </div>
            </div>
        )
    }

    return (
        <React.Fragment>
            <div className="container fluid-row pl-0 pr-0">
                {props.data.empList ?
                    <div className='row no-gutters w-100'>
                        <svg width="100%" height="100%" viewBox="0 0 2000 270">
                            <ContentLoader
                                height={500}
                                width={200}
                                speed={1}
                                primaryColor={primaryColor}
                                secondaryColor={secondaryColor}
                            >
                                <rect x="0" y="10" rx="4" ry="100" width="96%" height="28%" />
                                <rect x="0" y="200" rx="4" ry="100" width="96%" height="28%" />

                            </ContentLoader>
                        </svg>
                    </div> : null}

                <div className='row no-gutters' style={{ marginLeft: '0.15rem', marginTop: '0.1rem' }}>
                    {loaders}
                </div>
            </div>
        </React.Fragment>
    )
}
export default EmpListLoader;