import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from "react-router";
import { Button } from 'react-crux';
import NavUrl from '../../../../components/Molecule/NavUrl/NavUrl';
import styles from './OrgMgmtRightNav.module.scss';
import _ from 'lodash';
import cx from 'classnames';
import RightNavBar from '../../../../components/Organism/Navigation/RightNavBar/RightNavBar';
import rightNavImage from '../../../../assets/icons/rightNavImage.svg';
import { withTranslation } from 'react-i18next';
import HasAccess from '../../../../services/HasAccess/HasAccess';
import scrollStyle from '../../../../components/Atom/ScrollBar/ScrollBar.module.scss';

class RightNavContent extends Component {
    render() {
        const { t } = this.props;
        const { match } = this.props;
        const orgId = match.params.uuid;
        let checkState = null;
        let firstPage = false;
        let orgName = '';
        if (!_.isEmpty(this.props.orgData)) {
            orgName = this.props.orgData.name.toLowerCase();
        }

        if ((this.props.location.pathname === '/customer-mgmt/org/add') || (this.props.location.pathname === '/customer-mgmt/org/' + orgId)) { checkState = 'orgDetails' }
        else if ((this.props.location.pathname === '/customer-mgmt/org/' + orgId + '/contact')) { checkState = 'contactPerson' }
        else if ((this.props.location.pathname === '/customer-mgmt/org/' + orgId + '/address')) { checkState = 'address' }
        else if (this.props.location.pathname === '/customer-mgmt/org/' + orgId + '/function-role') { checkState = 'function-role' }
        else if (this.props.location.pathname === '/customer-mgmt/org/' + orgId + '/location-sites') { checkState = 'location-sites' }
        else if (this.props.location.pathname === '/customer-mgmt/org/' + orgId + '/access-management') { checkState = 'access-management' }
        else if (this.props.location.pathname === '/customer-mgmt/org/' + orgId + '/custom-tags') { checkState = 'custom' }
        else if (this.props.location.pathname === '/customer-mgmt/org/' + orgId + '/documents') { checkState = 'documents' }
        else if (this.props.location.pathname === '/customer-mgmt/org/' + orgId + '/vendors') { checkState = 'vendors' }
        else if (this.props.location.pathname === '/customer-mgmt/org/' + orgId + '/clients') { checkState = 'clients' }

        if (this.props.location.pathname === '/customer-mgmt/org/add') { firstPage = true; }

        let RightNavContent =
            <React.Fragment>
                {firstPage ?
                    <div>
                        <img src={rightNavImage} alt='rightNavImage' />
                        <span className={cx(styles.RightNavLabel)}>
                            {t('translation_orgMgmtRightNav:Cardheading').toLowerCase()}
                        </span>
                    </div> :
                    <React.Fragment>
                        {
                            this.props.orgData ?
                                <div style={{ backgroundColor: this.props.orgData.brandColor !== null ? this.props.orgData.brandColor : '#8697A8', height: '12rem' }} className={cx('d-flex flex-row no-gutters',styles.textContain)}>
                                    <div className={cx('col-12 align-self-end pl-5',styles.labelScroll)}> <span className={cx(styles.OrgRightNavLabel, 'pb-3')}>{orgName} </span></div>
                                </div> : null
                        }
                    </React.Fragment>
                }
                <br />

                <div className={"ml-4 mt-4"}>
                    <HasAccess
                        permission={["ORG_PROFILE:VIEW"]}
                        orgId={orgId}
                        yes={() => <div className="pl-2  mt-2">
                            <NavLink to={(firstPage) ? "/customer-mgmt/org/add" : "/customer-mgmt/org/" + orgId}><NavUrl firstPage={firstPage} isDisabled={(checkState === 'orgDetails') ? false : true} label={t('translation_orgMgmtRightNav:link.orgDetails')} /></NavLink>
                        </div>}
                    />
                    <HasAccess
                        permission={["ORG_CONTACT:VIEW"]}
                        orgId={orgId}
                        yes={() => <div className="pl-2  mt-2">
                            <NavLink to={"/customer-mgmt/org/" + orgId + "/contact"}><NavUrl firstPage={firstPage} isDisabled={(checkState === 'contactPerson') ? false : true} label={t('translation_orgMgmtRightNav:link.contactPerson')} /></NavLink>
                        </div>}
                    />
                    <HasAccess
                        permission={["ORG_ADDRESS:VIEW"]}
                        orgId={orgId}
                        yes={() => <div className="pl-2  mt-2">
                            <NavLink to={"/customer-mgmt/org/" + orgId + "/address"}><NavUrl firstPage={firstPage} isDisabled={(checkState === 'address') ? false : true} label={t('translation_orgMgmtRightNav:link.additionalAddress')} /></NavLink>
                        </div>}
                    />

                    <HasAccess
                        permission= {["ORG_DOCUMENTS:VIEW"]}
                        orgId={orgId}
                        yes={() => <div className="pl-2  mt-2">
                            <NavLink to={"/customer-mgmt/org/" + orgId + "/documents"}><NavUrl firstPage={firstPage} isDisabled={(checkState === 'documents') ? false : true} label={t('translation_orgMgmtRightNav:link.documents')} /></NavLink>
                        </div>}
                    />

                    <HasAccess
                        permission={["ORG_LOC_SITE:VIEW"]}
                        orgId={orgId}
                        yes={() => <div className="pl-2  mt-2">
                            <NavLink to={"/customer-mgmt/org/" + orgId + "/location-sites"}><NavUrl firstPage={firstPage} isDisabled={(checkState === 'location-sites') ? false : true} label={t('translation_orgMgmtRightNav:link.locationSites')} /></NavLink>
                        </div>}
                    />
                    <HasAccess
                        permission={["ORG_FUNC_ROLE:VIEW"]}
                        orgId={orgId}
                        yes={() => <div className="pl-2  mt-2">
                            <NavLink to={"/customer-mgmt/org/" + orgId + "/function-role"}><NavUrl firstPage={firstPage} isDisabled={(checkState === 'function-role') ? false : true} label={t('translation_orgMgmtRightNav:link.functionRole')} /></NavLink>
                        </div>}
                    />

                    <HasAccess
                        permission={["ORG_CUST_TAG:VIEW"]}
                        orgId={orgId}
                        yes={() => <div className="pl-2  mt-2">
                            <NavLink to={"/customer-mgmt/org/" + orgId + "/custom-tags"}><NavUrl firstPage={firstPage} isDisabled={(checkState === 'custom') ? false : true} label={t('translation_orgMgmtRightNav:link.customTags')} /></NavLink>
                        </div>}
                    />
                    <HasAccess
                        permission={["ORG_ACCESS_MGMT:VIEW"]}
                        orgId={orgId}
                        yes={() => <div className="pl-2  mt-2">
                            <NavLink to={"/customer-mgmt/org/" + orgId + "/access-management"}><NavUrl firstPage={firstPage} isDisabled={(checkState === 'access-management') ? false : true} label={t('translation_orgMgmtRightNav:link.accessManagement')} /></NavLink>
                        </div>}
                    />

                    {/* <HasAccess
                        permission={["ORG_VENDOR_MGMT:VIEW"]}
                        orgId={orgId}
                        yes={() => <div className="pl-2  mt-2">
                            <NavLink to={"/customer-mgmt/org/" + orgId + "/vendors"}><NavUrl firstPage={firstPage} isDisabled={(checkState === 'vendors') ? false : true} label={t('translation_orgMgmtRightNav:link.vendors')} /></NavLink>
                        </div>}
                    /> */}
                    {/* <HasAccess
                        permission={["CLIENT:View"]}
                        orgId={orgId}
                        yes={() => <div className="pl-2  mt-2">
                            <NavLink to={"/customer-mgmt/org/" + orgId + "/clients"}><NavUrl firstPage={firstPage} isDisabled={(checkState === 'clients') ? false : true} label={t('translation_orgMgmtRightNav:link.clients')} /></NavLink>
                        </div>}
                    /> */}
                </div>
                <span className='ml-3'>
                    {orgId && orgId !== 'add' ?
                        <NavLink to={"/customer-mgmt/org/" + orgId + "/profile"}>
                            <Button label={t('translation_orgMgmtRightNav:button_orgRightNav.goTo')} type='largeWithArrow' className={cx("mt-4", styles.LargeButtonWidth)} ></Button>
                        </NavLink>
                        :
                        <Button label={t('translation_orgMgmtRightNav:button_orgRightNav.goTo')} type='largeWithArrow' isDisabled={true} className={cx("mt-4", styles.LargeButtonWidth)} ></Button>
                    }
                </span>
            </React.Fragment>

        return (

            <RightNavBar content={RightNavContent}
                className={cx(styles.show,scrollStyle.scrollbar)}
            />

        )
    }
}

const mapStateToProps = state => {
    return {
        orgData: state.orgMgmt.staticData.orgData,
    }
};

export default withTranslation()(withRouter(connect(mapStateToProps)(RightNavContent)));
