import React, { Component } from 'react';
import styles from './InfoCard.module.scss';
import cx from 'classnames';
import _ from 'lodash';
import { withRouter } from 'react-router';
import { NavLink } from "react-router-dom";
import { Button } from 'react-crux';
import TerminationCard from '../TerminationCard/TerminationCard';
import * as fieldData from './InfoCardInitData';
import { connect } from 'react-redux';
import * as actions from '../Store/action';
////Icons
import profilePic from "../../../../../assets/icons/profilepic.svg";
import phone from '../../../../../assets/icons/phone.svg';
import location from '../../../../../assets/icons/locationIcon.svg';
// import fb from '../../../../../assets/icons/fb.svg';
// import twitter from '../../../../../assets/icons/twitter.svg';
// import linkedin from '../../../../../assets/icons/linkedin.svg';
// import insta from '../../../../../assets/icons/instagram.svg';
import email from '../../../../../assets/icons/email.svg';
import terminateIcon from '../../../../../assets/icons/terminate.svg';
import hiredIcon from '../../../../../assets/icons/greenTick.svg';
import prehiredIcon from '../../../../../assets/icons/loading.svg';
import warning from '../../../../../assets/icons/warningMedium.svg';
import * as imageStoreActions from "../../../../Home/Store/action";


import { withTranslation } from 'react-i18next';


class InfoCard extends Component {

  state = {
    data: _.cloneDeep(fieldData.InitData),
    terminatePopup: false,
    empId: '',
    sameOrg: '',
    entityList: '',
    status: '',
    isActive: '',
    location: '',
    role: '',
    contactNo: '',
    email: '',
    statusIcon: null,
    terminationData: ''


  }
  // let empId = 'lgkgjg';
  // const IconObject = {
  //   facebook: fb,
  //   twitter: twitter,
  //   linkedIn: linkedin,
  //   instagram: insta
  // }

  toggleTerminate = () => {
    let currentPopupState = this.state.terminatePopup;
    this.setState({ terminatePopup: !currentPopupState })
  }


  handleDataSet = () => {
    let updatedPropsData = _.cloneDeep(this.props.data)
    let entityList = []; let sameOrg = false; let terminationData = [];

    if (!_.isEmpty(this.props.data)) {
      if (!_.isEmpty(this.props.data.orgId)) {
        sameOrg = true;
      }
      updatedPropsData.sameOrg = sameOrg;
      this.props.saveEntityData(updatedPropsData);
      terminationData.push(updatedPropsData);


      let updatedData = _.cloneDeep(fieldData.InitData);
      _.forEach(updatedData, function (value, key) {
        updatedData[key] = !_.isEmpty(updatedPropsData[key]) ? updatedPropsData[key] : value
      })

      entityList.push(updatedPropsData.uuid);

      ///location & role set
      let location = ''; let role = '';
      _.forEach(updatedPropsData.tags, function (value, index) {
        if (value.category === 'geographical') { location = value.name }
        else if (value.category === 'functional') { role = value.name }
      })

      /////Contact & email set
      let phone = ''; let email = '';
      _.forEach(updatedPropsData.contacts, function (value, key) {
        if (value.type === 'EMAIL') { email = value.contact; }
        else if (value.type === 'MOBILE') { phone = value.contact; }
      })



      this.setState({
        sameOrg: sameOrg,
        data: updatedData,
        empId: updatedPropsData.uuid,
        entityList: entityList,
        status: updatedPropsData.status,
        isActive: updatedPropsData.isActive,
        location: location,
        role: role,
        contactNo: phone,
        email: email,
        terminationData: terminationData
      })
    }
  }

  componentDidMount() {
    if (this.props.profilePicUrl) {
      this.props.onGetProfilePic(this.state.empId, this.props.data.profilePicUrl);
    }
    this.handleDataSet();
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.data !== prevProps.data) {
      this.handleDataSet();
    }
    if (this.props.terminationState !== prevProps.terminationState && this.props.terminationState === 'SUCCESS') {
      this.setState({
        status: "TERMINATED", //this.props.terminateResponseData.status,  ///// need to check
        isActive: this.props.terminateResponseData.isActive
      })
    }
  }

  handleStatusIcon = () => {
    const status = this.state.status;
    if (status === 'HIRED') return hiredIcon;
    else if (status === 'PRE_HIRED') return prehiredIcon;
    else return terminateIcon;
  }


  getAge = (date) => {
    let age = "";
    if (!_.isEmpty(date)) {
      var today = new Date();
      var birthDate = new Date(date);
      age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age = age - 1;
      }
    }
    return age;
  }


  render() {

    const { data } = this.props;
    const { t } = this.props;
    const { match } = this.props;
    const orgId = match.params.uuid;

    return (
      <React.Fragment>
        <div>
          <div className={cx("card-body mb-4 pb-4 mt-4 pt-4 d-flex flex-row", styles.HeadCard)}>
            <div className="col-2 ml-1 pt-3">
              {data.profilePicUrl ?
                <img className={styles.icon} src={data.profilePicUrl ? (this.props.images[this.state.empId] ?
                  this.props.images[this.state.empId]['image'] : null)
                  : null
                }
                  alt='profile pic'
                />
                // {process.env.REACT_APP_CUSTOMER_MGMT_API_URL + '/' + data.profilePicUrl} alt={t('translation_empTermination:image_alt_empTermination.icon')} />
                :
                <img src={profilePic} alt={t('translation_empTermination:image_alt_empTermination.img')} />}
              {this.state.sameOrg === true ?
                <NavLink to={`/customer-mgmt/org/${this.state.data.orgId}/employee/${this.state.empId}/profile`} >
                  <div className={cx(styles.smallButton, 'mt-3 mr-2')}>
                    <label className={cx(styles.smallLabel)}>
                      {t('translation_empTermination:view')}
                    </label>
                  </div>
                </NavLink> : ''}
            </div>

            <div className="ml-4 pt-3 pb-4 flex-column">
              <label className={styles.orgHeading}>
                {data.firstName}&nbsp;
                {!_.isEmpty(data.lastName) ? data.lastName : ''}
                <hr className={cx(styles.verticalLine, "ml-2")} />&nbsp;
                {!_.isEmpty(data.dob)? this.getAge(data.dob):""}&nbsp;
                {data.gender}
              </label>

              {this.state.sameOrg === true ?
                <React.Fragment>
                  <div className={cx(styles.tagText, "pl-0")}>
                    {this.state.role + ' @ '}
                    {data.orgName}
                    {data.employeeId ? <hr className={styles.verticalLine} /> : ''}
                    &nbsp;{data.employeeId}
                  </div>
                  {!_.isEmpty(this.state.status) ?
                    <div className={cx('d-flex mt-1', styles.hireContainer)}>
                      <img className={styles.statusIcon} src={this.handleStatusIcon()} alt='' />
                      <label className={styles.statusText}>{this.state.status.toLowerCase().replace(/_/g, "-")}</label>
                      {/* <hr className={cx(styles.statusVerticleLine)} /> */}
                      {/* <label className={styles.roleText}>contract-business executive</label> */}

                    </div> : null}
                  {/* <small className={cx(styles.tagSecondaryText, "pl-0")}>
                    ex - 'security guard' @ 'SIS India'
                    </small> */}
                  {!_.isEmpty(this.state.location) ?
                    <div className={cx(styles.tagText, "pl-0 ")}>
                      <img src={location} alt={t('translation_empTermination:image_alt_empTermination.location')} className="pr-2" />{this.state.location}
                    </div> : ''}
                  {!_.isEmpty(this.state.contactNo) ?
                    <div className={cx(styles.tagText, "pl-0")}>
                      <img src={phone} alt={t('translation_empTermination:image_alt_empTermination.phone')} className="pr-2" />{this.state.contactNo}
                    </div> : ''}
                  {!_.isEmpty(this.state.email) ?
                    <div className={cx(styles.tagText, "pl-0")}>
                      <img src={email} alt={t('translation_empTermination:image_alt_empTermination.phone')} className="pr-2" />{this.state.email}
                    </div> : ''}
                </React.Fragment>
                :


                <React.Fragment>
                  {!_.isEmpty(this.state.location) ?
                    <div className={cx(styles.tagText, "pl-0 ")}>
                      <img src={location} alt={t('translation_empTermination:image_alt_empTermination.location')} className="pr-2" />{this.state.location}
                    </div> : ''}
                  {!_.isEmpty(this.state.contactNo) ?
                    <div className={cx(styles.tagText, "pl-0")}>
                      <img src={phone} alt={t('translation_empTermination:image_alt_empTermination.phone')} className="pr-2" />{this.state.contactNo}
                    </div> : ''}
                  {!_.isEmpty(this.state.email) ?
                    <div className={cx(styles.tagText, "pl-0")}>
                      <img src={email} alt={t('translation_empTermination:image_alt_empTermination.phone')} className="pr-2" />{this.state.email}
                    </div> : ''}
                </React.Fragment>}


              {/* {!_.isEmpty(this.this.this.props.socialList)?
                this.this.this.props.socialList.map((social,index)=>{
                  return(
                  <span key={index}> 
                    <a href={social.profileUrl} rel="noopener noreferrer" target="_blank" style={{textDecoration: 'none'}} >&nbsp;  
                      <img src={IconObject[social.platform]} alt={t('translation_empTermination:image_alt_empTermination.img')} className=" ml-1"/>
                    </a>
                  </span>) 
                }) : null } */}

            </div>

            <div className={styles.ButtonContainer}>

              {this.state.sameOrg === true ?
                this.state.isActive === true ?
                  <Button
                    type='custom'
                    label={t('translation_empTermination:infoCardButtons_empTermination.terminate')}
                    icon1={warning}
                    className={styles.terminateButton}
                    clickHandler={this.toggleTerminate}
                  />

                  :
                  <NavLink to={'/customer-mgmt/org/' + orgId + '/employee/onboard/addnew'}>
                    <Button
                      type='mediumWithArrow'
                      label={t('translation_empTermination:infoCardButtons_empTermination.onboard')}
                      className={styles.OnboardButton}
                    />
                  </NavLink>

                :
                <NavLink to={'/customer-mgmt/org/' + orgId + '/employee/onboard/addnew'}>
                  <Button
                    type='mediumWithArrow'
                    label={t('translation_empTermination:infoCardButtons_empTermination.onboard')}
                    className={styles.OnboardButton}
                  />
                </NavLink>
              }



            </div>

            {this.state.terminatePopup === true ?
              <TerminationCard
                toggle={this.toggleTerminate}
                selectedEmployees={this.state.entityList}
                employeeList={this.state.terminationData}
                entityData={this.props.entityData}
              />
              : null}

          </div>
        </div>
      </React.Fragment >



    );
  }


}

const mapStateToProps = (state) => {
  return {
    entityData: state.empMgmt.empAddNew.entityData,
    terminationState: state.empMgmt.empTermination.entityTerminateState,
    terminateResponseData: state.empMgmt.empTermination.terminateResponseData,
    images: state.imageStore.images
  }

}

const mapDispatchToProps = (dispatch) => {
  return {
    saveEntityData: (data) => dispatch(actions.saveEntityData(data)),
    onGetProfilePic: (empId, filePath) => dispatch(imageStoreActions.getProfilePic(empId, filePath)),
  }
}

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(InfoCard)));