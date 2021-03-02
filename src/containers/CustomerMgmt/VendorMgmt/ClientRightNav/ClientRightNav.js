import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Button } from 'react-crux';
import _ from 'lodash';
import cx from 'classnames';
import styles from './ClientRightNav.module.scss';
import scrollStyle from '../../../../components/Atom/ScrollBar/ScrollBar.module.scss';

import NavUrl from '../../../../components/Molecule/NavUrl/NavUrl';
import RightNavBar from '../../../../components/Organism/Navigation/RightNavBar/RightNavBar';

class ClientRightNav extends Component {
  handleNavLink = (event) => {
    const { clientData } = this.props;
    if (_.isEmpty(clientData)) event.preventDefault();
  }

  shortenDisplayName = (displayName) => {
    if (displayName.length > 30) {
      const updatedDisplayName = `${displayName.substring(0, 30)}...`;
      return (updatedDisplayName);
    }
    return (displayName);
  }

  render() {
    const {
      match, clientData, // t,
    } = this.props;
    const orgId = match.params.uuid;
    const { clientId } = match.params;

    let checkState = null;

    if ((match.url === `/customer-mgmt/org/${orgId}/vendor-mgmt/client/${clientId}/details/location-sites`)) { checkState = 'client-location-sites'; } else if ((match.url === `/customer-mgmt/org/${orgId}/vendor-mgmt/client/${clientId}/details/function-role`)) { checkState = 'client-function-role'; }

    const org = !_.isEmpty(clientData) ? clientData : {};
    const orgName = !_.isEmpty(clientData) ? clientData.legalName : '';

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
          <h4 className={cx(styles.RightNavLabel, 'pt-4 mt-0 pb-3')}>client details</h4>
        </div>
        <div className="ml-4">
          <div className="row ml-2 mt-3">
            <NavLink to={`/customer-mgmt/org/${orgId}/vendor-mgmt/client/${clientId}/details/location-sites`}>
              <NavUrl isDisabled={checkState !== 'client-location-sites'} label="location & sites" />
            </NavLink>
          </div>
          <div className="row ml-2 mt-3">
            <NavLink to={`/customer-mgmt/org/${orgId}/vendor-mgmt/client/${clientId}/details/function-role`}>
              <NavUrl isDisabled={checkState !== 'client-function-role'} label="function & role" />
            </NavLink>
          </div>
        </div>
        <span className="ml-3 mt-4">
          <NavLink onClick={(event) => this.handleNavLink(event)} to={`/customer-mgmt/org/${orgId}/vendor-mgmt/client/${clientId}/clientprofile?filter=overall_insights`}>
            <Button isDisabled={!!_.isEmpty(clientData)} label="go to client" type="largeWithArrow" className="mt-4" />
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
  clientData: state.vendorMgmt.clientTags.getClientData,
  clientDataState: state.vendorMgmt.clientTags.getClientDataState,
});

export default withTranslation()(withRouter(
  connect(mapStateToProps, null)(ClientRightNav),
));
