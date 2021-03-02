/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-prototype-builtins */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import _ from 'lodash';
import cx from 'classnames';

import CheckBox from '../../../../../../components/Atom/CheckBox/CheckBox';
import Address from './Address/Address';
import BGVLabel from '../BGVLabel/BGVLabel';

import styles from './EmpAddress.module.scss';

class EmpAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        isCurrAndPerAddrSame: false,
      },
      errors: {},
      isEdited: false,
    };
    this._isMounted = false;
  }

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(prevProps.data, this.props.data) && !this.state.isEdited) {
      this.handlePropsToState();
    }

    if (!_.isEqual(prevProps.errors, this.props.errors)) {
      if (!_.isEqual(this.props.errors, this.state.errors)) {
        let updatedErrors = {};
        if (!_.isEmpty(this.props.errors)) {
          updatedErrors = _.cloneDeep(this.props.errors);
        }
        this.setState({
          errors: updatedErrors,
        });
      }
    }

    if (prevProps.isEdited !== this.props.isEdited) {
      if (!this.props.isEdited) {
        this.handlePropsToState();
      }
    }

    if (!_.isEqual(prevState.errors, this.state.errors)) {
      this.props.onError(this.state.errors);
    }
  }

  handlePropsToState = () => {
    const updatedFormData = {};
    updatedFormData.isCurrAndPerAddrSame = this.props.data.isCurrAndPerAddrSame;
    if (!_.isEmpty(this.props.data.addresses)) {
      _.forEach(this.props.data.addresses, (address) => {
        if (!_.isEmpty(address.addressType)) {
          updatedFormData[address.addressType] = address;
        }
      });
    }
    this.setState({
      formData: updatedFormData,
      isEdited: false,
    });
  }

  handleSendDataToParent = () => {
    let isFormEmpty = true;
    const payload = [];
    _.forEach(this.state.formData, (value) => {
      if (!_.isEmpty(value)) {
        isFormEmpty = false;
        payload.push(value);
      }
    });
    if (isFormEmpty) {
      this.props.onChange({
        addresses: null,
        isCurrAndPerAddrSame: null,
      });
    } else {
      this.props.onChange({
        isCurrAndPerAddrSame: this.state.formData.isCurrAndPerAddrSame,
        addresses: payload,
      });
    }
  }

  handleGetData = (addressType) => this.state.formData[addressType]

  handleStoreDataInState = (addressType, data) => {
    const updatedFormData = _.cloneDeep(this.state.formData);
    updatedFormData[addressType] = data;
    this.setState({
      formData: updatedFormData,
      isEdited: true,
    }, () => this.handleSendDataToParent());
  };

  handleStoreErrorInState = (addressType, error) => {
    const currentErrors = _.cloneDeep(this.state.errors);
    const updatedErrors = _.cloneDeep(currentErrors);
    if (!_.isEmpty(error)) {
      updatedErrors[addressType] = error;
    } else {
      delete updatedErrors[addressType];
    }
    if (!_.isEqual(updatedErrors, currentErrors)) {
      this.setState({
        errors: updatedErrors,
      });
    }
  };

  handleCheckBox = () => {
    const updatedFormData = _.cloneDeep(this.state.formData);
    const isCurrAndPerAddrSame = !updatedFormData.isCurrAndPerAddrSame;
    updatedFormData.isCurrAndPerAddrSame = isCurrAndPerAddrSame;

    if (isCurrAndPerAddrSame) {
      delete updatedFormData.PERMANENT_ADDRESS;
    }

    this.setState({
      formData: updatedFormData,
      isEdited: true,
    }, () => this.handleSendDataToParent());
  }

  getBGVData = (addressType) => {
    let bgvData = null;
    if (!_.isEmpty(this.props.bgvData)) {
      if (!_.isEmpty(this.props.bgvData[0])) {
        if (!_.isEmpty(this.props.bgvData[0].bgv)) {
          if (!_.isEmpty(this.props.bgvData[0].bgv.address)) {
            bgvData = this.props.bgvData[0].bgv.address.checks.find(
              (check) => check.service === addressType,
            );
            const status = !_.isEmpty(bgvData) ? bgvData.status : null;
            if (status === 'inProgress') bgvData = null;
          }
        }
      }
    }
    return bgvData;
  }

  getBgvMissingInfo = (addressType) => {
    let missingInfo = null;
    if (!_.isEmpty(this.props.bgvMissingInfo)) {
      switch (addressType) {
        case 'CURRENT_ADDRESS':
          if (this.props.bgvMissingInfo.hasOwnProperty('CURRENT_ADDRESS')) {
            missingInfo = _.cloneDeep(this.props.bgvMissingInfo.CURRENT_ADDRESS[0]);
            missingInfo.missingFields = _.remove(missingInfo.missingFields, (emp) => emp !== 'contact');
            missingInfo = !_.isEmpty(missingInfo.missingFields) ? missingInfo : null;
          } else if (this.props.bgvMissingInfo.hasOwnProperty('CRC_CURRENT_ADDRESS')) {
            missingInfo = this.props.bgvMissingInfo.CRC_CURRENT_ADDRESS[0];
          } else if (this.props.bgvMissingInfo.hasOwnProperty('POLICE_VERIFICATION')) {
            missingInfo = this.props.bgvMissingInfo.POLICE_VERIFICATION[0];
          }
          break;
        case 'PERMANENT_ADDRESS':
          if (this.props.bgvMissingInfo.hasOwnProperty('PERMANENT_ADDRESS')) {
            missingInfo = _.cloneDeep(this.props.bgvMissingInfo.PERMANENT_ADDRESS[0]);
            missingInfo.missingFields = _.remove(missingInfo.missingFields, (emp) => emp !== 'contact');
            missingInfo = !_.isEmpty(missingInfo.missingFields) ? missingInfo : null;
          } else if (this.props.bgvMissingInfo.hasOwnProperty('CRC_PERMANENT_ADDRESS')) {
            missingInfo = this.props.bgvMissingInfo.CRC_PERMANENT_ADDRESS[0];
          }
          break;
        default:
          break;
      }
    }
    return missingInfo;
  }

  getBgvInsufInfo = (addressType) => {
    let insufInfo;
    if (!_.isEmpty(this.props.bgvMissingInfo)) {
      if (this.props.bgvMissingInfo.hasOwnProperty(addressType)) {
        insufInfo = this.props.bgvMissingInfo[addressType][0].status !== 'missing_info' ? this.props.bgvMissingInfo[addressType][0] : null;
      }
    }
    return insufInfo;
  }

  render() {
    const bgvDataCurrentAddress = this.getBGVData('CURRENT_ADDRESS');
    const bgvDataPermanentAddress = this.getBGVData('PERMANENT_ADDRESS');

    const missingInfoCurrentAddress = this.getBgvMissingInfo('CURRENT_ADDRESS');
    const missingInfoPermanentAddress = this.getBgvMissingInfo('PERMANENT_ADDRESS');

    const insufInfoCurrentAddress = this.getBgvInsufInfo('CURRENT_ADDRESS_REVIEW');
    const insufInfoPermanentAddress = this.getBgvInsufInfo('PERMANENT_ADDRESS_REVIEW');

    const statusTypeCurrentAddress = !_.isEmpty(missingInfoCurrentAddress) ? 'missingInfo'
      : !_.isEmpty(insufInfoCurrentAddress) ? 'insufInfo'
        : !_.isEmpty(bgvDataCurrentAddress) && (bgvDataCurrentAddress.status !== 'missing_info') ? 'bgvStatus' : null;

    const statusTypePermanentAddress = !_.isEmpty(missingInfoPermanentAddress) ? 'missingInfo'
      : !_.isEmpty(insufInfoPermanentAddress) ? 'insufInfo'
        : !_.isEmpty(bgvDataPermanentAddress) && (bgvDataPermanentAddress.status !== 'missing_info') ? 'bgvStatus' : null;
    return (
      <div className={styles.formLayout}>
        <div className={cx('mb-4', this.props.isActive ? styles.opacityHeadIn : styles.opacityHeadOut)}>
          <div className={styles.horizontalLineInactive} />
          <span className={styles.formHead}>address</span>
        </div>

        <div className="d-flex">
          <div className={styles.formSubHead}>
            current address
          </div>
          {
            !_.isEmpty(statusTypeCurrentAddress)
              ? (
                <div className="ml-auto">
                  <BGVLabel
                    bgvData={bgvDataCurrentAddress}
                    missingInfoData={missingInfoCurrentAddress}
                    insufInfoData={insufInfoCurrentAddress}
                    type={statusTypeCurrentAddress}
                  />
                </div>
              )
              : null
          }
        </div>
        <Address
          addressType="CURRENT_ADDRESS"
          onChange={
            (data) => this.handleStoreDataInState('CURRENT_ADDRESS', data)
          }
          onError={
            (error) => this.handleStoreErrorInState('CURRENT_ADDRESS', error)
          }
          data={this.handleGetData('CURRENT_ADDRESS')}
          errors={this.state.errors.CURRENT_ADDRESS}
          isEdited={this.state.isEdited}
          EMP_MGMT_HOUSE_TYPE={this.props.empMgmtStaticData.EMP_MGMT_HOUSE_TYPE}
          isDisabled={!_.isEmpty(bgvDataCurrentAddress) && ['inProgress', 'manualReviewPending'].includes(bgvDataCurrentAddress.status)}
        />

        <div className="d-flex mt-3">
          <div className={styles.formSubHead}>
            permanent address
          </div>
          {
            !_.isEmpty(statusTypePermanentAddress)
              ? (
                <div className="ml-auto">
                  <BGVLabel
                    bgvData={bgvDataPermanentAddress}
                    missingInfoData={missingInfoPermanentAddress}
                    insufInfoData={insufInfoPermanentAddress}
                    type={statusTypePermanentAddress}
                  />
                </div>
              )
              : null
          }
        </div>
        <div className="row mx-0 px-0 mb-4">
          <CheckBox
            type="medium"
            name="isCurrAndPerAddrSame"
            className={styles.alignCheckBox}
            value={this.state.formData.isCurrAndPerAddrSame}
            onChange={this.handleCheckBox}
            disabled={!_.isEmpty(bgvDataPermanentAddress) && ['inProgress', 'manualReviewPending'].includes(bgvDataPermanentAddress.status)}
          />
          <div className={styles.permanentCheckBox}>
            permanent address same as current address
          </div>
        </div>
        {!this.state.formData.isCurrAndPerAddrSame ? (
          <Address
            addressType="PERMANENT_ADDRESS"
            onChange={
              (data) => this.handleStoreDataInState('PERMANENT_ADDRESS', data)
            }
            onError={
              (error) => this.handleStoreErrorInState('PERMANENT_ADDRESS', error)
            }
            data={this.handleGetData('PERMANENT_ADDRESS')}
            errors={this.state.errors.PERMANENT_ADDRESS}
            isEdited={this.state.isEdited}
            EMP_MGMT_HOUSE_TYPE={this.props.empMgmtStaticData.EMP_MGMT_HOUSE_TYPE}
            isDisabled={!_.isEmpty(bgvDataPermanentAddress) && ['inProgress', 'manualReviewPending'].includes(bgvDataPermanentAddress.status)}
          />
        )
          : null}

        <div className={styles.formSubHead}>
          other address
        </div>
        <Address
          addressType="CUSTOM_ADDRESS"
          onChange={
            (data) => this.handleStoreDataInState('CUSTOM_ADDRESS', data)
          }
          onError={
            (error) => this.handleStoreErrorInState('CUSTOM_ADDRESS', error)
          }
          data={this.handleGetData('CUSTOM_ADDRESS')}
          errors={this.state.errors.CUSTOM_ADDRESS}
          isEdited={this.state.isEdited}
          EMP_MGMT_HOUSE_TYPE={this.props.empMgmtStaticData.EMP_MGMT_HOUSE_TYPE}
        />
      </div>
    );
  }
}

export default EmpAddress;
