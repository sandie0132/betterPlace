import React, { Component } from "react";
import { NavLink, Redirect } from "react-router-dom";
import { AuthConsumer } from "../../../../services/authContext";
import styles from "./EmpMgmtLeftNav.module.scss";
import HasAccess from '../../../../services/HasAccess/HasAccess';
// import ensure from "../../../../assets/icons/ensure.svg";
import onboard from "../../../../assets/icons/onboard.svg";
import verify from "../../../../assets/icons/verify.svg";
// import attendance from "../../../../assets/icons/attendance.svg";
// import salary from "../../../../assets/icons/payroll.svg";
// import ensureActive from "../../../../assets/icons/ensureActive.svg";
import onboardActive from "../../../../assets/icons/onboardActive.svg";
import verifyActive from "../../../../assets/icons/verifyActive.svg";
// import attendanceActive from "../../../../assets/icons/attendanceActive.svg";
// import salaryActive from "../../../../assets/icons/salaryActive.svg";
import profileIcon from "../../../../assets/icons/leftNavProfile.svg";
import employee from "../../../../assets/icons/employees.svg";
import profileMenu from "../../../../assets/icons/profileMenu.svg";
import leftNavProfileArrowActive from "../../../../assets/icons/leftNavProfileArrowActive.svg";
import leftNavProfileArrowInactive from "../../../../assets/icons/leftNavProfileArrowInactive.svg";
// import hire from "../../../../assets/icons/hire.svg";
// import train from "../../../../assets/icons/train.svg";
// import support from "../../../../assets/icons/support.svg";
// import accountSettings from "../../../../assets/icons/accSettingsIcon.svg";
// import threeDots from "../../../../assets/icons/threeDots.svg";
import logoutIcon from "../../../../assets/icons/logoutIcon.svg";
import cx from "classnames";
import _ from "lodash";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import * as imageStoreActions from "../../../Home/Store/action";

class EmployeeMgmtLeftNav extends Component {
  state = {
    openMenu: false,
    showProfile: false
  };

  componentDidUpdate(prevProps) {
    if (prevProps.userProfile !== this.props.userProfile) {
      if (this.props.getUserProfileDataState === 'SUCCESS') {
        if (this.props.userProfile.empId && this.props.userProfile.profilePicUrl) {
          this.props.onGetProfilePic(this.props.userProfile.empId,
            this.props.userProfile.profilePicUrl)
        }
      }
    }
  }

  handleClick = (event, showProfile) => {
    if (event) {
      event.preventDefault();
    }
    if (!this.state.openMenu) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }
    let updatedShowProfile = false;
    if (showProfile) {
      updatedShowProfile = true;
    }
    this.setState(prevState => ({
      openMenu: !prevState.openMenu,
      showProfile: updatedShowProfile
    }));
  };

  handleOutsideClick = e => {
    if (!_.isEmpty(this.node)) {
      if (this.node.contains(e.target)) { return; }
      this.handleClick();
    }
  };

  handleHover = (value) => {
    this.setState({ openMenu: value })
  }

  render() {
    const { t } = this.props;
    const orgId = this.props.userProfile.orgId;
    // const empId = this.props.user.empId;
    const userId = this.props.user.userId;

    return (
      <div className="d-flex">
        {this.state.showProfile ? (
          <Redirect to={"/user/" + userId} />
        ) : null}
        <div className={cx(styles.Space)}>
          <div>
            <HasAccess
              permission={["ONBOARD:DASHBOARD"]}
              orgId={orgId}
              yes={() => (
                <div className={cx(styles.Nav_Link)}>
                  <NavLink
                    to={"/customer-mgmt/org/" + orgId + "/dashboard/onboard/insights?duration=all_time"}
                    className={styles.NavLinkfont}
                    activeClassName={styles.NavLinkfontActive}
                    isActive={(match, location) => {
                      if (!match) {
                        return false;
                      }
                      return location.pathname.includes("/");
                    }}
                  >
                    <span className={styles.svg}>
                      <img style={{ paddingRight: '0.5px' }}
                        src={this.props.location.pathname.includes('onboard') ? onboardActive : onboard}
                        alt={t("translation_empMgmtLeftNav:image_alt_empMgmtLeftNav.img")}
                      />
                      <span className={styles.NavHead}>
                        &nbsp;{" "}
                        {t("translation_empMgmtLeftNav:label_empMgmtLeftNav.onboard")}
                        {" "}
                      </span>
                    </span>
                  </NavLink>
                </div>
              )}
            />

            <HasAccess
              permission={["BGV:DASHBOARD"]}
              orgId={orgId}
              yes={() => (
                <div className={cx(styles.Nav_Link)}>
                  <NavLink
                    to={"/customer-mgmt/org/" + orgId + "/dashboard/verify?filter=insights&duration=all_time"}
                    className={styles.NavLinkfont}
                    activeClassName={styles.NavLinkfontActive}
                    isActive={(match, location) => {
                      if (!match) {
                        return false;
                      }
                      return location.pathname.includes("/customer-mgmt/org/");
                    }}
                  >
                    <span className={styles.svg}>
                      <img style={{ paddingLeft: '5px', paddingRight: '1.5px' }}
                        src={this.props.location.pathname.includes('verify') ? verifyActive : verify}
                        alt={t("translation_empMgmtLeftNav:image_alt_empMgmtLeftNav.img")}
                      />
                      <span className={styles.NavHead}>
                        &nbsp;{" "}
                        {t("translation_empMgmtLeftNav:label_empMgmtLeftNav.verify")}
                        {"   "}
                      </span>
                    </span>
                  </NavLink>
                </div>
              )}
            />
            {/* <div className={styles.Nav_Link}>
              <NavLink
                to={
                  "/attend"
                } //forTestingPurposes
                className={styles.NavLinkfont}
                activeClassName={styles.NavLinkfontActive}
                isActive={(match, location) => {
                  if (!match) {
                    return false;
                  }
                  return location.pathname.includes("/");
                }}
              >
                <span className={styles.svg}>
                  <img style={{ paddingLeft: '5px', paddingRight: '5px' }}
                    src={this.props.location.pathname.includes('attend') ? attendanceActive : attendance}
                    alt={t("translation_empMgmtLeftNav:image_alt_empMgmtLeftNav.img")}
                  />
                  <span className={styles.NavHead}>
                    &nbsp;{" "}
                    {t("translation_empMgmtLeftNav:label_empMgmtLeftNav.attend")}
                    {"   "}
                  </span>
                </span>
              </NavLink>
            </div> */}

            {/* <div className={cx(styles.Nav_Link)}>
              <NavLink
                to={"salary"}
                className={styles.NavLinkfont}
                activeClassName={styles.NavLinkfontActive}
                isActive={(match, location) => {
                  if (!match) {
                    return false;
                  }
                  return location.pathname.includes("/");
                }}
              >
                <span className={styles.svg}>
                  <img style={{ paddingRight: '1.5px' }}
                    src={this.props.location.pathname.includes('salary') ? salaryActive : salary}
                    alt={t("translation_empMgmtLeftNav:image_alt_empMgmtLeftNav.img")}
                  />
                  <span className={styles.NavHead}>
                    &nbsp;{" "}
                    {t("translation_empMgmtLeftNav:label_empMgmtLeftNav.salary")}
                    {"  "}
                  </span>
                </span>
              </NavLink>
            </div> */}

            {/* <div className={cx(styles.Nav_Link)}>
              <NavLink
                to={"/ensure"}
                className={styles.NavLinkfont}
                activeClassName={styles.NavLinkfontActive}
                isActive={(match, location) => {
                  if (!match) {
                    return false;
                  }
                  return location.pathname.includes("/");
                }}
              >
                <span className={styles.svg}>
                  <img style={{ paddingLeft: '5px', paddingRight: '4.5px' }}
                    src={this.props.location.pathname.includes('ensure') ? ensureActive : ensure}
                    alt={t("translation_empMgmtLeftNav:image_alt_empMgmtLeftNav.img")}
                  />
                  <span className={styles.NavHead}>
                    &nbsp;{" "}
                    {t("translation_empMgmtLeftNav:label_empMgmtLeftNav.ensure")}
                    {"  "}
                  </span>
                </span>
              </NavLink>
            </div> */}


          </div>

          {/* Bottom Component */}
          <div className={styles.Bottom} style={{ width: "100%" }}>
            <HasAccess
              permission={["EMP_MGMT:LIST"]}
              orgId={orgId}
              yes={() =>
                <div className={cx(styles.Border)}>
                  <NavLink
                    to={"/customer-mgmt/org/" + orgId + "/employee?isActive=true"}
                    className={styles.NavLinkfont}
                    activeClassName={styles.NavLinkfontActive}
                  >
                    <span className={styles.svg}>
                      <img
                        src={employee}
                        alt={t(
                          "translation_empMgmtLeftNav:image_alt_empMgmtLeftNav.img"
                        )}
                      />
                      <span className={styles.NavHead}>
                        &nbsp;{" "}
                        {t(
                          "translation_empMgmtLeftNav:label_empMgmtLeftNav.employee"
                        )}
                      </span>
                    </span>
                  </NavLink>
                </div>
              } 
            />
            <div className={this.props.location.pathname.includes("user") ? styles.downLinkActive : styles.downLink}
              onMouseEnter={() => this.handleHover(true)} onMouseLeave={() => this.handleHover(false)}>
              <AuthConsumer>
                {({ logout }) => {
                  return (
                    <span
                      ref={node => {
                        this.node = node;
                      }}
                    >
                      <img
                        src={this.props.userProfile.profilePicUrl ? (this.props.images[this.props.userProfile.empId] ?
                          this.props.images[this.props.userProfile.empId]['image'] : profileIcon)
                          : profileIcon
                        }
                        alt={t(
                          "translation_orgMgmtLeftNav:image_alt_orgLeftNav.profile"
                        )}
                        className={this.props.userProfile.profilePicUrl ?
                          (this.props.images[this.props.userProfile.empId] ?
                            styles.ProfileImage : styles.Cursor)
                          : styles.Cursor}
                        onClick={this.handleClick}
                      />
                      <img
                        src={
                          this.state.openMenu ||
                            this.props.location.pathname.includes("user")
                            ? leftNavProfileArrowActive
                            : leftNavProfileArrowInactive
                        }
                        className={styles.icon}
                        alt={t(
                          "translation_orgMgmtLeftNav:image_alt_orgLeftNav.threeDots"
                        )}
                        onClick={this.handleClick}
                      />

                      {this.state.openMenu ?
                        <div className={styles.openMenu}>
                          <div className={cx(styles.ProfileDiv)}>
                            <div className={cx('row mx-auto', styles.Hover)} onClick={(event) => this.handleClick(event, true)}>
                              <div className='col-1'><img src={profileMenu} alt={t('translation_orgMgmtLeftNav:image_alt_orgLeftNav.profile')} /></div>
                              {t('translation_orgMgmtLeftNav:profile')}
                            </div>
                          </div>

                          <div className={cx(styles.LogoutDiv)}>
                            <div className={cx('row mx-auto', styles.Hover)} onClick={() => logout()}>
                              <div className='col-1'><img src={logoutIcon} alt={t('translation_orgMgmtLeftNav:image_alt_orgLeftNav.logout')} /></div>
                              {t('translation_orgMgmtLeftNav:logout')}
                            </div>
                          </div>
                        </div>
                        : // <LogoutMenu/>
                        null}
                    </span>
                  );
                  // </span>
                }}
              </AuthConsumer>
            </div>
          </div>
        </div>
      </div >
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.auth.user,
    userProfile: state.user.userProfile.profile,
    getUserProfileDataState: state.user.userProfile.getUserProfileDataState,
    images: state.imageStore.images
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetProfilePic: (empId, filePath) => dispatch(imageStoreActions.getProfilePic(empId, filePath))
  };
}

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(EmployeeMgmtLeftNav)
);