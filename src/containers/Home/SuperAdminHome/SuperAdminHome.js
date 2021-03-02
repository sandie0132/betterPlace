import React from 'react';
import cx from 'classnames';

import { NavLink } from 'react-router-dom';
import { Button } from 'react-crux';
import styles from './SuperAdminHome.module.scss';

import { AuthConsumer } from '../../../services/authContext';
import { withTranslation } from 'react-i18next'
const SuperAdminHome = (props) => {
    const {t} =  props;
    return (
        <AuthConsumer>
            {( {user}) => (
                <div className={cx('col-12 text-center', styles.WelcomeMessageMargin)}>
                    <div className={cx('offset-3 col-6')}>
                    <h4>{t('translation_superAdminHome:heading_superAdminHome.h1')} {user.firstName} {user.lastName}!</h4>
                        <p className={styles.WelcomeMessage}>{t('translation_superAdminHome:heading_superAdminHome.h2')}</p>
                        <p>{t('translation_superAdminHome:heading_superAdminHome.h3')}
                            </p>
                        <p>{t('translation_superAdminHome:heading_superAdminHome.h4')}</p>
                    </div>
                    <div className="col-3 mx-auto">
                        <NavLink to='/customer-mgmt/org?filter=starred'>
                            <Button isDisabled={false} label={t('translation_superAdminHome:button_superAdminHome.goTo')} className={cx('col-4', styles.AddButton)} mode='save'/>
                        </NavLink>
                    </div>
                </div>
            )
            }
        </AuthConsumer>
    );
}

export default withTranslation() (SuperAdminHome);