import React, { Component } from 'react';
import styles from './VendorRow.module.scss';
import cx from 'classnames';
import { withRouter } from "react-router";
import { withTranslation } from 'react-i18next';
import inprogress from '../../../../../assets/icons/inprogress.svg';
import empFolder from '../../../../../assets/icons/empFolder.svg';
import roleFolder from '../../../../../assets/icons/roleFolder.svg';
import siteFolder from '../../../../../assets/icons/siteFolder.svg';
import Button from '../../../../../components/Atom/Button/Button';

class VendorRow extends Component {

    render() {
        return (
            <div className="row no-gutters my-4">

                <div className={styles.Logo}>
                    <img src={this.props.icon} alt="vendor" />
                </div>

                <div className="d-flex flex-column ml-4 pl-2">
                    <div className="row">
                        <span className={styles.VendorName}>{this.props.vendorName}</span>

                        {this.props.awaitingApproval ?
                            <span>
                                <img style={{ width: "13px", marginRight: "10px" }} src={inprogress} alt="waitingIcon" />
                                <span className={styles.Approval}>awaiting approval</span>
                            </span>
                            : null}
                    </div>

                    <div className="row mt-2">
                        <img src={siteFolder} alt="folder" />
                        <span className={cx(styles.Folder, "ml-2 mr-4")}>{this.props.locations} sites</span>
                        <img src={roleFolder} alt="folder" />
                        <span className={cx(styles.Folder, "ml-2 mr-4")}>{this.props.roles} roles</span>
                        <img src={empFolder} alt="folder" />
                        <span className={cx(styles.Folder, "ml-2")}>{this.props.employees} employees</span>
                    </div>

                </div>

                <span className='ml-auto mt-1'>
                    <Button
                        label='view details'
                        type='secondaryButtonWithArrow'
                        className={styles.buttonHover}
                        isDisabled={false}
                        clickHandler={this.handleRedirect}
                    />
                </span>

            </div>
        )
    }
}

export default withTranslation()(withRouter(VendorRow));