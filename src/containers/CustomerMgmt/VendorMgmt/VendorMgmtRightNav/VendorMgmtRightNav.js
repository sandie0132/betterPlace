import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Button } from 'react-crux';

import _ from 'lodash';
import cx from 'classnames';
import styles from './VendorMgmtRightNav.module.scss';
import scrollStyle from '../../../../components/Atom/ScrollBar/ScrollBar.module.scss';

import * as actions from '../VendorOnboarding/Store/action';

import NavUrl from '../../../../components/Molecule/NavUrl/NavUrl';
import RightNavBar from '../../../../components/Organism/Navigation/RightNavBar/RightNavBar';

class VendorMgmtRightNav extends Component {

    handleShowModal = () => {
      // eslint-disable-next-line react/destructuring-assignment
      this.props.initOnboardingDetails();
    }

    handleNavLink = (event) => {
      const { vendorData, vendorDataByTags } = this.props;
      if (_.isEmpty(vendorData)) event.preventDefault();
      if (_.isEmpty(vendorDataByTags)) event.preventDefault();
    }

    shortenDisplayName = (displayName) => {
      if (displayName.length > 30) {
        const updatedDisplayName = `${displayName.substring(0, 30)}...`;
        return (updatedDisplayName);
      }
      return (displayName);
    }

    render() {
      const { t } = this.props;
      const {
        match, vendorData, vendorDataByTags, getOrgName,
      } = this.props;

      const orgId = match.params.uuid;
      const { vendorId } = match.params;
      let checkState = null;
      let firstPage = false;

      if ((match.url === `/customer-mgmt/org/${orgId}/vendor-mgmt/vendor/${vendorId}/config/vendordetails`)) {
        checkState = 'vendorDetails';
      } else if ((match.url === `/customer-mgmt/org/${orgId}/vendor-mgmt/vendor/${vendorId}/config/function-role`)) {
        checkState = 'vendor-function-role';
      } else if ((match.url === `/customer-mgmt/org/${orgId}/vendor-mgmt/vendor/${vendorId}/config/location-sites`)) {
        checkState = 'vendor-location-sites';
      }

      if (match.path === '/customer-mgmt/org/:uuid/vendor-mgmt/vendor/add') {
        checkState = 'vendorDetails';
        firstPage = true;
      }

      let org = {}; let orgName = '';
      if (!_.isEmpty(vendorId)) {
        if (!_.isEmpty(vendorData)) {
          org = vendorData;
          orgName = vendorData.vendorLegalName;
        } else {
          org = vendorDataByTags;
          orgName = vendorDataByTags.vendorLegalName;
        }
      } else if (!_.isEmpty(getOrgName)) {
        org = getOrgName;
        orgName = getOrgName.legalName;
      }

      const RightNavContent = (
        <>
          {org
            ? (
              <div style={{ backgroundColor: org.brandColor !== null ? org.brandColor : '#8697A8', height: '12.5rem' }} className="d-flex flex-row no-gutters">
                <div className="col-12 align-self-end  pl-5 ">
                  {' '}
                  <span className={cx(styles.vendorRightNavLabel, 'pt-4 pb-3')}>
                    {orgName ? this.shortenDisplayName(orgName.toLowerCase()) : ''}
                    {' '}
                  </span>
                </div>
              </div>
            ) : null}
          <div>
            <h4 className={cx(styles.RightNavLabel, 'pt-4 mt-0 pb-3')}>{t('translation_vendorMgmtRightNav:Heading')}</h4>
          </div>
          <div className="ml-4">
            <div className="row ml-2 mt-3">
              {vendorId === undefined
                ? <NavLink to={`/customer-mgmt/org/${orgId}/vendor-mgmt/vendor/add`}><NavUrl firstPage={firstPage} isDisabled={checkState !== 'vendorDetails'} label={t('translation_vendorMgmtRightNav:label.l1')} /></NavLink>
                : <NavLink to={`/customer-mgmt/org/${orgId}/vendor-mgmt/vendor/${vendorId}/config/vendordetails`}><NavUrl firstPage={firstPage} isDisabled={checkState !== 'vendorDetails'} label={t('translation_vendorMgmtRightNav:label.l1')} /></NavLink>}
            </div>
            <div className="row ml-2 mt-3" disabled={vendorData.status === 'pendingapproval'}>
              <NavLink to={`/customer-mgmt/org/${orgId}/vendor-mgmt/vendor/${vendorId}/config/location-sites`}>
                <NavUrl firstPage={firstPage} isDisabled={checkState !== 'vendor-location-sites'} label={t('translation_vendorMgmtRightNav:label.l3')} />
              </NavLink>
            </div>
            <div className="row ml-2 mt-3" disabled={vendorData.status === 'pendingapproval'}>
              <NavLink to={`/customer-mgmt/org/${orgId}/vendor-mgmt/vendor/${vendorId}/config/function-role`}>
                <NavUrl firstPage={firstPage} isDisabled={checkState !== 'vendor-function-role'} label={t('translation_vendorMgmtRightNav:label.l2')} />
              </NavLink>
            </div>
          </div>
          <span className="ml-3 mt-4" disabled={_.isEmpty(vendorId)}>
            <NavLink to={`/customer-mgmt/org/${orgId}/vendor-mgmt/vendor/${vendorId}/vendorprofile?filter=overall_insights`}>
              <Button isDisabled={_.isEmpty(vendorId)} label={t('translation_vendorMgmtRightNav:button_vendorMgmtRightNav.vendor')} type="largeWithArrow" className="mt-4" clickHandler={this.handleShowModal} />
            </NavLink>
          </span>
        </>
      );

      return (
        <RightNavBar
          content={RightNavContent}
          className={cx(styles.show, scrollStyle.scrollbar)}
        />
      );
    }
}

const mapStateToProps = (state) => ({
  getOrgName: state.vendorMgmt.vendorDetails.getOrgName,
  vendorData: state.vendorMgmt.vendorDetails.getVendorData,
  vendorDataByTags: state.vendorMgmt.vendorTags.getVendorData,
});

const mapDispatchToProps = (dispatch) => ({
  // handleShowModal: (value) => dispatch(actions.handleShowModal(value)),
  initOnboardingDetails: () => dispatch(actions.initState()),
});

export default withTranslation()(withRouter(
  connect(mapStateToProps, mapDispatchToProps)(VendorMgmtRightNav),
));
