import React from 'react';
import ContentLoader from 'react-content-loader';
// import cx from 'classnames';
// import styles from './TaskListLoader/TaskListLoader.module.scss';
import themes from '../../../theme.scss';

const TaskFilterLoader = props => {
    const primaryColor = themes.loaderPrimary;
    const secondaryColor = themes.loaderSecondary;

    return (
        <React.Fragment>
            <div>
                <svg width="100%" height="130">
                    <ContentLoader
                        // height={"100%"}
                        // width={"100%"}
                        speed={1}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}>
                        <rect x="0" y="0" rx="8" width="100%" height="97%"></rect>

                    </ContentLoader>
                </svg>
            </div>
        </React.Fragment>
    )
}

export default TaskFilterLoader;