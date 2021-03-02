import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import NavUrl from '../../../../../components/Molecule/NavUrl/NavUrl';
import cx from 'classnames';
import styles from './OrgClientRightNav.module.scss';
import { Button } from 'react-crux';
import RightNavBar from '../../../../../components/Organism/Navigation/RightNavBar/RightNavBar';
import { withTranslation } from 'react-i18next'
class OrgClientRightNav extends Component {
    render() {
        const {t} = this.props ;
        const {match} = this.props;
        const orgId = match.params.uuid;
        const clientId = match.params.clientId;
        let checkState = null;

        // let firstPage = false;

        if ((this.props.match.url === '/customer-mgmt/org/'+orgId+'/clients/'+clientId)) { checkState = 'orgClientDetails' }
        else if ((this.props.match.url === '/customer-mgmt/org/'+orgId+'/clients/'+clientId +'/function-role')) { checkState = 'orgClient-function-role' }
        else if ((this.props.match.url === '/customer-mgmt/org/'+orgId+'/clients/'+clientId +'/location-sites')) { checkState = 'orgClient-location-sites' }


       // if (this.props.match.url === '/customer-mgmt/vendors/add') { firstPage = true; }

        let RightNavContent =
            <div>
                <div>
                    <h4 className={cx(styles.RightNavLabel, 'pt-4 mt-0 pb-3')}>{t('translation_orgClientRightNav:cardheading')}</h4>
                </div>
                <div className={"ml-4"}>
                    <div className="row ml-2 mt-3">
                        {clientId === undefined ? 
                            <NavLink to={'/customer-mgmt/org/'+orgId+'/clients/add'}><NavUrl isDisabled={(checkState === 'orgClientDetails') ? false : true} label={t('translation_orgClientRightNav:link.clientDetails')} /></NavLink>
                            :
                            <NavLink to={'/customer-mgmt/org/'+orgId+'/clients/'+clientId}><NavUrl isDisabled={(checkState === 'orgClientDetails') ? false : true} label={t('translation_orgClientRightNav:link.clientDetails')} /></NavLink>
                        }
                    </div>
                    <div className="row ml-2 mt-3">
                        <NavLink to={'/customer-mgmt/org/'+orgId+'/clients/'+clientId+'/function-role'}><NavUrl isDisabled={(checkState === 'orgClient-function-role') ? false : true} label={t('translation_orgClientRightNav:link.functionRole')} /></NavLink>
                    </div>
                    <div className="row ml-2 mt-3">
                        <NavLink to={'/customer-mgmt/org/'+orgId+'/clients/'+clientId+'/location-sites'}><NavUrl isDisabled={(checkState === 'orgClient-location-sites') ? false : true} label={t('translation_orgClientRightNav:link.locationSites')} /></NavLink>
                    </div>
                </div>
                <span className='ml-3 mt-4'>
                    {/* {orgId ? */}
                    <NavLink to={'/customer-mgmt/org/'+orgId+'/clients'}>
                        <Button label={t('translation_orgClientRightNav:button_orgClientRightNav.goTo')} type='largeWithArrow' className="mt-4" ></Button>
                    </NavLink>

                    
                    {/* : ''} */}
                </span>

                
            </div >

        return (
            <RightNavBar content={RightNavContent} />
        )
    }
}

export default withTranslation() (withRouter(OrgClientRightNav));