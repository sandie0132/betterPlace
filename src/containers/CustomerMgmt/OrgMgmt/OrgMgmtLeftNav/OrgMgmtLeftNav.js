import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink, Redirect } from "react-router-dom";
import _ from 'lodash';
import cx from 'classnames';
import { AuthConsumer } from '../../../../services/authContext';
import styles from "./OrgMgmtLeftNav.module.scss";
import todo from '../../../../assets/icons/todo.svg';
import profileIcon from "../../../../assets/icons/leftNavProfile.svg";
import leftNavProfileArrowActive from '../../../../assets/icons/leftNavProfileArrowActive.svg';
import leftNavProfileArrowInactive from '../../../../assets/icons/leftNavProfileArrowInactive.svg';
import starIcon from "../../../../assets/icons/leftNavClients.svg";
import profileMenu from "../../../../assets/icons/profileMenu.svg";
import logoutIcon from "../../../../assets/icons/logoutIcon.svg";
import { withTranslation } from 'react-i18next';
import HasAccess from '../../../../services/HasAccess/HasAccess';
import * as imageStoreActions from "../../../Home/Store/action";

class OrgMgmtLeftNav extends Component {

  state = {
    openMenu: false,
    showProfile: false
  }

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
      document.addEventListener('click', this.handleOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
    }
    let updatedShowProfile = false;
    if (showProfile) {
      updatedShowProfile = true;
    }
    this.setState(prevState => ({
      openMenu: !prevState.openMenu,
      showProfile: updatedShowProfile
    }));
  }

  handleShowAllClients = () => {
    const policies = _.cloneDeep(this.props.policies);
    let orgProfileCount = 0;
    _.forEach(policies, function (policy) {
      if (_.includes(policy.businessFunctions, "ORG_PROFILE:VIEW")) {
        orgProfileCount = orgProfileCount + 1;
      }
      else if (_.includes(policy.businessFunctions, '*')) {
        orgProfileCount = 1;
      }
    })
    if (orgProfileCount !== 0) {
      return true;
    } else {
      return false;
    }
  }

  handleOutsideClick = (e) => {
    if (!_.isEmpty(this.node)) {
      if (this.node.contains(e.target)) {
        return;
      }
      this.handleClick();
    }
  }

  handleHover = (value) => {
    this.setState({ openMenu: value })
  }

  render() {
    const { t } = this.props;
    const userId = this.props.user.userId;

    return (
      <React.Fragment>
        <div>
          {this.state.showProfile ?
            <Redirect to={"/user/" + userId} />
            : null
          }
          <div>
            {
              this.handleShowAllClients() ?
                <div className={cx(styles.Nav_Link)}>
                  <NavLink
                    to={{
                      pathname: "/customer-mgmt/org",
                      search: "?filter=starred"
                    }}
                    activeClassName={styles.NavLinkfontActive}
                    className={cx(styles.NavLinkfont)}
                    isActive={(match, location) => {
                      if (!match) {
                        return false;
                      }
                      return location.pathname.includes("/customer-mgmt/org");
                    }}
                  >
                    <span className={cx(styles.svg)}>
                      <img src={starIcon} alt={t('translation_orgMgmtLeftNav:image_alt_orgLeftNav.starred_active')} />
                      <span className={cx(styles.NavHead)} >&nbsp;{t('translation_orgMgmtLeftNav:span.allClients')}</span>
                    </span>
                  </NavLink>
                </div>
                : null
            }
            <HasAccess
              permission={["OPS:TASK", 'AGENCY_DASHBOARD:VIEW_ALL', 'AGENCY_DASHBOARD:VIEW_ASSIGNED']}
              yes={() =>
                <div className={styles.Nav_Link}>
                  <NavLink
                    to="/workload-mgmt"
                    activeClassName={styles.NavLinkfontActive}
                    isActive={(match, location) => {
                      if (!match) {
                        return false;
                      }
                      return location.pathname.includes("/workload-mgmt");
                    }}
                    className={styles.NavLinkfont}
                  >
                    <span className={styles.svg}>
                      <img src={todo} alt={t('translation_orgMgmtLeftNav:image_alt_orgLeftNav.todo')} />
                      <span className={styles.NavHead}>&nbsp; {t('translation_orgMgmtLeftNav:span.todo')}</span>
                    </span>
                  </NavLink>
                </div>
              }
            />

            {/* <HasAccess
              permission={["*"]}
              yes={() =>
                <div className={styles.Nav_Link}>
                  <NavLink
                    to="/agency/insights"
                    activeClassName={styles.NavLinkfontActive}
                    isActive={(match, location) => {
                      if (!match) {
                        return false;
                      }
                      return location.pathname.includes("/agency/insights");
                    }}
                    className={styles.NavLinkfont}
                  >
                    <span className={styles.svg}>
                      <img src={todo} alt={t('translation_orgMgmtLeftNav:image_alt_orgLeftNav.insights')} />
                      <span className={styles.NavHead}>&nbsp; {t('translation_orgMgmtLeftNav:span.insights')}</span>
                    </span>
                  </NavLink>
                </div>
              }
            /> */}
          </div>
        </div>

        {/*------bottom component-------*/}
        <div className={this.props.location.pathname.includes('user') ? styles.downLinkActive : styles.downLink}
          onMouseEnter={() => this.handleHover(true)} onMouseLeave={() => this.handleHover(false)}>
          <AuthConsumer >
            {
              ({ logout }) => {
                return <span ref={node => { this.node = node; }}>
                  <img
                    src={this.props.userProfile.profilePicUrl ? (this.props.images[this.props.userProfile.empId] ?
                      this.props.images[this.props.userProfile.empId]['image'] : profileIcon)
                      : profileIcon
                    }
                    alt={t('translation_orgMgmtLeftNav:image_alt_orgLeftNav.profile')}
                    className={this.props.userProfile.profilePicUrl ?
                      (this.props.images[this.props.userProfile.empId] ?
                        styles.ProfileImage : styles.Cursor)
                      : styles.Cursor}
                    onClick={this.handleClick}
                  />
                  <img
                    src={this.state.openMenu || this.props.location.pathname.includes('user') ? leftNavProfileArrowActive : leftNavProfileArrowInactive}
                    className={styles.icon}
                    alt={t('translation_orgMgmtLeftNav:image_alt_orgLeftNav.threeDots')}
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
                    // <LogoutMenu/>
                    : null
                  }
                </span>
                // </span>
              }
            }

          </AuthConsumer>
        </div>
      </React.Fragment>

    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    policies: state.auth.policies,
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

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(OrgMgmtLeftNav));
