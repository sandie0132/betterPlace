import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import LeftBackground from '../../../assets/icons/LeftBackground.svg';
import cx from 'classnames';
import styles from './EmptyPage.module.scss';
import OrgOnboarding from '../../../containers/CustomerMgmt/OrgMgmt/OrgOnboarding/OrgOnboarding';

class EmptyPage extends Component {
    render() {
        const { t } = this.props;
        return (
                <div className='row mt-5'>
                    <div className={this.props.empList ? 'ml-5 pr-0' : 'col-3 ml-5'}>
                        <img src={LeftBackground} alt={t('translation_emptyPage.background')} />
                    </div>

                    <div className={this.props.empList ? 'mt-5 ml-4' : 'col-6 mt-2'}>
                        <label className={styles.Text}>{this.props.text}</label>

                       <span className={cx('row mt-5 no-gutters')}>
                            {this.props.buttonLink ?
                                <NavLink to={this.props.buttonLink} className={cx('px-2 py-2', styles.Button)}>
                                    <span>
                                        <img className={'ml-1 mr-2'} src={this.props.buttonIcon} alt="" />
                                        &nbsp; {this.props.buttonText}
                                    </span>
                                </NavLink>
                                :
                                this.props.orgList ?
                                    <OrgOnboarding
                                        buttonLabel='add client'
                                        showModal={this.props.showModal}
                                        idNo={this.props.idNo}
                                        idState={this.props.idState}
                                        idImage={this.props.idImage}
                                    />
                                    :
                                    ''}
                        </span>
                    </div>
                </div>
        )
    }
}

export default withTranslation()(EmptyPage);