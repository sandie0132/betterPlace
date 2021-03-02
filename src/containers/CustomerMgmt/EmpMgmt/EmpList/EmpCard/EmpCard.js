/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { VendorIcon } from 'react-crux';
import _ from 'lodash';
import styles from './EmpCard.module.scss';
import ProfilePicStatus from '../../../../../components/Organism/ProfilePicStatus/ProfilePicStatus';
import defaultRole from '../../../../../assets/icons/defaultRole.svg';
import * as imageStoreActions from '../../../../Home/Store/action';
import CheckBox from '../../../../../components/Atom/CheckBox/CheckBox';

class EmployeeCard extends Component {
  componentDidMount() {
    const { profilePicUrl, onGetProfilePic, empId } = this.props;
    if (profilePicUrl) {
      onGetProfilePic(empId, profilePicUrl);
    }
  }

    shortenName = (displayName) => {
      // let n = type === 'role' ? 15 : 9;

      if (displayName.length > 20) {
        const updatedDisplayName = `${displayName.substring(0, 20)}...`;
        return (updatedDisplayName);
      }
      return (displayName);
    }

    checkEmpActive = () => {
      const { isActive } = this.props;
      const active = isActive;
      if (active != null) {
        return active;
      }
      return true;
    }

    handleToolTipText = (source, origin, deployed) => {
      let hierarchy = '';
      const grp = [];
      if (!_.isEmpty(source) && !_.isEmpty(origin)) {
        if (source === origin) {
          hierarchy += `${source} > `;
        } else if (source !== origin) {
          hierarchy += `${origin} > ${source} > `;
        }
      }
      hierarchy += 'my org';
      if (!_.isEmpty(deployed)) {
        deployed.forEach((dep) => {
          if (!_.isEmpty(dep)) {
            if (!_.isEmpty(dep.clientName)) {
              hierarchy += ` > ${dep.clientName}`;
            }
            if (!_.isEmpty(dep.superClientName)) {
              hierarchy += ` > ${dep.superClientName}`;
            }
          }
          grp.push(hierarchy);
        });
      }
      // need to update for multiple deployment
      const tooltipContent = (
        <div>
          <div className="row no-gutters">
            <span className={cx(styles.SelectAll)}>{hierarchy}</span>
          </div>
        </div>
      );
      return tooltipContent;
    }

    render() {
      const {
        empId, url, location, orgData, value, id, profilePicUrl, images, index, serviceStatus, isActive, name, employeeId, sourceOrg, originOrg, deployedTo,
        deplength, tag, handleSelectedEmployees,
      } = this.props;
      const differentiator = url.split('/').pop();

      return (
        <div className="col-4 py-2 pl-0" style={{ backgroundColor: '#F4F7FB' }}>
          <div className={cx(styles.cardLink, 'card card-body px-0 pb-0 pt-1', value && !this.checkEmpActive() ? styles.cardActive : null)}>
            {isActive ? null : <div className={styles.redCard} />}
            <div className={cx(styles.alignCheckBox, 'row py-2 pl-2')}>
              <Link
                className={styles.Decoration}
                to={{
                  pathname: url,
                  state: { prevPath: location.pathname, label: orgData ? `${orgData.nameInLowerCase} / all employees` : 'all employees' },
                }}
              >
                <div className={cx(styles.pic, 'ml-3 pl-0 mr-2', this.checkEmpActive() ? null : styles.opacity)}>
                  <ProfilePicStatus
                    id={id}
                    src={profilePicUrl ? (images[empId]
                      ? images[empId].image : null)
                      : null}
                    index={index}
                    type="small"
                    serviceStatus={serviceStatus}
                    isActive={isActive != null ? isActive : null}
                  />
                </div>
                <div className={cx('col-5 px-0', this.checkEmpActive() ? null : styles.opacity)}>
                  <div className={cx(styles.name, 'd-flex flex-column', this.checkEmpActive() ? null : styles.opacity)}>
                    <label className={styles.nameDot} aria-hidden htmlFor="true">{name}</label>
                    {/* <br /> */}
                    <div className={cx(styles.VendorTooltip, 'd-flex flex-row')}>
                      <label className={cx(styles.id)} aria-hidden htmlFor="true" style={{ paddingTop: '2px' }}>{employeeId}</label>
                      <VendorIcon
                        id={id}
                        deployedTo={deployedTo}
                        sourceOrg={sourceOrg}
                        originOrg={originOrg}
                        deplength={deplength}
                      />
                    </div>
                    {tag
                      ? (
                        <span className={cx(styles.id, styles.overflow, 'row no-gutters')}>
                          {/* <span className='row no-gutters' style={{ width: '52%' }}> */}
                          <img src={defaultRole} alt="" />
                          <p className="my-0 ml-1">{this.shortenName(tag)}</p>
                          {/* </span> */}

                          {/* {this.props.locationTag ?
                                                <span className='row no-gutters'>
                                                    <img src={address} alt='' />
                                                    <p className='my-0 ml-1'>
                                                    {this.shortenName(this.props.locationTag, 'location')}
                                                    </p>
                                                </span> : ''} */}

                        </span>
                      ) : ''}
                  </div>
                </div>
              </Link>

              {differentiator === 'profile' ? (
                <div className={styles.checkBx}>

                  <CheckBox
                    type="smallBlue"
                    value={value}
                    name={index}
                    onChange={(e) => handleSelectedEmployees(false, true, index, e.target.checked)}
                  />

                </div>
              )
                : null}
            </div>
          </div>
        </div>
      );
    }
}

const mapStateToProps = (state) => ({
  initiateBgvState: state.empMgmt.empList.initiateBgvState,
  orgData: state.empMgmt.empList.orgData,
  images: state.imageStore.images,
});

const mapDispatchToProps = (dispatch) => ({
  onGetProfilePic: (empId, filePath) => dispatch(imageStoreActions.getProfilePic(empId, filePath)),
});
export default (withRouter(connect(mapStateToProps, mapDispatchToProps)(EmployeeCard)));
