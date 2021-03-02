import React from 'react';
import { withRouter } from "react-router";
import { withTranslation } from 'react-i18next';
import { connect } from "react-redux";
import _ from 'lodash';
import cx from 'classnames';
import styles from "./VendorNotifications.module.scss";
import left from '../../../../../assets/icons/left.svg';
import right from '../../../../../assets/icons/right.svg';
import Button from '../../../../../components/Atom/Button/Button';
import illustration from "../../../../../assets/icons/illustrator.svg";
import * as actions from '../Store/action';
import whiteBuilding from '../../../../../assets/icons/whiteBuilding.svg';
import themes from '../../../../../theme.scss';

class VendorNotifications extends React.Component {

    state = {
        notificationNumber: 0
    }

    componentDidMount = () => {
    }

    handleNotification = (value, clientData) => {
        const { match } = this.props;
        const orgId = match.params.uuid;
        let clientId = clientData.clientId;
        let count = this.state.notificationNumber;

        let payload = {
            orgId: '',
            vendorId: '',
            functions: [],
            locations: [],
            attachments: [],
            status: ''
        }

        if (!_.isEmpty(clientData)) {
            payload.orgId = clientData.clientId;
            payload.vendorId = clientData.orgId;
            payload.functions = [];
            payload.locations = [];
            payload.attachments = clientData.attachments ? clientData.attachments : [];
            payload.status = clientData.status;
        }

        if (value === 'approve') {
            payload.status = 'active';
        }
        else {
            payload.status = 'rejected';
        }

        if (count > 0) {
            count = count - 1;
        }

        this.props.getClientData(clientData);
        this.props.onPutNotification(payload, orgId, clientId);
        this.setState({ notificationNumber: count })
    }

    handleRedirect = (clientId) => {
        const { match } = this.props;
        const orgId = match.params.uuid;

        let clientProfileURL = `/customer-mgmt/org/${orgId}/vendors/${clientId}/clientprofile?filter=overall_insights`;
        this.props.history.push(clientProfileURL);
    }

    handleNotificationCard = (arrow) => {
        let count = this.state.notificationNumber;
        if (arrow === "right" && count < this.props.clientNotification.length - 1) {
            count += 1;
        }
        else if (count > 0 && arrow === "left") {
            count -= 1;
        }
        this.setState({ notificationNumber: count })
    }

    render() {

        let brandColor = themes.secondaryLabel;

        return (
            <React.Fragment>
                <div className={cx(styles.NotificationCard, "row no-gutters")}>
                    {this.props.putClientNotificationState === 'LOADING' || this.props.clientNotificationState === 'LOADING' ?
                        <React.Fragment>
                            <div className='col-12 px-0 align-self-center'>
                                <div className={cx('row justify-content-center', styles.NotificationMessage)}>
                                    please wait, notifications are loading...
                                </div>
                            </div>
                        </React.Fragment>
                        :
                        this.props.clientNotification && this.props.clientNotification.length > 0 && this.props.clientNotificationState === 'SUCCESS' ?
                            <React.Fragment>
                                <div className={cx(styles.Logo)} style={this.props.clientNotification[this.state.notificationNumber] && this.props.clientNotification[this.state.notificationNumber]['clientBrandColor'] ? { backgroundColor: this.props.clientNotification[this.state.notificationNumber]['clientBrandColor'] } : { backgroundColor: brandColor }}>
                                    <img src={whiteBuilding} style={{ height: '48px', marginTop: "25%" }} alt="logo" />
                                </div>
                                <div className='col-7 px-0 ml-4'>
                                    <div className='d-flex flex-column'>
                                        <span className={cx('mt-1', styles.Heading)}>vendor approval request from {this.props.clientNotification[this.state.notificationNumber]['clientName']}</span>
                                        <span className={cx('mt-1 mb-2', styles.Details)}>you have a new vendor request from {this.props.clientNotification[this.state.notificationNumber]['clientName']}</span>
                                        <span className={styles.BlueText} onClick={() => this.handleRedirect(this.props.clientNotification[this.state.notificationNumber]['clientId'])}><u>more details</u></span>
                                    </div>
                                </div>

                                <div className={styles.absoluteRight}>
                                    <img
                                        src={left}
                                        alt=''
                                        className={this.state.notificationNumber === 0 ? cx('ml-auto') : cx('ml-auto', styles.PaginatorActiveArrow)}
                                        onClick={this.state.notificationNumber > 0 ? () => this.handleNotificationCard("left") : null}
                                    />
                                    <span className={styles.PageCount}> {this.state.notificationNumber + 1} of {this.props.clientNotification.length}</span>
                                    <img
                                        src={right}
                                        alt=''
                                        className={this.state.notificationNumber === this.props.clientNotification.length - 1 ? null : styles.PaginatorActiveArrow}
                                        onClick={this.state.notificationNumber < this.props.clientNotification.length ? () => this.handleNotificationCard("right") : null}
                                    />
                                </div>

                                <div className='align-self-end'>
                                    <div className={styles.absoluteRightButton}>
                                        <div className='d-flex flex-row'>
                                            <Button
                                                type='ignore'
                                                className={styles.IgnoreButton}
                                                label='ignore'
                                                isDisabled={false}
                                                clickHandler={() => this.handleNotification('ignore', this.props.clientNotification[this.state.notificationNumber])}
                                            />
                                            <Button
                                                type='save'
                                                label='approve'
                                                isDisabled={false}
                                                clickHandler={() => this.handleNotification('approve', this.props.clientNotification[this.state.notificationNumber])}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <div className='col-4'>
                                    <img src={illustration} alt='' className='mt-1' width="197px" height="120px" />
                                </div>
                                <div className='col-8 align-self-center'>
                                    <div className={cx('ml-3', styles.NotificationMessage)}>
                                        you have no notifications yet
                                </div>
                                </div>
                            </React.Fragment>
                    }
                </div>
            </React.Fragment>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onPutNotification: (payload, orgId, clientId) => dispatch(actions.putNotification(payload, orgId, clientId))
    }
}

export default withTranslation()(withRouter(connect(null, mapDispatchToProps)(VendorNotifications)));