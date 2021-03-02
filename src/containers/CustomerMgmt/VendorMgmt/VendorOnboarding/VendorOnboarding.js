/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-shadow */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-did-update-set-state */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { Button } from 'react-crux';

import _ from 'lodash';
import cx from 'classnames';
import styles from './VendorOnboarding.module.scss';
import scrollStyle from '../../../../components/Atom/ScrollBar/ScrollBar.module.scss';

import Modal from '../../../../components/Atom/Modal/Modal';
import Loader from '../../../../components/Organism/Loader/Loader';

// import idCard from '../../../../assets/icons/idCard.svg';
import close from '../../../../assets/icons/closePage.svg';
import vendorOnboard from '../../../../assets/icons/vendorOnboard.svg';
// import idCard from '../../../../assets/icons/idCard.svg';
import panCard from '../../../../assets/icons/panCard.svg';
import llpinCard from '../../../../assets/icons/llpinCard.svg';
import gstCard from '../../../../assets/icons/gstCard.svg';
import tinCard from '../../../../assets/icons/tinCard.svg';
import cinCard from '../../../../assets/icons/cinCard.svg';
import emptyPage from '../../../../assets/icons/emptyVendorState.svg';
import warning from '../../../../assets/icons/errorWarning.svg';

import * as actions from './Store/action';
import HasAccess from '../../../../services/HasAccess/HasAccess';

class VendorOnboarding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idValue: '',
      idState: null,
      idImage: vendorOnboard,
      showModal: false,
      enableNext: false,
      errorState: '',
      focus: false,
      showVendors: true,
      vendorSearchResults: [],
      selectedVendor: {},
    };
  }

  componentDidMount = () => {
    const {
      getDocNumber, getDocType, showModal, vendorData,
    } = this.props;

    this.setState({
      idValue: getDocNumber,
      selectedVendor: vendorData,
      idState: getDocType,
      idImage: vendorOnboard,
      showModal,
      enableNext: true,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      match, orgCheck, vendorData, searchVendorState, vendorSearchResults,
      // getDocNumber, getDocType,
    } = this.props;

    const orgId = match.params.uuid;
    if (orgCheck !== prevProps.orgCheck && orgCheck === 'SUCCESS') {
      let redirectUrl = '/';
      let errorMsg = '';
      if (this.state.idState === 'VENDOR') {
        errorMsg = 'no vendor found matching the search criteria. please contact Superadmin in case of any issue';
      } else {
        errorMsg = 'no vendor found registered with the given ID. contact Superadmin in case of any issue';
      }
      if (_.isEmpty(vendorData)) {
        this.setState({ showModal: true, errorState: errorMsg });
      } else {
        redirectUrl = `/customer-mgmt/org/${orgId}/vendor-mgmt/vendor/add`;
        this.props.history.push(redirectUrl);
      }
      this.props.onClearOrgData();
    }

    if (prevState.showModal !== this.state.showModal) {
      if (!this.state.showModal) {
        this.props.onGetInitState();
      }
    }

    // let idImage = vendorOnboard;
    // if (prevProps.getDocNumber !== getDocNumber) {
    //   console.log("did update issues", getDocNumber)
    //   if (getDocNumber) {
    //     idImage = vendorOnboard;
    //   }
    //   this.setState({
    //     idImage,
    //     idValue: getDocNumber,
    //     idState: getDocType,
    //     enableNext: true,
    //   });
    // }

    if (prevState.idValue !== this.state.idValue
      && (_.isEmpty(this.state.idValue) || !_.isEmpty(this.state.idValue))) {
      this.setState({ errorState: '' });
    }
    if (prevProps.searchVendorState !== searchVendorState && searchVendorState === 'SUCCESS') {
      this.setState({ vendorSearchResults });
    }
  }

  handleInput = (event) => {
    const { match } = this.props;
    const orgId = match.params.uuid;

    let value = this.state.idValue;
    let idState = null;
    let idImage = vendorOnboard;
    let isVendor = false;
    const pan = /^[a-zA-Z]{3}[PHABCGJLFT]{1}[a-zA-Z]{1}\d{4}[a-zA-Z]{1}$/;
    const gstin = /^\d{2}[a-zA-Z]{5}\d{4}[a-zA-Z]{1}\d{1}[a-zA-Z]{1}\d{1}$/;
    const cin = /^[a-zA-Z]{1}\d{5}[a-zA-Z]{2}\d{4}[a-zA-Z]{3}\d{6}$/;
    const llpin = /^[a-zA-Z]{3}\d{4}$/; //   /^[a-zA-Z]{3}\-\d{4}$/;
    const tan = /^[a-zA-Z]{4}\d{5}[a-zA-Z]{1}$/;

    if (pan.test(event.target.value)) {
      idState = 'PAN';
      idImage = panCard;
    } else if (gstin.test(event.target.value)) {
      idState = 'GST';
      idImage = gstCard;
    } else if (cin.test(event.target.value)) {
      idState = 'CIN';
      idImage = cinCard;
    } else if (llpin.test(event.target.value)) {
      idState = 'LLPIN';
      idImage = llpinCard;
    } else if (tan.test(event.target.value)) {
      idState = 'TAN';
      idImage = tinCard;
    } else {
      idImage = vendorOnboard;
      isVendor = true;
      idState = 'VENDOR';
    }

    value = event.target.value.toUpperCase();

    if (isVendor && !_.isEmpty(value)) {
      this.props.onSearchVendor(value.toLowerCase(), orgId);
    }
    if (!_.isEmpty(value) && idState !== null) {
      this.setState({ enableNext: true });
    } else {
      this.setState({ enableNext: false });
    }

    this.setState({
      idValue: value, idState, idImage, selectedVendor: '', showVendors: isVendor,
    });
  }

  handleButtonNext = (event) => {
    const {
      idValue, idState, idImage, selectedVendor,
    } = this.state;
    event.preventDefault();
    if (idState !== 'VENDOR') {
      this.props.onCheckOrg(idValue, idState, idImage);
    } else {
      this.props.onAddOrgData(selectedVendor);
    }
    // this.props.setOrgId(idValue, idState, idImage);
  }

  toggleForm = () => {
    this.setState({
      showModal: !this.state.showModal,
      idValue: '',
      idImage: vendorOnboard,
      idState: null,
      errorState: '',
      enableNext: false,
    });
  }

  onFocus = () => {
    this.setState({ focus: true });
  }

  onBlur = () => {
    this.setState({ focus: false });
  }

  handleSelectedVendor = (vendor) => {
    this.setState({
      idValue: vendor.name, showVendors: false, selectedVendor: vendor, enableNext: true,
    });
  }

  render() {
    const {
      t, match, main, type, orgData, orgCheck, emptySearchResult, searchKey,
    } = this.props;
    const orgId = match.params.uuid;
    // let vendorIdArray = [];
    // _.forEach(this.props.vendorListData, function (vendor) {
    //     vendorIdArray.push(vendor.orgId);
    // })

    const searchResults = [];
    if (!_.isEmpty(this.state.vendorSearchResults)) {
      const thisRef = this;
      const key = !_.isEmpty(this.state.idValue) ? this.state.idValue.toLowerCase() : '';
      _.forEach(this.state.vendorSearchResults, (vendor, index) => {
        let vendorName = vendor.nameInLowerCase;
        const list = [];
        const text = vendorName.split(new RegExp(key), 1)[0];
        list.push(text);
        const match = vendorName.match(new RegExp(key));
        if (match) {
          list.push(match[0]);
          vendorName = vendorName.substring(match.index + match[0].length);
          list.push(vendorName);
        }

        searchResults.push(
          <div
            key={vendor.uuid}
            className={styles.padding}
            onClick={() => thisRef.handleSelectedVendor(vendor)}
          >
            {list.map((elem, i) => (i % 2 === 0
              ? (
                <span key={index + i} className={styles.vendorName}>
                  {elem}
                </span>
              )
              : (
                <span key={index + i} className={cx(styles.vendorName, styles.highlight)}>
                  {elem}
                </span>
              )))}
            <hr className={styles.horizontalLine} />
          </div>,
        );
      });
    }

    return (
      <>
        {main
          ? (
            <div className={cx('d-flex flex-column p-0 text-center')}>

              {type === 'vendors'
                ? (
                  <>
                    <img className={styles.noVendorImg} src={emptyPage} alt="" />
                    <span className={styles.Info} style={{ marginTop: '1.5rem' }}>
                      {emptySearchResult
                        ? `${t('translation_vendorOnboarding:emptySearch') + type
                          + t('translation_vendorOnboarding:named') + searchKey
                          + t('translation_vendorOnboarding:added') + (orgData ? orgData.nameInLowerCase : 'org_name')}`
                        : `${t('translation_vendorOnboarding:noVendorMsg1') + (orgData ? orgData.nameInLowerCase : 'org_name')}.`}
                    </span>
                    <HasAccess
                      permission={['VENDOR:ADD']}
                      orgId={orgId}
                      yes={() => (
                        <>
                          <span className={styles.Info} style={{ marginBottom: '1rem' }}>
                            {t('translation_vendorOnboarding:noVendorMsg2')}
                          </span>

                          <Button
                            label={t('translation_vendorOnboarding:button_vendorOnboarding.select')}
                            type="add"
                            clickHandler={this.toggleForm}
                            className={styles.Button}
                          />
                        </>
                      )}
                    />
                  </>
                )
                : type === 'clients'
                  ? (
                    <>
                      <img className={styles.noVendorImg} src={emptyPage} alt="" />
                      <span className={styles.Info} style={{ marginTop: '1.5rem' }}>
                        {emptySearchResult
                          ? `${t('translation_vendorOnboarding:emptySearch') + type
                            + t('translation_vendorOnboarding:named') + searchKey
                            + t('translation_vendorOnboarding:added') + (orgData ? orgData.nameInLowerCase : 'company')}`
                          : `${t('translation_vendorOnboarding:noClientMsg1') + (orgData ? orgData.nameInLowerCase : 'company')}.`}
                      </span>
                      <span className={styles.Info} style={{ marginBottom: '1rem' }}>
                        {t('translation_vendorOnboarding:noClientMsg2')
                          + (orgData ? orgData.nameInLowerCase : 'company ')
                          + t('translation_vendorOnboarding:noClientMsg3')}
                      </span>
                    </>
                  )
                  : type === 'insights'
                    ? (
                      <>
                        <img className={styles.noVendorImg} src={emptyPage} alt="" />
                        <span className={styles.Info} style={{ marginTop: '2rem' }}>
                          {t('translation_vendorOnboarding:noInsightMsg1')}
                        </span>
                        <span className={styles.Info} style={{ marginBottom: '1rem' }}>
                          {t('translation_vendorOnboarding:noInsightMsg2')}
                        </span>
                      </>
                    )
                    : null}
            </div>
          )
          : (
            <div className={styles.topRight}>
              <HasAccess
                permission={['VENDOR:ADD']}
                orgId={orgId}
                yes={() => <Button label={t('translation_vendorOnboarding:button_vendorOnboarding.select')} type="add" clickHandler={this.toggleForm} className={styles.Button} />}
                no={() => <div className={styles.Button} />} // rightnav spacing adjusted
              />
            </div>
          )}
        <Modal show={this.state.showModal} className={styles.ModalPage}>
          <div className={styles.ModalForm}>
            <img src={close} onClick={this.toggleForm} alt={t('translation_vendorOnboarding:image_alt_vendorOnboarding.close')} style={{ cursor: 'pointer' }} />
            <br />
            <img src={this.state.idImage} alt={t('translation_vendorOnboarding:image_alt_vendorOnboarding.IdImage')} className="pt-5" />
            <h4 className="pt-4 mb-0">{t('translation_vendorOnboarding:Heading')}</h4>
            <span><small>{t('translation_vendorOnboarding:smallHeading')}</small></span>
            <form>
              <div className={styles.position}>
                <div className={cx(this.state.focus ? styles.InputPlace : styles.InputPlaceBlur, styles.position, 'row col-5 mx-auto mt-4')}>
                  <input
                    type="text"
                    placeholder={t('translation_vendorOnboarding:placeholder')}
                    value={this.state.idValue}
                    onChange={(event) => this.handleInput(event)}
                    className={cx(styles.InputText, 'ml-1 px-6 row')}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                  />
                  {!_.isEmpty(this.state.idValue)
                    ? (
                      <span className={this.state.idState ? cx(styles.InputId, 'offset-10 mt-1') : null}>
                        {this.state.idState}
                      </span>
                    ) : null}
                  {!_.isEmpty(this.state.idValue) && this.state.showVendors
                    ? (
                      <div className={cx(styles.vendorResults, scrollStyle.scrollbar)}>
                        {searchResults}
                      </div>
                    )
                    : ''}
                </div>
                <div className="row justify-content-center mt-1">
                  {this.state.errorState !== '' ? <img src={warning} height="15px" alt={t('translation_vendorOnboarding:image_alt_vendorOnboarding.warning')} /> : ''}
&ensp;
                  <label className={styles.ErrorMessage}>{this.state.errorState}</label>
                </div>

                {orgCheck === 'LOADING'
                  ? <Loader type="buttonLoader" />
                  : (
                    <Button
                      className="mt-2 ml-2"
                      isDisabled={!this.state.enableNext}
                      label={t('translation_vendorOnboarding:button_vendorOnboarding.next')}
                      clickHandler={(event) => this.handleButtonNext(event)}
                      type="largeWithArrow"
                    />
                  )}
              </div>
            </form>
          </div>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  getDocType: state.vendorMgmt.vendorOnboarding.docType,
  getDocNumber: state.vendorMgmt.vendorOnboarding.docNumber,
  getDocCard: state.vendorMgmt.vendorOnboarding.docCard,
  vendorData: state.vendorMgmt.vendorOnboarding.orgData,
  showModal: state.vendorMgmt.vendorOnboarding.showModal,
  orgCheck: state.vendorMgmt.vendorOnboarding.orgCheck,
  searchVendorState: state.vendorMgmt.vendorOnboarding.searchVendorState,
  vendorSearchResults: state.vendorMgmt.vendorOnboarding.vendorSearchResults,
  error: state.vendorMgmt.vendorOnboarding.error,
  vendorListData: state.vendorMgmt.vendorList.vendorList,
  getVendorListState: state.vendorMgmt.vendorList.getVendorListState,
  orgData: state.orgMgmt.staticData.orgData,
});

const mapDispatchToProps = (dispatch) => ({
  onGetInitState: () => dispatch(actions.initState()),
  // setOrgId: (idValue, idState, idImage) => dispatch(
  //   actions.getOrgData(idValue, idState, idImage)
  //   ),
  onCheckOrg: (idValue, idState, idImage) => dispatch(actions.checkOrg(idValue, idState, idImage)),
  onSearchVendor: _.debounce((key, orgId) => dispatch(
    actions.searchVendor(key, orgId),
  ), 500, { trailing: true }),
  onAddOrgData: (org) => dispatch(actions.addOrgData(org)),
  onClearOrgData: () => dispatch(actions.clearOrg()),
});

export default withTranslation()(withRouter(
  connect(mapStateToProps, mapDispatchToProps)(VendorOnboarding),
));
