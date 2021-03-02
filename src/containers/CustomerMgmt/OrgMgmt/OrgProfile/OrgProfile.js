import React, { Component } from "react";
import cx from "classnames";
import styles from "./OrgProfile.module.scss";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash";
import * as actions from "./Store/action";
import themes from '../../../../theme.scss';

import CardHeader from '../../../../components/Atom/PageTitle/PageTitle';
import ArrowLink from '../../../../components/Atom/ArrowLink/ArrowLink';
import ProductCard from './ProductCard/ProductCard';
import Loader from '../../../../components/Organism/Loader/Loader';

// import smallArrowRight from "../../../../assets/icons/orgProfileArrow.svg";
import common_logo from "../../../../assets/icons/companyEmptyLogo.svg";
// import smallArrowDisabled from '../../../../assets/icons/greyDropdown.svg';
// import editOrgInactive from '../../../../assets/icons/blueEdit.svg';
// import editOrgActive from '../../../../assets/icons/editOrgInactive.svg';
import prodIcon from '../../../../assets/icons/orgProduct.svg';
import serviceIcon from '../../../../assets/icons/orgService.svg';
import platformIcon from '../../../../assets/icons/orgPlatform.svg';
import website from '../../../../assets/icons/website.svg';
import building from '../../../../assets/icons/greyBuilding.svg';

import HasAccess from "../../../../services/HasAccess/HasAccess";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router";

const themeBackgroundColor = {
  "#262D33": themes.black1Theme,
  "#0059B2": themes.blueTheme,
  "#88ABD3": themes.greyTheme,
  "#4BB752": themes.greenTheme,
  "#FFB803": themes.yellowTheme,
  "#7C2E9E": themes.purpleTheme,
  "#EE3942": themes.redTheme,
  "#8D6D55": themes.brownTheme,
  "#A84567": themes.black2Theme,
  "#8697A8": themes.defaultTheme
}


class OrgProfile extends Component {
  state = {
    orgId: null,
    orgProfileCount: 0,
  }

  products = [
    {
      name: 'ONBOARD',
      type: 'product',
    },
    {
      name: 'BGV',
      type: 'product',
    },
    {
      name: 'ATTEND',
      type: 'product'
    }
  ]

  services = [
    {
      name: 'OPS',
      type: 'service'
    }
  ]

  platformServices = [
    {
      name: 'VENDOR',
      type: 'platformService'
    }
  ]

  componentDidMount() {
    const { match } = this.props;
    const orgId = match.params.uuid;
    const thisRef = this;

    if (orgId) {
      this.props.onGetOrgDetailsById(orgId);
      this.props.onGetAllPlatformServices();
      this.props.onGetSelectedServiceData(orgId); //bgv config data
      this.props.onGetSelectedOpsData(orgId); //ops config data
    }
    sessionStorage.setItem("orgId", orgId);
    this.setState({ orgId: orgId });

    _.forEach(this.props.policies, function (policy) {
      if (_.includes(policy.businessFunctions, "CLIENT:ACCEPT") || _.includes(policy.businessFunctions, "*")) {
        thisRef.props.onGetVendorNotification(orgId);
      }
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.getPlatformServicesState !== this.props.getPlatformServicesState && this.props.getPlatformServicesState === "SUCCESS") {
      if (!_.isEmpty(this.state.orgId)) {
        this.props.onGetEnabledPlatformServices(this.state.orgId);
      }
    }
  }

  componentWillUnmount = () => {
    this.props.initOrgDetails();
  }

  handleShowArrow = () => {
    let orgProfileCount = 0;
    let userGroup = this.props.user.userGroup
    if (userGroup === 'SUPER_ADMIN') {
      return true;
    }
    _.forEach(this.props.policies, function (policy) {
      if (_.includes(policy.businessFunctions, "ORG_PROFILE:VIEW")) {
        orgProfileCount = orgProfileCount + 1;
      }
    })
    return orgProfileCount > 1 ? true : false
  }

  render() {
    const { t, match } = this.props;
    const orgId = match.params.uuid;

    let orgType = '';
    if (!_.isEmpty(this.props.data) && this.props.data.organisationType && !_.isEmpty(this.props.ORG_MGMT_ORGANISATION_TYPE)) {
      orgType = this.props.ORG_MGMT_ORGANISATION_TYPE.find(org => {
        return org.value === this.props.data.organisationType
      }).label;
    }

    return (
      <React.Fragment>
        {this.props.getOrgDataState === 'LOADING' || this.props.getPlatformServicesState === 'LOADING' || this.props.getEnabledServicesState === 'LOADING' ?
          <div className={cx(styles.LoaderCard)} >
            <Loader type='orgProfile' />
          </div>
          :
          this.props.data ? (
            <React.Fragment >
              <div className={cx(styles.Card)} >
                {this.handleShowArrow() ?
                  <ArrowLink
                    label={t('translation_orgProfile:label.l9')}
                    url={`/customer-mgmt/org?filter=starred`}
                    className='mb-2'
                  />
                  :
                  <div style={{ marginTop: '3.6rem' }} />
                }
                <span className={styles.orgName}>
                  {this.props.data.name
                    ? this.props.data.name.toLowerCase()
                    : null}
                </span>

                <div className={cx("card-body mb-3", styles.HeadCard)} >
                  <div className={cx('row no-gutters', styles.BrandTheme)}
                    style={{ backgroundColor: themeBackgroundColor[this.props.data.brandColor] }}
                  >
                    <div className={styles.box}
                      style={{ backgroundColor: this.props.data.brandColor !== null ? this.props.data.brandColor : "#8697A8" }}
                    >
                      <img
                        className={styles.icon}
                        src={common_logo}
                        alt={t("translation_orgProfile:image_alt_orgProfile.icon")}
                      />
                    </div>

                    <div className="ml-4 d-flex flex-column my-auto" style={{ width: "70%" }}>
                      <label className={styles.orgHeading}>
                        {this.props.data.legalName}
                      </label>
                      {!_.isEmpty(this.props.data.address) ? (
                        <label className={styles.secondHeading}>
                          {!_.isEmpty(this.props.data.address.addressLine1) ? this.props.data.address.addressLine1 + ", " : ""}
                          {!_.isEmpty(this.props.data.address.addressLine2) ? this.props.data.address.addressLine2 + ", " : ""}
                          {!_.isEmpty(this.props.data.address.city) ? this.props.data.address.city + ", " : ""}
                          {!_.isEmpty(this.props.data.address.state) ? this.props.data.address.state + ", " : ""}
                          {!_.isEmpty(this.props.data.address.country) ? this.props.data.address.country + ", " : ""}
                          {!_.isEmpty(this.props.data.address.pincode) ? this.props.data.address.pincode : ""}
                        </label>
                      ) : null}
                      <div className="d-flex flex-row pt-1">
                        {!_.isEmpty(orgType) ?
                          <small className={cx(styles.tagText, "pl-0")}>
                            <img src={building} alt='' /> &ensp;
                          {orgType}
                          </small> : null}
                        {this.props.data.website ?
                          <small className={cx(styles.tagText, "pl-4")}>
                            <img src={website} alt='' /> &ensp;
                          {this.props.data.website}
                          </small> : null}
                      </div>
                    </div>

                    <div className="d-flex flex-row ml-auto">
                      <HasAccess
                        permission={["ORG_PROFILE:EDIT"]}
                        orgId={orgId}
                        yes={() => (
                          <NavLink
                            to={"/customer-mgmt/org/" + this.props.data.uuid}
                            className={styles.Link}>
                              <div className={cx('row no-gutters', styles.smallButton)}>
                                <div className={cx('mr-1', styles.editImg)} alt="" />
                                <span>{t("translation_orgProfile:label.l8")}</span>
                              </div>
                          </NavLink>
                        )}
                      />
                    </div>
                  </div>


                  <div className='row no-gutters mt-3'>
                    <CardHeader greyHeading label={t("translation_orgProfile:label.l11")} iconSrc={prodIcon} />
                  </div>
                  <div className="d-flex flex-row flex-wrap">
                    {this.products.map((product, index) =>
                      <div style={{ width: '11.5rem' }} className="mr-4" key={index}>
                        <ProductCard {...product}
                          orgId={orgId}
                        />
                      </div>
                    )}
                  </div>

                  <HasAccess
                    permission={["OPS_CONFIG:CREATE"]}//{["ORG_PROFILE:VIEW"]}
                    orgId={orgId}
                    yes={() => (
                      <div>
                        <div className='row no-gutters mt-3'>
                          <CardHeader greyHeading label={t("translation_orgProfile:label.l12")} iconSrc={serviceIcon} />
                        </div>

                        <div className="d-flex flex-row flex-wrap">
                          {this.services.map((service, index) =>
                            <div style={{ width: '11.5rem' }} key={index}>
                              <ProductCard {...service}
                                orgId={orgId}
                              />
                            </div>)}
                        </div>
                      </div>
                    )}
                  />

                  <HasAccess
                    permission={["VENDOR:VIEW", "CLIENT:VIEW"]}
                    orgId={orgId}
                    yes={() => (
                      <React.Fragment>
                        <div className='row no-gutters mt-3'>
                          <CardHeader greyHeading label={t("translation_orgProfile:label.l13")} iconSrc={platformIcon} />
                        </div>
                        <div className="d-flex flex-row flex-wrap">
                          {this.platformServices.map((vendor, index) =>
                            <div style={{ width: '11.5rem' }} key={index}>
                              <ProductCard {...vendor}
                                orgId={orgId}
                              />
                            </div>
                          )}
                        </div>
                      </React.Fragment>
                    )}
                  />
                </div>
              </div>
            </React.Fragment>
          ) : null
        }

      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    ORG_MGMT_ORGANISATION_TYPE: state.orgMgmt.staticData.orgMgmtStaticData["ORG_MGMT_ORGANISATION_TYPE"],
    getOrgDataState: state.orgMgmt.orgProfile.getDataState,
    // platformServices: state.orgMgmt.orgProfile.PlatformServices,
    // platformProducts: state.orgMgmt.orgProfile.PlatformProducts,
    // enabledServices: state.orgMgmt.orgProfile.EnabledServices,
    // enabledProducts: state.orgMgmt.orgProfile.EnabledProducts,
    getPlatformServicesState: state.orgMgmt.orgProfile.getAllPlatformServicesState,
    getEnabledServicesState: state.orgMgmt.orgProfile.getEnabledPlatformServicesState,
    // servicesId: state.orgMgmt.orgProfile.servicesId,
    // logoUrl: state.orgMgmt.orgProfile.logoUrl,
    data: state.orgMgmt.orgProfile.data,
    // clientOrgId: state.auth.policies[0].orgId,
    // serviceStatus: state.orgMgmt.orgOpsConfigReducer.configStatus,
    // empCount: state.empMgmt.empList.dataCount,
    policies: state.auth.policies,
    user: state.auth.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    initOrgDetails: () => dispatch(actions.initState()),
    onGetOrgDetailsById: orgId => dispatch(actions.getDataById(orgId)),
    onGetAllPlatformServices: () => dispatch(actions.getAllPlatformServices()),
    onGetEnabledPlatformServices: orgId => dispatch(actions.getEnabledPlatformServices(orgId)),
    // onPostEnabledServices: (data, Id) => dispatch(actions.postEnabledPlatformServices(data, Id)),
    // onPutEnabledServices: (data, Id) => dispatch(actions.putEnabledPlatformServices(data, Id)),
    onGetSelectedServiceData: (orgId) => dispatch(actions.getSelectedBGVData(orgId)),
    onGetSelectedOpsData: (orgId) => dispatch(actions.getSelectedOpsData(orgId)),
    onGetVendorNotification: (orgId) => dispatch(actions.getNotification(orgId)),
  };
};

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(OrgProfile)));