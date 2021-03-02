import React from 'react';
import ContentLoader from 'react-content-loader';
import cx from 'classnames';
import styles from './TaskListLoader.module.scss';
import themes from '../../../../theme.scss';

const TaskListLoader = props => {
    const primaryColor = themes.loaderPrimary;
    const secondaryColor = themes.loaderSecondary;

    return (
        <React.Fragment>
            <div className={cx("px-2 py-3 mb-4", styles.FormBackgroundColor)}>
                <svg viewBox="0 0 2100 500">
                    <ContentLoader
                        height={500}
                        width={200}
                        speed={10}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}>

                        <rect x="7" y="0" rx="2" ry="100" width="22%" height="8%" />
                        <rect x="65" y="0" rx="2" ry="100" width="13%" height="8%" />
                        <rect x="100" y="0" rx="2" ry="100" width="13%" height="8%" />
                        <rect x="134" y="0" rx="2" ry="50%" width="12%" height="8%" />
                        <rect x="165" y="0" rx="2" ry="100" width="10%" height="8%" />

                        <rect x="7" y="120" rx="100" ry="50%" width="4%" height="16%" />
                        <rect x="19" y="145" rx="2" ry="100" width="16%" height="8%" />
                        <rect x="65" y="145" rx="2" ry="100" width="13%" height="8%" />
                        <rect x="100" y="145" rx="2" ry="100" width="13%" height="8%" />
                        <rect x="134" y="145" rx="2" ry="50%" width="12%" height="8%" />
                        <rect x="165" y="145" rx="2" ry="100" width="10%" height="8%" />

                        <rect x="7" y="275" rx="100" ry="50%" width="4%" height="16%" />
                        <rect x="19" y="295" rx="2" ry="100" width="16%" height="8%" />
                        <rect x="65" y="295" rx="2" ry="100" width="13%" height="8%" />
                        <rect x="100" y="295" rx="2" ry="100" width="13%" height="8%" />
                        <rect x="134" y="295" rx="2" ry="50%" width="12%" height="8%" />
                        <rect x="165" y="295" rx="2" ry="100" width="10%" height="8%" />

                        <rect x="7" y="420" rx="100" ry="50%" width="4%" height="16%" />
                        <rect x="19" y="440" rx="2" ry="100" width="16%" height="8%" />
                        <rect x="65" y="440" rx="2" ry="100" width="13%" height="8%" />
                        <rect x="100" y="440" rx="2" ry="100" width="13%" height="8%" />
                        <rect x="134" y="440" rx="2" ry="50%" width="12%" height="8%" />
                        <rect x="165" y="440" rx="2" ry="100" width="10%" height="8%" />

                    </ContentLoader>
                </svg>

                <svg viewBox="0 0 2100 500">
                    <ContentLoader
                        height={500}
                        width={200}
                        speed={10}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}>

                        <rect x="7" y="70" rx="100" ry="50%" width="4%" height="16%" />
                        <rect x="19" y="90" rx="2" ry="100" width="16%" height="8%" />
                        <rect x="65" y="90" rx="2" ry="100" width="13%" height="8%" />
                        <rect x="100" y="90" rx="2" ry="100" width="13%" height="8%" />
                        <rect x="134" y="90" rx="2" ry="50%" width="12%" height="8%" />
                        <rect x="165" y="90" rx="2" ry="100" width="10%" height="8%" />

                        <rect x="7" y="220" rx="100" ry="50%" width="4%" height="16%" />
                        <rect x="19" y="240" rx="2" ry="100" width="16%" height="8%" />
                        <rect x="65" y="240" rx="2" ry="100" width="13%" height="8%" />
                        <rect x="100" y="240" rx="2" ry="100" width="13%" height="8%" />
                        <rect x="134" y="240" rx="2" ry="50%" width="12%" height="8%" />
                        <rect x="165" y="240" rx="2" ry="100" width="10%" height="8%" />

                        <rect x="7" y="380" rx="100" ry="50%" width="4%" height="16%" />
                        <rect x="19" y="400" rx="2" ry="100" width="16%" height="8%" />
                        <rect x="65" y="400" rx="2" ry="100" width="13%" height="8%" />
                        <rect x="100" y="400" rx="2" ry="100" width="13%" height="8%" />
                        <rect x="134" y="400" rx="2" ry="50%" width="12%" height="8%" />
                        <rect x="165" y="400" rx="2" ry="100" width="10%" height="8%" />

                    </ContentLoader>
                </svg>
            </div>
        </React.Fragment>
    )
}

export default TaskListLoader;