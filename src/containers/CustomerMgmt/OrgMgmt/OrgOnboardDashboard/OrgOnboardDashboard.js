import React, { Component } from 'react';
import { Route, NavLink } from 'react-router-dom';
import _ from 'lodash';
import cx from 'classnames';
import { connect } from "react-redux";

import insight from '../../../../assets/icons/active.svg';
import todo from "../../../../assets/icons/todo.svg"
import styles from "./OrgOnboardDashboard.module.scss";
import * as actions from './Store/action';

import ArrowLink from '../../../../components/Atom/ArrowLink/ArrowLink';
import Notifications, { NotificationIcon } from '../../Notifications/Notifications';
import HasAccess from '../../../../services/HasAccess/HasAccess';
import TimeFilter from '../../../../components/Organism/TimeFilter/TimeFilter';
import Insights from './Insights/Insights';
import ToDos from './ToDos/ToDos';


class OrgOnboardDashboard extends Component {

    state = {
        showNotifications: false
    }

    componentDidMount = () => {
        const { match } = this.props;
        const orgId = match.params.uuid;
        let query = _.cloneDeep(this.handleGetDuration());
        const section = this.props.location.pathname.split('/')[6];
        if(section === 'toDos'){
            query['todo'] = true;
        }
        this.props.onGetOrgDetailsById(orgId);
        this.props.onGetOrgConfig(orgId);
        this.props.onGetOnboardStats(orgId, query);
    }

    componentDidUpdate = (prevProps) => {
        const { match } = this.props;
        const orgId = match.params.uuid;

        if(prevProps.getOrgConfigState !== this.props.getOrgConfigState){
            if(this.props.getOrgConfigState === 'SUCCESS'){
                if(!_.isEmpty(this.props.enabledProducts)){
                    const thisRef = this;
                    _.forEach(this.props.enabledProducts, function(product){
                        if(product.product === 'BGV'){
                            thisRef.props.onGetOrgBgvConfig(orgId);

                            const query = _.cloneDeep(thisRef.handleGetDuration());
                            thisRef.props.onGetBgvStatus(orgId, query);
                        }
                    })
                }
            }
        }

        if(prevProps.location.pathname !== this.props.location.pathname){
            const section = this.props.location.pathname.split('/')[6];
            let query = _.cloneDeep(this.handleGetDuration());
            if(section === 'toDos'){
                query['todo'] = true;
            }
            this.props.onGetOnboardStats(orgId, query);
            if(section === 'insights'){
                if(!_.isEmpty(this.props.enabledProducts)){
                    const thisRef = this;
                    _.forEach(this.props.enabledProducts, function(product){
                        if(product.product === 'BGV'){
                            thisRef.props.onGetBgvStatus(orgId, query);
                        }
                    })
                }
                query['groupBy'] = 'MONTH';
            }
        }


        if (prevProps.location.search !== this.props.location.search) {
            const section = this.props.location.pathname.split('/')[6];
            let query = _.cloneDeep(this.handleGetDuration());
            if(section === 'toDos'){
                query['todo'] = true;
            }
            this.props.onGetOnboardStats(orgId, query);
            if(section === 'insights'){
                if(!_.isEmpty(this.props.enabledProducts)){
                    const thisRef = this;
                    _.forEach(this.props.enabledProducts, function(product){
                        if(product.product === 'BGV'){
                            thisRef.props.onGetBgvStatus(orgId, query);
                        }
                    })
                }
                query['groupBy'] = 'MONTH';
            }
        }
    }

    componentWillUnmount() {
        this.props.getInitState();
    }

    handleCloseNotificationCard = () => {
        this.setState({ showNotifications: !this.state.showNotifications })
    }


    handleSelectDuration = (value) => {
        let urlSearchParams = new URLSearchParams(window.location.search);
        let url = this.props.location.pathname;
        if(typeof(value) === 'object'){
            urlSearchParams.set("duration", "custom");
            urlSearchParams.set("from", value['from']);
            urlSearchParams.set("to", value['to']);
        }else{
            urlSearchParams.set("duration", value);
            urlSearchParams.delete("from");
            urlSearchParams.delete("to");
        }
        url = url + "?" + urlSearchParams.toString();
        this.props.history.push(url);
    }

    handleGetDuration = () => {
        let urlSearchParams = new URLSearchParams(window.location.search);
        let durationType = urlSearchParams.get("duration");
        
        let newDate = new Date();
        let today = new Date();
        let lastWeek = null;
        
        let duration = {};

        switch (durationType) {
            case 'last_week':
                lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
                newDate = this.formatDate(newDate);
                lastWeek = this.formatDate(lastWeek);
                duration = {
                    from: lastWeek,
                    to: newDate
                };
                return duration;

            case 'last_day':
                lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
                newDate = this.formatDate(newDate);
                lastWeek = this.formatDate(lastWeek);
                duration = {
                    from: lastWeek,
                    to: newDate
                };
                return duration;

            case 'last_month':
                lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
                newDate = this.formatDate(newDate);
                lastWeek = this.formatDate(lastWeek);
                duration = {
                    from: lastWeek,
                    to: newDate
                };
                return duration;

            case 'last_year':
                lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 365);
                newDate = this.formatDate(newDate);
                lastWeek = this.formatDate(lastWeek);
                duration = {
                    from: lastWeek,
                    to: newDate
                };
                return duration;

            case 'custom':
                duration = {
                    from: urlSearchParams.get("from"),
                    to: urlSearchParams.get("to")
                };
                return duration;

            default:
                return duration;

        }

    }

    formatDate = (date) => {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    handleGetNavLink = (section) => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const { match } = this.props;
        let url = match.url + '/' + section;
        url = url + "?" + urlSearchParams.toString();
        return url;
    }

    render() {
        const { match } = this.props;
        const orgId = match.params.uuid;
        const orgName = _.isEmpty(this.props.orgData) ? '' : this.props.orgData.name;
        
        const searchParams = new URLSearchParams(window.location.search);
        let duration = searchParams.get("duration");
        if(duration === 'custom'){
            duration = {};
            duration['from'] = searchParams.get("from");
            duration['to'] = searchParams.get("to");
        }

        return (
            <React.Fragment>
                <div className={cx(styles.alignCenter)}>
                    <div style={{ width: 'max-content' }}>
                        <ArrowLink
                            label={orgName}
                            url={`/customer-mgmt/org/${orgId}/profile`}
                        />
                    </div>

                    <div className={cx('mx-0 px-0 row mt-2')}>
                        <div className={cx(' px-0', styles.column5, styles.OrgName, styles.wordBreak)}>{orgName ? orgName.toLowerCase() : ''}</div>
                        <div className="ml-auto d-flex mr-2">

                            <TimeFilter
                                onChange={(value) => this.handleSelectDuration(value)}
                                value={duration}
                            />

                            <HasAccess
                                permission={["NOTIFICATIONS:VIEW"]}
                                orgId={orgId}
                                yes={() =>
                                    <NotificationIcon
                                        showNotifications={this.state.showNotifications}
                                        orgId={orgId}
                                        handleShowHideNotifications={(showNotifications) => this.setState({ showNotifications: showNotifications })}
                                        // bellIconContent={styles.alignBellIcon}
                                    />
                                }
                            />

                        </div>
                    </div>
                    {
                        this.state.showNotifications ?

                            <div className={styles.width} >
                                <Notifications
                                    showNotifications={this.state.showNotifications}
                                    orgId={orgId}
                                    style={{ width: 'inherit' }}
                                />
                            </div>
                            :
                            null
                    }
                    <React.Fragment>
                        <div className="row  mt-2 px-3">
                            <div className={cx('pl-0 mr-5 ')}>
                                <NavLink to={this.handleGetNavLink('insights')}
                                    activeClassName={cx(styles.NavLinkfontActive)}
                                    isActive={(match, location) => {
                                        if (!match) {
                                            return false;
                                        }
                                        const pathname = location.pathname;
                                        return match.isExact && pathname.split('/')[6] === 'insights';
                                    }}>
                                    <button className={styles.NavLinkfont}>
                                        <span className={styles.svg}>
                                            <img src={insight} alt={"insight"} />
                                            <span>&nbsp; insights</span>
                                        </span>
                                    </button>
                                </NavLink>
                            </div>
                            <div className={cx('pl-0 mr-5 ')}>
                                <NavLink to={this.handleGetNavLink('toDos')}
                                    activeClassName={cx(styles.NavLinkfontActive)}
                                    isActive={(match, location) => {
                                        if (!match) {
                                            return false;
                                        }
                                        const pathname = location.pathname;
                                        return match.isExact && pathname.split('/')[6] === 'toDos';
                                    }}>
                                    <button className={styles.NavLinkfont}>
                                        <span className={styles.svg}>
                                            <img src={todo} alt={"todos"} />
                                            <span>&nbsp; todo's</span>
                                        </span>
                                    </button>
                                </NavLink>
                            </div>
                        </div>
                        <hr className={cx(styles.hr1)} />
                    </React.Fragment>
                </div>

                <div className={styles.scrollContent}>
                    <Route path={`${match.path}/insights`} component={Insights} />
                    <Route path={`${match.path}/toDos`} component={ToDos} />
                </div>

            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        getOrgConfigState: state.orgMgmt.orgOnboardDashboard.getOrgConfigState,
        orgData: state.orgMgmt.orgOnboardDashboard.orgData,
        enabledProducts: state.orgMgmt.orgOnboardDashboard.enabledProducts
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getInitState: () => dispatch(actions.getInitState()),
        onGetOrgDetailsById: (orgId) => dispatch(actions.getOrgProfile(orgId)),
        onGetOrgConfig: (orgId) => dispatch(actions.getOrgConfig(orgId)),
        onGetOrgBgvConfig: (orgId) => dispatch(actions.getOrgBgvConfig(orgId)),
        onGetBgvStatus: (orgId, query) => dispatch(actions.postBgvStatus(orgId, query)),
        onGetOnboardStats: (orgId, query) => dispatch(actions.getOnboardStats(orgId, query))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgOnboardDashboard);