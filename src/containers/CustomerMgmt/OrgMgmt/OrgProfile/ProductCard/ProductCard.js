/* eslint-disable react/no-did-update-set-state */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import * as actions from '../Store/action';
import verify from '../../../../../assets/icons/verifyWithBg.svg';
import operations from '../../../../../assets/icons/operations.svg';
import onBoardIcon from '../../../../../assets/icons/onboardWithBg.svg';
import attend from '../../../../../assets/icons/attend.svg';
import vendorIcon from '../../../../../assets/icons/vendorWithBg.svg';
import Card from './Card';

class ProductCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enableBGV: false,
      enableOPS: false,
      confirmDisablePopup: false,
      enableATTEND: false,
      enableVENDOR: false,
      enabledPlatformData: {},
    };
  }

    componentDidMount = () => {
      const thisRef = this;
      const {
        enabledPlatformProducts, enabledPlatformServices,
        enabledPlatformPlatformServices, enabledData,
      } = this.props;

      if (enabledPlatformProducts && enabledPlatformProducts.length > 0) {
        _.forEach(enabledPlatformProducts, (prod) => {
          if (prod.product) {
            thisRef.setState({
              [`enable${prod.product}`]: true,
            });
          }
        });
      }

      if (enabledPlatformServices && enabledPlatformServices.length > 0) {
        _.forEach(enabledPlatformServices, (ser) => {
          if (ser.service) {
            thisRef.setState({ [`enable${ser.service}`]: true });
          }
        });
      }

      if (enabledPlatformPlatformServices && enabledPlatformPlatformServices.length > 0) {
        _.forEach(enabledPlatformPlatformServices, (ser) => {
          if (ser.platformService) {
            thisRef.setState({ [`enable${ser.platformService}`]: true });
          }
        });
      }

      this.setState({ enabledPlatformData: enabledData });
    }

    componentDidUpdate = (prevProps) => {
      const {
        deleteBgvConfigState,
        orgId,
        onGetSelectedServiceData,
        deleteOpsConfigState,
        onGetSelectedOpsData,
        postEnabledPlatformServicesState,
        enabledData,
      } = this.props;
      if (prevProps.deleteBgvConfigState !== deleteBgvConfigState && deleteBgvConfigState === 'SUCCESS') {
        onGetSelectedServiceData(orgId);
      }

      if (prevProps.deleteOpsConfigState !== deleteOpsConfigState && deleteOpsConfigState === 'SUCCESS') {
        onGetSelectedOpsData(orgId);
      }

      if (prevProps.postEnabledPlatformServicesState !== postEnabledPlatformServicesState && postEnabledPlatformServicesState === 'SUCCESS') {
        this.setState({ enabledPlatformData: enabledData });
      }
    }

    handleToggleWarning = (name, type) => {
      const { confirmDisablePopup } = this.state;
      const deleteVerifyPopupFlag = !confirmDisablePopup;

      // eslint-disable-next-line react/destructuring-assignment
      if (this.state[`enable${name}`]) {
        this.setState({
          confirmDisablePopup: deleteVerifyPopupFlag,
        });
      } else {
        this.handleAddition(name, type);
        this.setState({
          [`enable${name}`]: true,
        });
      }
    }

    handleAddition = (label, category) => {
      const { enabledPlatformData } = this.state;
      const { orgId, onPostPlatformService, onPutPlatformService } = this.props;
      let updatedPlatform = enabledPlatformData;

      if (_.isEmpty(updatedPlatform)) {
        updatedPlatform = {
          products: [], services: [], platformServices: [], orgId,
        };

        if (category === 'product' && _.isEmpty(updatedPlatform.services)) {
          updatedPlatform.products.push({ product: label });
        } else if (category === 'service' && _.isEmpty(updatedPlatform.products)) {
          updatedPlatform.services.push({ service: label });
        } else if (category === 'platformService') {
          updatedPlatform.platformServices.push({ platformService: label });
        }
        onPostPlatformService(updatedPlatform, orgId);
      } else {
        const updatedProducts = updatedPlatform.products;
        const updatedServices = updatedPlatform.services;
        const updatedPlatformServices = !_.isEmpty(updatedPlatform.platformServices)
          ? updatedPlatform.platformServices : [];

        if (category === 'product') {
          updatedProducts.push({ product: label });
          updatedPlatform.products = updatedProducts;
        } else if (category === 'service') {
          updatedServices.push({ service: label });
          updatedPlatform.services = updatedServices;
        } else if (category === 'platformService') {
          updatedPlatformServices.push({ platformService: label });
          updatedPlatform.platformServices = updatedPlatformServices;
        }
        onPutPlatformService(updatedPlatform, orgId);
      }
      this.setState({ enabledPlatformData: updatedPlatform });
    }

    handleDelete = (name, category) => {
      let { enableOPS } = this.state;
      const { enabledPlatformData } = this.state;
      const {
        onDeleteBgvConfig, orgId, onDeleteOpsConfig, onPutPlatformService,
      } = this.props;

      let updatedProducts = []; let
        updatedServices = [];

      if (category === 'product') {
        updatedProducts = enabledPlatformData.products.filter((ser) => ser.product !== name);
        switch (name) {
          case 'BGV':
            onDeleteBgvConfig(orgId);
            break;
          default:
            break;
        }

        enabledPlatformData.products = updatedProducts;
        onDeleteBgvConfig(orgId);
      } else if (category === 'service') {
        updatedServices = enabledPlatformData.services.filter((ser) => ser.service !== name);
        enabledPlatformData.services = updatedServices;
        enableOPS = false;

        onDeleteOpsConfig(orgId);
      }

      this.setState({
        confirmDisablePopup: false,
        enabledPlatformData,
        enableOPS,
        [`enable${name}`]: false,
      });
      onPutPlatformService(enabledPlatformData, orgId);
    }

    render() {
      const {
        t, type, orgId, name, selectedServiceData, selectedOpsData, getClientNotification,
      } = this.props;
      let verifyProps;
      let serviceProps;
      let onBoardProps;
      let attendProps;
      const {
        enableBGV,
        confirmDisablePopup,
        enableOPS,
        enableATTEND,
        enableVENDOR,
      } = this.state;
      let vendorProps;
      // const {
      //   enableBGV, confirmDisablePopup, enableOPS, enableVENDOR,
      // } = this.state;
      switch (name) {
        case 'BGV':
          verifyProps = {
            t,
            skipHasAccess: true,
            isEnabled: enableBGV,
            leftIcon: verify,
            orgId,
            toggleButton: {
              isDisabled: false,
              onChange: () => this.handleToggleWarning(name, type),
            },
            productLabel: t('translation_orgProfile:productCard:verify'),
            configuration: {
              permission: ['BGV_CONFIG:CREATE'],
              isEnabled: enableBGV,
              link: `/customer-mgmt/org/${orgId}/config/bgv-select`,
              tooltip: (_.isEmpty(selectedServiceData)) || (selectedServiceData && selectedServiceData.status === 'inProgress'),
              tooltipText: t('translation_orgProfile:productCard:configIncomplete'),
              isVisible: true,
            },
            dashboard: {
              isVisible: true,
              permission: ['BGV:DASHBOARD'],
              isEnabled: enableBGV && !_.isEmpty(selectedServiceData) && selectedServiceData.status === 'done',
              link: `/customer-mgmt/org/${orgId}/dashboard/verify?filter=insights&duration=all_time`,
            },
            popup: {
              show: confirmDisablePopup,
              isWarning: (_.isEmpty(selectedServiceData) || (selectedServiceData && selectedServiceData.status === 'inProgress')),
              warning: {
                text: t('translation_orgProfile:productCard:warningText'),
                para: t('translation_orgProfile:productCard:warningPara'),
                confirmText: t('translation_orgProfile:productCard:warningDisable'),
                cancelText: t('translation_orgProfile:productCard:warningCancel'),
                warningPopUp: () => this.handleDelete(name, type),
                closePopup: () => this.setState({ confirmDisablePopup: false }),
              },
              alert: {
                text: t('translation_orgProfile:productCard:alertText'),
                para: t('translation_orgProfile:productCard:alertPara'),
                okText: t('translation_orgProfile:productCard:alertOk'),
                closePopup: () => this.setState({ confirmDisablePopup: false }),
              },
            },
          };
          return (
            <Card {...verifyProps} />
          );
        case 'OPS':
          serviceProps = {
            t,
            permission: ['OPS_CONFIG:CREATE'],
            isEnabled: enableOPS,
            leftIcon: operations,
            orgId,
            toggleButton: {
              isDisabled: false,
              onChange: () => this.handleToggleWarning(name, type),
            },
            productLabel: t('translation_orgProfile:productCard:operations'),
            configuration: {
              permission: ['OPS_CONFIG:CREATE'],
              isEnabled: enableOPS,
              link: `/customer-mgmt/org/${orgId}/opsconfig/ops-select`,
              tooltip: (_.isEmpty(selectedOpsData)) || (selectedOpsData && selectedOpsData.status === 'inProgress'),
              tooltipText: t('translation_orgProfile:productCard:configIncomplete'),
              isVisible: true,
            },
            dashboard: {
              isVisible: false,
            },
            popup: {
              show: confirmDisablePopup,
              isWarning: (_.isEmpty(selectedOpsData) || (selectedOpsData && selectedOpsData.status === 'inProgress')),
              warning: {
                text: t('translation_orgProfile:productCard:warningText'),
                para: t('translation_orgProfile:productCard:warningPara'),
                confirmText: t('translation_orgProfile:productCard:warningDisable'),
                cancelText: t('translation_orgProfile:productCard:warningCancel'),
                warningPopUp: () => this.handleDelete(name, type),
                closePopup: () => this.setState({ confirmDisablePopup: false }),
              },
              alert: {
                text: t('translation_orgProfile:productCard:alertText'),
                para: t('translation_orgProfile:productCard:alertPara'),
                okText: t('translation_orgProfile:productCard:alertOk'),
                closePopup: () => this.setState({ confirmDisablePopup: false }),
              },
            },
          };
          return (
            <Card {...serviceProps} />
          );
        case 'ONBOARD':
          onBoardProps = {
            t,
            skipHasAccess: true,
            isEnabled: true,
            leftIcon: onBoardIcon,
            orgId,
            toggleButton: {
              isDisabled: false,
              onChange: () => this.handleToggleWarning(name, type),
            },
            productLabel: t('translation_orgProfile:productCard:onboard'),
            configuration: {
              permission: ['ONBOARD_CONFIG:CREATE'],
              isEnabled: true,
              link: `/customer-mgmt/org/${orgId}/onboardconfig/select-documents`,
              tooltip: false,
              tooltipText: '',
              isVisible: true,
            },
            dashboard: {
              isVisible: true,
              permission: ['ONBOARD:DASHBOARD'],
              isEnabled: true,
              link: `/customer-mgmt/org/${orgId}/dashboard/onboard/insights?duration=all_time`,
            },
            popup: {
              show: confirmDisablePopup,
              isWarning: false,
              alert: {
                text: t('translation_orgProfile:productCard:alertText'),
                para: t('translation_orgProfile:productCard:alertPara'),
                okText: t('translation_orgProfile:productCard:alertOk'),
                closePopup: () => this.setState({ confirmDisablePopup: false }),
              },
            },
          };
          return (
            <Card {...onBoardProps} />
          );
        case 'ATTEND':
          attendProps = {
            t,
            skipHasAccess: true,
            isEnabled: enableATTEND,
            leftIcon: attend,
            orgId,
            toggleButton: {
              isDisabled: false,
              onChange: () => this.handleToggleWarning(name, type),
            },
            productLabel: 'attend',
            configuration: {
              permission: ['ORG_LEVEL_CONFIG:VIEW', 'SITE_CONFIG:VIEW', 'LEAVE_CONFIG:VIEW', 'HOLIDAY_CONFIG:VIEW', 'BP_SPOC_CONFIG:VIEW', 'CLIENT_SPOC_CONFIG:VIEW'],
              isEnabled: enableATTEND,
              link: `/customer-mgmt/org/${orgId}/attendconfig/org-level-config`,
              tooltip: false,
              tooltipText: '',
              isVisible: true,
            },
            dashboard: {
              isVisible: true,
              // permission:['BGV:DASHBOARD'], needed to be changed later
              isEnabled: true,
              link: `/customer-mgmt/org/${orgId}/dashboard/attend/site-shift-mgmt`,
            },
            popup: {
              show: confirmDisablePopup,
              isWarning: false,
              alert: {
                text: t('translation_orgProfile:productCard:alertText'),
                para: t('translation_orgProfile:productCard:alertPara'),
                okText: t('translation_orgProfile:productCard:alertOk'),
                closePopup: () => this.setState({ confirmDisablePopup: false }),
              },
            },
          };
          return (
            <Card {...attendProps} />
          );

        case 'VENDOR':
          vendorProps = {
            t,
            skipHasAccess: true,
            isEnabled: enableVENDOR,
            leftIcon: vendorIcon,
            orgId,
            toggleButton: {
              isDisabled: false,
              onChange: () => this.handleToggleWarning(name, type),
            },
            productLabel: t('translation_orgProfile:productCard:vendor'),
            configuration: {
              isVisible: false,
            },
            dashboard: {
              permission: ['VENDOR:VIEW', 'CLIENT:VIEW'],
              isEnabled: enableVENDOR,
              link: `/customer-mgmt/org/${orgId}/vendor-mgmt`,
              tooltip: (!_.isEmpty(getClientNotification)),
              tooltipText: t('translation_orgProfile:productCard:configIncomplete'),
              isVisible: true,
            },
            popup: {
              show: confirmDisablePopup,
              isWarning: false,
              alert: {
                text: t('translation_orgProfile:productCard:alertText'),
                para: t('translation_orgProfile:productCard:alertPara'),
                okText: t('translation_orgProfile:productCard:alertOk'),
                closePopup: () => this.setState({ confirmDisablePopup: false }),
              },
            },
          };
          return (
            <Card {...vendorProps} />
          );
        default: return null;
      }
    }
}

const mapStateToProps = (state) => ({
  deleteBgvConfigState: state.orgMgmt.orgProfile.deleteBgvConfigState,
  deleteOpsConfigState: state.orgMgmt.orgProfile.deleteOpsConfigState,
  enabledPlatformServices: state.orgMgmt.orgProfile.EnabledServices,
  enabledPlatformProducts: state.orgMgmt.orgProfile.EnabledProducts,
  enabledPlatformPlatformServices: state.orgMgmt.orgProfile.EnabledPlatformServices,
  enabledData: state.orgMgmt.orgProfile.enabledData,
  postEnabledPlatformServicesState: state.orgMgmt.orgProfile.postEnabledPlatformServicesState,

  selectedServiceData: state.orgMgmt.orgProfile.getBGVSelectedData,
  selectedOpsData: state.orgMgmt.orgProfile.getOpsSelectedData,
  getClientNotification: state.orgMgmt.orgProfile.getClientNotification,
});

const mapDispatchToProps = (dispatch) => ({
  onDeleteBgvConfig: (orgId) => dispatch(actions.deleteBgvConfig(orgId)),
  onDeleteOpsConfig: (orgId) => dispatch(actions.deleteOpsConfig(orgId)),
  onPutPlatformService: (data, orgId) => dispatch(actions.putEnabledPlatformServices(data, orgId)),
  onPostPlatformService: (data, orgId) => dispatch(
    actions.postEnabledPlatformServices(data, orgId),
  ),
  onGetSelectedServiceData: (orgId) => dispatch(actions.getSelectedBGVData(orgId)),
  onGetSelectedOpsData: (orgId) => dispatch(actions.getSelectedOpsData(orgId)),
});

export default withTranslation()(withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProductCard),
));
