import React from 'react';
import ContentLoader from 'react-content-loader';
import cx from 'classnames';
import themes from '../../../../theme.scss';

const StatusMgmtTopNav = props => {
    const primaryColor = themes.loaderPrimary;
    const secondaryColor = themes.loaderSecondary;

    return (
        <React.Fragment>
            <div className={cx('flex row px-0')}>

                <svg viewBox="0 0 2000 100" className="col-12 px-0">
                    <ContentLoader
                        height={600}
                        width={200}
                        speed={10}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}>

                        <rect x="44" y="10" rx="3" ry="100%" width="41%" height="50%"></rect>

                    </ContentLoader>
                </svg>

            </div>
        </React.Fragment>
    )
}
export default StatusMgmtTopNav;