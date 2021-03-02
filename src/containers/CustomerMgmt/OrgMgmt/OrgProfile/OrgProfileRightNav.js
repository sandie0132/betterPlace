import React, { Component } from 'react';
import RightNavBar from '../../../../components/Organism/Navigation/RightNavBar/RightNavBar';
import styles from "./OrgProfile.module.scss";
import { Link } from "react-router-dom";
import cx from "classnames";
import { withTranslation } from "react-i18next";
import right from "../../../../assets/icons/right.svg";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import HasAccess from '../../../../services/HasAccess/HasAccess';



class OrgProfileRightNav extends Component {
  render() {
    const { t, match } = this.props;
    const orgId = match.params.uuid;
    let RightNavContent =
      <React.Fragment>
        <div >
          <div className="pl-4 ">
            {/* <div onClick={()=>this.toggleSideNav("yes")} className={this.state.viewPanelContent ? styles.closeButton : styles.removeDisplay}>
              <img src={close} alt="close" />
            </div> */}
            <HasAccess
              permission={["ORG_CONTACT:VIEW"]}
              orgId={orgId}
              yes={() => (
                <Link
                  to={"/customer-mgmt/org/" + orgId + "/contact"}
                  className={styles.rightNavContent}
                >
                  <div className={cx("mt-1", styles.rightNavTabs)}>
                    {t('translation_orgProfile:rightNav.l1')}{" "}
                    <span className={styles.AlignRight}>
                      <img src={right} alt={t('translation_orgProfile:image_alt_orgProfile.right')} />
                    </span>
                  </div>
                </Link>
              )}
            />
            <HasAccess
              permission={["ORG_LOC_SITE:VIEW"]}
              orgId={orgId}
              yes={() => (
                <Link
                  to={
                    "/customer-mgmt/org/" +
                    orgId +
                    "/location-sites"
                  }
                  className={styles.rightNavContent}
                >
                  <div className={cx("mt-1", styles.rightNavTabs)}>
                    {t('translation_orgProfile:rightNav.l2')}
                    <span className={styles.AlignRight}>
                      <img src={right} alt={t('translation_orgProfile:image_alt_orgProfile.right')} />
                    </span>
                  </div>
                </Link>)}
            />
            <HasAccess
              permission={["ORG_FUNC_ROLE:VIEW"]}
              orgId={orgId}
              yes={() => (

                <Link
                  to={
                    "/customer-mgmt/org/" +
                    orgId +
                    "/function-role"
                  }
                  className={styles.rightNavContent}
                >
                  <div className={cx("mt-1", styles.rightNavTabs)}>
                    {t('translation_orgProfile:rightNav.l3')}{" "}
                    <span className={styles.AlignRight}>
                      <img src={right} alt={t('translation_orgProfile:image_alt_orgProfile.right')} />
                    </span>
                  </div>
                </Link>
              )}
            />
            <HasAccess
              permission={["ORG_CUST_TAG:VIEW"]}
              orgId={orgId}
              yes={() => (
                <Link
                  to={
                    "/customer-mgmt/org/" +
                    orgId +
                    "/custom-tags"
                  }
                  className={styles.rightNavContent}
                >
                  <div className={cx("mt-1", styles.rightNavTabs)}>
                    {t('translation_orgProfile:rightNav.l5')}
                    <span className={styles.AlignRight}>
                      <img src={right} alt={t('translation_orgProfile:image_alt_orgProfile.right')} />
                    </span>
                  </div>
                </Link>
              )}
            />
            {/* <HasAccess
              permission={["ORG_VENDOR_MGMT:VIEW"]}
              orgId={orgId}
              yes={() => (
                <Link
                  to={"/customer-mgmt/org/" + orgId + "/vendors"}
                  className={styles.rightNavContent}
                >
                  <div className={cx("mt-1", styles.rightNavTabs)}>
                    {t('translation_orgProfile:rightNav.l6')}
                    <span className={styles.AlignRight}>
                      <img src={right} alt={t('translation_orgProfile:image_alt_orgProfile.right')} />
                    </span>
                  </div>
                </Link>
              )}
            /> */}

            <hr className={styles.HorizontalLine} />
            <HasAccess
              permission={["EMP_MGMT:LIST"]}
              orgId={orgId}
              yes={() =>
                <React.Fragment>
                  <Link
                    to={"/customer-mgmt/org/" + orgId + "/employee?isActive=true"}
                    className={styles.rightNavContent}
                  >
                    <div className={cx("mt-1", styles.rightNavTabs)}>
                      {t('translation_orgProfile:rightNav.l4')}
                      <span className={styles.AlignRight}>
                        <img src={right} alt={t('translation_orgProfile:image_alt_orgProfile.right')} />
                      </span>
                    </div>
                  </Link>
                  <hr className={styles.HorizontalLine} />
                </React.Fragment>
              } />

          </div>

        </div>
      </React.Fragment>


    return (
      // <div>
      <RightNavBar content={RightNavContent}
        className={styles.show}
      />
      // </div>
    )
  }


}

export default withTranslation()(withRouter(connect(null, null)(OrgProfileRightNav)));
