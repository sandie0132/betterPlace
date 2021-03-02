import React from 'react';
import ContentLoader from 'react-content-loader';
import cx from 'classnames';
import styles from './ChartLoader.module.scss';
import themes from '../../../../theme.scss';

const ChartLoader = props => {
    const primaryColor = themes.loaderPrimary;
    const secondaryColor = themes.loaderSecondary;

    return (
        <React.Fragment>
            <div className={"row mx-0 px-0"}>
                <div className={cx(styles.Cards)}>
                    <svg viewBox="0 0 1000 250">
                        <ContentLoader
                            height={500}
                            width={200}
                            speed={2}
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}>

                            {/* <rect x="12" y="50" rx="4" ry="0" width="43%" height="8%"></rect> */}

                            <rect x="12" y="0" rx="0" ry="0" width="3.2%" height="90%"></rect>
                            <rect x="20" y="0" rx="0" ry="0" width="3.2%" height="90%"></rect>

                            <rect x="36" y="0" rx="0" ry="0" width="3.2%" height="90%"></rect>
                            <rect x="44" y="0" rx="0" ry="0" width="3.2%" height="90%"></rect>

                            <rect x="59" y="0" rx="0" ry="0" width="3.2%" height="90%"></rect>
                            <rect x="67" y="0" rx="0" ry="0" width="3.2%" height="90%"></rect>

                            <rect x="82" y="0" rx="0" ry="0" width="3.2%" height="90%"></rect>
                            <rect x="90" y="0" rx="0" ry="0" width="3.2%" height="90%"></rect>

                            <rect x="106" y="0" rx="0" ry="0" width="3.2%" height="90%"></rect>
                            <rect x="114" y="0" rx="0" ry="0" width="3.2%" height="90%"></rect>

                            <rect x="129" y="0" rx="0" ry="0" width="3.2%" height="90%"></rect>
                            <rect x="137" y="0" rx="0" ry="0" width="3.2%" height="90%"></rect>

                            <rect x="153" y="0" rx="0" ry="0" width="3.2%" height="90%"></rect>
                            <rect x="161" y="0" rx="0" ry="0" width="3.2%" height="90%"></rect>

                            <rect x="177" y="0" rx="0" ry="0" width="3.2%" height="90%"></rect>
                            <rect x="185" y="0" rx="0" ry="0" width="3.2%" height="90%"></rect>

                        </ContentLoader>
                    </svg>
                </div>
            </div>


        </React.Fragment >
    )
}

export default ChartLoader;